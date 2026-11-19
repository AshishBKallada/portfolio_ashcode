"""
Build the flow masks FlowCloth.tsx warps the LinkedIn section's marble pieces by.
  flight-marble-flow.png: R = cape weight, G = hair weight (0 where pinned, 1 where free to float).
  laptop-angel-flow.png:  R = left wing, G = right wing (0 at the root, 1 at the tip).
The marble is one colour, so the regions are drawn by hand here, in picture coordinates,
and pinned inside the rest of the silhouette so a blur can't drag the body along.
Run: blender -b -P scripts/blender/make_linkedin_flow.py
Reads public/images/linkedin/{flight-marble,laptop-angel}.png, writes the -flow.png beside each (512 wide).
"""
import os

import bpy
import numpy as np

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
DIR = os.path.join(ROOT, "public/images/linkedin")


def smoothstep(e0, e1, x):
    t = np.clip((x - e0) / (e1 - e0), 0, 1)
    return t * t * (3 - 2 * t)


def box_blur(m, k):
    """Separable box blur, k px each side; also what dilates a mask into the alpha."""
    h, w = m.shape
    out = m.copy()
    for axis in (0, 1):
        pad = [(k + 1, k), (0, 0)] if axis == 0 else [(0, 0), (k + 1, k)]
        s = np.cumsum(np.pad(out, pad), axis=axis)
        n = 2 * k + 1
        out = (s[n:, :] - s[:-n, :])[:h, :] / n if axis == 0 else (s[:, n:] - s[:, :-n])[:, :w] / n
    return out


def seg_dist(X, Y, a, b):
    """Distance from each point to the segment a-b (all in the same units)."""
    ax, ay = a
    bx, by = b
    vx, vy = bx - ax, by - ay
    t = np.clip(((X - ax) * vx + (Y - ay) * vy) / (vx * vx + vy * vy), 0, 1)
    return np.hypot(X - (ax + t * vx), Y - (ay + t * vy))


def load(name):
    img = bpy.data.images.load(os.path.join(DIR, name))
    w, h = img.size
    px = np.array(img.pixels[:], dtype=np.float32).reshape(h, w, 4)[::-1]
    ys, xs = np.mgrid[0:h, 0:w]
    # Picture fractions, and height-unit coordinates (x scaled by the aspect) for distances.
    return px[..., 3], xs / w, ys / h, xs / h, ys / h, w, h


def save(name, r, g, w, h, out_w=512):
    flow = np.zeros((h, w, 4), dtype=np.float32)
    flow[..., 0], flow[..., 1], flow[..., 3] = r, g, 1.0
    out = bpy.data.images.new(name, w, h, alpha=True)
    out.pixels = flow[::-1].ravel().tolist()
    out.scale(out_w, round(h * out_w / w))
    out.filepath_raw = os.path.join(DIR, name)
    out.file_format = "PNG"
    out.save()
    print(f"[flow] wrote {name}: R {int((r > 0.05).sum())} px, G {int((g > 0.05).sum())} px")


def finish(weight, zone, a, spill, pin_blur=2):
    """Soften, spill past the silhouette, and pin everything inside it that isn't this zone."""
    body = (a > 0.5) & ~zone
    out = np.clip(box_blur(weight, spill) * 1.15, 0, 1)
    return out * (1.0 - box_blur(body.astype(np.float32), pin_blur))


# --- The flight: cape behind and to the right of him, hair at the top left. ---
a, fx, fy, X, Y, w, h = load("flight-marble.png")
asp = w / h
# The cape: everything right of the shoulders that isn't the reaching arm or the body's core.
arm = seg_dist(X, Y, (0.58 * asp, 0.24), (0.78 * asp, 0.39)) < 0.05
torso = seg_dist(X, Y, (0.46 * asp, 0.30), (0.72 * asp, 0.52)) < 0.21
legs = seg_dist(X, Y, (0.72 * asp, 0.52), (0.93 * asp, 0.86)) < 0.22
# Only the cape proper, the upper sweep and its tails out past the feet: the robe's hem round
# the legs is cloth too, but it stays still.
hem = (fy > 0.48) & (fx < 0.84)
cape = (a > 0.5) & (fx > 0.50) & (fy < 0.80) & ~arm & ~torso & ~legs & ~hem
# Pinned at the shoulders; freer the further the cloth has flown from them.
cape_w = cape.astype(np.float32) * smoothstep(0.05, 0.45, np.hypot(X - 0.58 * asp, Y - 0.17))
# The hair: the curls round the head, still at the scalp, loose at the ends; the face stays put.
r_hair = np.hypot((fx - 0.415) / 0.075, (fy - 0.17) / 0.12)
hair = (a > 0.5) & (r_hair < 1.0)
hair_w = hair.astype(np.float32) * smoothstep(0.35, 1.0, r_hair)
hair_w *= smoothstep(0.85, 1.3, np.hypot((fx - 0.40) / 0.05, (fy - 0.30) / 0.08))
save("flight-marble-flow.png", finish(cape_w, cape, a, 10), finish(hair_w, hair, a, 5), w, h)

# --- The laptop: a wing each side, hinged where it meets the case. ---
a, fx, fy, X, Y, w, h = load("laptop-angel.png")
asp = w / h
left = (a > 0.5) & (fx < 0.135) & (fy > 0.33) & (fy < 0.62)
left_w = left.astype(np.float32) * smoothstep(0.01, 0.14, np.hypot(X - 0.13 * asp, Y - 0.42))
right = (a > 0.5) & (fx > 0.52) & (fy > 0.16) & (fy < 0.42)
right_w = right.astype(np.float32) * smoothstep(0.02, 0.26, np.hypot(X - 0.53 * asp, Y - 0.28))
save("laptop-angel-flow.png", finish(left_w, left, a, 6), finish(right_w, right, a, 6), w, h)
