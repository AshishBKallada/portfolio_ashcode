import Image from "next/image";
import { site } from "@/data/site";
import { Marquee } from "./Marquee";

const linkedin = site.socials.find((s) => s.label === "LinkedIn")?.href ?? "https://www.linkedin.com";

// Left edge: the LinkedIn posts running upward past the desert, each one a link to the profile.
export function PostsRail() {
  return (
    <aside className="sg-rail sg-rail--left" aria-labelledby="posts-title">
      <div className="sg-rail__head">
        <h2 id="posts-title" className="font-headline text-[15px] leading-none tracking-[-0.01em]">
          On LinkedIn
        </h2>
        <a
          href={linkedin}
          target="_blank"
          rel="noreferrer"
          className="font-headline text-[12px] leading-none text-cream/70 transition-colors hover:text-cream"
        >
          Follow ↗
        </a>
      </div>
      <Marquee label="LinkedIn posts" direction="up" seconds={46}>
        {site.signal.linkedin.posts.map((post) => (
          <li key={post.src} className="sg-post">
            <a href={linkedin} target="_blank" rel="noreferrer" className="group block">
              <span className="sg-post__img">
                <Image src={post.src} alt={`LinkedIn post: ${post.title}`} fill sizes="220px" />
              </span>
              <span className="mt-2 block font-headline text-[13px] leading-[1.2] tracking-[-0.01em] text-cream/85 group-hover:text-cream">
                {post.title}
              </span>
            </a>
          </li>
        ))}
      </Marquee>
    </aside>
  );
}
