/**
 * The one chapter marker every section uses: "[02] — Journey". Same size and
 * tracking everywhere; the index leads at full ink, the label sits back a
 * step. (Flame is kept for large accent words: at this size it fails
 * contrast on oxblood.)
 */
export function SectionLabel({
  index,
  children,
  className = "",
}: {
  index: number;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={`font-sans text-[11px] leading-none font-medium tracking-[0.14em] uppercase ${className}`}
    >
      <span className="font-semibold tabular-nums">[{String(index).padStart(2, "0")}]</span>{" "}
      <span className="opacity-70">— {children}</span>
    </p>
  );
}
