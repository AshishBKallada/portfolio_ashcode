"use client";

import { motion, useTransform, type MotionValue } from "motion/react";
import { useEffect, useState, type CSSProperties, type ReactNode } from "react";

const CREAM = "#ece6d8";
const CREAM_SHADE = "#d8d0bd";
const SIDE = "#55534f";
const SIDE_DARK = "#3c3a37";
/** Pointer travel, in px, between one picture on the screen and the next. */
const PICTURE_STEP = 90;

/** One face of a box: a w × h panel, turned and pushed out to its side. */
function Face({ w, h, transform, style, className = "", children }: {
  w: number;
  h: number;
  transform: string;
  style?: CSSProperties;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div
      className={`absolute top-1/2 left-1/2 [backface-visibility:hidden] ${className}`}
      style={{ width: `${w}em`, height: `${h}em`, marginLeft: `${-w / 2}em`, marginTop: `${-h / 2}em`, transform, ...style }}
    >
      {children}
    </div>
  );
}

/** A box w wide, h tall, d deep, centred on its own origin, in em. */
function Box({ w, h, d, front, side, top, frontStyle, sideStyle, topStyle, radius = "0.6em" }: {
  w: number;
  h: number;
  d: number;
  front?: ReactNode;
  side?: ReactNode;
  top?: ReactNode;
  frontStyle?: CSSProperties;
  sideStyle?: CSSProperties;
  topStyle?: CSSProperties;
  radius?: string;
}) {
  return (
    <>
      <Face w={w} h={h} transform={`translateZ(${d / 2}em)`} style={{ borderRadius: radius, ...frontStyle }}>
        {front}
      </Face>
      <Face w={w} h={h} transform={`rotateY(180deg) translateZ(${d / 2}em)`} style={{ borderRadius: radius, background: SIDE_DARK }} />
      <Face w={d} h={h} transform={`rotateY(-90deg) translateZ(${w / 2}em)`} style={{ borderRadius: radius, ...sideStyle }}>
        {side}
      </Face>
      <Face w={d} h={h} transform={`rotateY(90deg) translateZ(${w / 2}em)`} style={{ borderRadius: radius, ...sideStyle }} />
      <Face w={w} h={d} transform={`rotateX(90deg) translateZ(${h / 2}em)`} style={{ borderRadius: radius, ...topStyle }}>
        {top}
      </Face>
    </>
  );
}

/**
 * A cream CRT on its base, built in CSS 3D and seen three-quarters from the left: the screen
 * plays the pictures, the next one each time the pointer has moved a little way (and on its own
 * every few seconds), stickers on the dark side, two knobs on the base. It turns a few degrees
 * after the pointer.
 */
export function RetroComputer({
  mx,
  my,
  images,
  still = false,
}: {
  mx: MotionValue<number>;
  my: MotionValue<number>;
  images: string[];
  still?: boolean;
}) {
  const rotY = useTransform(mx, (v) => 32 + v * 8);
  const rotX = useTransform(my, (v) => -8 - v * 5);

  // Which picture is on the screen: the next one after every PICTURE_STEP px of pointer travel.
  const [shown, setShown] = useState(0);
  useEffect(() => {
    if (still || images.length < 2) return;
    const next = () => setShown((i) => (i + 1) % images.length);
    let travelled = 0;
    let last: { x: number; y: number } | null = null;
    const onMove = (e: PointerEvent) => {
      if (last) travelled += Math.hypot(e.clientX - last.x, e.clientY - last.y);
      last = { x: e.clientX, y: e.clientY };
      if (travelled > PICTURE_STEP) {
        travelled = 0;
        next();
      }
    };
    const idle = window.setInterval(next, 3200);
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.clearInterval(idle);
      window.removeEventListener("pointermove", onMove);
    };
  }, [still, images.length]);

  return (
    <div aria-hidden className="pointer-events-none text-[clamp(6px,0.55vw,9px)] [perspective:1400px]">
      <motion.div
        style={still ? { rotateY: 32, rotateX: -8 } : { rotateY: rotY, rotateX: rotX }}
        className="relative h-[24em] w-[24em] [transform-style:preserve-3d]"
      >
        {/* The monitor. */}
        <div className="absolute top-[8.5em] left-1/2 [transform-style:preserve-3d]">
          <Box
            w={18}
            h={15}
            d={15}
            radius="1.6em"
            frontStyle={{ background: `linear-gradient(160deg, ${CREAM} 55%, ${CREAM_SHADE})` }}
            sideStyle={{ background: `linear-gradient(180deg, ${SIDE} 0%, ${SIDE_DARK} 100%)` }}
            topStyle={{ background: CREAM_SHADE }}
            front={
              <div className="absolute inset-[1.3em] overflow-hidden rounded-[1.1em] bg-[#0d0c0b] shadow-[inset_0_0_1.6em_rgba(0,0,0,0.9),inset_0_0_0_0.35em_#c9c1ae]">
                {/* The pictures, stacked; the one shown is the only one not hidden. */}
                {images.map((src, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={src}
                    src={src}
                    alt=""
                    draggable={false}
                    className={`absolute inset-0 h-full w-full object-cover select-none ${i === shown ? "opacity-100" : "opacity-0"}`}
                  />
                ))}
                {/* Scanlines and the glass's sheen. */}
                <div className="absolute inset-0 bg-[repeating-linear-gradient(to_bottom,rgba(255,255,255,0.05)_0_1px,transparent_1px_3px)]" />
                <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_30%_15%,rgba(255,255,255,0.14),transparent_55%)]" />
              </div>
            }
            side={
              <div className="absolute inset-0 overflow-hidden rounded-[1.6em]">
                {/* Vents. */}
                <div className="absolute top-[5.2em] left-[1.6em] flex flex-col gap-[0.45em]">
                  {Array.from({ length: 6 }, (_, i) => (
                    <span key={i} className="block h-[0.18em] w-[3.4em] rounded-full bg-black/45" />
                  ))}
                </div>
                {/* Stickers. */}
                <span className="absolute top-[1.4em] left-[1.2em] -rotate-[8deg] rounded-[0.3em] bg-[#c6f24e] px-[0.5em] py-[0.15em] font-display text-[1.7em] leading-none text-black uppercase">
                  ASH
                </span>
                <span className="absolute top-[6.6em] right-[1.6em] flex h-[5.6em] w-[5.6em] rotate-[12deg] items-center justify-center rounded-full bg-brand text-[1em] text-white shadow-[0_0_0_0.3em_#f4c542] [font-family:'Hiragino_Mincho_ProN','Yu_Mincho',serif]">
                  <span className="text-[2.6em] leading-none">灰</span>
                </span>
              </div>
            }
          />
        </div>

        {/* The base. */}
        <div className="absolute top-[18.6em] left-1/2 [transform-style:preserve-3d]">
          <Box
            w={20}
            h={3.8}
            d={17}
            radius="0.5em"
            frontStyle={{ background: CREAM }}
            sideStyle={{ background: `linear-gradient(180deg, ${CREAM_SHADE}, #bfb6a1)` }}
            topStyle={{ background: CREAM_SHADE }}
            front={
              <div className="absolute inset-0">
                <span className="absolute inset-y-0 left-[4.6em] w-px bg-black/25" />
                <span className="absolute inset-y-0 left-[9.4em] w-px bg-black/25" />
                <span className="absolute inset-x-0 bottom-[0.7em] h-px bg-black/25" />
                <span className="absolute top-[0.8em] left-[5.3em] font-headline text-[0.5em] leading-[1.1] font-semibold text-black">
                  AshCode®
                  <br />
                  Studio
                </span>
                <span className="absolute top-[0.9em] right-[3.6em] h-[1.4em] w-[1.4em] rounded-full bg-[radial-gradient(circle_at_35%_35%,#fff,#cfc6b2)] shadow-[0_0.15em_0.2em_rgba(0,0,0,0.3)]" />
                <span className="absolute top-[0.9em] right-[1.6em] h-[1.4em] w-[1.4em] rounded-full bg-[radial-gradient(circle_at_35%_35%,#fff,#cfc6b2)] shadow-[0_0.15em_0.2em_rgba(0,0,0,0.3)]" />
              </div>
            }
          />
        </div>
      </motion.div>
    </div>
  );
}
