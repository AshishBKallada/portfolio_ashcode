import { FastImage } from "@/components/ui/FastImage";

export function HeroOverlay() {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-[5] bg-transparent">
      <FastImage
        src="/images/hero/bg.png?v=original"
        alt=""
        width={1376}
        height={768}
        priority
        className="h-auto w-full bg-transparent object-contain object-top select-none"
      />
    </div>
  );
}
