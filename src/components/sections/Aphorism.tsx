import Image from "next/image";

export function Aphorism() {
  return (
    <section className="relative w-full overflow-hidden bg-white">
      <div className="relative h-[70svh] min-h-[420px] w-full sm:h-[80svh]">
        <Image
          src="/images/ancients.png"
          alt="Ancient philosophers examining a laptop, painted in classical oil style."
          fill
          sizes="100vw"
          className="object-cover object-center"
        />

        <div className="absolute inset-0 flex flex-col justify-between px-6 py-10 text-white sm:px-10 md:px-14 lg:px-20 xl:px-28">
          <div className="flex items-center gap-4 text-[10px] font-medium uppercase tracking-[0.35em] text-white">
            <span>Codex · MMXXVI</span>
            <span className="h-px flex-1 bg-white/60" />
            <span>Fragment XI</span>
          </div>

          <figure className="mx-auto max-w-3xl text-center">
            <div className="mx-auto h-px w-16 bg-white/70" />
            <p className="mt-4 text-[10px] font-medium uppercase tracking-[0.35em] text-white">
              Attributed to the school of AshCode
            </p>
            <blockquote className="mt-4 font-serif text-[clamp(1.1rem,2.2vw,1.75rem)] leading-[1.35] tracking-tight text-white">
              &ldquo;If it bears the mark of{" "}
              <em className="font-serif font-extralight italic">AshCode</em>,
              the code shall run{" "}
              <em className="font-serif font-extralight italic">
                cleaner than water
              </em>
              , truer than stone, and last{" "}
              <em className="font-serif font-extralight italic">
                longer than the hand that carved it
              </em>
              .&rdquo;
            </blockquote>
            <div className="mx-auto mt-4 h-px w-16 bg-white/70" />
          </figure>

          <div className="flex items-center gap-4 text-[10px] font-medium uppercase tracking-[0.35em] text-white">
            <span>Verse the first</span>
            <span className="h-px flex-1 bg-white/60" />
            <span>Craft over cleverness</span>
          </div>
        </div>
      </div>
    </section>
  );
}
