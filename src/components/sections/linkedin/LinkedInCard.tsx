import Image from "next/image";
import { RevealText } from "@/components/motion/Reveal";
import type { LinkedInItem } from "@/data/linkedin";

export function LinkedInCard({ item }: { item: LinkedInItem }) {
  return (
    <article className="group mb-5 break-inside-avoid sm:mb-6">
      <div className="overflow-hidden bg-background">
        <Image
          src={item.image}
          alt=""
          width={item.width}
          height={item.height}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="h-auto w-full transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>

      <RevealText className="mt-2.5">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-sans text-[13px] font-medium tracking-[-0.02em] text-foreground">
            {item.title}
          </h3>
          <span className="rounded-full border border-border px-2 py-0.5 font-sans text-[10px] tracking-[0.06em] text-muted">
            {item.tag}
          </span>
        </div>
      </RevealText>
    </article>
  );
}
