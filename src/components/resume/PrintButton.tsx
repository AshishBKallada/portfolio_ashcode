"use client";

/** Opens the print dialog, where the résumé can be saved as a PDF. */
export function PrintButton({
  className,
  style,
  children,
}: {
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}) {
  return (
    <button type="button" onClick={() => window.print()} className={className} style={style}>
      {children}
    </button>
  );
}
