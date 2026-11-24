import type { Metadata } from "next";
import { CornerPlayer } from "@/components/signal/CornerPlayer";
import { SignalNav } from "@/components/signal/SignalNav";
import { SkyHero } from "@/components/signal/SkyHero";
import { MiniContact } from "@/components/single/MiniContact";
import { PostsRail } from "@/components/single/PostsRail";
import { ProjectsRail } from "@/components/single/ProjectsRail";
import { TapToCollapse } from "@/components/single/TapToCollapse";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

// A single screen: the desert hero, LinkedIn posts running up the left edge, projects running
// down the right, and a small contact panel in the bottom right. Nothing below it.
export default function Home() {
  return (
    <div className="single-screen relative h-[100svh] min-h-[600px] overflow-hidden">
      {/* The scene first, so the nav card and player paint over it. */}
      <SkyHero />
      <SignalNav />
      <CornerPlayer />
      <PostsRail />
      <ProjectsRail />
      <MiniContact />
      <TapToCollapse />
    </div>
  );
}
