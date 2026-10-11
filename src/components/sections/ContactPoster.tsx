import Image from "next/image";
import { RevealItem } from "@/components/motion/Reveal";
import { SectionReveal } from "@/components/motion/SectionReveal";
import { site } from "@/data/site";

const copy = site.contactPoster;

const display =
  "font-display uppercase leading-[0.86] text-[clamp(3.5rem,9vw,9rem)]";

// Split poster: a red typographic panel that spells LET'S W( note )RK. with
// the note set inside the bracketed "O", beside a full-bleed image carrying
// the wordmark.
export function ContactPoster() {
  return (
    <section
      id="contact"
      className="grid min-h-svh grid-cols-1 md:grid-cols-[minmax(0,9fr)_minmax(0,11fr)]"
    >
      <div
        style={{ backgroundColor: site.navbar.bg, color: site.projects.bg }}
        className="flex flex-col px-6 pt-8 pb-6 sm:px-10"
      >
        <p className="text-center font-display text-sm leading-[0.95] whitespace-pre-line uppercase">
          {"Ash\nCode."}
        </p>

        <div className="my-auto py-16">
          <SectionReveal>
            <p className={display}>{copy.lineOne}</p>
          </SectionReveal>

          <SectionReveal delay={0.08}>
            <div className={`flex items-center ${display}`}>
              <span>{copy.lineTwoLead}(</span>
              <span className="mx-[0.15em] flex-1 font-serif text-[clamp(0.95rem,1.6vw,1.5rem)] leading-[1.15] font-extralight normal-case italic">
                {copy.note.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </span>
              <span>)</span>
            </div>
          </SectionReveal>

          <SectionReveal delay={0.16}>
            <p className={display}>{copy.lineThree}</p>
          </SectionReveal>
        </div>

        <div className="flex flex-wrap items-end justify-between gap-4 font-mono text-[11px] uppercase">
          <a
            href={`mailto:${site.email}`}
            className="underline-offset-4 hover:underline"
          >
            {site.email}
          </a>
          <div className="flex gap-5">
            {site.socials.map((social) => (
              <a
                key={social.href}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                className="underline-offset-4 hover:underline"
              >
                {social.label}
              </a>
            ))}
          </div>
          <span className="font-display text-sm normal-case">
            W(&nbsp;&nbsp;)RK
          </span>
        </div>
      </div>

      <div className="relative min-h-[70svh] overflow-hidden bg-black md:min-h-0">
        <Image
          src={copy.image}
          alt=""
          fill
          sizes="(min-width: 768px) 55vw, 100vw"
          className="object-cover object-[50%_35%]"
        />
        <RevealItem className="absolute inset-0 flex items-center justify-center">
          <p
            style={{ color: site.projects.bg }}
            className="font-display text-[clamp(3rem,8vw,8rem)] leading-[0.85] uppercase drop-shadow-[0_6px_30px_rgba(0,0,0,0.45)]"
          >
            {copy.overlay}
          </p>
        </RevealItem>
      </div>
    </section>
  );
}
