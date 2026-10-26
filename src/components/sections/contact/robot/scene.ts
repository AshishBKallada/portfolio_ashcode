import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { ARM_REST, fallbackArm, normaliseArm } from "./arms";
import { studioEnvironment } from "./environment";
import { fallbackHead, mountHead, normaliseHead } from "./head";
import { prepareModel } from "./materials";
import { onThemeChange, readPalette } from "./palette";
import { glowTexture, shadowTexture } from "./textures";

const HEAD_GLB =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20261018_172206_0181329a-86e2-41c9-8ab8-c496f29aaa53.glb";
const ARM_GLB =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20261018_172137_cd6086ec-07ef-44dc-bd15-95a450ddaa8c.glb";
const FOV = 28;
/** The robot is drawn to fit this many units tall. */
const ROBOT_UNITS = 3.4;
const MOBILE = 860;

export type RobotEls = { host: HTMLElement; canvas: HTMLCanvasElement; copy: HTMLElement; loader: HTMLElement };

/**
 * The contact robot: a glossy head that turns toward the pointer, pupils that
 * follow it, two floating arms that bob. Drawn over the page's own colour (a
 * transparent canvas) with the theme's accent for eyes and lights, recoloured
 * when the theme switches. Returns the teardown.
 */
export function startRobot({ host, canvas, copy, loader }: RobotEls): () => void {
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  } catch {
    loader.remove();
    return () => {};
  }
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  let palette = readPalette();
  let glow = glowTexture(palette.accent);
  const scene = new THREE.Scene();
  let env = studioEnvironment(renderer, palette.page);
  scene.environment = env.texture;
  const hemi = new THREE.HemisphereLight(0xdcd8f0, palette.page.clone().multiplyScalar(0.25), 2.3);
  const key = new THREE.DirectionalLight(0xffffff, 0.55);
  key.position.set(-3, 4, 5);
  scene.add(hemi, key);
  const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 100);

  const robot = new THREE.Group();
  const body = new THREE.Group();
  const head = new THREE.Group();
  robot.add(body);
  body.add(head);
  scene.add(robot);

  const shadow = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1),
    new THREE.MeshBasicMaterial({ map: shadowTexture(), color: 0x000000, transparent: true, opacity: 0.28, depthWrite: false }),
  );
  shadow.position.set(0, -2.05, -0.6);
  shadow.scale.set(3.4, 0.42, 1);
  scene.add(shadow);

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const rims: THREE.ShaderMaterial[] = [];
  let eyes: ReturnType<typeof mountHead>["eyes"] | null = null;
  let antenna: ReturnType<typeof mountHead>["antenna"] | null = null;
  const arms: { group: THREE.Object3D; rest: (typeof ARM_REST)[number] }[] = [];
  let ready = false;
  let disposed = false;

  // Layout: where the robot sits and how big, from the section and its copy.
  let W = 1;
  let H = 1;
  let mobile = false;
  const anchor = { x: 0, y: 0 };
  const layout = () => {
    W = host.clientWidth;
    H = host.clientHeight;
    if (!W || !H) return;
    mobile = W <= MOBILE;
    renderer.setSize(W, H, false);
    let px: number;
    if (mobile) {
      const copyTop = copy.getBoundingClientRect().top - host.getBoundingClientRect().top;
      const room = Math.max(copyTop - 62, 220);
      px = Math.min(room * 0.92, W * 0.82);
      anchor.x = W / 2;
      anchor.y = 62 + room * 0.5;
    } else {
      px = Math.min(H * 0.62, W * 0.4, 640);
      anchor.x = W * 0.695;
      anchor.y = H * 0.5 + 8;
    }
    camera.aspect = W / H;
    camera.position.set(0, 0, (ROBOT_UNITS * H) / (px * 2 * Math.tan(THREE.MathUtils.degToRad(FOV / 2))));
    camera.setViewOffset(W, H, W / 2 - anchor.x, H / 2 - anchor.y, W, H);
    camera.updateProjectionMatrix();
    loader.style.left = `${anchor.x}px`;
    loader.style.top = `${anchor.y}px`;
  };
  const ro = new ResizeObserver(layout);
  ro.observe(host);
  layout();

  // Loading the models; stand-ins for any that fail.
  const gltf = new GLTFLoader();
  Promise.allSettled([gltf.loadAsync(HEAD_GLB), gltf.loadAsync(ARM_GLB)]).then(([h, a]) => {
    if (disposed) return;
    let headRoot: THREE.Object3D;
    if (h.status === "fulfilled") {
      headRoot = h.value.scene;
      normaliseHead(headRoot);
      rims.push(...prepareModel(headRoot, { glossy: true, tint: "#4a4a56", rim: { power: 4.5, strength: 0.32 } }, palette.accent));
    } else {
      const f = fallbackHead(palette.accent);
      headRoot = f.root;
      rims.push(...f.rims);
    }
    const mounted = mountHead(head, headRoot, palette.accent, glow);
    eyes = mounted.eyes;
    antenna = mounted.antenna;

    ARM_REST.forEach((rest, i) => {
      let group: THREE.Object3D;
      if (a.status === "fulfilled") {
        const copyOf = i === 0 ? a.value.scene : a.value.scene.clone(true);
        rims.push(...prepareModel(copyOf, { glossy: false, tint: "#1d1d23", smooth: true, rim: { power: 2.6, strength: 1.05 } }, palette.accent));
        group = normaliseArm(copyOf);
      } else {
        const f = fallbackArm(palette.accent);
        rims.push(f.rim);
        group = f.arm;
      }
      group.position.set(rest.x, rest.y, rest.z);
      group.rotation.z = rest.rz;
      body.add(group);
      arms.push({ group, rest });
    });
    loader.classList.add("opacity-0");
    robot.scale.setScalar(0.001);
    ready = true;
    schedule();
  });

  // The theme: page colour into the reflections, accent into eyes, lights and edges.
  const offTheme = onThemeChange(() => {
    palette = readPalette();
    const old = glow;
    glow = glowTexture(palette.accent);
    env.dispose();
    env = studioEnvironment(renderer, palette.page);
    scene.environment = env.texture;
    hemi.groundColor.copy(palette.page).multiplyScalar(0.25);
    rims.forEach((m) => m.uniforms.uColor.value.copy(palette.accent));
    eyes?.theme(palette.accent, glow);
    antenna?.theme(palette.accent, glow);
    old.dispose();
    if (!raf) render();
  });

  // Pointer, idle look-around and the frame loop.
  const target = { x: 0, y: 0 };
  const look = { x: 0, y: 0 };
  let lastMove = -Infinity;
  const onPointer = (x: number, y: number) => {
    const rx = mobile ? W * 0.5 : Math.max(W * 0.55, 500);
    const ry = mobile ? H * 0.5 : Math.max(H * 0.55, 400);
    const r = host.getBoundingClientRect();
    target.x = THREE.MathUtils.clamp((x - r.left - anchor.x) / rx, -1.2, 1.2);
    target.y = THREE.MathUtils.clamp((y - r.top - anchor.y) / ry, -1.2, 1.2);
    lastMove = performance.now();
  };
  const onMove = (e: PointerEvent) => onPointer(e.clientX, e.clientY);
  const onTouch = (e: TouchEvent) => e.touches[0] && onPointer(e.touches[0].clientX, e.touches[0].clientY);
  window.addEventListener("pointermove", onMove, { passive: true });
  window.addEventListener("pointerdown", onMove, { passive: true });
  window.addEventListener("touchmove", onTouch, { passive: true });

  const m = reduce ? 0.25 : 1;
  let intro = 0;
  let nextBlink = 2.5 + Math.random() * 3.5;
  let blinkAt = -1;
  let last = 0;
  let t = 0;
  let raf = 0;
  let onScreen = false;

  const render = () => renderer.render(scene, camera);
  const tick = (now: number) => {
    raf = 0;
    const dt = Math.min(last ? (now - last) / 1000 : 0, 0.05);
    last = now;
    t += dt;
    if (now - lastMove > 3500) {
      target.x = Math.sin(t * 0.45) * 0.45;
      target.y = Math.sin(t * 0.31 + 1.2) * 0.2;
    }
    const k = 1 - Math.pow(0.0025, dt);
    look.x += (target.x - look.x) * k;
    look.y += (target.y - look.y) * k;

    if (ready) {
      intro = Math.min(1, intro + dt * 1.4);
      const c = intro - 1;
      robot.scale.setScalar(Math.max(0.001, 1 + 2.4 * c * c * c + 1.4 * c * c));
    }
    const bob = Math.sin(t * 1.6) * 0.09 * m;
    robot.position.y = bob;
    head.rotation.set(look.y * 0.42, look.x * 0.5, -look.x * 0.06 + Math.sin(t * 1.1) * 0.015 * m);
    body.rotation.set(look.y * 0.12, look.x * 0.28, 0);
    for (const { group, rest } of arms) {
      const s = Math.sign(rest.x);
      const w = Math.sin(t * 2 + rest.phase);
      group.position.y = rest.y + w * 0.07 * m;
      group.position.x = rest.x + s * look.x * -0.04;
      group.rotation.z = rest.rz + w * 0.12 * s * m;
      group.rotation.x = Math.sin(t * 1.3 + rest.phase) * 0.08 * m;
    }
    if (eyes) {
      for (const p of eyes.pupils) {
        p.position.set(THREE.MathUtils.clamp(look.x * 0.075, -0.07, 0.07), THREE.MathUtils.clamp(-look.y * 0.06, -0.06, 0.06), 0);
      }
      if (blinkAt < 0 && t > nextBlink) blinkAt = t;
      let sy = 1;
      if (blinkAt >= 0) {
        const p = (t - blinkAt) / 0.32;
        if (p >= 1) {
          blinkAt = -1;
          nextBlink = t + 2.5 + Math.random() * 3.5;
        } else sy = p < 0.5 ? 1 - p * 2 * 0.92 : 0.08 + (p - 0.5) * 2 * 0.92;
      }
      for (const g of eyes.groups) g.scale.y = sy;
    }
    shadow.scale.set(3.4 - bob * 3, 0.42 - bob * 0.4, 1);
    (shadow.material as THREE.MeshBasicMaterial).opacity = 0.28 - bob * 0.6;
    if (antenna) for (const s of antenna.sprites) s.material.opacity = 0.5 * (0.85 + Math.sin(t * 1.6) * 0.15);
    render();
    schedule();
  };
  const schedule = () => {
    if (!raf && onScreen && !document.hidden && !disposed) raf = requestAnimationFrame(tick);
  };
  const pause = () => {
    cancelAnimationFrame(raf);
    raf = 0;
    last = 0;
  };
  const io = new IntersectionObserver(([e]) => {
    onScreen = e.isIntersecting;
    if (onScreen) schedule();
    else pause();
  });
  io.observe(host);
  const onVis = () => (document.hidden ? pause() : schedule());
  document.addEventListener("visibilitychange", onVis);

  return () => {
    disposed = true;
    pause();
    ro.disconnect();
    io.disconnect();
    offTheme();
    document.removeEventListener("visibilitychange", onVis);
    window.removeEventListener("pointermove", onMove);
    window.removeEventListener("pointerdown", onMove);
    window.removeEventListener("touchmove", onTouch);
    env.dispose();
    glow.dispose();
    scene.traverse((o) => {
      const mesh = o as THREE.Mesh;
      mesh.geometry?.dispose();
      const mat = mesh.material as THREE.Material | THREE.Material[] | undefined;
      (Array.isArray(mat) ? mat : mat ? [mat] : []).forEach((x) => x.dispose());
    });
    renderer.dispose();
  };
}
