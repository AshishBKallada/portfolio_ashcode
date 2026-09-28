import Image from "next/image";
import type { LinkedInItem } from "@/data/linkedin";

export function LinkedInCard({
  item,
  className = "",
}: {
  item: LinkedInItem;
  className?: string;
}) {
  return (
    <div
      tabIndex={0}
      className={`group overflow-hidden outline-none ${className}`}
    >
      <Image
        src={item.image}
        alt={item.title}
        fill
        sizes="(min-width: 768px) 25vw, 50vw"
        className="object-cover object-top opacity-80 grayscale-[35%] transition duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105 group-hover:opacity-100 group-hover:grayscale-0 group-focus-visible:opacity-100 group-focus-visible:grayscale-0"
      />
      <div className="absolute inset-x-3 bottom-3 translate-y-2 rounded-xl bg-black/55 p-3 opacity-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] backdrop-blur-xl transition duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
        <p className="text-xs leading-snug text-white sm:text-sm">{item.title}</p>
        <p className="mt-1 text-[10px] tracking-[0.16em] text-white/70 uppercase">
          {item.note}
        </p>
      </div>
    </div>
  );
}
