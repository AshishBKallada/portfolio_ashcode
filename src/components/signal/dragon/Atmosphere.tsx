"use client";

/* eslint-disable react-hooks/immutability -- three.js objects are made once and changed every frame
   in useFrame, outside React's render: that is how R3F animates. */

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, type RefObject } from "react";
import {
  BufferAttribute,
  BufferGeometry,
  CatmullRomCurve3,
  Color,
  LineBasicMaterial,
  LineSegments,
  type Mesh,
  MeshBasicMaterial,
  Object3D,
  Sprite,
  SpriteMaterial,
  TubeGeometry,
  Vector3,
  type Texture,
} from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { LIGHTNING, type FilmClock } from "./film";
import { skyRate } from "@/lib/skyTimelapse";
import { rng } from "./textures";

/*
 * The weather the film asks for, laid over the desert: drifting clouds and shafts of warm sun at
 * dawn, then storm banks rolling in, rain and lightning, then the storm breaking. The colour of
 * the sky itself is shifted by the hero's overlays (HeroDragons); these are the parts with depth.
 */

/** Clouds high over the dunes: pale wisps at dawn that darken and thicken into the storm. */
export function Clouds({ clock, puff }: { clock: RefObject<FilmClock>; puff: Texture }) {
  const { group, wisp, bank, drift } = useMemo(() => {
    const r = rng(9);
    const wisp = new SpriteMaterial({ map: puff, transparent: true, depthWrite: false, opacity: 0.7, fog: false });
    const bank = new SpriteMaterial({ map: puff, transparent: true, depthWrite: false, opacity: 0, fog: false });
    const group = new Object3D();
    const drift: { s: Sprite; x: number; speed: number; span: number }[] = [];
    const add = (mat: SpriteMaterial, x: number, y: number, z: number, sx: number, sy: number, speed: number) => {
      const s = new Sprite(mat);
      s.position.set(x, y, z);
      s.scale.set(sx, sy, 1);
      group.add(s);
      drift.push({ s, x, speed, span: 260 });
    };
    for (let i = 0; i < 14; i++) add(wisp, -130 + r() * 260, 30 + r() * 26, -60 - r() * 40, 40 + r() * 40, 8 + r() * 8, 0.6 + r() * 0.8);
    for (let i = 0; i < 22; i++) add(bank, -130 + r() * 260, 28 + r() * 34, -50 - r() * 40, 50 + r() * 50, 22 + r() * 18, 1 + r() * 1.2);
    return { group, wisp, bank, drift };
  }, [puff]);
  useEffect(
    () => () => {
      wisp.dispose();
      bank.dispose();
    },
    [wisp, bank],
  );
  const tint = useMemo(() => ({ dawn: new Color("#ffe1c4"), storm: new Color("#f4f1ec"), lit: new Color("#dfe8ff") }), []);
  // How far the wind has carried the clouds, in seconds of drift.
  const run = useRef(0);
  useFrame(() => {
    const c = clock.current;
    if (!c) return;
    const { storm } = c.w;
    wisp.opacity = 0.7 * (1 - storm);
    wisp.color.copy(tint.dawn);
    bank.opacity = storm * 0.5;
    bank.color.copy(tint.storm);
    // The wind picks up with the storm, and the clouds race in timelapse bursts (lib/skyTimelapse).
    run.current += c.dt * (1 + storm * 1.5) * skyRate(performance.now() / 1000);
    for (const d of drift) {
      const x = d.x + run.current * d.speed;
      d.s.position.x = ((((x + 130) % d.span) + d.span) % d.span) - 130;
    }
  });
  return <primitive object={group} />;
}

/** Rain: streaks in a box that travels with the camera, slanting in the wind. */
export function Rain({ clock, count }: { clock: RefObject<FilmClock>; count: number }) {
  const { lines, offsets } = useMemo(() => {
    const r = rng(31);
    const offsets = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      offsets[i * 3] = (r() - 0.5) * 70;
      offsets[i * 3 + 1] = (r() - 0.5) * 50;
      offsets[i * 3 + 2] = -5 - r() * 45;
    }
    const g = new BufferGeometry();
    g.setAttribute("position", new BufferAttribute(new Float32Array(count * 6), 3));
    const lines = new LineSegments(g, new LineBasicMaterial({ color: "#c9d2e0", transparent: true, opacity: 0, depthWrite: false }));
    lines.frustumCulled = false;
    return { lines, offsets };
  }, [count]);
  useEffect(
    () => () => {
      lines.geometry.dispose();
      (lines.material as LineBasicMaterial).dispose();
    },
    [lines],
  );
  const { camera } = useThree();
  useFrame(() => {
    const c = clock.current;
    if (!c) return;
    (lines.material as LineBasicMaterial).opacity = c.w.rain * 0.45 * (1 + c.w.bolt);
    lines.visible = c.w.rain > 0.01;
    if (!lines.visible) return;
    const pos = lines.geometry.attributes.position as BufferAttribute;
    const fall = 42;
    const wind = 8;
    const len = 1.5;
    const cam = camera.position;
    for (let i = 0; i < count; i++) {
      let y = offsets[i * 3 + 1] - c.dt * fall;
      let x = offsets[i * 3] - c.dt * wind;
      if (y < -25) y += 50;
      if (x < -35) x += 70;
      offsets[i * 3 + 1] = y;
      offsets[i * 3] = x;
      const px = cam.x + x;
      const py = cam.y + y;
      const pz = cam.z + offsets[i * 3 + 2];
      pos.setXYZ(i * 2, px, py, pz);
      pos.setXYZ(i * 2 + 1, px + (wind / fall) * len, py + len, pz);
    }
    pos.needsUpdate = true;
  });
  return <primitive object={lines} />;
}

function boltGeometry(from: Vector3, to: Vector3, seed: number) {
  const r = rng(seed);
  const main: Vector3[] = [];
  const steps = 14;
  for (let i = 0; i <= steps; i++) {
    const p = from.clone().lerp(to, i / steps);
    if (i > 0 && i < steps) p.add(new Vector3((r() - 0.5) * 7, (r() - 0.5) * 2, (r() - 0.5) * 4));
    main.push(p);
  }
  const parts = [new TubeGeometry(new CatmullRomCurve3(main, false, "catmullrom", 0), 70, 0.22, 4, false)];
  for (let k = 0; k < 2; k++) {
    const at = 3 + Math.floor(r() * 6);
    const pts = [main[at].clone()];
    const dir = new Vector3((r() - 0.5) * 2, -1, (r() - 0.5) * 0.6).normalize();
    for (let j = 1; j <= 5; j++) pts.push(pts[j - 1].clone().addScaledVector(dir, 4).add(new Vector3((r() - 0.5) * 3, 0, 0)));
    parts.push(new TubeGeometry(new CatmullRomCurve3(pts, false, "catmullrom", 0), 24, 0.11, 4, false));
  }
  return mergeGeometries(parts);
}

/** The strikes: each its own jagged bolt from the storm down to the dunes. */
export function Lightning({ clock }: { clock: RefObject<FilmClock> }) {
  const { geos, mat } = useMemo(() => {
    const r = rng(41);
    const geos = LIGHTNING.map((at, i) => {
      const x = -90 + r() * 180;
      const z = -70 - r() * 30;
      return boltGeometry(new Vector3(x + (r() - 0.5) * 20, 70, z), new Vector3(x, 0, z), 100 + i);
    });
    const mat = new MeshBasicMaterial({ color: new Color(1.6, 1.8, 2.4), transparent: true, opacity: 0, toneMapped: false, depthWrite: false });
    return { geos, mat };
  }, []);
  useEffect(
    () => () => {
      geos.forEach((g) => g.dispose());
      mat.dispose();
    },
    [geos, mat],
  );
  const refs = useRef<(Mesh | null)[]>([]);
  useFrame(() => {
    const c = clock.current;
    if (!c) return;
    mat.opacity = c.w.bolt;
    refs.current.forEach((m, i) => {
      if (m) m.visible = c.w.boltIndex === i && c.w.bolt > 0.05;
    });
  });
  return (
    <>
      {geos.map((g, i) => (
        <mesh
          key={i}
          geometry={g}
          material={mat}
          visible={false}
          frustumCulled={false}
          ref={(el) => {
            refs.current[i] = el;
          }}
        />
      ))}
    </>
  );
}
