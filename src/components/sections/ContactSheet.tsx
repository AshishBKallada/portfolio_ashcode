"use client";

import { useState, type FormEvent } from "react";
import { site } from "@/data/site";

const field =
  "w-full border-b border-white/70 bg-transparent pb-2 text-[clamp(1rem,1.4vw,1.25rem)] text-white placeholder:text-white/85 focus:border-white focus:outline-none";

// Giant stretched CONTACT wordmark with a red form sheet laid over its lower
// half. There is no backend, so sending opens the visitor's mail app with
// the message prefilled.
export function ContactSheet() {
  const [agreed, setAgreed] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = `${data.get("firstName") ?? ""} ${data.get("lastName") ?? ""}`.trim();
    const subject = `Hello from ${name || "your portfolio"}`;
    const body = `${data.get("message") ?? ""}\n\n— ${name}\n${data.get("email") ?? ""}`;
    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <section
      id="contact"
      style={{ backgroundColor: site.navbar.bg }}
      className="relative overflow-hidden px-3 pt-20 pb-3 sm:px-4 sm:pt-24 sm:pb-4"
    >
      <h2 className="sr-only">Contact</h2>
      <svg
        aria-hidden
        viewBox="0 0 1000 420"
        preserveAspectRatio="none"
        className="block h-auto w-full"
      >
        <text
          x="0"
          y="420"
          textLength="1000"
          lengthAdjust="spacingAndGlyphs"
          fill="#ffffff"
          style={{ fontFamily: "var(--font-display)", fontSize: 575 }}
        >
          CONTACT
        </text>
      </svg>

      <div
        style={{ backgroundColor: site.intro.bg }}
        className="relative z-10 -mt-[18%] ml-auto w-full px-6 pt-6 pb-8 text-white sm:w-[76%] sm:px-[7%] sm:pt-5 sm:pb-10"
      >
        <p className="font-sans text-[11px] font-semibold tracking-[0.04em] uppercase">
          Reach me
        </p>

        <form
          onSubmit={onSubmit}
          className="mt-10 grid grid-cols-1 gap-x-[12%] gap-y-8 font-sans md:mt-16 md:grid-cols-2"
        >
          <div className="flex flex-col gap-8">
            <label>
              <span className="sr-only">First name</span>
              <input name="firstName" required placeholder="First Name" className={field} />
            </label>
            <label>
              <span className="sr-only">Last name</span>
              <input name="lastName" placeholder="Last Name" className={field} />
            </label>
            <label>
              <span className="sr-only">Email</span>
              <input name="email" type="email" required placeholder="Email" className={field} />
            </label>
            <label className="mt-2 flex items-start gap-4 text-xs leading-snug">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 size-3.5 shrink-0 appearance-none border border-white bg-white checked:bg-black"
              />
              <span className="max-w-[16rem]">
                I give {site.name} permission to contact me at this email address.
              </span>
            </label>
          </div>

          <div className="flex flex-col">
            <label className="flex-1">
              <span className="sr-only">Message</span>
              <textarea
                name="message"
                required
                rows={4}
                placeholder="Type your message here"
                className={`${field} h-full min-h-28 resize-none`}
              />
            </label>
            <p className="mt-6 text-[11px] leading-snug text-white/85">
              Prefer email? Write to{" "}
              <a href={`mailto:${site.email}`} className="underline underline-offset-2">
                {site.email}
              </a>
              . I reply within a day.
            </p>
            <div className="mt-3 flex gap-4 text-[11px]">
              {site.socials.map((social) => (
                <a
                  key={social.href}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  className="underline underline-offset-2"
                >
                  {social.label}
                </a>
              ))}
            </div>
            <button
              type="submit"
              disabled={!agreed}
              className="mt-8 flex items-center justify-between gap-6 self-end rounded-full border border-white/80 px-5 py-2.5 text-base font-medium transition-colors hover:bg-white hover:text-black disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-white sm:min-w-[8.5rem]"
            >
              Send <span aria-hidden>→</span>
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
