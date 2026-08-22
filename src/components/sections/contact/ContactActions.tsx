import { site } from "@/data/site";

type Row = {
  key: string;
  index: string;
  prompt: string;
  target: string;
  href: string;
  external?: boolean;
};

function Arrow() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="size-4 shrink-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1 group-hover:-translate-y-1"
    >
      <path
        d="M5 19L19 5M19 5H8M19 5V16"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="square"
        strokeLinejoin="miter"
        fill="none"
      />
    </svg>
  );
}

export function ContactActions() {
  const github = site.socials.find((s) => s.label === "GitHub");
  const linkedin = site.socials.find((s) => s.label === "LinkedIn");

  const rows: Row[] = [
    {
      key: "email",
      index: "A",
      prompt: site.contact.prompts.email,
      target: site.email,
      href: `mailto:${site.email}`,
    },
    ...(linkedin
      ? [
          {
            key: "linkedin",
            index: "B",
            prompt: site.contact.prompts.linkedin,
            target: "LinkedIn",
            href: linkedin.href,
            external: true,
          },
        ]
      : []),
    ...(github
      ? [
          {
            key: "github",
            index: "C",
            prompt: site.contact.prompts.github,
            target: "GitHub",
            href: github.href,
            external: true,
          },
        ]
      : []),
  ];

  return (
    <ul className="mt-10 border-t border-border">
      {rows.map((row) => (
        <li key={row.key} className="border-b border-border">
          <a
            href={row.href}
            {...(row.external
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
            className="group relative grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-4 py-5 sm:gap-x-8 sm:py-6"
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 origin-left scale-x-0 bg-foreground/[0.035] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100"
            />
            <span className="relative font-sans text-[11px] font-medium tracking-[0.16em] text-subtle uppercase tabular-nums transition-colors duration-500 group-hover:text-foreground">
              {row.index}
            </span>
            <span className="relative flex flex-wrap items-baseline gap-x-2 gap-y-1 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-2">
              <span className="font-sans text-[13px] tracking-[-0.02em] text-muted">
                {row.prompt}
              </span>
              <span className="font-serif text-[1.35rem] leading-none italic tracking-tight text-foreground sm:text-[1.65rem] lg:text-[1.9rem]">
                {row.target}
              </span>
            </span>
            <span className="relative text-foreground">
              <Arrow />
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
