"""
Build the flow mask the hero samurai is warped by (FlowPicture.tsx):
  R = sash and hem weight, G = braid weight (0 where pinned, 1 where free to float).
Run: blender -b -P scripts/blender/make_samurai_flow.py
Reads public/images/hero/hero-samurai.webp, writes public/images/hero/hero-samurai-flow.png (512 wide).
"""
import os

import bpy
import numpy as np

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
SRC = os.path.join(ROOT, "public/images/hero/hero-samurai.webp")
DST = os.path.join(ROOT, "public/images/hero/hero-samurai-flow.png")

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


# The sash: the reds tied round his waist, below the collar (whose red lining stays put).
red = (a > 0.5) & (r > 0.35) & (r > g * 2.0) & (r > b * 2.0)
sash = red & (fy > 0.29)
sash = box_blur(sash.astype(np.float32), 5) > 0.3  # close small holes (folds, shadows)
# Pinned at the knot on his hip: the weight grows with distance, so the hanging end floats most.
knot = np.hypot((fx - 0.56) * (w / h), fy - 0.36)
sash_w = sash.astype(np.float32) * smoothstep(0.04, 0.36, knot)

# The braids: the dark cables trailing off the back of his head, up and to the left, clear of
# the head, shoulder, arm and sword.
dark = (a > 0.3) & (np.maximum(np.maximum(r, g), b) < 0.45)
braid_zone = ((fy < 0.14) & (fx < 0.47)) | ((fx < 0.33) & (fy < 0.34))
braid = dark & braid_zone
braid = box_blur(braid.astype(np.float32), 2) > 0.2
root = np.hypot((fx - 0.49) * (w / h), fy - 0.06)
braid_w = braid.astype(np.float32) * smoothstep(0.02, 0.32, root)

# Soften and let the weight spill a little past the silhouette, so edges can move out into the alpha.
sash_w = np.clip(box_blur(sash_w, 10) * 1.15, 0, 1)
# A wide blur, so the weight barely changes across a cable and each one moves whole.
braid_w = np.clip(box_blur(braid_w, 14) * 1.8, 0, 1)
# But never onto him: whatever else is inside the silhouette (robes, shirt, arm, sword, shoes)
# is pinned, so the blur can't drag the hakama along with the sash.
body = (a > 0.5) & ~red
pin = box_blur(body.astype(np.float32), 2)
sash_w *= 1.0 - pin
# The braids' own pixels are dark like his clothes; pin only what lies outside the braid zone.
braid_w *= 1.0 - pin * (~braid_zone)

# The hakama's hem: the lower skirt, pinned up at the thighs and freer toward the bottom edge;
# the shoes below it stay put. It shares the cloth channel, a little gentler than the sash.
skirt = (a > 0.3) & (fx > 0.14) & (fx < 0.82) & (fy > 0.56) & (fy < 0.86) & ~red
skirt = box_blur(skirt.astype(np.float32), 4) > 0.3
hem_w = skirt.astype(np.float32) * smoothstep(0.6, 0.84, fy) * 0.75
hem_w = np.clip(box_blur(hem_w, 10) * 1.2, 0, 1)
shoes = (a > 0.3) & (fy > 0.835)
hem_w *= 1.0 - box_blur(shoes.astype(np.float32), 3)
sash_w = np.maximum(sash_w, hem_w)

out_w = 512
out_h = round(h * out_w / w)
flow = np.zeros((h, w, 4), dtype=np.float32)
flow[..., 0], flow[..., 1], flow[..., 3] = sash_w, braid_w, 1.0
out = bpy.data.images.new("flow", w, h, alpha=True)
out.pixels = flow[::-1].ravel().tolist()
out.scale(out_w, out_h)
out.filepath_raw = DST
out.file_format = "PNG"
out.save()
print(f"[flow] wrote {DST} {out_w}x{out_h}; sash px {int(sash.sum())}, braid px {int(braid.sum())}")
