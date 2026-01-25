"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [text, setText] = useState("ASHCODE");
  const [isAnimating, setIsAnimating] = useState(false);

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

  return (
    <div className="fixed top-6 left-0 right-0 z-50 flex justify-between items-center px-6">
      <Link
        href="/"
        className="text-xl font-bold text-black dark:text-white font-chaney select-none tracking-wide inline-block transition-all ease-in-out hover:opacity-70"
        style={{
          transform: isAnimating ? "translateY(20px)" : "translateY(0)",
          opacity: isAnimating ? 0 : 1,
          transitionDuration: "300ms",
        }}
      >
        {text}
      </Link>
      
      <div className="flex items-center gap-3 md:gap-5 absolute left-1/2 md:left-[60%] transform -translate-x-1/2">
        <span className="text-xs md:text-sm font-safiro text-gray-400 uppercase tracking-wide">
          {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
        <Link
          href="/projects"
          className="text-xs md:text-sm font-safiro text-black dark:text-white uppercase tracking-wide hover:opacity-70 transition-opacity"
        >
          projects
        </Link>
        <Link
          href="/#blog"
          className="text-xs md:text-sm font-safiro text-black dark:text-white uppercase tracking-wide hover:opacity-70 transition-opacity"
        >
          blogs
        </Link>
        <Link
          href="/#experience"
          className="text-xs md:text-sm font-safiro text-black dark:text-white uppercase tracking-wide hover:opacity-70 transition-opacity"
        >
          contact
        </Link>
      </div>
    </div>
  );
}

