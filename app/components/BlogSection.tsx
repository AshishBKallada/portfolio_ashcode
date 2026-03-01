"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

interface BlogPost {
  date: string;
  name: string;
  slug: string;
}

const blogPosts: BlogPost[] = [
  {
    date: "2026.1.18",
    name: "The 'Rabbit Hole' Ritual: Why Curiosity is a Developer's Secret Weapon",
    slug: "curiosity-driven-learning",
  },
  {
    date: "2026.1.11",
    name: "The Unsung Art: Nurturing Frontend Talent Through Teaching",
    slug: "nurturing-frontend-talent-teaching",
  },
  {
    date: "2025.12.22",
    name: "Beyond the Cursor: Why the Best Developers Switch to 'Scientist Mode'",
    slug: "how-to-rewire-your-brain-to-be-addicted-to-coding",
  },

];

export default function BlogSection() {
  const rightMarqueeRef = useRef<HTMLDivElement>(null);
  const isScrollingDown = useRef(false);
  const rightMarqueeAnimation = useRef<gsap.core.Tween | null>(null);
  const blogListRef = useRef<HTMLDivElement>(null);
  const magnifierRef = useRef<HTMLDivElement>(null);
  const [bombs, setBombs] = useState<Array<{ id: number; x: number }>>([]);
  const [marqueeText, setMarqueeText] = useState("take • this • bomb • press • k • to • drop");
  const [balloonImage, setBalloonImage] = useState("/balloon.png");
  const bombIdRef = useRef(0);
  const angryBirdAudioRef = useRef<HTMLAudioElement | null>(null);
  const explosionAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const rightMarquee = rightMarqueeRef.current;
    if (!rightMarquee) return;

    const rightFirstItem = rightMarquee.querySelector<HTMLElement>(':first-child');
    const rightWidth = rightFirstItem ? rightFirstItem.offsetWidth * 4 : 0;

    rightMarqueeAnimation.current = gsap.to(rightMarquee, {
      x: rightWidth,
      duration: 20,
      ease: "none",
      repeat: -1,
    });

    const handleWheel = (e: WheelEvent) => {
      const rightFirstItem = rightMarquee.querySelector<HTMLElement>(':first-child');
      const rightWidth = rightFirstItem ? rightFirstItem.offsetWidth * 4 : 0;

      if (e.deltaY > 0 && !isScrollingDown.current) {
        isScrollingDown.current = true;
        rightMarqueeAnimation.current?.kill();

        rightMarqueeAnimation.current = gsap.to(rightMarquee, {
          x: -rightWidth,
          duration: 20,
          ease: "none",
          repeat: -1,
        });
      } else if (e.deltaY < 0 && isScrollingDown.current) {
        isScrollingDown.current = false;
        rightMarqueeAnimation.current?.kill();

        rightMarqueeAnimation.current = gsap.to(rightMarquee, {
          x: rightWidth,
          duration: 20,
          ease: "none",
          repeat: -1,
        });
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: true });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      rightMarqueeAnimation.current?.kill();
    };
  }, []);

  // Magnifier cursor on hover over blog list
  useEffect(() => {
    const blogList = blogListRef.current;
    const magnifier = magnifierRef.current;
    const customCursor = document.querySelector('.custom-cursor') as HTMLElement;
    
    if (!blogList || !magnifier) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (magnifier) {
        gsap.to(magnifier, {
          x: e.clientX,
          y: e.clientY,
          duration: 0.1,
          ease: "none",
        });
      }
    };

    const handleMouseEnter = () => {
      if (customCursor) {
        gsap.to(customCursor, { opacity: 0, duration: 0.2 });
      }
      if (magnifier) {
        gsap.set(magnifier, { opacity: 1, scale: 1 });
      }
    };

    const handleMouseLeave = () => {
      if (customCursor) {
        gsap.to(customCursor, { opacity: 1, duration: 0.2 });
      }
      if (magnifier) {
        gsap.to(magnifier, { opacity: 0, scale: 0.8, duration: 0.2 });
      }
    };

    blogList.addEventListener("mouseenter", handleMouseEnter);
    blogList.addEventListener("mousemove", handleMouseMove);
    blogList.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      blogList.removeEventListener("mouseenter", handleMouseEnter);
      blogList.removeEventListener("mousemove", handleMouseMove);
      blogList.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  // Bomb drop on K key press
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'k') {
        const randomX = Math.random() * (window.innerWidth - 100);
        const newBomb = {
          id: bombIdRef.current++,
          x: randomX,
        };
        
        setBombs((prev) => [...prev, newBomb]);
        
        // Change marquee text to violence message
        setMarqueeText("Why • are • you • choosing • violence bro");
        
        // Change balloon image to peace balloon
        setBalloonImage("/balloon-peace.png");
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  // Animate bomb drop
  useEffect(() => {
    bombs.forEach((bomb) => {
      const bombElement = document.getElementById(`bomb-${bomb.id}`);
      if (!bombElement) return;

      // Play angry bird sound when bomb starts dropping
      if (angryBirdAudioRef.current) {
        try {
          angryBirdAudioRef.current.currentTime = 0;
          void angryBirdAudioRef.current.play();
        } catch {}
      }

      const screenHeight = window.innerHeight;
      
      gsap.to(bombElement, {
        y: screenHeight + 200,
        duration: 2,
        ease: "power2.in",
        onComplete: () => {
          // Stop angry bird sound
          if (angryBirdAudioRef.current) {
            angryBirdAudioRef.current.pause();
            angryBirdAudioRef.current.currentTime = 0;
          }
          
          // Play explosion sound when bomb reaches bottom
          if (explosionAudioRef.current) {
            try {
              explosionAudioRef.current.currentTime = 0;
              void explosionAudioRef.current.play();
            } catch {}
          }
          
          // Remove bomb after a short delay
          setTimeout(() => {
            setBombs((prev) => prev.filter((b) => b.id !== bomb.id));
          }, 100);
        },
      });
    });
  }, [bombs]);

  const marqueeItems = Array(8).fill(null);

  return (
    <div className="min-h-screen w-full bg-black text-white relative overflow-hidden">
      {/* Bomb drop audio */}
      <audio ref={angryBirdAudioRef} src="/angry-bird.mp3" preload="auto" />
      <audio ref={explosionAudioRef} src="/explosion.mp3" preload="auto" />
      
      {/* Dropping bombs */}
      {bombs.map((bomb) => (
        <div
          key={bomb.id}
          id={`bomb-${bomb.id}`}
          className="fixed pointer-events-none z-[1000]"
          style={{
            left: `${bomb.x}px`,
            top: '-100px',
          }}
        >
          <Image
            src="/bomb.png"
            alt="Bomb"
            width={200}
            height={200}
            className="object-contain"
          />
        </div>
      ))}
      
      {/* Magnifier cursor */}
      <div
        ref={magnifierRef}
        className="pointer-events-none fixed top-0 left-0 z-[999] opacity-0"
        style={{
          transform: "translate(-50%, -50%)",
        }}
      >
        <Image
          src="/magnifyer.png"
          alt="Magnifier"
          width={200}
          height={200}
          className="object-contain"
        />
      </div>

      {/* Top Gradient Section */}
      <div 
        className="relative w-full flex-1 flex justify-between px-6 md:px-12 lg:px-16 py-12 md:py-16 lg:py-20 overflow-hidden"
        style={{
          background: 'linear-gradient(to bottom, #FFFFFF 0%, #E9D5FF 10%, #C4B5FD 20%, #A78BFA 30%, #8B5CF6 40%, #6B46C1 50%, #4C1D95 60%, #2d1b4e 70%, #000000 80%, #000000 100%)'
        }}
      >
      </div>

      {/* Main Content Section */}
      <div className="w-full bg-black px-16 py-12 md:py-16 flex items-center justify-center relative z-10">
        <div className="max-w-[1600px] mx-auto flex flex-col gap-8 w-full">
        <div className="relative inline-block">
          <div className="flex items-center">
            <h1 className="text-6xl md:text-7xl lg:text-8xl text-white font-bold font-chaney leading-none">
              Blog<sup className="align-super text-xs md:text-sm ml-2 mb-12 font-normal">(3)</sup>
            </h1>
            
            {/* Arrow image */}
            <div className="flex-shrink-0">
              <Image
                src="/arrowblack1.png"
                alt="Arrow"
                width={60}
                height={60}
                className="object-contain -mt-16"
              />
            </div>
            
            {/* Text */}
            <p className="text-[0.5rem] -mt-16 md:text-[0.65rem] lg:text-xs font-safiro text-white italic">
              felt cute <br/> might delete later
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-12 lg:gap-20 items-start">
          <div className="flex flex-col gap-3">
            <h2 className="text-xs md:text-sm uppercase tracking-wider font-semibold text-white border-b border-white/20 pb-3">
              ABOUT
            </h2>
            <p className="text-sm leading-relaxed text-white/80 max-w-md pb-3">
              Here&apos;s where I share my thoughts, insights, and growth. New blog article monthly, released towards the end of every month. (also planning to create a newsletter soon.)
            </p>
          </div>

          <div className="flex flex-col">
            <div className="grid grid-cols-[140px_1fr] md:grid-cols-[160px_1fr] gap-6 pb-3 border-b border-white/20 mb-0">
              <div className="text-xs md:text-sm uppercase tracking-wider font-semibold text-white/60">
                DATE
              </div>
              <div className="text-xs md:text-sm uppercase tracking-wider font-semibold text-white/60">
                NAME
              </div>
            </div>

            <div ref={blogListRef} className="flex flex-col">
              {blogPosts.map((post, index) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className={`group grid grid-cols-[140px_1fr] md:grid-cols-[160px_1fr] gap-6 py-3 transition-colors duration-200 cursor-pointer hover:bg-purple-500 ${index < blogPosts.length - 1 ? 'border-b border-white/20' : ''}`}
                >
                  <div className="text-sm md:text-base text-white group-hover:text-white transition-colors duration-200">{post.date}</div>
                  <div className="text-sm md:text-base text-white group-hover:text-white transition-colors duration-200 flex items-center justify-between">
                    <span>{post.name}</span>
                    <span className="text-lg font-bold group-hover:text-white text-white/70">+</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
        </div>
      </div>

      {/* Bottom Gradient Section */}
      <div 
        className="relative w-full flex-1 flex justify-between px-6 md:px-12 lg:px-16 py-12 md:py-16 lg:py-32 overflow-hidden"
        style={{
          background: 'linear-gradient(to bottom, #000000 0%, #000000 20%, #2d1b4e 30%, #4C1D95 40%, #6B46C1 50%, #8B5CF6 60%, #A78BFA 70%, #C4B5FD 80%, #E9D5FF 90%, #FFFFFF 100%)'
        }}
      >
        {/* Marquee at bottom */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden border-t border-white/10 py-3">
          <div ref={rightMarqueeRef} className="flex whitespace-nowrap items-center">
            {marqueeItems.map((_, i) => (
              <div key={`right-${i}`} className="inline-flex items-center px-8 flex-shrink-0 gap-4">
                <span className="text-sm md:text-base font-medium text-gray-400">
                  {marqueeText}
                </span>
                <Image
                  src={balloonImage}
                  alt="Balloon"
                  width={300}
                  height={300}
                  className="object-contain flex-shrink-0"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

