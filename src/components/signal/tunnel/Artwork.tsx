"use client";

import { useTexture } from "@react-three/drei";
import { useEffect, useMemo } from "react";
import * as THREE from "three";
import type { HeroWork } from "@/data/hero";
import { HALF, at, headingAt } from "@/lib/tunnel/path";
import { makeLabelTexture } from "./textures";

/** The tallest and widest a work may be and its centre height (m). */
const ART = { maxH: 1.5, maxW: 2.2, centre: 1.85 };
/** How far off the outer wall a work hangs (m): clear of the wall's curve at the halo's ends. */
const OFF_WALL = 0.12;

/**
 * One work on the outer (right) wall at `s` metres along: a soft arched glow on the wall
 * behind it, the picture on a thin white mount, and its label under the lower-left corner.
 */
export function Artwork({ work, s, halo }: { work: HeroWork; s: number; halo: THREE.Texture }) {
  const map = useTexture(work.src, (t) => {
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 8;
  });
  const label = useMemo(() => makeLabelTexture(work.title, work.note), [work.title, work.note]);
  useEffect(() => () => label.dispose(), [label]);

  const w = Math.min(ART.maxW, ART.maxH * work.aspect);
  const h = w / work.aspect;
  const head = headingAt(s);
  // Facing into the corridor from the right wall: plus the left normal.
  const turn = Math.atan2(-Math.cos(head), Math.sin(head));

  return (
    <group position={at(s, -(HALF - OFF_WALL), ART.centre)} rotation={[0, turn, 0]}>
      <mesh position={[0, 0.22, -OFF_WALL + 0.05]}>
        <planeGeometry args={[w * 1.45, h * 1.5 + 0.7]} />
        <meshBasicMaterial map={halo} transparent depthWrite={false} toneMapped={false} />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[w + 0.08, h + 0.08, 0.04]} />
        <meshLambertMaterial color="#f7f7f5" />
      </mesh>
      <mesh position={[0, 0, 0.021]}>
        <planeGeometry args={[w, h]} />
        <meshBasicMaterial map={map} toneMapped={false} />
      </mesh>
      <mesh position={[-w / 2 + 0.25, -h / 2 - 0.2, 0.005]}>
        <planeGeometry args={[0.5, 0.172]} />
        <meshBasicMaterial map={label} toneMapped={false} />
      </mesh>
    </group>
  );
}
