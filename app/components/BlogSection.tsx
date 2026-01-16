"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

interface BlogPost {
  date: string;
  name: string;
  slug: string;
}

const blogPosts: BlogPost[] = [
  {
    date: "2026.1.11",
    name: "The Creative Website Guide",
    slug: "the-creative-website-guide",
  },
  {
    date: "2025.12.22",
    name: "How to rewire your brain to be addicted to coding",
    slug: "how-to-rewire-your-brain-to-be-addicted-to-coding",
  },
  {
    date: "2025.12.15",
    name: "Everything You Need to Know To Make A Good Developer Portfolio Site",
    slug: "everything-you-need-to-know-to-make-a-good-developer-portfolio-site",
  },
];

export default function BlogSection() {
  const rightMarqueeRef = useRef<HTMLDivElement>(null);
  const isScrollingDown = useRef(false);
  const rightMarqueeAnimation = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    const rightMarquee = rightMarqueeRef.current;
    if (!rightMarquee) return;

    const rightFirstItem = rightMarquee.querySelector<HTMLElement>(':first-child');
    const rightWidth = rightFirstItem ? rightFirstItem.offsetWidth * 4 : 0;

    rightMarqueeAnimation.current = gsap.to(rightMarquee, {
      x: rightWidth,
      duration: 20,
      ease: "none",
      repeat: -1,
    });

    const handleWheel = (e: WheelEvent) => {
      const rightFirstItem = rightMarquee.querySelector<HTMLElement>(':first-child');
      const rightWidth = rightFirstItem ? rightFirstItem.offsetWidth * 4 : 0;

      if (e.deltaY > 0 && !isScrollingDown.current) {
        isScrollingDown.current = true;
        rightMarqueeAnimation.current?.kill();

        rightMarqueeAnimation.current = gsap.to(rightMarquee, {
          x: -rightWidth,
          duration: 20,
          ease: "none",
          repeat: -1,
        });
      } else if (e.deltaY < 0 && isScrollingDown.current) {
        isScrollingDown.current = false;
        rightMarqueeAnimation.current?.kill();

        rightMarqueeAnimation.current = gsap.to(rightMarquee, {
          x: rightWidth,
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

  const marqueeText = "BLOG • THOUGHTS • INSIGHTS • GROWTH";
  const marqueeItems = Array(8).fill(null);

  return (
    <div className="min-h-screen w-full bg-white text-black relative overflow-hidden">
      <div className="absolute bottom-0 left-0 w-full overflow-hidden border-t border-black/10 py-3">
        <div ref={rightMarqueeRef} className="flex whitespace-nowrap">
          {marqueeItems.map((_, i) => (
            <div key={`right-${i}`} className="inline-block px-8 flex-shrink-0">
              <span className="text-sm md:text-base font-medium text-black/60">
                {marqueeText}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="min-h-screen w-full px-6 md:px-12 lg:px-16 py-12 md:py-16 flex items-center justify-center relative z-10">
        <div className="max-w-[1600px] mx-auto flex flex-col gap-8 w-full">
        <div className="relative inline-block">
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold leading-none">
            Blog<sup className="align-super text-xs md:text-sm ml-2 mb-12 font-normal">(3)</sup>
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-12 lg:gap-20 items-start">
          <div className="flex flex-col gap-3">
            <h2 className="text-xs md:text-sm uppercase tracking-wider font-semibold text-black border-b border-black/20 pb-3">
              ABOUT
            </h2>
            <p className="text-sm leading-relaxed text-black/80 max-w-md pb-3">
              Here&apos;s where I share my thoughts, insights, and growth. New blog article monthly, released towards the end of every month. (also planning to create a newsletter soon.)
            </p>
          </div>

          <div className="flex flex-col">
            <div className="grid grid-cols-[140px_1fr] md:grid-cols-[160px_1fr] gap-6 pb-3 border-b border-black/20 mb-0">
              <div className="text-xs md:text-sm uppercase tracking-wider font-semibold text-black/60">
                DATE
              </div>
              <div className="text-xs md:text-sm uppercase tracking-wider font-semibold text-black/60">
                NAME
              </div>
            </div>

            <div className="flex flex-col">
              {blogPosts.map((post, index) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className={`group grid grid-cols-[140px_1fr] md:grid-cols-[160px_1fr] gap-6 py-3 transition-colors duration-200 cursor-pointer hover:bg-black ${index < blogPosts.length - 1 ? 'border-b border-black/20' : ''}`}
                >
                  <div className="text-sm md:text-base text-black group-hover:text-white transition-colors duration-200">{post.date}</div>
                  <div className="text-sm md:text-base text-black group-hover:text-white transition-colors duration-200 flex items-center justify-between">
                    <span>{post.name}</span>
                    <span className="text-lg font-bold group-hover:text-white text-black/70">+</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}

