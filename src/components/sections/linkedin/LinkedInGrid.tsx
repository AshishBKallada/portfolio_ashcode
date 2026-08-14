import { linkedinSays } from "@/data/linkedin";
import { LinkedInCard } from "./LinkedInCard";

export function LinkedInGrid() {
  return (
    <div className="mt-12 columns-1 sm:mt-16 sm:columns-2 lg:columns-4 sm:gap-x-4 lg:gap-x-5">
      {linkedinSays.items.map((item) => (
        <LinkedInCard key={item.id} item={item} />
      ))}
    </div>
  );
}
