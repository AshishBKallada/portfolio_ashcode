"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { planeAnchor } from "@/lib/planeAnchor";
import { site } from "@/data/site";

/*
 * The LinkedIn posts on a strip of black film hung from the parked plane's belly (planeAnchor).
 * It drops past the right of the courier's head and under his reaching arm at the armband, runs
 * left across the front of his chest at shoulder height, above the suitcase, and waves down
 * beside him and away out through the bottom left corner of the screen.
 * Far off at the plane it is small; it comes toward us as it goes, so it is several times larger
 * at the corner. It turns gently toward us and away along its length, the wind keeps it stirring,
 * and the posts run along it from the plane down toward us.
 *
 * Depth around him: the film is drawn twice from one shape, in two canvases. The part up to the
 * arm goes in `back`, a layer under the courier; the rest in this component's own canvas, above
 * him. Hover and click still work: over the film, a small link follows the pointer, marked with
 * the post under it, so the hover preview opens and a click goes to the profile. Wide screens
 * only (as the plane); the plain marquee in PostsRail stays for phones and screen readers.
 */

const posts = site.signal.linkedin.posts.map((post) => post.src);
const linkedin = site.socials.find((s) => s.label === "LinkedIn")?.href ?? "https://www.linkedin.com";

// One frame of film: 84px across, 90px along, the picture 60 by 80 between the sprocket bands.
const CELL_W = 84;
const CELL_H = 90;
const BAND = 12;
const SHOT = { x: 12, y: 5, w: 60, h: 80 };
const SET = CELL_H * posts.length;
const TEX_W = 256;
const TEX_H = 2048;
/** Seconds for one set of posts to run past, as the marquee does. */
const RUN_S = 46;
/** Eye distance for the perspective, in CSS px. */
const EYE = 1400;
const SAMPLES = 220;
/**
 * The film's way after the plane. Each point has a depth `z` (px; less is further) and a place:
 * `on` him, as fractions of the courier's picture ([data-courier-frame], so it follows him as he
 * drifts with the pointer, tilts and bobs), and/or `at` a fixed spot, as fractions of the hero.
 * `stick` blends the two: 1 rides with him, 0 stays put, so the film hugs his arms and chest and
 * eases out to the fixed corner. Past SPLIT (a share of the length: where it has come out from
 * under his arm) the film is drawn in front of him.
 */
type Point = { on?: [number, number]; at?: [number, number]; stick: number; z: number };
const PATH: Point[] = [
  { on: [0.622, 0.226], stick: 1, z: -760 }, // down past the right of his head
  { on: [0.628, 0.445], stick: 1, z: -520 }, // out through the gap under his reaching arm
  { on: [0.434, 0.373], stick: 1, z: -330 }, // across the front of his chest at shoulder height
  { on: [0.225, 0.355], stick: 1, z: -190 }, // on over his case arm, above the suitcase
  { on: [0.103, 0.564], stick: 1, z: -40 }, // then a long easy wave down beside him, left of the case
  { on: [-0.033, 0.891], at: [0.3, 0.79], stick: 0.5, z: 160 },
  { on: [-0.267, 1.125], at: [0.15, 0.92], stick: 0.2, z: 400 },
  { at: [-0.06, 1.14], stick: 0, z: 700 }, // out through the bottom left corner, close to us
];
const TIE_Z = -1000;
const SPLIT = 0.25;

const VERT = `
attribute vec3 aPos;
attribute vec3 aNor;
attribute vec2 aUV;
uniform vec2 uSize;
uniform float uEye;
uniform float uOffset;
varying vec3 vN;
varying vec2 vT;
void main() {
  vec2 c = uSize * 0.5;
  float s = uEye / max(uEye - aPos.z, 1.0);
  vec2 sp = c + (aPos.xy - c) * s;
  gl_Position = vec4(sp.x / uSize.x * 2.0 - 1.0, 1.0 - sp.y / uSize.y * 2.0, -aPos.z / 4000.0, 1.0);
  vN = aNor;
  vT = vec2(aUV.x, aUV.y + uOffset);
}`;

const FRAG = `
precision highp float;
uniform sampler2D uTex;
uniform float uHover;
varying vec3 vN;
varying vec2 vT;
void main() {
  vec3 n = normalize(vN);
  bool back = n.z < 0.0;
  if (back) n = -n;
  // Light from the upper left, as the painting's sun (y runs down the screen).
  vec3 KEY = normalize(vec3(-0.42, -0.45, 0.79));
  float nl = max(dot(n, KEY), 0.0);
  vec3 print = pow(texture2D(uTex, vT).rgb, vec3(2.2));
  // The posts sit greyed and a little dim, as in the plain strip; the one under the pointer
  // shows in full colour. Done here, so hovering never repaints the texture.
  float cell = floor(fract(vT.y) * ${posts.length}.0);
  if (abs(cell - uHover) > 0.5) print = mix(print, vec3(dot(print, vec3(0.2126, 0.7152, 0.0722))), 0.6) * 0.72;
  float shade = 0.46 + 0.68 * nl;
  vec3 R = reflect(vec3(0.0, 0.0, -1.0), n);
  float sheen = pow(max(dot(R, KEY), 0.0), 24.0);
  vec3 col = print * shade + vec3(0.14) * sheen;
  if (back) col = print * shade * 0.55;
  gl_FragColor = vec4(pow(col, vec3(1.0 / 2.2)), 1.0);
}`;

type V3 = [number, number, number];

function catmull(p: V3[], t: number): V3 {
  const n = p.length - 1;
  const f = Math.min(n - 1e-6, Math.max(0, t * n));
  const i = Math.floor(f);
  const u = f - i;
  const p0 = p[Math.max(0, i - 1)];
  const p1 = p[i];
  const p2 = p[i + 1];
  const p3 = p[Math.min(n, i + 2)];
  const out: V3 = [0, 0, 0];
  for (let k = 0; k < 3; k++) {
    out[k] =
      0.5 *
      (2 * p1[k] +
        (-p0[k] + p2[k]) * u +
        (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * u * u +
        (-p0[k] + 3 * p1[k] - 3 * p2[k] + p3[k]) * u * u * u);
  }
  return out;
}

/** One canvas the film is drawn into: its own GL context, buffers and copy of the texture. */
function makeLayer(canvas: HTMLCanvasElement, count: number, indices: Uint16Array) {
  const gl = canvas.getContext("webgl", { alpha: true, antialias: true, premultipliedAlpha: true });
  if (!gl) return null;
  const compile = (type: number, src: string) => {
    const sh = gl.createShader(type)!;
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    return gl.getShaderParameter(sh, gl.COMPILE_STATUS) ? sh : null;
  };
  const vs = compile(gl.VERTEX_SHADER, VERT);
  const fs = compile(gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) return null;
  const prog = gl.createProgram()!;
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
  gl.useProgram(prog);
  const uSize = gl.getUniformLocation(prog, "uSize");
  const uEye = gl.getUniformLocation(prog, "uEye");
  const uOffset = gl.getUniformLocation(prog, "uOffset");
  const uHover = gl.getUniformLocation(prog, "uHover");

  const ib = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ib);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
  const attrib = (name: string, size: number) => {
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, count * 2 * size * 4, gl.DYNAMIC_DRAW);
    const loc = gl.getAttribLocation(prog, name);
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0);
    return buf;
  };
  const posBuf = attrib("aPos", 3);
  const norBuf = attrib("aNor", 3);
  const uvBuf = attrib("aUV", 2);
  const tex = gl.createTexture();
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);
  gl.clearColor(0, 0, 0, 0);

  let W = 0;
  let H = 0;
  return {
    resize() {
      W = canvas.clientWidth;
      H = canvas.clientHeight;
      // 1.25 at most: two full-screen canvases every frame; sharper buys little on a moving strip
      // and costs GPU memory the courier and the desert need more.
      const dpr = Math.min(window.devicePixelRatio || 1, 1.25);
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
    },
    upload(film: HTMLCanvasElement) {
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, film);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
      gl.generateMipmap(gl.TEXTURE_2D);
    },
    clear() {
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    },
    /** Draw the cells from sample `from` to sample `to`. */
    draw(pos: Float32Array, nor: Float32Array, uv: Float32Array, offset: number, hover: number, from: number, to: number) {
      gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, pos);
      gl.bindBuffer(gl.ARRAY_BUFFER, norBuf);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, nor);
      gl.bindBuffer(gl.ARRAY_BUFFER, uvBuf);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, uv);
      gl.uniform2f(uSize, W, H);
      gl.uniform1f(uEye, EYE);
      gl.uniform1f(uOffset, offset);
      gl.uniform1f(uHover, hover);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      if (to > from) gl.drawElements(gl.TRIANGLES, (to - from) * 6, gl.UNSIGNED_SHORT, from * 6 * 2);
    },
  };
}

export function FilmRibbon({ back }: { back: HTMLElement | null }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const backRef = useRef<HTMLCanvasElement>(null);
  const hitRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const backCanvas = backRef.current;
    const hit = hitRef.current;
    if (!canvas || !backCanvas || !hit) return;

    const N = SAMPLES;
    const indices: number[] = [];
    for (let i = 0; i < N - 1; i++) {
      const a = i * 2;
      indices.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
    }
    const index = new Uint16Array(indices);
    const front = makeLayer(canvas, N, index);
    const behind = makeLayer(backCanvas, N, index);
    if (!front || !behind) return;
    const layers = [front, behind];

    // ---- The film: black stock, sprocket holes down both edges, the posts between. ----
    const film = document.createElement("canvas");
    film.width = TEX_W;
    film.height = TEX_H;
    const ctx = film.getContext("2d")!;
    const shots = posts.map((src) => {
      const img = new Image();
      img.decoding = "async";
      img.src = src;
      return img;
    });
    const paint = () => {
      ctx.setTransform(TEX_W / CELL_W, 0, 0, TEX_H / SET, 0, 0);
      ctx.fillStyle = "#0b0b0b";
      ctx.fillRect(0, 0, CELL_W, SET);
      // A perforation every 10px: a small rectangle with softened corners, as on 35mm stock.
      ctx.fillStyle = "rgba(243, 234, 216, 0.85)";
      for (let y = 0; y < SET; y += 10) {
        for (const x of [3, CELL_W - BAND + 3]) {
          ctx.beginPath();
          ctx.roundRect(x, y + 3, 6, 4, 1);
          ctx.fill();
        }
      }
      shots.forEach((img, i) => {
        if (!img.complete || !img.naturalWidth) return;
        const y = i * CELL_H + SHOT.y;
        const scale = Math.max(SHOT.w / img.naturalWidth, SHOT.h / img.naturalHeight);
        const sw = SHOT.w / scale;
        const sh = SHOT.h / scale;
        ctx.drawImage(img, (img.naturalWidth - sw) / 2, (img.naturalHeight - sh) / 2, sw, sh, SHOT.x, y, SHOT.w, SHOT.h);
      });
      for (const layer of layers) layer.upload(film);
    };
    paint();
    for (const img of shots) img.addEventListener("load", paint);

    const pos = new Float32Array(N * 2 * 3);
    const nor = new Float32Array(N * 2 * 3);
    const uv = new Float32Array(N * 2 * 2);
    // What the pointer test needs, per sample: where the middle lands on screen, half the
    // film's seen width there, and how far along the film it is.
    const seenX = new Float32Array(N);
    const seenY = new Float32Array(N);
    const seenHalf = new Float32Array(N);
    const along = new Float32Array(N);

    let W = 0;
    let H = 0;
    const resize = () => {
      W = canvas.clientWidth;
      H = canvas.clientHeight;
      for (const layer of layers) layer.resize();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const start = performance.now();
    let offset = 0;
    let frame = 0;
    let rect = canvas.getBoundingClientRect();
    let frameNo = 0;

    // A screen point at depth z, back into the film's space (the projection undone).
    const unproject = (sx: number, sy: number, z: number): V3 => {
      const k = (EYE - z) / EYE;
      return [W / 2 + (sx - W / 2) * k, H / 2 + (sy - H / 2) * k, z];
    };

    // Where the courier is this frame: his picture's middle, size and tilt, in client px, read
    // from two markers on its top corners, so every transform above it (the pointer drift, the
    // tilt, the idle bob, the reveal) is already in their positions; two reads a frame.
    const courierFrame = document.querySelector<HTMLElement>("[data-courier-frame]");
    const cornerA = courierFrame?.querySelector<HTMLElement>("[data-corner='a']");
    const cornerB = courierFrame?.querySelector<HTMLElement>("[data-corner='b']");
    const him = { x: 0, y: 0, w: 0, h: 0, cos: 1, sin: 0 };
    const findHim = () => {
      if (!courierFrame || !cornerA || !cornerB) return false;
      const a = cornerA.getBoundingClientRect();
      const b = cornerB.getBoundingClientRect();
      const dx = b.left - a.left;
      const dy = b.top - a.top;
      const w = Math.hypot(dx, dy);
      if (!w) return false;
      him.cos = dx / w;
      him.sin = dy / w;
      him.w = w;
      him.h = (courierFrame.offsetHeight * w) / courierFrame.offsetWidth;
      // From the top left corner, half across and half down, along his tilt.
      him.x = a.left + (w / 2) * him.cos - (him.h / 2) * him.sin;
      him.y = a.top + (w / 2) * him.sin + (him.h / 2) * him.cos;
      return true;
    };

    const build = (t: number) => {
      const wob = reduce ? 0 : 1;
      // Client px to the canvas's own px (the hero may be scaled as it reveals).
      const k = rect.width / W || 1;
      const found = findHim();
      const pts: V3[] = [unproject((planeAnchor.x - rect.left) / k, (planeAnchor.y - rect.top) / k, TIE_Z)];
      PATH.forEach(({ on, at, stick, z }, i) => {
        let x = at ? at[0] * W : 0;
        let y = at ? at[1] * H : 0;
        if (on && found) {
          const lx = (on[0] - 0.5) * him.w;
          const ly = (on[1] - 0.5) * him.h;
          const ox = (him.x + lx * him.cos - ly * him.sin - rect.left) / k;
          const oy = (him.y + lx * him.sin + ly * him.cos - rect.top) / k;
          const w = at ? stick : 1;
          x = x * (1 - w) + ox * w;
          y = y * (1 - w) + oy * w;
        }
        // The wind: the free end drifts most; where it hugs him, barely, so it stays under his arm.
        const free = (i < PATH.length - 1 ? wob : 0) * (1 - 0.75 * stick);
        const dx = 12 * Math.sin(t * (0.6 - i * 0.04) + i) * free;
        const dy = 8 * Math.cos(t * (0.5 + i * 0.05) + i * 2) * free;
        const dz = 30 * Math.sin(t * (0.7 - i * 0.03) + i) * free;
        pts.push(unproject(x + dx, y + dy, z + dz));
      });
      let len = 0;
      let prev: V3 | null = null;
      for (let i = 0; i < N; i++) {
        const s = i / (N - 1);
        const c = catmull(pts, s);
        const ahead = catmull(pts, Math.min(1, s + 1 / N));
        const behindPt = catmull(pts, Math.max(0, s - 1 / N));
        let tx = ahead[0] - behindPt[0];
        let ty = ahead[1] - behindPt[1];
        let tz = ahead[2] - behindPt[2];
        const tl = Math.hypot(tx, ty, tz) || 1;
        tx /= tl;
        ty /= tl;
        tz /= tl;
        // Across the film in the screen's plane, and out of it; the twist turns between them.
        let nx = -ty;
        let ny = tx;
        const nl = Math.hypot(nx, ny) || 1;
        nx /= nl;
        ny /= nl;
        const ox = -tz * ny;
        const oy = tz * nx;
        const oz = tx * ny - ty * nx;
        // A gentle wave along its length, turning a little toward us and away, drifting in the wind.
        const twist = 0.8 * Math.sin(Math.PI * 2 * s + 0.35) + 0.3 * Math.sin(1.2 * t + 4 * s) * wob;
        const cw = Math.cos(twist);
        const sw = Math.sin(twist);
        const wx = cw * nx + sw * ox;
        const wy = cw * ny + sw * oy;
        const wz = sw * oz;
        const half = CELL_W / 2;
        const a = i * 6;
        pos[a] = c[0] - wx * half;
        pos[a + 1] = c[1] - wy * half;
        pos[a + 2] = c[2] - wz * half;
        pos[a + 3] = c[0] + wx * half;
        pos[a + 4] = c[1] + wy * half;
        pos[a + 5] = c[2] + wz * half;
        // The face's normal: along the film, crossed with across it.
        let fx = ty * wz - tz * wy;
        let fy = tz * wx - tx * wz;
        let fz = tx * wy - ty * wx;
        const fl = Math.hypot(fx, fy, fz) || 1;
        fx /= fl;
        fy /= fl;
        fz /= fl;
        nor[a] = nor[a + 3] = fx;
        nor[a + 1] = nor[a + 4] = fy;
        nor[a + 2] = nor[a + 5] = fz;
        if (prev) len += Math.hypot(c[0] - prev[0], c[1] - prev[1], c[2] - prev[2]);
        prev = c;
        along[i] = len;
        const v = len / SET;
        uv[i * 4] = 0;
        uv[i * 4 + 1] = v;
        uv[i * 4 + 2] = 1;
        uv[i * 4 + 3] = v;
        // Seen on screen, for the pointer.
        const k = EYE / (EYE - c[2]);
        seenX[i] = W / 2 + (c[0] - W / 2) * k;
        seenY[i] = H / 2 + (c[1] - H / 2) * k;
        seenHalf[i] = Math.hypot(wx * half * k, wy * half * k);
      }
    };

    const split = Math.round(SPLIT * (N - 1));
    /** The post under the pointer, or -1. */
    let over = -1;
    const tick = () => {
      frame = requestAnimationFrame(tick);
      // The plain strip in PostsRail steps aside only while the film is actually up.
      const up = planeAnchor.ok;
      if (up !== (document.documentElement.dataset.ribbon === "on")) {
        if (up) document.documentElement.dataset.ribbon = "on";
        else delete document.documentElement.dataset.ribbon;
      }
      if (!up) {
        for (const layer of layers) layer.clear();
        return;
      }
      if (frameNo++ % 30 === 0) rect = canvas.getBoundingClientRect();
      const t = (performance.now() - start) / 1000;
      // The posts run from the plane down toward us.
      offset = reduce ? 0 : -(t / RUN_S);
      build(t);
      // Behind him up to the gap, in front from there; one cell of overlap so no seam shows.
      behind.draw(pos, nor, uv, offset, over, 0, split + 1);
      front.draw(pos, nor, uv, offset, over, split, N - 1);
    };
    frame = requestAnimationFrame(tick);

    // ---- The pointer: which post (if any) is under it. ----
    const show = (i: number, x: number, y: number) => {
      hit.style.transform = `translate3d(${x - 14}px, ${y - 14}px, 0)`;
      hit.style.display = "block";
      if (i === over) return;
      over = i;
      hit.dataset.previewIndex = String(i);
      hit.setAttribute("aria-label", `LinkedIn post ${i + 1}`);
      hit.dispatchEvent(new PointerEvent("pointerover", { bubbles: true }));
    };
    const hide = () => {
      if (over === -1) return;
      over = -1;
      hit.dispatchEvent(new PointerEvent("pointerout", { bubbles: true, relatedTarget: document.body }));
      hit.style.display = "none";
    };
    const onMove = (e: PointerEvent) => {
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      let best = -1;
      let bestD = Infinity;
      for (let i = 0; i < N; i += 2) {
        const d = Math.hypot(seenX[i] - x, seenY[i] - y);
        if (d < bestD) {
          bestD = d;
          best = i;
        }
      }
      if (best < 0 || bestD > seenHalf[best] + 3 || !planeAnchor.ok) return hide();
      const v = along[best] / SET + offset;
      const cell = Math.floor((((v % 1) + 1) % 1) * posts.length);
      show(cell, x, y);
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    const lost = (e: Event) => {
      e.preventDefault();
      cancelAnimationFrame(frame);
      delete document.documentElement.dataset.ribbon;
    };
    canvas.addEventListener("webglcontextlost", lost);
    backCanvas.addEventListener("webglcontextlost", lost);

    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("webglcontextlost", lost);
      backCanvas.removeEventListener("webglcontextlost", lost);
      for (const img of shots) img.removeEventListener("load", paint);
      delete document.documentElement.dataset.ribbon;
    };
  }, [back]);

  return (
    <div className="pointer-events-none absolute inset-0">
      <canvas ref={ref} className="absolute inset-0 h-full w-full" aria-hidden="true" />
      {back ? createPortal(<canvas ref={backRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />, back) : null}
      {/* Follows the pointer over the film; marked with the post under it for the preview. */}
      <a
        ref={hitRef}
        href={linkedin}
        target="_blank"
        rel="noreferrer"
        className="sg-ribbon-hit"
        data-preview-kind="post"
        data-preview-index={0}
        tabIndex={-1}
        aria-label="LinkedIn post"
      />
    </div>
  );
}
