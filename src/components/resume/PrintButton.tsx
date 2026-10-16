"use client";

import type { ReactNode } from "react";

/** Opens the print dialog, where the résumé can be saved as a PDF. */
export function PrintButton({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <button type="button" onClick={() => window.print()} className={className}>
      {children}
    </button>
  );
}
