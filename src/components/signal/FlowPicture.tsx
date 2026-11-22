"use client";

import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { LinearFilter, NoColorSpace, ShaderMaterial, TextureLoader, type Mesh } from "three";
import { useHeroCovered } from "./useHeroCovered";

/*
 * A cut-out picture with its cloth and hair floating: drawn on a plane whose
 * fragment shader slides the UVs with wind noise, weighted by a flow mask
 * (R = cloth, G = hair; 0 where pinned, 1 at the free ends), so the body stays
 * put and the cloth streams off it. The mask spills a little past the
 * silhouette, so edges can move out into the transparent surround.
 * The same shader as HeroCourierCloth, for any picture and mask
 * (the samurai's: scripts/blender/make_samurai_flow.py).
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
  uniform float uHairAmp;
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
    vec2 cape = (vec2(c1 * 0.35 + c2 * 0.12, c1 * 0.75 + c2 * 0.3) + uWind * 1.1) * flow.r;
    // The hair: one slow, smooth sway running down it from the root, with a gentle drift over
    // it, all low frequency, so each strand moves as one piece instead of rippling apart.
    float sway = sin(t * 1.1 - flow.g * 2.6 + vUv.x * 1.5);
    float drift = snoise(vUv * 1.4 + vec2(t * 0.18, -t * 0.14));
    vec2 hair = (vec2(sway * 0.35 + drift * 0.2, sway * 0.5 + drift * 0.15) + uWind * 0.9) * flow.g * uHairAmp;
    vec2 uv = vUv + (cape + hair) * uAmp;
    vec4 col = texture2D(uMap, uv);
    gl_FragColor = col;
  }
`;

type FlowPictureProps = {
  /** The cut-out picture. */
  src: string;
  /** Its flow mask: R = cloth weight, G = hair weight. */
  flow: string;
  /** The picture's size, for its aspect. */
  width: number;
  height: number;
  /** How far the cloth moves, in UV units. */
  amp?: number;
  /** How far the hair moves, relative to the cloth. */
  hairAmp?: number;
  still: boolean;
};

function Cloth({
  src,
  flow: flowSrc,
  width,
  height,
  amp = 0.028,
  hairAmp = 0.45,
  still,
  wind,
}: FlowPictureProps & { wind: React.MutableRefObject<{ x: number; y: number }> }) {
  const ASPECT = width / height;
  const [map, flow] = useLoader(TextureLoader, [src, flowSrc]);
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
      uHairAmp: { value: hairAmp },
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
  }, [map, flow, hairAmp]);
  const u = useRef(uniforms);
  useEffect(() => {
    u.current = uniforms;
    u.current.uAmp.value = still ? 0 : amp;
  }, [uniforms, still, amp]);

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

/** Window event that blows a gust through every FlowPicture: detail {x, y}, about -1.6…1.6. */
export const FLOW_GUST = "flow-gust";

export function FlowPicture(props: FlowPictureProps) {
  const { still } = props;
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
        // Only ever raise the wind from the pointer, so a gust is not cut short by a slow move.
        const wx = Math.max(-1, Math.min(1, vx * 0.09));
        const wy = Math.max(-1, Math.min(1, -vy * 0.09));
        if (Math.abs(wx) > Math.abs(wind.current.x)) wind.current.x = wx;
        if (Math.abs(wy) > Math.abs(wind.current.y)) wind.current.y = wy;
      }
      last = { x: e.clientX, y: e.clientY, t: now };
    };
    const settle = window.setInterval(() => {
      wind.current.x *= 0.85;
      wind.current.y *= 0.85;
    }, 100);
    // A gust from outside (the hero's katana slash): a hard push the settle then eases off.
    const onGust = (e: Event) => {
      const { x, y } = (e as CustomEvent<{ x: number; y: number }>).detail;
      wind.current.x = Math.max(-1.6, Math.min(1.6, x));
      wind.current.y = Math.max(-1.6, Math.min(1.6, y));
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener(FLOW_GUST, onGust);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener(FLOW_GUST, onGust);
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
          <Cloth {...props} wind={wind} />
        </Suspense>
      </Canvas>
    </div>
  );
}
