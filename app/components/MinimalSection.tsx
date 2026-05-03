"use client";

import Image from "next/image";

export default function MinimalSection() {

  return (
    <section
      id="minimal"
      className="w-full min-h-screen relative overflow-hidden bg-transparent"
    >
      <div className="w-full min-h-screen flex flex-col items-center justify-center px-4 md:px-6 lg:px-8 py-12 md:py-16 lg:py-20">
        {/* Horizontal Banner with GIF */}
        <div className="w-full w-screen mb-8">
          <div className="relative w-full h-[80px] overflow-hidden">
            <Image
              src="/300.gif"
              alt="Creative banner"
              fill
              className="object-cover w-full h-full"
              unoptimized
            />
          </div>
        </div>

        {/* Text Below Video - Left Aligned */}
        <div className="w-full text-left space-y-1">
          <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-safiro text-white/90">
            <span className="font-safiro font-bold text-5xl md:text-6xl lg:text-7xl xl:text-8xl">building</span>{" "}
            <span className="font-safiro font-bold text-5xl md:text-6xl lg:text-7xl xl:text-8xl">digital</span>
          </h1>
          <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-safiro font-bold text-white/90">
            <span className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl">experiences with code</span>
          </h2>
         
        </div>
      </div>
    </section>
  );
}

