import Image from "next/image";
import { Reveal } from "./Reveal";

type Exhibit = { src: string; title: string; role: string; text: string };

/** One exhibit in About, hung against the left or right edge like the corridor's walls: a 4:5 picture, then its title, role and one sentence under its corner. */
export function ExhibitItem({ item, side }: { item: Exhibit; side: "left" | "right" }) {
  return (
    <li
      className={`w-[72%] md:w-[20vw] ${side === "left" ? "self-start" : "self-end"}`}
    >
      <Reveal>
        <div className="relative aspect-[4/5] overflow-hidden bg-[#0d0c0b]">
          <Image
            src={item.src}
            alt=""
            fill
            sizes="(min-width: 768px) 20vw, 72vw"
            className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.04]"
          />
        </div>
      </Reveal>
      <Reveal order={1} className="mt-4 max-w-[280px]">
        <h3 className="font-sans text-[18px] leading-snug font-medium text-ink">{item.title}</h3>
        <p className="text-[14px] leading-snug text-ink/60">{item.role}</p>
        <p className="mt-2 text-[16px] leading-[1.5] text-ink">{item.text}</p>
      </Reveal>
    </li>
  );
}
