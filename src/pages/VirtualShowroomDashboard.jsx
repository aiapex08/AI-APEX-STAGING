import React, { useState, Suspense, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  OrbitControls, 
  Stage, 
  PerspectiveCamera, 
  useGLTF, 
  MeshReflectorMaterial, 
  Environment,
  Center,
  Text 
} from '@react-three/drei';
import * as THREE from 'three';

// --- CURTAIN CONFIGURATION ---
const curtainsList = [
  { id: 'Accordion_Curtain', label: 'Accordion Curtain'},
  { id: 'Egress_Curtain', label: 'Egress Curtain' },
  { id: 'Draft_Curtain', label: 'Draft Curtain' },
  { id: 'Fire_Curtain', label: 'Fire Curtain' }, 
  { id: 'Smoke_Curtain', label: 'Smoke Curtain' }
];

// --- DOOR CONFIGURATION ---
const doorsList = [
  { id: 'Blast_Door', label: 'Blast Door', cat: 'Structural Security',
    color: ['#2a3a5c','#1a2540','#3a4a6c'],
    desc: 'Engineered to withstand extreme pressure and explosive forces. Ideal for military, industrial, and high-risk security zones.',
    specs: ['Fire Rating: 120 mins', 'Core: High-density Concrete', 'Resistance: 10 Bar Pressure'] },
  { id: 'Fire_Frame', label: 'Fire Frame Door', cat: 'Fire Protection',
    color: ['#5c2020','#3c1010','#7c3030'],
    desc: 'Commercial-grade fire-rated door system designed to prevent the spread of smoke and flames in high-occupancy buildings.',
    specs: ['Fire Rating: 90 mins', 'Material: Galvanized Steel', 'Seal: Intumescent Acoustic'] },
  { id: 'Honey_Comb_Door', label: 'Honey Comb Door', cat: 'Interior Solutions',
    color: ['#3a3010','#2a2008','#4a4018'],
    desc: 'Lightweight yet incredibly rigid interior door featuring a specialized hexagonal honeycomb core structure.',
    specs: ['Core: Kraft Paper Honeycomb', 'Weight: Ultra-light', 'Application: Commercial Interior'] },
  { id: 'Access_door', label: 'Access Door', cat: 'Concealed Access',
    color: ['#1a2a3a','#0f1e2e','#253545'],
    desc: 'Flush-mounted access panel providing secure, hidden entry to critical plumbing, electrical, and HVAC infrastructure.',
    specs: ['Mounting: Flush wall/ceiling', 'Lock: Concealed Snap', 'Material: Powder-coated Steel'] },
  { id: 'SR2_Door', label: 'Security Door SR2', cat: 'Security Rating SR2',
    color: ['#1e3040','#142030','#2e4050'],
    desc: 'Certified security door offering robust resistance against opportunistic attacks using mechanical hand tools.',
    specs: ['Rating: SR2 (LPS 1175)', 'Lock: Multi-point deadbolt', 'Hinges: Heavy-duty continuous'] },
  { id: 'SR3_Door', label: 'Security Door SR3', cat: 'Security Rating SR3',
    color: ['#1c2a3c','#0e1c2e','#2c3a4e'],
    desc: 'Advanced security entryway designed to resist deliberate forced entry attempts using heavy duty physical tools.',
    specs: ['Rating: SR3 (LPS 1175)', 'Core: Steel Stiffened', 'Glazing: Anti-bandit glass options'] },
  { id: 'SR4_Door', label: 'Security Door SR4', cat: 'Security Rating SR4',
    color: ['#1a2436','#0c1628','#2a3446'],
    desc: 'Maximum security product providing extreme resistance to professional forced entry tools and prolonged attack.',
    specs: ['Rating: SR4 (LPS 1175)', 'Hardware: High-security shrouded', 'Frame: Wrap-around reinforced'] },
  { id: 'steel_stiffened_door', label: 'Steel Stiffened Door', cat: 'Heavy-duty Commercial',
    color: ['#283828','#182818','#384838'],
    desc: 'Heavy-duty commercial door reinforced with continuous vertical steel stiffeners for maximum longevity and durability.',
    specs: ['Stiffeners: 22-gauge steel channels', 'Voids: Fiberglass insulated', 'Usage: High-traffic exteriors'] },
  { id: 'TRR_Door', label: 'TRR Door', cat: 'Tactical & Rescue',
    color: ['#382010','#281008','#483020'],
    desc: 'Tactical Response and Rescue door featuring specialized barricade mechanisms and rapid-entry hardware.',
    specs: ['Application: Tactical environments', 'Hardware: Quick-release drop bar', 'Ballistic: Up to Level III'] }
];

// --- SHUTTER CONFIGURATION ---
const shuttersList = [
  { id: 'Single_skin_rolling_shutter', label: 'Rolling Shutter' }
];

// --- GLAZING CONFIGURATION ---
const glazingList = [
  { id: 'Glazed_Automatic_Sliding_Door', label: 'Automatic Sliding Door' },
  { id: 'Glazed_Curtain_Wall', label: 'Curtain Walls' },
  { id: 'Glazed_Partition', label: 'Partitions' },
  { id: 'Glazed_Swing_Door', label: 'Swing Door' },
  { id: 'Glazed_Window', label: 'Windows' }
];

// --- COLOR CONFIGURATION ---
const modelColors = [
  { name: 'Standard White', value: '#ffffff' },
  { name: 'Industrial Silver', value: '#b0b0b0' },
  { name: 'Charcoal Black', value: '#333333' },
  { name: 'Safety Red', value: '#8b0000' },
  { name: 'Corporate Navy', value: '#1e3f66' }
];

// --- MAIN MENU CATEGORY CONFIGURATION ---
const mainCategories = [
  { id: 'Doors', label: 'Doors', path: `/door/Blast_Door.glb` }, 
  { id: 'Glazing', label: 'Glazing Systems', path: `/GLAZING_SYSTYEMS/Glazed_Automatic_Sliding_Door.glb` },
  { id: 'FireCurtains', label: 'Smoke Curtains', path: `/curtain/Smoke_Curtain.glb` },
  { id: 'Shutters', label: 'Shutters', path: `/ROLLING_SHUTTER/Single_skin_rolling_shutter.glb` }
];

// Preload all models used in sub-viewers
curtainsList.forEach(curtain => useGLTF.preload(`/curtain/${curtain.id}.glb`));
doorsList.forEach(door => useGLTF.preload(`/door/${door.id}.glb`));
shuttersList.forEach(shutter => useGLTF.preload(`/ROLLING_SHUTTER/${shutter.id}.glb`));
glazingList.forEach(glazing => useGLTF.preload(`/GLAZING_SYSTYEMS/${glazing.id}.glb`));
mainCategories.forEach(cat => useGLTF.preload(cat.path));

// ==========================================
// 1. STATIC ENVIRONMENT DIMMER
// ==========================================
function SceneDimmer({ active, onDeselect }) {
  const materialRef = useRef();
  
  useFrame((_, delta) => {
    if (materialRef.current) {
      materialRef.current.opacity = THREE.MathUtils.lerp(
        materialRef.current.opacity, 
        active ? 0.85 : 0, 
        delta * 3
      );
    }
  });

  return (
    <mesh 
      position={[0, 0, 1.5]}
      onClick={(e) => { 
        if (active) { 
          e.stopPropagation(); 
          onDeselect(); 
        } 
      }}
      visible={true}
    >
      <planeGeometry args={[200, 200]} />
      <meshBasicMaterial 
        ref={materialRef} 
        color="#02040a" 
        transparent 
        opacity={0} 
        depthWrite={false} 
      />
    </mesh>
  );
}

// ==========================================
// 2. GENERIC CINEMATIC ARC ITEM (Updated Lighting)
// ==========================================
function CinematicArcItem({ item, index, totalItems, selectedItemId, onSelect, folderPath }) {
  const { scene } = useGLTF(`${folderPath}/${item.id}.glb`);
  
  const positionGroupRef = useRef();
  const rotationYRef = useRef(); 
  const rotationXRef = useRef(); 
  const lightRef = useRef();
  const [hovered, setHovered] = useState(false);
  
  const isSelected = selectedItemId === item.id;
  const isOtherSelected = selectedItemId && !isSelected;

  const radius = 9;
  const floorY = -2.5; 
  const arcSpread = Math.PI * 0.75;
  
  const angle = totalItems > 1 
    ? (index / (totalItems - 1)) * arcSpread - (arcSpread / 2) 
    : 0;
  
  const px = Math.sin(angle) * radius;
  const pz = -Math.cos(angle) * radius;
  const baseRotY = -angle;

  const manualRotY = useRef(baseRotY);
  const manualRotX = useRef(0);

  useEffect(() => {
    if (!isSelected) {
      manualRotY.current = baseRotY; 
      manualRotX.current = 0;
      return;
    }
    
    let isDragging = false;
    let prevX = 0;
    let prevY = 0;

    const onDown = (e) => {
      isDragging = true;
      prevX = e.clientX || (e.touches && e.touches[0].clientX);
      prevY = e.clientY || (e.touches && e.touches[0].clientY);
    };
    
    const onMove = (e) => {
      if (isDragging) {
        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        const clientY = e.clientY || (e.touches && e.touches[0].clientY);
        
        const deltaX = clientX - prevX;
        const deltaY = clientY - prevY;
        
        manualRotY.current += deltaX * 0.015; 
        manualRotX.current += deltaY * 0.015; 
        
        prevX = clientX;
        prevY = clientY;
      }
    };
    
    const onUp = () => { isDragging = false; };

    window.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    
    return () => {
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
  }, [isSelected, baseRotY]);

  useFrame((state, delta) => {
    if (!positionGroupRef.current || !rotationYRef.current || !rotationXRef.current) return;

    // Dynamic Z-Axis based on the product category to prevent massive models from clipping
    let selectedZ = 3.5; 
    if (folderPath === '/curtain') {
      selectedZ = 0.5; // Push massive curtains back
    } else if (folderPath === '/ROLLING_SHUTTER' || folderPath === '/GLAZING_SYSTYEMS') {
      selectedZ = 1.5; 
    }

    const targetPos = isSelected 
      ? new THREE.Vector3(-1.2, -0.5, selectedZ) 
      : new THREE.Vector3(px, floorY + 1.2, pz);
      
    positionGroupRef.current.position.lerp(targetPos, delta * 4);

    if (isSelected) {
      rotationYRef.current.rotation.y = THREE.MathUtils.lerp(rotationYRef.current.rotation.y, manualRotY.current, delta * 8);
      rotationXRef.current.rotation.x = THREE.MathUtils.lerp(rotationXRef.current.rotation.x, manualRotX.current, delta * 8);
    } else {
      rotationYRef.current.rotation.y = THREE.MathUtils.lerp(rotationYRef.current.rotation.y, baseRotY, delta * 4);
      rotationXRef.current.rotation.x = THREE.MathUtils.lerp(rotationXRef.current.rotation.x, 0, delta * 4);
    }

    if (lightRef.current) {
      // Significantly boosted light intensities for dark materials
      const targetIntensity = isSelected ? 30 : (isOtherSelected ? 0.2 : (hovered ? 20 : 5));
      lightRef.current.intensity = THREE.MathUtils.lerp(lightRef.current.intensity, targetIntensity, delta * 5);
    }
  });

  return (
    <group ref={positionGroupRef} position={[px, floorY + 1.2, pz]}>
      <group ref={rotationYRef}>
        <group ref={rotationXRef}>
          <Center>
            <group
              onPointerOver={(e) => { 
                if (!isOtherSelected) { 
                  e.stopPropagation(); 
                  setHovered(true); 
                  document.body.style.cursor = 'pointer'; 
                } 
              }}
              onPointerOut={() => { 
                setHovered(false); 
                document.body.style.cursor = 'auto'; 
              }}
              onClick={(e) => { 
                if (!isSelected) {
                  e.stopPropagation(); 
                  onSelect(item.id); 
                }
              }}
            >
              <primitive object={scene} />
            </group>
          </Center>
        </group>
      </group>
      
      {/* Pushed light forward (Z=5) and widened angle so it illuminates the front of large objects */}
      <spotLight
        ref={lightRef}
        position={[0, 6, 5]}
        angle={0.6}
        penumbra={0.8}
        intensity={5}
        color={hovered || isSelected ? "#72CEEE" : "#ffffff"}
        castShadow
      />
    </group>
  );
}

// ==========================================
// 3. GENERIC CINEMATIC ARC SCENE (Updated UI Size & Scene Lights)
// ==========================================
const CinematicArcScene = ({ onBack, itemList, folderPath }) => {
  const [selectedItemId, setSelectedItemId] = useState(null);
  const activeItem = itemList.find(d => d.id === selectedItemId);

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 1000, background: '#020202', animation: 'cinematicFadeIn 1.5s ease-out forwards', overflow: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@300;400;500;600&family=Cinzel:wght@400;600&display=swap');
        @keyframes cinematicFadeIn { 0% { opacity: 0; transform: scale(1.1); filter: brightness(0); } 100% { opacity: 1; transform: scale(1); filter: brightness(1); } }
        @keyframes fadeInUI { 0% { opacity: 0; transform: translateX(-50%) translateY(10px); } 100% { opacity: 1; transform: translateX(-50%) translateY(0); } }
        
        /* UPDATED: Much wider panel, larger padding, and bigger text */
        .sr-panel { position: absolute; right: -600px; top: 50%; transform: translateY(-50%); width: clamp(400px, 28vw, 550px); background: rgba(6,10,22,0.88); backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px); border: 1px solid rgba(255,255,255,0.08); border-radius: 20px; padding: clamp(25px, 4vw, 45px); z-index: 1000; color: #fff; transition: right 0.65s cubic-bezier(0.25,0.46,0.45,0.94); box-shadow: -20px 0 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06); overflow-y: auto; max-height: 90vh; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
        .sr-panel.visible { right: clamp(24px, 3vw, 48px); }
        .sr-badge { display: inline-flex; align-items: center; gap: 8px; font-size: 0.85rem; letter-spacing: 2px; text-transform: uppercase; color: #72CEEE; margin-bottom: 12px; font-family: 'Rajdhani', sans-serif; font-weight: 600; }
        .sr-bdot { width: 8px; height: 8px; border-radius: 50%; background: #72CEEE; box-shadow: 0 0 8px #72CEEE; animation: srDotPulse 2s ease-in-out infinite; }
        @keyframes srDotPulse { 0%,100%{opacity:1;transform:scale(1);} 50%{opacity:0.55;transform:scale(0.8);} }
        .sr-panel-title { font-family: 'Cinzel', serif; font-size: clamp(1.6rem, 2.5vw, 2.2rem); font-weight: 400; color: #fff; letter-spacing: 1px; margin-bottom: 6px; }
        .sr-divider { height: 1px; background: linear-gradient(90deg, rgba(114,206,238,0.3), rgba(255,255,255,0.04)); margin: 20px 0; }
        .sr-desc { font-size: 1.1rem; line-height: 1.7; color: rgba(255,255,255,0.75); font-weight: 300; margin-bottom: 28px; }
        .sr-specs-title { font-family: 'Rajdhani', sans-serif; font-size: 0.9rem; letter-spacing: 2px; text-transform: uppercase; color: rgba(255,255,255,0.45); margin-bottom: 12px; }
        .sr-spec-row { display: flex; align-items: center; padding: 12px 18px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.04); background: rgba(255,255,255,0.025); margin-bottom: 10px; gap: 12px; }
        .sr-spec-k { font-size: 0.95rem; color: #72CEEE; font-weight: 500; min-width: 100px; font-family: 'Rajdhani', sans-serif; letter-spacing: 0.5px; }
        .sr-spec-v { font-size: 1rem; color: rgba(255,255,255,0.9); font-weight: 300; }
        .sr-cta { width: 100%; margin-top: 28px; padding: 16px; background: linear-gradient(90deg, #1e3a8a, #0ea5e9); border: none; border-radius: 12px; color: #fff; font-family: 'Rajdhani', sans-serif; font-size: 1.1rem; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; cursor: pointer; transition: opacity 0.2s, transform 0.2s; box-shadow: 0 8px 24px rgba(14,165,233,0.22); }
        .sr-cta:hover { opacity: 0.9; transform: translateY(-2px); }
      `}</style>

      <button 
        onClick={onBack} 
        style={{ position: 'absolute', top: '30px', left: '40px', zIndex: 1100, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255, 255, 255, 0.2)', color: '#fff', fontSize: '0.9rem', letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer', padding: '10px 20px', borderRadius: '30px', backdropFilter: 'blur(10px)', transition: 'all 0.3s ease', display: 'flex', alignItems: 'center', gap: '10px' }}
        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; e.currentTarget.style.borderColor = '#72CEEE'; e.currentTarget.style.color = '#72CEEE'; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)'; e.currentTarget.style.color = '#fff'; }}
      >
        <span>&#8592;</span> Exit
      </button>

      {selectedItemId && (
        <div style={{ position: 'absolute', bottom: '8%', left: '50%', transform: 'translateX(-50%)', color: 'rgba(114,206,238,0.8)', letterSpacing: '3px', fontSize: '0.8rem', fontFamily: 'Rajdhani, sans-serif', fontWeight: 600, zIndex: 1000, pointerEvents: 'none', animation: 'fadeInUI 1s forwards ease-out' }}>
          ⟷ DRAG TO ROTATE
        </div>
      )}

      <div className={`sr-panel${activeItem ? ' visible' : ''}`}>
        {activeItem && <>
          <button 
            onClick={() => setSelectedItemId(null)}
            style={{ position: 'absolute', top: '20px', right: '20px', background: 'transparent', border: 'none', color: '#fff', fontSize: '1.4rem', cursor: 'pointer', opacity: 0.6, transition: '0.3s' }}
            onMouseEnter={(e) => e.target.style.opacity = 1}
            onMouseLeave={(e) => e.target.style.opacity = 0.6}
          >
            ✕
          </button>
          
          <div className="sr-badge"><div className="sr-bdot" />{activeItem.cat || 'Industrial Product'}</div>
          <div className="sr-panel-title">{activeItem.label}</div>
          <div className="sr-divider" />
          <div className="sr-desc">{activeItem.desc || 'Premium grade solution engineered for maximum durability, performance, and seamless architectural integration.'}</div>
          
          {activeItem.specs && (
            <>
              <div className="sr-specs-title">Key Specifications</div>
              {activeItem.specs.map((spec, i) => {
                const [k, v] = spec.split(': ');
                return (
                  <div key={i} className="sr-spec-row">
                    <span className="sr-spec-k">{k}</span>
                    <span className="sr-spec-v">{v}</span>
                  </div>
                );
              })}
            </>
          )}
          <button className="sr-cta">Request a Quote ↗</button>
        </>}
      </div>

      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, -0.5, 6]} fov={55} />
        <color attach="background" args={['#050608']} />
        <fog attach="fog" args={['#050608', 5, 25]} />
        
        {/* UPDATED LIGHTING: Much brighter ambient base and a strong front directional light */}
        <ambientLight intensity={0.8} color="#ffffff" />
        <directionalLight position={[0, 5, 10]} intensity={3} color="#ffffff" />
        <directionalLight position={[-5, 5, -5]} intensity={1.5} color="#e0f2fe" />
        
        <Environment preset="studio" />

        <OrbitControls 
          target={[0, -0.5, 0]}
          enableRotate={false} 
          enablePan={false} 
          enableZoom={true} 
          minDistance={2}
          maxDistance={12}
        />

        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.5, 0]} receiveShadow>
          <planeGeometry args={[100, 100]} />
          <MeshReflectorMaterial
            blur={[400, 100]}
            resolution={1024}
            mixBlur={1}
            mixStrength={20}
            roughness={0.15}
            depthScale={1.2}
            minDepthThreshold={0.4}
            maxDepthThreshold={1.4}
            color="#080808"
            metalness={0.8}
          />
        </mesh>

        <SceneDimmer active={!!selectedItemId} onDeselect={() => setSelectedItemId(null)} />

        {itemList.map((item, index) => (
          <CinematicArcItem 
            key={item.id} 
            item={item} 
            index={index} 
            totalItems={itemList.length}
            selectedItemId={selectedItemId}
            onSelect={setSelectedItemId}
            folderPath={folderPath}
          />
        ))}
      </Canvas>
    </div>
  );
};


// ==========================================
// 4. LIGHT TRACE & REALISTIC GLASS DOOR INTRO
// ==========================================
const TIMEOUT_3D = 3000;
const TIMEOUT_VIDEO = 5000; // Change this to the exact length of your VSDoor.mp4 if needed

const ShowroomIntro = ({ onComplete }) => {
  const [introStep, setIntroStep] = useState('part3d');
  const videoRef = useRef(null);

  useEffect(() => {
    // Step 1: Show 3D text for 3 seconds
    const timer3d = setTimeout(() => { setIntroStep('partVideo'); }, TIMEOUT_3D);
    
    // Step 2: As soon as the video is done (3s + 5s), call onComplete to load VSMain
    const timerComplete = setTimeout(() => { onComplete(); }, TIMEOUT_3D + TIMEOUT_VIDEO);

    return () => {
      clearTimeout(timer3d);
      clearTimeout(timerComplete);
    };
  }, [onComplete]);

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 2000, background: '#000000', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
      
      {introStep === 'part3d' && (
        <>
          <div className="flying-text-container">
            <div style={{ position: 'relative', display: 'inline-block', perspective: '1000px' }}>
              <h1 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '4rem', fontWeight: 600, letterSpacing: '12px', textTransform: 'uppercase', margin: 0, position: 'absolute', top: 0, left: 0, color: 'rgba(130, 0, 0, 0.95)', background: 'linear-gradient(180deg, rgba(130, 0, 0, 0.9) 0%, rgba(130, 0, 0, 0.9) 80%, rgba(0, 0, 0, 1) 100%)', WebkitBackgroundClip: 'text', WebkitTextStroke: '1px rgba(0,0,0,0.5)', filter: 'drop-shadow(0px 8px 6px rgba(0, 0, 0, 0.8))' }}>
                APEX SHOWROOM
              </h1>
              <h1 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '4rem', fontWeight: 600, letterSpacing: '12px', textTransform: 'uppercase', margin: 0, position: 'relative', zIndex: 1, color: 'transparent', background: 'linear-gradient(180deg, rgba(255, 40, 40, 0.8) 0%, rgba(220, 20, 20, 0.85) 45%, rgba(255, 255, 255, 0.95) 48%, rgba(255, 150, 150, 0.9) 51%, rgba(180, 10, 10, 0.9) 55%, rgba(130, 0, 0, 0.95) 85%, rgba(20, 20, 20, 0.98) 90%, rgba(0, 0, 0, 1) 100%)', WebkitBackgroundClip: 'text', WebkitTextStroke: '1.5px rgba(255, 255, 255, 0.55)', filter: 'drop-shadow(0px -6px 20px rgba(255, 20, 20, 0.5))', transform: 'translateZ(5px)' }}>
                APEX SHOWROOM
              </h1>
            </div>
          </div>
        </>
      )}

      <div style={{ position: 'relative', width: '100vw', height: '56.25vw', maxHeight: '100vh', maxWidth: '177.78vh', overflow: 'hidden' }}>
        
        {/* We only render the video now. VSMain1 and partReveal have been deleted */}
        {introStep === 'partVideo' && (
          <video 
            ref={videoRef}
            src="/VSDoor.mp4" 
            autoPlay 
            muted 
            loop={false}
            style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'contain', zIndex: 70 }}
            className="video-fade-in"
          />
        )}

        <style>{`
          .flying-text-container { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) scale(0); z-index: 60; animation: flyInAndOut 3.5s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
          @keyframes flyInAndOut { 0% { transform: translate(-50%, -50%) scale(0); opacity: 0; filter: blur(10px); } 20% { opacity: 1; filter: blur(0px); } 70% { transform: translate(-50%, -50%) scale(1.2); opacity: 1; filter: blur(0px); } 100% { transform: translate(-50%, -50%) scale(6); opacity: 0; filter: blur(20px); } }
          
          .video-fade-in { animation: videoFadeIn 0.8s ease-out forwards; opacity: 0; }
          @keyframes videoFadeIn { 0% { opacity: 0; transform: scale(1.05); } 100% { opacity: 1; transform: scale(1); } }
        `}</style>
      </div>
    </div>
  );
};


// ==========================================
// 5. 2D INTERACTIVE IMAGE MAIN MENU
// ==========================================
const CinematicMainMenu = ({ onSelectCategory }) => {
  const [introFinished, setIntroFinished] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState(null);

  const categoryDetails = {
    'Doors': { 
      title: 'Industrial Doors', 
      lines: [
        'HIGH-PERFORMANCE FIRE-RATED DOORS', 
        'STRUCTURAL SECURITY & BLAST RESISTANCE', 
        'BALLISTIC RATING COMPLIANCE (UL/FM)', 
        'CUSTOM ENGINEERED FOR EXTREME CONDITIONS',
        'ACOUSTIC NOISE REDUCTION CAPABILITIES',
        'SEAMLESS ARCHITECTURAL INTEGRATION',
        'HONEYCOMB & STEEL STIFFENED CORES',
        'CORROSION-RESISTANT GALVANIZED FINISHES',
        'RAPID TACTICAL RESCUE MECHANISMS',
        'THERMAL INSULATION & WEATHER PROOFING',
        'SMOKE AND DRAFT CONTROL RATED'
      ] 
    },
    'Glazing': { 
      title: 'Glazing Systems', 
      lines: [
        'ARCHITECTURAL GLAZING SYSTEMS', 
        'ADVANCED THERMAL INSULATION TECHNOLOGY', 
        'FIRE-RESISTANT GLASS PARTITIONS (UP TO 120 MINS)', 
        'SEAMLESS INTEGRATION WITH BUILDING FAÇADES',
        'AUTOMATED SLIDING & SWING DOOR OPTIONS',
        'HIGH-IMPACT & SHATTERPROOF MATERIALS',
        'UV FILTRATION & SOLAR HEAT REDUCTION',
        'FRAMELESS & SLIM-PROFILE AESTHETICS',
        'SMART GLASS / PRIVACY SWITCHING ABILITIES',
        'ACOUSTIC DAMPENING RATING FOR OFFICES',
        'RIGOROUS QUALITY & SAFETY CERTIFICATIONS'
      ] 
    },
    'Shutters': { 
      title: 'Rolling Shutters', 
      lines: [
        'MOTORIZED ROLLING SHUTTERS', 
        'HEAVY-DUTY COMMERCIAL SECURITY', 
        'RAPID DEPLOYMENT MECHANISMS', 
        'WEATHER & HIGH-IMPACT RESISTANT',
        'FIRE-RATED & INSULATED PROFILES',
        'AUTOMATED OVERRIDE DURING EMERGENCIES',
        'ANTI-CORROSION GALVANIZED STEEL COILS',
        'INTEGRATED OBSTACLE DETECTION SENSORS',
        'WIND-LOAD RESISTANCE FOR INDUSTRIAL WAREHOUSES',
        'SEAMLESS SMART FACILITY INTEGRATION',
        'CUSTOM POWDER-COATED FINISH OPTIONS'
      ] 
    },
    'FireCurtains': { 
      title: 'Smoke Curtains', 
      lines: [
        'AUTOMATED FIRE & SMOKE CURTAINS', 
        'COMPACT CONCEALED CEILING DESIGN', 
        'CRITICAL LIFE SAFETY & EVACUATION SYSTEMS', 
        'HIGH TEMPERATURE RESISTANCE (UP TO 1000°C)',
        'GRAVITY FAIL-SAFE DEPLOYMENT',
        'FLEXIBLE WOVEN FIBERGLASS CONSTRUCTION',
        'INTEGRATION WITH FIRE ALARM CONTROL PANELS',
        'PREVENTS LATERAL SMOKE MIGRATION',
        'LIGHTWEIGHT & SPACE-SAVING INSTALLATION',
        'COMPLIANT WITH EN AND UL SAFETY STANDARDS',
        'CUSTOM WIDTHS FOR OPEN PLAN ARCHITECTURE'
      ] 
    },
    'Hardware': { 
      title: 'Hardware Kits', 
      lines: [
        'PREMIUM INTEGRATED HARDWARE KITS', 
        'HIGH-SECURITY MULTI-POINT LOCKS', 
        'HEAVY-DUTY CONTINUOUS HINGES', 
        'ARCHITECTURAL PREMIUM FINISHES',
        'PANIC HARDWARE & CRASH BARS',
        'CONCEALED DOOR CLOSERS & SELECTORS',
        'BIOMETRIC & SMART ACCESS COMPATIBILITY',
        'ANTI-TAMPER & VANDAL-RESISTANT CYLINDERS',
        'MAGNETIC LOCKING & HOLD-OPEN DEVICES',
        'CORROSION-RESISTANT MARINE GRADE STEEL',
        'UL LISTED LIFE-SAFETY COMPLIANT HARDWARE'
      ] 
    },
    'Shelters': { 
      title: 'Shelter Modules', 
      lines: [
        'INDUSTRIAL SHELTER MODULES', 
        'RAPID DEPLOYMENT MODULAR STRUCTURES', 
        'EXTREME WEATHER & ENVIRONMENTAL PROTECTION', 
        'BLAST AND BALLISTIC RESISTANT ENCLOSURES',
        'INTEGRATED HVAC & AIR FILTRATION SYSTEMS',
        'SOUND INSULATED CONTROL ROOM ENVIRONMENTS',
        'CUSTOMIZABLE DIMENSIONS & FLOOR PLANS',
        'HEAVY-DUTY STRUCTURAL STEEL FRAMING',
        'FIREPROOF & THERMALLY INSULATED WALLS',
        'PRE-FABRICATED FOR PLUG-AND-PLAY INSTALLATION',
        'ADVANCED TELEMETRY & SENSOR MONITORING'
      ] 
    }
  };

  if (!introFinished) {
    return <ShowroomIntro onComplete={() => setIntroFinished(true)} />;
  }

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 1000, background: '#020202', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      
      <div style={{ position: 'relative', width: '100vw', height: '56.25vw', maxHeight: '100vh', maxWidth: '177.78vh', animation: 'quickFade 0.5s ease-out forwards' }}>
        
        {/* --- MODIFIED: The Main Image dims dynamically based on hoveredCategory state --- */}
        <img 
          src="/VSMain.png" 
          alt="Virtual Showroom Main Menu" 
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'contain', 
            pointerEvents: 'none',
            transition: 'filter 0.4s ease',
            filter: hoveredCategory ? 'brightness(0.4)' : 'brightness(1)' 
          }} 
        />

        <style>{`
          @keyframes quickFade { 0% { opacity: 0; } 100% { opacity: 1; } }
          
          .hotspot-area { 
            position: absolute; cursor: pointer; border-radius: 8px; transition: all 0.3s ease; 
            display: flex; flex-direction: column; align-items: flex-start; justify-content: flex-start; 
            padding: 45px 15px 15px 15px; box-sizing: border-box; overflow: hidden; 
            /* Added default backdrop filter */
            backdrop-filter: brightness(1);
          }
          
          .hotspot-area:hover { 
            background: rgba(114, 206, 238, 0.15); 
            box-shadow: 0 0 15px rgba(114, 206, 238, 0.4); 
            border: 1px solid rgba(114, 206, 238, 0.6); 
            transform: scale(1.02); z-index: 10; 
            /* MODIFIED: This multiplies the dimmed 0.4 background by 2.5, restoring it to 1.0 perfect brightness! */
            backdrop-filter: brightness(2.5);
          }
          
          .local-info-title { font-family: 'Rajdhani', sans-serif; color: #72CEEE; font-size: 1.3rem; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 8px; text-shadow: 0 0 10px rgba(114, 206, 238, 0.6); opacity: 0; animation: infoFadeIn 0.3s ease-out forwards; }
          .local-details-text { display: block; font-family: 'Rajdhani', sans-serif; font-size: 1.05rem; letter-spacing: 1px; color: rgba(255, 255, 255, 0.95); line-height: 1.4; text-align: left; margin-bottom: 2px; clip-path: inset(0 100% 0 0); animation: wipeText 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
          @keyframes wipeText { 0% { clip-path: inset(0 100% 0 0); } 100% { clip-path: inset(0 0 0 0); } }
          @keyframes infoFadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        `}</style>

        <div className="hotspot-area" onClick={() => onSelectCategory('Doors')} onMouseEnter={() => setHoveredCategory('Doors')} onMouseLeave={() => setHoveredCategory(null)} style={{ left: '4%', top: '40%', width: '16%', height: '45%' }}>
          {hoveredCategory === 'Doors' && (
            <>
              <div className="local-info-title">{categoryDetails['Doors'].title}</div>
              {categoryDetails['Doors'].lines.map((line, idx) => ( <div key={idx} className="local-details-text" style={{ animationDelay: `${0.1 + idx * 0.1}s` }}> • {line} </div> ))}
            </>
          )}
        </div>

        <div className="hotspot-area" onClick={() => onSelectCategory('Glazing')} onMouseEnter={() => setHoveredCategory('Glazing')} onMouseLeave={() => setHoveredCategory(null)} style={{ left: '20%', top: '45%', width: '10%', height: '30%' }}>
          {hoveredCategory === 'Glazing' && (
            <>
              <div className="local-info-title">{categoryDetails['Glazing'].title}</div>
              {categoryDetails['Glazing'].lines.map((line, idx) => ( <div key={idx} className="local-details-text" style={{ animationDelay: `${0.1 + idx * 0.1}s` }}> • {line} </div> ))}
            </>
          )}
        </div>

        <div className="hotspot-area" onClick={() => onSelectCategory('Shutters')} onMouseEnter={() => setHoveredCategory('Shutters')} onMouseLeave={() => setHoveredCategory(null)} style={{ left: '27%', top: '50%', width: '18%', height: '38%' }}>
          {hoveredCategory === 'Shutters' && (
            <>
              <div className="local-info-title">{categoryDetails['Shutters'].title}</div>
              {categoryDetails['Shutters'].lines.map((line, idx) => ( <div key={idx} className="local-details-text" style={{ animationDelay: `${0.1 + idx * 0.1}s` }}> • {line} </div> ))}
            </>
          )}
        </div>

        <div className="hotspot-area" onClick={() => onSelectCategory('FireCurtains')} onMouseEnter={() => setHoveredCategory('FireCurtains')} onMouseLeave={() => setHoveredCategory(null)} style={{ left: '54%', top: '48%', width: '14%', height: '35%' }}>
          {hoveredCategory === 'FireCurtains' && (
            <>
              <div className="local-info-title">{categoryDetails['FireCurtains'].title}</div>
              {categoryDetails['FireCurtains'].lines.map((line, idx) => ( <div key={idx} className="local-details-text" style={{ animationDelay: `${0.1 + idx * 0.1}s` }}> • {line} </div> ))}
            </>
          )}
        </div>

        <div className="hotspot-area" onClick={() => onSelectCategory('Hardware')} onMouseEnter={() => setHoveredCategory('Hardware')} onMouseLeave={() => setHoveredCategory(null)} style={{ left: '63%', top: '64%', width: '16%', height: '25%' }}>
          {hoveredCategory === 'Hardware' && (
            <>
              <div className="local-info-title">{categoryDetails['Hardware'].title}</div>
              {categoryDetails['Hardware'].lines.map((line, idx) => ( <div key={idx} className="local-details-text" style={{ animationDelay: `${0.1 + idx * 0.1}s` }}> • {line} </div> ))}
            </>
          )}
        </div>

        <div className="hotspot-area" onClick={() => onSelectCategory('Shelters')} onMouseEnter={() => setHoveredCategory('Shelters')} onMouseLeave={() => setHoveredCategory(null)} style={{ left: '81%', top: '42%', width: '16%', height: '40%' }}>
          {hoveredCategory === 'Shelters' && (
            <>
              <div className="local-info-title">{categoryDetails['Shelters'].title}</div>
              {categoryDetails['Shelters'].lines.map((line, idx) => ( <div key={idx} className="local-details-text" style={{ animationDelay: `${0.1 + idx * 0.1}s` }}> • {line} </div> ))}
            </>
          )}
        </div>
        
      </div>
    </div>
  );
};

// ==========================================
// 6. MAIN ROUTING DASHBOARD
// ==========================================
const VirtualShowroomDashboard = ({ onBack }) => {
  const [activeCategory, setActiveCategory] = useState(null);

  const overlayStyle = { position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#02040a', fontFamily: '"Segoe UI", Roboto, Helvetica, Arial, sans-serif', overflow: 'hidden' };

  // ROUTING: ALL CATEGORIES NOW USE THE 3D ARC SCENE
  if (activeCategory === 'Doors') return <CinematicArcScene onBack={() => setActiveCategory(null)} itemList={doorsList} folderPath="/door" />;
  if (activeCategory === 'FireCurtains') return <CinematicArcScene onBack={() => setActiveCategory(null)} itemList={curtainsList} folderPath="/curtain" />;
  if (activeCategory === 'Shutters') return <CinematicArcScene onBack={() => setActiveCategory(null)} itemList={shuttersList} folderPath="/ROLLING_SHUTTER" />;
  if (activeCategory === 'Glazing') return <CinematicArcScene onBack={() => setActiveCategory(null)} itemList={glazingList} folderPath="/GLAZING_SYSTYEMS" />;

  // Fallback for new empty categories
  if (activeCategory === 'Hardware' || activeCategory === 'Shelters') {
    return (
      <div style={{ ...overlayStyle, background: '#050814', flexDirection: 'column' }}>
        <h2 style={{ color: '#fff' }}>{activeCategory} Viewer Coming Soon</h2>
        <button onClick={() => setActiveCategory(null)} style={{ padding: '10px 20px', cursor: 'pointer', marginTop: '20px' }}>Back to Showroom</button>
      </div>
    );
  }

  // RETURN THE 2D INTRO / HOTSPOT MAP BY DEFAULT
  return <CinematicMainMenu onSelectCategory={setActiveCategory} />;
};

export default VirtualShowroomDashboard;