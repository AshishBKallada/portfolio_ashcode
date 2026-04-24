const ROWS = [
  {
    label: "Perspective",
    index: "01",
    lines: [
      "I bridge the gap between abstract imagination and technical precision.",
    ],
  },
  {
    label: "Practice",
    index: "02",
    lines: [
      "By merging high-performance engineering with intentional design,",
      "I craft digital experiences that feel intuitive and move with purpose.",
    ],
  },
] as const;

/** Fixed positions so SSR/CSR match; subtle reference-style noise */
const GLITCH_MARKS: { char: string; left: number; top: number }[] = [
  { char: "0x2f", left: 4, top: 11 },
  { char: "·", left: 18, top: 7 },
  { char: "7a", left: 72, top: 14 },
  { char: "↳", left: 88, top: 22 },
  { char: "4b", left: 12, top: 38 },
  { char: "··", left: 55, top: 31 },
  { char: "ff", left: 91, top: 44 },
  { char: ">", left: 8, top: 62 },
  { char: "01", left: 42, top: 58 },
  { char: "<", left: 76, top: 67 },
  { char: "∴", left: 28, top: 78 },
  { char: "3c", left: 63, top: 82 },
  { char: "·", left: 95, top: 88 },
  { char: "ae", left: 15, top: 91 },
  { char: "→", left: 50, top: 6 },
];

export default function AboutMeSection() {
  return (
    <div
      id="about"
      className="relative min-h-screen w-full shrink-0 overflow-hidden bg-black text-white"
      style={{
        backgroundImage: `
          linear-gradient(rgba(255, 255, 255, 0.045) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255, 255, 255, 0.045) 1px, transparent 1px)
        `,
        backgroundSize: "40px 40px",
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 select-none"
        aria-hidden
      >
        {GLITCH_MARKS.map(({ char, left, top }, i) => (
          <span
            key={i}
            className="absolute font-mono text-[10px] tracking-wider text-white/[0.14] md:text-[11px]"
            style={{ left: `${left}%`, top: `${top}%` }}
          >
            {char}
          </span>
        ))}
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-6 py-20 md:px-10 md:py-24 lg:px-14 lg:py-28">
        {ROWS.map((row) => (
          <div
            key={row.index}
            className="grid gap-8 border-b border-white/[0.12] py-12 last:border-b-0 md:grid-cols-[minmax(11rem,28%)_1fr] md:gap-16 md:gap-x-20 md:py-16 lg:py-20"
          >
            <h2 className="font-mono text-[11px] font-normal uppercase leading-snug tracking-[0.18em] text-white md:text-xs">
              {row.label}{" "}
              <span className="text-white/45">({row.index})</span>
            </h2>
            <ul className="space-y-3 font-mono text-[11px] font-normal uppercase leading-relaxed tracking-[0.14em] text-white/90 md:text-xs md:tracking-[0.16em]">
              {row.lines.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
