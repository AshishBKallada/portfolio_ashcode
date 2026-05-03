"use client";

import Link from "next/link";
import { type FormEvent, useState } from "react";

import type { ColorScheme } from "../lib/color-scheme";
import { FOOTER_FROM_DOWNLOADS_PUBLIC_PATH } from "../generated/footer-downloads-path";

const EMAIL = "ashercode4u@gmail.com";
const GITHUB_USER = "https://github.com/AshishBKallada";
const GITHUB_REPO = "https://github.com/AshishBKallada/portfolio_ashcode";

/** Pinned photo from public/, then four-column block scrolling over it. */
export default function Footer({ colorScheme: _colorScheme = "light" }: { colorScheme?: ColorScheme }) {
  const year = new Date().getFullYear();
  const [newsletterStatus, setNewsletterStatus] = useState<"idle" | "done">("idle");

  const onNewsletter = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setNewsletterStatus("done");
  };

  const colTitle =
    "font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-black";
  const body = "font-safiro text-[11px] font-normal leading-[1.65] text-black/75 md:text-[12px]";
  const link =
    "font-safiro text-[11px] text-black/85 underline decoration-black/25 underline-offset-[5px] transition-opacity hover:opacity-70 md:text-[12px]";

  const borderT = "border-black/10";
  const thanks = "text-black/50";

  return (
    <footer className="relative isolate flex w-full min-w-0 shrink-0 flex-col overflow-x-clip bg-white text-black transition-colors duration-300">
      {/*
        Wide / panoramic images: fill + object-contain in a tall box only ever hits the
        width limit, so the bitmap looks like a thin strip. Use intrinsic layout (w-full
        h-auto) so the full frame shows, then flex-fill to min-h-[100dvh] for scroll-over.
      */}
      <div className="sticky top-0 z-0 flex min-h-[100dvh] w-full shrink-0 -mb-[100dvh] flex-col box-border bg-neutral-100 p-2 md:p-2.5">
        <div className="w-full shrink-0 px-1 pt-1 md:px-1.5 md:pt-1.5">
          {/* Native img: true intrinsic aspect (wide banners) without next/image width/height hints. */}
          <img
            key={FOOTER_FROM_DOWNLOADS_PUBLIC_PATH}
            src={FOOTER_FROM_DOWNLOADS_PUBLIC_PATH}
            alt=""
            className="grayscale block h-auto w-full max-w-full rounded-md"
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="min-h-0 flex-1 rounded-b-md bg-neutral-100" aria-hidden />
      </div>

      <div className="relative z-10 -mt-[100dvh] flex w-full flex-col">
        <div className="min-h-[100dvh] shrink-0" aria-hidden />
        <div className="min-h-[38dvh] shrink-0 md:min-h-[44dvh]" aria-hidden />

        <div className={`relative h-auto overflow-visible border-t ${borderT} bg-white md:min-h-[38dvh]`}>
          <div className="mx-auto w-full max-w-[min(100%,88rem)] px-4 pb-5 pt-4 md:px-6 md:pb-6 md:pt-5 lg:px-8">
            <div className="footer-grid grid grid-cols-1 gap-0 divide-y divide-black/10 md:grid-cols-4 md:divide-x md:divide-y-0">
              <section className="flex flex-col gap-2.5 py-4 md:py-3 md:pr-6 lg:py-4 lg:pr-8">
                <h2 className={colTitle}>(a.) CONTACT</h2>
                <div className={`${body} flex flex-col gap-2`}>
                  <a href={`mailto:${EMAIL}`} className="text-black/90 hover:opacity-70">
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
                      className="w-full border border-black/15 bg-black/[0.03] px-3 py-2.5 font-safiro text-[12px] text-black placeholder:text-black/40 outline-none transition-[border-color,background-color] focus:border-black/30 focus:bg-black/[0.05]"
                    />
                    <button
                      type="submit"
                      className="w-fit font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-black underline decoration-black/30 underline-offset-[6px] transition-opacity hover:opacity-70"
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
      </div>
    </footer>
  );
}
