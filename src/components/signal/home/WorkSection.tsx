import { projects } from "@/data/projects";
import { WorkPlate } from "./WorkPlate";

/** Work: the projects as full-screen plates, each sliding over the last. */
export function WorkSection() {
  return (
    <section id="index" aria-labelledby="work-title" data-nav-theme="dark" className="relative">
      <h2 id="work-title" className="sr-only">
        Selected work
      </h2>
      {projects.map((project, i) => (
        <WorkPlate key={project.slug} project={project} layer={i + 1} />
      ))}
    </section>
  );
}
