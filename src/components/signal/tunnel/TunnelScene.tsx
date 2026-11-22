"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { heroWorks } from "@/data/hero";
import { pieceInView } from "@/lib/tunnel/hang";
import { EYE, TRAVEL, at } from "@/lib/tunnel/path";
import { Corridor } from "./Corridor";
import { TunnelGallery } from "./TunnelGallery";

/** Where the camera looks: this far ahead (m), and this far right of centre, toward the hung wall. */
const LOOK = { ahead: 5, right: 0.75 };

type SceneProps = {
  /** 0 to 1 through the corridor, read each frame. */
  progress: () => number;
  /** Called when the work in view changes. */
  onPiece: (index: number) => void;
};

/**
 * Puts the camera on the centre line at the eased scroll progress, turned a little toward
 * the outer wall. The canvas only draws on demand: a scroll asks for a frame, and the rig
 * keeps asking while the camera is still easing, then the corridor sits idle at zero cost.
 */
function Rig({ progress, onPiece }: SceneProps) {
  const camera = useThree((s) => s.camera);
  const invalidate = useThree((s) => s.invalidate);
  const along = useRef<number | null>(null);
  const piece = useRef(-1);
  const eye = useMemo(() => new THREE.Vector3(), []);
  const ahead = useMemo(() => new THREE.Vector3(), []);

  useEffect(() => {
    const onScroll = () => invalidate();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [invalidate]);

  useFrame((_, dt) => {
    const target = progress() * TRAVEL;
    // First frame lands where the page already is; after that it eases.
    const from = along.current ?? target;
    const next = from + (target - from) * (1 - Math.exp(-Math.min(dt, 0.1) * 6));
    along.current = Math.abs(target - next) < 0.001 ? target : next;
    camera.position.copy(at(along.current, 0, EYE, eye));
    camera.lookAt(at(along.current + LOOK.ahead, -LOOK.right, EYE - 0.05, ahead));
    if (along.current !== target) invalidate();

    const now = pieceInView(along.current, heroWorks.length);
    if (now !== piece.current) {
      piece.current = now;
      onPiece(now);
    }
  });
  return null;
}

/** The corridor's canvas, loaded on its own (TunnelHero imports it lazily). */
export default function TunnelScene({ progress, onPiece }: SceneProps) {
  return (
    <Canvas
      aria-hidden
      frameloop="demand"
      dpr={[1, 1.75]}
      flat
      camera={{ fov: 62, near: 0.05, far: 120, position: [0, EYE, 0] }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
    >
      <color attach="background" args={["#ffffff"]} />
      <fog attach="fog" args={["#ffffff", 8, 58]} />
      {/* Sky-lit from above: the floor takes the most light, the walls a little less. */}
      <hemisphereLight args={["#ffffff", "#e4e4e4", 2.9]} />
      {/* A low key from the outer side, so the two walls read in slightly different tones. */}
      <directionalLight position={[18, 22, 8]} intensity={0.4} />
      <Corridor />
      <TunnelGallery />
      <Rig progress={progress} onPiece={onPiece} />
    </Canvas>
  );
}
