import React, { useRef, useEffect, useState, Suspense, useMemo, useCallback } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
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
import SalesForm from './pages/SalesForm.jsx';
import VirtualShowroomDashboard from './pages/VirtualShowroomDashboard.jsx';
import NewShowroom from './pages/NewShowroom.jsx';
import AIContract from './pages/AIContract.jsx';
import DummyHub from './pages/DummyHub.jsx';
import AIHeroSection from './pages/AIHeroSection.jsx';

const ARScene = React.lazy(() => import('./ARScene.jsx'));

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


// --- UNDER CONSTRUCTION SCREEN ---
const ConstructionScreen = ({ deptId, onBack }) => {
  const colors = { contracts: '#60a5fa', engineering: '#34d399' };
  const labels = { contracts: 'Contracts', engineering: 'Engineering' };
  const color = colors[deptId] || '#a78bfa';
  const label = labels[deptId] || deptId;
  return (
    <div style={{position:'fixed',inset:0,background:'#010106',display:'flex',flexDirection:'column',
      alignItems:'center',justifyContent:'center',fontFamily:"'Inter',sans-serif",zIndex:200}}>
      <div style={{position:'absolute',inset:0,background:`radial-gradient(ellipse 60% 50% at 50% 50%, ${color}12 0%, transparent 70%)`,pointerEvents:'none'}}/>
      <button onClick={onBack} style={{position:'absolute',top:28,left:36,background:'none',border:'none',
        cursor:'pointer',color:'rgba(255,255,255,0.35)',fontSize:'0.75rem',letterSpacing:'0.14em',
        textTransform:'uppercase',display:'flex',alignItems:'center',gap:6,padding:0,transition:'color 0.2s'}}
        onMouseEnter={e=>e.currentTarget.style.color='rgba(255,255,255,0.75)'}
        onMouseLeave={e=>e.currentTarget.style.color='rgba(255,255,255,0.35)'}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        Back
      </button>
      {/* Animated ring */}
      <div style={{position:'relative',width:100,height:100,marginBottom:36}}>
        <div style={{position:'absolute',inset:0,borderRadius:'50%',
          background:`conic-gradient(from 0deg, ${color} 0deg, transparent 120deg, transparent 240deg, ${color} 360deg)`,
          animation:'spin360 3s linear infinite',opacity:0.6}}/>
        <div style={{position:'absolute',inset:6,borderRadius:'50%',background:'#010106',
          display:'flex',alignItems:'center',justifyContent:'center'}}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.85">
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
          </svg>
        </div>
      </div>
      <div style={{fontSize:'0.6rem',letterSpacing:'0.32em',textTransform:'uppercase',color:'rgba(255,255,255,0.28)',marginBottom:12}}>{label} Module</div>
      <div style={{fontSize:'clamp(1.6rem,3vw,2.6rem)',fontWeight:800,letterSpacing:'0.08em',textTransform:'uppercase',
        background:`linear-gradient(135deg, #fff 0%, ${color} 60%, rgba(255,255,255,0.5) 100%)`,
        WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text',
        marginBottom:14}}>Under Construction</div>
      <div style={{fontSize:'0.8rem',color:'rgba(255,255,255,0.35)',letterSpacing:'0.06em',maxWidth:320,textAlign:'center',lineHeight:1.7}}>
        This module is being built and will be available soon. Stay tuned.
      </div>
      <style>{`@keyframes spin360{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
};

// --- HOME SCREEN ---
const HomeScreen = ({ onAccepted, onDirect }) => {
  const [phase, setPhase]       = useState('select'); // 'select' | 'code'
  const [selDept, setSelDept]   = useState(null);
  const [quickView, setQuickView] = useState(null);
  const [showAR, setShowAR] = useState(false);
  const [code, setCode]         = useState('');
  const [showCode, setShowCode] = useState(false);
  const [shake, setShake]       = useState(false);
  const [errMsg, setErrMsg]     = useState('');
  const inputRef = useRef(null);

  // ── Shortcut code prompts (logo / AR / My Dashboard) ──
  const [codePrompt, setCodePrompt] = useState(null); // 'costArtist'|'arViewer'|'myDash'
  const [promptCode, setPromptCode] = useState('');
  const [promptShow, setPromptShow] = useState(false);
  const [promptShake, setPromptShake] = useState(false);
  const [promptErr, setPromptErr]   = useState('');
  const promptRef = useRef(null);

  const PROMPT_CFG = {
    costArtist: { label:'Cost Artist',   hint:'Enter cost-artist code', correct:'STAR',
      onSuccess: () => onAccepted('estimation','director','STAR','Cost Artist',null) },
    arViewer:   { label:'AR Viewer',     hint:'Enter AR viewer code',   correct:'ARV',
      onSuccess: () => onDirect('arViewer', null) },
  };

  const openPrompt = (type) => {
    setCodePrompt(type); setPromptCode(''); setPromptErr(''); setPromptShow(false);
    setTimeout(() => promptRef.current?.focus(), 80);
  };
  const closePrompt = () => { setCodePrompt(null); setPromptCode(''); setPromptErr(''); };
  const submitPrompt = (e) => {
    e?.preventDefault();
    const entered = promptCode.trim().toUpperCase();
    if (!entered) return;
    const cfg = PROMPT_CFG[codePrompt];
    if (entered === cfg.correct) { closePrompt(); cfg.onSuccess(); }
    else {
      setPromptErr('Invalid code');
      setPromptShake(true);
      setTimeout(() => { setPromptShake(false); setPromptCode(''); setPromptErr(''); }, 620);
    }
  };

  const SALES_CODES = ['SX985','SX417','SE628','SE842','SE519','SM386'];
  const EST_CODES   = ['EX552','EX719','EX638','EX904','EX471','EX856','EX392','EX681','EX547','EX903','EX764'];

  const depts = [
    {
      id: 'sales', label: 'Sales & Marketing', hint: 'Enter sales code',
      desc: 'Pipeline, CRM & marketing', color: '#f59e0b', glow: 'rgba(245,158,11,0.35)',
      icon: (c) => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>
        </svg>
      ),
    },
    {
      id: 'estimation', label: 'Estimation', hint: 'Enter estimation code',
      desc: 'Cost analysis & quotations', color: '#a78bfa', glow: 'rgba(167,139,250,0.35)',
      icon: (c) => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="7" x2="16" y2="7"/><line x1="8" y1="11" x2="14" y2="11"/><line x1="8" y1="15" x2="11" y2="15"/>
        </svg>
      ),
    },
    {
      id: 'contracts', label: 'Contracts', desc: 'Document & legal management',
      color: '#60a5fa', glow: 'rgba(96,165,250,0.25)',
      icon: (c) => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
          <path d="M9 13h6M9 17h4"/>
        </svg>
      ),
    },
    {
      id: 'engineering', label: 'Engineering', desc: 'Design, systems & technical',
      color: '#34d399', glow: 'rgba(52,211,153,0.25)',
      icon: (c) => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3"/>
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14M12 2v2M12 20v2M2 12h2M20 12h2"/>
        </svg>
      ),
    },
  ];

  const pickDept = (dept, qv = null) => {
    if (dept.id === 'contracts' || dept.id === 'engineering') {
      onDirect('construction', dept.id);
      return;
    }
    if (dept.id === 'estimation') {
      onDirect('estimation', null);
      return;
    }
    setSelDept(dept);
    setQuickView(qv);
    setCode('');
    setErrMsg('');
    setPhase('code');
    setTimeout(() => inputRef.current?.focus(), 80);
  };

  const doShake = (msg) => {
    setErrMsg(msg);
    setShake(true);
    setTimeout(() => { setShake(false); setCode(''); }, 620);
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    const entered = code.trim().toUpperCase();
    if (!entered) return;
    if (entered === '9993') { onAccepted('active', null, '9993', '', null); return; }
    if (entered === 'ARV')  { onDirect('arViewer', null); return; }
    if (selDept.id === 'sales') {
      if (SALES_CODES.includes(entered) || entered === 'MYD') onAccepted('estimation', 'sales', entered, '', quickView);
      else doShake('Invalid sales code');
    } else if (selDept.id === 'estimation') {
      if (EST_CODES.includes(entered))   onAccepted('estimation', 'estimator', entered, 'Estimator',  quickView);
      else if (entered === 'STAR')       onAccepted('estimation', 'director',  entered, 'Cost Artist', quickView);
      else doShake('Invalid code');
    }
  };

  const quickActions = [
    { label: 'Request a New Quote',  view: 'form' },
    { label: 'Revised Request',      view: 'revisedSearch' },
    { label: 'Final Price Request',  view: 'finalPriceSearch' },
  ];

  return (
    <div style={{
      position:'fixed', inset:0, zIndex:200,
      background:"url('/AI_ESTIMATION1.jpeg') center/cover no-repeat",
      fontFamily:"'Inter',sans-serif", color:'#e2e8f0', overflow:'hidden',
    }}>
      <style>{`
        @keyframes hs-aurora   { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
        @keyframes hs-fadeUp   { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes hs-shake    { 0%{transform:translateX(0)} 15%{transform:translateX(-10px)} 30%{transform:translateX(10px)} 45%{transform:translateX(-8px)} 60%{transform:translateX(8px)} 75%{transform:translateX(-4px)} 90%{transform:translateX(4px)} 100%{transform:translateX(0)} }
        @keyframes hs-errPulse { 0%{box-shadow:0 0 0 rgba(220,30,30,0)} 50%{box-shadow:0 0 22px rgba(220,30,30,0.7)} 100%{box-shadow:0 0 8px rgba(220,30,30,0.3)} }
        @keyframes hs-sheen    { 0%,100%{left:-80%} 50%{left:120%} }

        /* layout */
        .hs-land  { position:relative;width:100%;height:100%;display:flex;padding-top:52px }
        .hs-left  { width:50%;height:100%;display:flex;flex-direction:column;justify-content:center;padding:0 3vw 0 10vw;position:relative;z-index:10 }
        .hs-right { width:56%;height:100%;position:relative;overflow:hidden }

        /* top-left branding (absolute) */
        .hs-topbrand {
          position:absolute; top:28px; left:40px; z-index:30;
          display:flex; flex-direction:column; gap:1px;
          animation: hs-fadeUp 0.5s ease both;
        }
        .hs-topbrand-naffco {
          font-size:clamp(0.78rem,1vw,0.95rem); font-weight:500; letter-spacing:0.28em;
          text-transform:uppercase; line-height:1;
          background:linear-gradient(105deg,#1e1b6e 0%,#3730a3 18%,#6d28d9 36%,#a855f7 50%,#ec4899 66%,#f97316 82%,#fbbf24 100%);
          background-size:250% auto; -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
          filter:drop-shadow(0 1px 8px rgba(109,40,217,0.5));
          animation:hs-aurora 6s ease infinite;
        }
        .hs-topbrand-sub {
          font-size:clamp(0.52rem,0.65vw,0.62rem); font-weight:400; letter-spacing:0.38em;
          text-transform:uppercase; color:rgba(255,255,255,0.28);
        }

        /* page title */
        .hs-title { font-size:clamp(2.1rem,4vw,4rem);font-weight:800;letter-spacing:0.06em;text-transform:uppercase;line-height:1.1;margin-bottom:10px;
          background:linear-gradient(105deg,#1e1b6e 0%,#3730a3 18%,#6d28d9 36%,#a855f7 50%,#ec4899 66%,#f97316 82%,#fbbf24 100%);
          background-size:220% 220%;
          -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
          filter:drop-shadow(0 2px 16px rgba(109,40,217,0.55));
          animation:hs-aurora 6s ease infinite; }
        .hs-sub { font-size:0.82rem;letter-spacing:0.04em;margin-bottom:24px;font-weight:400;line-height:1.7;max-width:280px;
          background:linear-gradient(135deg,rgba(255,255,255,0.85) 0%,rgba(200,220,255,0.65) 40%,rgba(255,255,255,0.45) 65%,rgba(180,210,255,0.70) 100%);
          -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text; }

        /* ── 2×2 tile grid ── */
        .hs-tiles {
          display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:24px;
        }
        .hs-tile {
          position:relative; overflow:hidden;
          display:flex; flex-direction:column; align-items:flex-start; gap:12px;
          background:rgba(6,4,22,0.88);
          border:1px solid rgba(255,255,255,0.08);
          border-radius:14px;
          padding:20px 14px 16px;
          cursor:pointer; color:#e8eeff; text-align:left;
          font-family:'Inter',sans-serif;
          transition:transform 0.30s cubic-bezier(0.22,1,0.36,1), box-shadow 0.30s, border-color 0.30s;
        }
        /* top dept-color gradient stripe */
        .hs-tile::before {
          content:''; position:absolute; top:0; left:0; right:0; height:2px;
          background:linear-gradient(90deg, transparent, var(--tc), transparent);
          opacity:0.5; border-radius:14px 14px 0 0; transition:opacity 0.30s;
        }
        /* diagonal sweep shimmer */
        .hs-tile::after {
          content:''; position:absolute; top:-60%; left:-130%; width:55%; height:220%;
          background:linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.07) 50%, transparent 70%);
          transform:skewX(-10deg);
          animation:hs-sweep 5s ease-in-out infinite; animation-delay:var(--td,0s);
        }
        @keyframes hs-sweep { 0%{left:-130%} 55%{left:180%} 100%{left:180%} }
        .hs-tile:hover:not([disabled]) {
          transform:translateY(-7px) scale(1.015);
          border-color:rgba(255,255,255,0.18);
          box-shadow:0 18px 48px var(--tg, rgba(0,0,0,0.4)), 0 0 0 1px rgba(255,255,255,0.06) inset;
        }
        .hs-tile:hover::before { opacity:1; }
        .hs-tile[disabled] { opacity:0.35; cursor:default; }
        /* coming-soon overlay — fades in on hover/focus */
        .hs-soon-overlay {
          position:absolute; inset:0; border-radius:14px;
          display:flex; align-items:center; justify-content:center;
          background:rgba(6,4,22,0.72);
          opacity:0; pointer-events:none;
          transition:opacity 0.55s ease;
        }
        .hs-tile[disabled]:hover .hs-soon-overlay,
        .hs-tile[disabled]:focus  .hs-soon-overlay { opacity:1; }
        .hs-soon-text {
          font-family:'Inter',sans-serif; font-size:0.72rem; font-weight:500;
          letter-spacing:0.22em; text-transform:uppercase;
          color:rgba(255,255,255,0.55);
          border:1px solid rgba(255,255,255,0.15); border-radius:6px;
          padding:5px 12px;
        }
        /* corner brackets */
        .hs-cb-tl, .hs-cb-br {
          position:absolute; width:11px; height:11px;
          border-color:var(--tc); border-style:solid; opacity:0.55;
          transition:opacity 0.3s, width 0.3s, height 0.3s;
        }
        .hs-cb-tl { top:7px; left:7px; border-width:1.5px 0 0 1.5px; border-radius:4px 0 0 0; }
        .hs-cb-br { bottom:7px; right:7px; border-width:0 1.5px 1.5px 0; border-radius:0 0 4px 0; }
        .hs-tile:hover .hs-cb-tl, .hs-tile:hover .hs-cb-br { opacity:1; width:16px; height:16px; }
        /* spinning icon ring */
        .hs-icon-wrap { position:relative; width:44px; height:44px; flex-shrink:0; }
        .hs-icon-ring {
          position:absolute; inset:-2px; border-radius:11px;
          background:conic-gradient(from 0deg, var(--tc) 0deg, transparent 100deg, transparent 260deg, var(--tc) 360deg);
          animation:hs-spin 3.5s linear infinite; animation-delay:var(--td,0s); opacity:0.65;
        }
        @keyframes hs-spin { to { transform:rotate(360deg); } }
        .hs-tile:hover .hs-icon-ring { opacity:1; }
        .hs-tile[disabled] .hs-icon-ring { animation:none; opacity:0.2; }
        .hs-icon-bg {
          position:absolute; inset:2px; border-radius:9px; background:rgba(6,4,22,0.95);
          display:flex; align-items:center; justify-content:center;
        }
        .hs-tile-name {
          font-size:0.84rem; font-weight:600; line-height:1.25; color:#e8eeff; letter-spacing:0.02em;
        }
        .hs-tile-desc {
          font-size:0.70rem; color:rgba(255,255,255,0.36); letter-spacing:0.02em; line-height:1.4;
        }

        /* aurora action buttons */
        .hs-abtn {
          flex:1; position:relative; overflow:hidden;
          background:linear-gradient(105deg,#1e1b6e 0%,#3730a3 18%,#6d28d9 36%,#a855f7 50%,#ec4899 66%,#f97316 82%,#fbbf24 100%);
          background-size:220% 220%; animation:hs-aurora 5s ease-in-out infinite;
          border:1px solid rgba(255,255,255,0.22); border-radius:100px;
          padding:10px 16px; cursor:pointer; color:#fff;
          font-size:0.75rem; font-weight:600; font-family:'Inter',sans-serif;
          letter-spacing:0.07em; white-space:nowrap; text-align:center;
          box-shadow:0 8px 36px rgba(109,40,217,0.5),0 2px 10px rgba(0,0,0,0.4),inset 0 1px 0 rgba(255,255,255,0.15);
          transition:transform 0.15s,box-shadow 0.15s;
        }
        .hs-abtn::before { content:'';position:absolute;inset:0;border-radius:100px;
          background:linear-gradient(to bottom,rgba(255,255,255,0.15) 0%,rgba(255,255,255,0.03) 55%,transparent 100%);pointer-events:none; }
        .hs-abtn::after  { content:'';position:absolute;top:0;left:-80%;width:55%;height:100%;
          background:linear-gradient(90deg,transparent,rgba(255,255,255,0.18),transparent);
          animation:hs-sheen 3.5s ease-in-out infinite;pointer-events:none;border-radius:100px; }
        .hs-abtn:hover { transform:translateY(-2px);box-shadow:0 12px 40px rgba(109,40,217,0.65),0 4px 14px rgba(0,0,0,0.5),inset 0 1px 0 rgba(255,255,255,0.20); }
        .hs-slbl { font-size:0.65rem;letter-spacing:0.18em;text-transform:uppercase;margin-bottom:10px;font-weight:600;
          background:linear-gradient(135deg,rgba(255,255,255,0.90) 0%,rgba(200,220,255,0.70) 40%);
          -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text; }

        /* code entry */
        .hs-cinput { background:transparent;border:none;border-bottom:2px solid #333;outline:none;
          color:#e0e0e0;font-family:'Rajdhani','Orbitron','Segoe UI',sans-serif;
          font-size:clamp(20px,3vw,36px);font-weight:600;letter-spacing:0.3em;text-align:center;
          text-transform:uppercase;width:clamp(200px,28vw,320px);padding:8px 0;
          caret-color:#cc0000;transition:border-color 0.3s; }
        .hs-cinput:focus  { border-bottom-color:#cc0000; }
        .hs-cinput.hs-err { border-bottom-color:#dc1e1e;color:#dc1e1e;animation:hs-errPulse 0.5s ease forwards; }
        .hs-cform.hs-shake { animation:hs-shake 0.6s cubic-bezier(0.36,0.07,0.19,0.97) both; }
        .hs-back { display:inline-flex;align-items:center;gap:6px;background:none;border:none;cursor:pointer;
          color:rgba(255,255,255,0.38);font-size:0.75rem;font-family:'Inter',sans-serif;
          letter-spacing:0.12em;text-transform:uppercase;margin-bottom:28px;padding:0;transition:color 0.2s; }
        .hs-back:hover { color:rgba(255,255,255,0.75); }
        .hs-hint   { font-family:'Rajdhani','Orbitron','Segoe UI',sans-serif;font-size:11px;letter-spacing:0.3em;color:#2a2a2a;text-transform:uppercase;margin-top:22px; }
        .hs-errmsg { font-family:'Rajdhani','Orbitron','Segoe UI',sans-serif;font-size:12px;letter-spacing:0.22em;text-transform:uppercase;color:#dc1e1e;margin-top:10px;opacity:0;transition:opacity 0.2s; }
        .hs-errmsg.vis { opacity:1; }

        /* ═══════════════════════════════════════════════
           HOME SCREEN — RESPONSIVE
        ═══════════════════════════════════════════════ */

        /* Tablet (≤ 1024px) */
        @media (max-width: 1024px) {
          .hs-left  { width:55%;padding:0 3vw 0 5vw }
          .hs-right { width:45% }
          .hs-tiles { gap:10px }
          .hs-title { font-size:clamp(2.6rem,5.5vw,4.8rem) }
        }

        /* Mobile landscape / small tablet (≤ 768px) */
        @media (max-width: 768px) {
          .hs-land  { flex-direction:column;padding-top:62px;overflow-y:auto;height:auto;min-height:100% }
          .hs-left  { width:100%;padding:20px 20px 24px;height:auto;justify-content:flex-start }
          .hs-right { display:none }
          .hs-topbrand { top:68px; left:20px }
          .hs-tiles { grid-template-columns:1fr 1fr;gap:8px;margin-bottom:18px }
          .hs-tile  { padding:14px 10px 12px }
          .hs-icon-wrap { width:36px;height:36px }
          .hs-icon-ring { animation-duration:4s }
          .hs-tile-name { font-size:0.78rem }
          .hs-tile-desc { font-size:0.64rem }
          .hs-sub  { margin-bottom:16px }
          .hs-abtns { flex-direction:column!important;gap:8px!important }
          .hs-abtn { padding:10px 14px!important;font-size:0.76rem!important }
          .hs-cinput { width:clamp(180px,80vw,300px) }
        }

        /* Dim background on mobile for readability */
        @media (max-width: 768px) {
          .hs-aibot { opacity:0.35!important }
        }

        /* Small mobile (≤ 480px) */
        @media (max-width: 480px) {
          .hs-topbrand { left:14px }
          .hs-ar-btn { bottom:14px; right:14px; padding:6px 12px; font-size:0.65rem }
          .hs-tiles { grid-template-columns:1fr }
          .hs-tile  { flex-direction:row;align-items:center;gap:14px;padding:12px 14px }
          .hs-icon-wrap { flex-shrink:0 }
          .hs-land  { padding-top:58px }
          .hs-left  { padding:16px 14px 20px }
        }

        /* AR Viewer pill — bottom-right */
        .hs-ar-btn {
          position:absolute; bottom:24px; right:24px; z-index:40;
          display:inline-flex; align-items:center; gap:7px;
          background:rgba(0,0,0,0.45);
          border:1px solid rgba(255,255,255,0.20);
          border-radius:100px;
          padding:7px 16px;
          cursor:pointer; color:rgba(255,255,255,0.82);
          font-size:0.70rem; font-weight:600; font-family:'Inter',sans-serif;
          letter-spacing:0.10em; text-transform:uppercase;
          backdrop-filter:blur(8px);
          transition:background 0.2s, border-color 0.2s, color 0.2s, box-shadow 0.2s;
          white-space:nowrap;
        }
        .hs-ar-btn:hover {
          background:rgba(0,200,255,0.12);
          border-color:rgba(0,200,255,0.45);
          color:#fff;
          box-shadow:0 0 16px rgba(0,200,255,0.22);
        }
        .hs-ar-dot {
          width:6px; height:6px; border-radius:50%;
          background:#00cfff; box-shadow:0 0 6px #00cfff;
          animation:hs-ar-pulse 1.6s ease-in-out infinite;
        }
        @keyframes hs-ar-pulse {
          0%,100%{opacity:1;transform:scale(1)}
          50%{opacity:0.35;transform:scale(0.55)}
        }

      `}</style>

      {/* Dark veil */}
      <div style={{position:'absolute',inset:0,background:'rgba(0,1,3,0.70)',pointerEvents:'none'}}/>

      {/* ── SHORTCUT CODE PROMPT MODAL ── */}
      {codePrompt && (
        <div style={{position:'fixed',inset:0,zIndex:9000,display:'flex',alignItems:'center',justifyContent:'center',background:'rgba(0,0,8,0.72)',backdropFilter:'blur(12px)'}}>
          <div className={promptShake ? 'hs-cform hs-shake' : 'hs-cform'}
            style={{background:'rgba(6,4,22,0.98)',border:'1px solid rgba(255,255,255,0.12)',borderRadius:20,padding:'36px 32px',display:'flex',flexDirection:'column',alignItems:'center',gap:18,boxShadow:'0 30px 80px rgba(0,0,0,0.7)',minWidth:300}}>
            <p style={{fontSize:'0.50rem',letterSpacing:'0.24em',textTransform:'uppercase',color:'rgba(255,255,255,0.35)',margin:0,fontWeight:700,fontFamily:"'Inter',sans-serif"}}>{PROMPT_CFG[codePrompt]?.label}</p>
            <p style={{fontSize:'0.76rem',color:'rgba(255,255,255,0.45)',margin:0,fontFamily:"'Inter',sans-serif",letterSpacing:'0.06em'}}>{PROMPT_CFG[codePrompt]?.hint}</p>
            <form onSubmit={submitPrompt} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:0,width:'100%'}}>
              <div style={{position:'relative',display:'inline-flex',alignItems:'center',width:'100%',justifyContent:'center'}}>
                <input ref={promptRef} className={`hs-cinput${promptErr ? ' hs-err' : ''}`}
                  type={promptShow ? 'text' : 'password'}
                  value={promptCode} onChange={e=>{setPromptCode(e.target.value);setPromptErr('');}}
                  placeholder="— — — —" maxLength={10} autoComplete="off" spellCheck={false}
                  style={{paddingRight:36}}/>
                <button type="button" onClick={()=>setPromptShow(v=>!v)}
                  style={{position:'absolute',right:6,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',cursor:'pointer',padding:4,color:promptShow?'#cc0000':'#444',outline:'none',lineHeight:0,transition:'color 0.2s'}}>
                  {promptShow
                    ? <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    : <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  }
                </button>
              </div>
              <div className={`hs-errmsg${promptErr ? ' vis' : ''}`}>{promptErr || ' '}</div>
              <div className="hs-hint">Press Enter to confirm</div>
            </form>
            <button onClick={closePrompt} style={{marginTop:4,background:'none',border:'none',cursor:'pointer',color:'rgba(255,255,255,0.28)',fontFamily:"'Inter',sans-serif",fontSize:'0.72rem',letterSpacing:'0.14em',textTransform:'uppercase',padding:'4px 12px',transition:'color 0.2s'}}
              onMouseEnter={e=>e.currentTarget.style.color='rgba(255,255,255,0.65)'}
              onMouseLeave={e=>e.currentTarget.style.color='rgba(255,255,255,0.28)'}>Cancel</button>
          </div>
        </div>
      )}

      {/* ── BOTTOM-LEFT LOGO — click to prompt for Cost-Artist code ── */}
      <img src="/logo.png" alt="NAFFCO"
        onClick={() => openPrompt('costArtist')}
        style={{
          position:'absolute', bottom:24, left:36, zIndex:30,
          height:32, width:'auto', objectFit:'contain',
          opacity:0.55, filter:'drop-shadow(0 1px 8px rgba(109,40,217,0.35))',
          animation:'hs-fadeUp 0.6s ease both',
          cursor:'pointer',
        }}/>

      {/* ── TOP-LEFT BRANDING ── */}
      <div className="hs-topbrand">
        <div className="hs-topbrand-naffco">NAFFCO AI APEX</div>
        <div className="hs-topbrand-sub">Passion to Protect</div>
      </div>

      {/* ── BOTTOM-RIGHT: AR Viewer ── */}
      <button className="hs-ar-btn" onClick={() => openPrompt('arViewer')}>
        <span className="hs-ar-dot"/>
        AR Viewer
      </button>

      <div className="hs-land">
        {/* ── LEFT COLUMN ── */}
        <div className="hs-left">

          {phase === 'select' ? (
            <div style={{display:'flex',flexDirection:'column',animation:'hs-fadeUp 0.55s ease both'}}>
              <h1 className="hs-title">AI APEX HUB</h1>
              <p style={{ fontSize:'0.72rem', letterSpacing:'0.22em', textTransform:'uppercase', color:'rgba(255,255,255,0.28)', textAlign:'center', marginBottom:24, marginTop:-8, fontWeight:500 }}> - STATE OF ART - </p>
              {/* 2×2 tile grid */}
              <div className="hs-tiles">
                {depts.map((dept, idx) => (
                  <button
                    key={dept.id}
                    className="hs-tile"
                    disabled={dept.comingSoon}
                    style={{
                      '--tc': dept.color,
                      '--tg': dept.glow,
                      '--td': `${idx * 1.2}s`,
                    }}
                    onClick={() => pickDept(dept)}
                  >
                    {/* Corner brackets */}
                    <span className="hs-cb-tl"/>
                    <span className="hs-cb-br"/>
                    {/* Coming-soon hover overlay */}
                    {dept.comingSoon && (
                      <div className="hs-soon-overlay">
                        <span className="hs-soon-text">Coming Soon</span>
                      </div>
                    )}
                    {/* SOON badge */}
                    {dept.comingSoon && (
                      <span style={{position:'absolute',top:10,right:12,fontSize:'0.58rem',
                        letterSpacing:'0.16em',color:'rgba(255,255,255,0.30)',
                        border:'1px solid rgba(255,255,255,0.12)',borderRadius:4,
                        padding:'1px 6px',fontFamily:"'Inter',sans-serif"}}>SOON</span>
                    )}
                    {/* Arrow for active */}
                    {!dept.comingSoon && (
                      <svg style={{position:'absolute',top:12,right:12}} width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={dept.color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.6">
                        <polyline points="9 18 15 12 9 6"/>
                      </svg>
                    )}
                    {/* Spinning icon ring */}
                    <div className="hs-icon-wrap">
                      <div className="hs-icon-ring"/>
                      <div className="hs-icon-bg">
                        {dept.icon(dept.comingSoon ? 'rgba(255,255,255,0.25)' : dept.color)}
                      </div>
                    </div>
                    {/* Labels */}
                    <div>
                      <div className="hs-tile-name">{dept.label}</div>
                      <div className="hs-tile-desc">{dept.desc}</div>
                    </div>
                  </button>
                ))}
              </div>

            </div>
          ) : (
            /* ── CODE ENTRY ── */
            <div style={{display:'flex',flexDirection:'column',alignItems:'flex-start',animation:'hs-fadeUp 0.4s ease both'}}>
              <button className="hs-back" onClick={() => { setPhase('select'); setCode(''); setErrMsg(''); }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                Back
              </button>
              <h1 className="hs-title" style={{fontSize:'clamp(1.8rem,3.2vw,3rem)'}}>{selDept?.label}</h1>
              <p className="hs-sub">{selDept?.hint}</p>
              <form
                className={`hs-cform${shake ? ' hs-shake' : ''}`}
                onSubmit={handleSubmit}
                style={{display:'flex',flexDirection:'column',alignItems:'flex-start',gap:0}}
              >
                <div style={{position:'relative',display:'inline-flex',alignItems:'center'}}>
                  <input
                    ref={inputRef}
                    className={`hs-cinput${errMsg ? ' hs-err' : ''}`}
                    type={showCode ? 'text' : 'password'}
                    value={code}
                    onChange={e => { setCode(e.target.value); setErrMsg(''); }}
                    placeholder="— — — —"
                    maxLength={10}
                    autoComplete="off"
                    spellCheck={false}
                    style={{paddingRight:36}}
                  />
                  <button type="button" onClick={() => setShowCode(v => !v)}
                    style={{position:'absolute',right:6,top:'50%',transform:'translateY(-50%)',
                      background:'none',border:'none',cursor:'pointer',padding:4,
                      color:showCode?'#cc0000':'#444',outline:'none',lineHeight:0,transition:'color 0.2s'}}>
                    {showCode
                      ? <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      : <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    }
                  </button>
                </div>
                <div className={`hs-errmsg${errMsg ? ' vis' : ''}`}>{errMsg || '\u00A0'}</div>
                <div className="hs-hint">Press Enter to confirm</div>
              </form>
            </div>
          )}
        {showAR && (
  <div style={{
    position: 'fixed', inset: 0, zIndex: 9999,
  }}>
    <button
      onClick={() => setShowAR(false)}
      style={{
        position: 'absolute', top: 16, right: 16,
        zIndex: 10000, padding: '8px 18px',
        background: 'rgba(0,0,0,0.6)',
        border: '1px solid rgba(255,255,255,0.2)',
        borderRadius: 20, color: '#fff',
        fontSize: '0.8rem', cursor: 'pointer',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      ✕ Close
    </button>
    <ARScene />
  </div>
)}</div>

        {/* ── RIGHT COLUMN — AIBOT identical to Landing ── */}
        <div className="hs-right" style={{position:'relative',background:'transparent'}}>
          <div style={{position:'absolute',top:'-10%',left:'0%',right:'0%',bottom:'-5%',zIndex:0,
            background:'conic-gradient(from 0deg at 50% 50%,#ff0000,#ff7700,#ffff00,#00ff88,#00cfff,#6d28d9,#a855f7,#ec4899,#ff0000)',
            backgroundSize:'300% 300%',animation:'hs-aurora 6s ease-in-out infinite',
            filter:'blur(55px)',opacity:0.60,
            WebkitMaskImage:'radial-gradient(ellipse 85% 90% at 50% 50%,black 5%,rgba(0,0,0,0.50) 50%,transparent 78%)',
            maskImage:'radial-gradient(ellipse 85% 90% at 50% 50%,black 5%,rgba(0,0,0,0.50) 50%,transparent 78%)'}}/>
          <div style={{position:'absolute',top:'-2%',left:'8%',right:'8%',bottom:'0%',zIndex:0,
            background:'linear-gradient(120deg,#ff0000 0%,#ff6600 12%,#ffcc00 24%,#00ff88 36%,#00bfff 48%,#3b82f6 58%,#8b5cf6 68%,#ec4899 80%,#ff3366 90%,#ff0000 100%)',
            backgroundSize:'300% 300%',animation:'hs-aurora 4s ease-in-out infinite reverse',
            filter:'blur(30px)',opacity:0.70,
            WebkitMaskImage:'radial-gradient(ellipse 72% 80% at 50% 44%,black 10%,rgba(0,0,0,0.55) 52%,transparent 78%)',
            maskImage:'radial-gradient(ellipse 72% 80% at 50% 44%,black 10%,rgba(0,0,0,0.55) 52%,transparent 78%)'}}/>
          <div style={{position:'absolute',top:'8%',left:'20%',right:'18%',bottom:'2%',zIndex:0,
            background:'linear-gradient(160deg,#ff4444 0%,#ff9900 20%,#ffee00 35%,#a855f7 55%,#ec4899 72%,#ff6600 88%,#ff0000 100%)',
            backgroundSize:'250% 250%',animation:'hs-aurora 3.5s ease-in-out infinite',
            filter:'blur(16px)',opacity:0.80,
            WebkitMaskImage:'radial-gradient(ellipse 55% 68% at 50% 42%,black 18%,rgba(0,0,0,0.45) 55%,transparent 78%)',
            maskImage:'radial-gradient(ellipse 55% 68% at 50% 42%,black 18%,rgba(0,0,0,0.45) 55%,transparent 78%)'}}/>
          <img src="/AIBOT.png" alt="AI Bot" className="hs-aibot" style={{position:'fixed',inset:0,zIndex:1,width:'100vw',height:'100vh',objectFit:'cover',objectPosition:'center top',display:'block',pointerEvents:'none'}}/>
        </div>
      </div>
    </div>
  );
};

// --- ACCESS CODE SCREEN ---
const AccessCodeScreen = ({ onAccepted }) => {
  const [code, setCode] = useState('');
  const [shake, setShake] = useState(false);
  const [error, setError] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  const SALES_CODES = ['SX985','SX417','SE628','SE842','SE519','SM386'];
  const EST_CODES   = ['EX552','EX719','EX638','EX904','EX471','EX856','EX392','EX681','EX547','EX903','EX764'];

  const handleSubmit = (e) => {
    e.preventDefault();
    const entered = code.trim().toUpperCase();
    if (EST_CODES.includes(entered)) {
      onAccepted('estimation', 'estimator', entered, 'Estimator');
    } else if (SALES_CODES.includes(entered)) {
      onAccepted('estimation', 'sales', entered, '');
    } else if (entered === 'STAR') {
      onAccepted('estimation', 'director', entered, 'Cost Artist');
    } else if (entered === '9993') {
      onAccepted('active', null, '9993', '');
    // } else if (entered === 'JAFZA') {
    //   onAccepted('mainScene', null, '', '');
    } else {
      setShake(true);
      setError(true);
      setTimeout(() => setShake(false), 600);
      setTimeout(() => setError(false), 2000);
      setCode('');
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999999,
      background: '#000',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      gap: '32px',
    }}>
      <style>{`
        @keyframes access-shake {
          0%   { transform: translateX(0); }
          15%  { transform: translateX(-10px); }
          30%  { transform: translateX(10px); }
          45%  { transform: translateX(-8px); }
          60%  { transform: translateX(8px); }
          75%  { transform: translateX(-4px); }
          90%  { transform: translateX(4px); }
          100% { transform: translateX(0); }
        }
        @keyframes error-pulse {
          0%   { box-shadow: 0 0 0px rgba(220,30,30,0); }
          50%  { box-shadow: 0 0 22px rgba(220,30,30,0.7); }
          100% { box-shadow: 0 0 8px rgba(220,30,30,0.3); }
        }
        .access-naffco {
          font-family: 'Rajdhani', 'Orbitron', 'Segoe UI', sans-serif;
          font-size: clamp(56px, 9vw, 120px);
          font-weight: 900;
          letter-spacing: -0.03em;
          line-height: 1;
          color: #cc0000;
          text-shadow: 0 0 40px rgba(200,0,0,0.5);
        }
        .access-label {
          font-family: 'Rajdhani', 'Orbitron', 'Segoe UI', sans-serif;
          font-size: clamp(11px, 1.3vw, 17px);
          font-weight: 500;
          letter-spacing: 0.4em;
          text-transform: uppercase;
          color: #505060;
          margin-bottom: 6px;
        }
        .access-input {
          background: transparent;
          border: none;
          border-bottom: 2px solid #333;
          outline: none;
          color: #e0e0e0;
          font-family: 'Rajdhani', 'Orbitron', 'Segoe UI', sans-serif;
          font-size: clamp(20px, 3vw, 36px);
          font-weight: 600;
          letter-spacing: 0.3em;
          text-align: center;
          text-transform: uppercase;
          width: clamp(200px, 30vw, 360px);
          padding: 8px 0;
          transition: border-color 0.3s;
          caret-color: #cc0000;
        }
        .access-input:focus {
          border-bottom-color: #cc0000;
        }
        .access-input.error {
          border-bottom-color: #dc1e1e;
          color: #dc1e1e;
          animation: error-pulse 0.5s ease forwards;
        }
        .access-form.shake {
          animation: access-shake 0.6s cubic-bezier(0.36,0.07,0.19,0.97) both;
        }
        .access-error-msg {
          font-family: 'Rajdhani', 'Orbitron', 'Segoe UI', sans-serif;
          font-size: clamp(11px, 1.2vw, 15px);
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: #dc1e1e;
          margin-top: 8px;
          opacity: 0;
          transition: opacity 0.2s;
        }
        .access-error-msg.visible {
          opacity: 1;
        }
        .access-hint {
          font-family: 'Rajdhani', 'Orbitron', 'Segoe UI', sans-serif;
          font-size: clamp(10px, 1vw, 13px);
          letter-spacing: 0.3em;
          color: #2a2a2a;
          text-transform: uppercase;
          margin-top: 28px;
        }
      `}</style>

      <div className="access-naffco">NAFFCO</div>

      <form
        className={`access-form${shake ? ' shake' : ''}`}
        onSubmit={handleSubmit}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}
      >
        <div className="access-label">Enter Access Code</div>
        <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
          <input
            ref={inputRef}
            className={`access-input${error ? ' error' : ''}`}
            type={showCode ? 'text' : 'password'}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="— — — — —"
            maxLength={10}
            autoComplete="off"
            spellCheck={false}
            style={{ paddingRight: '36px' }}
          />
          <button
            type="button"
            onClick={() => setShowCode(v => !v)}
            style={{
              position: 'absolute', right: 6, top: '50%', transform: 'translateY(-50%)',
              background: 'none', border: 'none', cursor: 'pointer', padding: 4,
              color: showCode ? '#cc0000' : '#444', outline: 'none', lineHeight: 0,
              transition: 'color 0.2s',
            }}
          >
            {showCode ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
              </svg>
            )}
          </button>
        </div>
        <div className={`access-error-msg${error ? ' visible' : ''}`}>Invalid access code</div>
      </form>

      <div className="access-hint">Press Enter to confirm</div>
    </div>
  );
};


// --- INTRO SCREEN ---
const IntroScreen = ({ onDone, welcomeName, welcomeRole }) => {
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
        .intro-welcome {
          font-family: 'Rajdhani', 'Orbitron', 'Segoe UI', sans-serif;
          font-size: clamp(14px, 1.8vw, 24px);
          font-weight: 400;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #cc0000;
          margin-top: 28px;
          opacity: 0;
          animation: intro-welcome-in 0.6s ease 0.8s forwards;
        }
        @keyframes intro-welcome-in {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
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
      <div className="intro-welcome">
        {welcomeRole === 'sales'
          ? (welcomeName ? `Hi, ${welcomeName}!` : 'Welcome!')
          : (welcomeName ? `Welcome Back, ${welcomeName}` : 'Welcome Back!')}
      </div>
      <div className="intro-beam" />
    </div>
  );
};

// --- MAIN ROUTING AND STATE MANAGEMENT ---
function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();

  // Show intro immediately on launch (splash)
  const [showIntro, setShowIntro]     = useState(true);
  const [welcomeName, setWelcomeName] = useState('');
  
  // Keep these states so data persists across route changes
  const [targetIndex, setTargetIndex] = useState(null);
  const [initialRole, setInitialRole] = useState(null);
  const [initialCode, setInitialCode] = useState('');
  const [initialView, setInitialView] = useState(null);
  
  const pendingDestRef = useRef(null);

  // Called by HomeScreen after code is validated
  const handleAccessAccepted = useCallback((destination, role, code, welcome, iv = null) => {
    setWelcomeName(welcome);
    setInitialRole(role);
    setInitialCode(code);
    setInitialView(iv);
    
    // UPDATED: Check if the role is sales, send them to /sales instead of /estimation
    let finalPath = '/';
    if (role === 'sales') {
        finalPath = '/sales';
    } else {
        const routes = { 
            home: '/', 
            active: '/dashboard', 
            estimation: '/estimation' 
        };
        finalPath = routes[destination] || '/';
    }
    
    pendingDestRef.current = finalPath;
    setShowIntro(true);
  }, []);

  // Called by HomeScreen for quick-actions
  const handleDirectNav = useCallback((dest, iv) => {
    setInitialRole(null);
    setInitialCode('');
    setInitialView(iv);
    
    const routes = { 
        arViewer: '/ar', 
        construction: '/construction', 
        estimation: '/estimation' 
    };
    navigate(routes[dest] || '/');
  }, [navigate]);

  const handleIntroDone = useCallback(() => {
    setShowIntro(false);
    if (pendingDestRef.current !== null) {
      navigate(pendingDestRef.current);
      pendingDestRef.current = null;
    }
  }, [navigate]);

  // Back from any dept view → return to home hub
  const backToHome = () => {
    setInitialRole(null);
    setInitialCode('');
    setInitialView(null);
    setTargetIndex(null);
    navigate('/');
  };

  const handleNavigation = (index, destination) => {
    setTargetIndex(index);
    setTimeout(() => {
      const routes = { 
        'estimation': '/estimation', 
        'dataAnalysis': '/data-analysis', 
        'VIRTUAL SHOWROOM': '/virtual-showroom',
        'New SHOWROOM': '/new-showroom', 
        'AI CONTRACTS': '/contracts' 
      };
      navigate(routes[destination] || '/');
      setTargetIndex(null);
    }, 2500);
  };

  // UPDATED: Added /sales and /salesView to the active animation routes
  const activeRoutesForAnimation = ['/dashboard', '/estimation', '/sales', '/data-analysis', '/virtual-showroom', '/new-showroom', '/contracts'];
  const startAnimations = activeRoutesForAnimation.includes(location.pathname);
  
  const isZooming = targetIndex !== null;
  
  // The 3D Canvas only stays mounted when on the dashboard or zooming away from it
  const shouldMountCanvas = location.pathname === '/dashboard';

  return (
    <>
      {showIntro && <IntroScreen onDone={handleIntroDone} welcomeName={welcomeName} welcomeRole={initialRole} />}
      <div style={mainBackgroundStyle}/>
      <TouchFeedback />

      {/* REACT ROUTER DEFINITIONS */}
      <Routes>
        <Route path="/" element={
          <HomeScreen onAccepted={handleAccessAccepted} onDirect={handleDirectNav} />
        } />
        <Route path="/dummy" element={<DummyHub />} />
        <Route path="/hero" element={<AIHeroSection />} />
        
        <Route path="/construction" element={
          <ConstructionScreen deptId={initialView} onBack={backToHome} />
        } />
        
        {/* Route for Estimator role */}
        <Route path="/estimation/*" element={
          <AIEstimation
            onBack={backToHome}
            onNavigate={(state) => navigate(`/${state}`)}
            initialRole={initialRole}
            initialCode={initialCode}
            initialView={initialView}
          />
        } />

        {/* UPDATED: Route for Sales role (Shares the AIEstimation dashboard component) */}
        <Route path="/sales/*" element={
          <AIEstimation
            onBack={backToHome}
            onNavigate={(state) => navigate(`/${state}`)}
            initialRole={initialRole}
            initialCode={initialCode}
            initialView={initialView}
          />
        } />
        
        {/* UPDATED: The actual Sales Form is now on /salesView */}
        <Route path="/salesView" element={<SalesForm onBack={backToHome} />} />
        
        <Route path="/data-analysis" element={<DataDashboard onBack={backToHome} />} />
        <Route path="/virtual-showroom" element={<VirtualShowroomDashboard onBack={backToHome} />} />
        <Route path="/new-showroom" element={<NewShowroom onBack={backToHome} />} />
        <Route path="/contracts" element={<AIContract onBack={backToHome} />} />
        
        {/* Empty dashboard route because the Canvas is rendered conditionally outside of Routes below */}
        <Route path="/dashboard" element={<div />} />

        <Route path="/ar" element={
          <Suspense fallback={<div style={{position:'fixed',inset:0,background:'#111',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:14,fontFamily:'Inter,sans-serif',zIndex:300}}>Loading AR Viewer…</div>}>
            <div style={{position:'fixed',inset:0,zIndex:300}}>
              <ARScene />
              <button
                onClick={backToHome}
                style={{
                  position:'absolute',top:16,left:16,zIndex:400,
                  display:'flex',alignItems:'center',gap:6,
                  background:'rgba(0,0,0,0.55)',backdropFilter:'blur(8px)',
                  border:'1px solid rgba(255,255,255,0.25)',borderRadius:100,
                  padding:'8px 16px',color:'#fff',
                  fontSize:13,fontWeight:600,fontFamily:"'Inter',sans-serif",
                  cursor:'pointer',letterSpacing:'0.06em',
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6"/>
                </svg>
                Back
              </button>
            </div>
          </Suspense>
        } />
      </Routes>

      {/* 3D CANVAS REMAINS OUTSIDE ROUTES SO IT CAN UNMOUNT GRACEFULLY */}
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
// App wrapper (Router is already handled in main.jsx)
export default function App() {
  return <AppContent />;
}