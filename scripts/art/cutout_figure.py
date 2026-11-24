"""Cut the marble-bodied Cursed King out of his light-grey backdrop for the home hero.

The backdrop is a soft grey gradient and his skin is pale marble, so a brightness threshold
won't do. Instead the background is grown from the border: a pixel joins it when its colour
is close to the backdrop colour sampled near it, and the ink outline around the figure stops
the fill. The floor shadow under his feet is kept as a soft, semi-transparent shadow.

    python scripts/art/cutout_figure.py [raw-name out-name]
"""

import sys
from pathlib import Path

import numpy as np
from PIL import Image
from scipy import ndimage

ROOT = Path(__file__).resolve().parents[2]
# Defaults to the marble king; pass `<raw name> <output name>` for another figure on a plain backdrop.
SRC = ROOT / "art/cursed-king/raw" / f"{sys.argv[1] if len(sys.argv) > 1 else '08-marble-king'}.png"
OUT = ROOT / "public/images/awakening" / f"{sys.argv[2] if len(sys.argv) > 2 else 'marble-king'}.webp"

TOLERANCE = 13  # max colour distance from the local backdrop
POCKET = 80  # enclosed backdrop patches bigger than this (px) are holes, not eye whites
PAD = 10


def main() -> None:
    rgb = np.asarray(Image.open(SRC).convert("RGB")).astype(np.float64)
    h, w, _ = rgb.shape

    # The backdrop varies across the frame; estimate it per row from the outer 6% on each side.
    edge = max(4, w // 16)
    sides = np.concatenate([rgb[:, :edge], rgb[:, -edge:]], axis=1)
    backdrop = np.median(sides, axis=1)[:, None, :]
    near = np.linalg.norm(rgb - backdrop, axis=2) < TOLERANCE

    labels, n = ndimage.label(near)
    border = np.unique(np.concatenate([labels[0], labels[-1], labels[:, 0], labels[:, -1]]))
    # Enclosed pockets of backdrop are backdrop too, but only where they're gaps between strands
    # of hair (ringed by dark pixels) or on the floor; his pale skin matches the backdrop as well.
    sizes = ndimage.sum(near, labels, range(n + 1))
    lum = rgb.mean(axis=2)
    pockets = []
    for i, sl in enumerate(ndimage.find_objects(labels), start=1):
        if sizes[i] <= POCKET or sl is None:
            continue
        region = labels[sl] == i
        ring = ndimage.binary_dilation(region, iterations=2) & ~region
        dark = (lum[sl][ring] < 70).mean() if ring.any() else 0
        if dark > 0.6:
            pockets.append(i)
    bg = np.isin(labels, np.union1d(border[border > 0], pockets))
    # Slivers between hair and neck can be lighter than the backdrop; take light patches ringed
    # mostly by hair (skin highlights are ringed by mid-grey shading, not black).
    light = lum > backdrop.mean(axis=2) - 6
    lab2, n2 = ndimage.label(light)
    for i, sl in enumerate(ndimage.find_objects(lab2), start=1):
        if sl is None:
            continue
        region = lab2[sl] == i
        if region.sum() < 30:
            continue
        ring = ndimage.binary_dilation(region, iterations=2) & ~region
        dark = (lum[sl][ring] < 70).mean()
        # Around the head the slivers also touch skin, so the bar is lower there.
        if dark > 0.45 or (sl[0].stop < h * 0.35 and dark > 0.25):
            bg[sl] |= region
    # Close pinholes in the backdrop, then keep only the largest solid piece: the figure.
    bg = ndimage.binary_opening(bg, iterations=1) | bg
    solid, m = ndimage.label(~bg)
    if m > 1:
        areas = ndimage.sum(~bg, solid, range(m + 1))
        bg |= solid != int(np.argmax(areas[1:]) + 1)

    alpha = np.where(bg, 0.0, 1.0)
    # Soft edge from how far each edge pixel sits from the backdrop.
    band = ndimage.binary_dilation(bg, iterations=2) & ~bg
    dist = np.linalg.norm(rgb - backdrop, axis=2)
    alpha[band] = np.clip((dist[band] - 4) / 30, 0, 1)

    # The floor shadow: darker-than-backdrop pixels in the bottom fifth become a translucent shadow.
    darker = (backdrop.mean(axis=2) - rgb.mean(axis=2)).clip(0, None)
    floor = np.zeros_like(alpha, dtype=bool)
    floor[int(h * 0.8) :] = True
    shadow = floor & bg & (darker > 3)
    alpha[shadow] = np.clip(darker[shadow] / 60, 0, 0.55)

    out_rgb = np.where(shadow[..., None], 30.0, rgb)
    ys, xs = np.nonzero(alpha > 0.02)
    top, left = max(0, ys.min() - PAD), max(0, xs.min() - PAD)
    bottom, right = min(h, ys.max() + PAD + 1), min(w, xs.max() + PAD + 1)
    rgba = np.dstack([out_rgb, alpha * 255]).astype(np.uint8)[top:bottom, left:right]
    OUT.parent.mkdir(parents=True, exist_ok=True)
    Image.fromarray(rgba, "RGBA").save(OUT, "WEBP", quality=92, method=6)
    print(f"{OUT.relative_to(ROOT)} {right - left}x{bottom - top} {OUT.stat().st_size // 1024} KB")


if __name__ == "__main__":
    main()
