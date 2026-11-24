"use client";

import gsap from "gsap";
import Image from "next/image";
import { useRef } from "react";
import { sheet } from "@/data/sheet";
import { layDown, useMotion } from "./motion";
import { Spine } from "./Spine";

// Page two of the portfolio: the statement, the four ways of working and the toolkit,
// with Ashish on stage filling the right-hand column.
export function AboutSheet() {
  const root = useRef<HTMLElement>(null);

  useMotion(root, (el) => {
    const page = el.querySelector<HTMLElement>(".sh-sheet")!;
    layDown(page, -1.5);
    gsap.fromTo(
      el.querySelector(".sh-about__photo img"),
      { yPercent: -8 },
      { yPercent: 8, ease: "none", scrollTrigger: { trigger: page, start: "top bottom", end: "bottom top", scrub: true } },
    );
  });

  const { about } = sheet;

  return (
    <section ref={root} id="about" className="sh-section" aria-labelledby="about-title">
      <article className="sh-sheet sh-page">
        <header className="sh-band">
          <h2 id="about-title" className="sh-band__title">
            <span className="sh-mask">
              <span>About</span>
            </span>
            <span className="sh-mask">
              <span>{sheet.wordmark}</span>
            </span>
          </h2>
        </header>

        <div className="sh-about">
          <div className="sh-about__text">
            <p className="sh-about__statement" data-part>
              {about.statement}
            </p>

            <ol className="sh-about__ways">
              {about.ways.map((way, i) => (
                <li key={way.title} data-part>
                  <span className="sh-about__num">{String(i + 1).padStart(3, "0")}</span>
                  <h3>{way.title}</h3>
                  <p>{way.text}</p>
                </li>
              ))}
            </ol>

            <div className="sh-about__toolkit">
              {about.toolkit.map((group) => (
                <div key={group.label} data-part>
                  <h3>{group.label}</h3>
                  <p>{group.items.join(", ")}</p>
                </div>
              ))}
            </div>
          </div>

          <figure className="sh-about__photo">
            <Image src={about.photo.src} alt={about.photo.alt} fill sizes="(max-width: 767px) 100vw, 34vw" />
          </figure>
        </div>
        <Spine text="About · Interfaces, APIs and the infrastructure behind them" tone="light" marks />
      </article>
    </section>
  );
}
