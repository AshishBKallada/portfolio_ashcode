import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { PrintButton } from "@/components/resume/PrintButton";
import { HERO_FIGURE, HERO_HARP } from "@/lib/hero";
import { resume } from "@/data/resume";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Résumé",
  description: `${site.name} — ${resume.role}. ${resume.summary}`,
  alternates: { canonical: "/resume" },
};

const nav = [
  { href: "#about", label: "About" },
  { href: "#experience", label: "Experience" },
  { href: "#education", label: "Education" },
  { href: "#skills", label: "Skills" },
];

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-20 border-t border-black/10 py-14">
      <h2 className="font-serif text-[2rem] leading-none text-black">{title}</h2>
      <div className="mt-6">{children}</div>
    </section>
  );
}

// Two-column résumé: a sticky identity sidebar and a reading column with
// About, skills, an experience timeline and education. Prints cleanly to PDF.
export default function ResumePage() {
  return (
    <div
      className="min-h-screen bg-paper font-sans text-black/80 print:bg-white"
    >
      <div className="mx-auto grid max-w-6xl grid-cols-1 md:grid-cols-[17rem_1fr]">
        {/* Sidebar */}
        <aside className="border-black/10 px-6 pt-8 pb-10 md:sticky md:top-0 md:h-screen md:border-r md:pb-8">
          <div className="flex h-full flex-col">
            <div className="relative size-16 overflow-hidden rounded-md bg-black/10">
              <Image
                src={HERO_FIGURE}
                alt={site.name}
                sizes="200px"
                className="absolute top-0 left-[-55%] h-[230%] w-auto max-w-none"
              />
            </div>
            <h1 className="mt-5 font-serif text-[1.6rem] leading-tight text-black">{site.name}</h1>
            <p className="text-[12px] text-black/50">{resume.role}</p>
            <p className="mt-4 text-[13px] leading-relaxed text-black/60">{resume.summary}</p>
            <p className="mt-5 font-script text-brand text-[2.6rem] leading-none">
              {site.name}
            </p>

            <ul className="mt-6 space-y-2 border-t border-black/10 pt-5 text-[12px] text-black/70">
              {resume.facts.map((fact) => (
                <li key={fact} className="flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-brand" />
                  {fact}
                </li>
              ))}
            </ul>

            <div className="mt-10 md:mt-auto">
              <div className="flex gap-4 text-[12px] text-black/60">
                {site.socials.map((social) => (
                  <a key={social.href} href={social.href} target="_blank" rel="noreferrer" className="hover:text-black">
                    {social.label}
                  </a>
                ))}
              </div>
              <div className="mt-4 flex gap-2 print:hidden">
                <PrintButton
                  className="flex flex-1 bg-brand items-center justify-center gap-2 rounded-md px-4 py-3 text-[13px] font-medium text-white transition-opacity hover:opacity-90"
                >
                  <span aria-hidden>↓</span> Download CV
                </PrintButton>
                <a
                  href={`mailto:${site.email}`}
                  aria-label="Email"
                  className="flex w-12 items-center justify-center rounded-md bg-black/[0.06] text-black/70 hover:bg-black/10"
                >
                  ✉
                </a>
              </div>
            </div>
          </div>
        </aside>

        {/* Main column (the root layout already provides <main>). */}
        <div className="px-6 md:px-14">
          <header className="sticky top-0 z-10 flex items-center justify-between bg-paper py-4 print:hidden">
            <Link href="/" className="font-display text-lg text-brand uppercase">
              {site.name}
            </Link>
            <nav className="hidden gap-6 text-[12px] text-black/60 sm:flex">
              {nav.map((link) => (
                <a key={link.href} href={link.href} className="hover:text-black">
                  {link.label}
                </a>
              ))}
            </nav>
            <a
              href={`mailto:${site.email}`}
              className="rounded-md bg-brand px-3 py-1.5 text-[12px] font-medium text-white"
            >
              Contact me
            </a>
          </header>

          <div className="flex flex-col items-center py-14 text-center">
            <Image
              src={HERO_HARP}
              alt=""
              sizes="82px"
              className="h-36 w-auto -rotate-12 drop-shadow-[0_14px_20px_rgba(0,0,0,0.2)]"
            />
            <h2 className="mt-6 font-serif text-[clamp(2.2rem,4vw,3rem)] leading-none text-black">{resume.headline}</h2>
            <p className="mt-4 max-w-md text-[14px] leading-relaxed text-black/55">{resume.subline}</p>
            <a
              href="#experience"
              className="mt-7 inline-flex items-center gap-8 rounded-md bg-black/[0.06] px-4 py-2.5 text-[13px] font-medium text-black/80 hover:bg-black/10 print:hidden"
            >
              View experience <span aria-hidden>→</span>
            </a>
          </div>

          <Section id="about" title="About">
            <p className="max-w-2xl text-[14px] leading-relaxed text-black/65">{resume.about}</p>
          </Section>

          <Section id="skills" title="Skills">
            <ul className="flex flex-wrap gap-2">
              {resume.keySkills.map((skill) => (
                <li key={skill} className="rounded-md bg-black/[0.06] px-2.5 py-1.5 text-[12px] text-black/75">
                  {skill}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-[12px] leading-relaxed text-black/45">
              Also: {site.skills.rows.flat().join(" · ")}
            </p>
          </Section>

          <Section id="experience" title="Experience">
            <ol className="relative space-y-10 border-l border-black/10 pl-8">
              {resume.experience.map((job) => (
                <li key={`${job.title}-${job.period}`} className="relative">
                  <span className="absolute top-1 -left-[2.4rem] size-4 rounded-sm bg-brand" />
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="font-serif text-[1.25rem] text-black">{job.title}</h3>
                    <span className="text-[12px] text-black/45">{job.period}</span>
                  </div>
                  <p className="text-[12px] text-black/45">
                    {job.company} · {job.type}
                  </p>
                  <p className="mt-3 max-w-xl text-[13px] leading-relaxed text-black/65">{job.summary}</p>
                  {job.points.length > 0 && (
                    <ul className="mt-2 list-disc space-y-1 pl-4 text-[13px] text-black/60">
                      {job.points.map((point) => (
                        <li key={point}>{point}</li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ol>
          </Section>

          <Section id="education" title="Education">
            <ul className="space-y-6">
              {resume.education.map((entry) => (
                <li key={entry.title} className="flex flex-wrap items-baseline justify-between gap-2">
                  <div>
                    <h3 className="font-serif text-[1.25rem] text-black">{entry.title}</h3>
                    <p className="text-[12px] text-black/45">{entry.school}</p>
                  </div>
                  <span className="text-[12px] text-black/45">{entry.period}</span>
                </li>
              ))}
            </ul>
          </Section>

          <footer className="border-t border-black/10 py-10 text-[12px] text-black/45">
            © {new Date().getFullYear()} {site.name} · {site.email}
          </footer>
        </div>
      </div>
    </div>
  );
}
