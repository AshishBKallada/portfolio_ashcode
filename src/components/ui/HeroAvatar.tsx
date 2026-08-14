import Image from "next/image";

type HeroAvatarProps = {
  name: string;
  src?: string;
};

export function HeroAvatar({ name, src }: HeroAvatarProps) {
  const initial = name.trim().charAt(0).toUpperCase() || "A";

  if (src) {
    return (
      <span className="inline-flex size-8 shrink-0 overflow-hidden rounded-full bg-surface">
        <Image
          src={src}
          alt=""
          width={32}
          height={32}
          className="size-8 object-cover object-[center_18%]"
        />
      </span>
    );
  }

  return (
    <span
      aria-hidden="true"
      className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-surface font-sans text-[11px] font-medium text-muted"
    >
      {initial}
    </span>
  );
}
