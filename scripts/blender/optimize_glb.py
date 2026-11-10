"""
Optimize a Hunyuan 3D GLB for the web hero (courier, plane...).

  blender -b -P scripts/blender/optimize_glb.py -- <in.glb> <out.glb> [target_tris] [tex_size]

What it does, and why each step matters for on-screen clarity:
  - Decimates the mesh to target_tris (default 120k). Hunyuan's 1.5M-face
    export is far more than a hero canvas can show; the texture carries the
    detail, so fewer triangles cost nothing visible and save megabytes.
  - Resizes every texture to tex_size (default 2048) and re-saves as JPEG/PNG,
    which is where the clarity lives: never ship below 2048 for a hero.
  - Merges by distance and recomputes smooth normals, so the decimated shell
    shades cleanly.
  - Drops the metallic/roughness texture for constants (cloth and leather read
    the same at hero scale) and writes textures as JPEG: base colour and
    normal at 2048 come to ~1.5 MB instead of ~11 MB as PNG.
  - Exports GLB with Draco compression (decoded in the browser from /draco).
"""

import os
import sys

import bpy

argv = sys.argv[sys.argv.index("--") + 1 :] if "--" in sys.argv else []
if len(argv) < 2:
    raise SystemExit("usage: optimize_glb.py -- <in.glb> <out.glb> [target_tris] [tex_size]")
src, dst = os.path.abspath(argv[0]), os.path.abspath(argv[1])
target_tris = int(argv[2]) if len(argv) > 2 else 120_000
tex_size = int(argv[3]) if len(argv) > 3 else 2048

bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=src)

meshes = [o for o in bpy.context.scene.objects if o.type == "MESH"]
if not meshes:
    raise SystemExit("no mesh in " + src)

total = sum(len(o.data.polygons) for o in meshes)
print(f"[optimize] {len(meshes)} mesh(es), {total} faces in")

for o in meshes:
    bpy.context.view_layer.objects.active = o
    o.select_set(True)
    # Weld seams so decimation doesn't tear the shell open.
    bpy.ops.object.mode_set(mode="EDIT")
    bpy.ops.mesh.select_all(action="SELECT")
    bpy.ops.mesh.remove_doubles(threshold=0.0001)
    bpy.ops.object.mode_set(mode="OBJECT")
    faces = len(o.data.polygons)
    share = faces / total
    ratio = min(1.0, (target_tris * share) / max(faces, 1))
    if ratio < 1.0:
        mod = o.modifiers.new("decimate", "DECIMATE")
        mod.ratio = ratio
        mod.use_collapse_triangulate = True
        bpy.ops.object.modifier_apply(modifier=mod.name)
    o.data.shade_smooth()
    o.select_set(False)

print(f"[optimize] {sum(len(o.data.polygons) for o in meshes)} faces out")

# Textures: cap at tex_size, keep as packed images so the exporter embeds them.
for img in bpy.data.images:
    if img.size[0] == 0:
        continue
    w, h = img.size
    print(f"[optimize] texture {img.name}: {w}x{h}, {img.file_format}")
    if max(w, h) > tex_size:
        s = tex_size / max(w, h)
        img.scale(int(w * s), int(h * s))
        print(f"[optimize]   -> {img.size[0]}x{img.size[1]}")
    img.pack()

# Metallic/roughness map out, constants in.
for mat in bpy.data.materials:
    if not mat.use_nodes:
        continue
    tree = mat.node_tree
    bsdf = next((n for n in tree.nodes if n.type == "BSDF_PRINCIPLED"), None)
    if not bsdf:
        continue
    for name, value in (("Metallic", 0.0), ("Roughness", 0.8)):
        sock = bsdf.inputs[name]
        for link in list(sock.links):
            tree.links.remove(link)
        sock.default_value = value
    for n in [n for n in tree.nodes if n.type in ("SEPARATE_COLOR", "SEPRGB") or (n.type == "TEX_IMAGE" and n.image and "metallic" in n.image.name)]:
        tree.nodes.remove(n)

os.makedirs(os.path.dirname(dst), exist_ok=True)
bpy.ops.export_scene.gltf(
    filepath=dst,
    export_format="GLB",
    export_apply=True,
    export_draco_mesh_compression_enable=True,
    export_draco_mesh_compression_level=6,
    export_draco_position_quantization=14,
    export_draco_normal_quantization=10,
    export_draco_texcoord_quantization=12,
    export_image_format="JPEG",
    export_jpeg_quality=88,
    export_animations=False,
    export_skins=False,
    export_morph=False,
    export_yup=True,
)
print(f"[optimize] wrote {dst}: {os.path.getsize(dst) / 1e6:.2f} MB")
