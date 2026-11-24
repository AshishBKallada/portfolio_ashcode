"use client";

import gsap from "gsap";
import Image from "next/image";
import { useRef } from "react";
import { contact, person } from "@/data/portfolio";
import { LocalHours } from "./LocalHours";
import { useMotion } from "./motion";

// One card on the river, like the hours on a door: where, when, and the way in.
export function Contact() {
  const root = useRef<HTMLElement>(null);

  useMotion(root, (el) => {
    gsap.fromTo(
      el.querySelector(".kx-contact__photo"),
      { yPercent: -6, scale: 1.08 },
      {
        yPercent: 6,
        scale: 1,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      },
    );
    gsap.from(el.querySelector(".kx-card"), {
      y: 80,
      opacity: 0,
      duration: 1.1,
      ease: "expo.out",
      scrollTrigger: { trigger: el, start: "top 60%", once: true },
    });
    gsap.from(el.querySelectorAll(".kx-card > *"), {
      y: 18,
      opacity: 0,
      duration: 0.8,
      stagger: 0.07,
      delay: 0.2,
      ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 60%", once: true },
    });
  });

  return (
    <section
      ref={root}
      id="contact"
      className="kx-contact"
      aria-labelledby="contact-title"
    >
      <div className="kx-contact__photo">
        <Image
          src={contact.photo.src}
          alt={contact.photo.alt}
          fill
          sizes="100vw"
        />
      </div>
      <div className="kx-card">
        <h2 id="contact-title" className="kx-display">
          {contact.heading}
        </h2>
        <p className="kx-card__place">
          Based in {person.place}.
          <br />
          Working remotely, with any time zone.
        </p>
        <LocalHours />
        <a className="kx-card__email kx-link" href={`mailto:${person.email}`}>
          {person.email}
        </a>
        <a className="kx-button" href={contact.action.href}>
          {contact.action.label}{" "}
          <span className="kx-button__arrow" aria-hidden="true">
            →
          </span>
        </a>
      </div>
    </section>
  );
}
