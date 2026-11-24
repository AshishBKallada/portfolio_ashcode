"use client";

import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useState } from "react";
import { hero, person } from "@/data/portfolio";

// The hero card, shrunk to a ticket in the bottom-left corner: shown after the hero has
// folded into it, hidden again over the contact card and the footer, which carry their own way in.
export function Stub() {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const heroEl = document.querySelector(".kx-hero");
    const contactEl = document.querySelector("#contact");
    if (!heroEl || !contactEl) return;
    const trigger = ScrollTrigger.create({
      trigger: heroEl,
      start: "bottom 98%",
      endTrigger: contactEl,
      end: "top 60%",
      onToggle: (self) => setShown(self.isActive),
    });
    return () => trigger.kill();
  }, []);

  return (
    <aside
      className="kx-stub"
      data-shown={shown}
      aria-hidden={!shown}
      aria-label="Contact"
    >
      <span className="kx-stub__text">
        <span className="kx-stub__name">{person.full}</span>
        <br />
        {person.status}
      </span>
      <a
        className="kx-button"
        href={hero.action.href}
        tabIndex={shown ? 0 : -1}
      >
        {hero.action.label}
      </a>
    </aside>
  );
}
