"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { floorGeometry, wallGeometry } from "@/lib/tunnel/geometry";
import { HALF } from "@/lib/tunnel/path";

/** The corridor itself: two walls and the floor, one shared white material with baked corner shade. */
export function Corridor() {
  const { left, right, floor, material } = useMemo(
    () => ({
      left: wallGeometry(HALF),
      right: wallGeometry(-HALF),
      floor: floorGeometry(),
      material: new THREE.MeshLambertMaterial({
        color: "#ffffff",
        vertexColors: true,
        side: THREE.DoubleSide,
      }),
    }),
    [],
  );
  return (
    <>
      <mesh geometry={left} material={material} />
      <mesh geometry={right} material={material} />
      <mesh geometry={floor} material={material} />
    </>
  );
}
