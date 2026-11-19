"""
Cut the marble chips flying off the sphere out of the hero's desert panorama, so
HeroPanorama can move them.

  blender -b --python scripts/blender/make_pano_shards.py -- [--preview <dir>]

Reads public/images/hero/pano/desert-4k.webp and writes:
  - public/images/hero/pano/shards.png      a sprite atlas, one chip per cell (RGBA)
  - src/data/panoShards.ts                   where each chip sits in the panorama and the atlas
  - public/images/hero/pano/desert-4k.webp   the panorama with the chips painted out (and the
    biplane with its contrail in the sky above the portal, which the hero no longer wants)
  - public/images/hero/pano/desert-2k.webp   the same at half size, for phones

Keep a copy of the original panorama before running this: it overwrites it in place, and
runs on the already-cleaned picture would find nothing to cut.

A chip is a run of grey pixels (neutral, darker than the cyan sky and the white sphere) in
the patch of sky left of the portal. Each becomes one atlas cell with a soft alpha; its
footprint in the panorama is filled by diffusion from the pixels round it (a smooth fill, right
for sky and for the sphere's shading). Blender's bundled Python has numpy; nothing else is used.

With --preview <dir>, writes the cut mask and the filled patch there as PNGs and changes nothing.
"""

import json
import os
import subprocess
import sys

import bpy
import numpy as np

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
PANO_4K = os.path.join(ROOT, "public/images/hero/pano/desert-4k.webp")
PANO_2K = os.path.join(ROOT, "public/images/hero/pano/desert-2k.webp")
ATLAS = os.path.join(ROOT, "public/images/hero/pano/shards.png")
DATA = os.path.join(ROOT, "src/data/panoShards.ts")

# The patch of sky the chips fly through, in 4k pixels (y down), up to the portal's left post.
REGION = (1880, 720, 1996, 890)
# The sphere they come off: its centre and radius, in the same pixels. Chips still on it, or
# overlapping its edge, stay in the picture: only those clear of it in the sky are cut and moved.
SPHERE = (2047.0, 870.0, 100.0)
# The biplane and its contrail, as a disc and a band that thickens toward the trail's far end.
PLANE = (1942.0, 645.0, 22.0)
TRAIL = ((1935.0, 645.0), (2262.0, 584.0), 9.0, 19.0)
MIN_AREA = 5
PAD = 2


def load(path):
    im = bpy.data.images.load(path)
    w, h = im.size
    px = np.array(im.pixels[:], dtype=np.float32).reshape(h, w, 4)[::-1].copy()
    bpy.data.images.remove(im)
    return px


def save_png(path, arr):
    h, w = arr.shape[:2]
    im = bpy.data.images.new(os.path.basename(path), w, h, alpha=True)
    im.pixels[:] = np.ascontiguousarray(arr[::-1]).ravel()
    im.filepath_raw = path
    im.file_format = "PNG"
    im.save()
    bpy.data.images.remove(im)


def save_webp(path, arr, quality):
    tmp = path + ".png"
    save_png(tmp, arr)
    subprocess.run(["cwebp", "-quiet", "-q", str(quality), "-m", "6", tmp, "-o", path], check=True)
    os.remove(tmp)


def chip_alpha(rgb):
    """How much a pixel is chip: grey, darker than the pale sky (its luminance 0.83 and up)."""
    lum = rgb @ np.array([0.299, 0.587, 0.114], dtype=np.float32)
    return np.clip((0.82 - lum) / 0.08, 0, 1)


def components(mask):
    """4-connected components of a boolean mask, as a label array (0 = none)."""
    h, w = mask.shape
    labels = np.zeros((h, w), dtype=np.int32)
    n = 0
    for sy in range(h):
        for sx in range(w):
            if not mask[sy, sx] or labels[sy, sx]:
                continue
            n += 1
            stack = [(sy, sx)]
            labels[sy, sx] = n
            while stack:
                y, x = stack.pop()
                for ny, nx in ((y - 1, x), (y + 1, x), (y, x - 1), (y, x + 1)):
                    if 0 <= ny < h and 0 <= nx < w and mask[ny, nx] and not labels[ny, nx]:
                        labels[ny, nx] = n
                        stack.append((ny, nx))
    return labels, n


def dilate(mask, r):
    out = mask.copy()
    for _ in range(r):
        m = out.copy()
        m[1:] |= out[:-1]
        m[:-1] |= out[1:]
        m[:, 1:] |= out[:, :-1]
        m[:, :-1] |= out[:, 1:]
        out = m
    return out


def diffuse(px, mask, iters=2500):
    """Fill masked pixels by diffusion from their surroundings, in place."""
    ys, xs = np.nonzero(mask)
    y0, y1 = max(ys.min() - 2, 0), min(ys.max() + 3, px.shape[0])
    x0, x1 = max(xs.min() - 2, 0), min(xs.max() + 3, px.shape[1])
    patch = px[y0:y1, x0:x1, :3].copy()
    m = mask[y0:y1, x0:x1]
    ring = dilate(m, 1) & ~m
    patch[m] = patch[ring].mean(axis=0)
    for _ in range(iters):
        avg = (np.roll(patch, 1, 0) + np.roll(patch, -1, 0) + np.roll(patch, 1, 1) + np.roll(patch, -1, 1)) * 0.25
        patch[m] = avg[m]
    px[y0:y1, x0:x1, :3] = patch


def band_mask(shape, a, b, r0, r1):
    """A capsule from a to b whose half-width runs r0 to r1 along it."""
    h, w = shape
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    ax, ay = a
    bx, by = b
    dx, dy = bx - ax, by - ay
    L2 = dx * dx + dy * dy
    t = np.clip(((xx - ax) * dx + (yy - ay) * dy) / L2, 0, 1)
    px, py = ax + t * dx, ay + t * dy
    d = np.hypot(xx - px, yy - py)
    return d <= r0 + (r1 - r0) * t


def disc_mask(shape, cx, cy, r):
    h, w = shape
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    return np.hypot(xx - cx, yy - cy) <= r


def main():
    argv = sys.argv[sys.argv.index("--") + 1 :] if "--" in sys.argv else []
    preview = argv[argv.index("--preview") + 1] if "--preview" in argv else None

    px = load(PANO_4K)
    H, W = px.shape[:2]
    x0, y0, x1, y1 = REGION
    region = px[y0:y1, x0:x1]
    alpha = chip_alpha(region[..., :3])
    labels, n = components(alpha > 0.25)
    on_sphere = disc_mask((H, W), *SPHERE)[y0:y1, x0:x1]

    chips = []
    for i in range(1, n + 1):
        ys, xs = np.nonzero(labels == i)
        # Too small to be a chip, still on the sphere, or running into the portal's post: left be.
        if len(ys) < MIN_AREA or on_sphere[ys, xs].any() or xs.max() >= x1 - x0 - 2:
            labels[labels == i] = 0
            continue
        cy0, cy1 = ys.min() - PAD, ys.max() + PAD + 1
        cx0, cx1 = xs.min() - PAD, xs.max() + PAD + 1
        cy0, cx0 = max(cy0, 0), max(cx0, 0)
        cy1, cx1 = min(cy1, region.shape[0]), min(cx1, region.shape[1])
        # Soft alpha round this chip only: its own pixels, feathered a pixel out.
        own = dilate(labels[cy0:cy1, cx0:cx1] == i, 1)
        a = alpha[cy0:cy1, cx0:cx1] * own
        a = (a + np.roll(a, 1, 0) + np.roll(a, -1, 0) + np.roll(a, 1, 1) + np.roll(a, -1, 1)) / 5
        cell = region[cy0:cy1, cx0:cx1].copy()
        cell[..., 3] = np.clip(a, 0, 1)
        chips.append(
            {
                "x": x0 + cx0,
                "y": y0 + cy0,
                "w": cx1 - cx0,
                "h": cy1 - cy0,
                "cell": cell,
            }
        )
    print(f"{len(chips)} chips")

    # Shelf-pack the cells into an atlas, tallest first.
    chips.sort(key=lambda c: -c["h"])
    AW = 512
    shelves = []
    cx = cy = shelf_h = 0
    for c in chips:
        if cx + c["w"] + 1 > AW:
            cy += shelf_h + 1
            cx = shelf_h = 0
        c["ax"], c["ay"] = cx, cy
        cx += c["w"] + 1
        shelf_h = max(shelf_h, c["h"])
    AH = 1
    while AH < cy + shelf_h + 1:
        AH *= 2
    atlas = np.zeros((AH, AW, 4), dtype=np.float32)
    for c in chips:
        atlas[c["ay"] : c["ay"] + c["h"], c["ax"] : c["ax"] + c["w"]] = c["cell"]

    # Paint the chips, the plane and its trail out of the panorama.
    fill = np.zeros((H, W), dtype=bool)
    fill[y0:y1, x0:x1] = dilate(labels > 0, 2)
    fill |= disc_mask((H, W), *PLANE)
    fill |= band_mask((H, W), *TRAIL)
    cleaned = px.copy()
    # Two fills, each over its own patch: the sky above the portal, then the chips' patch.
    rows = np.arange(H)[:, None]
    diffuse(cleaned, fill & (rows < 700))
    diffuse(cleaned, fill & (rows >= 700))

    if preview:
        os.makedirs(preview, exist_ok=True)
        shown = region.copy()
        shown[labels > 0] = [1, 0, 0, 1]
        save_png(os.path.join(preview, "mask.png"), shown.repeat(4, 0).repeat(4, 1))
        save_png(os.path.join(preview, "atlas.png"), atlas)
        save_png(os.path.join(preview, "filled.png"), cleaned[560:900, 1860:2300])
        save_png(os.path.join(preview, "original.png"), px[560:900, 1860:2300])
        return

    save_png(ATLAS, atlas)
    save_webp(PANO_4K, cleaned, 88)
    half = (cleaned[0::2, 0::2] + cleaned[1::2, 0::2] + cleaned[0::2, 1::2] + cleaned[1::2, 1::2]) * 0.25
    save_webp(PANO_2K, half, 85)

    rows = [
        {
            "x": float(c["x"] + c["w"] / 2),
            "y": float(c["y"] + c["h"] / 2),
            "w": int(c["w"]),
            "h": int(c["h"]),
            "ax": int(c["ax"]),
            "ay": int(c["ay"]),
        }
        for c in chips
    ]
    lines = [
        "/* Generated by scripts/blender/make_pano_shards.py: do not edit by hand. */",
        "",
        "/** The desert panorama's size, in pixels, that the chips' positions are measured in. */",
        f"export const PANO_SIZE = [{W}, {H}] as const;",
        "/** The sprite atlas (public/images/hero/pano/shards.png): its size in pixels. */",
        f"export const SHARD_ATLAS_SIZE = [{AW}, {AH}] as const;",
        "/** The sphere the chips fly off: its centre in panorama pixels. */",
        f"export const SHARD_SOURCE = [{SPHERE[0]}, {SPHERE[1]}] as const;",
        "/**",
        " * One chip: its centre and size in panorama pixels (y down), and the top left of its cell",
        " * in the atlas, the same size.",
        " */",
        "export type PanoShard = { x: number; y: number; w: number; h: number; ax: number; ay: number };",
        "export const PANO_SHARDS: readonly PanoShard[] = " + json.dumps(rows, separators=(",", ":")) + ";",
        "",
    ]
    with open(DATA, "w") as f:
        f.write("\n".join(lines))
    print("wrote", ATLAS, PANO_4K, PANO_2K, DATA)


main()
