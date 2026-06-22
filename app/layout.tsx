import type { Metadata } from "next";
import { Inter, Instrument_Serif, Almarai } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import ThemeProvider from "@/components/ThemeProvider";
import { SITE } from "@/lib/constants/site";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  display: "swap",
});

const almarai = Almarai({
  subsets: ["arabic"],
  weight: ["300", "400", "700", "800"],
  variable: "--font-almarai",
  display: "swap",
});

const mitshuka = localFont({
  src: "./fonts/Mitshuka.otf",
  variable: "--font-mitshuka",
  display: "swap",
  weight: "400",
  style: "normal",
  adjustFontFallback: false,
});

export const metadata: Metadata = {
  title: `${SITE.fullName} — ${SITE.role}`,
  description: "End-to-end web. Shipped from React to the database.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`dark ${inter.variable} ${instrumentSerif.variable} ${almarai.variable} ${mitshuka.variable}`}>
      <body className="m-0 p-0 font-body antialiased bg-paper text-ink transition-colors">
        <ThemeProvider>
          <SmoothScroll />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
