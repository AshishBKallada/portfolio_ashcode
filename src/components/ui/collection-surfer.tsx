"use client";

import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  type MotionValue,
} from "motion/react";
import React, { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface CollectionItem {
  id: number;
  image: string;
  title: string;
}

export type CollectionSurferVariant = "magnetic" | "uplift" | "simple";

interface CollectionSurferProps {
  items: CollectionItem[];
  variant?: CollectionSurferVariant;
  /** Extra scroll length while the stage is pinned (svh per item). */
  scrollPerItemVh?: number;
  /** When false, scroll once through all items (no duplicate loop). */
  loop?: boolean;
  headline?: { primary: string; secondary: string };
  scrollHint?: string;
  className?: string;
  footer?: ReactNode;
}

export function CollectionSurfer({
  items,
  variant = "magnetic",
  scrollPerItemVh = 72,
  loop = false,
  headline = { primary: "HERITAGE FW25/26", secondary: "COLLECTION" },
  scrollHint = "scroll to surf",
  className,
  footer,
}: CollectionSurferProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const displayItems = loop ? [...items, ...items] : items;

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  const easedProgress = useSpring(scrollYProgress, {
    mass: 0.12,
    stiffness: 90,
    damping: 22,
  });

  const stepX = 240;
  const stepY = -84;
  const stepZ = -288;
  const travelItems = items.length;

  const x = useTransform(easedProgress, [0, 1], [0, -travelItems * stepX]);
  const y = useTransform(easedProgress, [0, 1], [0, -travelItems * stepY]);
  const z = useTransform(easedProgress, [0, 1], [0, -travelItems * stepZ]);

  const mouseX = useMotionValue(-10000);
  const mouseY = useMotionValue(-10000);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (variant === "simple") return;
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
  };

  const handleMouseLeave = () => {
    if (variant === "simple") return;
    mouseX.set(-10000);
    mouseY.set(-10000);
  };

  const trackHeight = `calc(100svh + ${Math.max(travelItems * scrollPerItemVh, 120)}svh)`;

  return (
    <div
      ref={trackRef}
      className={cn("relative w-full text-foreground", className)}
      style={{ height: trackHeight }}
    >
      <div
        className="sticky top-0 flex h-svh min-h-[560px] w-full items-center justify-center overflow-hidden"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div className="pointer-events-none absolute top-[3vw] left-[3vw] z-50 mix-blend-difference">
          <h2 className="font-heading ml-[4vw] text-[clamp(2rem,6vw,5rem)] leading-[0.9] font-bold tracking-tighter">
            {headline.primary}
          </h2>
          <h2 className="font-heading text-[clamp(2rem,6vw,5rem)] leading-[0.9] font-bold tracking-tighter">
            {headline.secondary}
            <span className="relative top-[0.6em] ml-2 align-top font-mono text-[0.4em] tabular-nums">
              ({items.length})
            </span>
          </h2>
        </div>

        {scrollHint ? (
          <div className="pointer-events-none absolute right-[3vw] bottom-[3vw] z-50 font-mono text-xs tracking-wider uppercase opacity-70">
            {scrollHint}
          </div>
        ) : null}

        {footer ? (
          <div className="absolute right-[3vw] bottom-[3vw] z-50 sm:right-[3vw]">{footer}</div>
        ) : null}

        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            perspective: "2000px",
            perspectiveOrigin: "10% 10%",
          }}
        >
          <motion.div
            className="relative h-0 w-0"
            style={{
              x,
              y,
              z,
              transformStyle: "preserve-3d",
            }}
          >
            {displayItems.map((item, i) => (
              <Card
                key={`${item.id}-${i}`}
                item={item}
                i={i}
                itemCount={items.length}
                stepX={stepX}
                stepY={stepY}
                stepZ={stepZ}
                mouseX={mouseX}
                mouseY={mouseY}
                variant={variant}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function Card({
  item,
  i,
  itemCount,
  stepX,
  stepY,
  stepZ,
  mouseX,
  mouseY,
  variant,
}: {
  item: CollectionItem;
  i: number;
  itemCount: number;
  stepX: number;
  stepY: number;
  stepZ: number;
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
  variant: CollectionSurferVariant;
}) {
  const ref = React.useRef<HTMLDivElement>(null);

  const distance = useTransform([mouseX, mouseY], ([x = 0, y = 0]: number[]) => {
    if (!ref.current || variant === "simple") return 200;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    return Math.hypot(x - centerX, y - centerY);
  });

  const targetScale = useTransform(distance, [0, 400], [1.5, 1]);
  const springScale = useSpring(targetScale, {
    mass: 0.5,
    stiffness: 300,
    damping: 20,
  });

  const targetUplift = useTransform(distance, [0, 400], [-100, 0]);
  const springUplift = useSpring(targetUplift, {
    mass: 0.5,
    stiffness: 300,
    damping: 20,
  });

  const transform = useTransform([springScale, springUplift], ([s, u]: number[]) => {
    let scaleValue = 1;
    let upliftValue = 0;

    if (variant === "magnetic") {
      scaleValue = Number(s);
    } else if (variant === "uplift") {
      upliftValue = Number(u);
    }

    const baseX = i * stepX;
    const baseY = i * stepY;
    const baseZ = i * stepZ;

    return `translate3d(${baseX}px, ${baseY + upliftValue}px, ${baseZ}px) rotateY(-50deg) scale(${scaleValue})`;
  });

  return (
    <motion.div
      ref={ref}
      className="group absolute h-[400px] w-[300px] overflow-hidden bg-neutral-900 shadow-2xl transition-colors duration-500 ease-out"
      style={{
        transform,
        transformStyle: "preserve-3d",
      }}
    >
      <div className="absolute -top-6 -left-4 font-mono text-xs text-white opacity-50 transition-opacity group-hover:opacity-100">
        {String((i % itemCount) + 1).padStart(2, "0")}
      </div>

      <div className="relative h-full w-full brightness-75 transition-all duration-300 group-hover:brightness-100">
        <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
      </div>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent" />
      <p className="pointer-events-none absolute right-3 bottom-3 left-3 font-mono text-[10px] tracking-wide text-white/90 uppercase">
        {item.title}
      </p>
    </motion.div>
  );
}
