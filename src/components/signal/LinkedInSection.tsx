"use client";

import { CollectionSurfer, type CollectionItem } from "@/components/ui/collection-surfer";
import { site } from "@/data/site";
import { metaLabel } from "./primitives";

const copy = site.signal.linkedin;
const linkedinUrl = site.socials.find((s) => s.label === "LinkedIn")?.href ?? "";

const items: CollectionItem[] = copy.posts.map((post, index) => ({
  id: index + 1,
  image: post.src,
  title: post.title,
}));

/**
 * LinkedIn inside About — recent work as a 3D scroll-driven row (Collection Surfer).
 */
export function LinkedInSection() {
  return (
    <section id="linkedin" aria-label="LinkedIn" className="relative mt-10 bg-background">
      <CollectionSurfer
        items={items}
        variant="magnetic"
        loop={false}
        scrollPerItemVh={85}
        className="bg-background"
        headline={{ primary: "LinkedIn", secondary: "Recent posts" }}
        scrollHint="Scroll to browse"
        footer={
          <a
            href={linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`${metaLabel} nav-link pointer-events-auto`}
          >
            {copy.cta} ↗
          </a>
        }
      />
    </section>
  );
}
