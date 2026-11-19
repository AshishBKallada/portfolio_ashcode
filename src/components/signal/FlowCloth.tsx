"use client";

import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import Image from "next/image";
import { Suspense, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { LinearFilter, NoColorSpace, ShaderMaterial, TextureLoader, type Mesh } from "three";

/*
 * A cut-out picture set moving by a flow mask, as HeroCourierCloth does for the hero's
 * courier: the picture on a plane whose fragment shader slides the UVs, weighted by the
 * mask (R and G, 0 where pinned, 1 where free), so the body stays put and the loose parts
 * move. Two kinds of motion:
 *   cloth: R streams like cloth in wind, G flutters like hair (slow waves and a finer
 *          flutter from simplex noise).
 *   wings: R and G are a wing each, hinged at the root; they beat together, the tip
 *          travelling furthest, with a little feather-flex on the way.
 * Masks are built by scripts/blender/make_linkedin_flow.py.
 *
 * Fills its box, which should have the picture's aspect. Below md, or with reduced motion,
 * it renders the plain picture instead: no canvas on phones. A shadow, when asked for, is a
 * blurred dark copy of the still picture under the canvas: a CSS drop-shadow on the canvas
 * itself would repaint every frame.
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
  uniform float uWings;
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
    vec2 off;
    if (uWings > 0.5) {
      // One beat, both wings: a quick lift and a slower, heavier down-stroke; the tips
      // lag and flex a little, and the feathers fan out as the wing rises.
      float ph = t * 2.2;
      float beat = sin(ph) * 0.8 + sin(ph * 2.0 + 0.9) * 0.2;
      float wing = flow.r + flow.g;
      float side = flow.g - flow.r;
      float lag = sin(ph - 1.2 * wing) * 0.25 * wing;
      off = vec2(side * (0.18 * beat + 0.06 * lag), -(beat + lag)) * wing;
    } else {
      // The cloth: a slow wave running along it, away from the body, with a finer flutter
      // over it; it lifts and drops more than it slides. The hair: smaller and quicker.
      float c1 = snoise(vUv * vec2(2.2, 3.0) + vec2(t * 0.5, t * 0.2));
      float c2 = snoise(vUv * vec2(6.0, 7.0) + vec2(t * 1.0, t * 0.4));
      vec2 cape = vec2(c1 * 0.35 + c2 * 0.12, c1 * 0.75 + c2 * 0.3) * flow.r;
      float h1 = snoise(vUv * vec2(9.0, 11.0) + vec2(t * 0.9, -t * 1.3));
      float h2 = snoise(vUv * vec2(18.0, 15.0) - vec2(t * 1.7, t * 0.6));
      vec2 hair = vec2(h1 * 0.3 + h2 * 0.1, h1 * 0.55 + h2 * 0.25) * flow.g * 0.5;
      off = cape + hair;
    }
    gl_FragColor = texture2D(uMap, vUv + off * uAmp);
  }
`;

type Mode = "cloth" | "wings";

function Sheet({ src, flow, mode, amp }: { src: string; flow: string; mode: Mode; amp: number }) {
  const [map, mask] = useLoader(TextureLoader, [src, flow]);
  const mesh = useRef<Mesh>(null);
  const { size } = useThree();

  const { material, uniforms } = useMemo(() => {
    const pic = map.clone();
    // Raw: the shader writes what it samples with no re-encode, so the picture passes through as is.
    pic.colorSpace = NoColorSpace;
    pic.anisotropy = 4;
    pic.needsUpdate = true;
    const fl = mask.clone();
    fl.minFilter = LinearFilter;
    fl.magFilter = LinearFilter;
    fl.generateMipmaps = false;
    fl.needsUpdate = true;
    const uniforms = {
      uMap: { value: pic },
      uFlow: { value: fl },
      uTime: { value: 0 },
      uAmp: { value: amp },
      uWings: { value: mode === "wings" ? 1 : 0 },
    };
    const material = new ShaderMaterial({ vertexShader: vertex, fragmentShader: fragment, transparent: true, depthWrite: false, uniforms });
    return { material, uniforms };
  }, [map, mask, mode, amp]);
  const u = useRef(uniforms);
  useEffect(() => {
    u.current = uniforms;
    return () => material.dispose();
  }, [uniforms, material]);

  useFrame(({ clock }) => {
    u.current.uTime.value = clock.getElapsedTime();
  });

  return (
    <mesh ref={mesh} material={material}>
      <planeGeometry args={[size.width, size.height]} />
    </mesh>
  );
}

/** True from md up (768px), once mounted: the server and the first paint render the plain picture. */
function useWide() {
  const [wide, setWide] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setWide(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return wide;
}

export function FlowCloth({
  src,
  flow,
  mode,
  still,
  sizes,
  amp = mode === "wings" ? 0.07 : 0.03,
  shadow,
  fallback,
}: {
  src: string;
  flow: string;
  mode: Mode;
  still: boolean;
  /** For the plain picture, as next/image takes it. */
  sizes: string;
  /** How far the freest part moves, as a fraction of the picture. */
  amp?: number;
  /** A shadow under it: a blurred dark copy of the still picture, offset down, as a filter class list. */
  shadow?: string;
  /** What to render instead on phones or with reduced motion; the plain picture by default. */
  fallback?: ReactNode;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const wide = useWide();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: "10% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, [wide, still]);

  if (still || !wide) {
    return <>{fallback ?? <Image src={src} alt="" fill sizes={sizes} className="object-contain" />}</>;
  }
  return (
    <div ref={wrap} className="absolute inset-0">
      {shadow ? <Image src={src} alt="" fill sizes={sizes} aria-hidden className={`object-contain ${shadow}`} /> : null}
      <Canvas
        frameloop={visible ? "always" : "demand"}
        resize={{ offsetSize: true }}
        dpr={[1, 2]}
        gl={{ alpha: true, antialias: false, powerPreference: "low-power" }}
        orthographic
        camera={{ zoom: 1, position: [0, 0, 10], near: 0.1, far: 100 }}
      >
        <Suspense fallback={null}>
          <Sheet src={src} flow={flow} mode={mode} amp={amp} />
        </Suspense>
      </Canvas>
    </div>
  );
}
