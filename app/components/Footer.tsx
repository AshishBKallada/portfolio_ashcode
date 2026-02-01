"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const marqueeRef = useRef<HTMLDivElement>(null);
  const arrowRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const arrowAnimations = useRef<(gsap.core.Tween | null)[]>([]);
  const [scrollDirection, setScrollDirection] = useState(0);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const marquee = marqueeRef.current;
    if (marquee) {
      const firstItem = marquee.querySelector<HTMLElement>(':first-child');
      const marqueeWidth = firstItem ? firstItem.offsetWidth * 2 : 0;

      gsap.to(marquee, {
        x: -marqueeWidth,
        duration: 30,
        ease: "none",
        repeat: -1,
      });
    }
  }, []);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const scrollDelta = currentScrollY - lastScrollY.current;
          const direction = scrollDelta > 0 ? 1 : -1;
          
          setScrollDirection(direction);
          lastScrollY.current = currentScrollY;

          // Rotate all arrows to point left or right based on scroll direction using GSAP
          arrowRefs.current.forEach((arrow, index) => {
            if (arrow) {
              // Scroll down → point right (0deg), Scroll up → point left (180deg)
              const targetRotation = direction > 0 ? 0 : 180;
              
              // Kill any existing animation for this arrow
              if (arrowAnimations.current[index]) {
                arrowAnimations.current[index]?.kill();
              }
              
              // Animate to target rotation with GSAP
              arrowAnimations.current[index] = gsap.to(arrow, {
                rotation: targetRotation,
                duration: 0.5,
                ease: "power2.out",
              });
            }
          });

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      // Clean up animations
      arrowAnimations.current.forEach(anim => anim?.kill());
    };
  }, []);

  return (
    <footer className="w-full  flex flex-col justify-between px-4 md:px-6 lg:px-8 py-8 bg-white relative">
      {/* Contact Section at Top */}
      
      {/* Section Above Footer Content */}
      <div className="w-full flex-1 flex flex-col md:flex-row gap-8 md:gap-0 mt-12 min-h-screen">
        {/* Left Section - Equal Width */}
        <div className="w-full md:w-1/2 flex-1 flex items-center">
          <div className="flex flex-col">
              <span className="text-3xl md:text-5xl lg:text-7xl xl:text-8xl font-bold text-black font-chaney uppercase leading-none">
                ASH
              </span>
            
                <span className="text-2xl md:text-5xl lg:text-7xl xl:text-8xl font-bold text-black font-chaney uppercase leading-none">
                  CODE
                </span>
              
          </div>
        </div>

        {/* Right Section - Equal Width */}
        <div className="w-full md:w-1/2 pl-0 md:pl-8 flex-1 flex flex-col justify-center">
          <div className="text-black font-safiro">
            {/* Text at the top of right section */}
            <p className="text-xl md:text-2xl max-w-xl mb-8 md:mb-12 leading-relaxed">
              creative journey? Join now and let's shape the future of the art world together!
            </p>
            <div className="space-y-4 md:space-y-6 flex flex-col">
              <a 
                href="#" 
                className="block text-xl md:text-2xl text-black font-safiro border-b border-black pb-2 flex items-center justify-between group hover:opacity-70 transition-opacity"
              >
                <span>Get in touch.</span>
                <span className="text-xl md:text-2xl -rotate-45">→</span>
              </a>
              <a 
                href="https://www.instagram.com/aaah6__" 
                target="_blank"
                rel="noopener noreferrer"
                className="block text-xl md:text-2xl text-black font-safiro border-b border-black pb-2 flex items-center justify-between group hover:opacity-70 transition-opacity"
              >
                <span>Send a brief.</span>
                <span className="text-xl md:text-2xl -rotate-45">→</span>
              </a>
              <a 
                href="mailto:connect@ashcode.com" 
                className="block text-xl md:text-2xl text-black font-safiro border-b border-black pb-2 flex items-center justify-between group hover:opacity-70 transition-opacity"
              >
                <span>Book a call.</span>
                <span className="text-xl md:text-2xl -rotate-45">→</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="flex items-end">
        
        <div className="w-full flex flex-col  border-t border-black md:flex-row items-start md:items-end justify-between gap-6 md:gap-8 py-2">
          {/* Left Section - Copyright */}
          <div className="text-xs md:text-sm text-black font-safiro self-start">
            <span>{currentYear} © ASHCODE</span>
          </div>

          {/* Center Section - Links */}
          <div className="flex flex-col items-start text-xs md:text-sm text-black font-safiro">
            <Link
              href="/privacy-policy"
              className="hover:opacity-70 transition-opacity whitespace-nowrap"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms-and-conditions"
              className="hover:opacity-70 transition-opacity whitespace-nowrap"
            >
              Terms & Conditions
            </Link>
            <a
              href="https://www.instagram.com/aaah6__"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-70 transition-opacity whitespace-nowrap"
            >
              Instagram
            </a>
            <a
              href="https://www.linkedin.com/in/ashishbkallada"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-70 transition-opacity whitespace-nowrap"
            >
              LinkedIn
            </a>
          </div>

          {/* Right Section - Credits */}
          <div className="text-xs md:text-sm text-black font-safiro whitespace-nowrap self-start">
            <span>Made by ASHCODE</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

