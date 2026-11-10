"""
Cuts the Hunyuan 3D courier export (about 1.5M faces, 83MB) down for the web: centred,
scaled to 1 unit across, decimated to <target> triangles, 2K WebP textures, Draco.
The normal map carries the fine detail the decimation drops.

    blender -b --python scripts/blender/optimize_courier.py -- <hunyuan.glb> <out.glb> 90000

Its output is the input to rig_courier.py.
"""
import bpy, sys
src, out, target = sys.argv[-3], sys.argv[-2], int(sys.argv[-1])
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=src)
o = [x for x in bpy.data.objects if x.type == 'MESH'][0]
bpy.context.view_layer.objects.active = o; o.select_set(True)
# Origin at the model's centre, scaled so his height is 1 unit.
bpy.ops.object.origin_set(type='ORIGIN_GEOMETRY', center='BOUNDS')
o.location = (0, 0, 0)
s = 1 / max(o.dimensions); o.scale = [c * s for c in o.scale]
bpy.ops.object.transform_apply(location=True, rotation=False, scale=True)
tris = sum(len(p.vertices) - 2 for p in o.data.polygons)
m = o.modifiers.new("dec", 'DECIMATE'); m.ratio = target / tris
bpy.ops.object.modifier_apply(modifier="dec")
print("TRIS", tris, "->", sum(len(p.vertices) - 2 for p in o.data.polygons))
for img in bpy.data.images:
    if img.size[0] > 2048: img.scale(2048, 2048)
bpy.ops.export_scene.gltf(filepath=out, export_format='GLB', use_selection=True,
    export_draco_mesh_compression_enable=True, export_draco_mesh_compression_level=6,
    export_image_format='WEBP', export_image_quality=85, export_animations=False)
print("DONE")
