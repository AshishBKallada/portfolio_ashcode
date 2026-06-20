"use client";

import { useRef } from "react";
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";

type Segment = { text: string; className?: string };

function WordsPullUpMultiStyle({
  segments,
  containerClassName = "",
}: {
  segments: Segment[];
  containerClassName?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  const flat: { word: string; className: string }[] = [];
  segments.forEach((seg) => {
    seg.text.split(" ").forEach((w) => {
      flat.push({ word: w, className: seg.className ?? "" });
    });
  });

  return (
    <span
      ref={ref}
      className={`inline-flex flex-wrap justify-center ${containerClassName}`}
    >
      {flat.map((item, i) => (
        <span key={i} className="overflow-hidden inline-flex">
          <motion.span
            initial={{ y: 20, opacity: 0 }}
            animate={inView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
            transition={{
              duration: 0.8,
              delay: i * 0.08,
              ease: [0.16, 1, 0.3, 1],
            }}
            className={`inline-block ${item.className}`}
          >
            {item.word}
            {i < flat.length - 1 && <span>&nbsp;</span>}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

function AnimatedLetter({
  char,
  index,
  total,
  progress,
}: {
  char: string;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const charProgress = index / total;
  const opacity = useTransform(
    progress,
    [charProgress - 0.1, charProgress + 0.05],
    [0.2, 1]
  );
  return (
    <motion.span style={{ opacity }} className="inline">
      {char}
    </motion.span>
  );
}

export default function Statement() {
  const bodyRef = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: bodyRef,
    offset: ["start 0.8", "end 0.2"],
  });

  const text =
    "Over the last few years, I have shipped production apps with small teams and solo founders — building React frontends, Node and Express APIs, and the databases behind them. The work has spanned consumer products, internal dashboards, and real-time tools used every day.";
  const chars = Array.from(text);

  return (
    <section
      id="statement"
      className="relative z-10 bg-black text-[#E1E0CC] px-4 md:px-6 py-16 md:py-24"
      aria-label="Statement"
    >
      <div className="relative bg-[#101010] rounded-2xl md:rounded-[2rem] mx-auto max-w-6xl px-6 md:px-12 py-16 md:py-24 text-center overflow-hidden">
        <p className="relative z-[1] font-body text-[10px] sm:text-xs uppercase tracking-[0.3em] mb-6 text-[#E1E0CC]/70">
          Full-stack engineering
        </p>

        <h2 className="relative z-[1] font-headline tracking-[-0.02em] text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl max-w-3xl mx-auto leading-[0.95] sm:leading-[0.9] text-[#E1E0CC]">
          <WordsPullUpMultiStyle
            segments={[
              { text: "I am Ashish Kallada,", className: "" },
              { text: "a self-taught engineer.", className: "italic" },
              {
                text: "I build with React, Node, and TypeScript — from the database up.",
                className: "",
              },
            ]}
          />
        </h2>

        <p
          ref={bodyRef}
          className="relative z-[1] font-body text-sm md:text-base leading-relaxed mt-10 md:mt-12 max-w-2xl mx-auto text-[#DEDBC8]"
        >
          {chars.map((c, i) => (
            <AnimatedLetter
              key={i}
              char={c}
              index={i}
              total={chars.length}
              progress={scrollYProgress}
            />
          ))}
        </p>
      </div>
    </section>
  );
}
