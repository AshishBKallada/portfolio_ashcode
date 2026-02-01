"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";

export default function StickyBottomBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFooterVisible, setIsFooterVisible] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const topSectionRef = useRef<HTMLDivElement>(null);
  const navItemsRef = useRef<HTMLDivElement>(null);
  const bottomSectionRef = useRef<HTMLDivElement>(null);
  const stickyBarRef = useRef<HTMLDivElement>(null);

  // GSAP animations for menu
  useEffect(() => {
    if (!menuRef.current || !overlayRef.current) return;

    if (isMenuOpen) {
      // Open animation
      gsap.set(overlayRef.current, { display: 'block' });
      
      const tl = gsap.timeline();
      
      // Fade in overlay
      tl.fromTo(overlayRef.current, 
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: "power2.out" }
      );
      
      // Scale and fade in menu container
      tl.fromTo(menuRef.current,
        { scale: 0.95, opacity: 0, y: 20 },
        { scale: 1, opacity: 1, y: 0, duration: 0.4, ease: "power3.out" },
        "-=0.2"
      );
      
      // Animate top section
      if (topSectionRef.current) {
        tl.fromTo(topSectionRef.current,
          { y: -20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.3, ease: "power2.out" },
          "-=0.3"
        );
      }
      
      // Animate nav items
      if (navItemsRef.current) {
        const items = navItemsRef.current.querySelectorAll('button');
        tl.fromTo(items,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.4, stagger: 0.1, ease: "power2.out" },
          "-=0.2"
        );
      }
      
      // Animate bottom section
      if (bottomSectionRef.current) {
        tl.fromTo(bottomSectionRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.3, ease: "power2.out" },
          "-=0.3"
        );
      }
      
      document.body.style.overflow = 'hidden';
    } else {
      // Close animation
      const tl = gsap.timeline({
        onComplete: () => {
          if (overlayRef.current) {
            gsap.set(overlayRef.current, { display: 'none' });
          }
        }
      });
      
      tl.to(menuRef.current, {
        scale: 0.95,
        opacity: 0,
        y: 20,
        duration: 0.3,
        ease: "power2.in"
      });
      
      tl.to(overlayRef.current, {
        opacity: 0,
        duration: 0.2,
        ease: "power2.in"
      }, "-=0.2");
      
      document.body.style.overflow = '';
    }
  }, [isMenuOpen]);

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

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isMenuOpen && !target.closest('.menu-container') && !target.closest('.menu-button')) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isMenuOpen]);

  const navItems = [
    { name: "Home", href: "#home" },
    { name: "About", href: "#about" },
    { name: "Skills", href: "#skills" },
    { name: "Experience", href: "#experience" },
  ];

  const handleNavClick = (href: string) => {
    setIsMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Overlay Menu */}
      <div 
        ref={overlayRef}
        className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm"
        style={{ display: 'none' }}
      >
        <div className="h-full flex items-center justify-center p-6">
          <div 
            ref={menuRef}
            className="max-w-2xl w-full bg-black rounded-3xl overflow-hidden flex flex-col"
            style={{ maxHeight: '85vh', height: 'fit-content' }}
          >
            {/* Top Section - Logo/Home */}
            <div ref={topSectionRef} className="bg-white text-black px-6 md:px-8 py-4 md:py-5">
              <div className="flex items-center justify-between">
                <Link href="/" className="text-xl md:text-2xl font-bold font-chaney">
                  ASHCODE
                </Link>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="text-2xl md:text-3xl hover:opacity-70 transition-opacity"
                  aria-label="Close menu"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Navigation Items */}
            <div ref={navItemsRef} className="flex-1 flex flex-col justify-center px-6 md:px-8 py-8 md:py-12 min-h-[300px]">
              <nav className="flex flex-col gap-3 md:gap-4">
                {navItems.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => handleNavClick(item.href)}
                    className="text-left text-3xl md:text-5xl lg:text-6xl font-bold text-white hover:text-gray-400 transition-colors font-chaney"
                  >
                    {item.name}
                  </button>
                ))}
              </nav>
            </div>

            {/* Bottom Section - Profile Info */}
            <div ref={bottomSectionRef} className="px-6 md:px-8 py-4 md:py-5 border-t border-white/10">
              <div className="flex items-center gap-4">
                <div className="relative w-12 h-12 md:w-16 md:h-16 rounded-xl overflow-hidden flex-shrink-0 border-2 border-white/20">
                  <Image
                    src="/stubble.png"
                    alt="Profile"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-base md:text-lg font-semibold text-white font-safiro">
                    ASHISH B KALLADA
                  </span>
                  <span className="text-xs md:text-sm text-gray-400 font-safiro">
                    PRODUCT BUILDER, NEXT.JS ENTHUSIAST, CREATIVE DEVELOPER
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div 
        ref={stickyBarRef}
        className={`fixed bottom-6 left-1/2 -translate-x-1/2 max-w-2xl w-full px-4 md:px-6 lg:px-8 z-50 bg-black rounded-3xl text-white py-3 md:py-4 border-t border-white/10 menu-container transition-opacity duration-300 ${
          isFooterVisible ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
      <div className="flex items-center justify-between gap-4">
        {/* Left Section - Avatar and Info */}
        <div className="flex items-center gap-3 md:gap-4">
          <div className="relative w-14 h-14 md:w-16 md:h-16 rounded-xl overflow-hidden flex-shrink-0 border-2 border-white/20">
            <Image
              src="/stubble.png"
              alt="Profile"
              fill
              className="object-cover"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-base md:text-lg lg:text-xl font-semibold text-white font-safiro">
              ASHISH B KALLADA
            </span>
            <span className="text-sm md:text-base text-gray-400 font-safiro">
              <div className="relative min-w-md md:w-96 h-7 md:h-8 overflow-hidden">
                {/* Fading edges */}
                <div className="absolute left-0 top-0 h-full w-10 bg-gradient-to-r from-black to-transparent pointer-events-none z-10" />
                <div className="absolute right-0 top-0 h-full w-10 bg-gradient-to-l from-black to-transparent pointer-events-none z-10" />
                {/* Marquee text */}
                <div
                  className="absolute flex items-center animate-marquee whitespace-nowrap h-full left-0"
                  style={{
                    animation: 'marquee-bottombar 12s linear infinite'
                  }}
                >
                  <span className="text-sm md:text-base text-gray-400 font-safiro px-2">
                    PRODUCT BUILDER, NEXT.JS ENTHUSIAST, CREATIVE DEVELOPER • 
                  </span>
                  <span className="text-sm md:text-base text-gray-400 font-safiro px-2">
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

        {/* Right Section - Menu Icon */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="menu-button flex flex-col gap-1.5 p-2 hover:opacity-70 transition-opacity"
          aria-label="Menu"
        >
          <span className={`w-5 h-0.5 bg-white transition-all ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
          <span className={`w-5 h-0.5 bg-white transition-all ${isMenuOpen ? 'opacity-0' : ''}`}></span>
          <span className={`w-5 h-0.5 bg-white transition-all ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
        </button>
      </div>
    </div>
    </>
  );
}

