"use client";

import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import type { MotionValue } from "motion/react";
import { Suspense, useEffect, useMemo, useRef } from "react";
import {
  AdditiveBlending,
  BackSide,
  BufferAttribute,
  BufferGeometry,
  DoubleSide,
  PerspectiveCamera,
  RepeatWrapping,
  ShaderMaterial,
  SRGBColorSpace,
  TextureLoader,
  type Texture,
} from "three";
import { PANO_SHARDS, PANO_SIZE, SHARD_ATLAS_SIZE, SHARD_SOURCE } from "@/data/panoShards";
import { skyRate } from "@/lib/skyTimelapse";
import { duelFx } from "@/lib/heroDuel";

/** The desert and its gold portal, an equirectangular 360° photograph; phones take the half-size copy. */
const PANO_WIDE = "/images/hero/pano/desert-4k.webp";
const PANO_NARROW = "/images/hero/pano/desert-2k.webp";
/** The marble chips cut out of the photograph (scripts/blender/make_pano_shards.py), one per cell. */
const SHARDS_ATLAS = "/images/hero/pano/shards.png";
const PANO_RADIUS = 50;
/** Just inside the panorama's sphere, so the chips draw in front of it. */
const SHARD_RADIUS = 49;

/** At rest the portal sits a little left of centre, clear of the courier. */
const BASE_YAW = -0.22;
const BASE_FOV = 72;
/** How far the cursor turns the head, in radians: about 14° side to side, 6° up and down. */
const YAW_REACH = 0.25;
const PITCH_REACH = 0.1;
/** The slow idle sway, so the desert breathes even under a still cursor. */
const DRIFT_SPEED = 0.04;
const DRIFT_REACH = 0.05;
/** The arrival: the camera starts turned away, looking up at the sky, and whips round to the portal. */
const INTRO_DELAY = 1;
const INTRO_S = 3.4;
const INTRO_YAW = Math.PI * 1.15;
const INTRO_PITCH = 0.55;
const INTRO_FOV = 105;

const easeOutQuint = (t: number) => 1 - Math.pow(1 - t, 5);
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/**
 * Where the ground's camera looks, apart from the arrival: turned with the pointer, drifting
 * with time, and spinning on out as the hero scrolls (`scroll` 0..1 through the pin), with
 * its field widening.
 */
function groundView(scroll: number, mx: number, my: number, now: number) {
  const leaving = easeInOutCubic(scroll);
  return {
    yaw: BASE_YAW - mx * YAW_REACH + Math.sin(now * DRIFT_SPEED * Math.PI * 2) * DRIFT_REACH - leaving * INTRO_YAW,
    pitch: -my * PITCH_REACH + leaving * INTRO_PITCH,
    roll: leaving * 0.12,
    fov: BASE_FOV + (INTRO_FOV - BASE_FOV) * leaving,
  };
}

// The sky's clouds drift round the horizon while the sand stays put, and the dunes
// shimmer with heat in a band just under it. `t` runs 0 at the zenith to 1 underfoot.
const hallVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const hallFragment = /* glsl */ `
  uniform sampler2D map;
  uniform float time;
  uniform float skyTime;
  uniform float motion;
  varying vec2 vUv;
  void main() {
    vec2 uv = vUv;
    float t = 1.0 - uv.y;
    float sky = smoothstep(0.32, 0.16, t);
    // The sky's own clock, sped up in timelapse bursts (lib/skyTimelapse).
    uv.x += skyTime * 0.0035 * sky * motion;
    float haze = smoothstep(0.47, 0.5, t) * smoothstep(0.64, 0.53, t) * motion;
    uv.x += sin(t * 820.0 + time * 2.6) * 0.0007 * haze;
    uv.y += sin(uv.x * 1300.0 + time * 1.9) * 0.0005 * haze;
    gl_FragColor = texture2D(map, uv);
    #include <colorspace_fragment>
  }
`;

type Rig = {
  mx: MotionValue<number>;
  my: MotionValue<number>;
  /** 0 to 1 through the hero's pin: scrolling down plays the arrival on out, still turning the same way. */
  scroll: MotionValue<number>;
  still: boolean;
  start: boolean;
};

function desertMaterial(texture: Texture, still: boolean) {
  texture.colorSpace = SRGBColorSpace;
  texture.wrapS = RepeatWrapping;
  texture.anisotropy = 4;
  const uniforms = {
    map: { value: texture },
    time: { value: 0 },
    skyTime: { value: 0 },
    motion: { value: still ? 0 : 1 },
  };
  return {
    uniforms,
    material: new ShaderMaterial({
      uniforms,
      vertexShader: hallVertex,
      fragmentShader: hallFragment,
      side: BackSide,
    }),
  };
}

function Desert({ src, onLoad, ...rig }: Rig & { src: string; onLoad?: () => void }) {
  const { mx, my, scroll, still, start } = rig;
  const texture = useLoader(TextureLoader, src);
  const { material, uniforms } = useMemo(() => desertMaterial(texture, still), [texture, still]);
  const shader = useRef(uniforms);
  useEffect(() => {
    shader.current = uniforms;
    return () => material.dispose();
  }, [material, uniforms]);
  useEffect(() => onLoad?.(), [onLoad]);

  // The intro's clock starts when the loader lifts; until then the camera waits turned away.
  const startedAt = useRef<number | null>(null);

  useFrame((state, delta) => {
    const camera = state.camera as PerspectiveCamera;
    camera.rotation.order = "YXZ";
    const now = state.clock.elapsedTime;
    shader.current.time.value = now;
    shader.current.skyTime.value += Math.min(delta, 1 / 20) * skyRate(performance.now() / 1000);
    if (start && startedAt.current === null) startedAt.current = now + INTRO_DELAY;
    const intro = still ? 1 : startedAt.current === null ? 0 : Math.min(1, Math.max(0, (now - startedAt.current) / INTRO_S));
    const arriving = 1 - easeOutQuint(intro);
    // Scrolling down spins on past the portal the way the arrival came in, back up into
    // the sky and wide; scrolling up brings it round to the portal again.
    const view = still ? groundView(0, 0, 0, 0) : groundView(scroll.get(), mx.get(), my.get(), now);
    if (still) view.yaw = BASE_YAW;
    camera.rotation.y = view.yaw + arriving * INTRO_YAW;
    camera.rotation.x = view.pitch + arriving * INTRO_PITCH;
    camera.rotation.z = view.roll + arriving * 0.12;
    // The wyverns' pressure trembles the ground's view, and their impact kicks it (lib/heroDuel).
    const tremor = still ? 0 : duelFx.tremor;
    if (tremor > 0.002) {
      camera.rotation.x += (Math.random() - 0.5) * tremor * 0.004;
      camera.rotation.y += (Math.random() - 0.5) * tremor * 0.004;
    }
    const fov = view.fov + (INTRO_FOV - BASE_FOV) * arriving;
    if (Math.abs(camera.fov - fov) > 0.01) {
      camera.fov = fov;
      camera.updateProjectionMatrix();
    }
  });

  // Seen from inside: mirrored so it reads the right way round, and turned a quarter so the
  // photograph's centre (the portal) sits straight ahead. The chips ride inside it, in its frame.
  return (
    <mesh rotation={[0, -Math.PI / 2, 0]} scale={[-1, 1, 1]} material={material}>
      <sphereGeometry args={[PANO_RADIUS, 64, 32]} />
      <Shards still={still} />
    </mesh>
  );
}

/*
 * The chips flying off the sphere behind the portal: cut out of the photograph into an atlas,
 * each put back on the panorama's sphere exactly where it was, as a small quad in the sphere's
 * tangent plane there. From its place each drifts on away from the sphere, turning, shrinking
 * a little and fading, then starts over where it was: a slow stream of chips coming off the
 * shatter, each on its own clock. All of it in the vertex shader, from one draw.
 * With reduced motion they sit still where the photograph had them.
 */
const shardVertex = /* glsl */ `
  uniform float time;
  uniform float motion;
  attribute vec3 centre;
  attribute vec3 east;
  attribute vec3 north;
  attribute vec2 corner;
  attribute vec2 size;
  attribute vec2 away;
  attribute float seed;
  attribute float travel;
  varying vec2 vUv;
  varying float vAlpha;
  void main() {
    vUv = uv;
    float period = 9.0 + seed * 6.0;
    float loop = fract(time / period + seed) * motion;
    // Quick off the mark, slowing as it goes, as a chip losing its push does.
    float ease = loop * (2.0 - loop);
    vec2 drift = away * travel * ease;
    drift += vec2(sin(time * 0.8 + seed * 20.0), cos(time * 0.6 + seed * 13.0)) * travel * 0.05 * motion;
    float spin = (seed - 0.5) * 1.6 * time * motion;
    float c = cos(spin);
    float s = sin(spin);
    vec2 cc = corner * size * (1.0 - 0.3 * loop);
    vec2 r = vec2(cc.x * c - cc.y * s, cc.x * s + cc.y * c);
    vec3 p = centre + east * (drift.x + r.x) + north * (drift.y + r.y);
    float fade = smoothstep(0.0, 0.08, loop) * (1.0 - smoothstep(0.6, 1.0, loop));
    vAlpha = mix(1.0, fade, motion);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;
const shardFragment = /* glsl */ `
  uniform sampler2D map;
  varying vec2 vUv;
  varying float vAlpha;
  void main() {
    vec4 c = texture2D(map, vUv);
    c.a *= vAlpha;
    if (c.a < 0.01) discard;
    gl_FragColor = c;
    #include <colorspace_fragment>
  }
`;

/** One quad per chip, in the sphere's own frame, from the generated table. */
function shardGeometry() {
  const n = PANO_SHARDS.length;
  const [W, H] = PANO_SIZE;
  const [AW, AH] = SHARD_ATLAS_SIZE;
  const [sx, sy] = SHARD_SOURCE;
  const R = SHARD_RADIUS;
  const centre = new Float32Array(n * 12);
  const east = new Float32Array(n * 12);
  const north = new Float32Array(n * 12);
  const corner = new Float32Array(n * 8);
  const size = new Float32Array(n * 8);
  const away = new Float32Array(n * 8);
  const uv = new Float32Array(n * 8);
  const seed = new Float32Array(n * 4);
  const travel = new Float32Array(n * 4);
  const index = new Uint16Array(n * 6);
  const CORNERS = [
    [-0.5, -0.5],
    [0.5, -0.5],
    [-0.5, 0.5],
    [0.5, 0.5],
  ];
  // A fixed scatter (a small LCG), so every render deals the same clocks.
  let lcg = 11;
  const rand = () => ((lcg = (lcg * 16807) % 2147483647) - 1) / 2147483646;
  // The photograph wraps three.js's sphere with u along its width and v down it, the vertex at
  // (-cos φ sin θ, cos θ, sin φ sin θ), φ = 2πu, θ = πv: the chip's place, and the sphere's
  // tangents there along the photograph's x (east) and up it (north).
  PANO_SHARDS.forEach((sh, i) => {
    const phi = (sh.x / W) * Math.PI * 2;
    const theta = (sh.y / H) * Math.PI;
    const sinT = Math.sin(theta);
    const c = [-Math.cos(phi) * sinT * R, Math.cos(theta) * R, Math.sin(phi) * sinT * R];
    const e = [Math.sin(phi), 0, Math.cos(phi)];
    const nn = [Math.cos(phi) * Math.cos(theta), sinT, -Math.sin(phi) * Math.cos(theta)];
    // Pixel sizes in the sphere's units: a pixel across is 2πR/W at the equator, down is πR/H.
    const w = ((sh.w * Math.PI * 2) / W) * R * sinT;
    const h = ((sh.h * Math.PI) / H) * R;
    const dx = sh.x - sx;
    const dy = -(sh.y - sy);
    const dist = Math.hypot(dx, dy);
    const s = rand();
    const trav = ((0.4 * dist * Math.PI * 2) / W) * R;
    for (let k = 0; k < 4; k++) {
      const v = i * 4 + k;
      centre.set(c, v * 3);
      east.set(e, v * 3);
      north.set(nn, v * 3);
      const [cx, cy] = CORNERS[k];
      corner.set([cx, cy], v * 2);
      size.set([w, h], v * 2);
      away.set([dx / dist, dy / dist], v * 2);
      uv.set([(sh.ax + (cx + 0.5) * sh.w) / AW, 1 - (sh.ay + (0.5 - cy) * sh.h) / AH], v * 2);
      seed[v] = s;
      travel[v] = trav;
    }
    index.set([i * 4, i * 4 + 1, i * 4 + 2, i * 4 + 2, i * 4 + 1, i * 4 + 3], i * 6);
  });
  const geometry = new BufferGeometry();
  geometry.setIndex(new BufferAttribute(index, 1));
  // A position attribute keeps three.js's bounds and draw-range bookkeeping happy; the shader ignores it.
  geometry.setAttribute("position", new BufferAttribute(centre, 3));
  geometry.setAttribute("centre", new BufferAttribute(centre, 3));
  geometry.setAttribute("east", new BufferAttribute(east, 3));
  geometry.setAttribute("north", new BufferAttribute(north, 3));
  geometry.setAttribute("corner", new BufferAttribute(corner, 2));
  geometry.setAttribute("size", new BufferAttribute(size, 2));
  geometry.setAttribute("away", new BufferAttribute(away, 2));
  geometry.setAttribute("uv", new BufferAttribute(uv, 2));
  geometry.setAttribute("seed", new BufferAttribute(seed, 1));
  geometry.setAttribute("travel", new BufferAttribute(travel, 1));
  return geometry;
}

function shardMaterial(atlas: Texture, still: boolean) {
  atlas.colorSpace = SRGBColorSpace;
  atlas.generateMipmaps = false;
  const uniforms = { map: { value: atlas }, time: { value: 0 }, motion: { value: still ? 0 : 1 } };
  return {
    geometry: shardGeometry(),
    uniforms,
    material: new ShaderMaterial({
      uniforms,
      vertexShader: shardVertex,
      fragmentShader: shardFragment,
      transparent: true,
      depthWrite: false,
      side: DoubleSide,
    }),
  };
}

function Shards({ still }: { still: boolean }) {
  const atlas = useLoader(TextureLoader, SHARDS_ATLAS);
  const { geometry, material, uniforms } = useMemo(() => shardMaterial(atlas, still), [atlas, still]);
  const shader = useRef(uniforms);
  useEffect(() => {
    shader.current = uniforms;
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material, uniforms]);
  useFrame(({ clock }) => {
    shader.current.time.value = clock.elapsedTime;
  });
  return <mesh geometry={geometry} material={material} frustumCulled={false} />;
}

const GRAINS = 700;
/** Wind-blown sand: fine grains streaming right to left across the view, a little low and gusting. */
function sandGrains() {
  // A fixed scatter (a small LCG, not Math.random), so every render draws the same grains.
  let n = 7;
  const rand = () => ((n = (n * 16807) % 2147483647) - 1) / 2147483646;
  const pos = new Float32Array(GRAINS * 3);
  const seed = new Float32Array(GRAINS);
  for (let i = 0; i < GRAINS; i++) {
    pos[i * 3] = (rand() - 0.5) * 40;
    pos[i * 3 + 1] = -4 + rand() * 5.5;
    pos[i * 3 + 2] = -3 - rand() * 22;
    seed[i] = rand();
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new BufferAttribute(pos, 3));
  geometry.setAttribute("seed", new BufferAttribute(seed, 1));
  const uniforms = { time: { value: 0 } };
  const material = new ShaderMaterial({
    uniforms,
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
    vertexShader: /* glsl */ `
          uniform float time;
          attribute float seed;
          varying float vAlpha;
          void main() {
            vec3 p = position;
            float gust = 0.6 + 0.4 * sin(time * 0.7 + seed * 6.28);
            p.x = mod(p.x - time * (2.5 + seed * 3.5) * gust + 20.0, 40.0) - 20.0;
            p.y += sin(time * 1.3 + seed * 40.0) * 0.25;
            vec4 mv = modelViewMatrix * vec4(p, 1.0);
            gl_Position = projectionMatrix * mv;
            gl_PointSize = (1.2 + seed * 2.2) * (18.0 / -mv.z);
            vAlpha = (0.25 + 0.5 * seed) * smoothstep(20.0, 14.0, abs(p.x));
          }
        `,
    fragmentShader: /* glsl */ `
          varying float vAlpha;
          void main() {
            float d = length(gl_PointCoord - 0.5);
            gl_FragColor = vec4(1.0, 0.86, 0.66, vAlpha * smoothstep(0.5, 0.0, d));
          }
        `,
  });
  return { geometry, material, uniforms };
}

function Sand() {
  const { geometry, material, uniforms } = useMemo(() => sandGrains(), []);
  const shader = useRef(uniforms);
  useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
    },
    [geometry, material],
  );
  useFrame(({ clock }) => {
    shader.current.time.value = clock.elapsedTime;
  });
  return <points geometry={geometry} material={material} frustumCulled={false} />;
}

/**
 * The hero's ground: a 360° desert the visitor stands in. It arrives with the camera
 * whipping round from the sky to the gold portal, turns a little with the cursor,
 * the clouds drifting, the dunes shimmering, sand blowing past and marble chips coming
 * off the sphere behind the portal (Shards); scrolling down
 * plays the same spin on out, away from the portal and up into the sky. It stops drawing once the page covers the hero.
 */
export function HeroPanorama({ paused, onLoad, className, ...rig }: Rig & { paused: boolean; onLoad?: () => void; className?: string }) {
  const src = useMemo(
    () => (typeof window !== "undefined" && window.matchMedia("(min-width: 768px)").matches ? PANO_WIDE : PANO_NARROW),
    [],
  );
  return (
    <div aria-hidden className={className}>
      <Canvas
        frameloop={paused || rig.still ? "demand" : "always"}
        flat
        dpr={[1, 1.5]}
        gl={{ antialias: false, powerPreference: "low-power" }}
        camera={{
          position: [0, 0, 0],
          fov: rig.still ? BASE_FOV : INTRO_FOV,
          near: 0.1,
          far: 100,
        }}
      >
        <Suspense fallback={null}>
          <Desert src={src} onLoad={onLoad} {...rig} />
          {rig.still ? null : <Sand />}
        </Suspense>
      </Canvas>
    </div>
  );
}
