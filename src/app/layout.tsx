import type { Metadata, Viewport } from "next";
import { Anton, Pinyon_Script } from "next/font/google";
import localFont from "next/font/local";
import { Header } from "@/components/layout/Header";
import { SiteLoader } from "@/components/layout/SiteLoader";
import { HeroIntroProvider } from "@/components/motion/HeroIntroProvider";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { site } from "@/data/site";
import "./globals.css";

const generalSans = localFont({
  src: [
    {
      path: "./fonts/GeneralSans-Variable.woff2",
      style: "normal",
    },
    {
      path: "./fonts/GeneralSans-VariableItalic.woff2",
      style: "italic",
    },
  ],
  variable: "--font-general-sans",
  display: "swap",
  weight: "200 700",
});

const editorial = localFont({
  src: [
    {
      path: "./fonts/PPEditorialNew-Ultralight.woff2",
      weight: "200",
      style: "normal",
    },
    {
      path: "./fonts/PPEditorialNew-UltralightItalic.woff2",
      weight: "200",
      style: "italic",
    },
  ],
  variable: "--font-editorial",
  display: "swap",
});

const inter = localFont({
  src: "./fonts/Inter-Variable.woff2",
  variable: "--font-inter-face",
  display: "swap",
  weight: "100 900",
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

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.name,
    template: `%s — ${site.name}`,
  },
  description: site.tagline,
  alternates: {
    canonical: "/",
  },
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
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
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
      className={`${generalSans.variable} ${editorial.variable} ${inter.variable} ${anton.variable} ${pinyon.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-md focus:bg-foreground focus:px-3 focus:py-2 focus:text-sm focus:font-medium focus:text-background"
        >
          Skip to content
        </a>
        <HeroIntroProvider>
          <SiteLoader />
          <MotionProvider>
            <SmoothScroll>
              <div className="relative z-[2]">
                <Header />
                <main id="main" className="flex-1">
                  {children}
                </main>
              </div>
            </SmoothScroll>
          </MotionProvider>
        </HeroIntroProvider>
      </body>
    </html>
  );
}
