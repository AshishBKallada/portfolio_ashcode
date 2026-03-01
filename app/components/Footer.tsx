import Image from "next/image";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full flex flex-col bg-black">
      {/* Top Gradient Section */}
      <div 
        className="relative w-full h-[30vh] md:h-[40vh]"
        style={{
          background: 'linear-gradient(to bottom, #FFFFFF 0%, #E9D5FF 10%, #C4B5FD 20%, #A78BFA 30%, #8B5CF6 40%, #6B46C1 50%, #4C1D95 60%, #2d1b4e 70%, #000000 80%, #000000 100%)'
        }}
      />
      
      <div className="w-full flex flex-col px-4 md:px-6 lg:px-8 py-12 md:py-16">
      {/* DAMN GOOD Banner Section (reference-style) */}
      <section className="w-full mb-16 md:mb-20">
        <div className="relative w-full max-w-6xl mx-auto py-16 md:py-20 bg-black overflow-hidden">
          {/* Side micro copy */}
          <div className="absolute left-4 md:left-8 top-1/3 text-[10px] md:text-xs tracking-[0.08em] text-gray-400 font-safiro uppercase">
            <p>5:41 AM</p>
            <p>DAMN MIST, 45°</p>
          </div>
          <div className="absolute right-4 md:right-8 top-1/3 text-[10px] md:text-xs tracking-[0.08em] text-gray-400 font-safiro uppercase text-right">
            <p>VISIBILITY 4 MI</p>
            <p>WINDS N 0 MPH</p>
          </div>

          {/* Main text */}
          <div className="flex flex-col items-center justify-center relative z-10">
            <span className="block text-[16vw] md:text-[11vw] leading-none font-chaney font-black text-white uppercase">
              ASH
            </span>
            <span className="block text-[16vw] md:text-[11vw] leading-none font-chaney font-black text-white uppercase -mt-4 md:-mt-6">
              CODE
            </span>
          </div>

          {/* Corner imagery from public assets */}
          {/* Cube (dice) bottom-left, overlapping "ASH" */}
          <div className="absolute left-[-2rem] bottom-[-2rem] z-[20] footer-float">
            <Image
              src="/cube.png"
              alt="Dice"
              width={400}
              height={400}
            />
          </div>

          {/* Flight bottom-right, overlapping "CODE" */}
          <div className="absolute right-[-2rem] bottom-[-2rem] z-20 footer-float-alt">
            <Image
              src="/flight.png"
              alt="Jet"
              width={400}
              height={400}
            />
          </div>
          <div className="absolute left-[12rem] top-[-3rem] z-1 footer-float-alt">
            <Image
              src="/boxing.png"
              alt="Jet"
              width={200}
              height={200}
            />
          </div>

          {/* Cards top-right, overlapping corner */}
          <div className="absolute right-[8rem] top-0 z-20 footer-float">
            <Image
              src="/cards.png"
              alt="Tiger"
              width={220}
              height={220}
            />
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <div className="w-full flex flex-col md:flex-row gap-12 md:gap-16 mb-12 md:mb-16">
        {/* Left Section - Call to Action */}
     

        {/* Right Section - Contact Information */}
        <div className="w-full md:w-1/2 md:ml-auto flex flex-col gap-8 md:gap-10">
          {/* First Row - Connect */}
          <div className="flex flex-col md:flex-row gap-8 md:gap-16 border-t border-gray-800 pt-4 md:pt-6">
            <div className="md:w-1/3">
              <h3 className="text-sm text-gray-400 font-safiro">
                Connect
              </h3>
            </div>
            <div className="md:w-2/3 flex flex-col gap-3 md:gap-4">
              <a 
                href="https://x.com" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm md:text-base text-white font-safiro hover:opacity-70 transition-opacity"
              >
                X (Agency)
              </a>
              <a 
                href="https://x.com" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm md:text-base text-white font-safiro hover:opacity-70 transition-opacity"
              >
                X (Founder)
              </a>
              <a 
                href="https://www.linkedin.com" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm md:text-base text-white font-safiro hover:opacity-70 transition-opacity"
              >
                LinkedIn
              </a>
            </div>
          </div>

          {/* Second Row - Email us */}
          <div className="flex flex-col md:flex-row gap-8 md:gap-16 border-t border-gray-800 pt-4 md:pt-6">
            <div className="md:w-1/3">
            <h3 className="text-sm text-gray-400 font-safiro">
            Email us
              </h3>
            </div>
            <div className="md:w-2/3 flex flex-col gap-3 md:gap-4">
              <div className="flex flex-col">
                <a 
                  href="mailto:connect@ashcode.com"
                  className="text-sm md:text-base text-white font-safiro hover:opacity-70 transition-opacity"
                >
                  connect@ashcode.com
                </a>
                <span className="text-sm md:text-sm text-gray-400 font-safiro">
                  (Project Enquiries)
                </span>
              </div>
              <div className="flex flex-col">
                <a 
                  href="mailto:hello@ashcode.com"
                  className="text-sm md:text-base text-white font-safiro hover:opacity-70 transition-opacity"
                >
                  hello@ashcode.com
                </a>
                <span className="text-sm md:text-sm text-gray-400 font-safiro">
                  (PR & Marketing)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Footer */}
      <div className="w-full text-xs md:text-sm text-gray-500 font-safiro border-t border-gray-800 pt-4 md:pt-6 flex items-center justify-between">
        <span>© {currentYear} ASHCODE</span>
      </div>
      </div>
    </footer>
  );
}

