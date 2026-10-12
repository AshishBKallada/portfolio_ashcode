"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, ViewTransition } from "react";
import { AnchorLink } from "@/components/motion/AnchorLink";
import { buttonOutline } from "@/components/ui/buttonStyles";
import { Placard } from "@/components/ui/Placard";
import { projects } from "@/data/projects";
import { site } from "@/data/site";

gsap.registerPlugin(ScrollTrigger);

const copy = site.projects;

/**
 * The gallery room. On wide screens with motion allowed it pins and walks
 * sideways as you scroll, each picture's canvas drifting inside its frame;
 * otherwise it is a plain swipeable row with snap points.
 */
export function CollectionRoom() {
  const roomRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const room = roomRef.current;
    const track = trackRef.current;
    if (!room || !track) return;

    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      const distance = () => track.scrollWidth - room.clientWidth;
      const walk = gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: room,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      gsap.utils.toArray<HTMLElement>("[data-canvas]", track).forEach((canvas) => {
        gsap.fromTo(
          canvas,
          { xPercent: -5 },
          {
            xPercent: 5,
            ease: "none",
            scrollTrigger: {
              trigger: canvas.closest("[data-artwork]"),
              containerAnimation: walk,
              start: "left right",
              end: "right left",
              scrub: true,
            },
          },
        );
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <div
      ref={roomRef}
      className="relative flex min-h-[80svh] items-center overflow-x-auto overscroll-x-contain [scrollbar-width:none] md:h-dvh md:overflow-hidden"
    >
      <p className="absolute top-24 right-4 hidden font-sans text-[11px] leading-none font-medium tracking-[0.14em] text-ink/70 uppercase sm:right-5 md:block">
        {site.gallery.collection.hint}
      </p>

      <div
        ref={trackRef}
        className="flex w-max snap-x snap-mandatory items-center gap-[clamp(2.5rem,8vw,9rem)] px-4 py-10 will-change-transform sm:px-[8vw]"
      >
        {projects.map((project, i) => (
          <article key={project.slug} data-artwork className="w-[min(78vw,64vh)] shrink-0 snap-center">
            <Link
              href={`/projects/${project.slug}`}
              aria-label={`${project.title}, ${project.year} — view exhibit`}
              className="group relative block"
            >
              {/* Spotlight falling on the picture from above. */}
              <div
                aria-hidden
                className="pointer-events-none absolute -inset-x-[30%] -top-[45%] bottom-[20%] bg-[radial-gradient(ellipse_50%_60%_at_50%_0%,color-mix(in_srgb,var(--paper)_16%,transparent),transparent_75%)] opacity-70 transition-opacity duration-500 group-hover:opacity-100"
              />
              {/* Gilded frame, cream mat, canvas. */}
              <div className="relative border-[clamp(8px,0.9vw,14px)] border-gold bg-paper p-[6%] shadow-[0_30px_60px_rgba(0,0,0,0.45),inset_0_0_0_1px_rgba(0,0,0,0.25)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-2">
                <div className="relative aspect-[4/3] overflow-hidden shadow-[inset_0_2px_10px_rgba(0,0,0,0.35)]">
                  <div data-canvas className="absolute inset-y-0 -inset-x-[6%]">
                    <ViewTransition name={`project-${project.slug}`} share="morph" default="none">
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        sizes="(min-width: 768px) 60vh, 78vw"
                        className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                      />
                    </ViewTransition>
                  </div>
                </div>
              </div>
            </Link>

            <Placard
              no={`No. ${String(i + 1).padStart(2, "0")}`}
              title={project.title}
              lines={[`${project.year}`, project.summary]}
              medium={project.tags.join(", ")}
              className={`mt-8 max-w-[22rem] ${i % 2 ? "rotate-1" : "-rotate-1"}`}
            >
              <Link
                href={`/projects/${project.slug}`}
                tabIndex={-1}
                className="nav-link mt-4 inline-block font-sans text-[11px] leading-none font-medium tracking-[0.14em] uppercase"
              >
                View exhibit →
              </Link>
            </Placard>
          </article>
        ))}

        {/* End wall: the closing line and the way on to contact. */}
        <div className="flex w-[min(80vw,30rem)] shrink-0 snap-center flex-col items-start">
          <p className="font-display text-[clamp(2.25rem,4vw,4rem)] leading-[0.95] whitespace-pre-line uppercase">
            {copy.closing}
          </p>
          <p className="mt-4 max-w-sm text-[14px] leading-relaxed text-ink/80">{copy.closingBody}</p>
          <AnchorLink href="/#contact" className={`${buttonOutline} mt-8`}>
            Start a project <span aria-hidden>↗</span>
          </AnchorLink>
        </div>
      </div>
    </div>
  );
}
