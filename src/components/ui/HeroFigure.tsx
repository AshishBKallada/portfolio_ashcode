import Image from "next/image";

type HeroFigureProps = {
  src: string;
  alt?: string;
};

export function HeroFigure({ src, alt = "" }: HeroFigureProps) {
  return (
    <div className="relative ml-auto w-full max-w-[340px] shrink-0 sm:max-w-[400px] lg:max-w-none lg:w-[min(34vw,460px)]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute top-1/3 left-1/2 h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(120,120,120,0.18),transparent_70%)] blur-3xl" />
      </div>
      <Image
        src={src}
        alt={alt}
        width={1800}
        height={2400}
        priority
        className="relative h-auto w-full select-none object-contain object-right object-top"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[38%] bg-gradient-to-t from-background from-15% to-transparent"
      />
    </div>
  );
}
