"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { projects } from "@/data/projects";
import { site } from "@/data/site";

type Preview = { kind: "project" | "post"; index: number } | null;

const posts = site.signal.linkedin.posts;
const ease = [0.16, 1, 0.3, 1] as const;

/**
 * Hovering a project or a LinkedIn post opens it as a much larger card beside its rail, and
 * the hero behind softens under a light blur. Items mark themselves with data-preview-kind and
 * data-preview-index; one delegated listener reads them, so the rails stay server components.
 * Mouse only: on touch there is no hover, and the rails' own links still work.
 */
export function HoverPreview() {
  const reduce = useReducedMotion() ?? false;
  const [preview, setPreview] = useState<Preview>(null);
  const leaveTimer = useRef(0);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const read = (el: Element | null): Preview => {
      const item = el?.closest<HTMLElement>("[data-preview-kind]");
      if (!item) return null;
      const kind = item.dataset.previewKind === "project" ? "project" : "post";
      return { kind, index: Number(item.dataset.previewIndex) || 0 };
    };
    const onOver = (e: PointerEvent) => {
      const next = read(e.target as Element);
      if (!next) return;
      window.clearTimeout(leaveTimer.current);
      setPreview((cur) => (cur?.kind === next.kind && cur.index === next.index ? cur : next));
    };
    const onOut = (e: PointerEvent) => {
      if (!read(e.target as Element)) return;
      if (read(e.relatedTarget as Element | null)) return;
      // A short grace period so moving between neighbours doesn't flicker the blur.
      leaveTimer.current = window.setTimeout(() => setPreview(null), 120);
    };
    document.addEventListener("pointerover", onOver);
    document.addEventListener("pointerout", onOut);
    return () => {
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerout", onOut);
      window.clearTimeout(leaveTimer.current);
    };
  }, []);

  const project = preview?.kind === "project" ? projects[preview.index] : null;
  const post = preview?.kind === "post" ? posts[preview.index] : null;

  return (
    <>
      <div className="sg-preview-blur" data-on={preview ? "true" : "false"} aria-hidden />
      <AnimatePresence mode="wait">
        {project ? (
          <motion.article
            key={`project-${project.slug}`}
            aria-hidden
            className="sg-preview sg-preview--project"
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.86, x: 40 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.94, x: 20, transition: { duration: 0.18 } }}
            transition={{ duration: 0.5, ease }}
          >
            <div className="sg-preview__img sg-preview__img--wide">
              <Image src={project.image} alt="" fill sizes="560px" />
            </div>
            <div className="mt-5 flex items-baseline justify-between gap-4">
              <h3 className="font-headline text-[44px] leading-none tracking-[-0.04em]">{project.title}</h3>
              <span className="font-headline text-[14px] text-cream/60 tabular-nums">{project.year}</span>
            </div>
            <p className="mt-3 font-narrative text-[18px] leading-[1.3] text-cream/90">{project.summary}</p>
            <p className="mt-3 font-narrative text-[15px] leading-[1.4] text-cream/70">{project.description}</p>
            <p className="mt-4 font-headline text-[12px] leading-none text-cream/55">{project.tags.join(" · ")}</p>
          </motion.article>
        ) : post ? (
          <motion.article
            key={`post-${post.src}`}
            aria-hidden
            className="sg-preview sg-preview--post"
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.86, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.94, y: 20, transition: { duration: 0.18 } }}
            transition={{ duration: 0.5, ease }}
          >
            <div className="sg-preview__img sg-preview__img--tall">
              <Image src={post.src} alt="" fill sizes="360px" />
            </div>
            <p className="mt-4 font-headline text-[12px] leading-none text-cream/60">On LinkedIn</p>
            <h3 className="mt-2 font-headline text-[24px] leading-[1.05] tracking-[-0.03em]">{post.title}</h3>
          </motion.article>
        ) : null}
      </AnimatePresence>
    </>
  );
}
