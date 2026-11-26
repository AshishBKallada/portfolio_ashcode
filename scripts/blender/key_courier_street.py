"""
Cut the street-wear courier (a Gemini render on flat green) out of its background and fit him
into the hero courier's frame: 1000x744, his reach and case spanning the same width the caped
courier did, feet on the same line. Writes a WebP with alpha.
Run: blender -b -P scripts/blender/key_courier_street.py -- <green.png> [out name] [frame width]
The out name defaults to hero-courier-street.webp; the caped render went to hero-courier-street-cape.webp.
A frame width over 1000 widens the frame evenly on both sides (the figure keeps its place and size
against the frame's height), so a cape that streams far back fits: the black-caped courier is 1240.
"""
import os
import sys

import bpy
import numpy as np

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
ARGS = sys.argv[sys.argv.index("--") + 1:]
SRC = ARGS[0]
DST = os.path.join(ROOT, "public/images/hero", ARGS[1] if len(ARGS) > 1 else "hero-courier-street.webp")

OUT_W, OUT_H = int(ARGS[2]) if len(ARGS) > 2 else 1000, 744
PAD = (OUT_W - 1000) // 2
# The figure's box in the render (case to fingertips, hair to soles) and where it goes in the
# frame: the caped courier's body spans x 150..995 and ends at y 735.
SRC_BOX = (300, 8, 1210, 758)
DST_LEFT, DST_RIGHT, DST_BOTTOM = 150, 995, 735
# The generator's sparkle mark, bottom right of the render, clear of the figure.
MARK = (1215, 610, 1300, 690)

img = bpy.data.images.load(SRC)
w, h = img.size
px = np.array(img.pixels[:], dtype=np.float32).reshape(h, w, 4)[::-1].copy()
r, g, b = px[..., 0], px[..., 1], px[..., 2]

# Key: how far green stands above the other two channels. Pure screen is ~1, skin, cloth and
# the white top are near 0.
spill = g - np.maximum(r, b)
alpha = 1.0 - np.clip((spill - 0.12) / (0.42 - 0.12), 0, 1)
# Pull the edge in a touch, so the last half-green ring of pixels drops out.
alpha = np.clip((alpha - 0.1) / 0.9, 0, 1)
x0, y0, x1, y1 = MARK
alpha[y0:y1, x0:x1] = 0
# Despill: no pixel keeps more green than its stronger other channel.
px[..., 1] = np.minimum(g, np.maximum(r, b))
px[..., 3] = alpha
# Premultiply so scaling doesn't drag green into the edges.
px[..., :3] *= alpha[..., None]

bx0, by0, bx1, by1 = SRC_BOX
s = (DST_RIGHT - DST_LEFT) / (bx1 - bx0)
sw, sh = round(w * s), round(h * s)
tmp = bpy.data.images.new("tmp", w, h, alpha=True, float_buffer=True)
tmp.pixels = px[::-1].ravel().tolist()
tmp.scale(sw, sh)
small = np.array(tmp.pixels[:], dtype=np.float32).reshape(sh, sw, 4)[::-1]

ox = round(DST_LEFT - bx0 * s) + PAD
oy = round(DST_BOTTOM - by1 * s)
out = np.zeros((OUT_H, OUT_W, 4), dtype=np.float32)
sx0, sy0 = max(0, -ox), max(0, -oy)
dx0, dy0 = max(0, ox), max(0, oy)
cw = min(sw - sx0, OUT_W - dx0)
ch = min(sh - sy0, OUT_H - dy0)
out[dy0:dy0 + ch, dx0:dx0 + cw] = small[sy0:sy0 + ch, sx0:sx0 + cw]

a = out[..., 3:4]
out[..., :3] = np.where(a > 1e-4, out[..., :3] / np.maximum(a, 1e-4), 0)
out = np.clip(out, 0, 1)

res = bpy.data.images.new("street", OUT_W, OUT_H, alpha=True)
res.pixels = out[::-1].ravel().tolist()
# Saved straight, not through save_render, which would run the scene's view transform over it.
res.filepath_raw = DST
res.file_format = "WEBP"
res.save(quality=92)
print(f"[street] wrote {DST} scale {s:.4f} offset {ox},{oy}")
