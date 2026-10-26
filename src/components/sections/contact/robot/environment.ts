import * as THREE from "three";

/**
 * A dark studio for reflections: round softboxes (spheres, never planes, so
 * highlights stay soft) — white key, strip and top lights, and two back
 * lights and a floor bounce in the page's own colour, so the plastic picks
 * up the page around it.
 */
export function studioEnvironment(renderer: THREE.WebGLRenderer, page: THREE.Color) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#030305");
  const ball = new THREE.SphereGeometry(0.5, 32, 16);
  const box = (color: THREE.Color, w: number, h: number, pos: [number, number, number], k: number) => {
    const m = new THREE.Mesh(ball, new THREE.MeshBasicMaterial({ color: color.clone().multiplyScalar(k) }));
    m.scale.set(w, h, 0.3);
    m.position.set(...pos);
    m.lookAt(0, 0, 0);
    scene.add(m);
  };
  const white = new THREE.Color(1, 1, 1);
  box(white, 5, 3.2, [-3, 4.5, 4], 3.2);
  box(white, 1.2, 6, [6, 0.5, 2], 1.1);
  box(white, 3, 1, [1.5, 5, -1], 0.8);
  box(page, 4, 5, [-5, 0, -4], 1.0);
  box(page, 4, 5, [5, 0, -4], 1.0);
  box(page, 6, 3, [0, -5, 1], 0.35);
  const pmrem = new THREE.PMREMGenerator(renderer);
  const target = pmrem.fromScene(scene, 0.02);
  pmrem.dispose();
  ball.dispose();
  scene.traverse((o) => ((o as THREE.Mesh).material as THREE.Material | undefined)?.dispose?.());
  return target;
}
