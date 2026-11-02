"use client";

import { useGLTF } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import type { MotionValue } from "motion/react";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useHeroCovered } from "./useHeroCovered";

/*
 * The magic carpet under the courier, so the leap reads as a ride: billowing
 * along its length, its ends curled up, the billow lifting as the scroll
 * reveal runs. The bend is done in the vertex shader on both the carpet and
 * its tassels, so the tassels stay on the edge.
 *
 * "Aladdin's Magic Carpet" by Kremit, CC-BY-4.0 (credited in SiteFooter):
 * https://sketchfab.com/3d-models/aladdins-magic-carpet-2c363d45fb824fbcab624e2ad66eed02
 */

const MODEL = "/models/carpet/scene.gltf";

type Bend = { uTime: { value: number }; uLift: { value: number } };

/** Bends the flat carpet (it lies in its own xy plane, long along y, ±5.4). */
function bendMaterial(source: THREE.Material, bend: Bend) {
  const mat = source.clone();
  mat.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, bend);
    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", "#include <common>\nuniform float uTime;\nuniform float uLift;")
      .replace(
        "#include <begin_vertex>",
        `#include <begin_vertex>
        float along = transformed.y / 5.43;
        // A slow billow running tail to nose, a lighter ripple across, and the ends curled up.
        float wave = sin(transformed.y * 0.62 - uTime * 2.1) * (0.32 + uLift * 0.35)
                   + sin(transformed.x * 0.9 + uTime * 1.4) * 0.12;
        float curl = along * along * (0.9 + uLift * 0.5) + max(-along, 0.0) * 0.35;
        transformed.z += wave * (0.45 + 0.55 * abs(along)) + curl;`,
      );
  };
  mat.customProgramCacheKey = () => "carpet-bend";
  return mat;
}

/** The entry spin, matched to SkyHero's flight (CARPET_DELAY, CARPET_S). */
const ENTRY_DELAY = 0.7;
const ENTRY_S = 2.8;
/** Left unscrolled this long after landing (or its last turn), it turns once more, over IDLE_SPIN_S. */
const IDLE_S = 6;
const IDLE_SPIN_S = 2.4;
const easeInOut = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

function Carpet({
  still,
  ready,
  reveal,
  onLoad,
}: {
  still: boolean;
  ready: boolean;
  reveal: MotionValue<number>;
  onLoad?: () => void;
}) {
  const { nodes, materials } = useGLTF(MODEL) as unknown as {
    nodes: Record<string, THREE.Mesh>;
    materials: Record<string, THREE.Material>;
  };
  const { mats, uniforms } = useMemo(() => {
    const uniforms: Bend = { uTime: { value: 0 }, uLift: { value: 0 } };
    return {
      uniforms,
      mats: { carpet: bendMaterial(materials.CARPET, uniforms), tassels: bendMaterial(materials.TASSELS, uniforms) },
    };
  }, [materials]);
  // Written every frame, so held in a ref rather than mutated as a hook's return value.
  const bend = useRef(uniforms);
  useEffect(() => {
    bend.current = uniforms;
  }, [uniforms]);
  useEffect(
    () => () => {
      mats.carpet.dispose();
      mats.tassels.dispose();
    },
    [mats],
  );
  // Mounted only once useGLTF has resolved, so this is the model arriving.
  useEffect(() => {
    onLoad?.();
  }, [onLoad]);
  const group = useRef<THREE.Group>(null);
  const entryStart = useRef<number | null>(null);
  // The idle turn: the clock time the wait last restarted (landing, a scroll, a turn's end),
  // and when the current turn began. A scroll only flags itself; the frame reads the clock.
  const idleFrom = useRef<number | null>(null);
  const spinStart = useRef<number | null>(null);
  const scrolled = useRef(false);
  useEffect(() => {
    const onScroll = () => {
      scrolled.current = true;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useFrame((state) => {
    const t = still ? 1.2 : state.clock.elapsedTime;
    bend.current.uTime.value = t;
    bend.current.uLift.value = still ? 0 : reveal.get();
    const g = group.current;
    if (g && !still) {
      // The entry: one full turn about its own vertical, banked, easing out as it lands.
      if (ready && entryStart.current === null) entryStart.current = t;
      const e = entryStart.current === null ? 0 : Math.min(1, Math.max(0, (t - entryStart.current - ENTRY_DELAY) / ENTRY_S));
      const left = 1 - (1 - Math.pow(1 - e, 3));
      // Landed: wait out IDLE_S unscrolled, then one more full turn; a scroll restarts the wait
      // (a turn under way finishes).
      let spin = 0;
      if (e >= 1) {
        if (idleFrom.current === null || scrolled.current) idleFrom.current = t;
        scrolled.current = false;
        if (spinStart.current === null && t - idleFrom.current > IDLE_S) spinStart.current = t;
        if (spinStart.current !== null) {
          const s = Math.min(1, (t - spinStart.current) / IDLE_SPIN_S);
          spin = easeInOut(s);
          if (s >= 1) {
            spinStart.current = null;
            idleFrom.current = t;
            spin = 0;
          }
        }
      }
      g.rotation.y = -(left + spin) * Math.PI * 2;
      // Rolls and dips a little under the rider, banking into a turn.
      g.rotation.z = Math.sin(t * 0.8) * 0.05 + left * 0.5 + Math.sin(spin * Math.PI) * 0.3;
      g.position.y = Math.sin(t * 1.3) * 0.12;
    }
  });

  return (
    <group ref={group}>
      {/* Long axis left to right, nose toward where the courier is heading. */}
      <group rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
        <group position={[0, 0, -1.962]}>
          <mesh geometry={nodes.TASSELS_0.geometry} material={mats.tassels} />
          <mesh geometry={nodes.TASSELS_0_1.geometry} material={mats.tassels} />
          <mesh geometry={nodes.CARPET_0.geometry} material={mats.carpet} />
        </group>
      </group>
    </group>
  );
}

export function HeroCarpet({
  still,
  ready,
  active = false,
  reveal,
  onLoad,
}: {
  still: boolean;
  /** Start the entry: the loader has lifted and the model is in (SkyHero waits on onLoad). */
  ready: boolean;
  /** Keep drawing while true, even off screen (the entry starts outside the view). */
  active?: boolean;
  reveal: MotionValue<number>;
  onLoad?: () => void;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  // Pinned under the whole page, the hero stays "on screen" to the observer; stop once it's covered.
  const covered = useHeroCovered(wrap);

  // Only render while the hero is on screen (and not covered, above).
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrap} className="h-full w-full">
      <Canvas
        frameloop={(visible && !covered) || active ? "always" : "never"}
        // Measured untransformed: SkyHero flies the canvas in scaled down, and a transform alone never resizes it.
        resize={{ offsetSize: true }}
        dpr={[1, 1.25]}
        gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
        camera={{ fov: 30, position: [0, 4.2, 11], near: 0.1, far: 60 }}
        onCreated={({ camera }) => camera.lookAt(0, -0.3, 0)}
      >
        {/* Lit like the painting: warm sun from the upper left, sky fill from above. */}
        <hemisphereLight args={["#d6e4f2", "#5e4a2c", 1.1]} />
        <directionalLight position={[-4, 6, 4]} intensity={2.4} color="#fff0d2" />
        {/* useGLTF suspends while it loads; caught here so the hero around the canvas doesn't remount. */}
        <Suspense fallback={null}>
          <Carpet still={still} ready={ready} reveal={reveal} onLoad={onLoad} />
        </Suspense>
      </Canvas>
    </div>
  );
}
