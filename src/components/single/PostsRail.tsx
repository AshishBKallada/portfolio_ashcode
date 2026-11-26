import Image from "next/image";
import { site } from "@/data/site";
import { Marquee } from "./Marquee";

const linkedin = site.socials.find((s) => s.label === "LinkedIn")?.href ?? "https://www.linkedin.com";

// Left edge: the LinkedIn posts running upward past the desert on a strip of film, each one a
// link to the profile. On wide screens the film hangs from the hero's plane instead
// (FilmRibbon) and this strip stays only for screen readers.
export function PostsRail() {
  return (
    <aside className="sg-rail sg-rail--left" aria-labelledby="posts-title">
      <div className="sg-rail__head">
        <h2 id="posts-title" className="font-headline text-[12px] leading-none tracking-[-0.01em]">
          LinkedIn
        </h2>
        <a
          href={linkedin}
          target="_blank"
          rel="noreferrer"
          className="font-headline text-[11px] leading-none text-cream/70 transition-colors hover:text-cream"
          aria-label="LinkedIn profile"
        >
          ↗
        </a>
      </div>
      <Marquee label="LinkedIn posts" direction="up" seconds={46}>
        {site.signal.linkedin.posts.map((post, i) => (
          <li key={post.src} className="sg-post" data-preview-kind="post" data-preview-index={i}>
            <a href={linkedin} target="_blank" rel="noreferrer" className="group block">
              <span className="sg-post__img">
                <Image src={post.src} alt={`LinkedIn post: ${post.title}`} fill sizes="64px" />
              </span>
            </a>
          </li>
        ))}
      </Marquee>
    </aside>
  );
}
