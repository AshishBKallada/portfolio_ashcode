"use client";

import { ArrowUpRight, Linkedin, Mail } from "lucide-react";

export default function Contact() {
  return (
    <section
      id="contact"
      className="relative z-10 min-h-screen w-full flex flex-col justify-between py-32 px-6 md:px-12 bg-white text-black border-t border-black/10 overflow-hidden"
    >
      <div className="relative z-10 max-w-5xl">
        <h3 className="text-xs font-bold uppercase tracking-[0.25em] mb-6 opacity-50 font-body">
          Connect
        </h3>
        <p className="text-5xl md:text-7xl lg:text-8xl font-headline leading-[0.95] tracking-tighter">
          Got an idea worth <em>shipping?</em>
          <br />
          Let&apos;s talk.
        </p>
        <div className="mt-12 flex flex-col md:flex-row gap-4">
          <a
            href="mailto:work@ashish.example"
            className="group flex items-center gap-3 px-8 py-4 border border-black hover:bg-black hover:text-white transition-colors duration-300 font-headline text-xl"
          >
            <Mail className="w-5 h-5" />
            <div className="flex flex-col items-start leading-tight">
              <span className="text-[10px] uppercase tracking-[0.25em] font-body opacity-60">
                work
              </span>
              <span>work@ashish.example</span>
            </div>
            <ArrowUpRight className="w-4 h-4 group-hover:rotate-45 transition-transform" />
          </a>
          <a
            href="mailto:hi@ashish.example"
            className="group flex items-center gap-3 px-8 py-4 border border-black hover:bg-black hover:text-white transition-colors duration-300 font-headline text-xl"
          >
            <Mail className="w-5 h-5" />
            <div className="flex flex-col items-start leading-tight">
              <span className="text-[10px] uppercase tracking-[0.25em] font-body opacity-60">
                say hi
              </span>
              <span>hi@ashish.example</span>
            </div>
            <ArrowUpRight className="w-4 h-4 group-hover:rotate-45 transition-transform" />
          </a>
        </div>
        <div className="mt-8 flex gap-6">
          <a
            href="https://github.com/AshishBKallada"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs uppercase tracking-[0.25em] opacity-70 hover:opacity-100 transition-opacity"
          >
            GitHub →
          </a>
          <a
            href="https://www.linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs uppercase tracking-[0.25em] opacity-70 hover:opacity-100 transition-opacity flex items-center gap-1"
          >
            <Linkedin className="w-3 h-3" /> LinkedIn
          </a>
          <a
            href="https://x.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs uppercase tracking-[0.25em] opacity-70 hover:opacity-100 transition-opacity"
          >
            X / Twitter →
          </a>
        </div>
      </div>

      <div className="relative z-10 flex items-end justify-between mt-20">
        <div className="font-body text-sm opacity-60">
          <p>Based in</p>
          <p className="font-headline italic text-xl text-black">Kerala, India</p>
        </div>
        <p className="font-headline text-[14vw] leading-none italic opacity-90">ashcode</p>
      </div>

      <p className="relative z-10 font-body text-[10px] uppercase tracking-[0.25em] opacity-40 mt-8">
        © 2026 ASHCODE — Ashish B Kallada
      </p>
    </section>
  );
}


