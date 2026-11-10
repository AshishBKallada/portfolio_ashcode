"""
Gives the hero courier a light rig and one leap cycle, and writes the GLB the site loads
(public/models/courier/courier.glb).

    blender -b --python scripts/blender/optimize_courier.py -- <hunyuan.glb> /tmp/courier-static.glb 90000
    blender -b --python scripts/blender/rig_courier.py -- /tmp/courier-static.glb public/models/courier/courier.glb [preview-prefix]

The courier is one solid mesh in his flying pose (the caped, coloured Hunyuan export), so
there is no T-pose to auto-rig: the joints below were traced from the mesh (points picked
on front, side and top renders of the optimised mesh, which is centred and 1 unit across),
and every vertex is weighted by its distance to the bones, blended smoothly so the robe
and trousers bend with the limbs rather than tear. Head and torso stay on the body bone;
the suitcase goes with the hand that holds it; the cape hangs off a chain of three bones
behind him and the hair off one on top of his head, each kept to its own region of the
mesh so the face and the back of the coat don't wave with them.

The clip "leap" is one second of stepping up through the air, as in the reference sheet
the hero was matched to: he stands upright on a cloud, one leg planted straight down and
the other folded back (contact); in the air that knee drives up in front while the back
leg stretches out behind; then the planted leg reaches down for the next cloud, and
contact again. The arms run the same beats two frames late, so they follow through
behind the legs. HeroCourierIntro scrubs it once per hop, then fades it out after the
last landing so he settles into his own pose.

The clip "idle" is a four-second loop: the cape lifts and ripples down its length, the
hair stirs, and both arms swing a little, the suitcase with its hand. The site loops it
under him the whole time, as he glides in and once he's on the stage.

The whole rig is then turned (POSTURE) so that, seen from the front (-y), he flies toward
+x with his face to the viewer; the site turns him further toward the camera itself.
"""
import math
import sys

import bpy
import numpy as np
from mathutils import Euler, Quaternion, Vector

args = sys.argv[sys.argv.index("--") + 1:]
SRC, OUT = args[0], args[1]
PREVIEW = args[2] if len(args) > 2 else None

# Joints, in Blender world space once the import's Y-up turn is baked (x toward where he's
# heading, -y toward the viewer, z up; 1 unit wide).
PELVIS = (0.0, 0.06, -0.03)
CHEST = (0.12, 0.13, 0.12)
HEAD = (0.22, 0.14, 0.28)
LEGS = {
    # The leg stretched out ahead and toward the viewer, and the one folded under behind.
    "front": {"hip": (0.05, 0.02, -0.02), "knee": (0.27, -0.10, -0.06), "ankle": (0.38, -0.20, -0.13), "toe": (0.46, -0.25, -0.19)},
    "back": {"hip": (-0.03, 0.08, -0.05), "knee": (-0.05, 0.02, -0.18), "ankle": (0.02, 0.07, -0.24), "toe": (0.04, 0.10, -0.28)},
}
ARMS = {
    # The arm reaching ahead, and the one behind holding the suitcase (which goes with it).
    "reach": {"shoulder": (0.20, 0.12, 0.14), "elbow": (0.34, 0.16, 0.07), "hand": (0.47, 0.17, 0.06)},
    "case": {"shoulder": (0.08, 0.17, 0.14), "elbow": (-0.05, 0.14, 0.07), "hand": (-0.12, 0.08, 0.02), "end": (-0.19, 0.02, -0.04)},
}
# The cape, from between the shoulder blades out and down to its trailing corner.
CAPE = [(0.0, 0.22, 0.14), (-0.18, 0.22, 0.10), (-0.34, 0.18, 0.0), (-0.42, 0.14, -0.20)]
# The hair, from eye level up through the crown.
HAIR = ((0.21, 0.15, 0.28), (0.23, 0.13, 0.35))
# Which vertices each may move: the cape only what hangs behind and left of him, clear of the
# suitcase; the hair only the crown and the back of the head, never the face.
def is_cape(co):
    case = (co[:, 0] > -0.28) & (co[:, 0] < -0.09) & (co[:, 1] > -0.07) & (co[:, 1] < 0.11) & (co[:, 2] > -0.12) & (co[:, 2] < 0.06)
    return (co[:, 0] < -0.10) & ~case
def is_hair(co):
    crown = co[:, 2] > 0.295
    back = (co[:, 2] > 0.24) & (co[:, 0] > 0.08) & (co[:, 0] < 0.19) & (co[:, 1] > 0.12)
    return crown | back
# Every bone swings in the screen's plane, about the view's depth axis as the site sees him
# (after POSTURE): negative turns it counter-clockwise on screen. Degrees per bone at each
# beat (contact, in the air, reaching down); "body" stands the whole figure up straight.
SWING = {
    "body": (-10, -6, -10),
    "thigh_front": (34, -22, 16), "shin_front": (-10, 36, 3),
    "thigh_back": (-22, 8, -9), "shin_back": (36, -8, 22),
    "upper_reach": (10, -5, 5), "fore_reach": (5, -3, 2),
    "upper_case": (2, 7, 4), "fore_case": (1, 4, 2),
}
# The idle loop (IDLE_FRAMES at 24 fps): degrees of swing in the screen's plane and of
# flutter in and out of it, per bone, with the cape's beats lagging down its length.
IDLE_FRAMES = 96
IDLE = {
    "cape_1": {"swing": 3.0, "flutter": 2.0, "lag": 0.0},
    "cape_2": {"swing": 7.0, "flutter": 5.0, "lag": 0.18},
    "cape_3": {"swing": 11.0, "flutter": 8.0, "lag": 0.36},
    "hair": {"swing": 6.0, "flutter": 5.0, "lag": 0.1},
    "upper_case": {"swing": 1.5, "flutter": 1.0, "lag": 0.0},
    "fore_case": {"swing": 3.0, "flutter": 1.5, "lag": 0.12},
    "upper_reach": {"swing": 1.5, "flutter": 1.0, "lag": 0.5},
    "fore_reach": {"swing": 2.5, "flutter": 1.5, "lag": 0.62},
}
# Frames (24 fps) of contact, in the air, held, reaching down, contact: legs and body, then
# arms two frames behind.
LEG_FRAMES = (1, 12, 15, 20, 25)
ARM_FRAMES = (3, 14, 17, 22, 25)
POSTURE = (0, 0, 0)  # degrees, XYZ

bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=SRC)
mesh = [o for o in bpy.data.objects if o.type == "MESH"][0]
# The importer leaves the data Y-up under a 90° object turn; bake it so the data is world space.
bpy.context.view_layer.objects.active = mesh; mesh.select_set(True)
bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)

arm_data = bpy.data.armatures.new("CourierRig")
arm = bpy.data.objects.new("CourierRig", arm_data)
bpy.context.scene.collection.objects.link(arm)
bpy.context.view_layer.objects.active = arm
bpy.ops.object.mode_set(mode="EDIT")
eb = arm_data.edit_bones
body = eb.new("body"); body.head, body.tail = PELVIS, CHEST
segments = {"body": [(PELVIS, CHEST), (CHEST, HEAD)]}
def chain(names, points, segs_last):
    parent = body
    for i, name in enumerate(names):
        b = eb.new(name); b.head, b.tail = points[i], points[i + 1]; b.parent = parent
        b.use_connect = parent is not body
        segments[name] = [(points[i], points[i + 1])] + (segs_last if i == len(names) - 1 else [])
        parent = b
for name, leg in LEGS.items():
    chain([f"thigh_{name}", f"shin_{name}"], [leg["hip"], leg["knee"], leg["toe"]], [])
    segments[f"shin_{name}"] = [(leg["knee"], leg["ankle"]), (leg["ankle"], leg["toe"])]
for name, a in ARMS.items():
    chain([f"upper_{name}", f"fore_{name}"], [a["shoulder"], a["elbow"], a["hand"]], [(a["hand"], a["end"])] if "end" in a else [])
chain(["cape_1", "cape_2", "cape_3"], CAPE, [])
chain(["hair"], list(HAIR), [])
bpy.ops.object.mode_set(mode="OBJECT")

# Weights: inverse distance to each bone's segments, sharpened, then normalised.
co = np.empty(len(mesh.data.vertices) * 3); mesh.data.vertices.foreach_get("co", co); co = co.reshape(-1, 3)
def seg_dist(a, b):
    a, b = np.array(a), np.array(b); ab = b - a
    t = np.clip((co - a) @ ab / (ab @ ab), 0, 1)
    return np.linalg.norm(co - (a + np.outer(t, ab)), axis=1)
names = list(segments)
D = np.stack([np.min([seg_dist(a, b) for a, b in segments[n]], axis=0) for n in names], axis=1)
# Nothing above the hips belongs to a leg, nor does the suitcase hanging beside the back leg.
not_leg = (co[:, 2] > PELVIS[2] + 0.03) | ((co[:, 0] < -0.28) & (co[:, 2] > -0.2))
cape, hair = is_cape(co), is_hair(co)
for j, n in enumerate(names):
    if n.startswith(("thigh_", "shin_")):
        D[not_leg, j] = 10
    elif n.startswith("cape_"):
        D[~cape, j] = 10
    elif n == "hair":
        D[~hair, j] = 10
W = 1 / (D + 0.012) ** 6
W /= W.sum(1, keepdims=True)
for j, n in enumerate(names):
    vg = mesh.vertex_groups.new(name=n)
    for i in np.nonzero(W[:, j] > 0.002)[0]:
        vg.add([int(i)], float(W[i, j]), "REPLACE")
mesh.parent = arm
mod = mesh.modifiers.new("rig", "ARMATURE"); mod.object = arm

scene = bpy.context.scene
scene.render.fps = 24
scene.frame_start, scene.frame_end = 1, 25
bpy.context.view_layer.objects.active = arm
arm.animation_data_create()
arm.animation_data.action = bpy.data.actions.new("leap")
# The view's depth axis in the rig's own space, before POSTURE turns the rig.
DEPTH = Euler([math.radians(d) for d in POSTURE], "XYZ").to_matrix().inverted() @ Vector((0, 1, 0))
for bone, (contact, air, down) in SWING.items():
    pb = arm.pose.bones[bone]
    pb.rotation_mode = "QUATERNION"
    rest = arm_data.bones[bone].matrix_local.to_quaternion()
    axis = DEPTH
    keys = list(zip(LEG_FRAMES, (contact, air, air * 0.94, down, contact)))
    if bone.startswith(("upper_", "fore_")):
        # Two frames late, wrapping round: frame 1 picks up where frame 25 left off.
        keys = [(1, contact)] + list(zip(ARM_FRAMES, (contact, air, air * 0.94, down, contact)))
    for frame, deg in keys:
        pb.rotation_quaternion = rest.inverted() @ Quaternion(axis, math.radians(deg)) @ rest
        pb.keyframe_insert("rotation_quaternion", frame=frame)

# The idle loop: every bone's two sines over one cycle, the cape's a beat later down its
# length, as a second action on its own NLA track so both export.
leap_action = arm.animation_data.action
idle = bpy.data.actions.new("idle")
arm.animation_data.action = idle
for bone, p in IDLE.items():
    pb = arm.pose.bones[bone]
    pb.rotation_mode = "QUATERNION"
    rest = arm_data.bones[bone].matrix_local.to_quaternion()
    for frame in range(1, IDLE_FRAMES + 2, 4):
        phase = (frame - 1) / IDLE_FRAMES * math.tau - p["lag"] * math.tau
        swing = math.radians(p["swing"]) * math.sin(phase)
        flutter = math.radians(p["flutter"]) * math.sin(phase * 2 + 0.8)
        pb.rotation_quaternion = rest.inverted() @ Quaternion(DEPTH, swing) @ Quaternion(Vector((0, 0, 1)), flutter) @ rest
        pb.keyframe_insert("rotation_quaternion", frame=frame)
arm.animation_data.action = None
for action in (leap_action, idle):
    track = arm.animation_data.nla_tracks.new()
    track.name = action.name
    track.strips.new(action.name, 1, action)
    track.mute = False

# Turn him (POSTURE), then centre and scale him 1 unit across as seen from the front.
arm.rotation_mode = "XYZ"
arm.rotation_euler = Euler([math.radians(d) for d in POSTURE], "XYZ")
arm.animation_data.nla_tracks["idle"].mute = True
scene.frame_set(1); bpy.context.view_layer.update()
dg = bpy.context.evaluated_depsgraph_get()
ev = mesh.evaluated_get(dg); m = ev.to_mesh()
pts = np.array([(mesh.matrix_world @ v.co)[:] for v in m.vertices]); ev.to_mesh_clear()
lo, hi = pts.min(0), pts.max(0)
s = 1 / (hi[0] - lo[0])
arm.scale = (s, s, s)
arm.location = Vector(-(lo + hi) / 2 * s)
print("POSED BOUNDS", (lo * s).round(3), (hi * s).round(3))
# Where the planted foot's sole is at contact, as the site frames him (x right, z up, 1 unit
# across, centred): HeroCourierIntro puffs each cloud there.
scene.frame_set(1); bpy.context.view_layer.update()
toe = arm.matrix_world @ arm.pose.bones["shin_front"].tail
print("CONTACT FOOT", round(toe.x, 3), round(toe.z, 3))

if PREVIEW:
    scene.render.engine = "BLENDER_WORKBENCH"; scene.render.film_transparent = True
    scene.render.resolution_x = scene.render.resolution_y = 600
    cam = bpy.data.objects.new("cam", bpy.data.cameras.new("cam")); scene.collection.objects.link(cam); scene.camera = cam
    cam.data.type = "ORTHO"; cam.data.ortho_scale = 1.15
    cam.location = (0, -5, 0); cam.rotation_euler = (math.radians(90), 0, 0)
    for f in (1, 13, 20):
        scene.frame_set(f); scene.render.filepath = f"{PREVIEW}-{f:02d}.png"; bpy.ops.render.render(write_still=True)
    scene.frame_set(1)
    arm.animation_data.nla_tracks["leap"].mute = True
    arm.animation_data.nla_tracks["idle"].mute = False
    for f in (1, 25, 49, 73):
        scene.frame_set(f); scene.render.filepath = f"{PREVIEW}-idle-{f:02d}.png"; bpy.ops.render.render(write_still=True)
    arm.animation_data.nla_tracks["leap"].mute = False
    scene.frame_set(1)
arm.animation_data.nla_tracks["idle"].mute = False

bpy.ops.object.select_all(action="DESELECT"); mesh.select_set(True); arm.select_set(True)
bpy.ops.export_scene.gltf(
    filepath=OUT, export_format="GLB", use_selection=True,
    export_skins=True, export_animations=True, export_animation_mode="ACTIONS",
    export_draco_mesh_compression_enable=True, export_draco_mesh_compression_level=6,
    export_image_format="WEBP", export_image_quality=85,
)
print("WROTE", OUT)
