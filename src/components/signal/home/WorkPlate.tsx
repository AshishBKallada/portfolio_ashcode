import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/data/projects";

/**
 * One project as a full-screen plate, cropped tight into its picture, sliding up over the
 * one before. Its row sits at exactly mid-height on every plate (year, title, stack), so
 * scrolling reads like turning plates in a book; on phones the row drops to the foot.
 */
export function WorkPlate({ project, layer }: { project: Project; layer: number }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group sticky top-0 block h-[82svh] overflow-hidden bg-[#0d0c0b] text-white md:h-[100svh]"
      style={{ zIndex: layer }}
    >
      <Image
        src={project.image}
        alt={`${project.title}: ${project.summary}`}
        fill
        sizes="100vw"
        className="scale-[1.3] object-cover transition-transform duration-[1.6s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.36]"
      />
      <div className="absolute inset-x-0 bottom-5 bg-black/60 px-4 py-3 md:top-1/2 md:bottom-auto md:flex md:h-[90px] md:-translate-y-1/2 md:items-center md:px-8 md:py-0">
        <h3 className="font-display text-[22px] leading-none tracking-[0.01em] uppercase md:absolute md:left-[10%] md:text-[clamp(22px,2vw,30px)]">
          {project.title}
        </h3>
        <div className="mt-2 flex justify-between text-[13px] md:contents md:text-[16px]">
          <span className="tabular-nums md:mr-auto">{project.year}</span>
          <span className="md:ml-auto">
            {project.tags.join(", ")}
            <span aria-hidden className="ml-3 inline-block transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </span>
        </div>
      </div>
    </Link>
  );
}
