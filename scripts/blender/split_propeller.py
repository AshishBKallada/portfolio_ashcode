"""
Cut the hero biplane's propeller out of its single Hunyuan mesh so it can spin.

  blender -b -P scripts/blender/split_propeller.py -- <in.glb> <out.glb>

Run on the output of optimize_glb.py. Writes two meshes: "body", and "prop"
with its origin on the hub, so HeroPlane spins it about its local z (the
glTF forward axis, nose toward +z).

The cut, in Blender's frame (nose toward -y, hub at HUB): every face whose
centre is in front of the cowling face and within the blade radius, plus the
blades' outer parts that sweep back past it. The lower cowling lip leans
forward (the model is pitched), so the back cut only reaches into the upper
half and past the lip's radius. Tuned by eye on front and side renders.
"""

import math
import os
import sys

import bmesh
import bpy

argv = sys.argv[sys.argv.index("--") + 1 :] if "--" in sys.argv else []
if len(argv) < 2:
    raise SystemExit("usage: split_propeller.py -- <in.glb> <out.glb>")
src, dst = os.path.abspath(argv[0]), os.path.abspath(argv[1])

HUB = (0.0, -0.26, 0.221)
R_BLADE = 0.135  # blade tips
R_COWL = 0.058  # cowling face radius: inside it, only what's in front
R_LIP = 0.1  # lower cowling lip, which leans forward
Y_FACE_UPPER = -0.24  # cowling face, upper half
Y_FACE_LOWER = -0.245  # cowling face, lower half
Y_BLADE = -0.215  # how far back the blades sweep


def is_prop(c):
    x, y, z = c
    r = math.hypot(x - HUB[0], z - HUB[2])
    if r >= R_BLADE:
        return False
    if y < (Y_FACE_UPPER if z > HUB[2] else Y_FACE_LOWER):
        return True
    if y < Y_BLADE and r > R_COWL and (z > HUB[2] or r > R_LIP):
        return True
    # The upper blade's root, swept back over the top of the cowling.
    return y < -0.185 and r > R_COWL and z > 0.262 and abs(x - HUB[0]) < 0.07


bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=src)
body = next(o for o in bpy.context.scene.objects if o.type == "MESH")
bpy.context.view_layer.objects.active = body
body.select_set(True)
bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)

bm = bmesh.new()
bm.from_mesh(body.data)
for f in bm.faces:
    f.select = is_prop(f.calc_center_median())
print(f"[prop] {sum(f.select for f in bm.faces)} of {len(bm.faces)} faces")
bm.to_mesh(body.data)
bm.free()

bpy.ops.object.mode_set(mode="EDIT")
bpy.ops.mesh.separate(type="SELECTED")
bpy.ops.object.mode_set(mode="OBJECT")
prop = next(o for o in bpy.context.scene.objects if o.type == "MESH" and o != body)
body.name, prop.name = "body", "prop"

bpy.ops.object.select_all(action="DESELECT")
prop.select_set(True)
bpy.context.view_layer.objects.active = prop
bpy.context.scene.cursor.location = HUB
bpy.ops.object.origin_set(type="ORIGIN_CURSOR")

bpy.ops.object.select_all(action="SELECT")
bpy.ops.export_scene.gltf(
    filepath=dst,
    export_format="GLB",
    use_selection=False,
    export_draco_mesh_compression_enable=True,
    export_draco_mesh_compression_level=6,
    export_draco_position_quantization=14,
    export_draco_normal_quantization=10,
    export_draco_texcoord_quantization=12,
    export_image_format="JPEG",
    export_jpeg_quality=92,
    export_animations=False,
    export_skins=False,
    export_morph=False,
    export_yup=True,
)
print(f"[prop] wrote {dst}: {os.path.getsize(dst) / 1e6:.2f} MB")
