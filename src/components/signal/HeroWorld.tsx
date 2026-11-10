"use client";

import { Html, useGLTF } from "@react-three/drei";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import type { MotionValue } from "motion/react";
import { Suspense, useEffect, useMemo, useRef, type ReactNode } from "react";
import * as THREE from "three";
import { heroSkySrc } from "@/lib/hero";

/*
 * The hero as one 3D world, drawn in a single canvas: the desert's sky photograph on a
 * dome, modelled dunes under it with a gold portal on a rise ahead (scripts/blender/
 * make_desert.py), the caped courier gliding in over the sand, and the carpet flying
 * in to perch, talk, and settle under his feet. One camera stands in it, 1.8 m up at the
 * origin, whipping round from the sky to the portal as the loader lifts, turning and
 * stepping a little with the cursor, and spinning on out as the page scrolls.
 *
 * Everything here is in metres. SkyHero owns the clocks (motion values, read every
 * frame) and the HTML round the scene; this file only draws.
 */

const DESERT = "/models/desert/desert.glb";
const SAND_NORMAL = "/models/desert/sand-normal.webp";
const COURIER = "/models/courier/courier.glb";
/** The Sketchfab mat, cut down for the web (scripts/blender/optimize_carpet.py). */
const CARPET = "/models/carpet/carpet.glb";
/** The Draco decoder, copied from three's examples into public/ so it's never fetched from Google. */
const DRACO = "/draco/";
/** The most device pixels drawn per CSS pixel: a 2x screen gets its full sharpness, denser ones no more. */
const DPR_MAX = 2;

/** Where the visitor stands. */
const EYE = new THREE.Vector3(0, 1.8, 0);
/** At rest the portal sits a little left of centre, clear of the courier. */
const BASE_YAW = -0.22;
const BASE_FOV = 72;
/** How far the cursor turns the head (radians) and steps the eye (metres), for parallax. */
const YAW_REACH = 0.25;
const PITCH_REACH = 0.1;
const STEP_X = 0.55;
const STEP_Y = 0.28;
/** The slow idle sway, so the desert breathes even under a still cursor. */
const DRIFT_SPEED = 0.04;
const DRIFT_REACH = 0.05;
/** The arrival: the camera starts turned away, looking up at the sky, and whips round to the portal. */
const INTRO_DELAY = 1;
const INTRO_S = 3.4;
const INTRO_YAW = Math.PI * 1.15;
const INTRO_PITCH = 0.55;
const INTRO_FOV = 105;
/**
 * The photograph is shot a little flat; everything drawn from it is pushed gently toward
 * richer colour, kept short of a cartoon. SATURATION mixes each pixel away from its own
 * grey, CONTRAST steepens the curve about mid grey. The sky dome and the carpet's weave take it in their shaders; the sand and the
 * haze, plain colours, take the same push below, so the modelled dunes are the photograph's
 * twin.
 */
const SATURATION = 1.14;
const CONTRAST = 1.04;
/** GLSL for the push, on a linear rgb value named by `v`. */
const vivid = (v: string) => `
  {
    float luma = dot(${v}, vec3(0.2126, 0.7152, 0.0722));
    ${v} = mix(vec3(luma), ${v}, ${SATURATION.toFixed(2)});
    ${v} = clamp((${v} - 0.18) * ${CONTRAST.toFixed(2)} + 0.18, 0.0, 1.0);
  }`;
/** The same push on a colour, in linear light. */
function vividColor(hex: string) {
  const c = new THREE.Color(hex);
  const luma = c.r * 0.2126 + c.g * 0.7152 + c.b * 0.0722;
  const push = (v: number) => THREE.MathUtils.clamp((luma + (v - luma) * SATURATION - 0.18) * CONTRAST + 0.18, 0, 1);
  return c.setRGB(push(c.r), push(c.g), push(c.b));
}
/** The photograph's sand, averaged over its far dunes (the lights lift it to its near sand), and its horizon haze, both as pushed. */
const SAND = vividColor("#a07a4e");
const HAZE = vividColor("#d9d2c5");
/** The ripples creep downwind, in tiles of the ripple map per second. */
const RIPPLE_FLOW = 0.09;
const SUN = new THREE.Vector3(-30, 50, -60);
/** The desert is built with its portal straight ahead; turned this much, the portal stands
    left of the nav card, where it shows, and the courier keeps his place to the right. */
const DESERT_TURN = 0.3;

/** Where the courier stands once landed: well right of centre, close, so he reads big. */
const STAGE = new THREE.Vector3(2.1, 0, -3.5);
/** The model is 1 unit across; his length on the sand. */
const COURIER_SCALE = 2.9;
/** His planted foot's sole, in model units below his centre (rig_courier.py prints it). */
const SOLE = 0.324;
/** On the stage he's turned this far toward the camera (negative is toward it), so he reads
    from the front rather than over his shoulder; he turns back to face his way as he sets off. */
const REST_YAW = -0.9;
/** The hair, the cape and both hands keep stirring the whole time: the rig's idle loop. */
const IDLE_CLIP = "idle";
/** Off to the left, further off and high, where the glide in starts. */
const FROM = new THREE.Vector3(-15, 4.5, -11);
/** The glide in (s): one unbroken swoop from FROM down to the stage, slowing as he arrives. */
export const COURIER_INTRO_S = 4.2;
/** How much higher than a straight line he swoops on the way, and the slow rise and fall as he flies. */
const SWOOP = 1.2;
const FLOAT_Y = 0.08;

/** The carpet's three beats, in seconds of its own clock: fly in, perch (stood up, talking), fly down. */
export const CARPET_FLY_IN_S = 1.9;
export const CARPET_PERCH_S = 3.6;
export const CARPET_FLY_DOWN_S = 1.8;
export const CARPET_S = CARPET_FLY_IN_S + CARPET_PERCH_S + CARPET_FLY_DOWN_S;
const CARPET_FROM = new THREE.Vector3(-24, 10, -18);
/** The perch: behind the courier, off his right, nearer the camera so it reads large. */
const PERCH = new THREE.Vector3(3.6, 1.15, -5.1);
/** The mat lies this high over the sand, and lifts him this much when it slides under his
    feet: clear of its lie, its bob, its billow and the bank of its idle turn, so it never
    passes through his legs as it moves. */
const CARPET_LIE_Y = 0.2;
const RIDE_LIFT = 0.55;
/** The Sketchfab mat is 10.9 units long; under a 2.6 m courier it wants to be about 3 m. */
const CARPET_SCALE = 0.27;
/** Left unscrolled this long after landing (or its last turn), the mat turns once more, over IDLE_SPIN_S. */
const IDLE_S = 6;
const IDLE_SPIN_S = 2.4;
const HOVER_Y = 0.5;
const HOVER_SMOOTH = 0.07;

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const smooth = (x: number) => x * x * (3 - 2 * x);
const easeSine = (x: number) => -(Math.cos(Math.PI * x) - 1) / 2;
const easeOutQuad = (x: number) => 1 - (1 - x) * (1 - x);
const easeInCubic = (x: number) => x * x * x;
const easeOutQuint = (t: number) => 1 - Math.pow(1 - t, 5);
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const bez = (p1x: number, p1y: number, p2x: number, p2y: number) => {
  // A cubic bezier ease by bisection on x; a few iterations is plenty for motion.
  const cx = (t: number) => 3 * (1 - t) * (1 - t) * t * p1x + 3 * (1 - t) * t * t * p2x + t * t * t;
  const cy = (t: number) => 3 * (1 - t) * (1 - t) * t * p1y + 3 * (1 - t) * t * t * p2y + t * t * t;
  return (x: number) => {
    let lo = 0;
    let hi = 1;
    for (let i = 0; i < 16; i++) {
      const mid = (lo + hi) / 2;
      if (cx(mid) < x) lo = mid;
      else hi = mid;
    }
    return cy((lo + hi) / 2);
  };
};
const FLY_IN_EASE = bez(0.3, 0, 0.2, 1);
const FLY_DOWN_EASE = bez(0.45, 0, 0.2, 1);

/** The tracks SkyHero drives from the scroll reveal: the pull off to the right. */
/**
 * The flight out, keyed to one clock (0 to 1, the reveal, sprung): the courier and his mat
 * fly straight ahead, the camera falling in behind to follow, then at FLIGHT_TURN_AT they
 * bank hard right and are gone off the right of the frame by FLIGHT_GONE_AT, the camera
 * holding its line.
 */
const FLIGHT_TURN_AT = 0.45;
const FLIGHT_GONE_AT = 0.68;
/** Metres flown straight ahead, and how high he climbs doing it. */
const FLIGHT_AHEAD = 26;
const FLIGHT_CLIMB = 1.6;
/** Metres off to the right in the turn, past the frame's edge. */
const FLIGHT_RIGHT = 44;
/** The camera first closes in on him by this much, then follows only this share of his flight,
    so he pulls away and shrinks as he goes, the view widening a little with him. */
const CLOSE_IN = 1.8;
const FOLLOW_SHARE = 0.45;
const FOLLOW_FOV_OUT = 8;
/** How high over the eye the camera lifts to look down on him. */
const FOLLOW_LIFT = 1.1;
const FOLLOW_PITCH = -0.14;
/** The world's forward and right along the camera's resting yaw, so the path holds still under the cursor. */
const FORWARD = new THREE.Vector3(-Math.sin(BASE_YAW), 0, -Math.cos(BASE_YAW));
const RIGHTWARD = new THREE.Vector3(Math.cos(BASE_YAW), 0, -Math.sin(BASE_YAW));
/** How far right of the eye's line the stage sits, so the camera slides over to fly straight behind him. */
const STAGE_RIGHT = STAGE.dot(RIGHTWARD);

/** Where the flight is at f: metres ahead and to the right, metres climbed, and how far round the turn (0 to 1). */
function flightAt(f: number) {
  const straight = easeInCubic(clamp01(f / FLIGHT_TURN_AT));
  const turn = clamp01((f - FLIGHT_TURN_AT) / (FLIGHT_GONE_AT - FLIGHT_TURN_AT));
  return {
    ahead: FLIGHT_AHEAD * straight + FLIGHT_AHEAD * 0.35 * turn,
    right: FLIGHT_RIGHT * turn * turn,
    climb: FLIGHT_CLIMB * smooth(clamp01(f / (FLIGHT_TURN_AT * 0.6))),
    turn: smooth(turn),
  };
}

type Rig = {
  mx: MotionValue<number>;
  my: MotionValue<number>;
  /** 0 to 1 through the flight out: the camera follows him ahead, then holds as he banks away. */
  flight: MotionValue<number>;
  still: boolean;
  start: boolean;
};

// ---- sky ------------------------------------------------------------------------------

// The sky's clouds drift round the horizon; `t` runs 0 at the zenith to 1 underfoot.
const skyVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const skyFragment = /* glsl */ `
  uniform sampler2D map;
  uniform float time;
  uniform float motion;
  varying vec2 vUv;
  void main() {
    vec2 uv = vUv;
    float t = 1.0 - uv.y;
    float sky = smoothstep(0.34, 0.16, t);
    uv.x += time * 0.0035 * sky * motion;
    vec4 color = texture2D(map, uv);
    ${vivid("color.rgb")}
    gl_FragColor = color;
    #include <colorspace_fragment>
  }
`;

function skyMaterial(texture: THREE.Texture, still: boolean) {
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.anisotropy = 4;
  const uniforms = { map: { value: texture }, time: { value: 0 }, motion: { value: still ? 0 : 1 } };
  return { uniforms, material: new THREE.ShaderMaterial({ uniforms, vertexShader: skyVertex, fragmentShader: skyFragment, side: THREE.BackSide }) };
}

/** The same photograph, blurred down to a reflection map, lights the gold and the courier. */
function setEnvironment(scene: THREE.Scene, env: THREE.Texture | null) {
  scene.environment = env;
  scene.environmentIntensity = 1.0;
}

/** The photograph on a dome round everything, and the light it throws on the gold and the courier. */
function Sky({ src, still }: { src: string; still: boolean }) {
  const texture = useLoader(THREE.TextureLoader, src);
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  const { material, uniforms } = useMemo(() => skyMaterial(texture, still), [texture, still]);
  const shader = useRef(uniforms);
  useEffect(() => {
    shader.current = uniforms;
    return () => material.dispose();
  }, [material, uniforms]);
  // The same photograph, blurred down to a reflection map, is the scene's environment.
  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const env = pmrem.fromEquirectangular(texture).texture;
    setEnvironment(scene, env);
    pmrem.dispose();
    return () => {
      if (scene.environment === env) setEnvironment(scene, null);
      env.dispose();
    };
  }, [gl, scene, texture]);
  useFrame(({ clock }) => {
    shader.current.time.value = clock.elapsedTime;
  });
  // Seen from inside: mirrored so it reads the right way round, and turned a quarter so the
  // photograph's centre (where its portal stood) sits straight ahead, behind the modelled one.
  return (
    <mesh rotation={[0, -Math.PI / 2, 0]} scale={[-1, 1, 1]} material={material} frustumCulled={false}>
      <sphereGeometry args={[800, 64, 32]} />
    </mesh>
  );
}

// ---- ground -----------------------------------------------------------------------------

type Shard = { mesh: THREE.Object3D; base: THREE.Vector3; seed: number };
function findShards(scene: THREE.Object3D) {
  const found: Shard[] = [];
  scene.traverse((o) => {
    if (o.name.startsWith("Shard")) found.push({ mesh: o, base: o.position.clone(), seed: found.length * 1.7 });
  });
  return found;
}

function driftShard({ mesh, base, seed }: Shard, t: number) {
  mesh.position.y = base.y + Math.sin(t * 0.35 + seed) * 0.18;
  mesh.position.x = base.x + Math.sin(t * 0.21 + seed * 2.3) * 0.1;
  mesh.rotation.x += 0.0012;
  mesh.rotation.y += 0.0017;
}

/** The ripple map tiled over the dunes, its crests turned to run away from the eye as the
    photograph's do (three derives the tangent frame from the turned uv, so the slopes turn too). */
function tileRipples(ripples: THREE.Texture) {
  ripples.wrapS = ripples.wrapT = THREE.RepeatWrapping;
  ripples.repeat.set(110, 110);
  ripples.center.set(0.5, 0.5);
  ripples.rotation = Math.PI / 2;
  ripples.anisotropy = 8;
  return ripples;
}

/** The dunes, the rise, the gold frame and the moon breaking up behind it. */
function Ground({ onLoad }: { onLoad: () => void }) {
  const { scene } = useGLTF(DESERT, DRACO);
  const ripples = useLoader(THREE.TextureLoader, SAND_NORMAL);
  const sand = useMemo(() => {
    const sand = new THREE.MeshStandardMaterial({
      color: SAND,
      roughness: 0.94,
      metalness: 0,
      normalMap: tileRipples(ripples),
      normalScale: new THREE.Vector2(0.8, 0.8),
      envMapIntensity: 0.6,
    });
    scene.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh) return;
      const mat = mesh.material as THREE.MeshStandardMaterial;
      if (mesh.name === "Terrain") {
        mesh.material = sand;
        mesh.receiveShadow = true;
      } else if (mesh.name === "Portal") {
        // The gold reflects the sky a little harder, with the faintest warmth from within.
        mat.envMapIntensity = 1.8;
        mat.emissive.set("#c46f0a");
        mat.emissiveIntensity = 0.08;
        mesh.castShadow = true;
      }
    });
    return sand;
  }, [scene, ripples]);
  const sandRef = useRef(sand);
  useEffect(() => {
    sandRef.current = sand;
  }, [sand]);
  useEffect(() => onLoad(), [onLoad]);
  const drifting = useRef<Shard[]>([]);
  useEffect(() => {
    drifting.current = findShards(scene);
  }, [scene]);
  // The shards hang in the air, turning slowly and rising and falling a hand's width, and
  // the ripples creep over the sand with the blown grains.
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const map = sandRef.current.normalMap;
    if (map) map.offset.x = (t * RIPPLE_FLOW) / map.repeat.x;
    for (const shard of drifting.current) driftShard(shard, t);
  });
  return <primitive object={scene} rotation={[0, DESERT_TURN, 0]} />;
}

// ---- sand in the air ----------------------------------------------------------------------

const GRAINS = 700;
/** Wind-blown sand: fine grains streaming right to left across the view, low and gusting. */
function sandGrains() {
  // A fixed scatter (a small LCG, not Math.random), so every render draws the same grains.
  let n = 7;
  const rand = () => ((n = (n * 16807) % 2147483647) - 1) / 2147483646;
  const pos = new Float32Array(GRAINS * 3);
  const seed = new Float32Array(GRAINS);
  for (let i = 0; i < GRAINS; i++) {
    pos[i * 3] = (rand() - 0.5) * 40;
    pos[i * 3 + 1] = 0.1 + rand() * 4.5;
    pos[i * 3 + 2] = -3 - rand() * 22;
    seed[i] = rand();
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  geometry.setAttribute("seed", new THREE.BufferAttribute(seed, 1));
  const uniforms = { time: { value: 0 } };
  const material = new THREE.ShaderMaterial({
    uniforms,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
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

// ---- camera and light ----------------------------------------------------------------------

function CameraRig({ mx, my, flight, still, start }: Rig) {
  // The intro's clock starts when the loader lifts; until then the camera waits turned away.
  const startedAt = useRef<number | null>(null);
  useFrame((state) => {
    const camera = state.camera as THREE.PerspectiveCamera;
    camera.rotation.order = "YXZ";
    const now = state.clock.elapsedTime;
    if (start && startedAt.current === null) startedAt.current = now + INTRO_DELAY;
    const intro = still ? 1 : startedAt.current === null ? 0 : clamp01((now - startedAt.current) / INTRO_S);
    const arriving = 1 - easeOutQuint(intro);
    const away = arriving;
    const drift = still ? 0 : Math.sin(now * DRIFT_SPEED * Math.PI * 2) * DRIFT_REACH;
    const x = still ? 0 : mx.get();
    const y = still ? 0 : my.get();
    // Scrolling, the camera falls in behind him as he flies ahead: over onto his line, up a
    // little and tipped down to keep him in frame. It closes in on him first, then follows
    // only part of the way, so he pulls off ahead and shrinks; it holds its heading through
    // his turn, so he leaves the frame to the right.
    const f = still ? 0 : flight.get();
    const { ahead } = flightAt(f);
    const follow = smooth(clamp01(f / FLIGHT_TURN_AT));
    const closeIn = smooth(clamp01(f / (FLIGHT_TURN_AT * 0.3)));
    camera.rotation.y = BASE_YAW - x * YAW_REACH + drift + arriving * INTRO_YAW;
    camera.rotation.x = -y * PITCH_REACH + away * INTRO_PITCH + FOLLOW_PITCH * follow;
    camera.rotation.z = away * 0.12;
    // And steps with the cursor, so the courier and the carpet slide against the dunes.
    camera.position
      .set(EYE.x + x * STEP_X, EYE.y - y * STEP_Y + FOLLOW_LIFT * follow, EYE.z)
      .addScaledVector(FORWARD, CLOSE_IN * closeIn + ahead * FOLLOW_SHARE)
      .addScaledVector(RIGHTWARD, STAGE_RIGHT * follow);
    const fov = BASE_FOV + (INTRO_FOV - BASE_FOV) * away + FOLLOW_FOV_OUT * follow;
    if (Math.abs(camera.fov - fov) > 0.01) {
      camera.fov = fov;
      camera.updateProjectionMatrix();
    }
  });
  return null;
}

/** Lit like the photograph, a touch richer: a warm sun ahead and high, behind the portal,
    pale sky over sand for the fill, and a soft key from the front left so his face and the
    red of the cape read against the black coat. */
function Lights() {
  const sun = useRef<THREE.DirectionalLight>(null);
  const target = useMemo(() => {
    const o = new THREE.Object3D();
    o.position.copy(STAGE);
    return o;
  }, []);
  useEffect(() => {
    if (sun.current) sun.current.target = target;
  }, [target]);
  return (
    <>
      <primitive object={target} />
      <hemisphereLight args={["#c9d9ee", "#a8743c", 1.35]} />
      <directionalLight
        ref={sun}
        position={SUN}
        intensity={2.1}
        color="#ffe3bd"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0006}
        shadow-normalBias={0.04}
      >
        {/* Tight round the stage, where the shadows are seen. */}
        <orthographicCamera attach="shadow-camera" args={[-12, 12, 10, -10, 40, 140]} />
      </directionalLight>
      <directionalLight position={[-3, 5, 6]} intensity={1.0} color="#fff0dc" />
    </>
  );
}

// ---- courier ------------------------------------------------------------------------------

/** How far along the glide in he is at time t, 0 to 1, slowing as he arrives. */
const glideAt = (t: number) => easeOutQuad(clamp01(t / COURIER_INTRO_S));

/** Where he is at time t: a swoop from FROM to the stage, bowed up a little in the middle so
    he comes in over the dunes and settles down onto his spot rather than sliding in flat. */
function flyAt(t: number, out: THREE.Vector3) {
  const k = glideAt(t);
  return out.copy(FROM).lerp(STAGE, k).setY(FROM.y + (STAGE.y - FROM.y) * easeSine(k) + Math.sin(Math.PI * k) * SWOOP);
}

function Courier({
  clock,
  carpetClock,
  flight,
  mx,
  still,
  landed,
  onLoad,
}: {
  clock: MotionValue<number>;
  carpetClock: MotionValue<number>;
  flight: MotionValue<number>;
  mx: MotionValue<number>;
  still: boolean;
  /** Once he has landed and the hero isn't covered, he bobs where he stands. */
  landed: boolean;
  onLoad: () => void;
}) {
  const { scene, animations } = useGLTF(COURIER, DRACO);
  // Hunyuan bakes a metalness map; with little to reflect, metal reads black. And a skinned
  // mesh's bounds are its rest pose, so it isn't culled as the legs swing out.
  useMemo(() => {
    scene.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh) return;
      mesh.frustumCulled = false;
      mesh.castShadow = true;
      const mat = mesh.material as THREE.MeshStandardMaterial;
      mat.metalness = 0;
      mat.metalnessMap = null;
      // His own colour: the black coat and the red cape, as painted. The maps are filtered
      // anisotropically so the coat's folds stay crisp at the angle he lies at, and the sky
      // is let reflect a little harder so the black reads as cloth, not a hole.
      for (const map of [mat.map, mat.normalMap, mat.roughnessMap]) if (map) map.anisotropy = 8;
      mat.roughness = 0.5;
      mat.envMapIntensity = 1.0;
      mat.needsUpdate = true;
    });
  }, [scene]);
  // The rig's idle loop (cape, hair and both hands stirring), scrubbed to the frame clock
  // the whole time he's in view. The rig's leap clip is left unplayed: he glides, he doesn't hop.
  const idle = useMemo(() => {
    const clip = THREE.AnimationClip.findByName(animations, IDLE_CLIP);
    if (!clip) return null;
    const mixer = new THREE.AnimationMixer(scene);
    return { mixer, action: mixer.clipAction(clip), duration: clip.duration };
  }, [scene, animations]);
  const idleRef = useRef(idle);
  // Started here, not where it's made: a strict-mode remount stops it and must start it again.
  useEffect(() => {
    idleRef.current = idle;
    idle?.action.play();
    return () => {
      idle?.mixer.stopAllAction();
    };
  }, [idle]);
  // Drawn on demand once the page covers the hero: any move of the clock still draws.
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => clock.on("change", () => invalidate()), [clock, invalidate]);
  // Mounted only once useGLTF has resolved, so this is the model arriving.
  useEffect(() => onLoad(), [onLoad]);

  const body = useRef<THREE.Group>(null);
  const at = useMemo(() => new THREE.Vector3(), []);

  useFrame((state) => {
    const b = body.current;
    if (!b) return;
    const t = still ? COURIER_INTRO_S : clock.get();
    const now = state.clock.elapsedTime;
    const k = glideAt(t);
    flyAt(t, at);
    // Arrived, he floats where he is; the carpet sliding under his feet lifts him onto it.
    const ride = still ? 1 : smooth(clamp01((carpetClock.get() - (CARPET_S - 0.5)) / 0.5));
    const float = landed && !still ? Math.sin(now * 1.05) * FLOAT_Y : 0;
    const x = still ? 0 : mx.get();
    b.position.set(at.x + x * 0.12, at.y + ride * RIDE_LIFT + float, at.z);
    // Turned a little toward us on the way in, then round to face the camera as he arrives,
    // leaning a touch toward the cursor; he turns back to face his way as the flight out sets
    // off (Rider swings him ahead). Banked into the swoop, levelling off as he settles.
    const faced = easeSine(k);
    const setOff = still ? 0 : smooth(clamp01(flight.get() / (FLIGHT_TURN_AT * 0.5)));
    b.rotation.order = "YXZ";
    b.rotation.y = (-0.35 * (1 - faced) + REST_YAW * faced) * (1 - setOff) + x * 0.1;
    b.rotation.z = still ? 0 : Math.sin(Math.PI * k) * 0.18;
    // The cape, the hair and his hands stir on their own loop the whole way.
    const rig = idleRef.current;
    if (rig) {
      rig.action.time = still ? 0 : now % rig.duration;
      rig.mixer.update(0);
    }
  });

  return (
    <group ref={body}>
      {/* The model hangs from his sole, so he sits on the sand and the mat by his feet. */}
      <group scale={COURIER_SCALE} position={[0, SOLE * COURIER_SCALE, 0]}>
        <primitive object={scene} />
      </group>
    </group>
  );
}

// ---- carpet ---------------------------------------------------------------------------------

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

/** Bends the flat carpet (it lies in its own xy plane, long along y, ±5.4). The bend is done
    in the vertex shader on both the carpet and its tassels, so the tassels stay on the edge.
    Its weave is pushed toward the sky's richer colour in the fragment shader. */
function bendMaterial(source: THREE.Material, bend: Bend) {
  const mat = source.clone();
  mat.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, bend);
    shader.fragmentShader = shader.fragmentShader.replace("#include <map_fragment>", `#include <map_fragment>${vivid("diffuseColor.rgb")}`);
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
  };
  mat.customProgramCacheKey = () => "carpet-bend";
  return mat;
}

/**
 * The magic carpet ("Aladdin's Magic Carpet" by Kremit, CC-BY-4.0, credited in SiteFooter):
 * it flies in turning from the far upper left, perches off the courier's right, stands up
 * on its end and talks, then lies back down and flies under his feet, where it billows,
 * the billow lifting as the scroll reveal runs.
 */
function Carpet({
  clock,
  reveal,
  mx,
  still,
  onLoad,
  bubble,
}: {
  clock: MotionValue<number>;
  reveal: MotionValue<number>;
  mx: MotionValue<number>;
  still: boolean;
  onLoad: () => void;
  bubble: ReactNode;
}) {
  const { nodes, materials } = useGLTF(CARPET, DRACO) as unknown as {
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
  useEffect(() => onLoad(), [onLoad]);

  const place = useRef<THREE.Group>(null);
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
  const landing = useMemo(() => STAGE.clone().setY(CARPET_LIE_Y), []);

  useFrame((state) => {
    const t = still ? 1.2 : state.clock.elapsedTime;
    bend.current.uTime.value = t;
    bend.current.uLift.value = still ? 0 : reveal.get();
    const g = group.current;
    const pl = place.current;
    if (!g || !pl) return;
    const k = still ? CARPET_S : clock.get();
    // Where it is: in from the far upper left to the perch, held there, then down to the sand.
    if (k < CARPET_FLY_IN_S) {
      pl.position.lerpVectors(CARPET_FROM, PERCH, FLY_IN_EASE(k / CARPET_FLY_IN_S));
    } else if (k < CARPET_FLY_IN_S + CARPET_PERCH_S) {
      pl.position.copy(PERCH);
    } else {
      pl.position.lerpVectors(PERCH, landing, FLY_DOWN_EASE(clamp01((k - CARPET_FLY_IN_S - CARPET_PERCH_S) / CARPET_FLY_DOWN_S)));
    }
    if (still) {
      bend.current.uStand.value = 0;
      g.rotation.set(0, 0, 0);
      return;
    }
    const e = clamp01(k / CARPET_S);
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
    // Landed: wait out IDLE_S unscrolled, then one more full turn; a scroll restarts the wait
    // (a turn under way finishes).
    let spin = 0;
    if (e >= 1) {
      if (idleFrom.current === null || scrolled.current) idleFrom.current = t;
      scrolled.current = false;
      if (spinStart.current === null && t - idleFrom.current > IDLE_S) spinStart.current = t;
      if (spinStart.current !== null) {
        const s = Math.min(1, (t - spinStart.current) / IDLE_SPIN_S);
        spin = easeInOutCubic(s);
        if (s >= 1) {
          spinStart.current = null;
          idleFrom.current = t;
          spin = 0;
        }
      }
    }
    hoverTurn.current = THREE.MathUtils.lerp(hoverTurn.current, mx.get() * HOVER_Y, HOVER_SMOOTH);
    g.rotation.y = -(left + spin) * Math.PI * 2 + hoverTurn.current;
    // Rolls and dips a little under the rider, banking into a turn.
    g.rotation.z = Math.sin(t * 0.8) * 0.05 + left * 0.5 + Math.sin(spin * Math.PI) * 0.15 + hoverTurn.current * 0.12 + sway;
    g.position.y = (Math.sin(t * 1.3) * 0.12 + hop + 0.25 * stand) * CARPET_SCALE * 2;
  });

  return (
    <>
      <group ref={place}>
        <group ref={group}>
          <group ref={standY}>
            <group ref={standZ}>
              {/* Long axis left to right, nose toward where the courier is heading. */}
              <group rotation={[-Math.PI / 2, 0, Math.PI / 2]} scale={CARPET_SCALE}>
                <group position={[0, 0, -1.962]}>
                  {/* The tassels, in two parts, are most of the mat's triangles: they throw no shadow. */}
                  <mesh geometry={nodes.TASSELS_0.geometry} material={mats.tassels} receiveShadow />
                  {nodes.TASSELS_0001 ? <mesh geometry={nodes.TASSELS_0001.geometry} material={mats.tassels} receiveShadow /> : null}
                  <mesh geometry={nodes.CARPET_0.geometry} material={mats.carpet} castShadow receiveShadow />
                </group>
              </group>
            </group>
          </group>
        </group>
      </group>
      {/* What the mat says while it stands and talks, just above its top left. */}
      <group position={PERCH}>
        <Html position={[-1.1, 1.35, 0]} zIndexRange={[3, 3]} style={{ pointerEvents: "none" }}>
          {bubble}
        </Html>
      </group>
    </>
  );
}

// ---- the world ----------------------------------------------------------------------------

export function HeroWorld({
  mx,
  my,
  flight,
  reveal,
  courierClock,
  carpetClock,
  start,
  still,
  paused,
  carpet,
  courierLanded,
  bubble,
  onGroundLoad,
  onCourierLoad,
  onCarpetLoad,
  className,
}: Rig & {
  reveal: MotionValue<number>;
  courierClock: MotionValue<number>;
  carpetClock: MotionValue<number>;
  /** Stop drawing (the page has covered the hero). */
  paused: boolean;
  /** Mount the carpet (hidden on phones, with its model never fetched). */
  carpet: boolean;
  courierLanded: boolean;
  bubble: ReactNode;
  onGroundLoad: () => void;
  onCourierLoad: () => void;
  onCarpetLoad: () => void;
  className?: string;
}) {
  const src = useMemo(() => heroSkySrc(), []);
  // Drawn at the screen's own pixel ratio (up to DPR_MAX), so he's as sharp as the page round
  // him; on a dense screen the multisampling is left off, as the pixels already smooth the edges.
  const dpr = useMemo(() => (typeof window === "undefined" ? 1 : Math.min(DPR_MAX, window.devicePixelRatio || 1)), []);
  return (
    <div aria-hidden className={className}>
      <Canvas
        frameloop={paused || still ? "demand" : "always"}
        flat
        shadows="percentage"
        dpr={dpr}
        gl={{ antialias: dpr < 1.5, powerPreference: "high-performance" }}
        camera={{ position: EYE.toArray(), fov: still ? BASE_FOV : INTRO_FOV, near: 0.1, far: 1200 }}
      >
        <fog attach="fog" args={[HAZE, 45, 250]} />
        <CameraRig mx={mx} my={my} flight={flight} still={still} start={start} />
        <Lights />
        <Suspense fallback={null}>
          <Sky src={src} still={still} />
          <Ground onLoad={onGroundLoad} />
          {still ? null : <Sand />}
        </Suspense>
        <Rider flight={flight} still={still}>
          <Suspense fallback={null}>
            <Courier clock={courierClock} carpetClock={carpetClock} flight={flight} mx={mx} still={still} landed={courierLanded && !paused} onLoad={onCourierLoad} />
          </Suspense>
          {carpet ? (
            <Suspense fallback={null}>
              <Carpet clock={carpetClock} reveal={reveal} mx={mx} still={still} onLoad={onCarpetLoad} bubble={bubble} />
            </Suspense>
          ) : null}
        </Rider>
      </Canvas>
    </div>
  );
}

/** The frame the courier and the carpet share: the flight out (the scroll reveal), straight
    ahead and climbing, then the bank hard right and away, turned and leaned about where he
    stands. At rest he faces the camera's right; he turns to face ahead as he sets off. */
function Rider({ flight, still, children }: { flight: MotionValue<number>; still: boolean; children: ReactNode }) {
  const ref = useRef<THREE.Group>(null);
  useFrame(() => {
    const g = ref.current;
    if (!g || still) return;
    const f = flight.get();
    const { ahead, right, climb, turn } = flightAt(f);
    g.position.copy(STAGE).addScaledVector(FORWARD, ahead).addScaledVector(RIGHTWARD, right).setY(STAGE.y + climb);
    // Facing: his right (rotation 0) is the camera's right; a quarter turn faces him ahead.
    // He swings to face ahead over the first stretch, and back to the right through the turn.
    const setOff = smooth(clamp01(f / (FLIGHT_TURN_AT * 0.5)));
    const heading = (Math.PI / 2) * (setOff - turn);
    g.rotation.order = "YXZ";
    g.rotation.y = heading;
    // Banked into the turn, nose down a touch as he sets off.
    g.rotation.z = -Math.sin(Math.PI * turn) * 0.55;
    g.rotation.x = Math.sin(Math.PI * setOff) * 0.12 * (1 - turn);
  });
  // Pivoted on the stage, so the turn and the lean happen about where he stands.
  return (
    <group ref={ref} position={STAGE}>
      <group position={[-STAGE.x, -STAGE.y, -STAGE.z]}>{children}</group>
    </group>
  );
}
