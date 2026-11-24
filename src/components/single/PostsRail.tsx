import Image from "next/image";
import { site } from "@/data/site";
import { Marquee } from "./Marquee";

const linkedin = site.socials.find((s) => s.label === "LinkedIn")?.href ?? "https://www.linkedin.com";

// Left edge: a thin strip of the LinkedIn posts running upward past the desert, pictures only
// (each post's title is its alt text), every one a link to the profile.
export function PostsRail() {
  return (
    <aside className="sg-rail sg-rail--left" aria-labelledby="posts-title">
      <div className="sg-rail__head">
        <h2 id="posts-title" className="font-headline text-[11px] leading-none tracking-[-0.01em]">
          <a href={linkedin} target="_blank" rel="noreferrer" className="transition-colors hover:text-white">
            LinkedIn
          </a>
        </h2>
      </div>
      <Marquee label="LinkedIn posts" direction="up" seconds={46}>
        {site.signal.linkedin.posts.map((post) => (
          <li key={post.src} className="sg-post">
            <a href={linkedin} target="_blank" rel="noreferrer" className="group block" title={post.title}>
              <span className="sg-post__img">
                <Image src={post.src} alt={`LinkedIn post: ${post.title}`} fill sizes="74px" />
              </span>
            </a>
          </li>
        ))}
      </Marquee>
    </aside>
  );
}
