"use client";

import Link from "next/link";
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
      className={`relative flex w-full shrink-0 flex-col transition-colors duration-300 ${light ? "bg-white text-black" : "bg-[#0a0a0a] text-white"}`}
    >
      <div className="flex min-h-[100dvh] w-full flex-col items-center justify-center px-4 py-16">
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

      <div className={`border-t ${borderT}`}>
        <div className="mx-auto w-full max-w-[min(100%,88rem)] px-4 pb-14 pt-12 md:px-6 md:pb-16 md:pt-16 lg:px-8">
          <div
            className={`grid grid-cols-1 gap-0 divide-y md:grid-cols-4 md:divide-x md:divide-y-0 ${light ? "divide-black/10" : "divide-white/10"}`}
          >
            <section className="flex flex-col gap-5 py-10 md:py-8 md:pr-6 lg:py-10 lg:pr-8">
              <h2 className={colTitle}>(a.) CONTACT</h2>
              <div className={`${body} flex flex-col gap-4`}>
                <a
                  href={`mailto:${EMAIL}`}
                  className={light ? "text-black/90 hover:opacity-70" : "text-white/90 hover:opacity-70"}
                >
                  {EMAIL}
                </a>
                <p>
                  Ashcode — full-stack &amp; MERN
                  <br />
                  Open to remote · build in public
                </p>
                <Link href="/privacy-policy" className={link}>
                  Privacy &amp; data removal
                </Link>
              </div>
            </section>

            <section className="flex flex-col gap-5 py-10 md:py-8 md:px-6 lg:px-8 lg:py-10">
              <h2 className={colTitle}>(b.) LEGAL</h2>
              <div className={`${body} flex flex-col gap-5`}>
                <p>
                  Ashcode is a personal studio portfolio. Content and projects are shared for
                  context only; nothing here constitutes professional or legal advice. © {year}{" "}
                  Ashcode. All rights reserved.
                </p>
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

            <section className="flex flex-col gap-5 py-10 md:py-8 md:px-6 lg:px-8 lg:py-10">
              <h2 className={colTitle}>(c.) NEWSLETTER</h2>
              <div className="flex flex-col gap-5">
                <p className={body}>
                  Occasional notes on shipping with the MERN stack, Next.js, and the kind of UI
                  polish this portfolio is chasing—only when there&apos;s something worth sending.
                </p>
                <form onSubmit={onNewsletter} className="flex flex-col gap-4">
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

            <section className="flex flex-col gap-5 py-10 md:py-8 md:pl-6 lg:py-10 lg:pl-8">
              <h2 className={colTitle}>(d.) PRESS</h2>
              <div className={`${body} flex flex-col gap-5`}>
                <p>
                  Code and experiments live on GitHub; this repo is the site you&apos;re on. Reach
                  out for collaborations, contract work, or press on MERN / full-stack topics.
                </p>
                <ul className="flex flex-col gap-2">
                  <li>
                    <a href={GITHUB_USER} target="_blank" rel="noopener noreferrer" className={link}>
                      GitHub — @AshishBKallada
                    </a>
                  </li>
                  <li>
                    <a href={GITHUB_REPO} target="_blank" rel="noopener noreferrer" className={link}>
                      This portfolio (source)
                    </a>
                  </li>
                  <li>
                    <a href={`mailto:${EMAIL}`} className={link}>
                      Collaborations &amp; inquiries
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
