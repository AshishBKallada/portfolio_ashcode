export default function Navbar() {
  return (
    <div className="fixed top-6 left-0 right-0 z-[1] px-4 md:px-8">
      <div className="relative w-full max-w-4xl mx-auto h-7 md:h-8 overflow-hidden marquee-fade">
        {/* Marquee text */}
        <div
          className="absolute flex items-center whitespace-nowrap h-full left-0"
          style={{
            animation: "marquee-nav 14s linear infinite",
          }}
        >
          <span className="text-xs md:text-sm lg:text-base text-white/55 font-safiro px-2">
            PRODUCT BUILDER, NEXT.JS ENTHUSIAST, CREATIVE DEVELOPER •
          </span>
          <span className="text-xs md:text-sm lg:text-base text-white/55 font-safiro px-2">
            PRODUCT BUILDER, NEXT.JS ENTHUSIAST, CREATIVE DEVELOPER •
          </span>
          <span className="text-xs md:text-sm lg:text-base text-white/55 font-safiro px-2">
            PRODUCT BUILDER, NEXT.JS ENTHUSIAST, CREATIVE DEVELOPER •
          </span>  <span className="text-xs md:text-sm lg:text-base text-white/55 font-safiro px-2">
            PRODUCT BUILDER, NEXT.JS ENTHUSIAST, CREATIVE DEVELOPER •
          </span>
        </div>

        {/* Local keyframes for the navbar marquee */}
        <style jsx>{`
          @keyframes marquee-nav {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }
        `}</style>
      </div>
    </div>
  );
}

