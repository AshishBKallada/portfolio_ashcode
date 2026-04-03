export default function HeroHeader() {
  return (
    <header className="relative z-20 grid w-full min-w-0 shrink-0 grid-cols-2 gap-6 font-mono text-[11px] leading-snug tracking-[0.12em] sm:grid-cols-4 sm:gap-x-6 sm:gap-y-0 md:gap-x-8 md:text-xs">
      <div className="min-w-0 justify-self-start font-safiro text-base font-bold lowercase tracking-normal md:text-lg">
        ashcode
      </div>

      <nav
        className="flex min-w-0 flex-col uppercase justify-self-center text-center sm:w-full sm:items-center"
        aria-label="Primary"
      >
        <a href="#skills" className="hover:opacity-60">
          Works
        </a>
        <a href="#about" className="hover:opacity-60">
          About
        </a>
      </nav>

      <div className="flex min-w-0 flex-col items-end justify-self-center text-right uppercase">
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:opacity-60"
        >
          GitHub
        </a>
        <a
          href="mailto:ashercode4u@gmail.com"
          className="normal-case lowercase tracking-normal hover:opacity-60"
        >
          ashercode4u@gmail.com
        </a>
      </div>

      <div className="flex min-w-0 flex-col items-end justify-self-end text-right uppercase">
        <span>Full-stack developer</span>
        <span>MERN stack</span>
      </div>
    </header>
  );
}
