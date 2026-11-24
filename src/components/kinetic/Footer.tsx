"use client";

import gsap from "gsap";
import Image from "next/image";
import { useRef } from "react";
import { footer, person } from "@/data/portfolio";
import { useMotion } from "./motion";

// The bridge over the Kallada, cropped close and larger than anything above, beside the menu.
export function Footer() {
  const root = useRef<HTMLElement>(null);

  useMotion(root, (el) => {
    gsap.fromTo(
      el.querySelector(".kx-footer__photo img"),
      { scale: 1.3 },
      {
        scale: 1.08,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top bottom",
          end: "bottom bottom",
          scrub: true,
        },
      },
    );
    gsap.from(el.querySelectorAll(".kx-menu li"), {
      x: -40,
      opacity: 0,
      duration: 0.9,
      stagger: 0.06,
      ease: "expo.out",
      scrollTrigger: { trigger: el, start: "top 65%", once: true },
    });
  });

  const year = new Date().getFullYear();

  return (
    <footer ref={root} className="kx-footer" aria-labelledby="footer-title">
      <div className="kx-footer__photo">
        <Image
          src={footer.photo.src}
          alt={footer.photo.alt}
          fill
          sizes="(max-width: 767px) 100vw, 50vw"
        />
      </div>
      <div className="kx-footer__side">
        <p className="kx-footer__mark">{person.wordmark}</p>
        <h2 id="footer-title" className="kx-footer__heading">
          Site menu
        </h2>
        <ul className="kx-menu">
          {footer.menu.map((item) => (
            <li key={item.label}>
              <a className="kx-display" href={item.href}>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="kx-footer__blocks">
          <div>
            <h3>Contact</h3>
            <a className="kx-link" href={`mailto:${person.email}`}>
              {person.email}
            </a>
          </div>
          <div>
            <h3>Elsewhere</h3>
            <ul>
              {footer.socials.map((s) => (
                <li key={s.label}>
                  <a
                    className="kx-link"
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="kx-footer__caption">{footer.photo.caption}</p>
        <div className="kx-footer__legal">
          <span>
            © {year} {person.full}
          </span>
          {footer.credits.map((c) => (
            <a key={c.href} href={c.href} target="_blank" rel="noreferrer">
              {c.text}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
