"""
Builds the hero's flip frames (HeroFlip) from the cutouts in art/hero-flip/.

Each pose is listed with the angle it's drawn at (`drawn`: 0 when drawn
upright, as the prompts ask) and the angle round the flip it shows (`angle`).
The script turns every pose to its angle, scales it to the hero cutout (by the
tool that drew it: each tool's own redraw of the takeoff pose, calibrate-*.png,
sets that), centres its centre of mass on one square canvas and writes
public/images/hero/flip/flip-NN.webp. Paste the printed constants into
src/lib/hero.ts.

  python3 -m venv /tmp/flipenv && /tmp/flipenv/bin/pip install pillow numpy
  /tmp/flipenv/bin/python scripts/hero-flip-frames.py      (needs cwebp)
"""
import json, os, subprocess, tempfile
import numpy as np
from PIL import Image

ART = "art/hero-flip"
OUT = "public/images/hero/flip"
REF = "public/images/hero/hero-figure-winged-courier.png"
SIDE = 1600

# file, tool that drew it, angle it's drawn at, angle round the flip (clockwise).
POSES = [
    ("pose-040.png", "gpt", 40, 40),
    ("pose-125.png", "gpt", 125, 125),
    ("pose-270.png", "gem", 280, 270),
    ("pose-330.png", "gem", 200, 330),
]


def alpha(im):
    return np.asarray(im.getchannel("A"), dtype=np.float32) / 255


def bbox_wh(a):
    ys, xs = np.where(a > 0.5)
    return xs.max() - xs.min() + 1, ys.max() - ys.min() + 1


def centroid(a):
    ys, xs = np.indices(a.shape)
    return (xs * a).sum() / a.sum(), (ys * a).sum() / a.sum()


def calibration(path):
    im = Image.open(path)
    if im.mode == "RGBA" and alpha(im).min() < 0.5:
        return bbox_wh(alpha(im))
    # Still on its plain ground: key it off the corner's colour.
    rgb = np.asarray(im.convert("RGB"), dtype=np.float32)
    ground = rgb[5:40, 5:40].reshape(-1, 3).mean(0)
    return bbox_wh((np.abs(rgb - ground).sum(2) > 45).astype(np.float32))


ref = Image.open(REF).convert("RGBA")
rw, rh = bbox_wh(alpha(ref))
scale = {}
for tool in ("gpt", "gem"):
    w, h = calibration(f"{ART}/calibrate-{tool}.png")
    scale[tool] = (rw / w + rh / h) / 2

placed = [(ref, 0)]
for name, tool, drawn, angle in POSES:
    im = Image.open(f"{ART}/{name}").convert("RGBA")
    im = im.resize((round(im.width * scale[tool]), round(im.height * scale[tool])), Image.LANCZOS)
    # PIL turns counter-clockwise: a negative angle turns the pose on round the flip.
    im = im.rotate(-(angle - drawn), expand=True, resample=Image.BICUBIC)
    placed.append((im, angle))

# Big enough for any pose turned any way about its centre of mass (HeroFlip turns them on by up to half a gap).
radius = 0
centres = []
for im, _ in placed:
    a = alpha(im)
    cx, cy = centroid(a)
    ys, xs = np.where(a > 0.05)
    radius = max(radius, np.sqrt((xs - cx) ** 2 + (ys - cy) ** 2).max())
    centres.append((cx, cy))
L = int(np.ceil(2 * radius * 1.02))

os.makedirs(OUT, exist_ok=True)
for old in os.listdir(OUT):
    os.remove(f"{OUT}/{old}")
srcs = []
with tempfile.TemporaryDirectory() as tmp:
    for i, ((im, angle), (cx, cy)) in enumerate(zip(placed, centres)):
        if i == 0:
            continue  # The takeoff is HERO_FIGURE itself.
        canvas = Image.new("RGBA", (L, L))
        canvas.alpha_composite(im, (round(L / 2 - cx), round(L / 2 - cy)))
        png = f"{tmp}/{i}.png"
        canvas.resize((SIDE, SIDE), Image.LANCZOS).save(png)
        dst = f"{OUT}/flip-{i:02d}.webp"
        subprocess.run(["cwebp", "-quiet", "-q", "86", "-alpha_q", "100", "-m", "6", png, "-o", dst], check=True)
        srcs.append({"src": "/" + dst.removeprefix("public/"), "angle": angle})

rcx, rcy = centres[0]
print("HERO_FLIP_POSES =", json.dumps(srcs, indent=2))
print("HERO_FLIP_CANVAS =", json.dumps({
    "left": round((rcx - L / 2) / ref.width, 4), "top": round((rcy - L / 2) / ref.height, 4),
    "width": round(L / ref.width, 4), "height": round(L / ref.height, 4)}))
print("HERO_FLIP_ORIGIN =", json.dumps({"x": round(rcx / ref.width, 4), "y": round(rcy / ref.height, 4)}))
