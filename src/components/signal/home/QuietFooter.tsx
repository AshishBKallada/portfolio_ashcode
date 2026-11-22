import Link from "next/link";
import { contact, footerLinks } from "@/data/home";
import { site } from "@/data/site";

/**
 * The close: no footer block. The name returns once at full width, then a single quiet line
 * (what this is, the links, the year and the photo credit) on the plain ground.
 */
export function QuietFooter() {
  const year = new Date().getFullYear();
  return (
    <footer data-nav-theme="light" className="px-4 pt-[20svh] pb-6 text-ink md:px-8 md:pt-[30svh] md:pb-[30px]">
      <p aria-hidden className="font-display text-[28.5vw] leading-[0.8] tracking-[-0.01em] uppercase select-none">
        {site.name}
      </p>
      <div className="mt-10 flex flex-col gap-2 text-[14px] md:grid md:grid-cols-[1fr_auto_1fr] md:items-baseline md:gap-0 md:text-[16px]">
        <p className="text-ink/60">
          {site.signal.fullName}, {site.role.toLowerCase()}
        </p>
        <ul className="flex flex-wrap gap-x-6 gap-y-1">
          {footerLinks.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                className="underline-offset-4 hover:underline"
                {...(link.href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <p className="text-ink/60 md:text-right">
          © {year} · {contact.photo.credit}
        </p>
      </div>
    </footer>
  );
}
