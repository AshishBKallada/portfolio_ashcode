import type { Metadata } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
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
    <html
      lang="en"
      suppressHydrationWarning
      className={`dark ${inter.variable} ${instrumentSerif.variable} ${mitshuka.variable}`}
    >
      <head>
        {/* Yuji Mai — brush-script JP font, the per-character fallback for
            Mitshuka so kanji in the hero headline render with a matching
            hand-drawn feel. Loaded by link tag (rather than next/font/google)
            so the full Japanese subset ships with the CSS. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Yuji+Mai&display=swap"
        />
      </head>
      <body className="m-0 p-0 font-body antialiased bg-paper text-ink transition-colors">
        <ThemeProvider>
          <SmoothScroll />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
