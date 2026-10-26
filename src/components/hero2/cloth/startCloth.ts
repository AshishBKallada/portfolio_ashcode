import { viewFor, type View } from "./camera";
import { ClothRenderer } from "./renderer";
import { CLOTH_IMAGE } from "./settings";
import { ClothSim } from "./simulation";

export type ClothClasses = { noCloth: string; over: string; held: string };

/**
 * Runs the cloth on the canvas: sizes it to the hero, simulates and draws
 * only while the hero is on screen and the tab visible, and lets it be
 * grabbed with mouse or finger. Any failure (no WebGL, a shader, the image,
 * a lost context) adds `classes.noCloth` to the hero, which shows the still
 * instead. Returns the teardown.
 */
export function startCloth(host: HTMLElement, el: HTMLCanvasElement, classes: ClothClasses): () => void {
  const fail = () => host.classList.add(classes.noCloth);

  const gl = el.getContext("webgl", {
    alpha: true,
    antialias: true,
    premultipliedAlpha: true,
    powerPreference: "high-performance",
  });
  if (!gl) {
    fail();
    return () => {};
  }
  let renderer: ClothRenderer;
  try {
    renderer = new ClothRenderer(gl);
  } catch {
    fail();
    return () => {};
  }
  const sim = new ClothSim();
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  sim.calm = motion.matches;
  const onMotion = () => (sim.calm = motion.matches);
  motion.addEventListener("change", onMotion);

  let view: View = viewFor(host.clientWidth || 1, host.clientHeight || 1);
  let raf = 0;
  let last = 0;
  let onScreen = true;
  let lost = false;

  const frame = () => gl && renderer.draw(sim.pos, sim.normal, view, el.width, el.height);
  const resize = () => {
    const w = host.clientWidth;
    const h = host.clientHeight;
    if (!w || !h) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    el.width = Math.round(w * dpr);
    el.height = Math.round(h * dpr);
    view = viewFor(w, h);
    if (!lost) frame();
  };
  const tick = (now: number) => {
    raf = 0;
    if (lost) return;
    const seconds = last ? (now - last) / 1000 : 0;
    last = now;
    sim.advance(seconds, view);
    frame();
    schedule();
  };
  const schedule = () => {
    if (!raf && onScreen && !document.hidden && !lost) raf = requestAnimationFrame(tick);
  };
  const pause = () => {
    cancelAnimationFrame(raf);
    raf = 0;
    last = 0;
  };

  const img = new Image();
  img.crossOrigin = "anonymous";
  img.onload = () => {
    if (lost) return;
    renderer.setImage(img);
    frame();
  };
  img.onerror = fail;
  img.src = CLOTH_IMAGE;

  const onLost = (e: Event) => {
    e.preventDefault();
    lost = true;
    pause();
    fail();
  };
  el.addEventListener("webglcontextlost", onLost);

  const ro = new ResizeObserver(resize);
  ro.observe(host);
  window.addEventListener("resize", resize);
  const io = new IntersectionObserver(([entry]) => {
    onScreen = entry.isIntersecting;
    if (onScreen) schedule();
    else pause();
  });
  io.observe(host);
  const onVisibility = () => (document.hidden ? pause() : schedule());
  document.addEventListener("visibilitychange", onVisibility);

  // Grabbing.
  const rect = () => el.getBoundingClientRect();
  let pointerId: number | null = null;
  const onDown = (e: PointerEvent) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    const r = rect();
    const picked = sim.pick(e.clientX, e.clientY, r, view);
    if (!picked) return;
    sim.hold(picked, e.clientX, e.clientY, r, view);
    pointerId = e.pointerId;
    el.setPointerCapture(e.pointerId);
    el.classList.add(classes.held);
    schedule();
  };
  const onMove = (e: PointerEvent) => {
    const r = rect();
    if (sim.holding && e.pointerId === pointerId) sim.move(e.clientX, e.clientY, r, view);
    else if (e.pointerType === "mouse") el.classList.toggle(classes.over, !!sim.pick(e.clientX, e.clientY, r, view));
  };
  const onUp = () => {
    if (!sim.holding) return;
    sim.release();
    pointerId = null;
    el.classList.remove(classes.held);
  };
  const onLeave = () => el.classList.remove(classes.over);
  // The page still scrolls everywhere off the cloth.
  const onTouchStart = (e: TouchEvent) => {
    const t = e.touches[0];
    if (t && sim.pick(t.clientX, t.clientY, rect(), view)) e.preventDefault();
  };
  const onTouchMove = (e: TouchEvent) => {
    if (sim.holding) e.preventDefault();
  };
  el.addEventListener("pointerdown", onDown);
  el.addEventListener("pointermove", onMove);
  el.addEventListener("pointerup", onUp);
  el.addEventListener("pointercancel", onUp);
  el.addEventListener("lostpointercapture", onUp);
  el.addEventListener("pointerleave", onLeave);
  el.addEventListener("touchstart", onTouchStart, { passive: false });
  el.addEventListener("touchmove", onTouchMove, { passive: false });

  resize();
  schedule();

  return () => {
    pause();
    ro.disconnect();
    io.disconnect();
    window.removeEventListener("resize", resize);
    document.removeEventListener("visibilitychange", onVisibility);
    motion.removeEventListener("change", onMotion);
    el.removeEventListener("webglcontextlost", onLost);
    el.removeEventListener("pointerdown", onDown);
    el.removeEventListener("pointermove", onMove);
    el.removeEventListener("pointerup", onUp);
    el.removeEventListener("pointercancel", onUp);
    el.removeEventListener("lostpointercapture", onUp);
    el.removeEventListener("pointerleave", onLeave);
    el.removeEventListener("touchstart", onTouchStart);
    el.removeEventListener("touchmove", onTouchMove);
    img.onload = null;
    img.onerror = null;
  };
}
