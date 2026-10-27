import { Magnetic } from "@/components/motion/Magnetic";
import { RevealItem } from "@/components/motion/Reveal";
import { CopyEmail } from "@/components/sections/contact/CopyEmail";
import { LocalTime } from "@/components/signal/LocalTime";
import { Dot, frame } from "@/components/signal/primitives";
import { site } from "@/data/site";

const copy = site.contactStatement;
const social = (label: string) => site.socials.find((s) => s.label === label)?.href ?? "";

/** The index, in three short labelled columns. */
const columns = [
  {
    label: "Elsewhere",
    links: [
      { label: "LinkedIn", href: social("LinkedIn"), external: true },
      { label: "GitHub", href: social("GitHub"), external: true },
    ],
  },
  {
    label: "Pages",
    links: [
      { label: "Work", href: "/#index", external: false },
      { label: "About", href: "/#about", external: false },
      { label: "Résumé", href: "/resume", external: false },
    ],
  },
];

const [wordA, wordB] = ["Ash", "Code"];

const label = "font-headline text-[12px] uppercase tracking-[0.12em] text-ink/45";
const item = "font-headline text-[17px] leading-[1.35] tracking-[-0.015em]";

/**
 * Contact and footer in one closing sheet, on the page ground (as the Index):
 * the email set large as the thing to do, with copy and the call beside it;
 * a hairline, then the index in three labelled columns (Elsewhere, Pages,
 * Based); the wordmark across the foot; one credit row. On the home page it
 * rises over Studio's held painting beside the rail (besideRail), its closing
 * line set over the painting above (ClosingEdition); elsewhere it runs full
 * width with the line in it, its text clearing the rail (globals.css:
 * .footer-inner). The earlier dark footer and the painted ContactEdition are
 * folded into this.
 */
export function SiteFooter({ besideRail = false }: { besideRail?: boolean }) {
  // Beside the rail the sheet itself starts at the rail's edge, so its text needs no extra inset.
  const inner = besideRail ? "md:px-10" : "footer-inner";
  return (
    <footer
      id="contact"
      // Beside the rail, the rail sits over the painting's open column, not the sheet.
      data-nav-theme={besideRail ? "dark" : "light"}
      className={`relative overflow-hidden bg-background text-ink ${besideRail ? "md:ml-[var(--nav-sidebar-w)]" : ""}`}
    >
      <div className={`${frame} ${inner} pt-[clamp(3.5rem,9vh,6rem)]`}>
        {/* Beside the rail the closing line is set over the painting above (ClosingEdition). */}
        {besideRail ? null : (
          <>
            <h2 className="sr-only">
              {copy.lines.join(" ")} {copy.script}
            </h2>
            <RevealItem>
              <p aria-hidden className="mb-[clamp(3rem,8vh,5rem)] max-w-[56rem] font-headline text-[clamp(2.6rem,6vw,5.75rem)] leading-[0.92] tracking-[-0.05em] text-balance">
                {copy.lines.join(" ")}{" "}
                <span className="font-narrative tracking-[-0.045em] text-script">
                  <span className="mr-[-0.04em] font-flourish text-[1.3em] leading-none tracking-normal">{copy.script[0]}</span>
                  {copy.script.slice(1)}
                </span>
              </p>
            </RevealItem>
          </>
        )}

        {/* The address, large, as the thing to do; copy and the call beside it. */}
        <RevealItem className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <p className={`${label} inline-flex items-center gap-2`}>
              <Dot className="animate-pulse bg-brand" />
              {site.signal.availability}
            </p>
            <a
              href={`mailto:${site.email}`}
              className="mt-4 block font-narrative text-[clamp(2rem,5.2vw,4.75rem)] leading-[1] tracking-[-0.04em] [overflow-wrap:anywhere] underline decoration-ink/20 decoration-1 underline-offset-[0.14em] transition-colors hover:decoration-ink"
            >
              {site.email}
            </a>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <CopyEmail email={site.email} chip />
            <Magnetic>
              <a
                href={`mailto:${site.email}`}
                className="inline-flex min-h-11 items-center gap-2.5 rounded-full bg-ink px-5 font-headline text-[15px] tracking-[-0.02em] text-cream transition-colors hover:bg-ink/85 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
              >
                {copy.cta}
                <span aria-hidden>↗</span>
              </a>
            </Magnetic>
          </div>
        </RevealItem>

        {/* The index: a hairline, then three short labelled columns. */}
        <RevealItem
          delay={0.08}
          className="mt-[clamp(3rem,8vh,5rem)] grid grid-cols-2 gap-x-8 gap-y-10 border-t border-ink/15 pt-8 md:grid-cols-3"
        >
          {columns.map((col) => (
            <nav key={col.label} aria-label={col.label}>
              <p className={label}>{col.label}</p>
              <ul className="mt-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className={`${item} transition-opacity hover:opacity-60 focus-visible:underline`}
                    >
                      {link.label}
                      {link.external ? <span aria-hidden> ↗</span> : null}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
          <div>
            <p className={label}>Based</p>
            <p className={`${item} mt-3`}>{site.location}, across time zones</p>
            <p className={`${item} text-ink/50`}>
              <LocalTime /> your time
            </p>
          </div>
        </RevealItem>

        {/* The wordmark across the foot. */}
        <div aria-hidden className="mt-[clamp(3.5rem,10vh,6rem)]">
          <p className="flex items-baseline justify-between leading-[0.78] text-ink select-none">
            <span className="font-headline text-[clamp(4.5rem,15vw,15rem)] tracking-[-0.06em]">{wordA}</span>
            <span className="font-narrative text-[clamp(4.5rem,15vw,15rem)] tracking-[-0.05em]">
              <span className="mr-[-0.06em] font-flourish text-[1.3em] leading-none tracking-normal text-script">{wordB[0]}</span>
              {wordB.slice(1)}
            </span>
          </p>
        </div>
      </div>

      <div className="mt-8 border-t border-ink/12">
        {/* Right padding keeps the row clear of the fixed record player. */}
        <div className={`${frame} ${inner} flex flex-wrap items-baseline gap-x-6 gap-y-1 py-5 pr-[8.5rem] font-headline text-[13px] tracking-[-0.01em] text-ink/55 sm:pr-[10rem]`}>
          <p className="text-ink/75">
            © {new Date().getFullYear()} {site.name}
          </p>
          <p className="font-narrative text-[15px] tracking-[-0.02em]">Built by hand, made to last.</p>
          {/* CC-BY-4.0 asks for this credit (HeroCarpet). */}
          <p>
            Carpet model:{" "}
            <a
              href="https://sketchfab.com/3d-models/aladdins-magic-carpet-2c363d45fb824fbcab624e2ad66eed02"
              target="_blank"
              rel="noopener noreferrer"
              className="underline-offset-2 hover:underline"
            >
              &ldquo;Aladdin&apos;s Magic Carpet&rdquo; by Kremit
            </a>
            , CC BY 4.0
          </p>
        </div>
      </div>
    </footer>
  );
}
