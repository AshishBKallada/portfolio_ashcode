import { RevealItem } from "@/components/motion/Reveal";
import { projects } from "@/data/projects";
import { RestingCloud } from "./Ornaments";
import { ArchiveList } from "./ArchiveList";
import { Display, SectionLabel, cols, frame, lede } from "./primitives";

/** [02] Archive — every project as a row in an index. */
export function ProjectIndex() {
  return (
    <section id="index" className={`${frame} relative pt-28 pb-8`}>
      <div className={cols}>
        <SectionLabel index="02">Archive</SectionLabel>
        <div className="mt-6 px-3 md:col-span-3 md:mt-0">
          <Display>
            The <em>archive</em>
          </Display>
          <RevealItem>
            <p className={lede}>
            Dashboards, marketing sites and apps. Every project, at a glance.
          </p>
          </RevealItem>
        </div>
      </div>
      <div className="relative">
      <RestingCloud />
      <ArchiveList projects={projects} />
      </div>
    </section>
  );
}
