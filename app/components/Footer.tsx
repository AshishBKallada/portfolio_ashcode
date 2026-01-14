"use client";

import Image from "next/image";

export default function Footer() {
  return (
    <footer className="w-full pt-16 pb-0 px-6 md:px-12 bg-white relative overflow-hidden border-t border-black/10">
      <div className="max-w-[1400px] mx-auto">
        {/* Left Section - Text Content */}
        <div className="grid grid-cols-2 gap-x-12 gap-y-8">
          {/* Top Left - Get in Touch */}
          <div className="flex flex-col gap-2">
            <h4 className="text-sm font-semibold text-black uppercase tracking-wider">
              GET IN TOUCH
            </h4>
            <a
              href="mailto:ashish@ashcode.dev"
              className="text-sm text-black hover:opacity-70 transition-opacity"
            >
              SAYHELLO@ASHCODE.DEV
            </a>
          </div>

          {/* Middle Column - Projects */}
          <div className="flex flex-col gap-2">
            <a
              href="#projects"
              className="text-sm text-black hover:opacity-70 transition-opacity"
            >
              TOM TOM
            </a>
            <a
              href="#projects"
              className="text-sm text-black hover:opacity-70 transition-opacity"
            >
              JERRY
            </a>
            <a
              href="#projects"
              className="text-sm text-black hover:opacity-70 transition-opacity"
            >
              SHARK
            </a>
            <div className="text-sm text-black">
              CITY DISPLAYS <span className="text-gray-500">SOON</span>
            </div>
          </div>

          {/* Bottom Left - Privacy & Terms */}
          <div className="flex flex-col gap-2">
            <a
              href="#privacy"
              className="text-sm text-black hover:opacity-70 transition-opacity"
            >
              PRIVACY POLICY
            </a>
            <a
              href="#terms"
              className="text-sm text-black hover:opacity-70 transition-opacity"
            >
              TERMS OF SERVICES
            </a>
          </div>

          {/* Bottom Middle - Social */}
          <div className="flex flex-col gap-2">
            <a
              href="https://instagram.com/ashcode"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-black hover:opacity-70 transition-opacity"
            >
              INSTAGRAM
            </a>
            <a
              href="https://linkedin.com/in/ashcode"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-black hover:opacity-70 transition-opacity"
            >
              LINKEDIN
            </a>
          </div>
        </div>

       

        {/* Bottom Row - Copyright and Made By in one line */}
        <div className="mt-8 flex items-center gap-4 text-sm text-black whitespace-nowrap">
          <span>© {new Date().getFullYear()} ASHCODE</span>
          <span>MADE BY ASHCODE</span>
        </div>
      </div>
    </footer>
  );
}

