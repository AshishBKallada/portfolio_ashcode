"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full pt-16 pb-0 px-6 md:px-12 bg-white relative overflow-hidden border-t border-black/10">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-2 gap-x-12 gap-y-8">
          <div className="flex flex-col gap-2">
            <h4 className="text-sm font-semibold text-black uppercase tracking-wider font-safiro">
              GET IN TOUCH
            </h4>
            <a
              href="mailto:ashercode4u@gmail.com"
              className="text-sm text-black hover:opacity-70 transition-opacity font-safiro"
            >
              ashercode4u@gmail.com
            </a>
          </div>

          <div className="flex flex-col gap-2">
            <a
              href="https://www.instagram.com/aaah6__"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-black hover:opacity-70 transition-opacity font-safiro"
            >
              INSTAGRAM
            </a>
            <a
              href="https://www.linkedin.com/in/ashishbkallada"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-black hover:opacity-70 transition-opacity font-safiro"
            >
              LINKEDIN
            </a>
            <a
              href="https://github.com/ashishbkallada"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-black hover:opacity-70 transition-opacity font-safiro"
            >
              GITHUB
            </a>
          </div>

          <div className="flex flex-col gap-2">
            <Link
              href="/privacy-policy"
              className="text-sm text-black hover:opacity-70 transition-opacity font-safiro"
            >
              PRIVACY POLICY
            </Link>
            <Link
              href="/terms-and-conditions"
              className="text-sm text-black hover:opacity-70 transition-opacity font-safiro"
            >
              TERMS & CONDITIONS
            </Link>
          </div>
        </div>

        <div className="mt-8 flex items-center gap-4 text-sm text-black whitespace-nowrap font-safiro">
          <span>© {new Date().getFullYear()} ASHCODE</span>
          <span>MADE BY ASHCODE</span>
        </div>
      </div>
    </footer>
  );
}

