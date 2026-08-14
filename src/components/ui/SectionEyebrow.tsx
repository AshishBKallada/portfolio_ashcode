type SectionEyebrowProps = {
  number: string;
  label: string;
  className?: string;
};

export function SectionEyebrow({
  number,
  label,
  className = "",
}: SectionEyebrowProps) {
  return (
    <div
      className={`inline-flex items-center gap-3 font-sans text-[11px] font-medium tracking-[0.16em] text-muted uppercase tabular-nums ${className}`}
    >
      <span className="text-subtle">{number}</span>
      <span aria-hidden="true" className="h-px w-8 bg-border" />
      <span>{label}</span>
    </div>
  );
}
