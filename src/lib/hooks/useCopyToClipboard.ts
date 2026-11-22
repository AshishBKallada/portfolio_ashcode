"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Copies text to the clipboard and reports it for `resetMs`, so a button can say "Copied".
 * Returns false where the clipboard is unavailable (insecure context, denied permission).
 */
export function useCopyToClipboard(resetMs = 1800) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text);
      } catch {
        return false;
      }
      setCopied(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), resetMs);
      return true;
    },
    [resetMs],
  );

  return { copied, copy };
}
