"use client";

import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { LinearFilter, NoColorSpace, ShaderMaterial, TextureLoader, type Mesh } from "three";
import { HERO_COURIER, HERO_COURIER_FLOW } from "@/lib/hero";
import { useHeroCovered } from "./useHeroCovered";

/*
 * The painted courier with his cape and hair floating: the picture drawn on a
 * plane whose fragment shader slides the UVs with wind noise, weighted by a
 * flow mask (R = cape, G = hair; 0 at the clasp and scalp, 1 at the free
 * ends), so the body stays put and the cloth streams off it. The mask spills
 * a little past the silhouette, so edges can move out into the transparent
 * surround. Built by scripts/blender/make_courier_flow.py.
 *
 * Laid out like the img it replaces: contained in the box, feet on the bottom.
 */

const vertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragment = /* glsl */ `
  precision highp float;
  uniform sampler2D uMap;
  uniform sampler2D uFlow;
  uniform float uTime;
  uniform float uAmp;
  uniform vec2 uWind;
  varying vec2 vUv;

  // 2D simplex noise (Ashima / Ian McEwan), public domain.
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }
  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
    m = m * m; m = m * m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  void main() {
    vec2 flow = texture2D(uFlow, vUv).rg;
    float t = uTime;
    // The cape: a slow wave running along it (left to right, as the wind would), with a
    // finer flutter over it; it lifts and drops more than it slides.
    float c1 = snoise(vUv * vec2(2.2, 3.0) + vec2(-t * 0.55, t * 0.2));
    float c2 = snoise(vUv * vec2(6.0, 7.0) + vec2(-t * 1.1, t * 0.4));
    vec2 cape = (vec2(c1 * 0.35 + c2 * 0.12, c1 * 0.75 + c2 * 0.3) + uWind * 0.4) * flow.r;
    // The hair: smaller, quicker, mostly up and down.
    float h1 = snoise(vUv * vec2(9.0, 11.0) + vec2(t * 0.9, -t * 1.3));
    float h2 = snoise(vUv * vec2(18.0, 15.0) - vec2(t * 1.7, t * 0.6));
    vec2 hair = (vec2(h1 * 0.3 + h2 * 0.1, h1 * 0.55 + h2 * 0.25) + uWind * 0.2) * flow.g * 0.45;
    vec2 uv = vUv + (cape + hair) * uAmp;
    vec4 col = texture2D(uMap, uv);
    gl_FragColor = col;
  }
`;

const ASPECT = HERO_COURIER.width / HERO_COURIER.height;

function Cloth({ still, wind }: { still: boolean; wind: React.MutableRefObject<{ x: number; y: number }> }) {
  const [map, flow] = useLoader(TextureLoader, [HERO_COURIER.src, HERO_COURIER_FLOW]);
  const mesh = useRef<Mesh>(null);
  const { size } = useThree();

  // Textures and material made together, once per load (the loader's textures are shared,
  // so they're cloned before their sampling is set). The frame loop writes uniforms
  // through a ref that mirrors them, as HeroCarpet does.
  const { material, uniforms } = useMemo(() => {
    const pic = map.clone();
    // Raw: a ShaderMaterial writes what it samples with no re-encode, so an sRGB-tagged
    // texture (decoded to linear on sample) would come out dark. Pass the pixels through.
    pic.colorSpace = NoColorSpace;
    pic.anisotropy = 4;
    pic.needsUpdate = true;
    const mask = flow.clone();
    mask.minFilter = LinearFilter;
    mask.magFilter = LinearFilter;
    mask.generateMipmaps = false;
    mask.needsUpdate = true;
    const uniforms = {
      uMap: { value: pic },
      uFlow: { value: mask },
      uTime: { value: 0 },
      uAmp: { value: 0 },
      uWind: { value: [0, 0] as number[] },
    };
    const material = new ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      transparent: true,
      depthWrite: false,
      uniforms,
    });
    return { material, uniforms };
  }, [map, flow]);
  const u = useRef(uniforms);
  useEffect(() => {
    u.current = uniforms;
    u.current.uAmp.value = still ? 0 : 0.028;
  }, [uniforms, still]);

  // Contain in the box, bottom aligned, in pixel units (the camera is ortho at zoom 1).
  const w = Math.min(size.width, size.height * ASPECT);
  const h = w / ASPECT;
  const y = -size.height / 2 + h / 2;

  useFrame(({ clock }) => {
    u.current.uTime.value = clock.getElapsedTime();
    const w = u.current.uWind.value;
    // Ease toward the pointer's wind, so a gust fades in and out.
    w[0] += (wind.current.x - w[0]) * 0.05;
    w[1] += (wind.current.y - w[1]) * 0.05;
  });

  return (
    <mesh ref={mesh} position={[0, y, 0]} material={material}>
      <planeGeometry args={[w, h]} />
    </mesh>
  );
}

useLoader.preload(TextureLoader, [HERO_COURIER.src, HERO_COURIER_FLOW]);

export function HeroCourierCloth({ still }: { still: boolean }) {
  const wrap = useRef<HTMLDivElement>(null);
  const wind = useRef({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);
  const covered = useHeroCovered(wrap);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // The pointer's movement is the wind: fast moves gust the cape, a still cursor lets it settle.
  useEffect(() => {
    if (still) return;
    let last = { x: 0, y: 0, t: 0 };
    const onMove = (e: PointerEvent) => {
      const now = performance.now();
      const dt = Math.max(16, now - last.t);
      if (last.t) {
        const vx = ((e.clientX - last.x) / dt) * 16;
        const vy = ((e.clientY - last.y) / dt) * 16;
        wind.current.x = Math.max(-1, Math.min(1, vx * 0.06));
        wind.current.y = Math.max(-1, Math.min(1, -vy * 0.06));
      }
      last = { x: e.clientX, y: e.clientY, t: now };
    };
    const settle = window.setInterval(() => {
      wind.current.x *= 0.85;
      wind.current.y *= 0.85;
    }, 100);
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.clearInterval(settle);
    };
  }, [still]);

  return (
    <div ref={wrap} className="h-full w-full">
      <Canvas
        frameloop={visible && !covered && !still ? "always" : "demand"}
        resize={{ offsetSize: true }}
        dpr={[1, 2]}
        gl={{ alpha: true, antialias: false, powerPreference: "low-power" }}
        orthographic
        camera={{ zoom: 1, position: [0, 0, 10], near: 0.1, far: 100 }}
      >
        {/* useLoader suspends until both textures are in (the loader preloads the picture). */}
        <Suspense fallback={null}>
          <Cloth still={still} wind={wind} />
        </Suspense>
      </Canvas>
    </div>
  );
}
