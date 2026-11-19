"use client";


import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, type RefObject } from "react";
import {
  CapsuleGeometry,
  CatmullRomCurve3,
  Color,
  ConeGeometry,
  DoubleSide,
  type Group,
  InstancedMesh,
  Matrix4,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  SphereGeometry,
  TubeGeometry,
  Vector3,
  type Texture,
} from "three";
import { smooth, type FilmClock } from "./film";
import { Tubes } from "./tubes";

export type DragonLook = {
  /** Where the head is at film time `t`. The body is the path it has flown. */
  head: (t: number, out: Vector3) => Vector3;
  length: number;
  radius: number;
  rings: number;
  back: string;
  flank: string;
  belly: string;
  mane: string;
  horn: string;
  claw: string;
  eye: string;
  glassy: boolean;
  /** Its own way of moving: how far and how fast the body ripples. */
  sway: number;
  waves: number;
  waveSpeed: number;
  /** How hard the mane and whiskers stream. */
  wind: number;
  /** 0..1 how open the jaw is at `t`. */
  jaw: (t: number) => number;
  /** How hard the head turns to `aimAt` at `t`, 0..1. */
  aim: (t: number) => number;
  aimAt: (t: number, out: Vector3) => Vector3;
};

/** Where the mouth is and which way it faces, for the fire and the beam. */
export type DragonRig = { mouth: Vector3; forward: Vector3; head: Vector3 };
export const makeRig = (): DragonRig => ({ mouth: new Vector3(), forward: new Vector3(0, 0, 1), head: new Vector3() });

const HAIR_RINGS = 14;
const MANE = 14;
const BEARD = 3;
const TAIL = 6;
const WHISKERS = 2;
const HAIRS = MANE + BEARD + TAIL + WHISKERS;
/** Where the legs sit along the body (0 head, 1 tail), and which side. */
const LEGS = [
  { s: 0.16, side: 1, phase: 0 },
  { s: 0.16, side: -1, phase: Math.PI },
  { s: 0.5, side: 1, phase: Math.PI * 0.6 },
  { s: 0.5, side: -1, phase: Math.PI * 1.6 },
];

const A = new Vector3();
const Bv = new Vector3();
const P = new Vector3();
const F = new Vector3();
const U = new Vector3();
const X = new Vector3();
const M4 = new Matrix4();
const M_FIN = new Matrix4();
const Nv = new Vector3();
const Tv = new Vector3();
const Sv = new Vector3();

/** The radius along the body, s = 0 at the head to 1 at the tail tip. */
function bodyRadius(s: number, R: number) {
  const neck = 0.58 + 0.42 * smooth(0, 0.13, s);
  const taper = 1 - 0.86 * Math.pow(smooth(0.28, 1, s), 1.15);
  const chest = 1 + 0.1 * Math.exp(-Math.pow((s - 0.2) / 0.08, 2));
  return R * neck * taper * chest;
}

/** A horn or tine: a tube along a curve, tapering to a point. */
function hornGeometry(points: Vector3[], r: number) {
  const curve = new CatmullRomCurve3(points);
  const seg = 18;
  const radial = 7;
  const g = new TubeGeometry(curve, seg, r, radial, false);
  const pos = g.attributes.position;
  for (let i = 0; i <= seg; i++) {
    const c = curve.getPointAt(i / seg);
    const k = 1 - 0.88 * (i / seg);
    for (let j = 0; j <= radial; j++) {
      const v = i * (radial + 1) + j;
      pos.setXYZ(v, c.x + (pos.getX(v) - c.x) * k, c.y + (pos.getY(v) - c.y) * k, c.z + (pos.getZ(v) - c.z) * k);
    }
  }
  g.computeVertexNormals();
  return g;
}

const v3 = (x: number, y: number, z: number) => new Vector3(x, y, z);

/**
 * A long Chinese dragon made in code. The body is a tube laid along the path the head has flown
 * (sampled back through its track and spaced by arc length), rippling on top of that so it is
 * never stiff. The head, horns, whiskers, mane, fins and four clawed legs are placed on the
 * body's frames every frame.
 */
export function Dragon({
  look,
  clock,
  rig,
  scales,
}: {
  look: DragonLook;
  clock: RefObject<FilmClock>;
  rig: DragonRig;
  scales: Texture;
}) {
  const R = look.radius;
  const N = look.rings;

  const parts = useMemo(() => {
    const back = new Color(look.back);
    const flank = new Color(look.flank);
    const belly = new Color(look.belly);
    const body = new Tubes(1, N, 12, {
      aroundRepeat: 3,
      alongRepeat: Math.round(look.length / (R * 1.6)),
      // `around` 0 is the spine, 0.5 the belly.
      colors: (around) => {
        const up = Math.cos(around * Math.PI * 2);
        if (up < -0.4) return flank.clone().lerp(belly, smooth(-0.4, -0.72, up));
        return flank.clone().lerp(back, smooth(0.05, 0.9, up));
      },
    });
    const hair = new Tubes(HAIRS, HAIR_RINGS, 4);

    const glassy = look.glassy;
    const skin = new MeshPhysicalMaterial({
      vertexColors: true,
      map: scales,
      bumpMap: scales,
      bumpScale: glassy ? 0.6 : 1.6,
      roughness: glassy ? 0.16 : 0.36,
      metalness: glassy ? 0.45 : 0.3,
      clearcoat: glassy ? 1 : 0,
      clearcoatRoughness: 0.06,
      emissive: new Color(glassy ? "#e2f3ff" : "#000000"),
      emissiveMap: glassy ? scales : null,
      emissiveIntensity: glassy ? 0.35 : 0,
    });
    const headSkin = new MeshPhysicalMaterial({
      // Brighter than the body: no scale map darkening it, just the bump, so the face reads.
      color: new Color(look.flank).lerp(new Color(look.belly), 0.12),
      bumpMap: scales,
      bumpScale: 0.5,
      roughness: skin.roughness,
      metalness: skin.metalness,
      clearcoat: skin.clearcoat,
      clearcoatRoughness: skin.clearcoatRoughness,
      emissive: skin.emissive,
      emissiveIntensity: glassy ? 0.14 : 0,
    });
    const bellySkin = new MeshStandardMaterial({ color: look.belly, roughness: 0.42, metalness: 0.35 });
    const maneMat = new MeshStandardMaterial({
      color: look.mane,
      roughness: 0.32,
      metalness: glassy ? 0.3 : 0.7,
      emissive: new Color(look.mane),
      emissiveIntensity: glassy ? 0.3 : 0.1,
      side: DoubleSide,
    });
    const hornMat = new MeshStandardMaterial({ color: look.horn, roughness: 0.3, metalness: 0.5 });
    const clawMat = new MeshStandardMaterial({ color: look.claw, roughness: 0.22, metalness: 0.6 });
    const eyeMat = new MeshStandardMaterial({ color: look.eye, emissive: look.eye, emissiveIntensity: 4, toneMapped: false });
    const pupilMat = new MeshStandardMaterial({ color: "#050505", roughness: 0.1 });
    const mouthMat = new MeshStandardMaterial({ color: "#2a0606", emissive: glassy ? "#d6f1ff" : "#ff8a2a", emissiveIntensity: 0 });
    const toothMat = new MeshStandardMaterial({ color: "#f3ead2", roughness: 0.3 });

    // Dorsal fins: flat blades along the spine, every third ring.
    const finGeo = new ConeGeometry(0.5, 1, 4, 1);
    finGeo.translate(0, 0.5, 0);
    const finCount = Math.floor((N * 0.86) / 3);
    const fins = new InstancedMesh(finGeo, maneMat, finCount);
    fins.frustumCulled = false;
    fins.castShadow = true;

    // The head's pieces, in units of R, facing +z, up +y.
    const unit = new SphereGeometry(1, 20, 12);
    const horns = [1, -1].map((s) =>
      hornGeometry([v3(0.42 * s, 0.62, -0.25), v3(0.6 * s, 1.15, -0.9), v3(0.72 * s, 1.55, -1.75), v3(0.78 * s, 1.75, -2.7)], 0.13),
    );
    const tines = [1, -1].map((s) => hornGeometry([v3(0.62 * s, 1.25, -1.05), v3(0.85 * s, 1.75, -1.1), v3(1.0 * s, 2.1, -1.35)], 0.08));
    const tooth = new ConeGeometry(0.06, 0.24, 5);
    tooth.rotateX(Math.PI);
    const thigh = new CapsuleGeometry(0.22, 0.75, 4, 10);
    thigh.translate(0, -0.48, 0);
    const shin = new CapsuleGeometry(0.16, 0.7, 4, 10);
    shin.translate(0, -0.42, 0);
    const claw = new ConeGeometry(0.075, 0.42, 6);
    claw.rotateX(Math.PI / 2);
    claw.translate(0, 0, 0.21);

    return {
      body,
      hair,
      skin,
      headSkin,
      bellySkin,
      maneMat,
      hornMat,
      clawMat,
      eyeMat,
      pupilMat,
      mouthMat,
      toothMat,
      finGeo,
      fins,
      finCount,
      unit,
      horns,
      tines,
      tooth,
      thigh,
      shin,
      claw,
    };
  }, [N, R, look, scales]);

  useEffect(
    () => () => {
      const p = parts;
      p.body.dispose();
      p.hair.dispose();
      [p.finGeo, p.unit, p.tooth, p.thigh, p.shin, p.claw, ...p.horns, ...p.tines].forEach((g) => g.dispose());
      [p.skin, p.headSkin, p.bellySkin, p.maneMat, p.hornMat, p.clawMat, p.eyeMat, p.pupilMat, p.mouthMat, p.toothMat].forEach((m) => m.dispose());
    },
    [parts],
  );

  const spine = useMemo(() => new Float32Array(N * 3), [N]);
  const radii = useMemo(() => {
    const r = new Float32Array(N);
    for (let i = 0; i < N; i++) r[i] = bodyRadius(i / (N - 1), R);
    return r;
  }, [N, R]);
  const strand = useMemo(() => new Float32Array(HAIR_RINGS * 3), []);

  const headRef = useRef<Group>(null);
  const jawRef = useRef<Group>(null);
  const legRefs = useRef<(Group | null)[]>([]);
  const kneeRefs = useRef<(Group | null)[]>([]);
  const hipRefs = useRef<(Group | null)[]>([]);

  useFrame(() => {
    const c = clock.current;
    if (!c) return;
    const t = c.t;
    const { body, hair, fins, finCount, mouthMat } = parts;

    // 1. The spine: back along the track the head has flown, one ring every `ds`.
    const ds = look.length / (N - 1);
    look.head(t, P);
    spine[0] = P.x;
    spine[1] = P.y;
    spine[2] = P.z;
    A.copy(P);
    let i = 1;
    let need = ds;
    let acc = 0;
    let tt = t;
    for (let step = 0; i < N && step < 5000; step++) {
      tt -= 0.02;
      look.head(tt, Bv);
      const seg = Bv.distanceTo(A);
      if (seg > 1e-6) {
        while (i < N && acc + seg >= need) {
          const f = (need - acc) / seg;
          spine[i * 3] = A.x + (Bv.x - A.x) * f;
          spine[i * 3 + 1] = A.y + (Bv.y - A.y) * f;
          spine[i * 3 + 2] = A.z + (Bv.z - A.z) * f;
          i++;
          need += ds;
        }
        acc += seg;
        A.copy(Bv);
      }
    }
    for (; i < N; i++) {
      // Ran out of track: carry straight on (or hang down, if there was none at all).
      if (i === 1) {
        spine[3] = spine[0];
        spine[4] = spine[1] - ds;
        spine[5] = spine[2];
        continue;
      }
      for (let k = 0; k < 3; k++) spine[i * 3 + k] = spine[(i - 1) * 3 + k] * 2 - spine[(i - 2) * 3 + k];
    }

    // 2. The ripple, on the spine's own frames: side to side and a little up and down.
    body.frames(0, spine);
    const time = c.still ? 0 : t;
    for (let j = 1; j < N; j++) {
      const s = j / (N - 1);
      const w = smooth(0.03, 0.22, s) * look.sway * R;
      const side = Math.sin(s * look.waves * Math.PI * 2 - time * look.waveSpeed) * w;
      const lift = Math.sin(s * look.waves * 1.3 * Math.PI * 2 - time * look.waveSpeed * 0.7 + 1) * w * 0.55;
      const o = j * 3;
      for (let k = 0; k < 3; k++) spine[o + k] += body.B[o + k] * side + body.N[o + k] * lift;
    }
    body.update(0, spine, radii);
    body.commit();

    const T = body.T;
    const Nn = body.N;
    const Bn = body.B;
    const at = (j: number, out: Vector3, arr: Float32Array) => out.set(arr[j * 3], arr[j * 3 + 1], arr[j * 3 + 2]);

    // 3. The head: along the neck, turned towards its target when it aims.
    at(0, P, spine);
    at(0, F, T);
    const aim = look.aim(t);
    if (aim > 0) {
      look.aimAt(t, A).sub(P).normalize();
      F.lerp(A, aim).normalize();
    }
    at(0, U, Nn);
    U.addScaledVector(F, -U.dot(F)).normalize();
    X.crossVectors(U, F);
    const g = headRef.current;
    if (g) {
      M4.makeBasis(X, U, F).setPosition(P);
      g.matrix.copy(M4);
      g.matrixWorldNeedsUpdate = true;
    }
    const open = look.jaw(t);
    if (jawRef.current) jawRef.current.rotation.x = 0.08 + open * 0.62;
    mouthMat.emissiveIntensity = open * 3;
    rig.head.copy(P);
    rig.forward.copy(F);
    rig.mouth.copy(P).addScaledVector(F, 2.7 * R).addScaledVector(U, -0.15 * R);

    // 4. Fins down the back, swaying.
    const m = M_FIN;
    for (let f = 0; f < finCount; f++) {
      const j = 6 + f * 3;
      if (j >= N) break;
      const s = j / (N - 1);
      const r = radii[j];
      at(j, Nv, Nn);
      at(j, Tv, T);
      at(j, Sv, Bn);
      const sway = Math.sin(time * 3 + j * 0.4) * 0.25;
      Bv.copy(Nv).multiplyScalar(0.75).addScaledVector(Tv, -0.65).addScaledVector(Sv, sway).normalize();
      A.crossVectors(Sv, Bv).normalize();
      m.makeBasis(Sv, Bv, A);
      const h = r * (1.1 + 0.5 * Math.sin(s * 40)) * (1 - s * 0.4);
      m.scale(Bv.set(r * 0.12, h, r * 0.7));
      at(j, P, spine);
      P.addScaledVector(Nv, r * 0.8);
      m.setPosition(P);
      fins.setMatrixAt(f, m);
    }
    fins.instanceMatrix.needsUpdate = true;

    // 5. Hair: the mane streaming down the neck, the beard, the tail tuft and the whiskers.
    const wind = look.wind;
    let k = 0;
    for (let h = 0; h < MANE; h++, k++) {
      const side = (h / (MANE - 1)) * 2 - 1;
      for (let q = 0; q < HAIR_RINGS; q++) {
        const j = Math.min(N - 1, 1 + q * 2);
        const f = q / (HAIR_RINGS - 1);
        at(j, P, spine);
        at(j, Nv, Nn);
        at(j, Sv, Bn);
        const wave = Math.sin(q * 0.7 - time * 7 * wind + h * 1.7) * f * R * 0.28 * wind;
        const flap = Math.cos(q * 0.5 - time * 5.5 * wind + h) * f * R * 0.22 * wind;
        P.addScaledVector(Nv, radii[j] * (0.85 + 0.1 * Math.cos(side * 1.4)) + R * (0.12 + f * 0.32) + flap);
        P.addScaledVector(Sv, side * R * (0.45 + f * 0.25) + wave);
        strand[q * 3] = P.x;
        strand[q * 3 + 1] = P.y;
        strand[q * 3 + 2] = P.z;
      }
      hair.update(k, strand, (q) => R * (0.075 - 0.065 * (q / (HAIR_RINGS - 1))));
    }
    // The beard hangs back under the jaw.
    at(0, P, spine);
    for (let h = 0; h < BEARD; h++, k++) {
      const side = h - 1;
      for (let q = 0; q < HAIR_RINGS; q++) {
        const f = q / (HAIR_RINGS - 1);
        A.copy(P)
          .addScaledVector(F, R * (1.2 - f * 1.6))
          .addScaledVector(U, -R * (0.45 + f * 0.45))
          .addScaledVector(X, R * side * (0.25 + f * 0.3) + Math.sin(q * 0.8 - time * 6 + h) * f * R * 0.3 * wind);
        strand[q * 3] = A.x;
        strand[q * 3 + 1] = A.y;
        strand[q * 3 + 2] = A.z;
      }
      hair.update(k, strand, (q) => R * (0.08 - 0.065 * (q / (HAIR_RINGS - 1))));
    }
    // The tail tuft, flaring out of the tip.
    const last = N - 1;
    at(last, Tv, T);
    at(last, Nv, Nn);
    at(last, Sv, Bn);
    for (let h = 0; h < TAIL; h++, k++) {
      const a = (h / TAIL) * Math.PI * 2;
      at(Math.max(0, last - 4), P, spine);
      for (let q = 0; q < HAIR_RINGS; q++) {
        const f = q / (HAIR_RINGS - 1);
        A.copy(P)
          .addScaledVector(Tv, -f * R * 2.2)
          .addScaledVector(Nv, Math.cos(a) * f * R * 0.9 + Math.sin(q * 0.6 - time * 5 + h) * f * R * 0.4)
          .addScaledVector(Sv, Math.sin(a) * f * R * 0.9);
        strand[q * 3] = A.x;
        strand[q * 3 + 1] = A.y;
        strand[q * 3 + 2] = A.z;
      }
      hair.update(k, strand, (q) => R * (0.09 - 0.08 * (q / (HAIR_RINGS - 1))));
    }
    // Whiskers: long and thin off the snout, trailing back and curling.
    for (let h = 0; h < WHISKERS; h++, k++) {
      const side = h === 0 ? 1 : -1;
      at(0, P, spine);
      for (let q = 0; q < HAIR_RINGS; q++) {
        const f = q / (HAIR_RINGS - 1);
        A.copy(P)
          .addScaledVector(F, R * (2.35 - f * 5))
          .addScaledVector(X, side * R * (0.5 + f * 2.2 + Math.sin(q * 0.55 - time * 4.5 * wind) * f * 0.8))
          .addScaledVector(U, R * (-0.05 + Math.cos(q * 0.45 - time * 3.8 * wind + side) * f * 0.9 - f * 0.4));
        strand[q * 3] = A.x;
        strand[q * 3 + 1] = A.y;
        strand[q * 3 + 2] = A.z;
      }
      hair.update(k, strand, (q) => R * (0.032 - 0.024 * (q / (HAIR_RINGS - 1))));
    }
    hair.commit();

    // 6. Legs: hung off the body's frames, paddling as it swims through the air.
    LEGS.forEach((leg, n) => {
      const grp = legRefs.current[n];
      if (!grp) return;
      const j = Math.round(leg.s * (N - 1));
      const r = radii[j];
      at(j, Tv, T);
      at(j, Nv, Nn);
      at(j, Sv, Bn);
      at(j, P, spine);
      P.addScaledVector(Sv, leg.side * r * 0.72).addScaledVector(Nv, -r * 0.35);
      // Local axes (right-handed): x = -side vector, y up, z towards the head.
      X.copy(Sv).negate();
      M4.makeBasis(X, Nv, Tv).setPosition(P);
      grp.matrix.copy(M4);
      grp.matrixWorldNeedsUpdate = true;
      const paddle = Math.sin(time * 2.4 + leg.phase);
      const hip = hipRefs.current[n];
      const knee = kneeRefs.current[n];
      if (hip) {
        hip.rotation.x = -0.55 + paddle * 0.45;
        // Splayed out to its own side (local x is the mirror of the body's side).
        hip.rotation.z = -leg.side * 0.75;
      }
      if (knee) knee.rotation.x = 1.1 + paddle * 0.35;
    });
  });

  const p = parts;
  const s = R;
  return (
    <group>
      <mesh geometry={p.body.geometry} material={p.skin} castShadow receiveShadow frustumCulled={false} />
      <mesh geometry={p.hair.geometry} material={p.maneMat} castShadow frustumCulled={false} />
      <primitive object={p.fins} />

      <group ref={headRef} matrixAutoUpdate={false}>
        <group scale={s}>
          {/* Skull, brow, snout. */}
          <mesh geometry={p.unit} material={p.headSkin} scale={[1.05, 0.82, 1.2]} position={[0, 0.12, 0.25]} castShadow />
          <mesh geometry={p.unit} material={p.headSkin} scale={[0.72, 0.5, 1.25]} position={[0, 0.05, 1.45]} castShadow />
          <mesh geometry={p.unit} material={p.headSkin} scale={[0.3, 0.22, 0.6]} position={[0.42, 0.55, 0.7]} rotation={[0.2, 0.25, 0]} />
          <mesh geometry={p.unit} material={p.headSkin} scale={[0.3, 0.22, 0.6]} position={[-0.42, 0.55, 0.7]} rotation={[0.2, -0.25, 0]} />
          {/* Nose pad, in the belly gold. */}
          <mesh geometry={p.unit} material={p.bellySkin} scale={[0.5, 0.26, 0.3]} position={[0, 0.2, 2.55]} />
          {/* Cheek frills. */}
          <mesh geometry={p.unit} material={p.maneMat} scale={[0.12, 0.55, 0.8]} position={[0.9, -0.05, -0.1]} rotation={[0.5, 0.4, 0.2]} />
          <mesh geometry={p.unit} material={p.maneMat} scale={[0.12, 0.55, 0.8]} position={[-0.9, -0.05, -0.1]} rotation={[0.5, -0.4, -0.2]} />
          {/* Eyes. */}
          {[1, -1].map((x) => (
            <group key={x} position={[0.55 * x, 0.4, 0.85]}>
              <mesh geometry={p.unit} material={p.eyeMat} scale={0.2} />
              <mesh geometry={p.unit} material={p.pupilMat} scale={[0.05, 0.15, 0.05]} position={[0.12 * x, 0, 0.1]} />
            </group>
          ))}
          {/* Horns. */}
          {p.horns.map((g, n) => (
            <mesh key={`h${n}`} geometry={g} material={p.hornMat} castShadow />
          ))}
          {p.tines.map((g, n) => (
            <mesh key={`t${n}`} geometry={g} material={p.hornMat} />
          ))}
          {/* Upper teeth. */}
          {[-0.4, -0.2, 0.2, 0.4].map((x) => (
            <mesh key={x} geometry={p.tooth} material={p.toothMat} position={[x, -0.32, 2.2 - Math.abs(x)]} />
          ))}
          {/* The jaw, hinged under the skull. */}
          <group ref={jawRef} position={[0, -0.3, 0.3]}>
            <mesh geometry={p.unit} material={p.headSkin} scale={[0.62, 0.24, 1.25]} position={[0, -0.12, 1.05]} castShadow />
            <mesh geometry={p.unit} material={p.mouthMat} scale={[0.5, 0.12, 1.0]} position={[0, 0.05, 1.05]} />
            {[-0.32, 0.32].map((x) => (
              <mesh key={x} geometry={p.tooth} material={p.toothMat} position={[x, 0.14, 1.8]} rotation={[Math.PI, 0, 0]} />
            ))}
          </group>
        </group>
      </group>

      {LEGS.map((leg, n) => (
        <group
          key={n}
          ref={(el) => {
            legRefs.current[n] = el;
          }}
          matrixAutoUpdate={false}
        >
          <group
            scale={s}
            ref={(el) => {
              hipRefs.current[n] = el;
            }}
          >
            <mesh geometry={p.thigh} material={p.headSkin} castShadow />
            <group
              position={[0, -0.95, 0]}
              ref={(el) => {
                kneeRefs.current[n] = el;
              }}
            >
              <mesh geometry={p.shin} material={p.headSkin} castShadow />
              <group position={[0, -0.85, 0.05]}>
                {[-0.5, -0.17, 0.17, 0.5].map((a) => (
                  <mesh key={a} geometry={p.claw} material={p.clawMat} rotation={[0.5, a, 0]} castShadow />
                ))}
              </group>
            </group>
          </group>
        </group>
      ))}
    </group>
  );
}
