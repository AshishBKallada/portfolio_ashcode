"use client";

import Link from "next/link";

const EMAIL = "ashercode4u@gmail.com";
const GITHUB = "https://github.com/AshishBKallada";

const BG = "#f9f7f2";
const INK = "#3d2e26";
const softPill =
  "inline-flex items-center justify-center rounded-full font-safiro text-[#3d2e26] shadow-[0_6px_18px_rgba(61,46,38,0.09),inset_0_1px_0_rgba(255,255,255,0.9)] transition hover:shadow-[0_8px_22px_rgba(61,46,38,0.11)]";

const storeBtn = `${softPill} min-h-10 bg-[#ebe8e1] px-7 text-[12px] font-medium md:min-h-11 md:px-8 md:text-[13px]`;

const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=0&color=3d2e26&bgcolor=f9f7f2&data=${encodeURIComponent(`mailto:${EMAIL}`)}`;

export default function ContactSection() {
  return (
    <section
      id="contact"
      className="relative isolate flex w-full shrink-0 justify-center overflow-hidden"
      style={{ backgroundColor: BG }}
      aria-label="Contact"
    >
      <div className="flex min-h-[min(100dvh,52rem)] w-full max-w-[52rem] flex-col justify-center gap-20 px-8 py-24 md:max-w-[58rem] md:gap-28 md:px-16 md:py-32 lg:max-w-[62rem] lg:gap-32 lg:px-20 lg:py-40">
  

        <div className="flex flex-col items-center justify-center py-8 md:py-14 lg:py-16">
          <div className="flex w-full flex-col items-center justify-center gap-16 md:flex-row md:items-center md:gap-20 lg:gap-28">
            <div className="flex max-w-[18rem] flex-col items-center text-center md:max-w-[17rem] md:items-start md:text-left lg:max-w-[20rem]">
              <h2
                className="font-safiro text-[clamp(1.5rem,4.5vw,2.35rem)] font-extralight leading-[1.2] tracking-[-0.03em]"
                style={{ color: INK }}
              >
                Connect with AshCode now.
              </h2>
              <div className="mt-12 flex flex-wrap justify-center gap-4 md:mt-14 md:justify-start md:gap-5">
                <a href={`mailto:${EMAIL}`} className={storeBtn}>
                  Email
                </a>
                <a
                  href={GITHUB}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={storeBtn}
                >
                  GitHub
                </a>
              </div>
            </div>

            <div className="flex shrink-0 justify-center pt-4 md:pt-0">
              <div className="-rotate-6 rounded-2xl bg-white p-5 shadow-[0_20px_50px_rgba(61,46,38,0.14),0_8px_24px_rgba(61,46,38,0.07)] md:p-6">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={qrUrl}
                  alt={`QR code to email ${EMAIL}`}
                  width={180}
                  height={180}
                  className="block h-auto w-[7.5rem] md:w-[8.5rem]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
