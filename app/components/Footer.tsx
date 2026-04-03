import Image from "next/image";

/** Main-column visual only; connect / email / © live in AppSidebar. */
export default function Footer() {
  return (
    <footer className="flex min-h-0 w-full flex-1 flex-col bg-[#e6362d] text-white">
      <div className="flex min-h-0 w-full flex-1 flex-col bg-[#e6362d] px-4 py-12 md:px-6 md:py-16 lg:px-8">
        <section className="mb-0 flex min-h-0 w-full flex-1 flex-col md:mb-0">
          <div className="relative mx-auto flex min-h-0 w-full max-w-6xl flex-1 flex-col overflow-hidden bg-[#e6362d] py-16 md:py-20">
            <div className="absolute left-4 top-1/3 font-safiro text-[10px] uppercase tracking-[0.08em] text-white/55 md:left-8 md:text-xs">
              <p>5:41 AM</p>
              <p>DAMN MIST, 45°</p>
            </div>
            <div className="absolute right-4 top-1/3 text-right font-safiro text-[10px] uppercase tracking-[0.08em] text-white/55 md:right-8 md:text-xs">
              <p>VISIBILITY 4 MI</p>
              <p>WINDS N 0 MPH</p>
            </div>

            <div className="relative z-10 flex flex-col items-center justify-center">
              <span className="block font-chaney text-[16vw] font-black uppercase leading-none text-white md:text-[11vw]">
                ASH
              </span>
              <span className="-mt-4 block font-chaney text-[16vw] font-black uppercase leading-none text-white md:-mt-6 md:text-[11vw]">
                CODE
              </span>
            </div>

            <div className="footer-float absolute bottom-[-2rem] left-[-2rem] z-[20]">
              <Image src="/cube.png" alt="" width={400} height={400} />
            </div>
            <div className="footer-float-alt absolute bottom-[-2rem] right-[-2rem] z-20">
              <Image src="/flight.png" alt="" width={400} height={400} />
            </div>
            <div className="footer-float-alt absolute left-[12rem] top-[-3rem] z-[1]">
              <Image src="/boxing.png" alt="" width={200} height={200} />
            </div>
            <div className="footer-float absolute right-[8rem] top-0 z-20">
              <Image src="/cards.png" alt="" width={220} height={220} />
            </div>
          </div>
        </section>
      </div>
    </footer>
  );
}
