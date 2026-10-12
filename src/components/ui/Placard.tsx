/**
 * Museum wall label: paper card, gold rule, catalogue number in serif italic,
 * title, a few plain facts and the medium. Dark placard ink on paper reads in
 * every theme, so the card never inherits the section's colours.
 */
export function Placard({
  no,
  title,
  lines = [],
  medium,
  children,
  className = "",
}: {
  no: string;
  title: string;
  lines?: readonly string[];
  medium?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-paper p-5 text-placard shadow-[0_18px_40px_rgba(0,0,0,0.28)] ring-1 ring-gold/40 ${className}`}
    >
      <p className="font-serif text-[15px] leading-none italic">{no}</p>
      <div aria-hidden className="mt-3 h-px w-10 bg-gold" />
      <p className="mt-3 font-serif text-[clamp(1.5rem,2.2vw,2rem)] leading-none">{title}</p>
      {lines.length ? (
        <ul className="mt-3 space-y-0.5 font-sans text-[13px] leading-snug opacity-80">
          {lines.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      ) : null}
      {medium ? (
        <p className="mt-3 font-sans text-[12px] leading-snug">
          <span className="font-medium tracking-[0.12em] uppercase opacity-60">Medium — </span>
          {medium}
        </p>
      ) : null}
      {children}
    </div>
  );
}
