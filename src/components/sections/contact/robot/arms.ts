import * as THREE from "three";
import { rimMaterial } from "./materials";

/** Scales an arm to 0.78 tall, centres it and wraps it, so it turns about its middle. */
export function normaliseArm(obj: THREE.Object3D) {
  const box = new THREE.Box3().setFromObject(obj);
  obj.scale.multiplyScalar(0.78 / box.getSize(new THREE.Vector3()).y);
  obj.updateMatrixWorld(true);
  box.setFromObject(obj);
  obj.position.sub(box.getCenter(new THREE.Vector3()));
  const g = new THREE.Group();
  g.add(obj);
  return g;
}

export const ARM_REST = [
  { x: -1.32, y: -0.72, z: 0.15, rz: -0.62, phase: 0 },
  { x: 1.32, y: -0.72, z: 0.15, rz: 0.62, phase: Math.PI * 0.85 },
] as const;

/** A stand-in arm if the model can't load: a dark capsule with an edge light. */
export function fallbackArm(accent: THREE.Color) {
  const arm = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.22, 0.42, 8, 24),
    new THREE.MeshPhysicalMaterial({ color: "#1b1b21", roughness: 0.48, clearcoat: 0.3 }),
  );
  const rim = rimMaterial(accent, 2.6, 1.05);
  arm.add(new THREE.Mesh(arm.geometry, rim));
  return { arm, rim };
}
