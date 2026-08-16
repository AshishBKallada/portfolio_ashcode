export function HeroOverlay() {
  return (
    <div className="pointer-events-none absolute inset-0 z-[5] bg-transparent">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/hero/bg.png"
        srcSet="/images/hero/bg.png 1376w"
        sizes="100vw"
        alt=""
        width={1376}
        height={768}
        decoding="async"
        fetchPriority="high"
        draggable={false}
        className="block h-full w-full bg-transparent object-cover object-top select-none"
      />
    </div>
  );
}
