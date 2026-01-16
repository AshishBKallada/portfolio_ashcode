"use client";

import { useEffect, useState, useRef } from "react";
import { gsap } from "gsap";

export default function Navbar() {
  const [text, setText] = useState("ASHCODE");
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuItemsRef = useRef<(HTMLHeadingElement | null)[]>([]);
  const closeIconRef = useRef<HTMLButtonElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setText((prev) => (prev === "ASHCODE" ? "Ashu-Kodo" : "ASHCODE"));
        setTimeout(() => {
          setIsAnimating(false);
        }, 10);
      }, 300);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!menuRef.current) return;

    gsap.set(menuRef.current, { x: "100%" });
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      const scrollY = window.scrollY;
      document.documentElement.style.overflow = "hidden";
      document.documentElement.style.position = "fixed";
      document.documentElement.style.width = "100%";
      document.documentElement.style.top = `-${scrollY}px`;
      
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
      document.body.style.top = `-${scrollY}px`;
    } else {
      const scrollY = document.documentElement.style.top;
      document.documentElement.style.overflow = "";
      document.documentElement.style.position = "";
      document.documentElement.style.width = "";
      document.documentElement.style.top = "";
      
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.top = "";
      
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || "0") * -1);
      }
    }

    return () => {
      document.documentElement.style.overflow = "";
      document.documentElement.style.position = "";
      document.documentElement.style.width = "";
      document.documentElement.style.top = "";
      
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.top = "";
    };
  }, [isMenuOpen]);

  const handleMenuClick = () => {
    if (!menuRef.current) return;
    
    setIsMenuOpen(true);
    
    setTimeout(() => {
      const items = menuRef.current?.querySelectorAll('h4');
      if (items) {
        menuItemsRef.current = Array.from(items);
      }
      
      gsap.set(menuRef.current, { x: "100%" });
      if (menuItemsRef.current.length > 0) {
        gsap.set(menuItemsRef.current, { x: 150, opacity: 0 });
      }
      if (closeIconRef.current) {
        gsap.set(closeIconRef.current, { opacity: 0 });
      }
      
      const tl = gsap.timeline();
      tl.to(menuRef.current, {
        x: 0,
        duration: 0.5,
        ease: "power2.out",
      });

      if (menuItemsRef.current.length > 0) {
        tl.to(
          menuItemsRef.current,
          {
            x: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.15,
            ease: "power2.out",
          },
          "-=0.3"
        );
      }

      if (closeIconRef.current) {
        tl.to(
          closeIconRef.current,
          {
            opacity: 1,
            duration: 0.3,
          },
          "-=0.3"
        );
      }
      
      tlRef.current = tl;
    }, 10);
  };

  const handleCloseClick = () => {
    if (menuRef.current) {
      const reverseTl = gsap.timeline({
        onComplete: () => {
          setIsMenuOpen(false);
        }
      });
      
      if (closeIconRef.current) {
        reverseTl.to(closeIconRef.current, {
          opacity: 0,
          duration: 0.2,
        });
      }
      
      if (menuItemsRef.current.length > 0) {
        reverseTl.to(
          menuItemsRef.current,
          {
            x: 150,
            opacity: 0,
            duration: 0.4,
            stagger: 0.1,
            ease: "power2.in",
          },
          "-=0.2"
        );
      }
      
      reverseTl.to(menuRef.current, {
        x: "100%",
        duration: 0.5,
        ease: "power2.in",
      }, "-=0.2");
    }
  };

  const menuItems = [
    {
      title: "SERVICES",
      subItems: ["CREATIVE", "SOCIAL", "COMMUNICATIONS", "STUDIOS"],
    },
    {
      title: "CASE STUDIES",
      subItems: [],
    },
    {
      title: "ABOUT",
      subItems: ["CAREERS"],
    },
    {
      title: "CONTACT",
      subItems: [],
    },
  ];

  const socialLinks = ["INSTAGRAM", "LINKEDIN", "GITHUB"];

  return (
    <>
      <div className="fixed top-6 left-0 right-0 z-50 flex justify-between items-center px-6">
        <span
          className="text-xl font-bold text-black dark:text-white font-chaney select-none tracking-wide inline-block transition-all ease-in-out"
          style={{
            transform: isAnimating ? "translateY(20px)" : "translateY(0)",
            opacity: isAnimating ? 0 : 1,
            transitionDuration: "300ms",
          }}
        >
          {text}
        </span>
        <button
          aria-label="Menu"
          onClick={handleMenuClick}
          className="text-3xl text-black dark:text-white cursor-pointer hover:opacity-70 transition-opacity"
        >
          <i className="ri-menu-3-line"></i>
        </button>
      </div>

      <div
        ref={menuRef}
        className="fixed top-0 right-0 h-full w-full bg-black/90 backdrop-blur-sm z-[100] overflow-hidden flex flex-col"
        style={{ 
          padding: "60px 80px",
          transform: "translateX(100%)"
        }}
      >
        <div className="absolute top-[5%] left-[5%] text-white text-xl md:text-2xl font-bold font-chaney uppercase tracking-wider">
          ASHU-KODO
        </div>

        <button
          ref={closeIconRef}
          onClick={handleCloseClick}
          className="absolute top-[5%] right-[5%] text-white text-sm uppercase tracking-wider cursor-pointer hover:opacity-70 transition-opacity"
        >
          CLOSE
        </button>

        <div className="flex-1 flex justify-start items-start pt-20">
          <div
            className="flex flex-col gap-6 relative"
            style={{ marginLeft: "50%" }}
          >
            {menuItems.map((item, index) => (
              <div
                key={item.title}
                className="flex items-start gap-8 group relative"
              >
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full bg-white flex-shrink-0"></div>
                  <h4
                    ref={(el) => {
                      if (el) menuItemsRef.current[index] = el;
                    }}
                    className="text-3xl md:text-4xl font-bold font-chaney text-white uppercase tracking-wider cursor-pointer hover:opacity-80 transition-opacity whitespace-nowrap"
                    style={{
                      letterSpacing: "0.15em",
                    }}
                  >
                    {item.title}
                  </h4>
                </div>

                {item.subItems.length > 0 && (
                  <div className="flex flex-col gap-2 pt-2">
                    {item.subItems.map((subItem, subIndex) => (
                      <span
                        key={subItem}
                        className="text-sm text-white uppercase tracking-wider cursor-pointer hover:opacity-70 transition-opacity"
                      >
                        {subItem}
                      </span>
                    ))}
                  </div>
                )}

                {index < menuItems.length - 1 && (
                  <div className="absolute left-0 w-full h-px bg-white/30" style={{ top: "calc(100% + 12px)" }}></div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center items-center gap-4 pb-8">
          {socialLinks.map((link, index) => (
            <span key={link} className="text-xs text-white uppercase tracking-wider">
              {link}
              {index < socialLinks.length - 1 && <span className="mx-2">.</span>}
            </span>
          ))}
        </div>
      </div>
    </>
  );
}

