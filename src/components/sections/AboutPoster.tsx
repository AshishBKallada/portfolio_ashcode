import Image from "next/image";
import { site } from "@/data/site";

const copy = site.aboutPoster;
const POSTER_BG = "#ffffff";
const github = site.socials.find((s) => s.label === "GitHub");

// Editorial "about me" poster on white, in brand maroon: a towering condensed ABOUT ME across
// the top, the cut-out portrait standing in front of its lower half, a
// script signature across the chest, the bio beneath it, and a footer line
// with the name, three sparkles and the GitHub handle.
export function AboutPoster() {
  return (
    <section
      id="about-me"
      style={{ backgroundColor: POSTER_BG }}
      className="relative isolate flex h-full min-h-svh flex-col items-center overflow-hidden px-4 pt-24 font-sans text-brand sm:px-5 sm:pt-28"
    >
      <h2 className="sr-only">{copy.heading}</h2>

      {/* Heading: stretched tall and as wide as the stage allows. */}
      <p
        aria-hidden
        className="w-full origin-top scale-y-[1.35] text-center font-display text-[min(23vw,32svh)] leading-[0.82] tracking-[-0.01em] whitespace-nowrap uppercase"
      >
        {copy.heading}
      </p>

      {/* Portrait anchored to the bottom edge, in front of the heading. Its
          lower half fades into the white so the copy over it stays legible. */}
      <div className="pointer-events-none absolute bottom-0 left-1/2 z-10 aspect-[478/1086] h-[min(88svh,200vw)] -translate-x-1/2">
        <Image
          src={copy.photo}
          alt={copy.signature}
          fill
          preload
          sizes="(min-width: 640px) 40svh, 90vw"
          className="object-contain object-bottom"
        />
        <div
          aria-hidden
          className="absolute inset-x-[-20%] bottom-0 h-[45%]"
          style={{ background: `linear-gradient(to top, ${POSTER_BG} 8%, transparent)` }}
        />
      </div>

      {/* Signature, bio and footer, layered over the portrait. */}
      <div className="relative z-20 mt-auto flex w-full max-w-2xl flex-col items-center pb-5 text-center">
        <p
          aria-hidden
          className="-rotate-3 font-script text-[clamp(2.75rem,7vw,5.5rem)] leading-none [text-shadow:0_4px_24px_rgba(255,255,255,0.9)]"
        >
          {copy.signature}
        </p>
        <p className="mt-5 max-w-xl text-[clamp(0.95rem,1.35vw,1.15rem)] leading-snug italic [text-shadow:0_2px_12px_rgba(255,255,255,0.9)]">
          {copy.bio}
        </p>
      </div>

      <div className="relative z-20 grid w-full grid-cols-3 items-center pb-5 text-[11px] font-medium tracking-[0.14em] uppercase sm:text-xs">
        <span>{site.name}</span>
        <span aria-hidden className="text-center text-sm tracking-[0.6em]">
          ✦✦✦
        </span>
        {github ? (
          <a
            href={github.href}
            target="_blank"
            rel="noreferrer"
            className="nav-link justify-self-end"
          >
            @{github.href.split("/").pop()}
          </a>
        ) : (
          <span />
        )}
      </div>
    </section>
  );
}
