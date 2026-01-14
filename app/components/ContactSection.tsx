"use client";

export default function ContactSection() {
  return (
    <section className="w-full min-h-screen flex flex-col justify-between bg-white px-4 md:px-6 lg:px-8 py-12 md:py-16">
      <div className="w-full md:w-1/2">
        <h1 className="text-7xl md:text-8xl lg:text-9xl xl:text-[10rem] font-bold text-black dark:text-white leading-tight font-chaney uppercase">
          <span className="text-6xl md:text-7xl lg:text-8xl xl:text-9xl align-top inline-block">
            HURRY<br />
            AND<br />
            CONTACT
          </span>
        </h1>
      </div>
      
      {/* Bottom Center - Three Rectangular Buttons */}
      <div className="w-full flex justify-center">
        <div className="flex flex-col md:flex-row gap-4 md:gap-6">
          <button className="px-6 md:px-8 py-3 md:py-4 border border-black text-black text-sm md:text-base font-medium font-safiro cursor-pointer hover:-translate-y-1 transition-all duration-200">
            GET IN TOUCH
          </button>
          <button className="px-6 md:px-8 py-3 md:py-4 border border-black text-black text-sm md:text-base font-medium font-safiro cursor-pointer hover:-translate-y-1 transition-all duration-200">
            SEND A BRIEF
          </button>
          <button className="px-6 md:px-8 py-3 md:py-4 border border-black text-black text-sm md:text-base font-medium font-safiro cursor-pointer hover:-translate-y-1 transition-all duration-200">
            BOOK A CALL
          </button>
        </div>
      </div>
    </section>
  );
}
