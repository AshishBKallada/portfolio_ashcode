"use client";

import gsap from "gsap";
import Image from "next/image";
import { useRef } from "react";
import { sheet } from "@/data/sheet";
import { layDown, useMotion } from "./motion";
import { Spine } from "./Spine";

// The black sheet, opened out: every post as a numbered contact print, a row the scroll
// slides sideways, and the comments people left under them set like a printed index.
export function LinkedInSheet() {
  const root = useRef<HTMLElement>(null);

  useMotion(root, (el) => {
    const page = el.querySelector<HTMLElement>(".sh-sheet")!;
    layDown(page, 1.4);
    const row = el.querySelector<HTMLElement>(".sh-prints")!;
    // The prints drift left as the sheet passes, as far as the row overflows.
    gsap.to(row, {
      x: () => Math.min(0, row.parentElement!.clientWidth - row.scrollWidth),
      ease: "none",
      scrollTrigger: { trigger: page, start: "top 70%", end: "bottom 30%", scrub: true, invalidateOnRefresh: true },
    });
  });

  const { linkedin } = sheet;

  return (
    <section ref={root} id="linkedin" className="sh-section" aria-labelledby="linkedin-title">
      <article className="sh-sheet sh-page sh-page--dark">
        <header className="sh-band">
          <h2 id="linkedin-title" className="sh-band__title">
            <span className="sh-mask">
              <span>LinkedIn</span>
            </span>
            <span className="sh-mask">
              <span>Notes</span>
            </span>
          </h2>
        </header>

        <div className="sh-li__head">
          <p data-part>{linkedin.lede}</p>
          <a className="sh-button sh-button--light" href={linkedin.href} target="_blank" rel="noreferrer" data-part>
            {linkedin.cta} <span aria-hidden="true">↗</span>
          </a>
        </div>

        <div className="sh-prints__window">
          <ol className="sh-prints">
            {linkedin.posts.map((post, i) => (
              <li key={post.src}>
                <a href={linkedin.href} target="_blank" rel="noreferrer">
                  <span className="sh-reel__num">{String(i + 1).padStart(3, "0")}</span>
                  <span className="sh-prints__img">
                    <Image src={post.src} alt={`LinkedIn post: ${post.title}`} fill sizes="(max-width: 767px) 60vw, 22vw" />
                  </span>
                  <span className="sh-prints__title">{post.title}</span>
                </a>
              </li>
            ))}
          </ol>
        </div>

        <div className="sh-words">
          <h3 data-part>Kind words, from the comments</h3>
          <ul>
            {linkedin.words.map((w) => (
              <li key={w.name} data-part>
                <blockquote>“{w.text}”</blockquote>
                <p>{w.name}</p>
              </li>
            ))}
          </ul>
        </div>
        <Spine text="LinkedIn · Notes from the build" tone="dark" />
      </article>
    </section>
  );
}
