"""
Paints the portal, its moon and its mound out of the desert panorama, so the sky photograph
can stand behind the modelled ones (make_desert.py) without them showing through.

    blender -b --python scripts/blender/paint_out_portal.py -- references/pano public/images/hero/pano

Reads desert-4k.webp and desert-2k.webp from the first directory and writes
desert-4k-sky.webp and desert-2k-sky.webp into the second. The patch is the sky to the right of the portal, mirrored
across the patch's right edge (so that edge is seamless) and feathered along its left and
top; the bottom runs into the horizon haze, which the modelled dunes cover anyway.
"""
import os
import sys

import bpy
import numpy as np

args = sys.argv[sys.argv.index("--") + 1:]
SRC_DIR, OUT_DIR = args[0], args[1]

# The patch, in the photograph's fractions: x across, t down from the zenith.
X0, X1 = 0.285, 0.615
T0, T1 = 0.33, 0.505
FEATHER_X, FEATHER_T = 0.05, 0.035

scene = bpy.context.scene
scene.render.image_settings.file_format = "WEBP"
scene.render.image_settings.quality = 84
scene.render.image_settings.color_mode = "RGB"

for name in ("desert-4k", "desert-2k"):
    src = os.path.join(SRC_DIR, f"{name}.webp")
    img = bpy.data.images.load(src)
    W, H = img.size
    px = np.empty(W * H * 4, dtype=np.float32)
    img.pixels.foreach_get(px)
    # Blender stores rows bottom-up: row 0 is underfoot, so t runs from the top row down.
    px = px.reshape(H, W, 4)
    x0, x1 = int(X0 * W), int(X1 * W)
    r0, r1 = int((1 - T1) * H), int((1 - T0) * H)
    patch = px[r0:r1, x0:x1].copy()
    # Mirror across the right edge: column x takes column 2*x1 - x.
    cols = 2 * x1 - np.arange(x0, x1) - 1
    fill = px[r0:r1][:, cols]
    xs = (np.arange(x0, x1) - x0) / W
    ts = (np.arange(r1 - r0)[::-1]) / H  # distance down from the patch's top edge
    mx = np.clip(xs / FEATHER_X, 0, 1)
    mt = np.clip(ts / FEATHER_T, 0, 1)
    mask = (mx * mx * (3 - 2 * mx))[None, :] * (mt * mt * (3 - 2 * mt))[:, None]
    px[r0:r1, x0:x1] = patch * (1 - mask[..., None]) + fill * mask[..., None]
    out = bpy.data.images.new(f"{name}-sky", W, H, alpha=False)
    out.pixels.foreach_set(px.ravel())
    dst = os.path.join(OUT_DIR, f"{name}-sky.webp")
    out.save_render(dst)
    print("WROTE", dst, W, H, os.path.getsize(dst))
print("DONE")
