import React, { useRef, useEffect, useState, Suspense, useMemo, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  OrbitControls, 
  PerspectiveCamera, 
  Environment, 
  Text, 
  useCursor, 
  Edges,
  useVideoTexture,
  Billboard,
  Preload 
} from '@react-three/drei';
import { EffectComposer, Bloom, DepthOfField } from '@react-three/postprocessing';
import * as THREE from 'three';
import AIEstimation from './pages/AIEstimation.jsx';
import DataDashboard from './pages/DataDashboard.jsx';
import VirtualShowroomDashboard from './pages/VirtualShowroomDashboard.jsx';
import NewShowroom from './pages/NewShowroom.jsx';
import AIContract from './pages/AIContract.jsx';

// --- CONFIGURATION ---
const CIRCLE_POSITION = [0, 0, 0]; 

// --- TOUCH RIPPLE FEEDBACK (High Visibility) ---
const TouchFeedback = () => {
  const [ripples, setRipples] = useState([]);

  useEffect(() => {
    const handlePointerDown = (e) => {
      const id = Date.now();
      const x = e.clientX;
      const y = e.clientY;

      setRipples((prev) => [...prev, { x, y, id }]);

      setTimeout(() => {
        setRipples((prev) => prev.filter((ripple) => ripple.id !== id));
      }, 800);
    };

    window.addEventListener('pointerdown', handlePointerDown);
    return () => window.removeEventListener('pointerdown', handlePointerDown);
  }, []);

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      pointerEvents: 'none', 
      zIndex: 99999, 
      overflow: 'hidden'
    }}>
      <style>
        {`
          @keyframes ripple-anim {
            0% { transform: scale(0); opacity: 1.0; }
            100% { transform: scale(5); opacity: 0; }
          }
        `}
      </style>
      {ripples.map((ripple) => (
        <div
          key={ripple.id}
          style={{
            position: 'absolute',
            left: ripple.x,
            top: ripple.y,
            width: '25px',
            height: '25px',
            background: 'radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(114, 206, 238, 0.8) 40%, rgba(114, 206, 238, 0) 70%)',
            borderRadius: '50%',
            transform: 'translate(-50%, -50%)', 
            animation: 'ripple-anim 0.6s ease-out forwards',
            boxShadow: '0 0 20px rgba(114, 206, 238, 0.9)', 
            filter: 'blur(1px)' 
          }}
        />
      ))}
    </div>
  );
};

// --- SHARED STYLE FOR VIDEOS/IMAGES ---
const mediaStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  display: 'block'
};

// --- CSS BACKGROUNDS ---
const mainBackgroundStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  overflow: 'hidden',
  zIndex: 1, 
  background: 'radial-gradient(circle at center, #050a14 0%, #000000 100%)', 
};

const canvasContainerStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  zIndex: 10, 
  background: 'transparent', 
  pointerEvents: 'none' 
};

function CentralVideo({ visible }) {
  const groupRef = useRef();
  const meshRef = useRef();
  const [videoTexture, setVideoTexture] = useState(null);

  useEffect(() => {
    const video = document.createElement('video');
    video.src = '/flr123.mp4';
    video.crossOrigin = 'Anonymous';
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    video.preload = "auto";
    video.play();

    const texture = new THREE.VideoTexture(video);
    texture.colorSpace = THREE.SRGBColorSpace;
    setVideoTexture(texture);

    return () => { video.pause(); video.src = ''; };
  }, []);

  useFrame((state, delta) => {
    if (meshRef.current) {
      const targetScale = visible ? 1 : 0;
      meshRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        delta * 2.0
      );
    }

    if (groupRef.current) {
      const cameraAngle = Math.atan2(
        state.camera.position.x,
        state.camera.position.z
      );
      groupRef.current.rotation.y = cameraAngle + (state.clock.elapsedTime * 0.2); 
    }
  });

  if (!videoTexture) return null;

  return (
    <group position={[0, -2, 0]} ref={groupRef}>
      <mesh
        ref={meshRef}
        rotation={[-Math.PI / 2, 0, 0]}
        renderOrder={0}
        scale={[0, 0, 0]}
      >
        <circleGeometry args={[40, 67]} />
        <meshBasicMaterial
          map={videoTexture}
          toneMapped={false}
          side={THREE.DoubleSide}
          transparent
          opacity={0.02} 
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

// --- 4. HOLOGRAPHIC OVERLAY ---
function HolographicOverlay({ visible }) {
  const groupRef = useRef();
  
  const hudShaderArgs = useMemo(() => ({
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color('#041219') }, 
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform vec3 uColor;
      varying vec2 vUv;
      float circle(vec2 uv, float r, float w) {
        return 1.0 - smoothstep(w, w + 0.01, abs(length(uv) - r));
      }
      void main() {
        vec2 uv = vUv * 2.0 - 1.0;
        float dist = length(uv);
        float angle = atan(uv.y, uv.x);
        vec3 color = vec3(0.0);
        float alpha = 0.0;
        float outerFade = 1.0 - smoothstep(0.3, 0.7, dist);
        float core = smoothstep(0.15, 0.0, dist); 
        float scan = smoothstep(0.0, 0.15, abs(sin(angle * 3.0 + uTime * 0.5)));
        scan *= smoothstep(0.1, 0.6, dist); 
        scan *= 0.2; 
        vec3 coreColor = mix(uColor, vec3(1.0), 0.8); 
        color += coreColor * core * 1.0;                  
        color += uColor * scan;                 
        gl_FragColor = vec4(color, alpha);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  }), []);

  const particleCount = 2000; 
  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for(let i=0; i<particleCount; i++) {
        const r = Math.random() * 5; 
        const theta = Math.random() * Math.PI * 2;
        pos[i*3] = r * Math.cos(theta);     
        pos[i*3+1] = Math.random() * 6;     
        pos[i*3+2] = r * Math.sin(theta);   
    }
    return pos;
  }, []);
  const particlesRef = useRef();

  const sparkleCount = 600; 
  const sparkleRef = useRef();

  const sparkleData = useMemo(() => {
    const pos = new Float32Array(sparkleCount * 3);
    const col = new Float32Array(sparkleCount * 3);
    const speeds = new Float32Array(sparkleCount);
    const offsets = new Float32Array(sparkleCount); 

    const colorNavy = new THREE.Color('#4275da'); 
    const colorGold = new THREE.Color('#FFD700'); 

    for (let i = 0; i < sparkleCount; i++) {
      const r = Math.random() * 3.0; 
      const theta = Math.random() * Math.PI * 2;
      
      pos[i * 3] = r * Math.cos(theta); 
      pos[i * 3 + 1] = -2.0 + Math.random() * 6.0; 
      pos[i * 3 + 2] = r * Math.sin(theta); 

      const isGold = Math.random() > 0.5; 
      const c = isGold ? colorGold : colorNavy;
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;

      speeds[i] = 0.2 + Math.random() * 0.5; 
      offsets[i] = Math.random() * 100; 
    }
    
    return { pos, col, speeds, offsets };
  }, []);

  useFrame((state, delta) => {
    if (groupRef.current) {
        const targetScale = visible ? 1 : 0;
        groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 2.0);
        groupRef.current.children.forEach(child => {
            if(child.material?.uniforms) {
                child.material.uniforms.uTime.value = state.clock.elapsedTime;
            }
        });
    }

    if(particlesRef.current) {
        const positions = particlesRef.current.geometry.attributes.position.array;
        for(let i=0; i<particleCount; i++) {
            positions[i*3+1] += delta * 0.8; 
            if(positions[i*3+1] > 6) positions[i*3+1] = 0; 
        }
        particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }

    if (sparkleRef.current) {
      const positions = sparkleRef.current.geometry.attributes.position.array;
      const { speeds, offsets } = sparkleData; 
      const time = state.clock.elapsedTime;

      for (let i = 0; i < sparkleCount; i++) {
        const i3 = i * 3;
        positions[i3 + 1] += delta * speeds[i];
        if (positions[i3 + 1] > 4.0) {
            positions[i3 + 1] = -2.0;
            const r = Math.random() * 3.0;
            const theta = Math.random() * Math.PI * 2;
            positions[i3] = r * Math.cos(theta);
            positions[i3 + 2] = r * Math.sin(theta);
        }
        const turbulence = Math.sin(time * 2.0 + positions[i3 + 1] + offsets[i]) * 0.02;
        const x = positions[i3];
        const z = positions[i3 + 2];
        const rotSpeed = 0.5 * delta;
        positions[i3] = x * Math.cos(rotSpeed) - z * Math.sin(rotSpeed) + turbulence;
        positions[i3 + 2] = x * Math.sin(rotSpeed) + z * Math.cos(rotSpeed) + turbulence;

        const currentDist = Math.sqrt(positions[i3]**2 + positions[i3 + 2]**2);
        if (currentDist > 3.0) {
            const scale = 2.9 / currentDist;
            positions[i3] *= scale;
            positions[i3 + 2] *= scale;
        }
      }
      sparkleRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  const particleTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 32; canvas.height = 32;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(16,16,0,16,16,16);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)'); 
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0,0,32,32);
    return new THREE.CanvasTexture(canvas);
  }, []);

  return (
    <group ref={groupRef} scale={[0,0,0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
        <planeGeometry args={[22, 22]} />
        <shaderMaterial args={[hudShaderArgs]} toneMapped={false} />
      </mesh>
      
      <points ref={particlesRef}>
        <bufferGeometry>
            <bufferAttribute attach="attributes-position" count={particleCount} array={positions} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.2} color="#aaddff" map={particleTexture} transparent opacity={0.6} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
      </points>

      <points ref={sparkleRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={sparkleCount} array={sparkleData.pos} itemSize={3} />
          <bufferAttribute attach="attributes-color" count={sparkleCount} array={sparkleData.col} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial 
          size={0.3} 
          vertexColors={true} 
          map={particleTexture} 
          transparent 
          opacity={0.9} 
          blending={THREE.AdditiveBlending} 
          depthWrite={false} 
          toneMapped={false} 
        />
      </points>
    </group>
  );
}

// --- 5. USER LOGO ---
function UserLogoVideo({ visible }) {
  const meshRef = useRef();
  const materialRef = useRef();

  const START_POS = useMemo(() => new THREE.Vector3(0, 5, 0), []);
  const END_POS = useMemo(() => new THREE.Vector3(0, 5.5, 0), []);

  const hasStartedFlying = useRef(false);

  const texture = useVideoTexture('/logo.mp4', {
      unsuspend: 'canplay',
      muted: true,
      loop: true,
      start: true,
      crossOrigin: 'Anonymous'
  });

  useEffect(() => {
      if (texture && texture.image) {
          texture.image.playbackRate = 1.0;
          texture.minFilter = THREE.LinearFilter;
          texture.magFilter = THREE.LinearFilter;
          texture.needsUpdate = true;
      }
  }, [texture]);

  useFrame((_state, delta) => {
    if (!meshRef.current || !materialRef.current) return;

    if (visible) {
        hasStartedFlying.current = true;
    }

    const targetOpacity = visible ? 1.0 : 0.0;
    materialRef.current.opacity = THREE.MathUtils.lerp(
        materialRef.current.opacity,
        targetOpacity,
        delta * 2.5
    );

    const targetPos = hasStartedFlying.current ? END_POS : START_POS;
    const targetScale = hasStartedFlying.current ? 1.0 : 0.01;

    meshRef.current.position.lerp(targetPos, delta * 0.6);

    const currentScale = meshRef.current.scale.x;
    const newScale = THREE.MathUtils.lerp(currentScale, targetScale, delta * 2.0);
    meshRef.current.scale.set(newScale, newScale, newScale);
  });

  return (
    <group>
      <Billboard follow={true} lockX={false} lockY={false} lockZ={false}>
        <mesh ref={meshRef} position={START_POS} scale={[0.01, 0.01, 0.01]}>
          <planeGeometry args={[20, 12]} />
          <meshBasicMaterial
            ref={materialRef}
            map={texture}
            transparent
            opacity={0}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            side={THREE.DoubleSide}
            toneMapped={false}
          />
        </mesh>
      </Billboard>
    </group>
  );
}

// --- 6a. FLOWING BORDER LIGHT ---
function FlowingBorderLight() {
  const [texture] = useState(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512; canvas.height = 20;
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop(0.0, '#091a4c'); 
    gradient.addColorStop(0.3, '#1f2b43'); 
    gradient.addColorStop(0.45, '#494d0d'); 
    gradient.addColorStop(0.5, '#545704');  
    gradient.addColorStop(0.55, '#7d702a'); 
    gradient.addColorStop(0.7, '#25223ab9'); 
    gradient.addColorStop(1.0, '#4b4f866c'); 
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const alphaGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    alphaGradient.addColorStop(0, 'rgba(0,0,0,0)');
    alphaGradient.addColorStop(0.5, 'rgba(0,0,0,1)');
    alphaGradient.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.globalCompositeOperation = 'destination-in';
    ctx.fillStyle = alphaGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const t = new THREE.CanvasTexture(canvas);
    t.wrapS = THREE.RepeatWrapping;
    t.wrapT = THREE.ClampToEdgeWrapping;
    t.needsUpdate = true;
    return t;
  });

  useFrame((state, delta) => { if (texture) texture.offset.x -= delta * 0.1; });

  return (
    <mesh position={[0, -5, 0]} renderOrder={25}>
      <cylinderGeometry args={[28.05, 28.05, 0.1, 32, 1, true, -Math.PI / 12.3, Math.PI / 6.12]} />    
      <meshBasicMaterial map={texture} color={[2, 2, 2]} transparent side={THREE.DoubleSide} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
    </mesh>
  );
}

function CurvedScreen({ rotation, title, url, imgUrl, setPaused, index, masterPhase, isReturned, onClick, totalScreens = 5 }) {
  const groupRef = useRef();
  const materialRef = useRef();
  const textRef = useRef();
  
  const [hovered, setHover] = useState(false);
  const [texture, setTexture] = useState(null);
  
  useCursor(hovered);

  // Load Textures
  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load(imgUrl, (t) => { t.colorSpace = THREE.SRGBColorSpace; setTexture(t); }, 
    undefined, 
    () => loader.load('https://images.unsplash.com/photo-1551288049-bebda4e38f71', (ft) => setTexture(ft)));
  }, [imgUrl]);

  useEffect(() => { setPaused(hovered); }, [hovered, setPaused]);

  // Fluid Animation Loop driven by the Master Phase
  useFrame((state, delta) => {
    if (!groupRef.current || !materialRef.current) return;
    
    let targetZ = 0;
    let targetScale = 0;
    let targetOpacity = 0;
    let targetGlow = 0;

    if (masterPhase === 0) {
        targetZ = 0; targetScale = 0; targetOpacity = 0; targetGlow = 0;
    } else if (masterPhase === 1) {
        targetZ = 0; targetScale = 1; targetOpacity = 0.8; targetGlow = 1.5;
    } else if (masterPhase === 2) {
        targetZ = 4.0; 
        targetScale = 1.1; 
        targetOpacity = 1.0; 
        targetGlow = 3.5;
    } else if (masterPhase === 3) {
        if (isReturned) {
            targetZ = 0; targetScale = 1; targetOpacity = 0.8; targetGlow = 1.5;
        } else {
            targetZ = 4.0; targetScale = 1.1; targetOpacity = 1.0; targetGlow = 3.5;
        }
    } else if (masterPhase >= 4) {
        // Updated to handle Phase 4 (Idle) and Phase 5 (Navigating)
        targetZ = hovered && masterPhase === 4 ? 1.5 : 0; 
        targetScale = 1;             
        targetOpacity = 0.8;         
        targetGlow = hovered && masterPhase === 4 ? 3.5 : 1.5;
    }

    // Apply smooth exponential ease-out to movement and scale
    groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, targetZ, delta * 5);
    
    const currentScale = groupRef.current.scale.x;
    const nextScale = THREE.MathUtils.lerp(currentScale, targetScale, delta * 5);
    groupRef.current.scale.set(nextScale, nextScale, nextScale);

    // Apply smooth fades to materials
    materialRef.current.opacity = THREE.MathUtils.lerp(materialRef.current.opacity, targetOpacity, delta * 5);
    materialRef.current.emissiveIntensity = THREE.MathUtils.lerp(materialRef.current.emissiveIntensity, targetGlow, delta * 5);

    // Sync Text Opacity
    if (textRef.current && textRef.current.material) {
        textRef.current.material.opacity = materialRef.current.opacity;
        textRef.current.material.transparent = true;
    }
  });

  if (!texture) return null;

  return (
    <group rotation={rotation}>
      <group ref={groupRef} scale={[0, 0, 0]} position={[0, 0, 0]}> 
        <FlowingBorderLight />
        <mesh
          renderOrder={10}
          onPointerOver={(e) => { e.stopPropagation(); if (masterPhase === 4) setHover(true); }}
          onPointerOut={() => setHover(false)}
          onClick={(e) => { e.stopPropagation(); if (onClick) onClick(); else window.open(url, '_blank'); }} 
        >
          <cylinderGeometry args={[28, 28, 10, 32, 1, true, -Math.PI / 12, Math.PI / 6]} />
          <meshPhysicalMaterial
            ref={materialRef} 
            color="#000000" 
            blending={THREE.AdditiveBlending} 
            emissive="#ffffff" 
            emissiveMap={texture} 
            emissiveIntensity={0} 
            transparent={true} 
            opacity={0} 
            depthWrite={false} 
            side={THREE.DoubleSide} 
            metalness={0} 
            roughness={1} 
            transmission={0}
          />
          <Edges threshold={15} scale={1.0} visible={hovered && masterPhase === 4} color="#1f4c5b">
              <meshBasicMaterial transparent opacity={0.00001} toneMapped={false} />
          </Edges>
        </mesh>
        <Text 
          ref={textRef} 
          position={[0, 5.3, 27.8]} 
          fontSize={0.4} 
          color="#72CEEE" 
          anchorX="center" 
          anchorY="middle" 
          toneMapped={false} 
          renderOrder={15}
        >
          {title}
        </Text>
      </group>
    </group>
  );
}

// --- 7. DASHBOARD RIG (UPDATED: Added 360 Spin) ---
function DashboardRig({ visible, onNavigate, targetScreenIndex }) { 
  const spinRef = useRef();
  const [paused, setPaused] = useState(false);
  
  const [phase, setPhase] = useState(0); 
  const [returnedCount, setReturnedCount] = useState(0);
  const rotationAccumulator = useRef(0);
  const navTargetRot = useRef(null); // Ref for tracking the 360 target spin

  const screens = [
    { title: "AI ESTIMATION", img: "/AI_ESTIMATION.jpeg" },
    { title: "SALES", img: "/Sales.jpeg" },
    { title: "AI MARKETING", img: "/AI_Marketing.jpeg" },
    { title: "VIRTUAL SHOWROOM", img: "/Media1.jpg" },
    { title: "AI CONTRACTS", img: "/AI_CONTRACTS.jpg" },
    { title: "AI PLANNING", img: "/AI_Planing.jpeg"},
    { title: "OVERALL PROJECT DASHBOARD", img: "/Data_Analysis.jpeg" },
    { title: "SECURITY", img: "/Security.jpeg" }
  ];

  const anglePerScreen = (Math.PI * 2) / screens.length;

  // Master Sequence Controller
  useEffect(() => {
    if (visible && phase === 0) {
        setPhase(1); // Start rotating together
        setReturnedCount(0);
        rotationAccumulator.current = 0;
    } else if (!visible) {
        setPhase(0);
    }
  }, [visible, phase]);

  // Timeline for Popping & Returning
  useEffect(() => {
    if (phase === 2) {
        const t = setTimeout(() => setPhase(3), 800);
        return () => clearTimeout(t);
    }
    
    if (phase === 3) {
        let count = 0;
        const interval = setInterval(() => {
            count++;
            setReturnedCount(count);
            if (count >= screens.length) {
                clearInterval(interval);
                setTimeout(() => setPhase(4), 500); // Switch to interactive idle phase
            }
        }, 120); 

        return () => clearInterval(interval);
    }
  }, [phase, screens.length]);

  // Handle the new 360 spin animation target calculation (Phase 5)
  useEffect(() => {
    if (targetScreenIndex !== null && phase === 4) {
         setPhase(5);
         const currentRot = spinRef.current.rotation.y;
         const baseTarget = -targetScreenIndex * anglePerScreen;
         let diff = (baseTarget - currentRot) % (Math.PI * 2);
         if (diff < -Math.PI) diff += Math.PI * 2;
         if (diff > Math.PI) diff -= Math.PI * 2;
         
         // Spin 1 extra full round (Math.PI * 2) along with finding the shortest path
         navTargetRot.current = currentRot + diff + (Math.PI * 2);
    } else if (targetScreenIndex === null && phase === 5) {
         setPhase(4);
         navTargetRot.current = null;
    }
  }, [targetScreenIndex, phase, anglePerScreen]);

  useFrame((state, delta) => {
    if (!spinRef.current) return;

    if (phase === 1) {
        const speed = 3.0; 
        const step = speed * delta;
        spinRef.current.rotation.y += step;
        rotationAccumulator.current += step;

        if (rotationAccumulator.current >= Math.PI * 2) {
            spinRef.current.rotation.y = 0; 
            setPhase(2); 
        }
    } 
    else if (phase === 4) {
        if (!paused) {
            spinRef.current.rotation.y += delta * 0.08; 
        }
    }
    else if (phase === 5 && navTargetRot.current !== null) {
        // Fast, smooth interpolation to the full 360 target 
        spinRef.current.rotation.y = THREE.MathUtils.lerp(
            spinRef.current.rotation.y,
            navTargetRot.current,
            delta * 2.5
        );
    }
  });

  return (
    <group position={[0, 5.3, 0]}> 
      <group ref={spinRef}>
        {screens.map((screen, index) => {
          const angle = index * anglePerScreen;
          
          let handleClick = null;
          if (screen.title === "AI ESTIMATION") {
              handleClick = () => onNavigate(index, 'estimation');
          } else if (screen.title === "OVERALL PROJECT DASHBOARD") {
              handleClick = () => onNavigate(index, 'dataAnalysis');
          // ---> ADD THIS LINE <---
          } else if (screen.title === "VIRTUAL SHOWROOM") {
              handleClick = () => onNavigate(index, 'VIRTUAL SHOWROOM'); 
          } else if (screen.title === "AI MARKETING") {
              handleClick = () => onNavigate(index, 'New SHOWROOM'); 
          }
           else if (screen.title === "AI CONTRACTS") {
              handleClick = () => onNavigate(index, 'AI CONTRACTS'); 
          }
          

          return (
            <CurvedScreen
              key={index}
              index={index}
              totalScreens={screens.length}
              masterPhase={phase}
              isReturned={index < returnedCount}
              rotation={[0, angle, 0]}
              title={screen.title}
              url="https://www.google.com" 
              imgUrl={screen.img}
              setPaused={setPaused}
              onClick={handleClick}
            />
          );
        })}
      </group>
    </group>
  );
}

// --- CAMERA RIG ---
function CameraRig({ isZooming }) {
  const { controls, camera, size } = useThree(); 
  
  useEffect(() => {
    const aspect = size.width / size.height;
    if (aspect < 1.77) {
      camera.fov = 45 * (1.77 / aspect);
    } else {
      camera.fov = 45; 
    }
    camera.updateProjectionMatrix();
  }, [size, camera]);

  useFrame((state, delta) => {
      if (isZooming) {
          if (controls) controls.enabled = false;
          camera.position.lerp(new THREE.Vector3(0, 5, 38), delta * 2.5);
          camera.lookAt(0, 5, 0); 
      } else {
          if (controls) {
              controls.enabled = true;
              controls.enableZoom = false; 
              controls.enablePan = false;
              controls.target.set(...CIRCLE_POSITION);
          }
      }
  });
  return null;
}

// --- CURVED TEXT ---
function CurvedOrbitText({ visible }) {
  const groupRef = useRef();
  
  const text = "AI APEX";
  const radius = 4; 
  const letters = text.split('');
  
  const angleStep = 0.2; 
  const totalAngle = (letters.length - 1) * angleStep;
  const startAngle = -totalAngle / 2; 

  const [ringTexture] = useState(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512; canvas.height = 20;
    const ctx = canvas.getContext('2d');
    
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop(0.0, '#091a4c'); 
    gradient.addColorStop(0.3, '#1f2b43'); 
    gradient.addColorStop(0.5, '#545704');  
    gradient.addColorStop(0.7, '#1f2b43'); 
    gradient.addColorStop(1.0, '#091a4c'); 
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const alphaGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    alphaGradient.addColorStop(0, 'rgba(0,0,0,0)');
    alphaGradient.addColorStop(0.5, 'rgba(0,0,0,1)');
    alphaGradient.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.globalCompositeOperation = 'destination-in';
    ctx.fillStyle = alphaGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const t = new THREE.CanvasTexture(canvas);
    t.wrapS = THREE.RepeatWrapping; 
    t.wrapT = THREE.ClampToEdgeWrapping;
    t.needsUpdate = true;
    return t;
  });

  useFrame((state, delta) => {
    if (groupRef.current) {
        const cameraAngle = Math.atan2(
          state.camera.position.x,
          state.camera.position.z
        );
        groupRef.current.rotation.y = cameraAngle - (state.clock.elapsedTime * 0.5); 
    }
    if (ringTexture) {
        ringTexture.offset.x -= delta * 0.1;
    }
  });

  return (
    <group ref={groupRef} position={[0, -1.9, 0]}> 
      {letters.map((char, i) => {
        const angle = startAngle + (i * angleStep);
        const x = Math.sin(angle) * radius;
        const z = Math.cos(angle) * radius;

        return (
          <Text
            key={i}
            position={[x, 0, z]}
            rotation={[0, angle, 0]} 
            fontSize={1}
            fontWeight={200}
            font="https://fonts.gstatic.com/s/roboto/v18/KFOmCnqEu92Fr1Mu4mxM.woff"
            anchorX="center"
            anchorY="middle"
            fillOpacity={visible ? 0.1 : 0} 
            toneMapped={false}
            color={new THREE.Color("#5c99bf").multiplyScalar(15)} 
            renderOrder={100}
          >
            {char}
          </Text>
        );
      })}

      <mesh position={[0, 0.6, 0]} rotation={[0, Math.PI / 2, 0]}> 
         <cylinderGeometry args={[4, 4, 0.04, 64, 1, true, 0, Math.PI * 2]} />
         <meshBasicMaterial 
           map={ringTexture} 
           color={[2, 2, 2]} 
           transparent 
           side={THREE.DoubleSide} 
           blending={THREE.AdditiveBlending} 
           depthWrite={false} 
           toneMapped={false}  
           opacity={visible ? 1 : 0} 
           //opacity={0} 
         />
      </mesh>

      <mesh position={[0, -0.6, 0]} rotation={[0, Math.PI / 2, 0]}>
         <cylinderGeometry args={[4, 4, 0.04, 64, 1, true, 0, Math.PI * 2]} />
         <meshBasicMaterial 
           map={ringTexture} 
           color={[2, 2, 2]} 
           transparent 
           side={THREE.DoubleSide} 
           blending={THREE.AdditiveBlending} 
           depthWrite={false} 
           toneMapped={false}  
           opacity={visible ? 1 : 0} 
           //opacity={0} 
         />
      </mesh>
    </group>
  );
}

// --- TECHNOLOGY PARTICLES BACKGROUND ---
function TechParticleBackground({ visible }) {
  const lockRef = useRef(); 
  const spinRef = useRef(); 
  const materialRef = useRef();
  const particleCount = 800;

  const { positions, colors, sizes, speeds, offsets } = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const col = new Float32Array(particleCount * 3);
    const size = new Float32Array(particleCount);
    const speed = new Float32Array(particleCount);
    const offset = new Float32Array(particleCount);

    const colorBlue = new THREE.Color('#0aa1ff'); 
    const colorGold = new THREE.Color('#ffcc00').multiplyScalar(2.5); 
    const colorCyan = new THREE.Color('#72CEEE'); 

    for (let i = 0; i < particleCount; i++) {
      const r = 30 + Math.random() * 50; 
      const theta = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * 120; 

      pos[i * 3] = r * Math.cos(theta);
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = r * Math.sin(theta);

      const randColor = Math.random();
      let mixedColor = colorBlue;
      if (randColor > 0.7) mixedColor = colorGold;
      else if (randColor > 0.3) mixedColor = colorCyan;

      col[i * 3] = mixedColor.r;
      col[i * 3 + 1] = mixedColor.g;
      col[i * 3 + 2] = mixedColor.b;

      size[i] = 1 + Math.random() * 1.0;        
      speed[i] = 0.5 + Math.random() * 3.0;        
      offset[i] = Math.random() * Math.PI * 2;     
    }
    return { positions: pos, colors: col, sizes: size, speeds: speed, offsets: offset };
  }, []);

  const particleTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 64; canvas.height = 64;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.1, 'rgba(255, 255, 255, 0.8)');
    grad.addColorStop(0.4, 'rgba(255, 255, 255, 0.2)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(canvas);
  }, []);

  const shaderArgs = useMemo(() => ({
    uniforms: {
      uTime: { value: 0 },
      uTexture: { value: particleTexture },
      uGlobalOpacity: { value: 0 }
    },
    vertexShader: `
      uniform float uTime;
      attribute float aSize;
      attribute float aSpeed;
      attribute float aOffset;
      attribute vec3 color;
      
      varying vec3 vColor;
      varying float vAlpha;

      void main() {
        vColor = color;
        
        float flash = sin(uTime * aSpeed + aOffset);
        vAlpha = smoothstep(0.4, 1.0, flash); 
        
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * mvPosition;
        
        gl_PointSize = aSize * (200.0 / -mvPosition.z) * (0.5 + vAlpha * 0.5);
      }
    `,
    fragmentShader: `
      uniform sampler2D uTexture;
      uniform float uGlobalOpacity;
      
      varying vec3 vColor;
      varying float vAlpha;

      void main() {
        if (vAlpha < 0.01 || uGlobalOpacity < 0.01) discard;
        
        vec4 texColor = texture2D(uTexture, gl_PointCoord);
        
        gl_FragColor = vec4(vColor * texColor.rgb, texColor.a * vAlpha * uGlobalOpacity);
      }
    `,
    transparent: true,
    blending: THREE.NormalBlending,
    depthWrite: false,
  }), [particleTexture]);

  useFrame((state, delta) => {
    if (lockRef.current) {
      //lockRef.current.position.copy(state.camera.position);
      //lockRef.current.quaternion.copy(state.camera.quaternion);
    }
    
    if (spinRef.current) {
      spinRef.current.rotation.y += delta * 0.015;
    }
    
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      
      const targetOpacity = visible ? 0.3 : 0; 
      materialRef.current.uniforms.uGlobalOpacity.value = THREE.MathUtils.lerp(
        materialRef.current.uniforms.uGlobalOpacity.value, 
        targetOpacity, 
        delta * 2
      );
    }
  });

  return (
    <group ref={lockRef}>
      <group ref={spinRef}>
        <points renderOrder={-10}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" count={particleCount} array={positions} itemSize={3} />
            <bufferAttribute attach="attributes-color" count={particleCount} array={colors} itemSize={3} />
            <bufferAttribute attach="attributes-aSize" count={particleCount} array={sizes} itemSize={1} />
            <bufferAttribute attach="attributes-aSpeed" count={particleCount} array={speeds} itemSize={1} />
            <bufferAttribute attach="attributes-aOffset" count={particleCount} array={offsets} itemSize={1} />
          </bufferGeometry>
          <shaderMaterial 
            ref={materialRef}
            args={[shaderArgs]}
            toneMapped={false}
          />
        </points>
      </group>
    </group>
  );
}

// --- HOLOGRAPHIC RINGS FLOOR (Fiery Core & 30% Black) ---
function HolographicRingsFloor({ visible }) {
  const materialRef = useRef();

  const shaderArgs = useMemo(() => ({
    uniforms: {
      uTime: { value: 0 },
      uOpacity: { value: 0 },
      uColorFire: { value: new THREE.Color('#0077ff') },   // Intense bright fiery orange
      uColorDark: { value: new THREE.Color('#0a0200') },   // Deep near-black (with a tiny hint of red)
      uColorGlow: { value: new THREE.Color('#cfdb2f') }    // Deep, spreading red/orange ambient glow
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform float uOpacity;
      uniform vec3 uColorFire;
      uniform vec3 uColorDark;
      uniform vec3 uColorGlow;
      
      varying vec2 vUv;

      void main() {
        // Shift UVs to center
        vec2 uv = vUv * 2.0 - 1.0;
        float dist = length(uv);
        float angle = atan(uv.y, uv.x);

        // --- 1. Center Core & Glow (INCREASED SIZE) ---
        // A much larger, brighter central light
        float core = 0.05 / (dist * dist + 0.008); 
        core *= smoothstep(0.4, 0.0, dist); // Expanded radius from 0.2 to 0.4
        
        // Wider, more intense ambient fire glow spreading outward
        float wideGlow = exp(-dist * 3.5) * 1.8; 

        // --- 2. 70% Fire / 30% Black Rings ---
        // Create repeating rings
        float ringPattern = fract(dist * 20.0 - uTime * 0.4);
        
        // step(0.3, ...) means 70% of the ring is 1.0 (Fire), and 30% is 0.0 (Black)
        float isFire = step(0.3, ringPattern); 
        
        // Specific sharp prominent rings to frame it
        float ring1 = smoothstep(0.015, 0.0, abs(dist - 0.35)) * 1.5;
        float ring2 = smoothstep(0.02, 0.0, abs(dist - 0.6));
        float outerRing = smoothstep(0.03, 0.0, abs(dist - 0.85)) * 2.0;

        // --- 3. Dashed Tracks ---
        float dashPattern = step(0.5, sin(angle * 40.0 + uTime * 2.5));
        float dashedRing = smoothstep(0.015, 0.0, abs(dist - 0.45)) * dashPattern;

        // --- Combine ---
        // Mix the colors: if 'isFire' is 1, it's fire orange. If 0, it's black.
        vec3 baseRingColor = mix(uColorDark, uColorFire, isFire);
        
        // Boost brightness where the prominent rings are
        float highlights = ring1 + ring2 + outerRing + dashedRing;
        vec3 finalColor = (uColorFire * core) + 
                          (uColorGlow * wideGlow) + 
                          (baseRingColor * 0.4) + 
                          (uColorFire * highlights);

        // Fade out smoothly at the very edge of the mesh so it blends into the background
        float edgeMask = smoothstep(1.0, 0.7, dist);

        // Alpha encompasses the much larger core and glow
        float alpha = clamp(core + wideGlow + 0.5 + highlights, 0.0, 1.0) * edgeMask;

        gl_FragColor = vec4(finalColor, alpha * uOpacity * 0.1);
      }
    `,
    transparent: true,
    blending: THREE.NormalBlending, 
    depthWrite: false,
    toneMapped: false,
    side: THREE.DoubleSide
  }), []);

  useFrame((state, delta) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      const targetOpacity = visible ? 1.0 : 0.0;
      materialRef.current.uniforms.uOpacity.value = THREE.MathUtils.lerp(
        materialRef.current.uniforms.uOpacity.value,
        targetOpacity,
        delta * 2.5
      );
    }
  });

  return (
    // Slightly increased from 12 to 14 so the bigger light has room to fade smoothly
    <mesh position={[0, -1.98, 0]} rotation={[-Math.PI / 2, 0, 0]} renderOrder={1}>
      <planeGeometry args={[14, 14]} />
      <shaderMaterial ref={materialRef} args={[shaderArgs]} />
    </mesh>
  );
}

// --- 8. MAIN SCENE CONTENT ---
function MainSceneContent({ triggerAnimation, onNavigate, targetScreenIndex }) {
  const [visibleItems, setVisibleItems] = useState({ 
      floor: false, 
      screens: false, 
      logo: false, 
      text: false       
  });

  useEffect(() => {
  if (!triggerAnimation) return; 

  const t1 = setTimeout(() =>
    setVisibleItems(prev => ({ ...prev, floor: true })), 0);

  const t2 = setTimeout(() =>
    setVisibleItems(prev => ({ ...prev, logo: true })), 200);

  const t3 = setTimeout(() =>
    setVisibleItems(prev => ({ ...prev, screens: true })), 400);

  const t4 = setTimeout(() =>
    setVisibleItems(prev => ({ ...prev, text: true })), 600);

  

  return () => { 
    clearTimeout(t1);
    clearTimeout(t2);
    clearTimeout(t3);
    clearTimeout(t4);
  };
}, [triggerAnimation]);


  return (
    <>
      <TechParticleBackground visible={visibleItems.floor} />
      <CentralVideo visible={visibleItems.floor} />
      {/*<HolographicRingsFloor visible={visibleItems.floor} />*/}
      {/*<HolographicOverlay visible={visibleItems.floor} /> */}
      <UserLogoVideo visible={visibleItems.logo} />
      <CurvedOrbitText visible={visibleItems.text} />
      <DashboardRig 
        visible={visibleItems.screens} 
        onNavigate={onNavigate} 
        targetScreenIndex={targetScreenIndex} 
      />
    </>
  );
}


// --- INTRO SCREEN ---
const IntroScreen = ({ onDone }) => {
  const [phase, setPhase] = useState('enter'); // 'enter' | 'exit'

  useEffect(() => {
    // beam 0.2s delay + 1.8s travel = 2.0s, then fade 0.5s = 2.5s total
    const exitTimer = setTimeout(() => setPhase('exit'), 2000);
    const doneTimer = setTimeout(() => onDone(), 2500);
    return () => { clearTimeout(exitTimer); clearTimeout(doneTimer); };
  }, [onDone]);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 999999,
      background: '#000',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      animation: phase === 'exit' ? 'intro-fade-out 0.5s ease-in forwards' : 'none',
      pointerEvents: 'none',
      overflow: 'hidden',
    }}>
      <style>{`
        @keyframes intro-fade-out {
          0%   { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes beam-across {
          0%   { transform: translateX(-90px); }
          100% { transform: translateX(calc(100vw + 90px)); }
        }
        .intro-naffco {
          font-family: 'Rajdhani', 'Orbitron', 'Segoe UI', sans-serif;
          font-size: clamp(52px, 8vw, 110px);
          font-weight: 900;
          letter-spacing: -0.04em;
          line-height: 1;
          color: #8a0000;
          display: inline-block;
        }
        .intro-apex {
          font-family: 'Rajdhani', 'Orbitron', 'Segoe UI', sans-serif;
          font-size: clamp(52px, 8vw, 110px);
          font-weight: 300;
          letter-spacing: -0.04em;
          line-height: 1;
          color: #9090a2;
          display: inline-block;
          margin-left: 0.15em;
        }
        .intro-tagline {
          font-family: 'Rajdhani', 'Orbitron', 'Segoe UI', sans-serif;
          font-size: clamp(13px, 1.6vw, 22px);
          font-weight: 500;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          color: #606060;
          margin-top: 10px;
        }
        .intro-beam {
          position: fixed;
          top: 0; bottom: 0; left: 0;
          width: 80px;
          background: linear-gradient(
            90deg,
            transparent              0%,
            rgba(255,255,255,0.55)  35%,
            rgba(255,255,255,1.00)  50%,
            rgba(255,255,255,0.55)  65%,
            transparent             100%
          );
          mix-blend-mode: overlay;
          animation: beam-across 1.8s linear 0.2s both;
          pointer-events: none;
        }
      `}</style>
      <div style={{ display: 'flex', alignItems: 'baseline' }}>
        <span className="intro-naffco">NAFFCO</span>
        <span className="intro-apex">AI APEX</span>
      </div>
      <div className="intro-tagline">Passion to Protect</div>
      <div className="intro-beam" />
    </div>
  );
};

export default function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [appState, setAppState] = useState('active');
  const [targetIndex, setTargetIndex] = useState(null);
  const handleIntroDone = useCallback(() => setShowIntro(false), []);

  const handleNavigation = (index, destination) => {
      setTargetIndex(index);
      setTimeout(() => {
          setAppState(destination); 
          setTargetIndex(null);
      }, 2500); 
  };

  const backToHome = () => {
      setAppState('active');
      setTargetIndex(null); 
  };

  const startAnimations = ['active', 'estimation', 'dataAnalysis', 'VIRTUAL SHOWROOM','New SHOWROOM', 'AI CONTRACTS'].includes(appState);
  const isZooming = targetIndex !== null; 
  const shouldMountCanvas = appState === 'active';

  return (
    <>
      {showIntro && <IntroScreen onDone={handleIntroDone} />}
<div style={mainBackgroundStyle}></div>
      <TouchFeedback />

      {appState === 'estimation' && (
        <AIEstimation onBack={backToHome} onNavigate={(state) => setAppState(state)} />
      )}

      {appState === 'dataAnalysis' && (
        <DataDashboard onBack={backToHome} />
      )}

      {appState === 'VIRTUAL SHOWROOM' && (
        <VirtualShowroomDashboard onBack={backToHome} />
      )}

      {appState === 'New SHOWROOM' && (
        <NewShowroom onBack={backToHome} />
      )}

      {appState === 'AI CONTRACTS' && (
        <AIContract onBack={backToHome} />
      )}

      {shouldMountCanvas && (
        <div style={canvasContainerStyle}>
          <Canvas
            dpr={[1, 1.5]}
            gl={{ alpha: true, antialias: false, toneMapping: THREE.NoToneMapping }}
            onCreated={({ gl}) => { 
                gl.setClearColor(new THREE.Color(0x000000), 0); 
            }}
            style={{ background: 'transparent', pointerEvents: 'auto' }}
          >
            <PerspectiveCamera makeDefault position={[0, 25, 43.1]} fov={45} />
            
            <OrbitControls 
                makeDefault 
                enableZoom={false} 
                enablePan={false} 
                enableRotate={true}
                rotateSpeed={0.2} 
                mouseButtons={{
                    LEFT: THREE.MOUSE.ROTATE,
                    MIDDLE: null,
                    RIGHT: null
                }}
                touches={{
                    ONE: THREE.TOUCH.ROTATE,
                    TWO: null
                }}
                maxPolarAngle={Math.PI / 2.5} 
                minPolarAngle={Math.PI / 2.5} 
                target={[0, 5, 0]}
            />
            
            <CameraRig isZooming={isZooming} />
            
            <group position={CIRCLE_POSITION}>
                <Suspense fallback={null}>
                    <MainSceneContent 
                        triggerAnimation={startAnimations} 
                        onNavigate={handleNavigation}
                        targetScreenIndex={targetIndex} 
                    />
                </Suspense>
            </group>
            
            <EffectComposer disableNormalPass>
              <Bloom luminanceThreshold={0.5} mipmapBlur intensity={1.5} radius={0.5} />
              <DepthOfField
                target={[0, 5, 29]} 
                focalLength={0.3}   
                bokehScale={isZooming ? 10 : 0} 
                height={700}
              />
            </EffectComposer>

            <Preload all />

          </Canvas>
        </div>
      )}
    </>
  );
}