"use client";

import Image from "next/image";

export default function ContactSection() {
  return (
    <section
      id="contact"
      className="flex min-h-[min(100dvh,56rem)] w-full shrink-0 flex-col overflow-hidden bg-white text-black"
    >
      <div className="mx-auto flex h-full min-h-0 w-full max-w-6xl flex-1 flex-col overflow-hidden px-6 pb-6 pt-8 md:px-12 md:pb-8 md:pt-10 lg:px-16">
        <header className="shrink-0">
          <p className="ml-auto max-w-[min(100%,20rem)] text-right font-safiro text-[0.7rem] font-normal leading-snug text-black sm:max-w-md md:max-w-lg md:text-xs">
            I&apos;m Ash / ashcode—full-stack MERN, detail-obsessed, allergic to vague handoffs. I build APIs,
            interfaces, and the glue between them; I don&apos;t stay in one lane when the problem needs more.
          </p>
        </header>

        <div className="flex min-h-0 flex-1 flex-col justify-end gap-5 pt-4 md:gap-6 md:pt-6">
          <div className="grid shrink-0 grid-cols-1 gap-6 md:grid-cols-2 md:items-end md:gap-8 lg:gap-10">
            <div className="flex w-full justify-center sm:justify-start md:max-w-none">
              <div className="flex w-full max-w-md items-center justify-center sm:max-w-lg md:max-w-xl lg:max-w-2xl">
                <Image
                  src="/contact-section.png"
                  alt="Ash / ashcode"
                  width={1200}
                  height={1200}
                  className="h-auto max-h-[min(58vh,560px)] w-full object-contain md:max-h-[min(68vh,720px)]"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 42rem"
                  priority
                />
              </div>
            </div>

            <div className="flex flex-col gap-3 md:items-end md:gap-4">
              <a
                href="mailto:ashercode4u@gmail.com"
                className="inline-flex w-fit items-center gap-2 bg-black px-5 py-2.5 font-safiro text-[11px] font-bold uppercase tracking-[0.12em] text-white transition-opacity hover:opacity-85"
              >
                Say hello
                <span className="text-sm leading-none" aria-hidden>
                  ↗
                </span>
              </a>
              <div className="flex h-11 w-full max-w-xs items-center justify-center bg-[#e6362d] md:ml-auto md:h-12">
                <span className="px-2 text-center font-safiro text-xs font-semibold text-white md:text-sm">
                  Available for freelance and collaborations
                </span>
              </div>
            </div>
          </div>

          <div className="flex shrink-0 flex-col gap-2 border-t border-black/10 pt-5 font-safiro text-xs font-semibold text-black md:flex-row md:flex-wrap md:items-center md:gap-x-8 md:gap-y-1 md:pt-6 md:text-sm">
            <a
              href="mailto:ashercode4u@gmail.com"
              className="w-fit transition-opacity hover:opacity-60"
            >
              ashercode4u@gmail.com
            </a>
            <a
              href="mailto:connect@ashcode.com"
              className="w-fit transition-opacity hover:opacity-60"
            >
              connect@ashcode.com
            </a>
            <a
              href="mailto:hello@ashcode.com"
              className="w-fit transition-opacity hover:opacity-60"
            >
              hello@ashcode.com
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
