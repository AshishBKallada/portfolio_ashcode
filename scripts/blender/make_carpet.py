"""Build the hero's magic carpet from scratch and export it as a GLB.

Run headless:  blender -b -P scripts/blender/make_carpet.py
Writes public/models/carpet/carpet.glb. An original model (geometry and its woven
pattern are both made here), so it carries no attribution requirement.

The layout matches what HeroCarpet's bending shader expects, in the mesh's own
coordinates: the rug lies in the xy plane, long along y (about ±5.0), ±4.0 across,
at z ≈ 1.97; tassels reach ±5.43 along y. Exported without the Y-up conversion so
those coordinates arrive in glTF as written. Object and material names are the ones
HeroCarpet reads: CARPET_0 (material CARPET) and TASSELS_0 (TASSELS).
"""

import math
import os

import bmesh
import bpy
import numpy as np

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
OUT = os.path.join(ROOT, "public", "models", "carpet", "carpet.glb")

HALF_W, HALF_L, Z = 3.99, 5.02, 1.97
TEX_W, TEX_H = 1024, 1280

bpy.ops.wm.read_factory_settings(use_empty=True)


def hex_rgb(h):
    h = h.lstrip("#")
    return np.array([int(h[i : i + 2], 16) / 255 for i in (0, 2, 4)])


# The mat's palette: an orange field (the Sketchfab original's orange), a navy border,
# teal corners, a blue star medallion, gold work.
ORANGE, ORANGE_D, ORANGE_L = hex_rgb("#d9782f"), hex_rgb("#9a4a1a"), hex_rgb("#eb9a5c")
NAVY, BLUE, BLUE_L = hex_rgb("#1c2860"), hex_rgb("#3558a8"), hex_rgb("#6f8fd0")
TEAL, TEAL_D = hex_rgb("#2e7c78"), hex_rgb("#1d5452")
GOLD, GOLD_D, CREAM = hex_rgb("#d9a648"), hex_rgb("#9c6a24"), hex_rgb("#ecd6a2")


def weave_pattern():
    """The rug's face, as an RGB array: an orange field of cream scrolls, teal corner
    spandrels, a gold-edged lozenge holding a blue star medallion, a navy border of
    gold and orange rosettes between cream guard stripes, a gold edge."""
    a = TEX_H / TEX_W
    v, u = np.mgrid[0:TEX_H, 0:TEX_W].astype(np.float32)
    x, y = u / (TEX_W - 1), v / (TEX_H - 1) * a  # short-side units: x 0..1, y 0..a
    img = np.empty((TEX_H, TEX_W, 3), np.float32)
    dx, dy = np.minimum(x, 1 - x), np.minimum(y, a - y)
    edge = np.minimum(dx, dy)
    along = np.where(dx < dy, y, x)
    # Centred coordinates, and the same folded into one quadrant.
    cx, cy = x - 0.5, y - a / 2
    qx, qy = np.abs(cx), np.abs(cy)

    def paint(mask, col):
        img[mask] = col

    # Field: orange, a lattice of cream scroll curls round gold dots, and darker vines.
    img[:] = ORANGE
    gx, gy = (x * 15) % 1.0 - 0.5, (y * 15) % 1.0 - 0.5
    gr, gth = np.hypot(gx, gy), np.arctan2(gy, gx)
    paint((np.abs(gr - 0.3) < 0.04) & (np.sin(gth + (np.floor(x * 15) + np.floor(y * 15)) * 1.7) > 0.1), CREAM)
    paint(gr < 0.09, GOLD)
    vine = np.abs(np.sin(x * 22 + np.sin(y * 18) * 1.6)) < 0.08
    paint(vine & (gr > 0.36), ORANGE_D)

    # Corner spandrels: teal quarter-lozenges edged in gold, scattered with cream flowers.
    FIELD = 0.155
    sd = (dx - FIELD) / 0.22 + (dy - FIELD) / 0.2
    paint(sd < 1.03, GOLD)
    paint(sd < 0.98, TEAL)
    fx, fy = (x * 26) % 1.0 - 0.5, (y * 26) % 1.0 - 0.5
    fr, fth = np.hypot(fx, fy), np.arctan2(fy, fx)
    flower = fr < 0.28 * (0.55 + 0.45 * np.abs(np.cos(fth * 3)))
    paint((sd < 0.9) & flower & ((np.floor(x * 26) + np.floor(y * 26)) % 2 == 0), CREAM)
    paint((sd < 0.9) & (fr < 0.1), ORANGE)
    
    # Central lozenge: a gold double outline, orange inside with pale scrolls, teal pendants at its tips.
    lz = qx / 0.3 + qy / 0.38
    # Its edge scalloped, the field's scrolls showing through inside.
    lz = lz - 0.012 * np.abs(np.sin((qx - qy) * 70))
    paint((lz < 1.04) & (lz >= 0.94), GOLD)
    paint((lz < 1.0) & (lz >= 0.97), NAVY)
    for sy in (-1, 1):
        px, py = cx, cy - sy * 0.4
        pr = np.hypot(px, py * 1.4)
        pth = np.arctan2(py, px)
        palm = pr < 0.06 * (0.6 + 0.4 * np.abs(np.cos(pth * 2.5)))
        paint(pr < 0.066 * (0.6 + 0.4 * np.abs(np.cos(pth * 2.5))), GOLD)
        paint(palm, TEAL)
        paint(pr < 0.02, CREAM)

    # The star medallion: an eight-point blue star edged in gold, a navy ring, a cream rosette, a red heart.
    r, th = np.hypot(cx, cy), np.arctan2(cy, cx)
    star = 0.12 + 0.07 * np.abs(np.cos(th * 4)) ** 3
    paint(r < star + 0.012, GOLD)
    paint(r < star, BLUE)
    paint((r < star - 0.02) & (np.abs(np.sin(th * 8)) < 0.12), BLUE_L)
    paint(np.abs(r - 0.1) < 0.008, GOLD)
    paint(r < 0.092, NAVY)
    paint(r < 0.075 * (0.6 + 0.4 * np.abs(np.cos(th * 4))), CREAM)
    paint(r < 0.04 * (0.6 + 0.4 * np.abs(np.cos(th * 4 + np.pi / 4))), ORANGE)
    paint(r < 0.012, GOLD)

    # Guards between field and border: a gold rule, a orange band of cream dots, a cream band.
    paint((edge < FIELD) & (edge >= 0.148), GOLD)
    paint((edge < 0.148) & (edge >= 0.133), ORANGE_D)
    dot = np.abs((along * 70) % 1.0 - 0.5) < 0.18
    paint((edge < 0.145) & (edge >= 0.136) & dot, CREAM)
    paint((edge < 0.133) & (edge >= 0.122), CREAM)

    # Border: navy, an undulating gold vine, gold rosettes and orange buds in turn.
    B_IN = 0.026
    border = (edge >= B_IN) & (edge < 0.122)
    paint(border, NAVY)
    mid = (B_IN + 0.122) / 2
    period = 1 / 12
    wave = mid + 0.022 * np.sin(along / period * 2 * np.pi)
    paint(border & (np.abs(edge - wave) < 0.004), GOLD_D)
    ph = (along % period) / period
    for offset, big in ((0.25, True), (0.75, False)):
        bx = (ph - offset) * period
        by = edge - (mid + (0.022 if big else -0.022))
        br, bth = np.hypot(bx, by), np.arctan2(by, bx)
        if big:
            paint(border & (br < 0.026 * (0.6 + 0.4 * np.abs(np.cos(bth * 4)))), GOLD)
            paint(border & (br < 0.012), ORANGE)
        else:
            paint(border & (br < 0.017 * (0.7 + 0.3 * np.abs(np.cos(bth * 3)))), ORANGE_L)
            paint(border & (br < 0.006), CREAM)
    # Corner rosettes square the border off.
    for ccx, ccy in ((mid, mid), (1 - mid, mid), (mid, a - mid), (1 - mid, a - mid)):
        cr = np.hypot(x - ccx, y - ccy)
        paint(border & (cr < 0.045), NAVY)
        paint(border & (cr < 0.038), GOLD)
        paint(border & (cr < 0.026), TEAL)
        paint(border & (cr < 0.01), CREAM)

    # Edge: a gold binding with a dark rule inside it.
    paint(edge < B_IN, GOLD)
    paint(edge < 0.005, GOLD_D)
    paint((edge >= B_IN - 0.005) & (edge < B_IN), GOLD_D)

    # A little weave grain, so it reads as cloth rather than print.
    rng = np.random.default_rng(7)
    grain = rng.normal(0, 0.04, (TEX_H, TEX_W, 1)).astype(np.float32)
    rows = (np.sin(v * 1.7) * 0.025)[..., None]
    return np.clip(img * (1 + grain + rows), 0, 1)


def weave_texture():
    img = weave_pattern()
    rgba = np.concatenate([img, np.ones((TEX_H, TEX_W, 1), np.float32)], axis=2)
    image = bpy.data.images.new("carpet_weave", TEX_W, TEX_H, alpha=False)
    # Blender stores rows bottom-up.
    image.pixels.foreach_set(np.flipud(rgba).ravel())
    image.file_format = "PNG"
    image.pack()
    return image


def material(name, color=None, image=None, rough=0.85, metal=0.0):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes["Principled BSDF"]
    bsdf.inputs["Roughness"].default_value = rough
    bsdf.inputs["Metallic"].default_value = metal
    if image is not None:
        tex = mat.node_tree.nodes.new("ShaderNodeTexImage")
        tex.image = image
        mat.node_tree.links.new(tex.outputs["Color"], bsdf.inputs["Base Color"])
    elif color is not None:
        bsdf.inputs["Base Color"].default_value = (*color, 1)
    return mat


def new_object(name, bm, mat):
    mesh = bpy.data.meshes.new(name)
    bm.to_mesh(mesh)
    bm.free()
    obj = bpy.data.objects.new(name, mesh)
    obj.data.materials.append(mat)
    bpy.context.collection.objects.link(obj)
    return obj


def build_rug(mat):
    """A dense grid, so the shader's billow bends it smoothly, with UVs across its face."""
    bm = bmesh.new()
    bmesh.ops.create_grid(bm, x_segments=48, y_segments=60, size=1.0)
    uv = bm.loops.layers.uv.new()
    for vert in bm.verts:
        vert.co.x *= HALF_W
        vert.co.y *= HALF_L
        vert.co.z = Z
    for face in bm.faces:
        for loop in face.loops:
            loop[uv].uv = (loop.vert.co.x / (2 * HALF_W) + 0.5, loop.vert.co.y / (2 * HALF_L) + 0.5)
    rug = new_object("CARPET_0", bm, mat)
    # A woven slab, not a sheet: about as thick as the original rug (z 1.94 to 2.0).
    solid = rug.modifiers.new("Thickness", "SOLIDIFY")
    solid.thickness = 0.06
    solid.offset = 0.0
    return rug


def strand_cluster(bm, base, out, length, strands, spread, knot):
    """A tassel: a knot at `base` and `strands` cords splaying from it along `out`
    (a unit vector), drooping as they go, each a slim tapered cylinder."""
    from mathutils import Vector

    rng = __import__("random").Random(hash(base) & 0xFFFF)
    bmesh.ops.create_uvsphere(bm, u_segments=10, v_segments=6, radius=knot, matrix=__import__("mathutils").Matrix.Translation(base))
    for _ in range(strands):
        d = Vector(out) + Vector((rng.uniform(-spread, spread), rng.uniform(-spread, spread) * 0.5, rng.uniform(-spread, 0)))
        d.normalize()
        ln = length * rng.uniform(0.8, 1.05)
        res = bmesh.ops.create_cone(bm, cap_ends=True, segments=5, radius1=0.014, radius2=0.006, depth=ln)
        rot = Vector((0, 0, 1)).rotation_difference(d).to_matrix().to_4x4()
        mid = Vector(base) + d * (ln / 2 + knot * 0.5)
        bmesh.ops.transform(bm, matrix=__import__("mathutils").Matrix.Translation(mid) @ rot, verts=res["verts"])


def tassel(bm, base, direction, length, radius):
    """A tapered cord from `base`, pointing along ±y, its tip flared."""
    res = bmesh.ops.create_cone(bm, cap_ends=True, segments=8, radius1=radius, radius2=radius * 1.8, depth=length)
    verts = res["verts"]
    rot = math.pi / 2 * (-1 if direction > 0 else 1)
    bmesh.ops.rotate(bm, verts=verts, cent=(0, 0, 0), matrix=__import__("mathutils").Matrix.Rotation(rot, 3, "X"))
    bmesh.ops.translate(bm, verts=verts, vec=(base[0], base[1] + direction * length / 2, base[2]))


def build_tassels(mat):
    # Four big corner tassels and no fringe: a heavy gold knot at each corner, a dense
    # skirt of strands hanging below it, splaying a little outward.
    corners = bmesh.new()
    for sx in (-1, 1):
        for sy in (-1, 1):
            out = (sx * 0.22, sy * 0.3, -0.93)
            strand_cluster(corners, (sx * HALF_W, sy * HALF_L, Z), out, 1.0, strands=56, spread=0.16, knot=0.12)
    new_object("TASSELS_0", corners, mat)


weave = weave_texture()
build_rug(material("CARPET", image=weave, rough=0.6))
# Gold tassels, to match the border's gold.
build_tassels(material("TASSELS", color=hex_rgb("#b07a22"), rough=0.55, metal=0.15))

os.makedirs(os.path.dirname(OUT), exist_ok=True)
bpy.ops.export_scene.gltf(filepath=OUT, export_format="GLB", export_yup=False, export_apply=True, export_image_format="JPEG", export_jpeg_quality=88)
print("wrote", OUT)
