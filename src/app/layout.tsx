import type { Metadata, Viewport } from "next";
import { pageModeScript } from "@/theme/mode";
import { Anton, Geist_Mono, Pinyon_Script } from "next/font/google";
import localFont from "next/font/local";
import { SiteLoader } from "@/components/layout/SiteLoader";
import { HeroIntroProvider } from "@/components/motion/HeroIntroProvider";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { site } from "@/data/site";
import "./globals.css";

const generalSans = localFont({
  src: [
    { path: "./fonts/GeneralSans-Variable.woff2", style: "normal" },
    { path: "./fonts/GeneralSans-VariableItalic.woff2", style: "italic" },
  ],
  variable: "--font-general-sans",
  display: "swap",
  weight: "200 700",
});

const editorial = localFont({
  src: [
    { path: "./fonts/PPEditorialNew-Ultralight.woff2", weight: "200", style: "normal" },
    { path: "./fonts/PPEditorialNew-UltralightItalic.woff2", weight: "200", style: "italic" },
  ],
  variable: "--font-editorial",
  display: "swap",
});

const anton = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-anton",
  display: "swap",
});

const pinyon = Pinyon_Script({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-pinyon",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.name,
    template: `%s — ${site.name}`,
  },
  description: site.tagline,
  openGraph: {
    type: "website",
    siteName: site.name,
    title: site.name,
    description: site.tagline,
    url: site.url,
  },
  twitter: {
    card: "summary_large_image",
    title: site.name,
    description: site.tagline,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "light",
  themeColor: "#ec4726",
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  jobTitle: site.role,
  description: site.tagline,
  email: `mailto:${site.email}`,
  url: site.url,
  sameAs: site.socials.map((social) => social.href),
} as const;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${generalSans.variable} ${editorial.variable} ${anton.variable} ${pinyon.variable} ${geistMono.variable} h-full antialiased`}
      // The page-mode script may set data-theme before React hydrates.
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: pageModeScript }} />
      </head>
      <body className="min-h-full flex flex-col font-sans">
        <script
          type="application/ld+json"
          // Escape "<" so the JSON can never close the script tag early.
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c"),
          }}
        />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-md focus:bg-ink focus:px-3 focus:py-2 focus:text-sm focus:font-medium focus:text-bone"
        >
          Skip to content
        </a>
        <HeroIntroProvider>
          <SiteLoader />
          <MotionProvider>
            <SmoothScroll>
              <main id="main" className="relative flex-1">
                {children}
              </main>
            </SmoothScroll>
          </MotionProvider>
        </HeroIntroProvider>
      </body>
    </html>
  );
}
