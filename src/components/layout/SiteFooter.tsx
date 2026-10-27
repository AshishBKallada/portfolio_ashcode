import { Magnetic } from "@/components/motion/Magnetic";
import { RevealItem } from "@/components/motion/Reveal";
import { CopyEmail } from "@/components/sections/contact/CopyEmail";
import { LocalTime } from "@/components/signal/LocalTime";
import { Dot, frame } from "@/components/signal/primitives";
import { site } from "@/data/site";

const copy = site.contactStatement;
const social = (label: string) => site.socials.find((s) => s.label === label)?.href ?? "";

/** One quiet row of places to go, instead of a full index. */
const links = [
  { label: "LinkedIn", href: social("LinkedIn"), external: true },
  { label: "GitHub", href: social("GitHub"), external: true },
  { label: "Résumé", href: "/resume", external: false },
];

const [wordA, wordB] = ["Ash", "Code"];

/**
 * Contact and footer in one closing sheet, kept minimal: the closing line and
 * the email, one row of links beside where and when, the wordmark and a credit,
 * on the page ground (as the Index). On the home page it rises
 * over the pinned Index (page.tsx), leaving the rail's column open
 * (besideRail); elsewhere its text clears the rail (globals.css: .footer-inner).
 * Beside the rail its closing line moves onto the painting above
 * (ClosingEdition). The earlier dark footer and the painted ContactEdition
 * are folded into this.
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
      <div className={`${frame} ${inner} pt-[clamp(5rem,12vh,8rem)]`}>
        {/* Beside the rail the closing line is set over the painting above (ClosingEdition). */}
        {besideRail ? null : (
          <>
            <h2 className="sr-only">
              {copy.lines.join(" ")} {copy.script}
            </h2>
            <RevealItem>
              <p className="inline-flex items-center gap-2 font-headline text-[15px] tracking-[-0.01em] text-ink/70">
                <Dot className="animate-pulse bg-brand" />
                {site.signal.availability}
              </p>
            </RevealItem>
            <RevealItem delay={0.06}>
              <p aria-hidden className="mt-6 max-w-[56rem] font-headline text-[clamp(2.6rem,6vw,5.75rem)] leading-[0.92] tracking-[-0.05em] text-balance">
                {copy.lines.join(" ")}{" "}
                <span className="font-narrative tracking-[-0.045em] text-script">
                  <span className="mr-[-0.04em] font-flourish text-[1.3em] leading-none tracking-normal">{copy.script[0]}</span>
                  {copy.script.slice(1)}
                </span>
              </p>
            </RevealItem>
          </>
        )}
        <RevealItem delay={0.14} className={`${besideRail ? "" : "mt-10"} flex flex-col items-start gap-5 sm:flex-row sm:items-center`}>
          <Magnetic>
            <a
              href={`mailto:${site.email}`}
              className="inline-flex min-h-12 items-center gap-2.5 rounded-full bg-ink px-6 font-headline text-[16px] tracking-[-0.02em] text-cream transition-colors hover:bg-ink/85 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
            >
              {copy.cta}
              <span aria-hidden>↗</span>
            </a>
          </Magnetic>
          <CopyEmail email={site.email} />
        </RevealItem>
      </div>

      {/* Links on the left, where and when on the right: the whole index, kept minimal. */}
      <RevealItem
        className={`${frame} ${inner} mt-[clamp(3rem,8vh,5rem)] flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3 font-headline text-[17px] leading-[1.2] tracking-[-0.015em]`}
      >
        <ul className="flex flex-wrap gap-x-6 gap-y-2">
          {links.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="transition-opacity hover:opacity-60 focus-visible:underline"
              >
                {link.label}
                {link.external ? <span aria-hidden> ↗</span> : null}
              </a>
            </li>
          ))}
        </ul>
        <p className="text-ink/50">
          {site.location} · <LocalTime /> your time
        </p>
      </RevealItem>

      {/* The wordmark, edge to edge. */}
      <div className={`${frame} ${inner} mt-[clamp(3rem,8vh,5rem)]`} aria-hidden>
        <p className="flex items-baseline justify-between leading-[0.78] text-ink select-none">
          <span className="font-headline text-[clamp(4.5rem,17vw,17rem)] tracking-[-0.06em]">{wordA}</span>
          <span className="font-narrative text-[clamp(4.5rem,17vw,17rem)] tracking-[-0.05em]">
            <span className="mr-[-0.06em] font-flourish text-[1.3em] leading-none tracking-normal text-script">{wordB[0]}</span>
            {wordB.slice(1)}
          </span>
        </p>
      </div>

      <div className="mt-10 border-t border-ink/12">
        {/* Right padding keeps the credit clear of the fixed record player. */}
        <div className={`${frame} ${inner} flex flex-wrap items-center justify-between gap-x-6 gap-y-2 py-5 pr-[8.5rem] sm:pr-[10rem]`}>
          <p className="font-headline text-[14px] tracking-[-0.01em] text-ink/70">
            © {new Date().getFullYear()} {site.name}
          </p>
          {/* CC-BY-4.0 asks for this credit (HeroCarpet). */}
          <p className="font-headline text-[12px] tracking-[-0.01em] text-ink/45">
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
          <p className="font-narrative text-[16px] tracking-[-0.02em] text-ink/70">Built by hand, made to last.</p>
        </div>
      </div>
    </footer>
  );
}
