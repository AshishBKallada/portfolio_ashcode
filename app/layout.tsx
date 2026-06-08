import type { Metadata } from "next";
import localFont from "next/font/local";
import { Cormorant_Garamond, Dancing_Script } from "next/font/google";
import "./globals.css";

const chaneyUltraExtended = localFont({
  src: "./fonts/chaney-ultraextended.woff2",
  variable: "--font-chaney",
  display: "swap",
});

const safiroMedium = localFont({
  src: "./fonts/safiro-medium.woff2",
  variable: "--font-safiro",
  display: "swap",
});

const dancingScript = Dancing_Script({
  variable: "--font-dancing",
  subsets: ["latin"],
  display: "swap",
});

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["italic", "normal"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ashu-Kodo",
  description: "Ashu-Kodo is a portfolio website for Ashu Kodo, a software engineer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://cdn.jsdelivr.net/npm/remixicon@4.7.0/fonts/remixicon.css"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${chaneyUltraExtended.variable} ${safiroMedium.variable} ${dancingScript.variable} ${cormorantGaramond.variable} bg-transparent text-white antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
