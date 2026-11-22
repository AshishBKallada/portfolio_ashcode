"""Cut the Cursed King's pose frames out of their white backgrounds for the awakening hero.

Gemini draws each pose as clean ink line art on pure white, so the matte is a flood fill:
white regions that touch the border (or large enclosed white gaps, like between an arm and
the body) are background, and a thin band along their edge is un-premultiplied from white
so the outline keeps its anti-aliasing. Every frame is cropped to the same union box so the
poses stay registered, then written as WebP with alpha.

    python scripts/art/cutout_cursed_king.py
"""

from pathlib import Path

import numpy as np
from PIL import Image
from scipy import ndimage

ROOT = Path(__file__).resolve().parents[2]
RAW = ROOT / "art/cursed-king/raw"
OUT = ROOT / "public/images/awakening"
FRAMES = ["01-clasp", "02-part", "03-open", "04-wide", "05-swing", "06-clap", "06b-clap-lit", "07-final"]

WHITE = 238  # every channel above this counts as paper
GAP_AREA = 60  # enclosed white pockets bigger than this are holes (slivers between hair and neck)
# Eye whites and teeth are enclosed white too; inside the face box they stay.
FACE = (455, 50, 570, 185)  # x0, y0, x1, y1 in source pixels
PAD = 12


def matte(rgb: np.ndarray) -> np.ndarray:
    paper = rgb.min(axis=2) > WHITE
    labels, n = ndimage.label(paper)
    border = set(np.unique(np.concatenate([labels[0], labels[-1], labels[:, 0], labels[:, -1]])))
    sizes = ndimage.sum(paper, labels, range(n + 1))
    centres = ndimage.center_of_mass(paper, labels, range(1, n + 1))
    x0, y0, x1, y1 = FACE

    def in_face(i: int) -> bool:
        cy, cx = centres[i - 1]
        return x0 <= cx <= x1 and y0 <= cy <= y1

    bg_ids = [i for i in range(1, n + 1) if i in border or (sizes[i] > GAP_AREA and not in_face(i))]
    bg = np.isin(labels, bg_ids)

    # The figure is the largest solid piece; drop specks and the generator's corner mark.
    solid, m = ndimage.label(~bg)
    if m > 1:
        areas = ndimage.sum(~bg, solid, range(m + 1))
        bg |= solid != int(np.argmax(areas[1:]) + 1)

    alpha = np.where(bg, 0.0, 1.0)
    # Soft edge: inside a 3px band around the background, take alpha from how far the pixel is from white.
    band = ndimage.binary_dilation(bg, iterations=3) & ~bg
    from_white = (1 - rgb / 255.0).max(axis=2)
    alpha[band] = np.clip((from_white[band] - 0.08) * 1.9, 0, 1)
    return alpha


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    frames = []
    for name in FRAMES:
        rgb = np.asarray(Image.open(RAW / f"{name}.png").convert("RGB")).astype(np.float64)
        frames.append((name, rgb, matte(rgb)))

    ys, xs = np.nonzero(np.any([a > 0.02 for _, _, a in frames], axis=0))
    h, w = frames[0][1].shape[:2]
    top, left = max(0, ys.min() - PAD), max(0, xs.min() - PAD)
    bottom, right = min(h, ys.max() + PAD + 1), min(w, xs.max() + PAD + 1)
    print(f"source {w}x{h}, crop x {left}-{right} y {top}-{bottom} -> {right - left}x{bottom - top}")

    for name, rgb, a in frames:
        # Un-premultiply from white so edge pixels carry their ink colour, not a grey fringe.
        safe = np.maximum(a, 1e-3)[..., None]
        color = np.clip((rgb - (1 - a[..., None]) * 255) / safe, 0, 255)
        rgba = np.dstack([color, a * 255]).astype(np.uint8)[top:bottom, left:right]
        out = OUT / f"{name}.webp"
        Image.fromarray(rgba, "RGBA").save(out, "WEBP", quality=90, method=6)
        print(f"{out.relative_to(ROOT)}  {out.stat().st_size // 1024} KB")


if __name__ == "__main__":
    main()
