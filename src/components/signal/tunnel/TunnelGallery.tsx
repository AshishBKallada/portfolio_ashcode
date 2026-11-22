"use client";

import { Suspense, useEffect, useMemo } from "react";
import { heroWorks } from "@/data/hero";
import { pieceAt } from "@/lib/tunnel/hang";
import { Artwork } from "./Artwork";
import { makeHaloTexture } from "./textures";

/** The works hung along the corridor's outer wall, each loading on its own. */
export function TunnelGallery() {
  const halo = useMemo(() => makeHaloTexture(), []);
  useEffect(() => () => halo.dispose(), [halo]);
  return (
    <>
      {heroWorks.map((work, i) => (
        <Suspense key={work.src} fallback={null}>
          <Artwork work={work} s={pieceAt(i)} halo={halo} />
        </Suspense>
      ))}
    </>
  );
}
