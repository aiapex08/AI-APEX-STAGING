import { Canvas } from '@react-three/fiber'
import { useGLTF, Environment, OrbitControls } from '@react-three/drei'
import { useState, Suspense, useRef, useEffect } from 'react'

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

function DoorModel({ file }) {
  const { scene } = useGLTF(file)
  const clone = scene.clone()
  return (
    <primitive
      object={clone}
      position={[0, -1, -2]}
      rotation={[0, 0.3, 0]}
      scale={1}
    />
  )
}

export default function ARScene() {
  const [selected, setSelected] = useState(DOORS[7])
  const [arMode, setArMode]     = useState(false)
  const [camError, setCamError] = useState('')
  const videoRef  = useRef(null)
  const streamRef = useRef(null)

  const startCamera = async () => {
    setCamError('')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }
      setArMode(true)
    } catch (err) {
      setCamError(
        err.name === 'NotAllowedError'
          ? 'Camera permission denied. Please allow camera access and try again.'
          : 'Could not open camera: ' + err.message
      )
    }
  }

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach(t => t.stop())
    streamRef.current = null
    setArMode(false)
  }

  // clean up stream on unmount
  useEffect(() => () => { streamRef.current?.getTracks().forEach(t => t.stop()) }, [])

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', background: '#111' }}>

      {/* ── Camera feed background (AR mode) ── */}
      <video
        ref={videoRef}
        playsInline
        muted
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          objectFit: 'cover',
          display: arMode ? 'block' : 'none',
          zIndex: 0,
        }}
      />

      {/* ── 3D Canvas ── */}
      <Canvas
        camera={{ position: [0, 1.5, 3], fov: 60 }}
        style={{ position: 'absolute', inset: 0, zIndex: 1, background: arMode ? 'transparent' : 'transparent' }}
        gl={{ alpha: true, clearColor: [0, 0, 0, 0] }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[3, 5, 3]} intensity={1.2} castShadow />
        {!arMode && <Environment preset="apartment" />}

        <Suspense fallback={null}>
          <DoorModel file={selected.file} />
        </Suspense>

        <OrbitControls target={[0, 0, -2]} />
      </Canvas>

      {/* ── Header ── */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10,
        padding: '14px 20px',
        background: 'rgba(0,0,0,0.55)',
        backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <div style={{ color: '#fff', fontWeight: 700, fontSize: 18 }}>🚪 NAFFCO Door Viewer</div>
        <div style={{ color: '#aaa', fontSize: 13, marginLeft: 'auto' }}>
          {arMode ? 'Camera active — drag to rotate model' : 'Drag to rotate • Pinch to zoom'}
        </div>
      </div>

      {/* ── Camera error ── */}
      {camError && (
        <div style={{
          position: 'absolute', top: 72, left: '50%', transform: 'translateX(-50%)',
          zIndex: 20, background: 'rgba(180,20,20,0.85)', color: '#fff',
          padding: '10px 20px', borderRadius: 10, fontSize: 13,
          maxWidth: '80vw', textAlign: 'center',
        }}>
          {camError}
        </div>
      )}

      {/* ── AR / Exit button ── */}
      <div style={{
        position: 'absolute', bottom: 140, left: '50%',
        transform: 'translateX(-50%)', zIndex: 20,
      }}>
        {!arMode ? (
          <button
            onClick={startCamera}
            style={{
              padding: '13px 32px',
              background: '#e63946', color: '#fff',
              border: 'none', borderRadius: 30,
              fontSize: 15, fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 4px 20px rgba(230,57,70,0.5)',
            }}
          >
            📷 View in Your Room (AR)
          </button>
        ) : (
          <button
            onClick={stopCamera}
            style={{
              padding: '10px 24px',
              background: 'rgba(255,255,255,0.15)', color: '#fff',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: 20, fontSize: 14, cursor: 'pointer',
            }}
          >
            ✕ Exit Camera
          </button>
        )}
      </div>

      {/* ── Product picker strip ── */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 10,
        padding: '14px 12px',
        background: 'rgba(0,0,0,0.75)',
        backdropFilter: 'blur(10px)',
        display: 'flex', gap: 10, overflowX: 'auto',
        scrollbarWidth: 'none',
      }}>
        {DOORS.map(door => (
          <button
            key={door.id}
            onClick={() => setSelected(door)}
            style={{
              flexShrink: 0,
              padding: '8px 16px',
              borderRadius: 20,
              border: selected.id === door.id
                ? '2px solid #e63946'
                : '1px solid rgba(255,255,255,0.2)',
              background: selected.id === door.id
                ? 'rgba(230,57,70,0.25)'
                : 'rgba(255,255,255,0.07)',
              color: '#fff',
              fontSize: 13,
              fontWeight: selected.id === door.id ? 700 : 400,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            {door.name}
          </button>
        ))}
      </div>

    </div>
  )
}
