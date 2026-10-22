"use client";

import { metaLabel } from "@/components/signal/primitives";
import { useEffect, useRef, useState } from "react";

/**
 * The address in plain sight with a copy chip beside it, for visitors whose
 * mailto: opens nothing. Confirms in place and announces it to screen readers.
 */
export function CopyEmail({ email }: { email: string }) {
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
        <span className="text-muted">or write to</span>{" "}
        <a href={`mailto:${email}`} className="nav-link font-medium text-ink">
          {email}
        </a>
      </span>
      <button
        type="button"
        onClick={copy}
        className={`${metaLabel} inline-flex min-h-9 items-center rounded-[3px] border border-ink/25 px-3 text-ink transition-colors hover:bg-ink hover:text-cream`}
      >
        {copied ? "Copied ✓" : "Copy"}
      </button>
      <span role="status" className="sr-only">
        {copied ? "Email address copied" : ""}
      </span>
    </div>
  );
}
