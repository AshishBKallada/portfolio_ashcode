"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { mainScrollScroller, prefersReducedMotion } from "../lib/main-scroller";

gsap.registerPlugin(ScrollTrigger);

const LINKEDIN_URL = "https://www.linkedin.com";

type GalleryImage = {
  src: string;
  fallback: string;
  alt: string;
};

const LINKEDIN_IMAGES: GalleryImage[] = [
  {
    src: "/linkedin/post-1.png",
    fallback: "/Screenshot%20(300).png",
    alt: "LinkedIn screenshot 1",
  },
  {
    src: "/linkedin/post-2.png",
    fallback: "/Screenshot%20(301).png",
    alt: "LinkedIn screenshot 2",
  },
  {
    src: "/linkedin/post-3.png",
    fallback: "/Screenshot%20(302).png",
    alt: "LinkedIn screenshot 3",
  },
  {
    src: "/linkedin/post-4.png",
    fallback: "/Screenshot%20(303).png",
    alt: "LinkedIn screenshot 4",
  },
  {
    src: "/linkedin/post-5.png",
    fallback: "/Screenshot%202026-05-24%20203437.png",
    alt: "LinkedIn screenshot 5",
  },
];

const IMAGE_LAYOUT = [
  { rotate: -10, hoverRotate: -14, hoverY: -6, z: 1 },
  { rotate: -5, hoverRotate: -8, hoverY: -8, z: 2 },
  { rotate: 0, hoverRotate: 0, hoverY: -10, z: 3 },
  { rotate: 5, hoverRotate: 8, hoverY: -8, z: 4 },
  { rotate: 10, hoverRotate: 14, hoverY: -6, z: 5 },
];

function FanImage({
  image,
  layout,
  index,
  isHovered,
  priority = false,
}: {
  image: GalleryImage;
  layout: (typeof IMAGE_LAYOUT)[number];
  index: number;
  isHovered: boolean;
  priority?: boolean;
}) {
  const [src, setSrc] = useState(image.src);
  const rotate = isHovered ? layout.hoverRotate : layout.rotate;
  const translateY = isHovered ? layout.hoverY : 0;

  return (
    <div
      className="relative shrink-0 transition-[transform] duration-300 ease-out will-change-transform"
      style={{
        zIndex: layout.z,
        marginLeft: index === 0 ? 0 : "clamp(-3rem, -9vw, -4.75rem)",
        transform: `rotate(${rotate}deg) translateY(${translateY}px)`,
      }}
    >
      <div className="relative h-[clamp(10.75rem,31vw,17rem)] w-[clamp(7.5rem,23vw,12.25rem)] overflow-hidden rounded-xl shadow-[0_18px_40px_rgba(15,23,42,0.14)] md:rounded-[1.35rem]">
        <Image
          src={src}
          alt={image.alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 24vw, 200px"
          priority={priority}
          onError={() => {
            if (src !== image.fallback) setSrc(image.fallback);
          }}
        />
      </div>
    </div>
  );
}

export default function LinkedInGallerySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const gallery = galleryRef.current;
    if (!section || !gallery || prefersReducedMotion()) return;

    const scroller = mainScrollScroller();
    const sc = scroller ? { scroller } : {};

    const ctx = gsap.context(() => {
      gsap.fromTo(
        gallery,
        { y: 32, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 85%",
            toggleActions: "play none none reverse",
            ...sc,
          },
        },
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="linkedin"
      className="relative w-full shrink-0 overflow-hidden bg-white py-14 md:py-20 lg:py-24"
      aria-label="LinkedIn gallery"
    >
      <div className="mx-auto flex w-full max-w-[min(100%,88rem)] flex-col items-center px-3 sm:px-4">
        <div
          ref={galleryRef}
          className="flex w-full items-center justify-center overflow-x-auto overflow-y-visible pb-2 pt-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <div className="flex items-center justify-center px-2 md:px-4">
            {LINKEDIN_IMAGES.map((image, index) => (
              <FanImage
                key={image.src}
                image={image}
                layout={IMAGE_LAYOUT[index]}
                index={index}
                isHovered={hovered}
                priority={index === 2}
              />
            ))}
          </div>
        </div>

        <Link
          href={LINKEDIN_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 font-safiro text-sm font-medium text-[#3d2e26] transition hover:text-[#5f7d52] md:mt-10 md:text-[15px]"
        >
          View on LinkedIn →
        </Link>
      </div>
    </section>
  );
}
