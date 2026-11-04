"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { site } from "@/data/site";
import { DropCap } from "./Editions";
import { metaLabel } from "./primitives";

const about = site.aboutEdition;

/** Phones: About lives in the hero card on desktop; here it anchors `/#about`. */
export function HeroAboutMobile() {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  if (!mobile) return null;

  return (
    <section id="about" aria-label="About" className="signal-rail-bleed border-b border-ink/10 bg-background px-6 py-12 text-ink md:hidden">
      <p className={`${metaLabel} text-ink/70`}>{about.kicker}</p>
      <h2 className="mt-4 max-w-[36rem] font-narrative text-[clamp(1.75rem,6vw,2.25rem)] leading-[0.98] tracking-[-0.04em]">
        <DropCap>{`${about.dropCap}${about.headline}`}</DropCap>
      </h2>
      <p className="mt-4 max-w-[34rem] font-narrative text-[16px] leading-[1.4] tracking-[-0.02em] text-ink/80">
        {about.body}
      </p>
      <Link
        href={about.cta.href}
        className={`${metaLabel} mt-6 inline-flex min-h-10 items-center gap-2 rounded-[4px] border border-ink/25 px-4 transition-colors hover:border-ink/45`}
      >
        {about.cta.label}
        <span aria-hidden>↗</span>
      </Link>
    </section>
  );
}
