import * as THREE from "three";
import { rimMaterial } from "./materials";
import { irisTexture } from "./textures";
import { sphericalPanel } from "./visor";

/** Scales the head so it is 2 deep and puts its sphere's centre at the origin. */
export function normaliseHead(root: THREE.Object3D) {
  const box = new THREE.Box3().setFromObject(root);
  const size = box.getSize(new THREE.Vector3());
  root.scale.multiplyScalar(2 / size.z);
  root.updateMatrixWorld(true);
  box.setFromObject(root);
  const c = box.getCenter(new THREE.Vector3());
  root.position.set(-c.x, -(box.min.y + 1), -c.z);
  root.updateMatrixWorld(true);
}

const meshesOf = (root: THREE.Object3D) => {
  const out: THREE.Mesh[] = [];
  root.traverse((o) => {
    if ((o as THREE.Mesh).isMesh && !(o.parent as THREE.Mesh)?.isMesh) out.push(o as THREE.Mesh);
  });
  return out;
};

/** Points near the sphere get normals pointing straight out, so reflections run perfectly smooth. */
function sphereNormals(root: THREE.Object3D, R: number) {
  const p = new THREE.Vector3();
  const m3 = new THREE.Matrix3();
  for (const mesh of meshesOf(root)) {
    const pos = mesh.geometry.getAttribute("position");
    const nor = mesh.geometry.getAttribute("normal");
    if (!pos || !nor) continue;
    m3.setFromMatrix4(mesh.matrixWorld).transpose();
    for (let i = 0; i < pos.count; i++) {
      p.fromBufferAttribute(pos, i).applyMatrix4(mesh.matrixWorld);
      if (Math.abs(p.length() - R) > 0.07 * R) continue;
      p.normalize().applyMatrix3(m3).normalize();
      nor.setXYZ(i, p.x, p.y, p.z);
    }
    nor.needsUpdate = true;
  }
}

export type Eyes = { groups: THREE.Group[]; pupils: THREE.Group[]; theme: (accent: THREE.Color, glow: THREE.Texture) => void };
export type Antenna = { sprites: THREE.Sprite[]; theme: (accent: THREE.Color, glow: THREE.Texture) => void };

const eyeMat = (params: THREE.MeshBasicMaterialParameters) =>
  new THREE.MeshBasicMaterial({ ...params, toneMapped: false, depthWrite: false, depthTest: false });

function addEyes(head: THREE.Group, R: number, accent: THREE.Color, glow: THREE.Texture): Eyes {
  const groups: THREE.Group[] = [];
  const pupils: THREE.Group[] = [];
  const halos: THREE.MeshBasicMaterial[] = [];
  const rings: THREE.MeshBasicMaterial[] = [];
  const irises: THREE.MeshBasicMaterial[] = [];
  let iris = irisTexture(accent);
  for (const x of [-0.43, 0.43]) {
    const y = -0.08;
    const rr = R * 1.055;
    const eye = new THREE.Group();
    eye.position.set(x, y, Math.sqrt(rr * rr - x * x - y * y));
    eye.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), eye.position.clone().normalize());
    const add = (geo: THREE.BufferGeometry, mat: THREE.Material, z: number, order: number, parent: THREE.Object3D = eye) => {
      const m = new THREE.Mesh(geo, mat);
      m.position.z = z;
      m.renderOrder = order;
      parent.add(m);
      return m;
    };
    const halo = eyeMat({ map: glow, color: accent, transparent: true, opacity: 0.24, blending: THREE.AdditiveBlending });
    const ring = eyeMat({ color: accent.clone().multiplyScalar(1.4) });
    const irisMat = eyeMat({ map: iris, color: new THREE.Color(1, 1, 1) });
    add(new THREE.CircleGeometry(0.42, 48), halo, -0.004, 9);
    add(new THREE.RingGeometry(0.168, 0.212, 64), ring, 0, 10);
    add(new THREE.CircleGeometry(0.17, 48), irisMat, 0.001, 10);
    const pupil = new THREE.Group();
    eye.add(pupil);
    add(new THREE.CircleGeometry(0.083, 40), eyeMat({ color: "#07040f" }), 0.003, 10, pupil);
    const glint = add(new THREE.CircleGeometry(0.022, 20), eyeMat({ color: "#ffffff" }), 0.005, 10, pupil);
    glint.position.x = 0.032;
    glint.position.y = 0.034;
    head.add(eye);
    groups.push(eye);
    pupils.push(pupil);
    halos.push(halo);
    rings.push(ring);
    irises.push(irisMat);
  }
  return {
    groups,
    pupils,
    theme: (a, g) => {
      iris.dispose();
      iris = irisTexture(a);
      halos.forEach((m) => {
        m.color.copy(a);
        m.map = g;
      });
      rings.forEach((m) => m.color.copy(a).multiplyScalar(1.4));
      irises.forEach((m) => {
        m.map = iris;
        m.needsUpdate = true;
      });
    },
  };
}

function addAntennaBalls(head: THREE.Group, root: THREE.Object3D, accent: THREE.Color, glow: THREE.Texture): Antenna {
  const left: THREE.Vector3[] = [];
  const right: THREE.Vector3[] = [];
  const p = new THREE.Vector3();
  for (const mesh of meshesOf(root)) {
    const pos = mesh.geometry.getAttribute("position");
    for (let i = 0; i < pos.count; i++) {
      p.fromBufferAttribute(pos, i).applyMatrix4(mesh.matrixWorld);
      if (p.y > 0.75 && Math.abs(p.x) > 0.15) (p.x < 0 ? left : right).push(p.clone());
    }
  }
  const balls: THREE.MeshPhysicalMaterial[] = [];
  const sprites: THREE.Sprite[] = [];
  for (const side of [left, right]) {
    if (!side.length) continue;
    const top = side.reduce((a, b) => (b.y > a.y ? b : a));
    const near = side.filter((v) => v.distanceTo(top) < 0.2);
    const c = near.reduce((a, b) => a.add(b), new THREE.Vector3()).divideScalar(near.length);
    c.y = Math.max(c.y, top.y - 0.1);
    const mat = new THREE.MeshPhysicalMaterial({
      color: accent,
      emissive: accent,
      emissiveIntensity: 0.8,
      roughness: 0.22,
      clearcoat: 1,
      clearcoatRoughness: 0.14,
    });
    const ball = new THREE.Mesh(new THREE.SphereGeometry(0.118, 32, 16), mat);
    ball.position.copy(c);
    const sprite = new THREE.Sprite(
      new THREE.SpriteMaterial({ map: glow, color: accent, opacity: 0.5, blending: THREE.AdditiveBlending, depthWrite: false }),
    );
    sprite.scale.setScalar(0.5);
    sprite.position.copy(c);
    head.add(ball, sprite);
    balls.push(mat);
    sprites.push(sprite);
  }
  return {
    sprites,
    theme: (a, g) => {
      balls.forEach((m) => {
        m.color.copy(a);
        m.emissive.copy(a);
      });
      sprites.forEach((s) => {
        s.material.color.copy(a);
        s.material.map = g;
      });
    },
  };
}

/**
 * Fits the visor and eyes to the head's sphere and lights its antennae.
 * `root` must already be normalised and the head at the origin.
 */
export function mountHead(head: THREE.Group, root: THREE.Object3D, accent: THREE.Color, glow: THREE.Texture) {
  head.add(root);
  head.updateMatrixWorld(true);
  const ray = new THREE.Raycaster(new THREE.Vector3(0, 0, 5), new THREE.Vector3(0, 0, -1));
  const hit = ray.intersectObject(root, true).find((h) => (h.object as THREE.Mesh).material instanceof THREE.MeshPhysicalMaterial);
  const R = THREE.MathUtils.clamp(hit ? hit.point.length() : 1, 0.85, 1.1);
  sphereNormals(root, R);

  const bezel = new THREE.Mesh(
    sphericalPanel(1.86, 1.12, 0.46, -0.07, R * 1.03),
    new THREE.MeshPhysicalMaterial({ color: "#0c0c10", roughness: 0.3, metalness: 0.3, clearcoat: 0.8, polygonOffset: true, polygonOffsetFactor: -6, polygonOffsetUnits: -6 }),
  );
  bezel.renderOrder = 3;
  const glass = new THREE.Mesh(
    sphericalPanel(1.74, 1.0, 0.4, -0.07, R * 1.036),
    new THREE.MeshPhysicalMaterial({ color: "#000000", roughness: 0.12, clearcoat: 1, clearcoatRoughness: 0.1, envMapIntensity: 0.9, polygonOffset: true, polygonOffsetFactor: -8, polygonOffsetUnits: -8 }),
  );
  glass.renderOrder = 4;
  head.add(bezel, glass);

  return { eyes: addEyes(head, R, accent, glow), antenna: addAntennaBalls(head, root, accent, glow) };
}

/** A stand-in head if the model can't load: a glossy sphere with ear caps and antennae. */
export function fallbackHead(accent: THREE.Color) {
  const root = new THREE.Group();
  const shell = new THREE.MeshPhysicalMaterial({ color: "#2c2c35", roughness: 0.26, clearcoat: 1 });
  const sphere = new THREE.Mesh(new THREE.SphereGeometry(1, 64, 48), shell);
  const rim = rimMaterial(accent, 4.5, 0.32);
  sphere.add(new THREE.Mesh(sphere.geometry, rim));
  root.add(sphere);
  for (const s of [-1, 1]) {
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.16, 40), shell);
    cap.rotation.z = Math.PI / 2;
    cap.position.x = s * 1.02;
    const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.5, 16), shell);
    rod.position.set(s * 0.45, 1.05, 0);
    rod.rotation.z = -s * 0.35;
    root.add(cap, rod);
  }
  return { root, rims: [rim] };
}
