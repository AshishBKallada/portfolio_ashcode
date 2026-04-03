export default function ProjectsSection() {
  return (
    <section id="projects" className="w-full bg-white px-6 py-12 md:px-12 md:py-16 lg:px-16">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-end">
        <h2 className="font-safiro text-right text-lg font-normal tracking-normal text-black md:text-xl">
          Projects
        </h2>

        <div className="flex h-24 w-24 items-center justify-center rounded-full border border-black/30 text-center font-safiro text-[10px] uppercase tracking-[0.12em] text-black md:h-28 md:w-28 md:text-xs">
          Scroll to
          <br />
          explore
        </div>
      </div>
    </section>
  );
}
