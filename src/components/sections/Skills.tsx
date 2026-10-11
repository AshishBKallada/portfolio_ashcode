import { site } from "@/data/site";
import { SkillsRing } from "@/components/three/SkillsRing";
import { IntroParallax } from "@/components/sections/intro/IntroParallax";

const skills = site.skills;
const ringLayer = "pointer-events-none absolute inset-0";

// Red stage with a navbar-red band of monospace skill rows scrolling
// across it; a 3D ring engraved with the core stack passes through the band.
export function Skills() {
  return (
    <section
      id="skills"
      style={{ backgroundColor: site.intro.bg }}
      className="flex h-full min-h-svh flex-col justify-center overflow-hidden text-white"
    >
      <h2 className="sr-only">
        {skills.eyebrow}: {skills.rows.flat().join(", ")}
      </h2>
      <IntroParallax>
        <div className="relative flex h-[min(80svh,52rem)] items-center">
          <SkillsRing
            text={skills.ring}
            half="back"
            className={`${ringLayer} z-0`}
          />
          <div
            aria-hidden
            style={{ backgroundColor: site.navbar.bg }}
            className="relative z-10 w-full py-[clamp(0.6rem,1.4vw,1.25rem)] font-mono text-[clamp(0.85rem,2.1vw,1.9rem)] leading-[1.15] tracking-[0.02em] text-white uppercase"
          >
            {skills.rows.map((row, i) => (
              <div key={i} className="overflow-hidden whitespace-nowrap">
                <div
                  className={`skills-marquee flex w-max ${i % 2 ? "skills-marquee-reverse" : ""}`}
                  style={{ animationDuration: `${38 + i * 6}s` }}
                >
                  {[0, 1].map((copy) => (
                    <span key={copy} className="flex">
                      {row.map((skill, j) => (
                        <span key={j} className="pr-[2.5ch]">
                          {skill}
                        </span>
                      ))}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <SkillsRing
            text={skills.ring}
            half="front"
            className={`${ringLayer} z-20`}
          />
        </div>
      </IntroParallax>
    </section>
  );
}
