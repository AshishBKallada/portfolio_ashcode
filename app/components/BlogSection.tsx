"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

interface BlogPost {
  date: string;
  name: string;
  slug: string;
}

const blogPosts: BlogPost[] = [
  {
    date: "2026.1.18",
    name: "The 'Rabbit Hole' Ritual: Why Curiosity is a Developer's Secret Weapon",
    slug: "curiosity-driven-learning",
  },
  {
    date: "2026.1.11",
    name: "The Unsung Art: Nurturing Frontend Talent Through Teaching",
    slug: "nurturing-frontend-talent-teaching",
  },
  {
    date: "2025.12.22",
    name: "Beyond the Cursor: Why the Best Developers Switch to 'Scientist Mode'",
    slug: "how-to-rewire-your-brain-to-be-addicted-to-coding",
  },
];

const MARQUEE_TEXT =
  "Ashcode • blog • monthly notes • engineering • curiosity • build in public";

export default function BlogSection() {
  const rightMarqueeRef = useRef<HTMLDivElement>(null);
  const isScrollingDown = useRef(false);
  const rightMarqueeAnimation = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    const rightMarquee = rightMarqueeRef.current;
    if (!rightMarquee) return;

    const rightFirstItem = rightMarquee.querySelector<HTMLElement>(":first-child");
    const rightWidth = rightFirstItem ? rightFirstItem.offsetWidth * 4 : 0;

    rightMarqueeAnimation.current = gsap.to(rightMarquee, {
      x: rightWidth,
      duration: 20,
      ease: "none",
      repeat: -1,
    });

    const handleWheel = (e: WheelEvent) => {
      const first = rightMarquee.querySelector<HTMLElement>(":first-child");
      const width = first ? first.offsetWidth * 4 : 0;

      if (e.deltaY > 0 && !isScrollingDown.current) {
        isScrollingDown.current = true;
        rightMarqueeAnimation.current?.kill();
        rightMarqueeAnimation.current = gsap.to(rightMarquee, {
          x: -width,
          duration: 20,
          ease: "none",
          repeat: -1,
        });
      } else if (e.deltaY < 0 && isScrollingDown.current) {
        isScrollingDown.current = false;
        rightMarqueeAnimation.current?.kill();
        rightMarqueeAnimation.current = gsap.to(rightMarquee, {
          x: width,
          duration: 20,
          ease: "none",
          repeat: -1,
        });
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: true });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      rightMarqueeAnimation.current?.kill();
    };
  }, []);

  const marqueeItems = Array(8).fill(null);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-white text-black">
      <div className="relative h-[18vh] w-full bg-white md:h-[22vh]" />

      <div className="relative z-10 flex w-full items-center justify-center bg-white px-16 py-12 md:py-16">
        <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-8">
          <div className="relative inline-block">
            <div className="flex items-center">
              <h1 className="font-chaney text-6xl font-bold leading-none text-black md:text-7xl lg:text-8xl">
                Blog
                <sup className="mb-12 ml-2 align-super text-xs font-normal md:text-sm">
                  (3)
                </sup>
              </h1>

              <div className="flex-shrink-0">
                <Image
                  src="/arrowblack1.png"
                  alt=""
                  width={60}
                  height={60}
                  className="-mt-16 object-contain"
                />
              </div>

              <p className="-mt-16 font-safiro text-[0.5rem] italic text-black md:text-[0.65rem] lg:text-xs">
                felt cute <br /> might delete later
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[1fr_2fr] lg:gap-20">
            <div className="flex flex-col gap-3">
              <h2 className="border-b border-black/20 pb-3 font-safiro text-xs font-semibold uppercase tracking-wider text-black md:text-sm">
                ABOUT
              </h2>
              <p className="max-w-md pb-3 text-sm leading-relaxed text-black/80">
                Here&apos;s where I share my thoughts, insights, and growth. New blog
                article monthly, released towards the end of every month. (also planning
                to create a newsletter soon.)
              </p>
            </div>

            <div className="flex flex-col">
              <div className="mb-0 grid grid-cols-[140px_1fr] gap-6 border-b border-black/20 pb-3 md:grid-cols-[160px_1fr]">
                <div className="font-safiro text-xs font-semibold uppercase tracking-wider text-black/60 md:text-sm">
                  DATE
                </div>
                <div className="font-safiro text-xs font-semibold uppercase tracking-wider text-black/60 md:text-sm">
                  NAME
                </div>
              </div>

              <div className="flex flex-col">
                {blogPosts.map((post, index) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className={`group grid cursor-pointer grid-cols-[140px_1fr] gap-6 py-3 transition-colors duration-200 hover:bg-black/5 md:grid-cols-[160px_1fr] ${index < blogPosts.length - 1 ? "border-b border-black/20" : ""}`}
                  >
                    <div className="text-sm text-black transition-colors duration-200 group-hover:text-black md:text-base">
                      {post.date}
                    </div>
                    <div className="flex items-center justify-between text-sm text-black transition-colors duration-200 group-hover:text-black md:text-base">
                      <span>{post.name}</span>
                      <span className="text-lg font-bold text-black/60 group-hover:text-black">
                        +
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative w-full flex-1 overflow-hidden bg-white px-6 py-12 md:px-12 md:py-16 lg:px-16 lg:py-32">
        <div className="absolute bottom-0 left-0 w-full overflow-hidden border-t border-black/10 py-3">
          <div ref={rightMarqueeRef} className="flex items-center whitespace-nowrap">
            {marqueeItems.map((_, i) => (
              <span
                key={`marquee-${i}`}
                className="inline-block flex-shrink-0 px-8 font-safiro text-sm font-medium text-black/60 md:text-base"
              >
                {MARQUEE_TEXT}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
