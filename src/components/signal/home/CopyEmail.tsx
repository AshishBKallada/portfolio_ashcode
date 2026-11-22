"use client";

import { useCopyToClipboard } from "@/lib/hooks/useCopyToClipboard";

/** The email set large as a mail link, with a button beside it that copies the address. */
export function CopyEmail({ email }: { email: string }) {
  const { copied, copy } = useCopyToClipboard();
  return (
    <div className="flex flex-wrap items-baseline gap-x-6 gap-y-3">
      <a
        href={`mailto:${email}`}
        className="group relative text-[24px] leading-tight tracking-[-0.02em] break-all text-ink md:text-[36px]"
      >
        {email}
        {/* The underline draws in from the left on hover. */}
        <span
          aria-hidden
          className="absolute inset-x-0 -bottom-1 h-[2px] origin-left scale-x-0 bg-ink transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"
        />
      </a>
      <button
        type="button"
        onClick={() => copy(email)}
        className="text-[16px] text-ink/60 transition-colors hover:text-ink focus-visible:text-ink"
      >
        <span aria-live="polite">{copied ? "Copied" : "Copy address"}</span>
      </button>
    </div>
  );
}
