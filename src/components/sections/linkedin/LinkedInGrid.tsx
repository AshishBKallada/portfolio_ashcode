import { linkedinSays } from "@/data/linkedin";
import { LinkedInCard } from "./LinkedInCard";

export function LinkedInGrid() {
  return (
    <div className="group/strip flex aspect-[15/2] w-full items-stretch gap-px overflow-visible">
      {linkedinSays.items.map((item) => (
        <LinkedInCard key={item.id} item={item} />
      ))}
    </div>
  );
}
