"use client";

import { motion } from "motion/react";
import { AnchorLink } from "@/components/motion/AnchorLink";
import { site } from "@/data/site";
import { intro, introEase, introFooterDelay } from "@/components/motion/intro";

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-3.5 fill-background">
      <path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.52 2.87 8.35 6.84 9.71.5.1.68-.22.68-.49 0-.24-.01-.88-.01-1.73-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.9 1.57 2.36 1.12 2.94.86.09-.67.35-1.12.63-1.38-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.27 2.75 1.05A9.3 9.3 0 0 1 12 7.5c.85 0 1.71.12 2.51.34 1.9-1.32 2.74-1.05 2.74-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.8-4.58 5.06.36.32.68.95.68 1.92 0 1.38-.01 2.49-.01 2.83 0 .27.18.6.69.49A10.03 10.03 0 0 0 22 12.26C22 6.58 17.52 2 12 2Z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-3.5 fill-background">
      <path d="M6.5 8.5A2 2 0 1 1 6.48 4.5 2 2 0 0 1 6.5 8.5ZM4.75 20h3.5V9.75h-3.5V20ZM13.2 9.75c-1.86 0-2.7 1.02-2.7 1.02V9.75H7.1V20h3.4v-5.7c0-1.5.7-2.4 1.95-2.4 1.16 0 1.8.82 1.8 2.4V20H17.7v-6.3c0-3.18-1.7-4.95-4.5-4.95Z" />
    </svg>
  );
}

export function Footer() {
  const github = site.socials.find((social) => social.label === "GitHub");
  const linkedin = site.socials.find((social) => social.label === "LinkedIn");

  return (
    <motion.footer
      className="mt-auto bg-background font-sans text-foreground"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        delay: introFooterDelay,
        duration: intro.footerDuration,
        ease: introEase,
      }}
    >
      <div className="px-6 py-14 sm:px-10 sm:py-16 lg:px-14 lg:py-20">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between lg:gap-20">
          <div className="max-w-sm">
            <p className="font-sans text-2xl font-medium tracking-[-0.04em] sm:text-[1.75rem]">
              {site.name}
            </p>
            <p className="mt-4 max-w-xs font-sans text-[13px] leading-6 tracking-[-0.02em] text-muted">
              {site.footer.noteBefore}{" "}
              <a
                href={`mailto:${site.email}`}
                className="underline decoration-subtle underline-offset-2 transition-colors hover:decoration-foreground"
              >
                {site.email}
              </a>
              .
            </p>
          </div>

          <nav aria-label="Footer" className="flex gap-16 sm:gap-24">
            {site.footer.columns.map((column, index) => (
              <ul key={index} className="flex flex-col gap-3">
                {column.map((item) => (
                  <li key={item.label}>
                    {"external" in item && item.external ? (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-sans text-[13px] tracking-[-0.02em] text-foreground transition-opacity hover:opacity-50"
                      >
                        {item.label}
                      </a>
                    ) : (
                      <AnchorLink
                        href={item.href}
                        className="font-sans text-[13px] tracking-[-0.02em] text-foreground transition-opacity hover:opacity-50"
                      >
                        {item.label}
                      </AnchorLink>
                    )}
                  </li>
                ))}
              </ul>
            ))}
          </nav>
        </div>

        <div className="mt-16 flex items-center justify-between gap-4 sm:mt-20">
          <p className="inline-flex items-center rounded-md bg-foreground px-3 py-2 font-sans text-[11px] font-medium tracking-[-0.02em] text-background sm:text-xs">
            {site.footer.badge}
          </p>

          <div className="flex items-center gap-2">
            {linkedin ? (
              <a
                href={linkedin.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="inline-flex size-8 items-center justify-center rounded-full bg-foreground transition-opacity hover:opacity-70"
              >
                <LinkedInIcon />
              </a>
            ) : null}
            {github ? (
              <a
                href={github.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="inline-flex size-8 items-center justify-center rounded-full bg-foreground transition-opacity hover:opacity-70"
              >
                <GitHubIcon />
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </motion.footer>
  );
}
