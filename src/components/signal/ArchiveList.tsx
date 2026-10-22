"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type PointerEvent } from "react";
import { RevealItem } from "@/components/motion/Reveal";
import type { Project } from "@/data/projects";
import { cols, metaLabel, metaText } from "./primitives";

const pad = (n: number) => String(n).padStart(2, "0");
const follow = { stiffness: 260, damping: 28, mass: 0.6 };

/**
 * The archive as an index: each project a tall row with its name and scope,
 * a rule, then its number and overview beneath. Hovering a row raises its
 * name in display type and floats the project's image after the cursor
 * (mouse only; touch and reduced motion keep the plain list).
 */
export function ArchiveList({ projects }: { projects: Project[] }) {
  const reduce = useReducedMotion() ?? false;
  const listRef = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState<number | null>(null);
  const [canHover, setCanHover] = useState(false);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, follow);
  const y = useSpring(rawY, follow);

  useEffect(() => {
    const query = window.matchMedia("(pointer: fine)");
    const update = () => setCanHover(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  const preview = canHover && !reduce;

  const onMove = (e: PointerEvent<HTMLUListElement>) => {
    const box = listRef.current?.getBoundingClientRect();
    if (!box) return;
    rawX.set(e.clientX - box.left);
    rawY.set(e.clientY - box.top);
  };

  return (
    <ul
      ref={listRef}
      onPointerMove={preview ? onMove : undefined}
      onPointerLeave={() => setActive(null)}
      className="relative mt-14"
    >
      {/* The floating preview: every image stacked, the hovered one shown. */}
      {preview ? (
        <motion.div
          aria-hidden
          style={{ x, y }}
          className="pointer-events-none absolute top-0 left-0 z-20 w-[clamp(13rem,20vw,20rem)]"
        >
          <motion.div
            initial={false}
            animate={active === null ? { opacity: 0, scale: 0.85 } : { opacity: 1, scale: 1 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="relative -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[4px] shadow-[0_24px_60px_rgba(26,5,5,0.25)]"
            style={{ aspectRatio: "4 / 3" }}
          >
            {projects.map((project, i) => (
              <Image
                key={project.slug}
                src={project.image}
                alt=""
                fill
                sizes="20vw"
                className={`object-cover transition-opacity duration-300 ${active === i ? "opacity-100" : "opacity-0"}`}
              />
            ))}
          </motion.div>
        </motion.div>
      ) : null}

      {projects.map((project, i) => (
        <li key={project.slug} onPointerEnter={() => setActive(i)}>
          <RevealItem delay={i * 0.06}>
            <Link href={`/projects/${project.slug}`} className="group relative block focus-visible:outline-none">
              {/* Name and scope, sitting on the rule. */}
              <div className={`${cols} relative min-h-[clamp(8rem,20vh,12.5rem)] items-end gap-y-4 pb-5`}>
                {/* Raised on hover: the name in display type. */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute bottom-14 left-3 z-10 font-display text-[clamp(3.5rem,9vw,8.5rem)] leading-[0.85] uppercase opacity-0 transition-[opacity,translate] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] translate-y-4 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 md:left-[25%]"
                >
                  {project.title}
                </span>
                <span className={`${metaLabel} hidden px-3 text-subtle md:block`}>{project.year}</span>
                <span className={`${metaLabel} px-3`}>{project.title}</span>
                <span className={`${metaLabel} hidden px-3 md:block`}>Project scope</span>
                <ul className="flex flex-wrap gap-x-4 px-3 md:block md:text-right">
                  {project.tags.map((tag) => (
                    <li key={tag} className={metaText}>
                      {tag}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t border-ink" />

              {/* Number and overview, under the rule. */}
              <div className={`${cols} gap-y-2 pt-3 pb-10`}>
                <span className="hidden md:block" />
                <span className={`${metaLabel} px-3`}>A — {pad(i + 1)}</span>
                <span className={`${metaLabel} hidden px-3 md:block`}>Overview</span>
                <p className={`${metaText} px-3 md:ml-auto md:max-w-[19rem] md:text-right`}>
                  {project.summary}
                </p>
              </div>
            </Link>
          </RevealItem>
        </li>
      ))}
    </ul>
  );
}
