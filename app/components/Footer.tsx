"use client";

import Image from "next/image";

export default function Footer() {
  return (
    <footer className="w-full pt-16 pb-0 h-screen px-6 md:px-12 bg-white relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto">
        {/* Large Heading Text */}
        <div className="mb-56">
          <h2 className="text-4xl md:text-6xl lg:text-6xl font-bold text-black leading-tight tracking-tight font-chaney">
            <span className="flex items-start gap-3">
              <span className="w-3 h-3 bg-gray-500 mt-3 flex-shrink-0"></span>
              <span>
                BUILDING DIGITAL<br />
                EXPERIENCES THAT<br />
                MAKE A DIFFERENCE
              </span>
            </span>
          </h2>
        </div>

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

        {/* Image in bottom right corner with ASHCODE text to the left */}
        <div className="absolute bottom-0 right-0 flex items-end gap-4 z-10">
          {/* ASHCODE text to the left of image */}
          <div className="text-2xl md:text-3xl text-gray-600 font-medium pb-2">
            ASHCODE<span className="text-gray-500">›</span>
          </div>
          
          {/* Image */}
          <div className="relative w-64 h-64 md:w-80 md:h-80">
            <Image
              src="/katana-sword-with-japanese-sun.png"
              alt="Footer Image"
              fill
              className="object-contain object-center"
              priority
            />
          </div>
        </div>

        {/* Bottom Row - Copyright and Made By in one line */}
        <div className="mt-8 flex flex-wrap items-center gap-4 text-sm text-black">
          <span>© {new Date().getFullYear()} ASHCODE</span>
          <span>MADE BY ASHCODE</span>
        </div>
      </div>
    </footer>
  );
}

