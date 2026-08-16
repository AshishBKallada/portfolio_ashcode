import { site } from "@/data/site";

export function ContactActions() {
  const github = site.socials.find((social) => social.label === "GitHub");

  return (
    <div className="mt-8 flex flex-wrap gap-3">
      <a
        href={`mailto:${site.email}`}
        className="inline-flex items-center rounded-lg bg-[#dc2626] px-5 py-2.5 font-sans text-[13px] font-medium tracking-[-0.02em] text-white transition-opacity hover:opacity-80"
      >
        {site.email}
      </a>
      {github ? (
        <a
          href={github.href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center rounded-lg border border-border px-5 py-2.5 font-sans text-[13px] font-medium tracking-[-0.02em] text-foreground transition-colors hover:bg-foreground/[.04]"
        >
          GitHub
        </a>
      ) : null}
    </div>
  );
}
