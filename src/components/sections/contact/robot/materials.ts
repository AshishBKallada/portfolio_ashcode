import * as THREE from "three";
import { mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js";

/** A Fresnel edge light: brightest where the surface turns away from the camera. */
export function rimMaterial(color: THREE.Color, power: number, strength: number) {
  return new THREE.ShaderMaterial({
    uniforms: { uColor: { value: color.clone() }, uPower: { value: power }, uStrength: { value: strength } },
    vertexShader: `
      varying vec3 vN;
      varying vec3 vV;
      void main() {
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        vN = normalize(normalMatrix * normal);
        vV = normalize(-mv.xyz);
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: `
      uniform vec3 uColor;
      uniform float uPower;
      uniform float uStrength;
      varying vec3 vN;
      varying vec3 vV;
      void main() {
        float f = pow(1.0 - max(dot(normalize(vN), normalize(vV)), 0.0), uPower);
        gl_FragColor = vec4(uColor * f * uStrength, f);
      }`,
    blending: THREE.AdditiveBlending,
    transparent: true,
    depthWrite: false,
  });
}

export type ModelLook = {
  glossy: boolean;
  tint: string;
  rim?: { power: number; strength: number };
  smooth?: boolean;
};

/**
 * Gives every mesh of a model the robot's plastic and, with `rim`, an edge-light
 * shell. The meshes are gathered first: adding shells inside traverse would
 * visit them too. Returns the rim materials, so the theme can recolour them.
 */
export function prepareModel(root: THREE.Object3D, look: ModelLook, accent: THREE.Color) {
  const meshes: THREE.Mesh[] = [];
  root.traverse((o) => {
    if ((o as THREE.Mesh).isMesh) meshes.push(o as THREE.Mesh);
  });
  const rims: THREE.ShaderMaterial[] = [];
  for (const mesh of meshes) {
    if (look.smooth) {
      const g = mesh.geometry.clone();
      for (const name of ["normal", "uv", "uv1", "tangent", "color"]) g.deleteAttribute(name);
      const merged = mergeVertices(g, 1e-3);
      merged.computeVertexNormals();
      mesh.geometry = merged;
    }
    mesh.material = new THREE.MeshPhysicalMaterial(
      look.glossy
        ? { color: look.tint, metalness: 0.1, roughness: 0.3, clearcoat: 1, clearcoatRoughness: 0.16, envMapIntensity: 0.9 }
        : { color: look.tint, metalness: 0, roughness: 0.48, clearcoat: 0.3, clearcoatRoughness: 0.4, envMapIntensity: 0.55 },
    );
    if (look.rim) {
      const rim = rimMaterial(accent, look.rim.power, look.rim.strength);
      const shell = new THREE.Mesh(mesh.geometry, rim);
      shell.renderOrder = 2;
      mesh.add(shell);
      rims.push(rim);
    }
  }
  return rims;
}
