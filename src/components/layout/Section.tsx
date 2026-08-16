import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

const gutter = "px-6 sm:px-10 md:px-14 lg:px-20 xl:px-28";
const gutterLeft = "pl-6 sm:pl-10 md:pl-14 lg:pl-20 xl:pl-28 pr-0";

type SectionProps = {
  id?: string;
  as?: ElementType;
  children: ReactNode;
  className?: string;
  bleedRight?: boolean;
};

export function Section({
  id,
  as = "section",
  children,
  className = "",
  bleedRight = false,
}: SectionProps) {
  const Tag = as as ElementType<ComponentPropsWithoutRef<"section">>;
  const pad = bleedRight ? gutterLeft : gutter;
  const anchor = id ? "scroll-mt-20" : "";
  return (
    <Tag
      id={id}
      className={`${anchor} bg-background ${pad} ${className}`.trim()}
    >
      {children}
    </Tag>
  );
}
