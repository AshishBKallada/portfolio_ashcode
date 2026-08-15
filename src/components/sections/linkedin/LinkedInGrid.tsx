import { linkedinSays } from "@/data/linkedin";
import { LinkedInCard } from "./LinkedInCard";

const TILES = 10;

export function LinkedInGrid() {
  const frames = Array.from(
    { length: TILES },
    (_, index) => linkedinSays.items[index % linkedinSays.items.length],
  );

  return (
    <div className="flex w-full gap-px">
      {frames.map((item, index) => (
        <LinkedInCard key={`${item.id}-${index}`} item={item} />
      ))}
    </div>
  );
}
