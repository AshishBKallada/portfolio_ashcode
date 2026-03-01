"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";

export default function StickyBottomBar() {
  const [isFooterVisible, setIsFooterVisible] = useState(false);
  const stickyBarRef = useRef<HTMLDivElement>(null);

  // Detect when footer is visible
  useEffect(() => {
    const footer = document.querySelector('footer');
    if (!footer) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsFooterVisible(entry.isIntersecting);
        });
      },
      {
        threshold: 0.1, // Trigger when 10% of footer is visible
        rootMargin: '0px',
      }
    );

    observer.observe(footer);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
      <div 
        ref={stickyBarRef}
      className={`fixed bottom-4 left-1/2 -translate-x-1/2 max-w-xl w-full px-3 md:px-5 lg:px-6 z-50 bg-black rounded-2xl text-white py-2.5 md:py-3 border-t border-white/10 transition-opacity duration-300 ${
          isFooterVisible ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`} 
      >
      <div className="flex items-center gap-2.5 md:gap-3">
        {/* Avatar and Info */}
        <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-xl flex-shrink-0 border border-white/20 bg-white/10 flex items-center justify-center text-lg md:text-xl">
          <Image src="/flying-dove.png" alt="Avatar" width={40} height={40} />
          </div>
          <div className="flex flex-col">
          <span className="text-xs md:text-sm lg:text-base font-semibold text-white font-safiro">
              ASHISH B KALLADA
            </span>
          <span className="text-[11px] md:text-xs text-gray-400 font-safiro">
            <div className="relative min-w-sm h-5 md:h-6 overflow-hidden marquee-fade">
                {/* Marquee text */}
                <div
                  className="absolute flex items-center animate-marquee whitespace-nowrap h-full left-0"
                  style={{
                    animation: 'marquee-bottombar 12s linear infinite'
                  }}
                >
                <span className="text-[11px] md:text-xs text-gray-400 font-safiro px-2">
                    PRODUCT BUILDER, NEXT.JS ENTHUSIAST, CREATIVE DEVELOPER • 
                  </span>
                <span className="text-[11px] md:text-xs text-gray-400 font-safiro px-2">
                    PRODUCT BUILDER, NEXT.JS ENTHUSIAST, CREATIVE DEVELOPER • 
                  </span>
                </div>
                {/* Keyframes (inject as a style tag or put in your global CSS) */}
                <style jsx>{`
                  @keyframes marquee-bottombar {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                  }
                `}</style>
              </div>
            </span>
          </div>
      </div>
    </div>
  );
}

