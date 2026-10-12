import { AnchorLink } from "@/components/motion/AnchorLink";
import { Parallax } from "@/components/motion/Parallax";
import { site } from "@/data/site";

const explore = [
  { href: "/#about", label: "About" },
  { href: "/#projects", label: "Projects" },
  { href: "/#contact", label: "Contact" },
];

function ArrowDot() {
  return (
    <span
      aria-hidden
      className="inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-cream transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
      style={{ color: site.navbar.bg }}
    >
      <svg
        viewBox="0 0 24 24"
        className="size-3.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
      >
        <path d="M7 17 17 7M8 7h9v9" />
      </svg>
    </span>
  );
}

// Link columns over a giant lowercase wordmark that runs off the bottom edge,
// white on the navbar red.
export function SiteFooter() {
  return (
    <footer
      style={{ backgroundColor: site.navbar.bg }}
      className="relative z-20 overflow-hidden px-4 pt-10 text-cream sm:px-5 sm:pt-12"
    >
      {/* Light rule separating the footer from the contact section above. */}
      <div aria-hidden className="absolute inset-x-4 top-0 h-px bg-cream/25 sm:inset-x-5" />
      <div className="grid grid-cols-2 gap-x-6 gap-y-10 font-sans md:grid-cols-[1fr_1.3fr_1.4fr]">
        <nav aria-label="Explore" className="text-sm">
          <p className="mb-3 font-medium">Explore</p>
          <ul className="space-y-1.5 text-[13px] text-cream/70">
            {explore.map((link) => (
              <li key={link.href}>
                <AnchorLink
                  href={link.href}
                  className="transition-colors hover:text-cream"
                >
                  {link.label}
                </AnchorLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="text-sm">
          <p className="mb-3 font-medium">Follow me</p>
          <ul className="flex flex-wrap gap-2">
            {site.socials.map((social) => (
              <li key={social.href}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-9 items-center rounded-full bg-cream/12 px-4 text-[13px] transition-colors hover:bg-cream/25"
                >
                  {social.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="col-span-2 md:col-span-1">
          <a href={`mailto:${site.email}`} className="group block">
            <span className="flex items-center gap-2 text-[clamp(1.15rem,1.6vw,1.4rem)] font-medium">
              Email {site.name} <ArrowDot />
            </span>
            <span className="mt-0.5 block text-[13px] text-cream/70">
              Let&apos;s work together
            </span>
          </a>
          <p className="mt-6 text-[12px] text-cream/70">
            © {new Date().getFullYear()} {site.name}
          </p>
        </div>
      </div>

      <Parallax y={[140, 0]} offset={["start end", "end end"]}>
        <p
          aria-hidden
          className="mt-[clamp(2.5rem,6vw,5rem)] -mb-[0.26em] -ml-[0.04em] font-sans text-[clamp(5rem,22.5vw,24rem)] leading-[0.8] font-bold tracking-[-0.06em] whitespace-nowrap lowercase"
        >
          {site.name}
        </p>
      </Parallax>
    </footer>
  );
}
