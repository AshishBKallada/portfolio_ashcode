"use client";

import { Canvas } from "@react-three/fiber";
import { useGLTF, OrbitControls } from "@react-three/drei";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import * as THREE from "three";

function Model() {
  const { scene } = useGLTF("/playing-model.glb");

  // Manually recenter the scene by its world bounding box (drei's Center can miss with mixed transforms)
  useEffect(() => {
    scene.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(scene);
    const center = box.getCenter(new THREE.Vector3());
    scene.position.sub(center);
  }, [scene]);

  return (
    <group rotation={[-0.18, 0, -0.12]} scale={2.6}>
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload("/playing-model.glb");

export default function PlayingModel({ visible }: { visible: boolean }) {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    if (visible) {
      gsap.fromTo(
        el,
        { yPercent: 110, scale: 0.45, rotate: -28, opacity: 0 },
        { yPercent: 0, scale: 1, rotate: 0, opacity: 1, duration: 1.6, ease: "power3.out" }
      );
    } else {
      gsap.to(el, {
        yPercent: 110,
        scale: 0.45,
        rotate: -28,
        opacity: 0,
        duration: 0.7,
        ease: "power2.in",
      });
    }
  }, [visible]);

  return (
    <div className="pointer-events-none fixed inset-0 z-[3] flex items-center justify-center overflow-hidden">
      <div
        ref={wrapRef}
        className="pointer-events-auto w-[95vw] h-[95vh] max-w-[1200px] max-h-[1100px]"
        style={{ opacity: 0 }}
      >
        <Canvas camera={{ position: [0, 0, 4.2], fov: 32 }} dpr={[1, 1.5]}>
          <ambientLight intensity={0.75} />
          <directionalLight position={[5, 5, 5]} intensity={1.4} />
          <directionalLight position={[-4, 2, -3]} intensity={0.5} />
          <Model />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            enableDamping
            dampingFactor={0.08}
            autoRotate
            autoRotateSpeed={0.5}
          />
        </Canvas>
      </div>
    </div>
  );
}
