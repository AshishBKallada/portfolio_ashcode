"use client";

/* eslint-disable react-hooks/immutability -- three.js objects are made once and changed every frame
   in useFrame, outside React's render: that is how R3F animates. */

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import type { MotionValue } from "motion/react";
import { useEffect, useMemo, useRef, type RefObject } from "react";
import { Color, type DirectionalLight, type HemisphereLight, type PerspectiveCamera, Vector3 } from "three";
import { Clouds } from "./Atmosphere";
import { duelBeats } from "./duel";
import { beats, FILM_S, type FilmClock } from "./film";
import { puffTexture } from "./textures";

/** The loop skips the opening seconds, so the pressure starts building soon after the loader lifts. */
const LOOP_FROM = 7;
/** The frame a still (reduced-motion) hero holds: the storm in, its clouds banked. */
const STILL_T = 13.3;

type Props = {
  mx: MotionValue<number>;
  my: MotionValue<number>;
  /** The loader has gone: start the film. */
  start: boolean;
  /** Reduced motion: hold one frame. */
  still: boolean;
  /** The hero is covered: stop drawing. */
  paused: boolean;
  /** A storm tint laid over the courier and his mat, so he stands in the same weather. */
  tintRef?: RefObject<HTMLDivElement | null>;
};

/** The page overlays the weather drives: the sky's colour, the haze, and the flashes. */
type Overlays = {
  layer: RefObject<HTMLDivElement | null>;
  dawn: RefObject<HTMLDivElement | null>;
  storm: RefObject<HTMLDivElement | null>;
  haze: RefObject<HTMLDivElement | null>;
};
const setOpacity = (ref: RefObject<HTMLDivElement | null> | undefined, v: number) => {
  const el = ref?.current;
  if (!el) return;
  const next = String(Math.round(Math.max(0, Math.min(1, v)) * 1000) / 1000);
  // Only touch the style when it changes, so a still sky costs nothing.
  if (el.style.opacity !== next) el.style.opacity = next;
};

/** One fixed wide view of the sky, leaning a little with the pointer. */
const CAM = new Vector3(0, 13, 46);
const AIM = new Vector3(4, 13, 0);
/** The picture slid right and up, so the sky's action plays in the open air above the courier's reach. */
const SHIFT_X = 0.2;
const SHIFT_Y = 0.17;

function Director({ clock, props, o }: { clock: RefObject<FilmClock>; props: Props; o: Overlays }) {
  const { camera, invalidate, size } = useThree();
  const framed = useRef({ w: 0, h: 0 });
  const elapsed = useRef(0);
  useEffect(() => {
    if (!props.still) return;
    // One frame for the clouds to lay themselves out, one to draw them.
    invalidate();
    const id = window.setTimeout(() => invalidate(), 60);
    return () => window.clearTimeout(id);
  }, [props.still, invalidate]);

  useFrame((_, delta) => {
    const c = clock.current;
    if (!c) return;
    const dt = props.still || !props.start ? 0 : Math.min(delta, 1 / 20);
    elapsed.current += dt;
    // In development, `window.__filmT = 15` pins the film to that second, to look at one beat.
    if (process.env.NODE_ENV !== "production") {
      const pin = (window as { __filmT?: number }).__filmT;
      if (typeof pin === "number") elapsed.current = Math.max(0, pin - LOOP_FROM);
    }
    const span = FILM_S - LOOP_FROM;
    const t = props.still ? STILL_T : LOOP_FROM + (elapsed.current % span);
    c.t = t;
    c.dt = dt;
    c.still = props.still;
    c.w = beats(t);
    c.d = duelBeats(t);

    const mx = props.mx.get();
    const my = props.my.get();
    camera.position.set(CAM.x - mx * 2.5, CAM.y + my * 1.2, CAM.z);
    camera.lookAt(AIM);
    const cam = camera as PerspectiveCamera;
    if (framed.current.w !== size.width || framed.current.h !== size.height || cam.fov !== 52) {
      framed.current = { w: size.width, h: size.height };
      cam.fov = 52;
      cam.setViewOffset(size.width, size.height, -size.width * SHIFT_X, size.height * SHIFT_Y, size.width, size.height);
    }

    // Fade the sky's layer out over the loop's last second and back in as it starts again, so
    // the clouds never jump.
    const into = t - LOOP_FROM;
    setOpacity(o.layer, props.still ? 1 : Math.min(1, (FILM_S - t) / 1.2, elapsed.current < span ? 1 : into / 0.6));

    // The sky: warm dawn light, the storm closing over it, haze, and the flashes.
    const w = c.w;
    setOpacity(o.dawn, (1 - w.storm * 0.4) * 0.9);
    // The sky stays bright: the clouds roll in white, nothing darkens it.
    setOpacity(o.storm, 0);
    setOpacity(o.haze, 0.55);
    setOpacity(props.tintRef, 0);
  }, -1);
  return null;
}

/** Warm low sun at dawn, cold and dim in the storm, white for an instant with each strike. */
function WeatherLights({ clock }: { clock: RefObject<FilmClock> }) {
  const hemi = useRef<HemisphereLight>(null);
  const sun = useRef<DirectionalLight>(null);
  const warm = useMemo(() => new Color("#ffd9ae"), []);
  const cold = useMemo(() => new Color("#a9b6cc"), []);
  const { scene } = useThree();
  useFrame(() => {
    const c = clock.current;
    if (!c) return;
    const { storm } = c.w;
    if (sun.current) {
      sun.current.intensity = 4.2;
      sun.current.color.copy(warm).lerp(cold, storm * 0.15);
    }
    if (hemi.current) hemi.current.intensity = 0.9;
    scene.environmentIntensity = 1;
  });
  return (
    <>
      <hemisphereLight ref={hemi} args={["#ffe2c2", "#7a4a2a", 0.9]} />
      <directionalLight ref={sun} position={[-40, 30, 40]} intensity={4.2} color="#ffd9ae" />
      <directionalLight position={[40, 10, -20]} intensity={1.2} color="#ffb070" />
    </>
  );
}

function Weather(props: Props & { o: Overlays }) {
  const clock = useRef<FilmClock>({ t: LOOP_FROM, dt: 0, w: beats(LOOP_FROM), d: duelBeats(LOOP_FROM), still: props.still });
  const puff = useMemo(() => puffTexture(), []);
  useEffect(() => () => puff.dispose(), [puff]);
  const { o, ...rest } = props;

  return (
    <>
      <Director clock={clock} props={rest} o={o} />
      <WeatherLights clock={clock} />
      <Clouds clock={clock} puff={puff} />
    </>
  );
}

/**
 * The desert sky behind the courier: a see-through canvas over the panorama with its weather
 * (dawn, a storm, clearing again) on a 25-second loop. Kept light so the hero stays smooth: no shadows, a low pixel ratio, and it
 * stops drawing once the page covers the hero.
 */
export function HeroDragons(props: Props) {
  const layer = useRef<HTMLDivElement>(null);
  const dawn = useRef<HTMLDivElement>(null);
  const storm = useRef<HTMLDivElement>(null);
  const haze = useRef<HTMLDivElement>(null);
  const o = useMemo<Overlays>(() => ({ layer, dawn, storm, haze }), []);
  return (
    <div className="absolute inset-0">
      {/* Over the desert, under the clouds: dawn's warm sun glow, the storm darkening the sky
          from the top down, and haze lying along the dunes. Opacity only, so they stay cheap. */}
      <div ref={dawn} className="absolute inset-0 mix-blend-screen">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_12%_8%,rgba(255,196,128,0.55),rgba(255,160,90,0.18)_45%,transparent_75%)]" />
        {/* Shafts of sun through the haze, fanning from the glow, fading out down the sky. */}
        <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_90%_80%_at_8%_0%,#000_10%,transparent_70%)] bg-[repeating-conic-gradient(from_100deg_at_6%_-8%,rgba(255,214,160,0)_0deg,rgba(255,214,160,0.22)_3deg,rgba(255,214,160,0)_7deg,rgba(255,214,160,0)_13deg)] blur-[6px]" />
      </div>
      <div
        ref={storm}
        style={{ opacity: 0 }}
        className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(24,28,38,0.82)_0%,rgba(40,46,58,0.62)_38%,rgba(52,56,64,0.38)_62%,rgba(40,40,44,0.3)_100%)]"
      />
      <div
        ref={haze}
        className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_32%,rgba(236,206,170,0.32)_44%,rgba(226,196,160,0.14)_56%,transparent_70%)]"
      />
      <div ref={layer} className="absolute inset-0">
        <Canvas
          frameloop={props.still ? "demand" : props.paused ? "never" : "always"}
          dpr={[1, 1.25]}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          camera={{ fov: 52, near: 0.5, far: 400, position: [CAM.x, CAM.y, CAM.z] }}
          style={{ background: "transparent" }}
        >
          <Weather {...props} o={o} />
        </Canvas>
      </div>
    </div>
  );
}
