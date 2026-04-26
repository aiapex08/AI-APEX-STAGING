import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { XR, createXRStore } from '@react-three/xr'
import { useGLTF, Environment, OrbitControls } from '@react-three/drei'
import { useState, Suspense, useRef, useEffect, useMemo, useCallback } from 'react'
import * as THREE from 'three'

// ── XR store (WebXR session manager) ──────────────────────────────
const store = createXRStore()

// ── Catalogue ─────────────────────────────────────────────────────
const DOORS = [
  { id: 1, name: 'Access Door',          file: '/door/Access_door.glb' },
  { id: 2, name: 'Blast Door',           file: '/door/Blast_Door.glb' },
  { id: 3, name: 'Fire Frame',           file: '/door/Fire_Frame.glb' },
  { id: 4, name: 'Honey Comb Door',      file: '/door/Honey_Comb_Door.glb' },
  { id: 5, name: 'SR2 Door',             file: '/door/SR2_Door.glb' },
  { id: 6, name: 'SR3 Door',             file: '/door/SR3_Door.glb' },
  { id: 7, name: 'SR4 Door',             file: '/door/SR4_Door.glb' },
  { id: 8, name: 'Steel Stiffened Door', file: '/door/steel_stiffened_door.glb' },
  { id: 9, name: 'TRR Door',             file: '/door/TRR_Door.glb' },
]
DOORS.forEach(d => useGLTF.preload(d.file))

// ── Detect mobile / tablet (AR is only for these) ─────────────────
function useIsMobileTablet() {
  const [yes, setYes] = useState(false)
  useEffect(() => {
    const ua  = navigator.userAgent
    const ipad   = /iPad/i.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
    const mobile = /Android|iPhone|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(ua)
    setYes(ipad || mobile)
  }, [])
  return yes
}

// ── DoorModel — auto-scales to 9 ft (2.7432 m) ───────────────────
function DoorModel({ file, position = [0, 0, 0], rotY = 0 }) {
  const { scene } = useGLTF(file)
  const model = useMemo(() => {
    const clone = scene.clone(true)
    const box  = new THREE.Box3().setFromObject(clone)
    const size = new THREE.Vector3()
    box.getSize(size)
    if (size.y > 0.01) clone.scale.setScalar(2.7432 / size.y)
    const box2 = new THREE.Box3().setFromObject(clone)
    clone.position.y = -box2.min.y          // bottom on y = 0
    return clone
  }, [scene])

  return (
    <group position={position} rotation={[0, rotY, 0]}>
      <primitive object={model} />
    </group>
  )
}

// ── Animated scan-line (camera-only mode) ─────────────────────────
function ScanPlane() {
  const ref = useRef()
  useFrame(({ clock }) => {
    if (ref.current) ref.current.position.y = 1.4 + Math.sin(clock.elapsedTime * 1.8) * 1.3
  })
  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -3.5]}>
      <planeGeometry args={[5, 0.014]} />
      <meshBasicMaterial color="#00cfff" transparent opacity={0.7} />
    </mesh>
  )
}

// ── WebXR hit-test reticle — attaches to detected surfaces ────────
// Uses raw WebXR API (requestHitTestSource) because @react-three/xr v6
// does not export useHitTest.
function XRHitTestPlacer({ onPlace }) {
  const { gl }        = useThree()
  const reticle       = useRef()
  const posRef        = useRef(new THREE.Vector3())
  const hasHit        = useRef(false)
  const hitSrcRef     = useRef(null)   // XRHitTestSource
  const selectAttached = useRef(false)
  const _mat          = useRef(new THREE.Matrix4())
  const _pos          = useRef(new THREE.Vector3())
  const _quat         = useRef(new THREE.Quaternion())
  const _scale        = useRef(new THREE.Vector3())

  useFrame((_, __, xrFrame) => {
    const session = gl.xr.getSession()
    if (!session) return

    // Attach select listener once
    if (!selectAttached.current) {
      selectAttached.current = true
      session.addEventListener('select', () => {
        if (hasHit.current) onPlace(posRef.current.clone())
      })
    }

    // Request hit-test source once
    if (!hitSrcRef.current) {
      session.requestReferenceSpace('viewer').then(viewerSpace => {
        session.requestHitTestSource({ space: viewerSpace }).then(src => {
          hitSrcRef.current = src
        }).catch(() => {})
      }).catch(() => {})
      return
    }

    if (!xrFrame) return
    const refSpace = gl.xr.getReferenceSpace()
    if (!refSpace) return

    const hits = xrFrame.getHitTestResults(hitSrcRef.current)
    if (hits.length === 0) { hasHit.current = false; return }

    const pose = hits[0].getPose(refSpace)
    if (!pose) return

    _mat.current.fromArray(pose.transform.matrix)
    _mat.current.decompose(_pos.current, _quat.current, _scale.current)
    posRef.current.copy(_pos.current)
    hasHit.current = true

    if (reticle.current) {
      reticle.current.visible = true
      reticle.current.position.copy(_pos.current)
    }
  })

  return (
    <group ref={reticle} visible={false}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.09, 0.14, 40]} />
        <meshBasicMaterial color="#00cfff" transparent opacity={0.9} side={THREE.DoubleSide} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.025, 20]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.7} />
      </mesh>
    </group>
  )
}

// ── Gyro camera — rotates Three.js camera from DeviceOrientation ──
// The door stays at a fixed world position; the camera rotates around it.
function GyroCamera({ active, orientRef, alphaOffsetRef }) {
  const { camera } = useThree()
  const _euler = useRef(new THREE.Euler())
  const _q0    = useRef(new THREE.Quaternion())
  const _q1    = useRef(new THREE.Quaternion(-Math.sqrt(0.5), 0, 0, Math.sqrt(0.5)))
  const _zee   = useRef(new THREE.Vector3(0, 0, 1))

  useFrame(() => {
    if (!active || !orientRef.current) return
    const { alpha, beta, gamma } = orientRef.current
    if (alpha == null) return
    const a = alpha - (alphaOffsetRef.current ?? alpha)
    _euler.current.set(
      THREE.MathUtils.degToRad(beta  ?? 0),
      THREE.MathUtils.degToRad(a),
      THREE.MathUtils.degToRad(-(gamma ?? 0)),
      'YXZ',
    )
    camera.quaternion.setFromEuler(_euler.current)
    camera.quaternion.multiply(_q1.current)
    const ang = (window.screen?.orientation?.angle ?? 0) * (Math.PI / 180)
    camera.quaternion.multiply(_q0.current.setFromAxisAngle(_zee.current, -ang))
  })
  return null
}

// ── Styles ────────────────────────────────────────────────────────
const CSS = `
  @keyframes ar-spin   { to { transform:rotate(360deg) } }
  @keyframes ar-fade   { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
  @keyframes ar-scan   { 0%{top:16%} 50%{top:75%} 100%{top:16%} }
  @keyframes ar-ring   { 0%{transform:scale(1);opacity:.85} 100%{transform:scale(2.6);opacity:0} }
  @keyframes ar-dot    { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.3;transform:scale(.55)} }

  .ar-corner{position:absolute;width:26px;height:26px;border-color:#00cfff;border-style:solid;opacity:.9}
  .ar-tl{top:12px;left:12px;border-width:3px 0 0 3px}
  .ar-tr{top:12px;right:12px;border-width:3px 3px 0 0}
  .ar-bl{bottom:12px;left:12px;border-width:0 0 3px 3px}
  .ar-br{bottom:12px;right:12px;border-width:0 3px 3px 0}

  .ar-scanline{
    position:absolute;left:8%;right:8%;height:2px;
    background:linear-gradient(90deg,transparent,#00cfff,transparent);
    box-shadow:0 0 14px #00cfff;
    animation:ar-scan 2.4s ease-in-out infinite;
  }
  .ar-grid{
    position:absolute;inset:0;pointer-events:none;
    background-image:radial-gradient(circle,rgba(0,207,255,.15) 1px,transparent 1px);
    background-size:30px 30px;
  }
  .ar-badge{
    position:absolute;top:64px;left:50%;transform:translateX(-50%);
    background:rgba(0,0,0,.58);backdrop-filter:blur(8px);
    border:1px solid rgba(0,207,255,.35);border-radius:100px;
    padding:6px 18px;font-size:11px;font-weight:600;
    letter-spacing:.12em;text-transform:uppercase;color:#00cfff;
    white-space:nowrap;animation:ar-fade .3s ease;z-index:30;
  }
  .ar-badge-ok{
    position:absolute;top:64px;left:50%;transform:translateX(-50%);
    background:rgba(0,160,80,.20);backdrop-filter:blur(8px);
    border:1px solid rgba(0,210,100,.40);border-radius:100px;
    padding:6px 18px;font-size:11px;font-weight:600;
    letter-spacing:.10em;text-transform:uppercase;color:#4ade80;
    white-space:nowrap;animation:ar-fade .3s ease;z-index:30;
  }
  .ar-spinner{
    position:absolute;top:68px;right:16px;z-index:30;
    width:20px;height:20px;border-radius:50%;
    border:2px solid rgba(0,207,255,.2);border-top-color:#00cfff;
    animation:ar-spin .8s linear infinite;
  }
  .ar-reticle-wrap{
    position:absolute;bottom:22%;left:50%;transform:translateX(-50%);
    display:flex;flex-direction:column;align-items:center;gap:14px;
    animation:ar-fade .4s ease both;cursor:pointer;
  }
  .ar-ring-outer{
    width:80px;height:80px;border-radius:50%;
    border:2px solid rgba(0,207,255,.5);
    display:flex;align-items:center;justify-content:center;position:relative;
  }
  .ar-ring-outer::before,.ar-ring-outer::after{
    content:'';position:absolute;inset:0;border-radius:50%;
    border:2px solid #00cfff;animation:ar-ring 1.9s ease-out infinite;
  }
  .ar-ring-outer::after{animation-delay:.95s}
  .ar-ring-dot{
    width:11px;height:11px;border-radius:50%;
    background:#00cfff;box-shadow:0 0 8px #00cfff;
    animation:ar-dot 1.4s ease-in-out infinite;
  }
  .ar-tap-label{
    font-size:11px;font-weight:600;letter-spacing:.16em;
    text-transform:uppercase;color:rgba(255,255,255,.88);
    text-shadow:0 1px 10px rgba(0,0,0,.9);
  }
  .ar-hint{
    position:absolute;bottom:148px;left:50%;transform:translateX(-50%);
    font-size:11px;color:rgba(255,255,255,.42);letter-spacing:.10em;
    white-space:nowrap;pointer-events:none;animation:ar-fade .5s ease both;z-index:30;
  }
`

// ── Main ──────────────────────────────────────────────────────────
export default function ARScene() {
  const [selected, setSelected] = useState(DOORS[7])
  // phase: preview | xr-scan | cam-scan | cam-ready | placed
  const [phase, setPhase]   = useState('preview')
  const [arMode, setArMode] = useState('none')   // 'none' | 'webxr' | 'camera'
  const [placedPos, setPlacedPos] = useState(null)
  const [hasGyro, setHasGyro]     = useState(false)
  const [rotY, setRotY]           = useState(0)
  const [camError, setCamError]   = useState('')

  const isMobileTablet = useIsMobileTablet()

  const videoRef       = useRef(null)
  const streamRef      = useRef(null)
  const timerRef       = useRef(null)
  const orientRef      = useRef(null)
  const alphaOffsetRef = useRef(null)
  const dragRef        = useRef({ on: false, x: 0, rot: 0 })

  const isPlaced  = phase === 'placed'
  const isAR      = arMode !== 'none'
  const isWebXR   = arMode === 'webxr'
  const isCamAR   = arMode === 'camera'

  // ── Check WebXR AR support ─────────────────────────────────────
  const supportsWebXR = useCallback(async () => {
    try { return !!(await navigator.xr?.isSessionSupported('immersive-ar')) }
    catch { return false }
  }, [])

  // ── Gyro listener ─────────────────────────────────────────────
  const startGyro = useCallback(async () => {
    if (typeof DeviceOrientationEvent?.requestPermission === 'function') {
      try { await DeviceOrientationEvent.requestPermission() } catch { /* denied */ }
    }
    const fn = (e) => { if (e.alpha != null) orientRef.current = e }
    window.addEventListener('deviceorientation', fn, true)
    setTimeout(() => { if (orientRef.current?.alpha != null) setHasGyro(true) }, 600)
    return () => window.removeEventListener('deviceorientation', fn, true)
  }, [])

  // ── Camera-only AR ────────────────────────────────────────────
  const startCameraAR = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' }, width: { ideal: 1920 }, height: { ideal: 1080 } },
        audio: false,
      })
      streamRef.current = stream
      if (videoRef.current) { videoRef.current.srcObject = stream; await videoRef.current.play() }
      streamRef._stopGyro = await startGyro()
      setArMode('camera')
      setPhase('cam-scan')
      timerRef.current = setTimeout(() => setPhase('cam-ready'), 2800)
    } catch (err) {
      setCamError(
        err.name === 'NotAllowedError'
          ? 'Camera permission denied. Allow camera in your browser settings.'
          : 'Cannot open camera: ' + err.message,
      )
    }
  }, [startGyro])

  // ── Enter AR (try WebXR first, fall back to camera) ───────────
  const startAR = useCallback(async () => {
    setCamError('')
    if (await supportsWebXR()) {
      setArMode('webxr')
      setPhase('xr-scan')
      try { await store.enterAR() }
      catch { setArMode('none'); setPhase('preview'); startCameraAR() }
    } else {
      startCameraAR()
    }
  }, [supportsWebXR, startCameraAR])

  // ── Exit AR ───────────────────────────────────────────────────
  const exitAR = useCallback(() => {
    clearTimeout(timerRef.current)
    streamRef.current?.getTracks().forEach(t => t.stop())
    streamRef._stopGyro?.()
    streamRef.current = null
    orientRef.current = null
    alphaOffsetRef.current = null
    setArMode('none'); setPhase('preview')
    setPlacedPos(null); setRotY(0); setHasGyro(false); setCamError('')
  }, [])

  // ── Place door (WebXR) ────────────────────────────────────────
  const handleWebXRPlace = useCallback((pos) => {
    setPlacedPos(pos); setPhase('placed')
  }, [])

  // ── Place door (camera mode) ──────────────────────────────────
  const handleCamPlace = useCallback(() => {
    alphaOffsetRef.current = orientRef.current?.alpha ?? null
    setPlacedPos(new THREE.Vector3(0, 0, -3.5))
    setPhase('placed')
  }, [])

  // ── Replace ───────────────────────────────────────────────────
  const handleReplace = () => {
    setPlacedPos(null); alphaOffsetRef.current = null
    if (isWebXR) { setPhase('xr-scan') }
    else { setPhase('cam-scan'); timerRef.current = setTimeout(() => setPhase('cam-ready'), 1800) }
  }

  // ── Switch door ───────────────────────────────────────────────
  const selectDoor = (door) => {
    setSelected(door)
    if (isPlaced) {
      setPlacedPos(null); alphaOffsetRef.current = null
      setPhase(isWebXR ? 'xr-scan' : 'cam-ready')
    }
  }

  // Auto-start AR on mobile/tablet when entering from HomeScreen
  useEffect(() => {
    let cancelled = false
    if (isMobileTablet) {
      startAR().catch(() => {})
    }
    return () => { cancelled = true }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobileTablet])

  useEffect(() => () => {
    clearTimeout(timerRef.current)
    streamRef.current?.getTracks().forEach(t => t.stop())
    streamRef._stopGyro?.()
  }, [])

  // ── Desktop drag → rotate door (no gyro) ─────────────────────
  const onPD = (e) => { if (isPlaced && !hasGyro && !isWebXR) dragRef.current = { on: true, x: e.clientX, rot: rotY } }
  const onPM = (e) => { if (dragRef.current.on) setRotY(dragRef.current.rot + (e.clientX - dragRef.current.x) * 0.008) }
  const onPU = () => { dragRef.current.on = false }

  // ── Status label ──────────────────────────────────────────────
  const headerLabel = phase === 'preview'   ? 'Drag to rotate • Pinch to zoom'
    : phase === 'xr-scan'  ? 'Scanning surfaces…'
    : phase === 'cam-scan' ? 'Detecting floor & walls…'
    : phase === 'cam-ready'? 'Surface detected'
    : hasGyro || isWebXR   ? 'Move device to look around'
    : 'Drag to rotate door'

  return (
    <div
      style={{ width:'100vw', height:'100vh', position:'relative', background:'#0a0a0a',
        fontFamily:"'Inter',sans-serif", overflow:'hidden', userSelect:'none' }}
      onPointerDown={onPD} onPointerMove={onPM} onPointerUp={onPU}
    >
      <style>{CSS}</style>

      {/* Camera feed (camera-only AR) */}
      <video ref={videoRef} playsInline muted style={{
        position:'absolute', inset:0, width:'100%', height:'100%',
        objectFit:'cover', zIndex:0, display: isCamAR ? 'block' : 'none',
      }} />

      {/* ── 3D Canvas ── */}
      <Canvas
        camera={{ position:[0, 1.5, 5], fov:65 }}
        style={{ position:'absolute', inset:0, zIndex:1 }}
        gl={{ alpha:true, antialias:true }}
      >
        <XR store={store}>
          <ambientLight intensity={isAR ? 1.4 : 0.7} />
          <directionalLight position={[4, 6, 4]} intensity={isAR ? 0.8 : 1.2} />
          {!isAR && <Environment preset="apartment" />}

          {/* Gyro: rotates camera so door appears pinned in place */}
          <GyroCamera
            active={isCamAR && isPlaced && hasGyro}
            orientRef={orientRef}
            alphaOffsetRef={alphaOffsetRef}
          />

          <Suspense fallback={null}>
            {/* Preview 3D viewer */}
            {phase === 'preview' && (
              <>
                <DoorModel file={selected.file} position={[0, 0, -1]} rotY={0.25} />
                <OrbitControls target={[0, 1.37, -1]} minDistance={1.5} maxDistance={8} />
              </>
            )}

            {/* WebXR: surface reticle + tap-to-place */}
            {isWebXR && !isPlaced && <XRHitTestPlacer onPlace={handleWebXRPlace} />}

            {/* Camera mode: scanning animation */}
            {phase === 'cam-scan' && <ScanPlane />}

            {/* Door placed — fixed world position, camera moves around it */}
            {isPlaced && placedPos && (
              <DoorModel
                file={selected.file}
                position={[placedPos.x, placedPos.y, placedPos.z]}
                rotY={!isWebXR && !hasGyro ? rotY : 0}
              />
            )}
          </Suspense>
        </XR>
      </Canvas>

      {/* ═══ SCANNING OVERLAY ═══ */}
      {(phase === 'xr-scan' || phase === 'cam-scan') && (
        <div style={{ position:'absolute', inset:0, zIndex:10, pointerEvents:'none' }}>
          <div className="ar-grid" />
          <div className="ar-corner ar-tl" /><div className="ar-corner ar-tr" />
          <div className="ar-corner ar-bl" /><div className="ar-corner ar-br" />
          <div className="ar-scanline" />
        </div>
      )}

      {/* ═══ READY: tap-to-place reticle (camera mode) ═══ */}
      {phase === 'cam-ready' && (
        <>
          <div style={{ position:'absolute', inset:0, zIndex:5, pointerEvents:'none',
            backgroundImage:'radial-gradient(circle,rgba(0,207,255,.07) 1px,transparent 1px)',
            backgroundSize:'28px 28px' }} />
          <div style={{ position:'absolute', inset:0, zIndex:12 }}>
            <div className="ar-corner ar-tl" /><div className="ar-corner ar-tr" />
            <div className="ar-corner ar-bl" /><div className="ar-corner ar-br" />
            <div className="ar-reticle-wrap" onClick={handleCamPlace}>
              <div className="ar-ring-outer"><div className="ar-ring-dot" /></div>
              <div className="ar-tap-label">Tap to pin door</div>
            </div>
          </div>
        </>
      )}

      {/* ═══ WebXR ready: hint (reticle is in 3D scene) ═══ */}
      {phase === 'xr-scan' && (
        <div style={{ position:'absolute', bottom:'24%', left:'50%', transform:'translateX(-50%)',
          zIndex:20, color:'rgba(255,255,255,.7)', fontSize:12, letterSpacing:'.12em',
          textTransform:'uppercase', textAlign:'center', textShadow:'0 1px 8px rgba(0,0,0,.9)',
          animation:'ar-fade .4s ease', pointerEvents:'none' }}>
          Move device slowly over floor or wall<br/>then tap the ring to place
        </div>
      )}

      {/* ═══ HEADER ═══ */}
      <div style={{ position:'absolute', top:0, left:0, right:0, zIndex:30,
        padding:'13px 18px', background:'rgba(0,0,0,.60)', backdropFilter:'blur(10px)',
        display:'flex', alignItems:'center', gap:10 }}>
        <span style={{ color:'#fff', fontWeight:700, fontSize:16 }}>🚪 NAFFCO AR Viewer</span>
        <span style={{ marginLeft:'auto', color:'rgba(255,255,255,.38)', fontSize:11, letterSpacing:'.05em' }}>
          {headerLabel}
        </span>
      </div>

      {/* Status badges */}
      {(phase === 'xr-scan' || phase === 'cam-scan') && (
        <><div className="ar-badge">📡 Scanning floor &amp; walls…</div><div className="ar-spinner" /></>
      )}
      {phase === 'cam-ready' && <div className="ar-badge">✓ Surface detected — tap ring to place</div>}
      {isPlaced && <div className="ar-badge-ok">📌 Door pinned — 9 ft</div>}
      {isPlaced && !hasGyro && !isWebXR && (
        <div className="ar-hint">← Drag to rotate door →</div>
      )}

      {/* Camera error */}
      {camError && (
        <div style={{ position:'absolute', top:72, left:'50%', transform:'translateX(-50%)', zIndex:40,
          background:'rgba(180,20,20,.88)', backdropFilter:'blur(8px)', color:'#fff',
          padding:'10px 20px', borderRadius:10, fontSize:13, maxWidth:'80vw',
          textAlign:'center', lineHeight:1.5 }}>
          {camError}
        </div>
      )}

      {/* ═══ ACTION BUTTONS ═══ */}
      <div style={{ position:'absolute', bottom:138, left:'50%', transform:'translateX(-50%)',
        zIndex:30, display:'flex', gap:10 }}>


        {isPlaced && (
          <>
            <button onClick={handleReplace} style={{
              padding:'10px 20px', background:'rgba(255,255,255,.12)', color:'#fff',
              border:'1px solid rgba(255,255,255,.25)', borderRadius:24,
              fontSize:13, fontWeight:600, cursor:'pointer' }}>
              🔄 Replace
            </button>
            <button onClick={exitAR} style={{
              padding:'10px 20px', background:'rgba(255,255,255,.06)',
              color:'rgba(255,255,255,.65)', border:'1px solid rgba(255,255,255,.14)',
              borderRadius:24, fontSize:13, cursor:'pointer' }}>
              ✕ Exit
            </button>
          </>
        )}

        {(phase === 'xr-scan' || phase === 'cam-scan' || phase === 'cam-ready') && (
          <button onClick={exitAR} style={{
            padding:'9px 20px', background:'rgba(255,255,255,.07)',
            color:'rgba(255,255,255,.58)', border:'1px solid rgba(255,255,255,.14)',
            borderRadius:24, fontSize:13, cursor:'pointer' }}>
            ✕ Cancel
          </button>
        )}
      </div>

      {/* ═══ PRODUCT PICKER ═══ */}
      <div style={{ position:'absolute', bottom:0, left:0, right:0, zIndex:30,
        padding:'12px', background:'rgba(0,0,0,.82)', backdropFilter:'blur(12px)',
        display:'flex', gap:8, overflowX:'auto', scrollbarWidth:'none' }}>
        {DOORS.map(door => (
          <button
            key={door.id}
            onClick={() => selectDoor(door)}
            style={{
              flexShrink:0, padding:'7px 14px', borderRadius:20, fontSize:12,
              border: selected.id === door.id ? '2px solid #e63946' : '1px solid rgba(255,255,255,.18)',
              background: selected.id === door.id ? 'rgba(230,57,70,.22)' : 'rgba(255,255,255,.06)',
              color:'#fff', fontWeight: selected.id === door.id ? 700 : 400,
              cursor:'pointer', whiteSpace:'nowrap',
            }}
          >
            {door.name}
          </button>
        ))}
      </div>
    </div>
  )
}
