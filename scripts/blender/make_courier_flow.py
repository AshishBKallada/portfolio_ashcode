"""
Build the flow mask HeroCourierCloth.tsx warps the courier by:
  R = cape weight, G = hair weight (0 where pinned, 1 where free to float).
Run: blender -b -P scripts/blender/make_courier_flow.py
Reads public/images/hero/hero-courier-cape.webp, writes public/images/hero/hero-courier-flow.png (512 wide).
"""
import os

import bpy
import numpy as np

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
SRC = os.path.join(ROOT, "public/images/hero/hero-courier-cape.webp")
DST = os.path.join(ROOT, "public/images/hero/hero-courier-flow.png")

img = bpy.data.images.load(SRC)
w, h = img.size
px = np.array(img.pixels[:], dtype=np.float32).reshape(h, w, 4)
px = px[::-1]  # Blender rows run bottom-up; work top-down like the picture.
r, g, b, a = px[..., 0], px[..., 1], px[..., 2], px[..., 3]
ys, xs = np.mgrid[0:h, 0:w]
fx, fy = xs / w, ys / h


def box_blur(m, k):
    """Separable box blur, k px each side; also what dilates the mask into the alpha."""
    out = m.copy()
    for axis in (0, 1):
        s = np.cumsum(np.pad(out, [(k + 1, k) if axis == 0 else (0, 0), (k + 1, k) if axis == 1 else (0, 0)]), axis=axis)
        n = 2 * k + 1
        if axis == 0:
            out = (s[n:, :] - s[:-n, :])[: h, :] / n
        else:
            out = (s[:, n:] - s[:, :-n])[:, : w] / n
    return out


def smoothstep(e0, e1, x):
    t = np.clip((x - e0) / (e1 - e0), 0, 1)
    return t * t * (3 - 2 * t)


# Cape: the reds and the gold trim, left of the body; the gold is low-saturation so take it by hue window.
red = (a > 0.5) & (r > 0.25) & (r > g * 1.5) & (r > b * 1.5)
gold = (a > 0.5) & (r > 0.45) & (g > 0.3) & (b < g * 0.8) & (r > g)
# Past the shoulders only the cape's upper sweep is cape; lower right is sleeve and harness.
cape = (red | gold) & (fx < 0.72) & ~((fx > 0.40) & (fy > 0.28))
cape = box_blur(cape.astype(np.float32), 6) > 0.25  # close small holes
# Pinned at the clasp on his shoulders: the weight grows with distance from there.
anchor = np.hypot((fx - 0.62) * (w / h), fy - 0.17)
cape_w = cape.astype(np.float32) * smoothstep(0.06, 0.42, anchor)

# Hair: the dark mass above the visor, top right.
dark = (a > 0.5) & (np.maximum(np.maximum(r, g), b) < 0.32)
hair = dark & (fx > 0.52) & (fx < 0.8) & (fy < 0.19)
hair = box_blur(hair.astype(np.float32), 3) > 0.3
scalp = np.hypot((fx - 0.69) * (w / h), fy - 0.12)
hair_w = hair.astype(np.float32) * smoothstep(0.015, 0.09, scalp)

# Soften and let the weight spill a little past the silhouette, so edges can move out into the alpha.
cape_w = np.clip(box_blur(cape_w, 10) * 1.15, 0, 1)
# But never onto him: inside the silhouette, whatever is not cape or trim (robes, legs,
# sneakers, hands, the case) is pinned, so the blur can't drag a leg along with the cape.
body = (a > 0.5) & ~(red | gold)
cape_w *= 1.0 - box_blur(body.astype(np.float32), 2)
hair_w = np.clip(box_blur(hair_w, 5) * 1.2, 0, 1)
# Face and visor stay put: a soft ellipse over them zeroes the hair weight after the blur.
face = np.hypot((fx - 0.715) / 0.055, (fy - 0.155) / 0.105)
hair_w *= smoothstep(0.85, 1.25, face)

out_w = 512
out_h = round(h * out_w / w)
flow = np.zeros((h, w, 4), dtype=np.float32)
flow[..., 0], flow[..., 1], flow[..., 3] = cape_w, hair_w, 1.0
out = bpy.data.images.new("flow", w, h, alpha=True)
out.pixels = flow[::-1].ravel().tolist()
out.scale(out_w, out_h)
out.filepath_raw = DST
out.file_format = "PNG"
out.save()
print(f"[flow] wrote {DST} {out_w}x{out_h}; cape px {int(cape.sum())}, hair px {int(hair.sum())}")
