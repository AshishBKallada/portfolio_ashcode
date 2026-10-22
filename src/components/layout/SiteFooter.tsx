import Link from "next/link";
import { LocalTime } from "@/components/signal/LocalTime";
import { Dot, frame, metaLabel, monoLabel } from "@/components/signal/primitives";
import { site } from "@/data/site";

const index = [
  { href: "/", label: "Home" },
  { href: "/#index", label: "Work" },
  { href: "/#about", label: "About" },
  { href: "/resume", label: "Résumé" },
];

const heading = `${monoLabel} text-muted`;
const link = "nav-link text-[15px]";

/**
 * A light closing strip on every page, sitting on the red ground: the
 * wordmark and a line about the work, two short link lists, the visitor's
 * clock, and a hairline legal row.
 */
export function SiteFooter() {
  return (
    <footer className="relative border-t border-border text-foreground">
      <div className={`${frame} grid grid-cols-2 gap-y-10 py-14 md:grid-cols-4`}>
        <div className="col-span-2 px-3 md:col-span-1">
          <Link href="/" className="font-display text-[28px] leading-none tracking-[0.02em] uppercase">
            {site.name}
          </Link>
          <p className="mt-3 max-w-[16rem] text-[15px] leading-[1.55]">{site.signal.contact}</p>
        </div>

        <nav aria-label="Footer" className="px-3">
          <p className={heading}>Index</p>
          <ul className="mt-4 space-y-1.5">
            {index.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={link}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="px-3">
          <p className={heading}>Elsewhere</p>
          <ul className="mt-4 space-y-1.5">
            {site.socials.map((s) => (
              <li key={s.href}>
                <a href={s.href} target="_blank" rel="noopener noreferrer" className={link}>
                  {s.label}
                </a>
              </li>
            ))}
            <li>
              <a href={`mailto:${site.email}`} className={link}>
                Email
              </a>
            </li>
          </ul>
        </div>

        <div className="col-span-2 px-3 md:col-span-1">
          <p className={heading}>Based</p>
          <p className="mt-4 text-[15px] leading-[1.5]">{site.location}, across time zones</p>
          <p className="mt-2 flex items-center gap-2 text-[14px]">
            <Dot className="bg-script" />
            <LocalTime /> your time
          </p>
        </div>
      </div>

      <div className="border-t border-border">
        <div className={`${frame} flex flex-wrap items-center justify-between gap-x-6 gap-y-2 py-4`}>
          <p className={`${metaLabel} px-3`}>© {new Date().getFullYear()} {site.name}</p>
          <p className={`${metaLabel} px-3 text-muted`}>Set in Editorial New, General Sans</p>
        </div>
      </div>
    </footer>
  );
}
