"use client";

import { useLenis } from "lenis/react";
import { motion, useMotionValue } from "motion/react";
import { useEffect, useLayoutEffect, useRef } from "react";
import { Footer } from "@/components/layout/Footer";
import { Contact } from "@/components/sections/Contact";

function contactY(scroll: number, start: number) {
  const vh = window.innerHeight || 1;
  const local = Math.max(scroll - start, 0);
  return -Math.min(local, vh);
}

export function ContactFooterPin() {
  const pin = useRef<HTMLDivElement>(null);
  const y = useMotionValue(0);

  const sync = (scroll: number) => {
    const node = pin.current;
    if (!node) return;
    const start = scroll + node.getBoundingClientRect().top;
    y.set(contactY(scroll, start));
  };

  const lenis = useLenis((instance) => {
    sync(instance.scroll);
  });

  useLayoutEffect(() => {
    sync(window.scrollY);
  }, [y]);

  useEffect(() => {
    if (lenis) return;

    const onScroll = () => sync(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [lenis]);

  return (
    <div ref={pin} className="relative h-[200svh]">
      <div className="sticky top-0 z-20 h-svh overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Footer />
        </div>
        <motion.div
          style={{ y }}
          className="absolute inset-0 z-10 bg-background will-change-transform"
        >
          <Contact />
        </motion.div>
      </div>
    </div>
  );
}
