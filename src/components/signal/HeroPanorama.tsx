"use client";

import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import type { MotionValue } from "motion/react";
import { Suspense, useEffect, useMemo, useRef } from "react";
import {
  AdditiveBlending,
  BackSide,
  BufferAttribute,
  BufferGeometry,
  PerspectiveCamera,
  RepeatWrapping,
  ShaderMaterial,
  SRGBColorSpace,
  TextureLoader,
  type Texture,
} from "three";

/** The desert and its gold portal, an equirectangular 360° photograph; phones take the half-size copy. */
const PANO_WIDE = "/images/hero/pano/desert-4k.webp";
const PANO_NARROW = "/images/hero/pano/desert-2k.webp";

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
  uniform float motion;
  varying vec2 vUv;
  void main() {
    vec2 uv = vUv;
    float t = 1.0 - uv.y;
    float sky = smoothstep(0.32, 0.16, t);
    uv.x += time * 0.0035 * sky * motion;
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

  useFrame((state) => {
    const camera = state.camera as PerspectiveCamera;
    camera.rotation.order = "YXZ";
    const now = state.clock.elapsedTime;
    shader.current.time.value = now;
    if (start && startedAt.current === null) startedAt.current = now + INTRO_DELAY;
    const intro = still ? 1 : startedAt.current === null ? 0 : Math.min(1, Math.max(0, (now - startedAt.current) / INTRO_S));
    const arriving = 1 - easeOutQuint(intro);
    // Scrolling down spins on past the portal the way the arrival came in, back up into
    // the sky and wide; scrolling up brings it round to the portal again.
    const leaving = still ? 0 : easeInOutCubic(scroll.get());
    const away = arriving + leaving;
    const drift = still ? 0 : Math.sin(now * DRIFT_SPEED * Math.PI * 2) * DRIFT_REACH;

    camera.rotation.y = BASE_YAW - mx.get() * YAW_REACH + drift + (arriving - leaving) * INTRO_YAW;
    camera.rotation.x = -my.get() * PITCH_REACH + away * INTRO_PITCH;
    camera.rotation.z = away * 0.12;
    const fov = BASE_FOV + (INTRO_FOV - BASE_FOV) * away;
    if (Math.abs(camera.fov - fov) > 0.01) {
      camera.fov = fov;
      camera.updateProjectionMatrix();
    }
  });

  // Seen from inside: mirrored so it reads the right way round, and turned a quarter so the
  // photograph's centre (the portal) sits straight ahead.
  return (
    <mesh rotation={[0, -Math.PI / 2, 0]} scale={[-1, 1, 1]} material={material}>
      <sphereGeometry args={[50, 64, 32]} />
    </mesh>
  );
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
 * the clouds drifting, the dunes shimmering and sand blowing past; scrolling down
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
