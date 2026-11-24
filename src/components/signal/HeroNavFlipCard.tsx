"use client";

import Link from "next/link";
import { site } from "@/data/site";
import { DropCap } from "./Editions";

const about = site.aboutEdition;
const smallLabel = "font-headline text-[14px] leading-none tracking-[-0.01em]";

/**
 * Centred hero card: the name and tagline over the About copy, one face, no menu.
 * The single-screen home has nowhere to navigate to, so the card only introduces.
 */
export function HeroNavFlipCard({ visible }: { visible: boolean }) {
  return (
    <div aria-hidden={!visible} inert={!visible} className="edition-nav__flip-scene pointer-events-none">
      <div className="edition-nav__flipper pointer-events-auto">
        <section id="about" aria-label="About" className="edition-nav__face edition-nav__face--front flex flex-col">
          <p className="font-headline text-[32px] leading-[0.95] tracking-[-0.03em]">{site.name}</p>
          <p className="edition-nav__subtitle mt-3 max-w-[300px] font-narrative text-[17px] leading-[0.97] tracking-[-0.04em] text-balance">
            {site.tagline}
          </p>
          <p className={`${smallLabel} mt-auto text-gold/90`}>{about.kicker}</p>
          <h2 className="mt-3 font-narrative text-[22px] leading-[0.95] tracking-[-0.04em] text-balance">
            <DropCap className="text-[20px]">{`${about.dropCap}${about.headline}`}</DropCap>
          </h2>
          <p className="mt-3 font-narrative text-[15px] leading-[1.35] tracking-[-0.03em] text-cream/88">{about.body}</p>
          <Link
            href={about.cta.href}
            className={`${smallLabel} mt-4 inline-flex min-h-9 items-center gap-2 self-start rounded-[4px] border border-cream/25 px-3 transition-colors hover:border-cream/45 hover:bg-white/5`}
          >
            {about.cta.label}
            <span aria-hidden>↗</span>
          </Link>
        </section>
      </div>
    </div>
  );
}
