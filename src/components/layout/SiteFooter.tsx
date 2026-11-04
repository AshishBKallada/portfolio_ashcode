import { LocalTime } from "@/components/signal/LocalTime";
import { site } from "@/data/site";

const social = (label: string) => site.socials.find((s) => s.label === label)?.href ?? "";

const links = [
  { label: "LinkedIn", href: social("LinkedIn"), external: true },
  { label: "GitHub", href: social("GitHub"), external: true },
  { label: "Résumé", href: "/resume", external: false },
];

const link = "transition-opacity hover:opacity-60 focus-visible:underline";

/**
 * A minimal full-width footer: the address and a few links on one line, a
 * hairline, then the credit row. It spans the whole viewport, its text on the
 * page's side padding.
 */
export function SiteFooter() {
  return (
    <footer id="contact" data-nav-theme="light" className="relative w-full border-t border-ink/12 bg-background text-ink">
      {/* Right padding keeps the links clear of the fixed record player and back-to-top button. */}
      <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3 pt-24 pr-[8.5rem] pb-16 pl-5 sm:pr-[11rem] sm:pl-10">
        <a
          href={`mailto:${site.email}`}
          className="font-narrative text-[clamp(1.25rem,2vw,1.6rem)] leading-none tracking-[-0.03em] [overflow-wrap:anywhere] underline decoration-ink/20 decoration-1 underline-offset-[0.18em] transition-colors hover:decoration-ink"
        >
          {site.email}
        </a>
        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-6 gap-y-1 font-headline text-[15px] tracking-[-0.015em]">
            {links.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  {...(l.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className={link}
                >
                  {l.label}
                  {l.external ? <span aria-hidden> ↗</span> : null}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Right padding keeps the row clear of the fixed record player. */}
      <div className="flex flex-wrap items-baseline gap-x-6 gap-y-1 border-t border-ink/10 py-6 pr-[8.5rem] pl-5 font-headline text-[12px] tracking-[-0.01em] text-ink/50 sm:pr-[10rem] sm:pl-10">
        <p className="text-ink/70">
          © {new Date().getFullYear()} {site.name}
        </p>
        <p>
          {site.location} · <LocalTime />
        </p>
        <p>
          {/* CC BY 4.0 asks for the title, author, a link to the licence, and a note that we changed it. */}
          Model:{" "}
          <a
            href="https://sketchfab.com/3d-models/aladdins-magic-carpet-2c363d45fb824fbcab624e2ad66eed02"
            target="_blank"
            rel="noopener noreferrer"
            className="underline-offset-2 hover:underline"
          >
            &ldquo;Aladdin&apos;s Magic Carpet&rdquo; by Kremit
          </a>
          , modified, under{" "}
          <a
            href="https://creativecommons.org/licenses/by/4.0/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline-offset-2 hover:underline"
          >
            CC BY 4.0
          </a>
        </p>
      </div>
    </footer>
  );
}
