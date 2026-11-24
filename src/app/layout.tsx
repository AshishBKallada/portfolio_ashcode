import type { Metadata, Viewport } from "next";
import { SmoothScroll } from "@/components/kinetic/SmoothScroll";
import { site } from "@/data/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.signal.fullName}, full-stack developer`,
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
  themeColor: "#f4f4f1",
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.signal.fullName,
  alternateName: site.name,
  jobTitle: site.role,
  description: site.tagline,
  email: `mailto:${site.email}`,
  url: site.url,
  sameAs: site.socials.map((social) => social.href),
} as const;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Panchang for the display lines, Switzer for everything else (Fontshare). */}
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link rel="preconnect" href="https://cdn.fontshare.com" crossOrigin="" />
        <link rel="stylesheet" href="https://api.fontshare.com/v2/css?f[]=panchang@700&display=swap" />
        <link rel="stylesheet" href="https://api.fontshare.com/v2/css?f[]=switzer@400,500&display=swap" />
      </head>
      <body>
        {/* Structured data as a plain script tag, as the Next.js docs recommend for JSON-LD. */}
        <script
          id="person-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c"),
          }}
        />
        <a href="#main" className="kx-skip">
          Skip to content
        </a>
        <SmoothScroll>
          <main id="main">{children}</main>
        </SmoothScroll>
      </body>
    </html>
  );
}
