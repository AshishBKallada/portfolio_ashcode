import type { Metadata } from "next";
import { SignalNav } from "@/components/signal/SignalNav";
import { SkyHero } from "@/components/signal/SkyHero";
import { HandCursor } from "@/components/single/HandCursor";
import { HoverPreview } from "@/components/single/HoverPreview";
import { PostsRail } from "@/components/single/PostsRail";
import { ProjectsRail } from "@/components/single/ProjectsRail";
import { TapToCollapse } from "@/components/single/TapToCollapse";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

// A single screen: the desert hero, LinkedIn posts running up the left edge, projects running
// down the right; contact lives in the AshCode card. Nothing below it.
export default function Home() {
  return (
    <div className="single-screen relative h-[100svh] min-h-[600px] overflow-hidden">
      {/* The scene first, so the nav card paints over it. The record lives in the courier's suitcase. */}
      <SkyHero />
      <SignalNav />
      <PostsRail />
      <ProjectsRail />
      <TapToCollapse />
      <HoverPreview />
      <HandCursor />
    </div>
  );
}
