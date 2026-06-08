"use client";

import type { ReactNode } from "react";
import Link from "next/link";

import type { ColorScheme } from "../lib/color-scheme";

const EMAIL = "ashercode4u@gmail.com";
const GITHUB_USER = "https://github.com/AshishBKallada";
const GITHUB_REPO = "https://github.com/AshishBKallada/portfolio_ashcode";

const FOOTER_BG = "#f9f7f2";
const FOOTER_CARD = "#3a2a22";

const colHead = "font-safiro text-[13px] font-medium text-white md:text-sm";
const colLink =
  "font-safiro text-[12px] leading-relaxed text-white/78 transition-colors hover:text-white md:text-[13px]";
const colText = "font-safiro text-[12px] leading-relaxed text-white/78 md:text-[13px]";

function SocialIcon({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      aria-label={label}
      className="text-[#3a2a22]/70 transition-opacity hover:opacity-100"
    >
      {children}
    </a>
  );
}

export default function Footer({ colorScheme: _colorScheme = "light" }: { colorScheme?: ColorScheme }) {
  const year = new Date().getFullYear();

  return (
    <footer
      className="relative isolate w-full min-w-0 shrink-0 overflow-x-clip transition-colors duration-300"
      style={{ backgroundColor: FOOTER_BG }}
    >
      {/* Main dark card */}
      <div className="mx-auto w-full max-w-[min(100%,88rem)] px-3 pb-0 md:px-5 lg:px-6">
        <div
          className="rounded-t-[2.75rem] px-6 pb-10 pt-10 md:rounded-t-[3.75rem] md:px-10 md:pb-14 md:pt-12 lg:px-14 lg:pt-14"
          style={{ backgroundColor: FOOTER_CARD }}
        >
          <div className="mb-10 flex flex-col gap-6 md:mb-14 md:flex-row md:items-end md:justify-between md:gap-10">
            <span className="inline-flex w-fit items-center rounded-full border border-white/45 px-4 py-2 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-white md:text-[11px]">
              ashcode
            </span>
            <h2 className="max-w-[min(100%,36rem)] font-safiro text-[clamp(1.75rem,5vw,3.25rem)] font-medium leading-[1.08] tracking-[-0.02em] text-white md:max-w-2xl lg:text-[3.25rem]">
              Ashcode makes shipping better.
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
            <section className="flex flex-col gap-3">
              <h3 className={colHead}>Work</h3>
              <ul className="flex flex-col gap-2">
                <li>
                  <Link href="/projects" className={colLink}>
                    Projects
                  </Link>
                </li>
                <li>
                  <a href={GITHUB_USER} target="_blank" rel="noopener noreferrer" className={colLink}>
                    GitHub
                  </a>
                </li>
                <li>
                  <a href={GITHUB_REPO} target="_blank" rel="noopener noreferrer" className={colLink}>
                    Source code
                  </a>
                </li>
              </ul>
            </section>

            <section className="flex flex-col gap-3">
              <h3 className={colHead}>Information</h3>
              <ul className="flex flex-col gap-2">
                <li>
                  <Link href="/privacy-policy" className={colLink}>
                    Privacy policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms-and-conditions" className={colLink}>
                    Terms &amp; conditions
                  </Link>
                </li>
              </ul>
            </section>

            <section className="flex flex-col gap-3">
              <h3 className={colHead}>Availability</h3>
              <p className={colText}>
                Full-stack MERN developer.
                <br />
                Remote · open to work worldwide.
              </p>
            </section>

            <section className="flex flex-col gap-3">
              <h3 className={colHead}>Contact</h3>
              <a href={`mailto:${EMAIL}`} className={`${colLink} text-white/90`}>
                {EMAIL}
              </a>
            </section>
          </div>
        </div>
      </div>

      {/* Bottom bar on beige */}
      <div className="mx-auto flex w-full max-w-[min(100%,88rem)] flex-col items-center justify-between gap-4 px-4 py-6 sm:flex-row md:px-6 lg:px-8">
        <p className="font-safiro text-[11px] text-[#3a2a22]/55 md:text-xs">
          © Ashcode {year}. All rights reserved.
        </p>
        <div className="flex items-center gap-5">
          <SocialIcon href={GITHUB_USER} label="GitHub">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-3.795-.735-.405-1.035-1.005-1.305-1.005-1.305-.825-.555.06-.555.06-.555 1.125.075 1.725 1.155 1.725 1.155 1.005 1.725 2.625 1.23 3.27.945.105-.735.405-1.23.735-1.515-2.55-.285-5.25-1.275-5.25-5.655 0-1.245.45-2.265 1.185-3.06-.12-.285-.525-1.335.12-2.775 0 0 .975-.3 3.195 1.17.93-.255 1.92-.39 2.91-.39.99 0 1.98.135 2.91.39 2.22-1.485 3.195-1.17 3.195-1.17.645 1.44.24 2.49.12 2.775.735.795 1.185 1.815 1.185 3.06 0 4.395-2.7 5.37-5.25 5.655.42.36.81 1.08.81 2.185 0 1.575-.015 2.85-.015 3.24 0 .315.225.69.825.57A8.205 8.205 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
          </SocialIcon>
          <SocialIcon href={`mailto:${EMAIL}`} label="Email">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="m2 7 10 7 10-7" />
            </svg>
          </SocialIcon>
          <SocialIcon href="https://www.linkedin.com" label="LinkedIn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </SocialIcon>
          <SocialIcon href="https://x.com" label="X">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </SocialIcon>
        </div>
      </div>
    </footer>
  );
}
