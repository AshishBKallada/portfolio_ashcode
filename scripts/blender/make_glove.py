"""
Builds the cursor's cartoon glove and exports public/models/glove/glove.glb.

    blender -b -P scripts/blender/make_glove.py -- <out.glb> [preview.png]

An original toon glove after the classic pattern: white and puffy, three fingers and a thumb,
three stitched darts on the back of the hand, a flared rolled cuff. It stands on its index and
middle fingers like a pair of legs; those two are separate objects ("FingerIndex",
"FingerMiddle") with their origins at the knuckle, so the page can swing them to walk.
Blender is Z-up with the camera on -Y; the glTF exporter turns that into Y-up.
"""
import bpy
import math
import sys
from mathutils import Vector

argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
OUT = argv[0] if argv else "/tmp/glove.glb"
PREVIEW = argv[1] if len(argv) > 1 else None

bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene


def material(name, color, rough):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    bsdf = m.node_tree.nodes["Principled BSDF"]
    bsdf.inputs["Base Color"].default_value = (*color, 1)
    bsdf.inputs["Roughness"].default_value = rough
    return m


WHITE = material("GloveWhite", (0.95, 0.94, 0.92), 0.45)
BLACK = material("GloveDart", (0.02, 0.02, 0.02), 0.6)


def finish(obj, mat, levels=2):
    obj.data.materials.append(mat)
    sub = obj.modifiers.new("Smooth", "SUBSURF")
    sub.levels = levels
    sub.render_levels = levels
    bpy.context.view_layer.objects.active = obj
    obj.select_set(True)
    bpy.ops.object.modifier_apply(modifier="Smooth")
    bpy.ops.object.shade_smooth()
    obj.select_set(False)
    return obj


def blob(name, loc, scale, rot=(0, 0, 0), mat=WHITE, segs=24):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=segs, ring_count=segs // 2, location=loc, rotation=rot)
    o = bpy.context.active_object
    o.name = name
    o.scale = scale
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    return finish(o, mat, 1)


def finger(name, knuckle, length, radius, tilt_x=0.0, tilt_y=0.0):
    """A sausage hanging from its knuckle: the origin sits at the knuckle, the tip points down."""
    bpy.ops.mesh.primitive_uv_sphere_add(segments=24, ring_count=12, location=(0, 0, 0))
    o = bpy.context.active_object
    o.name = name
    # Slightly fuller at the tip, the way toon fingers swell.
    o.scale = (radius, radius, length / 2)
    bpy.ops.object.transform_apply(scale=True)
    for v in o.data.vertices:
        t = (-v.co.z / (length / 2) + 1) / 2  # 0 at the knuckle, 1 at the tip
        v.co.x *= 0.92 + 0.16 * t
        v.co.y *= 0.92 + 0.16 * t
        v.co.z -= length / 2  # hang below the origin
    o.location = knuckle
    o.rotation_euler = (tilt_x, tilt_y, 0)
    return finish(o, WHITE, 1)


# --- Back of the hand, facing the camera (-Y) ---
palm = blob("Palm", (0, 0, 1.2), (0.5, 0.27, 0.44), rot=(0, math.radians(-6), 0))

# Thumb, curled across the front; ring finger tucked under.
thumb = blob("Thumb", (-0.47, -0.06, 1.04), (0.13, 0.13, 0.27), rot=(math.radians(18), math.radians(32), 0))
ring = blob("Ring", (0.3, -0.02, 0.9), (0.14, 0.13, 0.18), rot=(math.radians(-30), math.radians(-25), 0))

# The three darts: short black welts on the back, fanning slightly toward the knuckles.
darts = []
for i, (x, ang) in enumerate(((-0.15, 10), (0.0, 0), (0.15, -10))):
    d = blob(f"Dart{i}", (x, -0.245, 1.4), (0.028, 0.03, 0.13), rot=(math.radians(-14), math.radians(ang), 0), mat=BLACK, segs=16)
    darts.append(d)

# The cuff: a flared, rolled tube up and to the right of the wrist.
bpy.ops.mesh.primitive_cone_add(vertices=40, radius1=0.27, radius2=0.37, depth=0.26, end_fill_type="NOTHING", location=(0, 0, 0))
cuff = bpy.context.active_object
cuff.name = "Cuff"
sol = cuff.modifiers.new("Thick", "SOLIDIFY")
sol.thickness = 0.05
sol.offset = 0
bpy.context.view_layer.objects.active = cuff
cuff.select_set(True)
bpy.ops.object.modifier_apply(modifier="Thick")
cuff.select_set(False)
bpy.ops.mesh.primitive_torus_add(major_radius=0.37, minor_radius=0.07, major_segments=40, minor_segments=14, location=(0, 0, 0.13))
roll = bpy.context.active_object
roll.name = "CuffRoll"
for o in (cuff, roll):
    o.select_set(True)
bpy.context.view_layer.objects.active = cuff
bpy.ops.object.join()
cuff.location = (0.3, 0.0, 1.58)
cuff.rotation_euler = (0, math.radians(38), 0)
finish(cuff, WHITE, 1)

# The wrist: a short black arm running out of the cuff, the way toon characters' arms do.
axis = Vector((math.sin(math.radians(38)), 0, math.cos(math.radians(38))))
bpy.ops.mesh.primitive_cylinder_add(vertices=24, radius=0.17, depth=0.55, location=Vector((0.3, 0.0, 1.58)) + axis * 0.32)
wrist = bpy.context.active_object
wrist.name = "Wrist"
wrist.rotation_euler = (0, math.radians(38), 0)
finish(wrist, BLACK, 1)

# Join the still parts into one "Hand" (two materials: white, and black for the darts and wrist).
for o in (palm, thumb, ring, cuff, wrist, *darts):
    o.select_set(True)
bpy.context.view_layer.objects.active = palm
bpy.ops.object.join()
palm.name = "Hand"
palm.select_set(False)

# --- The legs: index in front, middle behind, origins at the knuckles ---
finger("FingerIndex", (-0.17, -0.04, 1.02), 0.98, 0.155, tilt_x=math.radians(4), tilt_y=math.radians(10))
finger("FingerMiddle", (0.11, 0.05, 1.02), 1.0, 0.155, tilt_x=math.radians(-4), tilt_y=math.radians(-8))

# Everything sits with the fingertips on z=0.
bpy.ops.export_scene.gltf(filepath=OUT, export_format="GLB", export_apply=True, export_yup=True)
print("exported", OUT)

if PREVIEW:
    cam_data = bpy.data.cameras.new("Cam")
    cam = bpy.data.objects.new("Cam", cam_data)
    scene.collection.objects.link(cam)
    cam.location = (0.9, -4.2, 1.4)
    cam.rotation_euler = (math.radians(86), 0, math.radians(12))
    cam_data.lens = 70
    scene.camera = cam
    sun = bpy.data.objects.new("Sun", bpy.data.lights.new("Sun", "SUN"))
    sun.data.energy = 3.5
    sun.rotation_euler = (math.radians(50), math.radians(-20), math.radians(-30))
    scene.collection.objects.link(sun)
    world = bpy.data.worlds.new("W")
    world.use_nodes = True
    world.node_tree.nodes["Background"].inputs[0].default_value = (0.55, 0.42, 0.3, 1)
    world.node_tree.nodes["Background"].inputs[1].default_value = 0.6
    scene.world = world
    scene.render.engine = "BLENDER_EEVEE_NEXT"
    scene.render.resolution_x = 600
    scene.render.resolution_y = 600
    scene.render.filepath = PREVIEW
    bpy.ops.render.render(write_still=True)
    print("preview", PREVIEW)
