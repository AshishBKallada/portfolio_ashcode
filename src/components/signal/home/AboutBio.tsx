import Link from "next/link";
import { site } from "@/data/site";
import { Reveal } from "./Reveal";

/** About, released from the pin: the tagline as a statement, the bio and approach beside it, the résumé as the action. */
export function AboutBio() {
  return (
    <div className="grid gap-10 px-4 pb-[18svh] md:grid-cols-12 md:gap-8 md:px-8">
      <Reveal className="md:col-span-6">
        <p className="text-[24px] md:max-w-[20ch] leading-[1.15] tracking-[-0.01em] text-ink lg:text-[36px]">
          {site.tagline}
        </p>
      </Reveal>
      <div className="flex flex-col gap-6 md:col-span-5 md:col-start-8 md:pt-2">
        {[site.aboutEdition.body, ...site.signal.approach.columns].map((text, i) => (
          <Reveal key={text} order={i + 1}>
            <p className="max-w-[46ch] text-[16px] leading-[1.55] text-ink md:text-[18px]">{text}</p>
          </Reveal>
        ))}
        <Reveal order={3} className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-2">
          <Link
            href={site.aboutEdition.cta.href}
            className="inline-flex h-12 items-center bg-ink px-6 text-[16px] font-medium text-white transition-[background-color,transform] duration-300 hover:bg-brand active:scale-[0.98]"
          >
            {site.aboutEdition.cta.label}
          </Link>
          <span className="text-[16px] text-ink/60">
            {site.signal.availability}, {site.location.toLowerCase()}
          </span>
        </Reveal>
      </div>
    </div>
  );
}
