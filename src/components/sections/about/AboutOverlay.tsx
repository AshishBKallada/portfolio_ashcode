import Image from "next/image";
import { site } from "@/data/site";

export function AboutOverlay() {
  return (
    // The artwork is painted leaning ~45°, so counter-rotate it to stand upright.
    <div className="pointer-events-none flex justify-end overflow-x-clip px-3 py-20 sm:px-4 sm:py-28">
      <Image
        src={site.about.overlay}
        alt=""
        width={1189}
        height={896}
        sizes="(max-width: 640px) 68vw, 46vw"
        className="h-auto w-[min(68vw,34rem)] rotate-[42deg] select-none object-contain sm:w-[min(52vw,40rem)] lg:w-[min(46vw,44rem)]"
      />
    </div>
  );
}
