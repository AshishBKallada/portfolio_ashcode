"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The address in plain sight with a copy chip beside it, for visitors whose
 * mailto: opens nothing. Confirms in place and announces it to screen readers.
 */
export function CopyEmail({ email, tone = "light" }: { email: string; tone?: "light" | "dark" }) {
  const dark = tone === "dark";
  const [copied, setCopied] = useState(false);
  const timer = useRef(0);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3 font-sans text-[13px] sm:flex-row">
      <span>
        <span className={dark ? "text-cream/80" : "text-muted"}>or write to</span>{" "}
        <a href={`mailto:${email}`} className={`nav-link font-medium ${dark ? "text-cream" : "text-ink"}`}>
          {email}
        </a>
      </span>
      <button
        type="button"
        onClick={copy}
        className={`inline-flex min-h-9 items-center rounded-[3px] border px-3 font-headline text-[13px] tracking-[-0.01em] transition-colors ${
          dark ? "border-cream/40 text-cream hover:bg-cream hover:text-ink" : "border-ink/25 text-ink hover:bg-ink hover:text-cream"
        }`}
      >
        {copied ? "Copied ✓" : "Copy"}
      </button>
      <span role="status" className="sr-only">
        {copied ? "Email address copied" : ""}
      </span>
    </div>
  );
}
