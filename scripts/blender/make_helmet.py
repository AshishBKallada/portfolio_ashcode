"""
Cut the downloaded cyber-samurai helmet (1.5M faces, three 4K textures, 75 MB) down for the
hero: about 90k faces, 2048 textures as JPEG, Draco-compressed, centred and set upright at
1 unit tall. Run: blender -b -P scripts/blender/make_helmet.py -- <in.glb> <out.glb>
"""
import bpy, sys, mathutils

src, out = sys.argv[-2], sys.argv[-1]
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=src)
obj = [o for o in bpy.data.objects if o.type == "MESH"][0]
bpy.context.view_layer.objects.active = obj
obj.select_set(True)

# Fewer faces; the normal map keeps the fine detail.
mod = obj.modifiers.new("dec", "DECIMATE")
mod.ratio = 90000 / len(obj.data.polygons)
bpy.ops.object.modifier_apply(modifier=mod.name)

# Centre on the origin and scale to 1 unit tall.
bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)
bb = [mathutils.Vector(c) for c in obj.bound_box]
centre = sum(bb, mathutils.Vector()) / 8
obj.data.transform(mathutils.Matrix.Translation(-centre))
h = max(v.z for v in bb) - min(v.z for v in bb)
obj.data.transform(mathutils.Matrix.Scale(1 / h, 4))
obj.location = (0, 0, 0)

for img in bpy.data.images:
    if img.size[0] > 2048:
        img.scale(2048, 2048)

bpy.ops.export_scene.gltf(
    filepath=out,
    export_format="GLB",
    export_image_format="JPEG",
    export_jpeg_quality=82,
    export_draco_mesh_compression_enable=True,
    export_draco_mesh_compression_level=7,
    export_yup=True,
)
print("FACES", len(obj.data.polygons))
