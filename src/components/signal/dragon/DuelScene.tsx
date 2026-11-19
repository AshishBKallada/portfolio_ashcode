"use client";

/* eslint-disable react-hooks/immutability -- three.js objects (geometry, materials, uniforms) are made once
   in useMemo and changed every frame in useFrame, outside React's render: that is how R3F animates. */

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, type RefObject } from "react";
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  CylinderGeometry,
  DoubleSide,
  type Group,
  type Mesh,
  MeshBasicMaterial,
  type PointLight,
  Points,
  RingGeometry,
  ShaderMaterial,
  type Sprite,
  SpriteMaterial,
  type Texture,
  Vector3,
} from "three";
import { Dragon, makeRig, type DragonLook, type DragonRig } from "./Dragon";
import { amberAt, amberHidden, amberScreenAt, amberScreenW, clashPoint, D_BOOM, D_EXIT, D_FIRE_C, D_FIRE_X, D_HIT, D_POINT, duelT, obsidianAt, seamFrac } from "./duel";
import { smooth, window01, type FilmClock } from "./film";
import { rng } from "./textures";

/*
 * The duel in the hero's sky: the two dragons of the first hero (Dragon.tsx), red and gold
 * against white and glassy, their beams, the dust that hangs between them, and the impact.
 * Timed by duel.ts on the film clock.
 */

/* ------------------------------------------------------------------ breath */

const particleVertex = /* glsl */ `
  attribute float aLife;
  attribute float aSize;
  uniform float scale;
  varying float vLife;
  void main() {
    vLife = aLife;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aLife < 0.0 ? 0.0 : aSize * scale / -mv.z;
    gl_Position = projectionMatrix * mv;
  }
`;
function pool(count: number, fragment: string, scale: number) {
  const g = new BufferGeometry();
  g.setAttribute("position", new BufferAttribute(new Float32Array(count * 3), 3));
  g.setAttribute("aLife", new BufferAttribute(new Float32Array(count).fill(-1), 1));
  g.setAttribute("aSize", new BufferAttribute(new Float32Array(count).fill(1), 1));
  const m = new ShaderMaterial({
    vertexShader: particleVertex,
    fragmentShader: fragment,
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
    uniforms: { scale: { value: scale }, strength: { value: 1 } },
  });
  const p = new Points(g, m);
  p.frustumCulled = false;
  return p;
}

const _n = new Vector3();
const _v = new Vector3();
const _end = new Vector3();
const UP = new Vector3(0, 1, 0);

/**
 * Where the two beams lock and push: along the line from the orange one's mouth to the
 * other's, at the fraction duel.ts gives, swaying as one gains on the other.
 */
function seamAt(orange: DragonRig, mega: DragonRig, u: number, t: number, out: Vector3) {
  const f = seamFrac(u) + Math.sin(t * 2.7) * 0.025 + Math.sin(t * 6.1) * 0.01;
  return out.copy(orange.mouth).lerp(mega.mouth, f);
}

/* ------------------------------------------------------------------- beams */

const beamVertex = /* glsl */ `
  varying vec2 vUv;
  varying float vEdge;
  void main() {
    vUv = uv;
    vec3 n = normalize(normalMatrix * normal);
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vEdge = abs(dot(n, normalize(-mv.xyz)));
    gl_Position = projectionMatrix * mv;
  }
`;
const beamFragment = /* glsl */ `
  uniform float strength;
  uniform float time;
  uniform vec3 edge;
  uniform vec3 core;
  varying vec2 vUv;
  varying float vEdge;
  void main() {
    float c0 = pow(vEdge, 3.0);
    float ripple = 0.75 + 0.25 * sin(vUv.y * 60.0 - time * 50.0);
    vec3 c = mix(edge, core, c0);
    float a = (c0 * 1.4 + pow(vEdge, 0.8) * 0.35) * ripple * strength;
    gl_FragColor = vec4(c * a * 2.2, a);
  }
`;

/**
 * A beam from one's mouth, the white dragon's beam from the first hero, for both of them: a glowing tube, a
 * white core with its colour at the edges, rippling down its length, a glow at the mouth and
 * at its end, and a light where it lands. It grows out over a third of a second, reaches the
 * other alone, or stops at the seam where the other's beam meets it.
 */
function Beam({ clock, me, foe, orange, mega, fire, glow }: { clock: RefObject<FilmClock>; me: DragonRig; foe: DragonRig; orange: DragonRig; mega: DragonRig; fire: "x" | "c"; glow: Texture }) {
  const blue = fire === "x";
  const { geometry, material, glowMat } = useMemo(() => {
    const geometry = new CylinderGeometry(0.55, 0.75, 1, 16, 8, true);
    geometry.translate(0, 0.5, 0);
    const material = new ShaderMaterial({
      vertexShader: beamVertex,
      fragmentShader: beamFragment,
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
      side: DoubleSide,
      uniforms: {
        strength: { value: 0 },
        time: { value: 0 },
        edge: { value: new Color(blue ? "#8cc8ff" : "#ff6a14") },
        core: { value: new Color(blue ? "#ffffff" : "#fff0c8") },
      },
    });
    const glowMat = new SpriteMaterial({ map: glow, color: blue ? "#b8dcff" : "#ffc27a", blending: AdditiveBlending, transparent: true, depthWrite: false, opacity: 0 });
    return { geometry, material, glowMat };
  }, [glow, blue]);
  useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
      glowMat.dispose();
    },
    [geometry, material, glowMat],
  );
  const beam = useRef<Mesh>(null);
  const start = useRef<Sprite>(null);
  const hit = useRef<Sprite>(null);
  const light = useRef<PointLight>(null);
  useFrame(() => {
    const c = clock.current;
    const m = beam.current;
    if (!c || !m) return;
    const on = c.d.on ? (blue ? c.d.fireX : c.d.fireC) : 0;
    m.visible = on > 0.001;
    glowMat.opacity = on;
    if (light.current) light.current.intensity = 0;
    if (!m.visible) return;
    const u = duelT(c.t);
    const grow = Math.min(1, Math.max(0, (u - (blue ? D_FIRE_X[0] : D_FIRE_C[0])) / 0.35));
    // Alone it reaches the other; once both fire it stops at the seam.
    _n.copy(foe.mouth).sub(me.mouth);
    let reach = _n.length();
    _n.normalize();
    if (c.d.fireX > 0.01 && c.d.fireC > 0.01) {
      seamAt(orange, mega, u, c.t, _end);
      reach = Math.min(reach, _end.distanceTo(me.mouth));
    }
    const len = reach * grow;
    m.position.copy(me.mouth);
    m.quaternion.setFromUnitVectors(UP, _n);
    // The red one breathes right in front of us: its beam is thinner, so it doesn't fill the frame.
    const w = (1 + Math.sin(c.t * 33) * 0.12) * (0.4 + 0.6 * grow) * (blue ? 1 : 0.4);
    m.scale.set(w, Math.max(0.01, len), w);
    material.uniforms.strength.value = on;
    material.uniforms.time.value = c.t;
    _end.copy(me.mouth).addScaledVector(_n, len);
    if (start.current) {
      start.current.position.copy(me.mouth);
      start.current.scale.setScalar(2.4 + Math.sin(c.t * 25) * 0.4);
    }
    if (hit.current) {
      hit.current.position.copy(_end);
      hit.current.scale.setScalar((6 + Math.sin(c.t * 31) * 1.5) * grow);
    }
    if (light.current) {
      light.current.position.copy(_end);
      light.current.intensity = on * grow * 500;
    }
  });
  return (
    <>
      <mesh ref={beam} geometry={geometry} material={material} frustumCulled={false} visible={false} />
      <sprite ref={start} material={glowMat} />
      <sprite ref={hit} material={glowMat} />
      <pointLight ref={light} color={blue ? "#9ccaff" : "#ffb070"} intensity={0} distance={45} decay={2} />
    </>
  );
}

/* ------------------------------------------------------------------- motes */

/**
 * Dust in the air between them: drifting at first, slowing and hanging still as the pressure
 * builds, then torn outward on the shock ring.
 */
function Motes({ clock }: { clock: RefObject<FilmClock> }) {
  const COUNT = 260;
  const points = useMemo(
    () =>
      pool(
        COUNT,
        /* glsl */ `
        uniform float strength;
        varying float vLife;
        void main() {
          float d = length(gl_PointCoord - 0.5);
          float a = smoothstep(0.5, 0.1, d) * strength * vLife;
          gl_FragColor = vec4(vec3(1.0, 0.9, 0.74) * a * 1.4, a);
        }
      `,
        70,
      ),
    [],
  );
  const seeds = useMemo(() => {
    const r = rng(19);
    const base = new Float32Array(COUNT * 3);
    const drift = new Float32Array(COUNT * 4);
    for (let i = 0; i < COUNT; i++) {
      base[i * 3] = D_POINT.x + (r() - 0.5) * 44;
      base[i * 3 + 1] = D_POINT.y + (r() - 0.5) * 14;
      base[i * 3 + 2] = D_POINT.z + (r() - 0.5) * 14;
      drift[i * 4] = 0.3 + r() * 0.6;
      drift[i * 4 + 1] = r() * Math.PI * 2;
      drift[i * 4 + 2] = 0.4 + r() * 0.9;
      drift[i * 4 + 3] = 0.4 + r() * 0.6;
    }
    return { base, drift };
  }, []);
  /** The motes' own clock: it runs slower and slower as the pressure builds, till they hang. */
  const tau = useRef(0);
  useEffect(
    () => () => {
      points.geometry.dispose();
      (points.material as ShaderMaterial).dispose();
    },
    [points],
  );
  useFrame(() => {
    const c = clock.current;
    if (!c) return;
    const since = c.t - D_BOOM;
    const show = Math.max(c.d.pressure * 0.9, since > 0 && since < 2.4 ? 1 - since / 2.4 : 0) * smooth(9, 10.5, c.t);
    points.visible = c.d.on && show > 0.01;
    if (!points.visible) return;
    tau.current += c.dt * (1 - c.d.pressure * 0.97);
    const pos = points.geometry.attributes.position as BufferAttribute;
    const life = points.geometry.attributes.aLife as BufferAttribute;
    const size = points.geometry.attributes.aSize as BufferAttribute;
    const blast = since > 0 ? 1 - Math.exp(-since * 2.4) : 0;
    const { base, drift } = seeds;
    for (let i = 0; i < COUNT; i++) {
      const sp = drift[i * 4];
      const ph = drift[i * 4 + 1];
      let x = base[i * 3] + Math.sin(tau.current * sp + ph) * 1.4;
      let y = base[i * 3 + 1] + Math.sin(tau.current * sp * 0.7 + ph * 2) * 0.9 + tau.current * 0.15 * sp;
      let z = base[i * 3 + 2] + Math.cos(tau.current * sp + ph) * 1.4;
      if (blast > 0) {
        _v.set(x - clashPoint.x, y - clashPoint.y, z - clashPoint.z);
        const d = _v.length() || 1;
        _v.divideScalar(d).multiplyScalar((blast * 34) / (1 + d * 0.06));
        x += _v.x;
        y += _v.y;
        z += _v.z;
      }
      pos.setXYZ(i, x, y, z);
      life.setX(i, show * drift[i * 4 + 3]);
      size.setX(i, drift[i * 4 + 2] * (1 + blast * 0.6));
    }
    pos.needsUpdate = true;
    life.needsUpdate = true;
    size.needsUpdate = true;
  });
  return <primitive object={points} />;
}

/* ------------------------------------------------------------------- clash */

/** The impact: a white-gold burst, two shock rings of air tearing outward, and sparks riding them. */
function Impact({ clock, glow }: { clock: RefObject<FilmClock>; glow: Texture }) {
  const mats = useMemo(
    () => ({
      burst: new SpriteMaterial({ map: glow, color: "#fff1d6", blending: AdditiveBlending, transparent: true, depthWrite: false, opacity: 0 }),
      seam: new SpriteMaterial({ map: glow, color: "#fff6ea", blending: AdditiveBlending, transparent: true, depthWrite: false, opacity: 0 }),
      ring: new MeshBasicMaterial({ color: "#fff4e0", transparent: true, opacity: 0, blending: AdditiveBlending, depthWrite: false, side: DoubleSide }),
      ring2: new MeshBasicMaterial({ color: "#ffe2b0", transparent: true, opacity: 0, blending: AdditiveBlending, depthWrite: false, side: DoubleSide }),
    }),
    [glow],
  );
  const ringGeo = useMemo(() => new RingGeometry(0.94, 1, 128), []);
  const SPARKS = 240;
  const sparks = useMemo(
    () =>
      pool(
        SPARKS,
        /* glsl */ `
        uniform float strength;
        varying float vLife;
        void main() {
          float d = length(gl_PointCoord - 0.5);
          float a = smoothstep(0.5, 0.0, d) * strength * (1.0 - vLife);
          vec3 c = mix(vec3(1.0, 0.97, 0.88), vec3(1.0, 0.6, 0.2), vLife);
          gl_FragColor = vec4(c * a * 2.0, a);
        }
      `,
        110,
      ),
    [],
  );
  const dirs = useMemo(() => {
    const r = rng(23);
    const d = new Float32Array(SPARKS * 3);
    for (let i = 0; i < SPARKS; i++) {
      d[i * 3] = r() * Math.PI * 2;
      d[i * 3 + 1] = (r() - 0.5) * 0.5;
      d[i * 3 + 2] = 14 + r() * 26;
    }
    return d;
  }, []);
  useEffect(
    () => () => {
      Object.values(mats).forEach((m) => m.dispose());
      ringGeo.dispose();
      sparks.geometry.dispose();
      (sparks.material as ShaderMaterial).dispose();
    },
    [mats, ringGeo, sparks],
  );
  const burst = useRef<Sprite>(null);
  const ring = useRef<Mesh>(null);
  const ring2 = useRef<Mesh>(null);
  const light = useRef<PointLight>(null);
  const centre = useRef<Group>(null);
  const { camera } = useThree();
  const right = useMemo(() => new Vector3(), []);
  const up = useMemo(() => new Vector3(), []);
  useFrame(() => {
    const c = clock.current;
    if (!c) return;
    const d = c.t - D_BOOM;
    const f = c.d.flash;
    centre.current?.position.copy(clashPoint);
    mats.burst.opacity = f;
    if (burst.current) burst.current.scale.setScalar(5 + f * 40);
    const shock = (m: Mesh | null, mat: MeshBasicMaterial, delay: number, speed: number, life: number, peak: number) => {
      if (!m) return;
      const e = d - delay;
      const on = e > 0 && e < life;
      m.visible = on;
      if (!on) return;
      m.scale.setScalar(1 + e * speed);
      m.lookAt(camera.position);
      mat.opacity = Math.pow(1 - e / life, 2) * peak;
    };
    shock(ring.current, mats.ring, 0, 42, 1.5, 0.55);
    shock(ring2.current, mats.ring2, 0.13, 30, 1.7, 0.3);
    if (light.current) light.current.intensity = f * 1100;

    // Sparks fly out in the plane facing us, so they ride the rings.
    sparks.visible = d > 0 && d < 1.6;
    if (sparks.visible) {
      right.setFromMatrixColumn(camera.matrixWorld, 0);
      up.setFromMatrixColumn(camera.matrixWorld, 1);
      const pos = sparks.geometry.attributes.position as BufferAttribute;
      const life = sparks.geometry.attributes.aLife as BufferAttribute;
      const size = sparks.geometry.attributes.aSize as BufferAttribute;
      const go = 1 - Math.exp(-d * 2.6);
      for (let i = 0; i < SPARKS; i++) {
        const a = dirs[i * 3];
        const dist = (dirs[i * 3 + 2] * go) / 2.6;
        const ca = Math.cos(a);
        const sa = Math.sin(a);
        pos.setXYZ(
          i,
          clashPoint.x + (right.x * ca + up.x * sa) * dist,
          clashPoint.y + (right.y * ca + up.y * sa) * dist - d * d * 1.5,
          clashPoint.z + (right.z * ca + up.z * sa) * dist + dirs[i * 3 + 1] * dist,
        );
        life.setX(i, Math.min(1, d / 1.6));
        size.setX(i, 0.5 + (i % 5) * 0.12);
      }
      pos.needsUpdate = true;
      life.needsUpdate = true;
      size.needsUpdate = true;
    }
  });
  return (
    <group>
      <primitive object={sparks} />
      <group ref={centre} position={clashPoint}>
        <sprite ref={burst} material={mats.burst} />
        <mesh ref={ring} geometry={ringGeo} material={mats.ring} visible={false} />
        <mesh ref={ring2} geometry={ringGeo} material={mats.ring2} visible={false} />
        <pointLight ref={light} color="#fff0d8" intensity={0} distance={90} decay={2} />
      </group>
    </group>
  );
}

/** The white-hot seam where the two beams lock. It sets where the clash goes off. */
function Seam({ clock, orange, mega, glow }: { clock: RefObject<FilmClock>; orange: DragonRig; mega: DragonRig; glow: Texture }) {
  const mat = useMemo(() => new SpriteMaterial({ map: glow, color: "#fff4e6", blending: AdditiveBlending, transparent: true, depthWrite: false, opacity: 0 }), [glow]);
  useEffect(() => () => mat.dispose(), [mat]);
  const sprite = useRef<Sprite>(null);
  useFrame(() => {
    const c = clock.current;
    const s = sprite.current;
    if (!c || !s) return;
    const u = duelT(c.t);
    if (c.d.on && u > D_FIRE_C[0] && u <= D_HIT) seamAt(orange, mega, u, c.t, clashPoint);
    const on = c.d.on ? Math.min(c.d.fireX, c.d.fireC) : 0;
    s.visible = on > 0.01;
    if (!s.visible) return;
    s.position.copy(clashPoint);
    const flick = 0.8 + Math.sin(c.t * 29) * 0.12 + Math.sin(c.t * 13) * 0.08;
    mat.opacity = on * flick;
    s.scale.setScalar((3 + on * 4) * flick);
  });
  return <sprite ref={sprite} material={mat} />;
}

const _s = new Vector3();
const _r = new Vector3();

/** One dragon and its jaw, aim and colours. Red and gold and heavy; white and silver, longer, thinner, glassy. */
const RED_BODY = {
  length: 22,
  radius: 0.78,
  rings: 150,
  back: "#6a0b0d",
  flank: "#b8191a",
  belly: "#e9b44c",
  mane: "#f2b93b",
  horn: "#efd9a2",
  claw: "#f3e2b3",
  eye: "#ffd23a",
  glassy: false,
  sway: 0.55,
  waves: 2.2,
  waveSpeed: 4.2,
  wind: 1,
};
const WHITE_BODY = {
  length: 28,
  radius: 0.56,
  rings: 180,
  back: "#cfd8e6",
  flank: "#eef3fa",
  belly: "#fbf6e8",
  mane: "#eaf6ff",
  horn: "#d9e4f2",
  claw: "#e8eef6",
  eye: "#7fd8ff",
  glassy: true,
  sway: 0.32,
  waves: 1.6,
  waveSpeed: 2.4,
  wind: 0.75,
};

/** Each beam open from its start, held through the frozen beat, cut by the blast. */
const firing = (u: number, from: number) => smooth(from, from + 0.12, u) * (1 - smooth(D_HIT, D_HIT + 0.12, u));

/**
 * Both dragons, flown by duel.ts. Their bodies trail the path their heads have flown, so the
 * red one, placed on the screen for its break out of the top and its return close up in the
 * corner, is worked out here against the camera.
 */
function Dragons({ clock, rigs, scales }: { clock: RefObject<FilmClock>; rigs: { red: DragonRig; white: DragonRig }; scales: Texture }) {
  const camera = useThree((s) => s.camera);
  const looks = useMemo(() => {
    const redAt = (u: number, out: Vector3) => {
      amberAt(u, out);
      const w = amberScreenW(u);
      if (w <= 0) return out;
      amberScreenAt(u, _s);
      _r.set(_s.x, _s.y, 0.5).unproject(camera).sub(camera.position).normalize();
      return out.lerp(_s.copy(camera.position).addScaledVector(_r, _s.z), w);
    };
    const redHead = (t: number, out: Vector3) => redAt(duelT(t), out);
    const whiteHead = (t: number, out: Vector3) => obsidianAt(duelT(t), out);
    const red: DragonLook = {
      ...RED_BODY,
      head: redHead,
      // Open roaring as they meet, then wide on its beam.
      jaw: (t) => {
        const u = duelT(t);
        return Math.max(window01(u, [13.35, 14.1], 0.2) * 0.75, firing(u, D_FIRE_C[0]));
      },
      // Turned on the other from the meeting on, except while it breaks away.
      aim: (t) => {
        const u = duelT(t);
        return smooth(12.6, 13.2, u) * (1 - window01(u, [D_EXIT[0], D_EXIT[1] + 0.2], 0.25));
      },
      aimAt: whiteHead,
    };
    const white: DragonLook = {
      ...WHITE_BODY,
      head: whiteHead,
      jaw: (t) => firing(duelT(t), D_FIRE_X[0]),
      aim: (t) => smooth(12.6, 13.2, duelT(t)),
      aimAt: redHead,
    };
    return { red, white };
  }, [camera]);
  const redGroup = useRef<Group>(null);
  const all = useRef<Group>(null);
  useFrame(() => {
    const c = clock.current;
    if (!c) return;
    if (all.current) all.current.visible = c.d.on;
    // Off screen while it jumps from the top to below the corner.
    if (redGroup.current) redGroup.current.visible = !amberHidden(duelT(c.t));
  });
  return (
    <group ref={all}>
      <group ref={redGroup}>
        <Dragon look={looks.red} clock={clock} rig={rigs.red} scales={scales} />
      </group>
      <Dragon look={looks.white} clock={clock} rig={rigs.white} scales={scales} />
    </group>
  );
}

/** The whole duel: both dragons, their beams, the dust between them and the impact. */
export function DragonDuel({ clock, glow, scales }: { clock: RefObject<FilmClock>; glow: Texture; scales: Texture }) {
  const rigs = useMemo(() => ({ red: makeRig(), white: makeRig() }), []);
  return (
    <>
      <Dragons clock={clock} rigs={rigs} scales={scales} />
      <Beam clock={clock} me={rigs.white} foe={rigs.red} orange={rigs.red} mega={rigs.white} fire="x" glow={glow} />
      <Beam clock={clock} me={rigs.red} foe={rigs.white} orange={rigs.red} mega={rigs.white} fire="c" glow={glow} />
      <Seam clock={clock} orange={rigs.red} mega={rigs.white} glow={glow} />
      <Motes clock={clock} />
      <Impact clock={clock} glow={glow} />
    </>
  );
}
