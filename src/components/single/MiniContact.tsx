"use client";

import { useState } from "react";
import { site } from "@/data/site";

// Bottom right: who, where, and two ways in. Copying the address is the one live control.
export function MiniContact() {
  const [copied, setCopied] = useState(false);

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
    <section id="contact" className="sg-contact" aria-labelledby="contact-title">
      <h2 id="contact-title" className="font-headline text-[15px] leading-none tracking-[-0.01em]">
        Contact
      </h2>
      <p className="mt-3 font-narrative text-[16px] leading-[1.3] text-cream/90">{site.signal.contact}</p>
      <button
        type="button"
        onClick={copy}
        className="mt-3 block max-w-full truncate text-left font-headline text-[17px] leading-tight tracking-[-0.02em] underline decoration-cream/30 underline-offset-4 transition-colors hover:decoration-cream"
        aria-live="polite"
      >
        {copied ? "Copied to clipboard" : site.email}
      </button>
      <div className="mt-4 flex items-center gap-2">
        <a
          href={`mailto:${site.email}?subject=${encodeURIComponent("A project for AshCode")}`}
          className="sg-contact__cta font-headline text-[13px]"
        >
          Start a project ↗
        </a>
        {site.socials.map((s) => (
          <a
            key={s.href}
            href={s.href}
            target="_blank"
            rel="noreferrer"
            className="font-headline text-[13px] text-cream/75 transition-colors hover:text-cream"
          >
            {s.label}
          </a>
        ))}
      </div>
    </section>
  );
}
