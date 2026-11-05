"use client";

import { useGLTF } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import type { MotionValue } from "motion/react";
import { Suspense, useEffect, useMemo, useRef, useState, type MutableRefObject, type PointerEvent } from "react";
import * as THREE from "three";
import { useHeroCovered } from "./useHeroCovered";

/*
 * The magic carpet under the courier, so the leap reads as a ride: billowing
 * along its length, its ends curled up, the billow lifting as the scroll
 * reveal runs. The bend is done in the vertex shader on both the carpet and
 * its tassels, so the tassels stay on the edge.
 *
 * Two mats to ride, switched by MODEL:
 *   sketchfab — "Aladdin's Magic Carpet" by Kremit, CC-BY-4.0 (credited in SiteFooter):
 *     https://sketchfab.com/3d-models/aladdins-magic-carpet-2c363d45fb824fbcab624e2ad66eed02
 *   ours — built in Blender by scripts/blender/make_carpet.py (no credit needed; drop
 *     the footer credit when switching to it).
 * Both share the mesh layout the bend expects and the node names read below.
 */

const MODELS = {
  sketchfab: "/models/carpet/sketchfab/scene.gltf",
  ours: "/models/carpet/carpet.glb",
} as const;
const MODEL = MODELS.sketchfab;

type Bend = {
  uTime: { value: number };
  uLift: { value: number };
  /** 0 lying flat, 1 stood up on its end (the perch beat of the entry). */
  uStand: { value: number };
  /** How far the top end folds over toward the viewer while standing, like a head. */
  uFold: { value: number };
  /** Signed flap of the top's two corners while it talks, like hands as it speaks. */
  uTalk: { value: number };
};

/** Bends the flat carpet (it lies in its own xy plane, long along y, ±5.4). */
function bendMaterial(source: THREE.Material, bend: Bend) {
  const mat = source.clone();
  mat.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, bend);
    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", "#include <common>\nuniform float uTime;\nuniform float uLift;\nuniform float uStand;\nuniform float uFold;\nuniform float uTalk;")
      .replace(
        "#include <begin_vertex>",
        `#include <begin_vertex>
        float along = transformed.y / 5.43;
        // A slow billow running tail to nose, a lighter ripple across, and the ends curled up.
        float wave = (sin(transformed.y * 0.62 - uTime * 2.1) * (0.32 + uLift * 0.35)
                   + sin(transformed.x * 0.9 + uTime * 1.4) * 0.12) * (1.0 - uStand * 0.75);
        float curl = (along * along * (0.9 + uLift * 0.5) + max(-along, 0.0) * 0.35) * (1.0 - uStand);
        transformed.z += wave * (0.45 + 0.55 * abs(along)) + curl;
        // Stood up, only its top bows concave across its width: the vertical centre line
        // sinks back while the side edges stay forward, breathing slowly. The rest stays
        // flat, standing on its tassels.
        float across = transformed.x / 4.0;
        float bow = 1.0 + sin(uTime * 2.4) * 0.15;
        float top = smoothstep(0.55, 1.0, along);
        transformed.z += across * across * 2.8 * top * bow * uStand;
        // And along its height: the top corners curl further forward and flare out
        // sideways, so the two ends of the top stand proud of the rest, like ears.
        float corner = across * across * top * top;
        transformed.z += corner * 1.6 * bow * uStand;
        transformed.x += sign(across) * corner * 0.9 * uStand;
        // Stood up, the top end bends over toward the viewer round an arc, like a head.
        float hinge = 2.8;
        float past = max(transformed.y - hinge, 0.0);
        if (past > 0.0) {
          float radius = 1.3;
          // Talking, its corners gesture in turn: one folds further as the other lifts.
          float theta = past / radius * uFold + uTalk * across * (past / 3.2);
          transformed.y = mix(transformed.y, hinge + radius * sin(theta), uStand);
          transformed.z += radius * (1.0 - cos(theta)) * uStand;
        }`,
      );
    // Its weave recarved in the courier statue's marble, by brightness: cool slate in the
    // shadows, stone grey through the ground, near-white in the pattern and highlights.
    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <map_fragment>",
      `#include <map_fragment>
      {
        float l = pow(clamp(dot(diffuseColor.rgb, vec3(0.2126, 0.7152, 0.0722)), 0.0, 1.0), 1.0 / 2.2);
        vec3 slate = pow(vec3(0.353, 0.373, 0.400), vec3(2.2));
        vec3 stone = pow(vec3(0.663, 0.678, 0.702), vec3(2.2));
        vec3 marble = pow(vec3(0.914, 0.918, 0.925), vec3(2.2));
        vec3 c = mix(slate, stone, smoothstep(0.1, 0.4, l));
        c = mix(c, marble, smoothstep(0.42, 0.7, l));
        diffuseColor.rgb = c;
      }`,
    );
  };
  mat.customProgramCacheKey = () => "carpet-bend-marble";
  return mat;
}

/**
 * The entry's beats, on SkyHero's entry clock (passed in as `entry`): it
 * flies in turning, perches behind the courier off to his right, stands up on
 * its end and sways, hops and bows there, then lies back down and flies under
 * his feet.
 */
export const CARPET_FLY_IN_S = 1.9;
export const CARPET_PERCH_S = 3.6;
export const CARPET_FLY_DOWN_S = 1.8;
const ENTRY_S = CARPET_FLY_IN_S + CARPET_PERCH_S + CARPET_FLY_DOWN_S;
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const smooth = (x: number) => x * x * (3 - 2 * x);
/** Left unscrolled this long after landing (or its last turn), it turns once more, over IDLE_SPIN_S. */
const IDLE_S = 6;
const IDLE_SPIN_S = 2.4;
/** Horizontal turn on pointer hover (radians at the edges of the mat). */
const HOVER_Y = 0.62;
/** Lerp toward the hover target each frame — lower is smoother/slower. */
const HOVER_SMOOTH = 0.07;
const easeInOut = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

function Carpet({
  still,
  entry,
  reveal,
  hoverX,
  onLoad,
}: {
  still: boolean;
  entry: MotionValue<number>;
  reveal: MotionValue<number>;
  /** Pointer x over the mat, −1…1; eases the carpet's Y rotation. */
  hoverX: MutableRefObject<number>;
  onLoad?: () => void;
}) {
  const { nodes, materials } = useGLTF(MODEL) as unknown as {
    nodes: Record<string, THREE.Mesh>;
    materials: Record<string, THREE.Material>;
  };
  const { mats, uniforms } = useMemo(() => {
    const uniforms: Bend = { uTime: { value: 0 }, uLift: { value: 0 }, uStand: { value: 0 }, uFold: { value: 0 }, uTalk: { value: 0 } };
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
  // Stood up: the long axis turned to the vertical and the face turned to the camera.
  const standY = useRef<THREE.Group>(null);
  const standZ = useRef<THREE.Group>(null);
  // The idle turn: the clock time the wait last restarted (landing, a scroll, a turn's end),
  // and when the current turn began. A scroll only flags itself; the frame reads the clock.
  const idleFrom = useRef<number | null>(null);
  const spinStart = useRef<number | null>(null);
  const scrolled = useRef(false);
  const hoverTurn = useRef(0);
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
      const k = entry.get();
      const e = clamp01(k / ENTRY_S);
      // One full turn on the way in to the perch, easing out as it arrives.
      const left = 1 - (1 - Math.pow(1 - clamp01(k / CARPET_FLY_IN_S), 3));
      const perchEnd = CARPET_FLY_IN_S + CARPET_PERCH_S;
      const up = smooth(clamp01((k - CARPET_FLY_IN_S * 0.45) / (CARPET_FLY_IN_S * 0.55)));
      const down = smooth(clamp01((k - perchEnd) / (CARPET_FLY_DOWN_S * 0.6)));
      const stand = up * (1 - down);
      // At the perch it talks: its folded top flaps in quick syllables, grouped into
      // phrases with pauses between, its corners gesturing, its body swaying and
      // bobbing on its tassels as it speaks.
      const phrase = smooth(clamp01((Math.sin(k * 1.9) + 0.2) / 0.8));
      const syllable = Math.sin(k * 9.5) * 0.5 + Math.sin(k * 6.1) * 0.25;
      const talk = phrase * stand;
      const sway = (Math.sin(k * 2.6) * 0.12 + Math.sin(k * 4.3) * 0.05 * phrase) * stand;
      const hop = (Math.abs(Math.sin(k * 3.2)) * 0.12 + Math.max(syllable, 0) * 0.12 * phrase) * stand;
      bend.current.uStand.value = stand;
      bend.current.uFold.value = stand * (0.5 + Math.sin(k * 2.0) * 0.06 + syllable * 0.22 * phrase);
      // Quick, uneven flaps of the corners, as fast as speech.
      bend.current.uTalk.value = (Math.sin(k * 13) * 0.6 + Math.sin(k * 8.3) * 0.4) * 1.1 * talk;
      if (standY.current && standZ.current) {
        // Faces the camera, turned only a touch to its left toward the courier.
        standY.current.rotation.y = (-Math.PI / 2 - 0.3) * stand + Math.sin(k * 1.7) * 0.08 * stand;
        standZ.current.rotation.z = (-Math.PI / 2) * stand;
      }
      // Stood up it's taller than the canvas sees, so it shrinks here and SkyHero scales
      // the box up to match; raised a touch so its folded top and its tassels both clear.
      g.scale.setScalar(1 - 0.5 * stand);
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
      const targetHover = still ? 0 : hoverX.current * HOVER_Y;
      hoverTurn.current = THREE.MathUtils.lerp(hoverTurn.current, targetHover, HOVER_SMOOTH);
      g.rotation.y = -(left + spin) * Math.PI * 2 + hoverTurn.current;
      // Rolls and dips a little under the rider, banking into a turn.
      g.rotation.z =
        Math.sin(t * 0.8) * 0.05 + left * 0.5 + Math.sin(spin * Math.PI) * 0.3 + hoverTurn.current * 0.12 + sway;
      g.position.y = Math.sin(t * 1.3) * 0.12 + hop + 0.25 * stand;
    }
  });

  return (
    <group ref={group}>
      <group ref={standY}>
        <group ref={standZ}>
          {/* Long axis left to right, nose toward where the courier is heading. */}
          <group rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
            <group position={[0, 0, -1.962]}>
              <mesh geometry={nodes.TASSELS_0.geometry} material={mats.tassels} />
              {/* The Sketchfab mat's tassels come in two parts; ours in one. */}
              {nodes.TASSELS_0_1 ? <mesh geometry={nodes.TASSELS_0_1.geometry} material={mats.tassels} /> : null}
              <mesh geometry={nodes.CARPET_0.geometry} material={mats.carpet} />
            </group>
          </group>
        </group>
      </group>
    </group>
  );
}

export function HeroCarpet({
  still,
  entry,
  active = false,
  reveal,
  onLoad,
}: {
  still: boolean;
  /** Seconds into the entry (SkyHero runs it once the loader has lifted and the model is in). */
  entry: MotionValue<number>;
  /** Keep drawing while true, even off screen (the entry starts outside the view). */
  active?: boolean;
  reveal: MotionValue<number>;
  onLoad?: () => void;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const hoverX = useRef(0);
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

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (still || !wrap.current) return;
    const r = wrap.current.getBoundingClientRect();
    if (!r.width) return;
    hoverX.current = Math.min(1, Math.max(-1, ((e.clientX - r.left) / r.width) * 2 - 1));
  };
  const onPointerLeave = () => {
    hoverX.current = 0;
  };

  return (
    <div
      ref={wrap}
      className="h-full w-full touch-none"
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
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
          <Carpet still={still} entry={entry} reveal={reveal} hoverX={hoverX} onLoad={onLoad} />
        </Suspense>
      </Canvas>
    </div>
  );
}
