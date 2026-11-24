"use client";

import { useRef, useState } from "react";
import { sheet } from "@/data/sheet";
import { layDown, useMotion } from "./motion";
import { Spine } from "./Spine";

// The back page: the address set as large as the name on the cover, and one way to begin.
export function ContactSheet() {
  const root = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);

  useMotion(root, (el) => {
    layDown(el.querySelector<HTMLElement>(".sh-sheet")!, -1);
  });

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(sheet.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${sheet.email}`;
    }
  };

  const [user, domain] = sheet.email.split("@");

  return (
    <section ref={root} id="contact" className="sh-section" aria-labelledby="contact-title">
      <article className="sh-sheet sh-page">
        <header className="sh-band">
          <h2 id="contact-title" className="sh-band__title">
            <span className="sh-mask">
              <span>Contact</span>
            </span>
            <span className="sh-mask">
              <span>2026</span>
            </span>
          </h2>
        </header>

        <div className="sh-contact">
          <a className="sh-contact__email" href={sheet.action.href} data-part>
            <span>{user}</span>
            <span>@{domain}</span>
          </a>

          <div className="sh-contact__side">
            <p data-part>Products, interfaces and motion work. Remote, across time zones. Tell me about the idea.</p>
            <div className="sh-contact__actions" data-part>
              <a className="sh-button" href={sheet.action.href}>
                {sheet.action.label} <span aria-hidden="true">→</span>
              </a>
              <button type="button" className="sh-button sh-button--ghost" onClick={copy} aria-live="polite">
                {copied ? "Copied" : "Copy email"}
              </button>
            </div>
            <dl className="sh-cover__contact sh-contact__list">
              {sheet.contact
                .filter((row) => !("gap" in row))
                .map((row) =>
                  "gap" in row ? null : (
                    <div key={row.label} data-part>
                      <dt>{row.label}</dt>
                      <dd>{row.value}</dd>
                    </div>
                  ),
                )}
            </dl>
          </div>
          <span className="sh-dot sh-dot--corner" aria-hidden="true" />
        </div>
        <Spine text={sheet.spine} tone="light" marks />
      </article>
    </section>
  );
}
