"use client";

import gsap from "gsap";
import Image from "next/image";
import { useRef } from "react";
import { sheet } from "@/data/sheet";
import { useMotion } from "./motion";
import { Spine } from "./Spine";

// The cover: a pale sheet with the name and the word PORTFOLIO across its head, the contact
// sheet and a portrait under it, and a black sheet tucked beneath carrying the reel of posts.
export function Cover() {
  const root = useRef<HTMLElement>(null);

  useMotion(root, (el) => {
    const light = el.querySelector(".sh-cover");
    const dark = el.querySelector(".sh-reel");

    // Dealt onto the desk: the black sheet first, the pale one over it.
    const intro = gsap.timeline({ defaults: { ease: "expo.out" } });
    intro
      .from(dark, { xPercent: 18, yPercent: 10, rotate: 3, opacity: 0, duration: 1.6 }, 0)
      .from(light, { xPercent: -10, yPercent: 14, rotate: -2.5, opacity: 0, duration: 1.6 }, 0.12)
      .from(el.querySelectorAll(".sh-cover .sh-band .sh-mask > span"), { yPercent: 110, duration: 1.1, stagger: 0.1 }, 0.55)
      .from(el.querySelector(".sh-cover__photo"), { clipPath: "inset(0% 0% 100% 0%)", duration: 1.4, ease: "expo.inOut" }, 0.5)
      .from(el.querySelector(".sh-cover__photo img"), { scale: 1.25, duration: 2 }, 0.5)
      .from(el.querySelectorAll(".sh-cover [data-part]"), { y: 18, opacity: 0, duration: 0.8, stagger: 0.05, ease: "power3.out" }, 0.8)
      .from(el.querySelectorAll(".sh-reel__strip li"), { y: 40, opacity: 0, duration: 0.9, stagger: 0.07 }, 0.9)
      .from(el.querySelector(".sh-dot"), { scale: 0, duration: 0.8, ease: "back.out(3)" }, 1.2)
      .from(el.querySelectorAll(".sh-colophon > *"), { y: 14, opacity: 0, duration: 0.7, stagger: 0.05 }, 1.1);

    // On scroll the two sheets part at different speeds, like paper slid apart by hand.
    gsap.to(light, {
      yPercent: -12,
      rotate: -1.2,
      ease: "none",
      scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true },
    });
    gsap.to(dark, {
      yPercent: 6,
      rotate: 1,
      ease: "none",
      scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true },
    });
  });

  return (
    <section ref={root} className="sh-hero" aria-labelledby="cover-title">
      <article className="sh-sheet sh-reel">
        <p className="sh-reel__note" data-part>
          {sheet.note}
        </p>
        <ol className="sh-reel__strip">
          {sheet.reel.map((item, i) => (
            <li key={item.src}>
              <a href="#linkedin" aria-label={`Post: ${item.title}`}>
                <span className="sh-reel__num">{String(i + 1).padStart(3, "0")}</span>
                <span className="sh-reel__thumb">
                  <Image src={item.src} alt="" fill sizes="(max-width: 767px) 33vw, 12vw" />
                </span>
                <span className="sh-reel__title">{item.title}</span>
              </a>
            </li>
          ))}
        </ol>
        <div className="sh-reel__bar">
          <span>www.</span>
          <span>{sheet.www}</span>
          <span>Kerala, India</span>
          <a href={`mailto:${sheet.email}`}>{sheet.email}</a>
        </div>
        <Spine text={sheet.spine} tone="dark" />
      </article>

      <article className="sh-sheet sh-cover">
        <header className="sh-band">
          <h1 id="cover-title" className="sh-band__title" aria-label={`${sheet.full}, developer portfolio`}>
            <span className="sh-mask" aria-hidden="true">
              <span>{sheet.name}</span>
            </span>
            <span className="sh-mask" aria-hidden="true">
              <span>Portfolio</span>
            </span>
          </h1>
        </header>

        <div className="sh-cover__body">
          <div className="sh-cover__meta">
            <p data-part>{sheet.place}</p>
            <p data-part>{sheet.role}</p>
          </div>

          <dl className="sh-cover__contact">
            {sheet.contact.map((row, i) =>
              "gap" in row ? (
                <div key={i} className="sh-cover__gap" aria-hidden="true" />
              ) : (
                <div key={row.label} data-part>
                  <dt>{row.label}</dt>
                  <dd>
                    {"href" in row && row.href ? (
                      <a className="sh-link" href={row.href} target={row.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
                        {row.value}
                      </a>
                    ) : (
                      row.value
                    )}
                  </dd>
                </div>
              ),
            )}
          </dl>

          <a className="sh-cover__cta sh-button" href={sheet.action.href} data-part>
            {sheet.action.label} <span aria-hidden="true">→</span>
          </a>

          <span className="sh-dot" aria-hidden="true" />

          <figure className="sh-cover__photo">
            <Image src={sheet.cover.src} alt={sheet.cover.alt} fill loading="eager" fetchPriority="high" sizes="(max-width: 767px) 100vw, 26vw" />
          </figure>
        </div>
        <Spine text={sheet.spine} tone="light" marks />
      </article>

      <ul className="sh-colophon" aria-label="Colophon">
        {sheet.colophon.map(([a, b]) => (
          <li key={a + b}>
            {a}
            <br />
            {b}
          </li>
        ))}
      </ul>
    </section>
  );
}
