"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { SmokeText, useSmokeScatter } from "@/components/single/SmokeText";
import { site } from "@/data/site";
import { DropCap } from "./Editions";

const about = site.aboutEdition;
const smallLabel = "font-headline text-[14px] leading-none tracking-[-0.01em]";

/**
 * The hero card: the name, the About copy, and the way to get in touch, all on one face.
 * On the single-screen home this is the only place contact lives.
 */
export function HeroNavFlipCard({ visible }: { visible: boolean }) {
  const [copied, setCopied] = useState(false);
  const card = useRef<HTMLElement>(null);
  useSmokeScatter(card);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      window.location.href = `mailto:${site.email}`;
    }
  };

  return (
    <div aria-hidden={!visible} inert={!visible} className="edition-nav__flip-scene pointer-events-none">
      <div className="edition-nav__flipper pointer-events-auto">
        <section ref={card} id="about" aria-label="About" className="edition-nav__face edition-nav__face--front flex flex-col">
          <p className="font-headline text-[32px] leading-[0.95] tracking-[-0.03em]">
            <SmokeText>{site.name}</SmokeText>
          </p>
          <p className={`${smallLabel} mt-6 text-gold/90`}>
            <SmokeText>{about.kicker}</SmokeText>
          </p>
          <h2 className="mt-3 font-narrative text-[22px] leading-[0.95] tracking-[-0.04em] text-balance">
            <DropCap className="text-[20px]">{`${about.dropCap}${about.headline}`}</DropCap>
          </h2>
          <p className="mt-3 font-narrative text-[15px] leading-[1.35] tracking-[-0.03em] text-cream/88">
            <SmokeText>{about.body}</SmokeText>
          </p>

          <div id="contact" className="mt-5">
            <p className={`${smallLabel} text-cream/60`}>
              <SmokeText>Contact</SmokeText>
            </p>
            <button
              type="button"
              onClick={copy}
              aria-live="polite"
              title="Copy email"
              className="relative mt-2 block max-w-full truncate pb-1 text-left font-headline text-[16px] leading-tight tracking-[-0.02em] after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-500 after:ease-[cubic-bezier(0.16,1,0.3,1)] hover:after:scale-x-100 focus-visible:after:scale-x-100"
            >
              {copied ? "Copied to clipboard" : site.email}
            </button>
          </div>

          <div className="mt-auto grid w-max gap-2 pt-4">
            <a
              href={`mailto:${site.email}?subject=${encodeURIComponent("A project for AshCode")}`}
              className={`${smallLabel} flex min-h-9 items-center justify-between gap-4 rounded-[4px] bg-cream px-3 text-ink transition-colors hover:bg-white`}
            >
              Start a project
              <span aria-hidden>↗</span>
            </a>
            <Link
              href={about.cta.href}
              className={`${smallLabel} flex min-h-9 items-center justify-between gap-4 rounded-[4px] border border-cream/25 px-3 transition-colors hover:border-cream/45 hover:bg-white/5`}
            >
              {about.cta.label}
              <span aria-hidden>↗</span>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
