import { linkedinSays } from "@/data/linkedin";
import { LinkedInCard } from "./LinkedInCard";

const TILES = 10;

export function LinkedInGrid() {
  const frames = Array.from(
    { length: TILES },
    (_, index) => linkedinSays.items[index % linkedinSays.items.length],
  );

  return (
    <div className="group/strip flex aspect-[15/2] w-full items-stretch gap-px overflow-visible">
      {frames.map((item, index) => (
        <LinkedInCard key={`${item.id}-${index}`} item={item} />
      ))}
    </div>
  );
}
