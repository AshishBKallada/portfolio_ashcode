"use client";

import Link from "next/link";
import Image from "next/image";
import { type FormEvent, useState } from "react";

import type { ColorScheme } from "../lib/color-scheme";

const EMAIL = "ashercode4u@gmail.com";
const GITHUB_USER = "https://github.com/AshishBKallada";
const GITHUB_REPO = "https://github.com/AshishBKallada/portfolio_ashcode";

/** Full-viewport ASH / CODE outro, then Evolve-style four-column block. */
export default function Footer({ colorScheme = "dark" }: { colorScheme?: ColorScheme }) {
  const year = new Date().getFullYear();
  const [newsletterStatus, setNewsletterStatus] = useState<"idle" | "done">("idle");
  const light = colorScheme === "light";

  const onNewsletter = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setNewsletterStatus("done");
  };

  const colTitle = light
    ? "font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-black"
    : "font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-white";
  const body = light
    ? "font-safiro text-[11px] font-normal leading-[1.65] text-black/75 md:text-[12px]"
    : "font-safiro text-[11px] font-normal leading-[1.65] text-white/75 md:text-[12px]";
  const link = light
    ? "font-safiro text-[11px] text-black/85 underline decoration-black/25 underline-offset-[5px] transition-opacity hover:opacity-70 md:text-[12px]"
    : "font-safiro text-[11px] text-white/85 underline decoration-white/30 underline-offset-[5px] transition-opacity hover:opacity-70 md:text-[12px]";

  const borderT = light ? "border-black/10" : "border-white/10";
  const bigType = light ? "text-black" : "text-white";
  const thanks = light ? "text-black/50" : "text-white/50";

  return (
    <footer
      className={`relative isolate flex h-[100dvh] max-h-[100dvh] w-full shrink-0 flex-col overflow-hidden transition-colors duration-300 ${light ? "text-black" : "text-white"}`}
    >
      <Image
        src="/hero-bgx.jpg"
        alt=""
        fill
        className="pointer-events-none absolute inset-0 z-0 object-cover"
        sizes="100vw"
        priority
      />
      <div className="pointer-events-none absolute inset-0 z-[1] bg-black/35" />
      <div
        className="pointer-events-none absolute inset-0 z-[2]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, transparent 0, transparent calc(8.333333% - 1px), rgba(255,255,255,0.06) calc(8.333333% - 1px), rgba(255,255,255,0.06) 8.333333%)",
        }}
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[3] h-28 bg-gradient-to-b from-black/65 to-transparent md:h-36" />

      <div className="relative z-10 flex h-[68dvh] w-full flex-col items-center justify-center px-4 py-8 md:py-10">
        <div className="flex flex-col items-center justify-center">
          <span
            className={`block text-center font-chaney text-[16vw] font-black uppercase leading-none md:text-[11vw] ${bigType}`}
          >
            ASH
          </span>
          <span
            className={`-mt-4 block text-center font-chaney text-[16vw] font-black uppercase leading-none md:-mt-6 md:text-[11vw] ${bigType}`}
          >
            CODE
          </span>
        </div>
      </div>

      <div className={`relative z-10 h-[32dvh] overflow-hidden border-t ${borderT}`}>
        <div className="mx-auto w-full max-w-[min(100%,88rem)] px-4 pb-4 pt-3 md:px-6 md:pb-5 md:pt-4 lg:px-8">
          <div
            className={`grid grid-cols-1 gap-0 divide-y md:grid-cols-4 md:divide-x md:divide-y-0 ${light ? "divide-black/10" : "divide-white/10"}`}
          >
            <section className="flex flex-col gap-2.5 py-4 md:py-3 md:pr-6 lg:py-4 lg:pr-8">
              <h2 className={colTitle}>(a.) CONTACT</h2>
              <div className={`${body} flex flex-col gap-2`}>
                <a
                  href={`mailto:${EMAIL}`}
                  className={light ? "text-black/90 hover:opacity-70" : "text-white/90 hover:opacity-70"}
                >
                  {EMAIL}
                </a>
                <p>
                  Full-stack MERN developer.
                  <br />
                  Open to remote work.
                </p>
                <Link href="/privacy-policy" className={link}>
                  Privacy
                </Link>
              </div>
            </section>

            <section className="flex flex-col gap-2.5 py-4 md:py-3 md:px-6 lg:px-8 lg:py-4">
              <h2 className={colTitle}>(b.) LEGAL</h2>
              <div className={`${body} flex flex-col gap-2`}>
                <p>© {year} Ashcode. All rights reserved.</p>
                <div className="flex flex-col gap-2">
                  <Link href="/privacy-policy" className={link}>
                    Privacy Policy
                  </Link>
                  <Link href="/terms-and-conditions" className={link}>
                    Other policies
                  </Link>
                </div>
              </div>
            </section>

            <section className="flex flex-col gap-2.5 py-4 md:py-3 md:px-6 lg:px-8 lg:py-4">
              <h2 className={colTitle}>(c.) NEWSLETTER</h2>
              <div className="flex flex-col gap-2">
                <p className={body}>Short updates on projects and shipping.</p>
                <form onSubmit={onNewsletter} className="flex flex-col gap-2">
                  <label htmlFor="footer-email" className="sr-only">
                    Email for newsletter
                  </label>
                  <input
                    id="footer-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="enter your email"
                    className={
                      light
                        ? "w-full border border-black/20 bg-black/[0.04] px-3 py-2.5 font-safiro text-[12px] text-black placeholder:text-black/35 outline-none transition-[border-color,background-color] focus:border-black/40 focus:bg-black/[0.06]"
                        : "w-full border border-white/20 bg-black/35 px-3 py-2.5 font-safiro text-[12px] text-white placeholder:text-white/35 outline-none transition-[border-color,background-color] focus:border-white/40 focus:bg-black/50"
                    }
                  />
                  <button
                    type="submit"
                    className={
                      light
                        ? "w-fit font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-black underline decoration-black/35 underline-offset-[6px] transition-opacity hover:opacity-70"
                        : "w-fit font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-white underline decoration-white/35 underline-offset-[6px] transition-opacity hover:opacity-70"
                    }
                  >
                    JOIN NOW
                  </button>
                </form>
                {newsletterStatus === "done" ? (
                  <p className={`font-safiro text-[11px] ${thanks}`}>Thanks—you&apos;re on the list.</p>
                ) : null}
              </div>
            </section>

            <section className="flex flex-col gap-2.5 py-4 md:py-3 md:pl-6 lg:py-4 lg:pl-8">
              <h2 className={colTitle}>(d.) PRESS</h2>
              <div className={`${body} flex flex-col gap-2`}>
                <p>Code, builds, and contact links.</p>
                <ul className="flex flex-col gap-2">
                  <li>
                    <a href={GITHUB_USER} target="_blank" rel="noopener noreferrer" className={link}>
                      GitHub
                    </a>
                  </li>
                  <li>
                    <a href={GITHUB_REPO} target="_blank" rel="noopener noreferrer" className={link}>
                      Portfolio Source
                    </a>
                  </li>
                  <li>
                    <a href={`mailto:${EMAIL}`} className={link}>
                      Contact
                    </a>
                  </li>
                </ul>
              </div>
            </section>
          </div>
        </div>
      </div>
    </footer>
  );
}
