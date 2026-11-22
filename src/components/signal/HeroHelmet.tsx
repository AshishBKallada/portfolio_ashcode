"use client";

import { Environment, Lightformer, useGLTF } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

/*
 * The cyber-samurai helmet in the hero: oni horns, a cream brow plate with red kanji,
 * red eyes. Cut from the 1.5M-face, 75 MB download to 90k faces, 2048 JPEG textures and
 * Draco by scripts/blender/make_helmet.py (1.2 MB). Centred, 1 unit tall, facing +z.
 */
const MODEL = "/models/helmet/helmet.glb";
const DRACO_PATH = "/draco/";

/** The helmet: turns to look toward the pointer, a few degrees, and floats slowly. */
function Helmet({
  still,
  look,
}: {
  still: boolean;
  look: React.RefObject<{ x: number; y: number }>;
}) {
  const { scene } = useGLTF(MODEL, DRACO_PATH);
  const group = useRef<THREE.Group>(null);
  const model = useMemo(() => {
    const m = scene.clone(true);
    m.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh) return;
      const mat = mesh.material as THREE.MeshStandardMaterial;
      if (mat.map) {
        mat.map.anisotropy = 8;
        mat.map.colorSpace = THREE.SRGBColorSpace;
      }
      mat.envMapIntensity = 1.1;
    });
    return m;
  }, [scene]);

  useFrame(({ clock }, dt) => {
    const g = group.current;
    if (!g) return;
    const t = clock.getElapsedTime();
    const k = 1 - Math.exp(-dt * 4);
    // Toward the pointer (eased), plus a slow idle sway so it's never quite still.
    const ry = (still ? 0 : look.current.x * 0.55) + Math.sin(t * 0.4) * 0.06;
    const rx = (still ? 0 : look.current.y * 0.28) + Math.sin(t * 0.55) * 0.03;
    g.rotation.y += (ry - g.rotation.y) * k;
    g.rotation.x += (rx - g.rotation.x) * k;
    g.position.y = still ? 0 : Math.sin(t * 0.9) * 0.025;
  });

  return (
    <group ref={group}>
      <primitive object={model} />
    </group>
  );
}

/**
 * The helmet on a transparent canvas filling its box. Lit with a soft studio of light
 * panels (no HDR download), a warm key from the upper left and a red rim from behind.
 */
export function HeroHelmet({ still = false }: { still?: boolean }) {
  const look = useRef({ x: 0, y: 0 });
  useEffect(() => {
    if (still) return;
    const onMove = (e: PointerEvent) => {
      look.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      look.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [still]);

  return (
    <div aria-hidden className="absolute inset-0">
      <Canvas
        resize={{ offsetSize: true }}
        dpr={[1, 2]}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: "high-performance",
        }}
        camera={{ fov: 28, position: [0, 0, 3.1], near: 0.1, far: 20 }}
      >
        <ambientLight intensity={0.25} />
        <directionalLight
          position={[-2, 3, 3]}
          intensity={2.2}
          color="#fff1e0"
        />
        <pointLight
          position={[1.4, 0.4, -1.2]}
          intensity={6}
          color="#ff2a10"
          distance={6}
        />
        <pointLight
          position={[-1.5, -0.4, -1]}
          intensity={3}
          color="#ff4a20"
          distance={6}
        />
        <Environment resolution={256}>
          <Lightformer intensity={2} position={[0, 3, 2]} scale={[6, 1.5, 1]} />
          <Lightformer
            intensity={1.2}
            position={[-3, 0.5, 1]}
            rotation-y={Math.PI / 2}
            scale={[4, 2, 1]}
          />
          <Lightformer
            intensity={1.6}
            color="#ff3a1a"
            position={[3, 0, -1]}
            rotation-y={-Math.PI / 2}
            scale={[4, 3, 1]}
          />
        </Environment>
        <Suspense fallback={null}>
          <Helmet still={still} look={look} />
        </Suspense>
      </Canvas>
    </div>
  );
}

useGLTF.preload(MODEL, DRACO_PATH);
