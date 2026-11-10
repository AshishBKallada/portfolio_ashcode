"""
Cuts the Sketchfab magic carpet (about 140k triangles, nearly all of them tassels, far more
than a mat on the sand needs) down for the web: the tassel meshes decimated to <target>
triangles between them, UVs kept, textures as WebP, Draco. The mat itself (2.3k triangles)
is left whole: HeroWorld bends it in its vertex shader, so it needs its vertices. Node and material names are kept, since
HeroWorld picks the meshes (CARPET_0, TASSELS_0) and materials (CARPET, TASSELS) by name.

    blender -b --python scripts/blender/optimize_carpet.py -- public/models/carpet/sketchfab/scene.gltf public/models/carpet/carpet.glb 24000
"""
import bpy, sys
src, out, target = sys.argv[-3], sys.argv[-2], int(sys.argv[-1])
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=src)
meshes = [o for o in bpy.data.objects if o.type == 'MESH']
tris = {o.name: sum(len(p.vertices) - 2 for p in o.data.polygons) for o in meshes}
heavy = [o for o in meshes if tris[o.name] > 5000]
total = sum(tris[o.name] for o in heavy)
for o in meshes:
    bpy.context.view_layer.objects.active = o
    ratio = min(1.0, target / total) if o in heavy else 1.0
    if ratio < 1.0:
        m = o.modifiers.new("dec", 'DECIMATE'); m.ratio = ratio
        bpy.ops.object.modifier_apply(modifier="dec")
    print("MESH", o.name, tris[o.name], "->", sum(len(p.vertices) - 2 for p in o.data.polygons), [m.name for m in o.data.materials])
for img in bpy.data.images:
    if img.size[0] > 2048: img.scale(2048, 2048)
bpy.ops.object.select_all(action='SELECT')
bpy.ops.export_scene.gltf(filepath=out, export_format='GLB',
    export_draco_mesh_compression_enable=True, export_draco_mesh_compression_level=6,
    export_image_format='WEBP', export_image_quality=85, export_animations=False)
print("DONE")
