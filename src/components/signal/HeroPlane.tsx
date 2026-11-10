"use client";

import { useGLTF } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import type { MotionValue } from "motion/react";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { HERO_PLANE_MODEL } from "@/lib/hero";
import { createPlaneEngine, type PlaneEngine } from "@/lib/planeEngine";
import { useHeroCovered } from "./useHeroCovered";

/*
 * A biplane crossing the hero's sky, trailing smoke (Hunyuan 3D from the
 * user's image; cut to 80k triangles, 2048 base colour + normal, Draco, by
 * scripts/blender/optimize_glb.py).
 *
 * Flight: in from off the left, high, a long shallow climb and a gentle bank
 * across the top of the sky, out off the right; a pause; again. Pointer x
 * leans the bank a touch. The propeller (cut out by
 * scripts/blender/split_propeller.py) spins on its hub. Smoke: a ring of 320
 * point sprites spawned at the tail each frame, drifting back and up, growing
 * and thinning as they age.
 *
 * Sputters: once or twice a pass the engine chokes for a couple of seconds.
 * It coughs out thick black smoke, the propeller slows, and the plane sinks
 * and shudders, then catches and climbs back to its line.
 *
 * Scroll (`scroll`, 0..1 over the first viewport): the plane breaks off its
 * pass and dives at the camera, swelling as it comes, and climbs out over
 * our heads to the top left. Scrolling back, it resumes the pass.
 *
 * Sound: a synthesized radial engine (lib/planeEngine) that follows it,
 * panned with it: it fades in just before the plane comes on, is loudest as
 * it crosses the middle, faint at the sides, and gone just after it leaves
 * (silent in the pause); it coughs as the plane sputters; it swells and rises
 * in pitch as it dives at us, dropping as it passes overhead. Under it, the
 * desert's wind and blown sand. Plays only if sound was turned on at the boot
 * screen (lib/sound); off under reduced motion.
 *
 * Clarity: dpr up to 2, textures at 2048, the model lit like the painting.
 */

const DRACO_PATH = "/draco/";
/** Seconds to cross, and to wait off screen before the next pass. */
const CROSS_S = 22;
const PAUSE_S = 7;
/** Wingspan as a fraction of the view's width at the plane's depth. */
const SPAN = 0.17;

const SMOKE_N = 320;
const SMOKE_LIFE = 3.2;
/** Propeller speed, radians a second: fast enough to read as a spin, not so fast it strobes. */
const PROP_SPIN = 28;
/** How long a sputter lasts, in seconds. */
const SPUTTER_S = 2.4;

/** A hash of an integer to 0..1, so each pass's sputters are fixed, not Math.random. */
const hash = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
/** Sputter strength 0..1 at `sec` seconds into pass `n`: one or two per pass, quick to choke, slower to clear. */
function sputterAt(n: number, sec: number) {
  let s = 0;
  const count = hash(n) < 0.45 ? 1 : 2;
  for (let i = 0; i < count; i++) {
    // Spread through the middle of the crossing, where it's seen.
    const lo = count === 1 ? 0.3 : i === 0 ? 0.22 : 0.55;
    const start = (lo + hash(n * 7 + i * 13 + 1) * 0.2) * CROSS_S;
    const u = (sec - start) / SPUTTER_S;
    if (u > 0 && u < 1) s = Math.max(s, Math.min(1, u / 0.12) * (1 - Math.max(0, (u - 0.45) / 0.55)));
  }
  return s;
}

const smokeVert = /* glsl */ `
  attribute float aBorn;
  attribute float aSeed;
  attribute float aDark;
  uniform float uTime;
  uniform float uPx;
  varying float vAge;
  varying float vSeed;
  varying float vDark;
  void main() {
    float age = (uTime - aBorn) / ${SMOKE_LIFE.toFixed(2)};
    vAge = age;
    vSeed = aSeed;
    vDark = aDark;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    // Puffs swell as they age: small at the exhaust, wide and thin by the end.
    // Black puffs billow bigger.
    float size = mix(0.07, 0.6, pow(clamp(age, 0.0, 1.0), 0.6)) * (0.8 + aSeed * 0.4) * (1.0 + aDark * 0.7);
    gl_PointSize = size * uPx / -mv.z;
    gl_Position = projectionMatrix * mv;
    if (age < 0.0 || age > 1.0) gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
  }
`;
const smokeFrag = /* glsl */ `
  precision mediump float;
  varying float vAge;
  varying float vSeed;
  varying float vDark;
  void main() {
    vec2 p = gl_PointCoord - 0.5;
    float d = length(p);
    // A soft, slightly lumpy disc.
    float edge = 0.5 - 0.08 * sin(atan(p.y, p.x) * 5.0 + vSeed * 6.28);
    float a = 1.0 - smoothstep(edge - 0.3, edge, d);
    float fade = (1.0 - vAge) * smoothstep(0.0, 0.08, vAge);
    // Warm grey, a touch lighter as it thins against the sky.
    vec3 c = mix(vec3(0.62, 0.6, 0.58), vec3(0.9, 0.9, 0.9), vAge);
    // Sputter smoke: near black, thinning only to a sooty grey, and denser.
    vec3 soot = mix(vec3(0.05, 0.045, 0.04), vec3(0.28, 0.26, 0.25), vAge);
    c = mix(c, soot, vDark);
    gl_FragColor = vec4(c, a * fade * mix(0.8, 0.95, vDark));
  }
`;

function Plane({
  still,
  hoverX,
  scroll,
  engine,
  onLoad,
}: {
  still: boolean;
  hoverX: React.MutableRefObject<number>;
  scroll: MotionValue<number>;
  engine: React.MutableRefObject<PlaneEngine | null>;
  onLoad?: () => void;
}) {
  const { scene } = useGLTF(HERO_PLANE_MODEL, DRACO_PATH);
  const { camera, viewport, size } = useThree();
  const group = useRef<THREE.Group>(null);
  const smoke = useRef<THREE.Points>(null);

  const { model, span, tail, prop } = useMemo(() => {
    const m = scene.clone(true);
    m.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (mesh.isMesh) {
        const mat = mesh.material as THREE.MeshStandardMaterial;
        if (mat?.map) {
          mat.map.anisotropy = 8;
          mat.map.colorSpace = THREE.SRGBColorSpace;
        }
      }
    });
    const box = new THREE.Box3().setFromObject(m);
    const sz = box.getSize(new THREE.Vector3());
    const c = box.getCenter(new THREE.Vector3());
    m.position.sub(c);
    // Hunyuan's model faces the camera (+z): turned to fly along +x.
    const holder = new THREE.Group();
    holder.add(m);
    holder.rotation.y = Math.PI / 2;
    // The tail is the far end of its length (the long axis before the turn is z).
    // The propeller: its own node, origin on the hub, spinning about its local z (forward).
    const prop = m.getObjectByName("prop") ?? null;
    return { model: holder, span: sz.x, tail: new THREE.Vector3(-sz.z / 2, sz.y * 0.05, 0), prop };
  }, [scene]);

  useEffect(() => {
    onLoad?.();
  }, [onLoad]);

  const smokeGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(SMOKE_N * 3), 3));
    g.setAttribute("aBorn", new THREE.BufferAttribute(new Float32Array(SMOKE_N).fill(-100), 1));
    // Seeds from a hash, not Math.random: the same each render.
    g.setAttribute("aSeed", new THREE.BufferAttribute(new Float32Array(SMOKE_N).map((_, i) => ((i * 0.618034) % 1)), 1));
    g.setAttribute("aDark", new THREE.BufferAttribute(new Float32Array(SMOKE_N), 1));
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 100);
    return g;
  }, []);
  const { smokeMat, smokeUniforms } = useMemo(() => {
    const smokeUniforms = { uTime: { value: 0 }, uPx: { value: 1 } };
    const smokeMat = new THREE.ShaderMaterial({
      vertexShader: smokeVert,
      fragmentShader: smokeFrag,
      uniforms: smokeUniforms,
      transparent: true,
      depthWrite: false,
    });
    return { smokeMat, smokeUniforms };
  }, []);
  // The frame loop writes uniforms through a ref that mirrors them (as HeroCarpet does).
  const su = useRef(smokeUniforms);
  useEffect(() => {
    su.current = smokeUniforms;
  }, [smokeUniforms]);
  const puffs = useRef(0);
  const vel = useRef<Float32Array>(new Float32Array(SMOKE_N * 3));
  const lastSpawn = useRef(0);
  const bank = useRef(0);
  /** The sputter's sink below the line, eased: it lags the choke, so it drops then climbs back. */
  const sink = useRef(0);
  const propSpeed = useRef(PROP_SPIN);
  // The frame loop spins the propeller through a ref, as it writes the smoke's uniforms.
  const propRef = useRef<THREE.Object3D | null>(null);
  useEffect(() => {
    propRef.current = prop;
  }, [prop]);
  /** The dive, eased: follows `scroll` with a lag so a flick still reads as a swoop. */
  const dive = useRef(0);
  const tmp = useMemo(() => new THREE.Vector3(), []);
  const smooth = (x: number) => x * x * (3 - 2 * x);

  useFrame(({ clock }, dt) => {
    const g = group.current;
    if (!g) return;
    const t = clock.getElapsedTime();
    const v = viewport.getCurrentViewport(camera, tmp.set(0, 0, 0));
    const s = (v.width * SPAN) / span;
    g.scale.setScalar(s);

    // The pass: a parameter 0..1 across the sky, then a pause out of view.
    const period = CROSS_S + PAUSE_S;
    const k = still ? 0.42 : (t % period) / CROSS_S;
    const on = k <= 1;
    const x = THREE.MathUtils.lerp(-v.width * 0.62, v.width * 0.62, k);
    // Level across the upper sky at the height it came in at, with one long gentle swell.
    const y = v.height * 0.17 + Math.sin(k * Math.PI * 1.6) * v.height * 0.035;
    const lean = still ? 0 : hoverX.current * 0.12;
    // The dive: from wherever the pass has it, toward the camera (z up to 8.8 of the camera's
    // 10) and off past the top left corner, nose swinging to us then up and left.
    dive.current = THREE.MathUtils.lerp(dive.current, still ? 0 : scroll.get(), 0.07);
    const d = smooth(Math.min(1, dive.current));
    const dz = d * 8.8;
    // Sputter: only on the pass, not in the dive. The plane sinks (lagging the choke, so it
    // keeps dropping a moment after, then climbs back) and shudders while it lasts.
    const sp = still || !on ? 0 : sputterAt(Math.floor(t / period), t % period) * (1 - Math.min(1, d * 4));
    sink.current = THREE.MathUtils.lerp(sink.current, sp, sp > sink.current ? 0.035 : 0.02);
    const shake = sp * (Math.sin(t * 41) * 0.6 + Math.sin(t * 67 + 1.3) * 0.4);
    const dip = sink.current * v.height * 0.07 + shake * v.height * 0.006;
    bank.current = THREE.MathUtils.lerp(bank.current, Math.sin(k * Math.PI * 1.6) * 0.22 + lean, 0.04);
    // It swings left early in the dive, so by the time it's close it's already over our left shoulder.
    g.position.set(THREE.MathUtils.lerp(x, -1.6, Math.pow(d, 0.5)), THREE.MathUtils.lerp(y - dip, 1.2, d), dz);
    g.rotation.set(
      // Nose drops as it sinks; wings rock with the shudder.
      THREE.MathUtils.lerp(-bank.current * 0.5, -0.55, d),
      THREE.MathUtils.lerp(-0.35 - sink.current * 0.12, -1.25, d),
      THREE.MathUtils.lerp(bank.current + 0.06 - sink.current * 0.18 + shake * 0.06, 0.55, d),
    );
    g.visible = on || d > 0.01;
    // The propeller labours as it chokes, and runs up again as it catches.
    propSpeed.current = THREE.MathUtils.lerp(propSpeed.current, PROP_SPIN * (1 - 0.55 * sp), 0.08);
    if (propRef.current && !still) propRef.current.rotation.z += propSpeed.current * Math.min(dt, 0.05);

    // The engine, panned with it. On the pass its level follows how near the middle of the
    // view it is: it fades in just before the plane comes on, is loudest crossing the centre,
    // faint at the sides, and gone just after it leaves. A touch of doppler as it goes by.
    // In the dive it swells and climbs in pitch, then drops as it passes over us.
    if (engine.current) {
      const nx = Math.abs(x) / (v.width * 0.5);
      const near = on ? Math.max(0, 1 - nx / 1.22) : 0;
      const passLevel = 0.75 * near ** 1.3;
      const diveLevel = Math.sin(d * Math.PI) * 1.0;
      const level = Math.max(passLevel, diveLevel);
      const doppler = on ? 1 + 0.06 * (0.5 - k) : 1;
      const pitch = doppler * (1 + 0.35 * Math.sin(Math.min(1, d * 1.15) * Math.PI)) * (d > 0.85 ? 0.9 : 1);
      engine.current.set(level, pitch, g.position.x / Math.max(1, v.width * 0.6), sp);
      engine.current.setWind(1);
    }

    // Smoke: spawn a puff every few ms at the tail while on screen; integrate the live ones.
    const geo = smokeGeo;
    const pos = geo.getAttribute("position") as THREE.BufferAttribute;
    const born = geo.getAttribute("aBorn") as THREE.BufferAttribute;
    const dark = geo.getAttribute("aDark") as THREE.BufferAttribute;
    // Thicker while it sputters: puffs come faster, in black gouts.
    if (g.visible && !still && t - lastSpawn.current > (sp > 0.1 ? 0.016 : 0.028)) {
      lastSpawn.current = t;
      const i = puffs.current++ % SMOKE_N;
      tmp.copy(tail).multiplyScalar(s).applyEuler(g.rotation).add(g.position);
      pos.setXYZ(i, tmp.x, tmp.y, tmp.z);
      born.setX(i, t);
      const black = Math.random() < sp * 1.3 ? 0.7 + Math.random() * 0.3 : 0;
      dark.setX(i, black);
      const vv = vel.current;
      // Black smoke hangs heavier: it rises less and spreads more.
      vv[i * 3] = -0.35 - Math.random() * 0.15;
      vv[i * 3 + 1] = (0.08 + Math.random() * 0.1) * (1 - black * 0.6);
      vv[i * 3 + 2] = (Math.random() - 0.5) * (0.08 + black * 0.12);
    }
    const vv = vel.current;
    for (let i = 0; i < SMOKE_N; i++) {
      const age = t - born.getX(i);
      if (age < 0 || age > SMOKE_LIFE) continue;
      // Drifts back and up, slowing; a little lateral wander.
      const slow = 1 - (age / SMOKE_LIFE) * 0.6;
      pos.setXYZ(
        i,
        pos.getX(i) + vv[i * 3] * dt * slow,
        pos.getY(i) + vv[i * 3 + 1] * dt,
        pos.getZ(i) + vv[i * 3 + 2] * dt + Math.sin(t * 2 + i) * 0.002,
      );
    }
    pos.needsUpdate = true;
    born.needsUpdate = true;
    dark.needsUpdate = true;
    su.current.uTime.value = t;
    // Point size is in device pixels: CSS height times the pixel ratio.
    su.current.uPx.value = size.height * viewport.dpr * (camera as THREE.PerspectiveCamera).projectionMatrix.elements[5] * 0.5;
  });

  return (
    <>
      <group ref={group}>
        <primitive object={model} />
      </group>
      <points ref={smoke} geometry={smokeGeo} material={smokeMat} frustumCulled={false} />
    </>
  );
}

export function HeroPlane({ still, scroll, onLoad }: { still: boolean; scroll: MotionValue<number>; onLoad?: () => void }) {
  const wrap = useRef<HTMLDivElement>(null);
  const hoverX = useRef(0);
  const [visible, setVisible] = useState(false);
  const covered = useHeroCovered(wrap);
  const engine = useRef<PlaneEngine | null>(null);

  // The engine and the desert's wind, built once sound is turned on; silent when the hero
  // is off screen or covered (the frame loop stops, so the last levels are zeroed here).
  useEffect(() => {
    if (still) return;
    const e = createPlaneEngine();
    engine.current = e;
    const disarm = e.arm();
    return () => {
      disarm();
      e.dispose();
      engine.current = null;
    };
  }, [still]);
  const running = visible && !covered;
  useEffect(() => {
    if (running) return;
    engine.current?.set(0, 1, 0);
    engine.current?.setWind(0);
  }, [running]);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (still) return;
    const onMove = (e: PointerEvent) => {
      hoverX.current = Math.min(1, Math.max(-1, (e.clientX / window.innerWidth) * 2 - 1));
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [still]);

  return (
    <div ref={wrap} className="h-full w-full">
      <Canvas
        frameloop={running ? "always" : "never"}
        resize={{ offsetSize: true }}
        dpr={[1, 2]}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        camera={{ fov: 30, position: [0, 0, 10], near: 0.1, far: 60 }}
      >
        {/* Lit like the painting: warm sun from the upper left, sky fill from above. */}
        <hemisphereLight args={["#dbe7f5", "#6b5636", 1.2]} />
        <directionalLight position={[-4, 6, 4]} intensity={2.4} color="#fff0d2" />
        <Suspense fallback={null}>
          <Plane still={still} hoverX={hoverX} scroll={scroll} engine={engine} onLoad={onLoad} />
        </Suspense>
      </Canvas>
    </div>
  );
}

useGLTF.preload(HERO_PLANE_MODEL, DRACO_PATH);
