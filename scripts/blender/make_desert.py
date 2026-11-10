"""
Builds the hero's desert as a 3D world and writes the GLB the site loads
(public/models/desert/desert.glb), plus a tiling sand-ripple normal map beside it.

    blender -b --python scripts/blender/make_desert.py -- public/models/desert [preview-dir]

The world, in Blender's axes (z up; glTF export turns it y up, so Blender +y becomes the
site's -z, straight ahead of the camera):

  Terrain  a 420 m square of dunes from layered noise, ridged so the crests read sharp,
           flat on a stage round the camera and the courier's approach from the left, and
           calmer out toward the horizon so it sits level under the sky photograph.
  Mound    a rise 48 m ahead with a flat top, where the photograph's portal stood.
  Portal   the gold door frame on the mound, leaning a touch, bevelled so it catches light.
  Moon     the white sphere behind the frame, and the shards breaking off its left shoulder
           (named Shard.*, so the site can drift them).

Everything is in metres; the camera stands 1.7 m up at the origin.
"""
import math
import os
import sys

import bpy
import numpy as np
from mathutils import Vector, noise

args = sys.argv[sys.argv.index("--") + 1:]
OUT_DIR = args[0]
PREVIEW = args[1] if len(args) > 1 else None
os.makedirs(OUT_DIR, exist_ok=True)

bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene

SIZE = 420.0
N = 200
# The flat stage: a rounded box round the camera and the lane the courier leaps in along.
STAGE_C = Vector((-5.0, 8.0))
STAGE_HALF = Vector((17.0, 10.0))
STAGE_FEATHER = 9.0
MOUND_C = Vector((0.0, 48.0))
MOUND_H = 7.0
MOUND_SIGMA = 15.0
MOUND_TOP_R = 6.0


def fbm(p, octaves=4):
    return noise.fractal(p, 1.0, 2.0, octaves)


def smoothstep(e0, e1, x):
    t = min(1.0, max(0.0, (x - e0) / (e1 - e0)))
    return t * t * (3 - 2 * t)


def dune_height(x, y):
    p = Vector((x, y, 0.0))
    broad = fbm(p * 0.011 + Vector((3.1, 7.7, 0)), 3)
    ridge = 1.0 - abs(noise.noise(p * 0.02 + Vector((11.0, 5.0, 0))))
    mid = fbm(p * 0.038 + Vector((40.0, 2.0, 0)), 3)
    fine = fbm(p * 0.13, 2)
    h = broad * 6.0 + ridge * ridge * 3.2 + mid * 1.5 + fine * 0.25
    # Calmer toward the horizon: the far edge must read level under the photograph's.
    r = math.hypot(x, y)
    h *= 1.0 - 0.6 * smoothstep(120.0, 200.0, r)
    # The stage, flattened to 0 with a soft shoulder.
    dx = max(abs(x - STAGE_C.x) - STAGE_HALF.x, 0.0)
    dy = max(abs(y - STAGE_C.y) - STAGE_HALF.y, 0.0)
    stage = 1.0 - smoothstep(0.0, STAGE_FEATHER, math.hypot(dx, dy))
    h *= 1.0 - stage
    # The mound ahead, its top flattened for the portal.
    dm = (Vector((x, y)) - MOUND_C).length
    mound = MOUND_H * math.exp(-(dm * dm) / (2 * MOUND_SIGMA * MOUND_SIGMA))
    h += mound
    top = 1.0 - smoothstep(0.0, MOUND_TOP_R, dm)
    h = h * (1 - top) + MOUND_H * top
    return h


# ---- terrain ---------------------------------------------------------------------------
xs = np.linspace(-SIZE / 2, SIZE / 2, N + 1)
verts = []
heights = np.zeros((N + 1, N + 1))
for j, y in enumerate(xs):
    for i, x in enumerate(xs):
        h = dune_height(float(x), float(y))
        heights[j, i] = h
        verts.append((float(x), float(y), h))
faces = []
for j in range(N):
    for i in range(N):
        a = j * (N + 1) + i
        faces.append((a, a + 1, a + N + 2, a + N + 1))
mesh = bpy.data.meshes.new("Terrain")
mesh.from_pydata(verts, [], faces)
mesh.update()
uv = mesh.uv_layers.new(name="UVMap")
loops = mesh.loops
for poly in mesh.polygons:
    for li in poly.loop_indices:
        v = mesh.vertices[loops[li].vertex_index].co
        uv.data[li].uv = (v.x / SIZE + 0.5, v.y / SIZE + 0.5)
for poly in mesh.polygons:
    poly.use_smooth = True
terrain = bpy.data.objects.new("Terrain", mesh)
scene.collection.objects.link(terrain)
sand = bpy.data.materials.new("Sand")
sand.use_nodes = True
bsdf = sand.node_tree.nodes["Principled BSDF"]
bsdf.inputs["Base Color"].default_value = (0.80, 0.60, 0.36, 1)
bsdf.inputs["Roughness"].default_value = 1.0
terrain.data.materials.append(sand)
print("TERRAIN verts", len(verts), "tris", len(faces) * 2,
      "stage h", round(dune_height(0, 0), 3), round(dune_height(-14, 10), 3),
      "mound top", round(dune_height(*MOUND_C), 3))

# ---- portal ----------------------------------------------------------------------------
gold = bpy.data.materials.new("Gold")
gold.use_nodes = True
g = gold.node_tree.nodes["Principled BSDF"]
g.inputs["Base Color"].default_value = (0.83, 0.58, 0.18, 1)
g.inputs["Metallic"].default_value = 1.0
g.inputs["Roughness"].default_value = 0.32

INNER_W, INNER_H = 6.0, 13.0
BAR, DEPTH = 0.9, 0.7


def bar(name, size, loc):
    bpy.ops.mesh.primitive_cube_add(size=1, location=loc)
    o = bpy.context.object
    o.name = name
    o.scale = size
    bpy.ops.object.transform_apply(scale=True)
    return o


parts = [
    bar("post_l", (BAR, DEPTH, INNER_H + BAR), (-(INNER_W + BAR) / 2, 0, (INNER_H + BAR) / 2)),
    bar("post_r", (BAR, DEPTH, INNER_H + BAR), ((INNER_W + BAR) / 2, 0, (INNER_H + BAR) / 2)),
    bar("lintel", (INNER_W + 2 * BAR, DEPTH, BAR), (0, 0, INNER_H + BAR / 2)),
]
for p in parts:
    p.select_set(True)
bpy.context.view_layer.objects.active = parts[0]
bpy.ops.object.join()
portal = bpy.context.object
portal.name = "Portal"
bpy.ops.object.mode_set(mode="EDIT")
bpy.ops.mesh.select_all(action="SELECT")
bpy.ops.mesh.remove_doubles()
bpy.ops.object.mode_set(mode="OBJECT")
bev = portal.modifiers.new("bevel", "BEVEL")
bev.width = 0.07
bev.segments = 3
bev.limit_method = "ANGLE"
portal.data.materials.append(gold)
for poly in portal.data.polygons:
    poly.use_smooth = False
portal.location = (MOUND_C.x, MOUND_C.y, MOUND_H - 0.15)
# A slight lean, as the photograph's frame leans.
portal.rotation_euler = (0, math.radians(2.5), math.radians(-4))

# ---- moon and shards -------------------------------------------------------------------
white = bpy.data.materials.new("Moon")
white.use_nodes = True
w = white.node_tree.nodes["Principled BSDF"]
w.inputs["Base Color"].default_value = (0.96, 0.96, 0.94, 1)
w.inputs["Roughness"].default_value = 0.7

MOON_C = Vector((-1.5, 58.0, 9.0))
MOON_R = 4.6
bpy.ops.mesh.primitive_uv_sphere_add(radius=MOON_R, segments=48, ring_count=24, location=MOON_C)
moon = bpy.context.object
moon.name = "Moon"
bpy.ops.object.shade_smooth()
moon.data.materials.append(white)

rng = np.random.default_rng(7)
for k in range(18):
    d = Vector((-1.0, 0.15, 0.45)) + Vector(rng.normal(0, 0.28, 3))
    d.normalize()
    dist = MOON_R + 0.4 + rng.random() ** 1.6 * 7.0
    s = 0.22 + rng.random() * 0.55 * (1 - dist / 14)
    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=1, radius=s, location=MOON_C + d * dist)
    sh = bpy.context.object
    sh.name = f"Shard.{k:03d}"
    sh.scale = (1 + rng.random() * 0.8, 1 + rng.random() * 0.4, 0.5 + rng.random() * 0.5)
    sh.rotation_euler = rng.random(3) * math.tau
    sh.data.materials.append(white)

# ---- export ----------------------------------------------------------------------------
bpy.ops.object.select_all(action="SELECT")
glb = os.path.join(OUT_DIR, "desert.glb")
bpy.ops.export_scene.gltf(
    filepath=glb,
    export_format="GLB",
    use_selection=True,
    export_apply=True,
    export_yup=True,
    export_animations=False,
    export_draco_mesh_compression_enable=True,
    export_draco_mesh_compression_level=6,
)
print("GLB", glb, os.path.getsize(glb))

# ---- sand ripple normal map ------------------------------------------------------------
# Tileable by construction: every term is periodic over the tile. Ripples run across the
# wind, warped and broken by larger noise, with a fine grain over them.
R = 1024
u, v = np.meshgrid(np.linspace(0, 1, R, endpoint=False), np.linspace(0, 1, R, endpoint=False))
tau = math.tau


def periodic_noise(u, v, seed, terms=6, base=2):
    rs = np.random.default_rng(seed)
    out = np.zeros_like(u)
    for _ in range(terms):
        fx, fy = rs.integers(1, base + 1, 2)
        ph = rs.random() * tau
        out += np.sin(tau * (fx * u + fy * v) + ph) / terms
    return out


warp = periodic_noise(u, v, 1, 8, 3) * 0.9 + periodic_noise(u, v, 2, 8, 7) * 0.25
ripple = np.sin(tau * 26 * v + warp * 4.0 + np.sin(tau * 4 * u) * 0.6)
# Crests sharper than troughs.
ripple = np.sign(ripple) * np.abs(ripple) ** 0.7
second = np.sin(tau * (31 * v + 9 * u) + warp * 3.0) * 0.35
grain = periodic_noise(u, v, 3, 12, 60) * 0.25
h = ripple * 0.6 + second + grain
# Gradient on a periodic grid.
dhdu = (np.roll(h, -1, axis=1) - np.roll(h, 1, axis=1)) * (R / 2)
dhdv = (np.roll(h, -1, axis=0) - np.roll(h, 1, axis=0)) * (R / 2)
STRENGTH = 0.012
nx, ny = -dhdu * STRENGTH, -dhdv * STRENGTH
nz = np.ones_like(h)
length = np.sqrt(nx * nx + ny * ny + nz * nz)
rgba = np.ones((R, R, 4), dtype=np.float32)
rgba[..., 0] = nx / length * 0.5 + 0.5
rgba[..., 1] = ny / length * 0.5 + 0.5
rgba[..., 2] = nz / length * 0.5 + 0.5
img = bpy.data.images.new("sand-normal", R, R, alpha=False)
img.pixels.foreach_set(rgba.ravel())
scene.render.image_settings.file_format = "WEBP"
scene.render.image_settings.quality = 92
scene.render.image_settings.color_mode = "RGB"
npath = os.path.join(OUT_DIR, "sand-normal.webp")
img.save_render(npath)
print("NORMAL", npath, os.path.getsize(npath))

# ---- previews ----------------------------------------------------------------------------
if PREVIEW:
    os.makedirs(PREVIEW, exist_ok=True)
    scene.render.engine = "BLENDER_WORKBENCH"
    scene.display.shading.light = "STUDIO"
    scene.display.shading.color_type = "MATERIAL"
    scene.render.image_settings.file_format = "PNG"
    scene.render.resolution_x, scene.render.resolution_y = 1280, 720
    cam_data = bpy.data.cameras.new("cam")
    cam_data.lens_unit = "FOV"
    cam_data.angle = math.radians(72)
    cam_data.clip_end = 1000
    cam = bpy.data.objects.new("cam", cam_data)
    scene.collection.objects.link(cam)
    scene.camera = cam
    # From where the visitor stands, and from up behind, to check the layout.
    for name, loc, rot in (
        ("hero", (0, 0, 1.7), (math.radians(90), 0, 0)),
        ("layout", (0, -70, 60), (math.radians(45), 0, 0)),
    ):
        cam.location = loc
        cam.rotation_euler = rot
        scene.render.filepath = os.path.join(PREVIEW, f"desert-{name}.png")
        bpy.ops.render.render(write_still=True)
        print("PREVIEW", scene.render.filepath)
print("DONE")
