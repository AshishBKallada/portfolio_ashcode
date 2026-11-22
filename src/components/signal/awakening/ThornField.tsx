import { forwardRef } from "react";

/**
 * The red thorns and shards around the Cursed King, drawn once as SVG: tapered vines with
 * hooked spikes, and a burst of angular crystal shards behind his head. Laid out on a
 * 1200 x 554 board (the hero's reference composition) and cropped to fill the screen.
 */

type Pt = [number, number];

function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/** A vine along a polyline: a tapered body plus spikes alternating off each side. */
function vine(points: Pt[], width: number, spikes: number, seed: number) {
  const rnd = seeded(seed);
  const left: Pt[] = [];
  const right: Pt[] = [];
  const thorns: string[] = [];
  const n = points.length;
  for (let i = 0; i < n; i++) {
    const [x, y] = points[i];
    const [ax, ay] = points[Math.max(0, i - 1)];
    const [bx, by] = points[Math.min(n - 1, i + 1)];
    const dx = bx - ax;
    const dy = by - ay;
    const len = Math.hypot(dx, dy) || 1;
    const nx = -dy / len;
    const ny = dx / len;
    const w = (width * (1 - i / (n - 1)) + 0.6) / 2;
    left.push([x + nx * w, y + ny * w]);
    right.push([x - nx * w, y - ny * w]);
  }
  for (let k = 0; k < spikes; k++) {
    const t = 0.08 + (0.86 * (k + rnd() * 0.5)) / spikes;
    const f = t * (n - 1);
    const i = Math.floor(f);
    const [x0, y0] = points[i];
    const [x1, y1] = points[Math.min(n - 1, i + 1)];
    const x = x0 + (x1 - x0) * (f - i);
    const y = y0 + (y1 - y0) * (f - i);
    const len = Math.hypot(x1 - x0, y1 - y0) || 1;
    const side = k % 2 ? 1 : -1;
    const nx = (-(y1 - y0) / len) * side;
    const ny = ((x1 - x0) / len) * side;
    const reach = width * (1.4 + rnd() * 2.2) * (1 - t * 0.6);
    const base = width * 0.7 * (1 - t * 0.5);
    // Hooked forward along the vine, like a rose thorn.
    const tx = x + nx * reach + ((x1 - x0) / len) * reach * 0.45;
    const ty = y + ny * reach + ((y1 - y0) / len) * reach * 0.45;
    const ux = ((x1 - x0) / len) * base;
    const uy = ((y1 - y0) / len) * base;
    thorns.push(`M${x - ux},${y - uy}L${tx},${ty}L${x + ux},${y + uy}Z`);
  }
  const body = `M${left.map((p) => p.join(",")).join("L")}L${right
    .reverse()
    .map((p) => p.join(","))
    .join("L")}Z`;
  return `${body}${thorns.join("")}`;
}

/** Bend a straight run into a slightly wandering one. */
function wander(from: Pt, to: Pt, steps: number, amp: number, seed: number): Pt[] {
  const rnd = seeded(seed);
  const out: Pt[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const jitter = i === 0 || i === steps ? 0 : (rnd() - 0.5) * amp;
    out.push([from[0] + (to[0] - from[0]) * t + jitter, from[1] + (to[1] - from[1]) * t + jitter * 0.4]);
  }
  return out;
}

const RED = "#d3141f";
const DEEP = "#9e0d18";
const INK = "#141212";

const VINES = [
  // The tall branch his near hand grips, and its offshoots.
  { pts: wander([350, 560], [330, 40], 14, 26, 3), w: 11, spikes: 16, fill: RED },
  { pts: wander([340, 320], [250, 110], 8, 18, 5), w: 6, spikes: 8, fill: RED },
  { pts: wander([345, 230], [420, 120], 6, 14, 7), w: 5, spikes: 6, fill: DEEP },
  { pts: wander([330, 470], [240, 400], 6, 12, 9), w: 5, spikes: 6, fill: RED },
  // Thorns climbing behind his right shoulder.
  { pts: wander([690, 560], [640, 150], 12, 24, 11), w: 9, spikes: 12, fill: RED },
  { pts: wander([665, 300], [760, 190], 6, 16, 13), w: 5, spikes: 6, fill: RED },
  // The edges of the frame.
  { pts: wander([-20, 300], [70, 560], 10, 18, 15), w: 10, spikes: 10, fill: RED },
  { pts: wander([0, 40], [110, 150], 6, 10, 17), w: 3, spikes: 6, fill: "#bdbdbd" },
  { pts: wander([1220, 420], [1080, 560], 7, 12, 19), w: 5, spikes: 8, fill: "#c4c4c4" },
  { pts: wander([1110, 470], [1200, 360], 6, 10, 21), w: 3, spikes: 6, fill: "#cfcfcf" },
  { pts: wander([520, 0], [470, 80], 4, 8, 23), w: 4, spikes: 4, fill: INK },
];

/** Angular shards fanning out behind his head, like a broken crown. */
function shards(cx: number, cy: number, seed: number) {
  const rnd = seeded(seed);
  const out: { d: string; fill: string }[] = [];
  for (let i = 0; i < 15; i++) {
    const a = -Math.PI * (0.06 + (0.88 * (i + rnd() * 0.6)) / 15);
    const r = 120 + rnd() * 170;
    const spread = 0.05 + rnd() * 0.08;
    const inner = 30 + rnd() * 30;
    const p = (ang: number, d: number) => `${cx + Math.cos(ang) * d},${cy + Math.sin(ang) * d}`;
    out.push({
      d: `M${p(a - spread, inner)}L${p(a, r)}L${p(a + spread * 0.6, r * 0.62)}L${p(a + spread, inner)}Z`,
      fill: i % 4 === 0 ? INK : i % 3 === 0 ? DEEP : RED,
    });
  }
  return out;
}

const SHARDS = shards(560, 200, 29);

export const ThornField = forwardRef<SVGSVGElement, { className?: string }>(function ThornField(
  { className },
  ref,
) {
  return (
    <svg
      ref={ref}
      aria-hidden
      viewBox="0 0 1200 554"
      preserveAspectRatio="xMidYMid slice"
      className={className}
    >
      {/* Faint arches of a hall behind everything. */}
      <g fill="none" stroke="#000" strokeOpacity="0.06" strokeWidth="2">
        <path d="M760 554V200Q760 60 860 0" />
        <path d="M820 554V230Q820 90 930 20" />
        <path d="M1010 554V250Q1010 120 1100 60" />
        <path d="M200 554V260Q200 140 150 60" />
      </g>
      {SHARDS.map((s, i) => (
        <path key={i} d={s.d} fill={s.fill} />
      ))}
      {VINES.map((v, i) => (
        <path key={i} d={vine(v.pts, v.w, v.spikes, i + 1)} fill={v.fill} />
      ))}
    </svg>
  );
});
