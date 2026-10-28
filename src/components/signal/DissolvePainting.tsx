"use client";

import { useEffect, useRef } from "react";

/*
 * A painting that erodes in over the section ground as it scrolls into view,
 * after the reference's chapter change: a noise threshold eats the ground away
 * top first, the boundary flecked with light, and the painting arrives as
 * etched outlines (edge detection on its luminance) before it fills in. It is
 * graded and grained in the shader, so the scrim lives here too.
 * WebGL2; without it (or with reduced motion) the plain <img> under it shows.
 */

const VERT = `#version 300 es
in vec2 aPos;
out vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;

const FRAG = `#version 300 es
precision highp float;
uniform sampler2D uImage;
uniform vec2 uRes;
uniform float uImgAspect;
uniform float uProgress;
// Canvas height and the revealed depth below its top edge, in viewport heights.
uniform float uHeight;
uniform float uDepth;
// 1 when the canvas is pinned and uncovered from below: the erosion then runs bottom first.
uniform float uPinned;
uniform float uClear;
uniform float uTime;
uniform vec3 uGround;
uniform vec3 uNight;
in vec2 vUv;
out vec4 outColor;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}
float vnoise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y) * 2.0 - 1.0;
}
float fbm(vec2 p) {
  float s = 0.0, a = 0.5;
  for (int i = 0; i < 5; i++) { s += a * vnoise(p); p *= 2.03; a *= 0.5; }
  return s;
}

void main() {
  vec2 uv = vUv;
  float aspect = uRes.x / uRes.y;

  // object-fit: cover
  vec2 s = aspect > uImgAspect ? vec2(1.0, uImgAspect / aspect) : vec2(aspect / uImgAspect, 1.0);
  vec3 img = texture(uImage, (uv - 0.5) * s + 0.5).rgb;

  // The painting at full strength, as the hero's: night only in a band at the top (42%, gone
  // by 22% down) and at the foot (28%, gone by 30% up), as the CSS fallback.
  float scrim = max(0.42 * (1.0 - (1.0 - uv.y) / 0.22), 0.28 * (1.0 - uv.y / 0.30));
  vec3 painted = mix(img, uNight, clamp(scrim, 0.0, 1.0));

  // Etched outlines: the strong luminance edges only (not the canvas weave), while the painting arrives.
  float luma = dot(img, vec3(0.299, 0.587, 0.114));
  vec3 etched = mix(painted * 0.6, vec3(0.96, 0.94, 0.9), smoothstep(0.06, 0.25, fwidth(luma)));
  painted = mix(etched, painted, smoothstep(0.2, 0.75, uProgress));

  // The eroding threshold: top first, bowed a little at the centre, broken by noise.
  vec2 nuv = vec2(uv.x * aspect, uv.y);
  float n = fbm(nuv * 2.2 + vec2(0.0, uTime * 0.03));
  float speck = fbm(nuv * 18.0 - uTime * 0.05);
  // Depth below the canvas top in viewport heights, so the edge stays on screen as it scrolls in.
  float t = mix((1.0 - uv.y) * uHeight, uv.y, uPinned) + smoothstep(0.6, -0.4, abs(uv.x - 0.5)) * 0.08;
  t += n * 0.18 + speck * 0.04;
  float edge = uDepth - t;
  float aa = fwidth(edge) * 4.0;
  float reveal = smoothstep(-aa, aa, edge);

  vec3 col = mix(uGround, painted, reveal);

  // Light caught along the torn boundary, flecked by the fine noise.
  float glow = 1.0 - smoothstep(0.0, 0.012, abs(edge));
  col += glow * (0.35 + 0.65 * max(speck, 0.0)) * 0.7 * (1.0 - smoothstep(0.9, 1.0, uProgress));

  // Film grain over everything, so the ground and painting read as one print.
  col += (hash(uv * uRes + fract(uTime * 7.0) * 100.0) - 0.5) * 0.035;
  // Pinned, the uneroded ground is clear rather than ground-coloured, so whatever is
  // pinned behind (the hero, in the rail's column) shows until the painting arrives.
  float alpha = mix(1.0, clamp(reveal + glow, 0.0, 1.0), max(uPinned, uClear));
  outColor = vec4(col, alpha);
}`;

function hexToRgb(value: string, fallback: [number, number, number]): [number, number, number] {
  const m = value.trim().match(/^#([0-9a-f]{6})$/i);
  if (!m) return fallback;
  const n = parseInt(m[1], 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

export function DissolvePainting({
  src,
  ground = "--background",
  track,
  clear = false,
  className = "",
}: {
  /** The uneroded part is clear rather than ground-coloured, so whatever is behind shows until the painting arrives. */
  clear?: boolean;
  src: string;
  /** The CSS variable for the colour it erodes away: the page ground, or night after another painting. */
  ground?: string;
  /**
   * The id of the element whose entry drives the reveal, when the canvas is pinned
   * behind the section before it: its top rises as that section's panel lifts away.
   */
  track?: string;
  className?: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const gl = canvas.getContext("webgl2", { antialias: false, premultipliedAlpha: false });
    if (!gl) return;

    const compile = (type: number, source: string) => {
      const sh = gl.createShader(type)!;
      gl.shaderSource(sh, source);
      gl.compileShader(sh);
      return sh;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "aPos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const u = (name: string) => gl.getUniformLocation(prog, name);
    const [uRes, uImgAspect, uProgress, uHeight, uDepth, uPinned, uTime, uGround, uNight, uClear] = [
      "uRes",
      "uImgAspect",
      "uProgress",
      "uHeight",
      "uDepth",
      "uPinned",
      "uTime",
      "uGround",
      "uNight",
      "uClear",
    ].map(u);

    let raf = 0;
    let visible = false;
    let ready = false;
    const start = performance.now();
    // Read once: the theme's colours don't change under a running canvas.
    const css = getComputedStyle(document.documentElement);
    gl.uniform3fv(uGround, hexToRgb(css.getPropertyValue(ground), [0.867, 0.867, 0.82]));
    gl.uniform3fv(uNight, hexToRgb(css.getPropertyValue("--theme-night"), [0.082, 0.075, 0.059]));
    gl.uniform1f(uClear, clear ? 1 : 0);
    // The last frame drawn, so a scroll that leaves the reveal where it was draws nothing.
    let drawnP = -1;
    let drawnH = 0;

    const frame = () => {
      raf = 0;
      if (!visible || !ready) return;
      // Layout size, not getBoundingClientRect: the canvas sits in a layer that scales on scroll
      // (ScrollZoom and friends), and sizing to the scaled box reallocated the canvas every frame.
      // 1× is plenty for a grained painting, and the shader runs on a quarter of the pixels of 2×.
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      const trackEl = track ? document.getElementById(track) : null;
      const top = (trackEl ?? canvas).getBoundingClientRect().top;
      const resized = canvas.width !== w || canvas.height !== h;
      if (resized) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
      // 0 as the canvas top meets the viewport's bottom, 1 as it reaches the top. The
      // revealed depth trails the visible part (p² < p), so the edge is on screen
      // until the end, then runs past the canvas's foot.
      const vh = window.innerHeight;
      const p = Math.min(1, Math.max(0, (vh - top) / vh));
      const settled = p === 0 || p === 1;
      // Fully in (or not started) and already drawn so: the frame on screen is the same one.
      if (settled && p === drawnP && vh === drawnH && !resized) return;
      drawnP = p;
      drawnH = vh;
      // Pinned, the uncovered part runs up from the bottom to height p; the eroded edge
      // trails it a little, so the noise shows just under the lifting panel.
      const depth = trackEl ? p * 1.15 - 0.1 + Math.max(0, p - 0.85) * 2 : p * p * 1.3 + Math.max(0, p - 0.85) * (h / vh) * 6;
      gl.uniform2f(uRes, w, h);
      gl.uniform1f(uProgress, p);
      gl.uniform1f(uHeight, h / vh);
      gl.uniform1f(uDepth, depth);
      gl.uniform1f(uPinned, trackEl ? 1 : 0);
      gl.uniform1f(uTime, (performance.now() - start) / 1000);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      // Keep animating (the noise drifts along the edge) only while the reveal is under way;
      // fully in or not yet started, the frame holds still until the next scroll or resize.
      if (!settled) raf = requestAnimationFrame(frame);
    };
    const wake = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };
    // A fresh texture or a resize: draw the next frame whatever it shows.
    const redraw = () => {
      drawnP = -1;
      wake();
    };

    let tex: WebGLTexture | null = null;
    const img = new Image();
    img.decoding = "async";
    img.src = src;
    img.onload = () => {
      tex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.uniform1f(uImgAspect, img.naturalWidth / img.naturalHeight);
      // ANGLE compiles the program on its first draw: do that now, while the page loads, rather
      // than as the section scrolls into view, where it stalled the scroll. Cleared straight after.
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      gl.clear(gl.COLOR_BUFFER_BIT);
      ready = true;
      canvas.dataset.ready = "true";
      redraw();
    };

    // Only draw while the section is on screen.
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !raf) raf = requestAnimationFrame(frame);
    });
    io.observe(canvas);

    window.addEventListener("scroll", wake, { passive: true });
    window.addEventListener("resize", redraw);

    return () => {
      window.removeEventListener("scroll", wake);
      window.removeEventListener("resize", redraw);
      io.disconnect();
      cancelAnimationFrame(raf);
      img.onload = null;
      // Free what this run made; don't lose the context, a remount (Strict Mode) gets the same one back.
      gl.deleteProgram(prog);
      gl.deleteBuffer(buf);
      if (tex) gl.deleteTexture(tex);
    };
  }, [src, ground, track, clear]);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className={`pointer-events-none opacity-0 transition-opacity duration-300 data-[ready=true]:opacity-100 ${className}`}
    />
  );
}
