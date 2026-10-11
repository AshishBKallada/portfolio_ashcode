"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useReducedMotion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  BackSide,
  CanvasTexture,
  FrontSide,
  Plane,
  RepeatWrapping,
  SRGBColorSpace,
  Vector3,
  type Group,
} from "three";

const RADIUS = 1.45;
const HEIGHT = 0.42;

/** Engraves the ring copy onto a wide strip that wraps the band once. */
function useRingTexture(text: string) {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 4096;
    canvas.height = 384;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#ecebe8";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#1a1a1a";
    ctx.textBaseline = "middle";
    ctx.font = "600 86px ui-monospace, SFMono-Regular, Menlo, monospace";
    let x = 24;
    while (x < canvas.width) {
      ctx.fillText(text, x, canvas.height * 0.36);
      x += ctx.measureText(text).width;
    }
    ctx.font = "500 46px ui-monospace, SFMono-Regular, Menlo, monospace";
    const sub = "V55°47,45′ 49°6,87′ — FULL_STACK // BUILT_BY_HAND — 10/10 :) — ";
    x = 0;
    while (x < canvas.width) {
      ctx.fillText(sub, x, canvas.height * 0.76);
      x += ctx.measureText(sub).width;
    }
    const tex = new CanvasTexture(canvas);
    tex.colorSpace = SRGBColorSpace;
    tex.wrapS = RepeatWrapping;
    tex.anisotropy = 8;
    return tex;
  }, [text]);

  useEffect(() => () => texture.dispose(), [texture]);
  return texture;
}

function Ring({ text, half }: { text: string; half: "front" | "back" }) {
  const spinner = useRef<Group>(null);
  const tilt = useRef<Group>(null);
  const reduce = useReducedMotion();
  const map = useRingTexture(text);

  // Keep only the half nearer (or farther from) the camera, so the band can
  // be layered between the two canvases and the ring reads as passing through it.
  const planes = useMemo(
    () => [new Plane(new Vector3(0, 0, half === "front" ? 1 : -1), 0)],
    [half],
  );

  useFrame((_, delta) => {
    if (reduce) return;
    if (spinner.current) spinner.current.rotation.y += delta * 0.25;
    if (tilt.current) {
      const t = performance.now() * 0.0004;
      tilt.current.rotation.x = 0.25 + Math.sin(t) * 0.06;
    }
  });

  return (
    <group ref={tilt} rotation={[0.25, 0.55, -1.05]}>
      <group ref={spinner}>
        <mesh>
          <cylinderGeometry args={[RADIUS, RADIUS, HEIGHT, 160, 1, true]} />
          <meshStandardMaterial
            map={map}
            side={FrontSide}
            metalness={0.25}
            roughness={0.35}
            clippingPlanes={planes}
          />
        </mesh>
        <mesh>
          <cylinderGeometry args={[RADIUS, RADIUS, HEIGHT, 160, 1, true]} />
          <meshStandardMaterial
            color="#d9d8d4"
            side={BackSide}
            metalness={0.2}
            roughness={0.5}
            clippingPlanes={planes}
          />
        </mesh>
      </group>
    </group>
  );
}

/** One half of the skills ring; render a back and a front around the band. */
export function SkillsRing({
  text,
  half,
  className,
}: {
  text: string;
  half: "front" | "back";
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  // Stop the render loop entirely while the ring is off screen.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) =>
      setVisible(entry.isIntersecting),
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} aria-hidden className={className}>
      <Canvas
        frameloop={visible ? "always" : "never"}
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 6], fov: 35 }}
        gl={{ antialias: true, alpha: true }}
        onCreated={({ gl }) => {
          gl.localClippingEnabled = true;
        }}
      >
        <ambientLight intensity={1.1} />
        <directionalLight position={[3, 4, 5]} intensity={1.6} />
        <directionalLight position={[-4, -2, 3]} intensity={0.6} />
        <Ring text={text} half={half} />
      </Canvas>
    </div>
  );
}
