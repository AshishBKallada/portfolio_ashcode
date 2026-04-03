"use client";

import Link from "next/link";
import Image from "next/image";

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

export default function BlogSection() {
  return (
    <div
      id="blog"
      className="flex min-h-full w-full flex-1 flex-col justify-center bg-white px-6 py-4 text-black md:px-12 md:py-6 lg:px-16"
    >
      <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-6 md:gap-8">
        {/* Heading */}
        <div className="relative inline-block max-w-full">
          <div className="flex flex-wrap items-start gap-3 sm:items-center">
            <h1 className="font-chaney text-5xl font-bold leading-none text-black md:text-6xl lg:text-7xl">
              Blog
              <sup className="ml-2 align-super text-xs font-normal md:text-sm">
                (3)
              </sup>
            </h1>

            <div className="flex-shrink-0 sm:-mt-1 md:-mt-2">
              <Image
                src="/arrowblack1.png"
                alt=""
                width={52}
                height={52}
                className="object-contain md:h-[60px] md:w-[60px]"
              />
            </div>

            <p className="w-full font-safiro text-[0.5rem] italic text-orange-500 sm:ml-2 sm:w-auto md:text-[0.65rem] lg:text-xs">
              felt cute <br /> might delete later
            </p>
          </div>
        </div>

        {/* About — directly under heading */}
        <div className="flex max-w-2xl flex-col gap-2">
          <h2 className="border-b border-black/20 pb-2 font-safiro text-xs font-semibold uppercase tracking-wider text-black md:pb-3 md:text-sm">
            ABOUT
          </h2>
          <p className="text-sm leading-snug text-black/80 md:text-base md:leading-relaxed">
            Here&apos;s where I share my thoughts, insights, and growth. New blog
            article monthly, released towards the end of every month. (also planning
            to create a newsletter soon.)
          </p>
        </div>

        {/* Post list — below about */}
        <div className="flex w-full flex-col border-t border-black/15 pt-5 md:pt-6">
          <div className="mb-0 grid grid-cols-[minmax(0,7rem)_1fr] gap-4 border-b border-black/20 pb-2 sm:grid-cols-[140px_1fr] md:grid-cols-[160px_1fr] md:gap-6 md:pb-3">
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
                className={`group grid cursor-pointer grid-cols-[minmax(0,7rem)_1fr] gap-4 px-1 py-2 transition-colors duration-200 hover:bg-black focus-visible:bg-black focus-visible:outline-none sm:grid-cols-[140px_1fr] md:grid-cols-[160px_1fr] md:gap-6 md:px-2 md:py-2.5 ${index < blogPosts.length - 1 ? "border-b border-black/20 hover:border-white/25 focus-visible:border-white/25" : ""}`}
              >
                <div className="text-sm text-black transition-colors duration-200 group-hover:text-white group-focus-visible:text-white md:text-base">
                  {post.date}
                </div>
                <div className="flex items-center justify-between gap-3 text-sm text-black transition-colors duration-200 group-hover:text-white group-focus-visible:text-white md:text-base">
                  <span className="min-w-0 leading-snug">{post.name}</span>
                  <span className="shrink-0 text-lg font-bold text-black/60 transition-colors duration-200 group-hover:text-white group-focus-visible:text-white">
                    +
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
