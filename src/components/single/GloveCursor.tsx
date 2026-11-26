"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

const MODEL = "/models/glove/glove.glb";
/** The canvas the glove is drawn in, in CSS pixels. */
const BOX = 78;

type Pointer = {
  x: number;
  y: number;
  dir: number;
  speed: number;
  hover: boolean;
  down: boolean;
  /** Where the front fingertip falls in the canvas, measured from the model. */
  hot: { x: number; y: number };
};

/** Shared between the DOM listeners and the render loop: plain data, not React state. */
const pointer: Pointer = { x: -200, y: -200, dir: 1, speed: 0, hover: false, down: false, hot: { x: BOX * 0.36, y: BOX * 0.9 } };
const cursor: { el: HTMLDivElement | null } = { el: null };

/**
 * The pointer as a 3D cartoon glove (scripts/blender/make_glove.py): white, puffy, three darts
 * on the back, a rolled cuff, standing on two fingers. Moving, the fingers walk like legs and
 * the hand bobs; it turns to face the way it goes; over anything clickable it lifts; pressing
 * squashes it. The click point is the front fingertip. Mouse only; reduced motion keeps the
 * system cursor.
 */
export function GloveCursor() {
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    cursor.el = el;
    document.documentElement.classList.add("has-glove");
    let lastX = 0;
    let lastT = performance.now();

    const onMove = (e: PointerEvent) => {
      const p = pointer;
      const now = performance.now();
      const dx = e.clientX - lastX;
      const dt = Math.max(1, now - lastT);
      lastX = e.clientX;
      lastT = now;
      p.x = e.clientX;
      p.y = e.clientY;
      p.speed = Math.min(1.6, Math.hypot(dx, e.movementY ?? 0) / dt);
      if (Math.abs(dx) > 1.5) p.dir = dx > 0 ? 1 : -1;
      p.hover = Boolean((e.target as Element).closest?.("a, button, [role='button'], summary, label[for]"));
      el.style.opacity = "1";
    };
    const onDown = () => (pointer.down = true);
    const onUp = () => (pointer.down = false);
    const onLeave = () => (el.style.opacity = "0");
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      cursor.el = null;
      document.documentElement.classList.remove("has-glove");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div ref={wrap} className="glove3d" aria-hidden style={{ width: BOX, height: BOX }}>
      <Canvas
        dpr={[1, 2]}
        gl={{ alpha: true, antialias: true }}
        camera={{ fov: 30, position: [0.55, 0.3, 4.7], near: 0.1, far: 30 }}
        frameloop="always"
      >
        <hemisphereLight args={["#ffffff", "#c9b89b", 1.6]} />
        <directionalLight position={[-3, 5, 4]} intensity={2.2} />
        <Suspense fallback={null}>
          <Glove />
        </Suspense>
      </Canvas>
    </div>
  );
}

function Glove() {
  const { scene } = useGLTF(MODEL);
  const { camera, size } = useThree();
  const root = useRef<THREE.Group>(null);

  // Cartoon shading: three flat bands of light, and a black inverted-hull outline round each part.
  const { model, index, middle, tip } = useMemo(() => {
    const m = scene.clone(true);
    const bands = new Uint8Array([90, 190, 255]);
    const ramp = new THREE.DataTexture(bands, bands.length, 1, THREE.RedFormat);
    ramp.minFilter = ramp.magFilter = THREE.NearestFilter;
    ramp.needsUpdate = true;
    const white = new THREE.MeshToonMaterial({ color: "#f7f5ef", gradientMap: ramp });
    const black = new THREE.MeshToonMaterial({ color: "#111111", gradientMap: ramp });
    const line = new THREE.MeshBasicMaterial({ color: "#111111", side: THREE.BackSide });
    const meshes: THREE.Mesh[] = [];
    m.traverse((o) => {
      if ((o as THREE.Mesh).isMesh) meshes.push(o as THREE.Mesh);
    });
    for (const mesh of meshes) {
      const dart = (mesh.material as THREE.Material).name === "GloveDart";
      mesh.material = dart ? black : white;
      if (dart) continue;
      const hull = new THREE.Mesh(mesh.geometry, line);
      hull.scale.setScalar(1.06);
      mesh.add(hull);
    }
    const index = m.getObjectByName("FingerIndex") ?? null;
    const middle = m.getObjectByName("FingerMiddle") ?? null;
    // The front fingertip, in the model's space: the lowest point of the index finger.
    const tip = new THREE.Vector3();
    if (index) {
      const box = new THREE.Box3().setFromObject(index);
      tip.set((box.min.x + box.max.x) / 2 - 0.05, box.min.y, (box.min.z + box.max.z) / 2);
    }
    return { model: m, index, middle, tip };
  }, [scene]);

  // The moving parts, held in refs so the render loop can pose them.
  const parts = useRef<{ index: THREE.Object3D | null; middle: THREE.Object3D | null; tip: THREE.Vector3; restI: number; restM: number }>(null);
  useEffect(() => {
    parts.current = { index, middle, tip, restI: index?.rotation.z ?? 0, restM: middle?.rotation.z ?? 0 };
  }, [index, middle, tip]);
  const phase = useRef(0);
  const face = useRef(1);
  const lift = useRef(0);
  const squash = useRef(0);
  const projected = useRef(new THREE.Vector3());

  useFrame((state, dt) => {
    const p = pointer;
    const g = root.current;
    const part = parts.current;
    if (!g || !part) return;
    // Walk: the step rate follows the pointer's speed, easing off to a stand.
    p.speed *= Math.pow(0.02, dt);
    const walking = Math.min(1, p.speed * 1.6);
    phase.current += dt * (6 + walking * 16) * walking;
    const swing = Math.sin(phase.current) * 0.5 * walking;
    if (part.index) part.index.rotation.z = part.restI + swing;
    if (part.middle) part.middle.rotation.z = part.restM - swing;
    const bob = Math.abs(Math.cos(phase.current)) * 0.08 * walking + Math.sin(state.clock.elapsedTime * 2) * 0.015;

    // Turn to face the way it walks: a quick squash through the middle, like a cartoon turn.
    face.current += (p.dir - face.current) * Math.min(1, dt * 14);
    lift.current += ((p.hover ? 1 : 0) - lift.current) * Math.min(1, dt * 12);
    squash.current += ((p.down ? 1 : 0) - squash.current) * Math.min(1, dt * 20);
    const s = 1 + lift.current * 0.12;
    g.scale.set(face.current * s * (1 + squash.current * 0.1), s * (1 - squash.current * 0.14), s);
    g.position.y = bob + lift.current * 0.12;
    g.rotation.z = -lift.current * 0.14 * face.current + swing * 0.08;

    // Keep the front fingertip under the real pointer.
    const v = projected.current.copy(part.tip).applyMatrix4(g.matrixWorld).project(camera);
    p.hot.x = ((v.x + 1) / 2) * size.width;
    p.hot.y = ((1 - v.y) / 2) * size.height;
    const el = cursor.el;
    if (el) el.style.transform = `translate3d(${p.x - p.hot.x}px, ${p.y - p.hot.y}px, 0)`;
  });

  return (
    <group ref={root}>
      {/* Upside down: fingers up, wrist down. The model stands on y=0 and is about 2.2 tall
          with its wrist; it's centred on the origin, where the camera looks, then turned over. */}
      <group rotation={[0, 0, Math.PI]}>
        <group position={[-0.1, -1.1, 0]}>
          <primitive object={model} />
        </group>
      </group>
    </group>
  );
}

useGLTF.preload(MODEL);
