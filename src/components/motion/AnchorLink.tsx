"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLenis } from "lenis/react";
import type { MouseEvent } from "react";

export function AnchorLink({
  href,
  children,
  className,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
}) {
  const lenis = useLenis();
  const pathname = usePathname();
  const hashIndex = href.indexOf("#");
  const hash = hashIndex >= 0 ? href.slice(hashIndex + 1) : null;
  const path = hashIndex >= 0 ? href.slice(0, hashIndex) || "/" : href;
  const sameRoute = hash && path === pathname;

  return (
    <Link
      href={href}
      className={className}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        if (!sameRoute || !lenis) return;

        const target = document.getElementById(hash);
        if (!target) return;

        event.preventDefault();
        lenis.scrollTo(target, { offset: -48, duration: 1.4 });
      }}
    >
      {children}
    </Link>
  );
}
