import React, { useState, Suspense, useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  OrbitControls, 
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
  { id: 'Accordion_Curtain', label: 'Accordion Curtain', cat: 'Flexible Protection',
    desc: 'High-performance accordion fire curtain designed to navigate corners and complex ceiling layouts without corner posts.',
    specs: ['Fire Rating: 120 mins', 'Deployment: Gravity fail-safe', 'Material: Woven fiberglass'] },
  { id: 'Egress_Curtain', label: 'Egress Curtain', cat: 'Safe Evacuation',
    desc: 'Fire curtain equipped with a specialized egress slit, allowing personnel to safely pass through while maintaining the fire barrier.',
    specs: ['Fire Rating: 60 mins', 'Feature: Overlapping egress slit', 'Compliance: ADA Compliant'] },
  { id: 'Draft_Curtain', label: 'Draft Curtain', cat: 'Smoke Control',
    desc: 'Static draft curtain designed to channel smoke towards exhaust vents and delay sprinkler activation in adjacent zones.',
    specs: ['Material: Steel/Glass', 'Application: Warehouses & Hangars', 'Depth: Custom drop lengths'] },
  { id: 'Fire_Curtain', label: 'Fire Curtain', cat: 'Vertical Barrier',
    desc: 'Standard automated vertical fire curtain that drops down upon alarm to compartmentalize fire and prevent spread.',
    specs: ['Fire Rating: Up to 180 mins', 'Guide Rails: Side retaining', 'Power: 24V DC with backup'] }, 
  { id: 'Smoke_Curtain', label: 'Smoke Curtain', cat: 'Smoke Containment',
    desc: 'Active smoke curtain designed to restrict the lateral spread of toxic smoke along ceilings, keeping escape routes clear.',
    specs: ['Temperature Rating: 600°C', 'Leakage: Low permeability', 'Housing: Compact headbox'] }
];

// --- DOOR CONFIGURATION ---
const doorsList = [
  { id: 'Blast_Door', label: 'Blast Door', cat: 'Structural Security',
    desc: 'Engineered to withstand extreme pressure and explosive forces. Ideal for military, industrial, and high-risk security zones.',
    specs: ['Fire Rating: 120 mins', 'Core: High-density Concrete', 'Resistance: 10 Bar Pressure'] },
  { id: 'Fire_Frame', label: 'Fire Frame Door', cat: 'Fire Protection',
    desc: 'Commercial-grade fire-rated door system designed to prevent the spread of smoke and flames in high-occupancy buildings.',
    specs: ['Fire Rating: 90 mins', 'Material: Galvanized Steel', 'Seal: Intumescent Acoustic'] },
  { id: 'Honey_Comb_Door', label: 'Honey Comb Door', cat: 'Interior Solutions',
    desc: 'Lightweight yet incredibly rigid interior door featuring a specialized hexagonal honeycomb core structure.',
    specs: ['Core: Kraft Paper Honeycomb', 'Weight: Ultra-light', 'Application: Commercial Interior'] },
  { id: 'Access_door', label: 'Access Door', cat: 'Concealed Access',
    desc: 'Flush-mounted access panel providing secure, hidden entry to critical plumbing, electrical, and HVAC infrastructure.',
    specs: ['Mounting: Flush wall/ceiling', 'Lock: Concealed Snap', 'Material: Powder-coated Steel'] },
  { id: 'SR2_Door', label: 'Security Door SR2', cat: 'Security Rating SR2',
    desc: 'Certified security door offering robust resistance against opportunistic attacks using mechanical hand tools.',
    specs: ['Rating: SR2 (LPS 1175)', 'Lock: Multi-point deadbolt', 'Hinges: Heavy-duty continuous'] },
  { id: 'SR3_Door', label: 'Security Door SR3', cat: 'Security Rating SR3',
    desc: 'Advanced security entryway designed to resist deliberate forced entry attempts using heavy duty physical tools.',
    specs: ['Rating: SR3 (LPS 1175)', 'Core: Steel Stiffened', 'Glazing: Anti-bandit glass options'] },
  { id: 'SR4_Door', label: 'Security Door SR4', cat: 'Security Rating SR4',
    desc: 'Maximum security product providing extreme resistance to professional forced entry tools and prolonged attack.',
    specs: ['Rating: SR4 (LPS 1175)', 'Hardware: High-security shrouded', 'Frame: Wrap-around reinforced'] },
  { id: 'steel_stiffened_door', label: 'Steel Stiffened Door', cat: 'Heavy-duty Commercial',
    desc: 'Heavy-duty commercial door reinforced with continuous vertical steel stiffeners for maximum longevity and durability.',
    specs: ['Stiffeners: 22-gauge steel channels', 'Voids: Fiberglass insulated', 'Usage: High-traffic exteriors'] },
  { id: 'TRR_Door', label: 'TRR Door', cat: 'Tactical & Rescue',
    desc: 'Tactical Response and Rescue door featuring specialized barricade mechanisms and rapid-entry hardware.',
    specs: ['Application: Tactical environments', 'Hardware: Quick-release drop bar', 'Ballistic: Up to Level III'] }
];

// --- SHUTTER CONFIGURATION ---
const shuttersList = [
  { id: 'Single_skin_rolling_shutter', label: 'Rolling Shutter', cat: 'Exterior Security',
    desc: 'Heavy-duty single-skin rolling shutter providing robust security and weather protection for commercial and industrial openings.',
    specs: ['Operation: Motorized/Manual', 'Slat Profile: Curved steel', 'Wind Rating: Class 3'] }
];

// --- GLAZING CONFIGURATION ---
const glazingList = [
  { id: 'Glazed_Automatic_Sliding_Door', label: 'Automatic Sliding Door', cat: 'Automated Access',
    desc: 'Sensor-activated sliding glass doors providing seamless, touchless entry for high-traffic retail and commercial entrances.',
    specs: ['Sensors: Microwave/Infrared', 'Safety: Battery backup open', 'Glass: Tempered laminated'] },
  { id: 'Glazed_Curtain_Wall', label: 'Curtain Walls', cat: 'Facade Systems',
    desc: 'Non-structural, glass-clad facade system designed to resist wind and seismic loads while maximizing natural light.',
    specs: ['Mullions: Thermally broken aluminum', 'Glazing: Double-pane Low-E', 'Spandrel: Insulated shadow box'] },
  { id: 'Glazed_Partition', label: 'Partitions', cat: 'Interior Divisions',
    desc: 'Frameless interior glass partitions creating acoustic privacy while maintaining an open, collaborative office environment.',
    specs: ['Acoustic Rating: STC 40', 'Joints: Clear silicone', 'Doors: Pivot or sliding options'] },
  { id: 'Glazed_Swing_Door', label: 'Swing Door', cat: 'Hinged Access',
    desc: 'Elegant, heavy-glass swing doors featuring minimalist hardware for upscale corporate and hospitality environments.',
    specs: ['Hardware: Patch fittings', 'Closer: Floor-concealed', 'Glass: 1/2" or 3/4" Monolithic'] },
  { id: 'Glazed_Window', label: 'Windows', cat: 'Fenestration',
    desc: 'High-performance architectural window units optimized for thermal efficiency, acoustic dampening, and clear sightlines.',
    specs: ['Operation: Fixed or Casement', 'Thermal: Argon-filled gap', 'Frame: Extruded aluminum'] }
];

// Preload Category Models
curtainsList.forEach(item => useGLTF.preload(`/curtain/${item.id}.glb`));
doorsList.forEach(item => useGLTF.preload(`/door/${item.id}.glb`));
shuttersList.forEach(item => useGLTF.preload(`/ROLLING_SHUTTER/${item.id}.glb`));
glazingList.forEach(item => useGLTF.preload(`/GLAZING_SYSTYEMS/${item.id}.glb`));

// Preload Dashboard Models
useGLTF.preload('/VS/Honey_Comb_Door.glb');
useGLTF.preload('/VS/Egress_Curtain.glb');
useGLTF.preload('/VS/Single_skin_rolling_shutter.glb');
useGLTF.preload('/VS/Glazed_Partition.glb');

// ==========================================
// 1. INDOOR HALLWAY ENVIRONMENT (UPDATED FOR REALISM)
// ==========================================
function ShowroomHall() {
  return (
    <group>
      {/* Premium Polished Concrete/Marble Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.5, -10]} receiveShadow>
        <planeGeometry args={[40, 60]} />
        <MeshReflectorMaterial 
          blur={[400, 100]} 
          resolution={1024} 
          mixBlur={0.8} 
          mixStrength={40} 
          roughness={0.15} 
          depthScale={1.2} 
          minDepthThreshold={0.4} 
          maxDepthThreshold={1.4} 
          color="#121212" 
          metalness={0.4} 
        />
      </mesh>

      {/* Left Wall */}
      <mesh position={[-8, 2.5, -10]} receiveShadow>
        <boxGeometry args={[0.5, 10, 60]} />
        <meshStandardMaterial color="#1c1c1c" roughness={0.8} />
      </mesh>

      {/* Right Wall */}
      <mesh position={[8, 2.5, -10]} receiveShadow>
        <boxGeometry args={[0.5, 10, 60]} />
        <meshStandardMaterial color="#1c1c1c" roughness={0.8} />
      </mesh>

      {/* Back Wall with Depth */}
      <mesh position={[0, 2.5, -28]} receiveShadow>
        <boxGeometry args={[16, 10, 0.5]} />
        <meshStandardMaterial color="#151515" roughness={0.7} />
      </mesh>

      {/* Back Wall Accent / Pedestal */}
      <mesh position={[0, -1.5, -27.5]} receiveShadow castShadow>
        <boxGeometry args={[8, 2, 0.5]} />
        <meshStandardMaterial color="#222" roughness={0.5} />
      </mesh>

      {/* Ceiling */}
      <mesh position={[0, 7.5, -10]} receiveShadow>
        <boxGeometry args={[16.5, 0.5, 60]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.9} />
      </mesh>

      {/* Architectural Pillars for Realism */}
      {[-4, -10, -16, -22].map((z, i) => (
        <group key={i}>
          {/* Left Pillar */}
          <mesh position={[-7.5, 2.5, z]} castShadow receiveShadow>
            <boxGeometry args={[0.8, 10, 1.2]} />
            <meshStandardMaterial color="#252525" roughness={0.6} metalness={0.2} />
          </mesh>
          {/* Right Pillar */}
          <mesh position={[7.5, 2.5, z]} castShadow receiveShadow>
            <boxGeometry args={[0.8, 10, 1.2]} />
            <meshStandardMaterial color="#252525" roughness={0.6} metalness={0.2} />
          </mesh>
        </group>
      ))}

      {/* Decorative Ceiling Light Strips */}
      <mesh position={[-4, 7.2, -10]}>
        <boxGeometry args={[0.2, 0.1, 50]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={2} toneMapped={false} />
      </mesh>
      <mesh position={[4, 7.2, -10]}>
        <boxGeometry args={[0.2, 0.1, 50]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={2} toneMapped={false} />
      </mesh>

      {/* Baseboards / Skirting */}
      <mesh position={[-7.7, -2.2, -10]} receiveShadow>
        <boxGeometry args={[0.2, 0.6, 60]} />
        <meshStandardMaterial color="#050505" roughness={0.5} />
      </mesh>
      <mesh position={[7.7, -2.2, -10]} receiveShadow>
        <boxGeometry args={[0.2, 0.6, 60]} />
        <meshStandardMaterial color="#050505" roughness={0.5} />
      </mesh>
      <mesh position={[0, -2.2, -27.7]} receiveShadow>
        <boxGeometry args={[16, 0.6, 0.2]} />
        <meshStandardMaterial color="#050505" roughness={0.5} />
      </mesh>

      {/* Soft Hall Ambient Lighting */}
      <ambientLight intensity={0.5} color="#ffffff" />
      <pointLight position={[0, 6, 0]} intensity={3} color="#f0f8ff" castShadow distance={20} />
      <pointLight position={[0, 6, -10]} intensity={3} color="#f0f8ff" castShadow distance={20} />
      <pointLight position={[0, 6, -20]} intensity={3} color="#f0f8ff" castShadow distance={20} />
    </group>
  );
}

function SceneDimmer({ active, onDeselect }) {
  const materialRef = useRef();
  useFrame((_, delta) => {
    if (materialRef.current) {
      materialRef.current.opacity = THREE.MathUtils.lerp(
        materialRef.current.opacity, active ? 0.85 : 0, delta * 3
      );
    }
  });
  return (
    <mesh position={[0, 0, 1.5]} onClick={(e) => { if (active) { e.stopPropagation(); onDeselect(); } }} visible={true}>
      <planeGeometry args={[200, 200]} />
      <meshBasicMaterial ref={materialRef} color="#02040a" transparent opacity={0} depthWrite={false} />
    </mesh>
  );
}

// ==========================================
// 2. INNER PAGE SHOWROOM ITEM (Unchanged)
// ==========================================
function CinematicShowroomItem({ item, index, totalItems, selectedItemId, onSelect, basePath }) {
  const { scene } = useGLTF(`${basePath}/${item.id}.glb`);
  const positionGroupRef = useRef();
  const rotationYRef = useRef(); 
  const rotationXRef = useRef(); 
  const lightRef = useRef();
  const [hovered, setHovered] = useState(false);
  
  const isSelected = selectedItemId === item.id;
  const isOtherSelected = selectedItemId && !isSelected;

  // Static Arc Logic 
  const radius = 9;
  const floorY = -2.5; 
  const arcSpread = Math.PI * 0.75;
  const angle = totalItems > 1 ? (index / (totalItems - 1)) * arcSpread - (arcSpread / 2) : 0;
  const px = Math.sin(angle) * radius;
  const pz = -Math.cos(angle) * radius;
  const baseRotY = -angle;

  const manualRotY = useRef(baseRotY);
  const manualRotX = useRef(0);

  useEffect(() => {
    if (!isSelected) { manualRotY.current = baseRotY; manualRotX.current = 0; return; }
    let isDragging = false, prevX = 0, prevY = 0;

    const onDown = (e) => { isDragging = true; prevX = e.clientX || (e.touches && e.touches[0].clientX); prevY = e.clientY || (e.touches && e.touches[0].clientY); };
    const onMove = (e) => {
      if (isDragging) {
        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        const clientY = e.clientY || (e.touches && e.touches[0].clientY);
        manualRotY.current += (clientX - prevX) * 0.015; 
        manualRotX.current += (clientY - prevY) * 0.015; 
        prevX = clientX; prevY = clientY;
      }
    };
    const onUp = () => { isDragging = false; };

    window.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    return () => { window.removeEventListener('pointerdown', onDown); window.removeEventListener('pointermove', onMove); window.removeEventListener('pointerup', onUp); };
  }, [isSelected, baseRotY]);

  useFrame((state, delta) => {
    if (!positionGroupRef.current || !rotationYRef.current || !rotationXRef.current) return;
    
    const targetPos = isSelected ? new THREE.Vector3(-1.2, -0.5, 2.8) : new THREE.Vector3(px, floorY + 1.2, pz);
    positionGroupRef.current.position.lerp(targetPos, delta * 4);

    if (isSelected) {
      rotationYRef.current.rotation.y = THREE.MathUtils.lerp(rotationYRef.current.rotation.y, manualRotY.current, delta * 8);
      rotationXRef.current.rotation.x = THREE.MathUtils.lerp(rotationXRef.current.rotation.x, manualRotX.current, delta * 8);
    } else {
      rotationYRef.current.rotation.y = THREE.MathUtils.lerp(rotationYRef.current.rotation.y, baseRotY, delta * 4);
      rotationXRef.current.rotation.x = THREE.MathUtils.lerp(rotationXRef.current.rotation.x, 0, delta * 4);
    }

    if (lightRef.current) {
      const targetIntensity = isSelected ? 15 : (isOtherSelected ? 0.2 : (hovered ? 12 : 2));
      lightRef.current.intensity = THREE.MathUtils.lerp(lightRef.current.intensity, targetIntensity, delta * 5);
    }
  });

  return (
    <group ref={positionGroupRef} position={[px, floorY + 1.2, pz]}>
      <group ref={rotationYRef}>
        <group ref={rotationXRef}>
          <Center>
            <group
              onPointerOver={(e) => { if (!isOtherSelected) { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; } }}
              onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto'; }}
              onClick={(e) => { if (!isSelected) { e.stopPropagation(); onSelect(item.id); } }}
            >
              <primitive object={scene} />
            </group>
          </Center>
        </group>
      </group>
      <spotLight ref={lightRef} position={[0, 6, 2]} angle={0.4} penumbra={0.8} intensity={2} color={hovered || isSelected ? "#72CEEE" : "#ffffff"} castShadow />
    </group>
  );
}

// ==========================================
// 3. INNER PAGE CINEMATIC SHOWROOM SCENE (Unchanged)
// ==========================================
const CinematicShowroomScene = ({ items, basePath, categoryTitle, onBack }) => {
  const [selectedItemId, setSelectedItemId] = useState(null);
  const activeItem = items.find(i => i.id === selectedItemId);

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 1000, background: '#020202', animation: 'cinematicFadeIn 1.5s ease-out forwards', overflow: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@300;400;500;600&family=Cinzel:wght@400;600&display=swap');
        @keyframes cinematicFadeIn { 0% { opacity: 0; transform: scale(1.1); filter: brightness(0); } 100% { opacity: 1; transform: scale(1); filter: brightness(1); } }
        @keyframes fadeInUI { 0% { opacity: 0; transform: translateX(-50%) translateY(10px); } 100% { opacity: 1; transform: translateX(-50%) translateY(0); } }
        .sr-panel { position: absolute; right: -500px; top: 50%; transform: translateY(-50%); width: clamp(300px, 30vw, 430px); background: rgba(6,10,22,0.88); backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px); border: 1px solid rgba(255,255,255,0.08); border-radius: 20px; padding: clamp(20px, 3vw, 38px); z-index: 1000; color: #fff; transition: right 0.65s cubic-bezier(0.25,0.46,0.45,0.94); box-shadow: -20px 0 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06); overflow-y: auto; max-height: 90vh; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
        .sr-panel.visible { right: clamp(16px, 2vw, 32px); }
        .sr-badge { display: inline-flex; align-items: center; gap: 7px; font-size: 0.68rem; letter-spacing: 2px; text-transform: uppercase; color: #72CEEE; margin-bottom: 10px; font-family: 'Rajdhani', sans-serif; font-weight: 600; }
        .sr-bdot { width: 7px; height: 7px; border-radius: 50%; background: #72CEEE; box-shadow: 0 0 8px #72CEEE; animation: srDotPulse 2s ease-in-out infinite; }
        @keyframes srDotPulse { 0%,100%{opacity:1;transform:scale(1);} 50%{opacity:0.55;transform:scale(0.8);} }
        .sr-panel-title { font-family: 'Cinzel', serif; font-size: clamp(1.1rem, 2.2vw, 1.6rem); font-weight: 400; color: #fff; letter-spacing: 1px; margin-bottom: 4px; }
        .sr-divider { height: 1px; background: linear-gradient(90deg, rgba(114,206,238,0.3), rgba(255,255,255,0.04)); margin: 16px 0; }
        .sr-desc { font-size: 0.88rem; line-height: 1.7; color: rgba(255,255,255,0.72); font-weight: 300; margin-bottom: 22px; }
        .sr-specs-title { font-family: 'Rajdhani', sans-serif; font-size: 0.7rem; letter-spacing: 2px; text-transform: uppercase; color: rgba(255,255,255,0.38); margin-bottom: 10px; }
        .sr-spec-row { display: flex; align-items: center; padding: 10px 14px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.04); background: rgba(255,255,255,0.025); margin-bottom: 8px; gap: 10px; }
        .sr-spec-k { font-size: 0.76rem; color: #72CEEE; font-weight: 500; min-width: 86px; font-family: 'Rajdhani', sans-serif; letter-spacing: 0.4px; }
        .sr-spec-v { font-size: 0.82rem; color: rgba(255,255,255,0.85); font-weight: 300; }
        .sr-cta { width: 100%; margin-top: 22px; padding: 13px; background: linear-gradient(90deg, #1e3a8a, #0ea5e9); border: none; border-radius: 10px; color: #fff; font-family: 'Rajdhani', sans-serif; font-size: 0.95rem; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; cursor: pointer; transition: opacity 0.2s, transform 0.2s; box-shadow: 0 8px 24px rgba(14,165,233,0.22); }
        .sr-cta:hover { opacity: 0.9; transform: translateY(-1px); }
      `}</style>

      <h1 style={{ position: 'absolute', top: '30px', left: '50%', transform: 'translateX(-50%)', zIndex: 1100, margin: 0, color: 'rgba(255,255,255,0.8)', fontSize: '1.2rem', fontWeight: '300', letterSpacing: '8px', textTransform: 'uppercase', pointerEvents: 'none' }}>
        {categoryTitle}
      </h1>

      <button onClick={onBack} style={{ position: 'absolute', top: '30px', left: '40px', zIndex: 1100, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255, 255, 255, 0.2)', color: '#fff', fontSize: '0.9rem', letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer', padding: '10px 20px', borderRadius: '30px', backdropFilter: 'blur(10px)', transition: 'all 0.3s ease', display: 'flex', alignItems: 'center', gap: '10px' }} onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; e.currentTarget.style.borderColor = '#72CEEE'; e.currentTarget.style.color = '#72CEEE'; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)'; e.currentTarget.style.color = '#fff'; }}>
        <span>&#8592;</span> Exit
      </button>

      {selectedItemId && (
        <div style={{ position: 'absolute', bottom: '8%', left: '50%', transform: 'translateX(-50%)', color: 'rgba(114,206,238,0.8)', letterSpacing: '3px', fontSize: '0.8rem', fontFamily: 'Rajdhani, sans-serif', fontWeight: 600, zIndex: 1000, pointerEvents: 'none', animation: 'fadeInUI 1s forwards ease-out' }}>
          ⟷ DRAG TO ROTATE
        </div>
      )}

      <div className={`sr-panel${activeItem ? ' visible' : ''}`}>
        {activeItem && <>
          <button onClick={() => setSelectedItemId(null)} style={{ position: 'absolute', top: '15px', right: '15px', background: 'transparent', border: 'none', color: '#fff', fontSize: '1.2rem', cursor: 'pointer', opacity: 0.6, transition: '0.3s' }} onMouseEnter={(e) => e.target.style.opacity = 1} onMouseLeave={(e) => e.target.style.opacity = 0.6}>✕</button>
          <div className="sr-badge"><div className="sr-bdot" />{activeItem.cat}</div>
          <div className="sr-panel-title">{activeItem.label}</div>
          <div className="sr-divider" />
          <div className="sr-desc">{activeItem.desc}</div>
          <div className="sr-specs-title">Key Specifications</div>
          {activeItem.specs.map((spec, i) => {
            const [k, v] = spec.split(': ');
            return (<div key={i} className="sr-spec-row"><span className="sr-spec-k">{k}</span><span className="sr-spec-v">{v}</span></div>);
          })}
          <button className="sr-cta">Request a Quote ↗</button>
        </>}
      </div>

      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, -0.5, 7]} fov={55} />
        <color attach="background" args={['#050608']} />
        <fog attach="fog" args={['#050608', 5, 25]} />
        <ambientLight intensity={0.3} color="#ffffff" />
        <Environment preset="studio" />
        <OrbitControls target={[0, -0.5, 0]} enableRotate={false} enablePan={false} enableZoom={true} minDistance={2} maxDistance={12} />
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.5, 0]} receiveShadow>
          <planeGeometry args={[100, 100]} />
          <MeshReflectorMaterial blur={[400, 100]} resolution={1024} mixBlur={1} mixStrength={20} roughness={0.15} depthScale={1.2} minDepthThreshold={0.4} maxDepthThreshold={1.4} color="#080808" metalness={0.8} />
        </mesh>
        <SceneDimmer active={!!selectedItemId} onDeselect={() => setSelectedItemId(null)} />
        {items.map((item, index) => (
          <Suspense fallback={null} key={item.id}>
            <CinematicShowroomItem item={item} index={index} totalItems={items.length} selectedItemId={selectedItemId} onSelect={setSelectedItemId} basePath={basePath} />
          </Suspense>
        ))}
      </Canvas>
    </div>
  );
};


// ==========================================
// 4. DASHBOARD CAMERA CONTROLLER (Updated for Guided Tour)
// ==========================================
function CinematicCamera({ layoutData, onComplete, animating, onFocusChange }) {
  const currentPos = useRef(new THREE.Vector3(0, 0, 8));
  const lookAtTarget = useRef(new THREE.Vector3(0, 0, 0));
  const startTime = useRef(null);
  const lastFocusIndex = useRef(-2);
  const [done, setDone] = useState(false);
  const { camera } = useThree();

  const waypoints = useMemo(() => {
    const pts = [];
    let t = 0;

    // Start way outside the entrance to give depth feeling
    pts.push({ time: t, pos: new THREE.Vector3(0, 3, 20), look: new THREE.Vector3(0, 0.5, -5), focusIndex: -1 });
    t += 3.5; 

    // Move smoothly into the showroom hall entrance
    pts.push({ time: t, pos: new THREE.Vector3(0, 1.5, 8), look: new THREE.Vector3(0, 0.5, -8), focusIndex: -1 });
    t += 1.0; 

    // Move to each dashboard category card
    layoutData.forEach((data, i) => {
      const dPos = new THREE.Vector3(...data.pos);
      const cZ = Math.max(dPos.z + 5, -17); // Slight zoom in 
      const cX = dPos.x * 0.4; // Direct approach angle
      const cPos = new THREE.Vector3(cX, 0.5, cZ);

      // Move phase (2 seconds)
      pts.push({ time: t, pos: cPos.clone(), look: dPos.clone(), focusIndex: i });
      t += 2.0; 
      
      // Hold/Focus phase (1.5 seconds)
      pts.push({ time: t, pos: cPos.clone(), look: dPos.clone(), focusIndex: i });
      t += 1.5; 
    });

    // End with wide-angle full showroom view
    t += 3.0; 
    // FIXED: Changed final 'pos' Z coordinate from -4 to 4 to pull the camera further back
    pts.push({ time: t, pos: new THREE.Vector3(0, 1.5, 4), look: new THREE.Vector3(0, -1, -22), focusIndex: -1 });

    return pts;
  }, [layoutData]);

  const totalTime = waypoints[waypoints.length - 1].time;

  // Handle skip/end directly formatting the camera properly
  useEffect(() => {
    if (!animating && !done) {
      onFocusChange(-1);
      // FIXED: Changed fallback camera position Z coordinate from -4 to 4 to match the waypoint above
      camera.position.set(0, 1.5, 4);
      camera.lookAt(0, -1, -22);
    }
  }, [animating, done, onFocusChange, camera]);

  useFrame((state) => {
    if (!animating || done) return;

    if (startTime.current === null) startTime.current = state.clock.elapsedTime;
    const elapsedTime = state.clock.elapsedTime - startTime.current;
    
    if (elapsedTime >= totalTime) {
      setDone(true);
      onComplete();
      return;
    }

    let wpStart = waypoints[0];
    let wpEnd = waypoints[waypoints.length - 1];

    for (let i = 0; i < waypoints.length - 1; i++) {
      if (elapsedTime >= waypoints[i].time && elapsedTime <= waypoints[i + 1].time) {
        wpStart = waypoints[i];
        wpEnd = waypoints[i + 1];
        break;
      }
    }

    // Trigger state change strictly only when focus shifts
    if (wpStart.focusIndex !== lastFocusIndex.current) {
      lastFocusIndex.current = wpStart.focusIndex;
      onFocusChange(wpStart.focusIndex);
    }

    const duration = wpEnd.time - wpStart.time;
    const progress = duration > 0 ? (elapsedTime - wpStart.time) / duration : 1;
    
    // Smooth cinematic easing (Sine)
    const ease = -(Math.cos(Math.PI * progress) - 1) / 2;

    currentPos.current.lerpVectors(wpStart.pos, wpEnd.pos, ease);
    lookAtTarget.current.lerpVectors(wpStart.look, wpEnd.look, ease);

    state.camera.position.copy(currentPos.current);
    state.camera.lookAt(lookAtTarget.current);
  });

  return null;
}

// ==========================================
// 5. DASHBOARD 3D CARD (Unchanged)
// ==========================================

function ModelDisplay({ path }) {
  const { scene } = useGLTF(path);
  return <primitive object={scene} />;
}

function Dashboard3DCard({ item, layoutData, onSelect, isAnimating, isFocused }) {
  const groupRef = useRef();
  const spotlightRef = useRef();
  const [hovered, setHovered] = useState(false);
  const [texture, setTexture] = useState(null);
  
  const targetColor = useMemo(() => new THREE.Color(), []);
  const { pos: basePos, rotY: baseRotY } = layoutData;

  useEffect(() => {
    const tex = new THREE.TextureLoader().load(item.img);
    tex.colorSpace = THREE.SRGBColorSpace;
    setTexture(tex);
    return () => { if (tex) tex.dispose(); };
  }, [item.img]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Disable local hover lift if global cinematic animation is taking place
    const isHoverActive = hovered && !isAnimating;

    // Hover animation (Slightly rise up and rotate towards camera)
    const targetY = isHoverActive ? basePos[1] + 0.3 : basePos[1];
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, delta * 6);

    const targetRotX = isHoverActive ? 0.05 : 0;
    const targetRotY = baseRotY + (isHoverActive ? (basePos[0] < 0 ? 0.1 : -0.1) : 0);
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, delta * 5);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, delta * 5);

    // Dynamic Spotlight Intensity & Color Controller
    if (spotlightRef.current) {
      // Logic: If animating, only focused item shines bright. If not animating, revert to normal hover interactions.
      const intensityTarget = isAnimating ? (isFocused ? 12 : 0.5) : (hovered ? 8 : 4);
      const colorTargetStr = isAnimating ? (isFocused ? "#72CEEE" : "#ffffff") : (hovered ? "#72CEEE" : "#ffffff");
      
      spotlightRef.current.intensity = THREE.MathUtils.lerp(spotlightRef.current.intensity, intensityTarget, delta * 5);
      targetColor.set(colorTargetStr);
      spotlightRef.current.color.lerp(targetColor, delta * 5);
    }
  });

  const handleClick = (e) => {
    e.stopPropagation();
    onSelect(item.id); 
  };

  if (!texture) return null;

  return (
    <group ref={groupRef} position={basePos}>
      {/* Invisible interaction bubble */}
      <mesh 
        visible={false}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
        onPointerOut={(e) => { setHovered(false); document.body.style.cursor = 'auto'; }}
        onClick={handleClick}
      >
        <boxGeometry args={[3.4, 3.4, 2]} />
        <meshBasicMaterial />
      </mesh>

      {/* Show Image plane IF no 3D model exists */}
      {!item.modelPath && (
        <group>
          <mesh castShadow>
            <boxGeometry args={[3.4, 2.2, 0.1]} />
            <meshStandardMaterial color={hovered && !isAnimating ? "#282828" : "#111"} roughness={0.2} metalness={0.8} />
          </mesh>
          <mesh position={[0, 0, 0.06]}>
            <planeGeometry args={[3.2, 2.1]} />
            <meshBasicMaterial map={texture} />
          </mesh>
        </group>
      )}

      {/* Show 3D Model ONLY if it exists */}
      {item.modelPath && (
        <Center>
          <ModelDisplay path={item.modelPath} />
        </Center>
      )}

      {/* Text Label */}
      <group position={[0, item.modelPath ? -1.8 : -1.5, 0.08]}>
        <Text
          position={[0, 0, 0]}
          fontSize={0.25}
          color={(hovered && !isAnimating) || (isAnimating && isFocused) ? "#72CEEE" : "#ffffff"}
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.15}
          fontWeight="bold"
        >
          {item.label}
        </Text>
      </group>

      <spotLight ref={spotlightRef} position={[0, 5, 2]} angle={0.5} penumbra={0.8} castShadow />
    </group>
  );
}

// ==========================================
// 6. MAIN DASHBOARD CODE (Unchanged)
// ==========================================
const dashboardItems = [
  { id: 'Doors', label: 'DOORS', img: '/VS/steel.webp', modelPath: null }, 
  { id: 'Hardware', label: 'HARDWARE', img: '/VS/Hardware1.jpg', modelPath: null },
  { id: 'FireCurtains', label: 'FIRE & SMOKE CURTAINS', img: '/VS/curtain1.jfif', modelPath: null },
  { id: 'Shutters', label: 'ROLLING SHUTTERS', img: '/VS/shutter1.jfif', modelPath: null },
  { id: 'Glazing', label: 'GLAZING SYSTEMS', img: '/VS/glass1.jpg', modelPath: null },
  { id: 'Shelters', label: 'SHELTERS', img: '/VS/shelters.jpg', modelPath: null }
];

// Map 6 dashboard items perfectly to the left, right, and center walls
const dashboardLayout = [
  { pos: [-4.5, -0.8, -6], rotY: Math.PI / 6 },  // Left Wall 1
  { pos: [-4.5, -0.8, -12], rotY: Math.PI / 6 }, // Left Wall 2
  { pos: [4.5, -0.8, -6], rotY: -Math.PI / 6 },  // Right Wall 1
  { pos: [4.5, -0.8, -12], rotY: -Math.PI / 6 }, // Right Wall 2
  { pos: [-2, -0.8, -22], rotY: 0 },             // Center Wall 1
  { pos: [2, -0.8, -22], rotY: 0 },              // Center Wall 2
];

const VirtualShowroomDashboard = ({ onBack }) => {
  const [activeCategory, setActiveCategory] = useState(null);
  const [isAnimating, setIsAnimating] = useState(true);
  const [tourIndex, setTourIndex] = useState(-1); // Tracks which item is being focused in the guided tour

  if (activeCategory === 'Doors') return <CinematicShowroomScene items={doorsList} basePath="/door" categoryTitle="Doors" onBack={() => setActiveCategory(null)} />;
  if (activeCategory === 'FireCurtains') return <CinematicShowroomScene items={curtainsList} basePath="/curtain" categoryTitle="Fire & Smoke Curtains" onBack={() => setActiveCategory(null)} />;
  if (activeCategory === 'Shutters') return <CinematicShowroomScene items={shuttersList} basePath="/ROLLING_SHUTTER" categoryTitle="Rolling Shutters" onBack={() => setActiveCategory(null)} />;
  if (activeCategory === 'Glazing') return <CinematicShowroomScene items={glazingList} basePath="/GLAZING_SYSTYEMS" categoryTitle="Glazing Systems" onBack={() => setActiveCategory(null)} />;
  if (activeCategory === 'Hardware') return <CinematicShowroomScene items={[]} basePath="" categoryTitle="Hardware" onBack={() => setActiveCategory(null)} />;
  if (activeCategory === 'Shelters') return <CinematicShowroomScene items={[]} basePath="" categoryTitle="Shelters" onBack={() => setActiveCategory(null)} />;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 100, background: '#020202', overflow: 'hidden' }}>
      <style>{`
        @keyframes cinematicFadeIn { 0% { opacity: 0; filter: brightness(0); } 100% { opacity: 1; filter: brightness(1); } }
        .dashboard-container { animation: cinematicFadeIn 1.5s ease-out forwards; width: 100%; height: 100%; }
        .dashboard-header { transition: opacity 0.5s ease; }
      `}</style>
      
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1 style={{ position: 'absolute', top: '35px', left: '50%', transform: 'translateX(-50%)', zIndex: 1100, margin: 0, color: 'rgba(255,255,255,0.8)', fontSize: '1.6rem', fontWeight: '300', letterSpacing: '8px', textTransform: 'uppercase', pointerEvents: 'none' }}>
            VIRTUAL SHOWROOM
          </h1>
          <h2 style={{ position: 'absolute', top: '75px', left: '50%', transform: 'translateX(-50%)', zIndex: 1100, margin: 0, color: '#72CEEE', fontSize: '0.9rem', fontWeight: '600', letterSpacing: '4px', textTransform: 'uppercase', pointerEvents: 'none' }}>
            AI APEX PRODUCTS
          </h2>

          <button onClick={onBack} style={{ position: 'absolute', top: '35px', left: '40px', zIndex: 1100, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255, 255, 255, 0.2)', color: '#fff', fontSize: '0.9rem', letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer', padding: '10px 20px', borderRadius: '30px', backdropFilter: 'blur(10px)', transition: 'all 0.3s ease', display: 'flex', alignItems: 'center', gap: '10px' }} onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; e.currentTarget.style.borderColor = '#72CEEE'; e.currentTarget.style.color = '#72CEEE'; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)'; e.currentTarget.style.color = '#fff'; }}>
            <span>&#8592;</span> Exit
          </button>
        </div>

        {/* Skip Tour Button */}
        {isAnimating && (
          <button onClick={() => { setIsAnimating(false); setTourIndex(-1); }} style={{ position: 'absolute', bottom: '40px', right: '40px', zIndex: 1100, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255, 255, 255, 0.3)', color: '#fff', fontSize: '0.8rem', letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer', padding: '10px 20px', borderRadius: '30px', backdropFilter: 'blur(10px)', transition: 'all 0.3s ease' }} onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.2)'; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}>
            Skip Tour &#8594;
          </button>
        )}

        <Canvas shadows dpr={[1, 2]}>
          <PerspectiveCamera makeDefault position={[0, 1.5, -8]} fov={55} />
          <color attach="background" args={['#050608']} />
          <fog attach="fog" args={['#050608', 10, 40]} />
          <Environment preset="studio" />
          
          <ShowroomHall />

          {dashboardItems.map((item, index) => (
            <Suspense fallback={null} key={item.id}>
              <Dashboard3DCard 
                item={item} 
                layoutData={dashboardLayout[index]}
                onSelect={setActiveCategory} 
                isAnimating={isAnimating}
                isFocused={tourIndex === index}
              />
            </Suspense>
          ))}

          {/* Cinematic Tour Camera Controller on Dashboard */}
          <CinematicCamera 
            layoutData={dashboardLayout} 
            animating={isAnimating} 
            onComplete={() => { setIsAnimating(false); setTourIndex(-1); }} 
            onFocusChange={setTourIndex}
          />

          {/* Disables user interaction completely during animation, enables perfectly aligned control after */}
          <OrbitControls 
            target={[0, -1, -22]} 
            enabled={!isAnimating} 
            enableRotate={true} 
            enablePan={false} 
            enableZoom={true} 
            minDistance={2} 
            maxDistance={25} 
          />
        </Canvas>
      </div>
    </div>
  );
};

export default VirtualShowroomDashboard;