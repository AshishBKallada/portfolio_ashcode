"use client";

import { Suspense, useRef, type RefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { useScroll, type MotionValue } from "motion/react";
import type { Group, Mesh, MeshStandardMaterial } from "three";

type GLTFResult = {
  nodes: Record<string, Mesh>;
  materials: Record<string, MeshStandardMaterial>;
};

function Stormbreaker({ progress }: { progress: MotionValue<number> }) {
  const outer = useRef<Group>(null);
  const spinner = useRef<Group>(null);
  const { nodes, materials } = useGLTF("/stormbreaker.glb") as unknown as GLTFResult;

  useFrame(() => {
    const o = outer.current;
    const s = spinner.current;
    if (!o || !s) return;
    const p = Math.min(1, Math.max(0, progress.get()));

    // Rotate the hammer horizontally (yaw) while scrolling — turntable reveal.
    // Full revolution across the scroll range, plus a soft idle sway at rest.
    const idleSway = Math.sin(performance.now() * 0.0004) * 0.15 * (1 - p);
    s.rotation.y = idleSway + p * Math.PI * 2;
    s.rotation.x = 0;
    s.rotation.z = -Math.PI * 0.08;

    // Anchor position — keep the subject planted.
    o.position.y = -2.4;

    // Start zoomed-in (hero close-up), then pull back slightly as we spin.
    const eased = 0.5 - 0.5 * Math.cos(p * Math.PI);
    const zoom = 1.35 - eased * 0.35;
    o.scale.setScalar(zoom);
  });

  return (
    <group ref={outer}>
      <group position={[0.017, -0.023, 0.129]} rotation={[-Math.PI / 2, 0, 0]}>
        <group rotation={[Math.PI / 2, 0, 0]}>
          <group
            position={[-0.17, 4.086, -3.919]}
            rotation={[-1.542, -0.035, -0.198]}
          >
            <group ref={spinner}>
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.Object_4.geometry}
                material={materials.material}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.Object_5.geometry}
                material={materials.Handle}
              />
            </group>
          </group>
        </group>
      </group>
    </group>
  );
}

useGLTF.preload("/stormbreaker.glb");

export function StormbreakerScene({
  targetRef,
}: {
  targetRef: RefObject<HTMLElement | null>;
}) {
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"],
  });

  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0, 4.2], fov: 26 }}
      gl={{ antialias: true, alpha: true }}
      className="!absolute inset-0"
    >
      <ambientLight intensity={0.55} />
      <directionalLight position={[4, 6, 5]} intensity={1.6} castShadow />
      <directionalLight position={[-5, 2, -3]} intensity={0.7} color="#7aa2ff" />
      <directionalLight position={[0, -4, 2]} intensity={0.35} color="#ffb37a" />
      <Suspense fallback={null}>
        <Stormbreaker progress={scrollYProgress} />
      </Suspense>
    </Canvas>
  );
}
