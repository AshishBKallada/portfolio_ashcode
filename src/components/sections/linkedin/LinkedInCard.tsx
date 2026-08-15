import Image from "next/image";
import type { LinkedInItem } from "@/data/linkedin";

export function LinkedInCard({ item }: { item: LinkedInItem }) {
  return (
    <div
      tabIndex={0}
      className="group relative z-0 h-full min-h-0 min-w-0 grow basis-0 cursor-pointer outline-none transition-[flex-grow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] [perspective:900px] motion-safe:group-has-[:is(:hover,:focus-within)]/strip:grow-[0.78] motion-safe:hover:z-20 motion-safe:hover:!grow-[2] motion-safe:focus-within:z-20 motion-safe:focus-within:!grow-[2]"
    >
      <div className="relative h-full w-full transition-transform duration-500 ease-out [transform-style:preserve-3d] [-webkit-transform-style:preserve-3d] motion-safe:group-hover:[transform:rotateY(180deg)] motion-safe:group-focus-within:[transform:rotateY(180deg)]">
        <div className="absolute inset-0 overflow-hidden bg-surface [backface-visibility:hidden] [-webkit-backface-visibility:hidden]">
          <Image
            src={item.image}
            alt={item.title}
            fill
            sizes="10vw"
            className="object-cover"
          />
        </div>

        <div className="absolute inset-0 flex flex-col justify-end overflow-hidden bg-[#dc2626] px-1.5 py-2 [backface-visibility:hidden] [transform:rotateY(180deg)] [-webkit-backface-visibility:hidden] sm:px-2 sm:py-2.5">
          <p className="font-sans text-[8px] uppercase tracking-[0.18em] text-white/70 sm:text-[9px]">
            {item.tag}
          </p>
          <h3 className="mt-1 font-serif text-[11px] leading-tight font-extralight italic text-white sm:text-xs">
            {item.title}
          </h3>
          <p className="mt-1.5 font-serif text-[10px] leading-snug font-extralight italic text-white/90 sm:text-[11px]">
            {item.note}
          </p>
        </div>
      </div>
    </div>
  );
}
