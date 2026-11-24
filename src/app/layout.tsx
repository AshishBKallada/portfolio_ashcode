import type { Metadata, Viewport } from "next";
import { Inter_Tight } from "next/font/google";
import { SmoothScroll } from "@/components/sheet/SmoothScroll";
import { site } from "@/data/site";
import "./globals.css";

// One grotesk for everything, the way a printed portfolio would set it.
const grotesk = Inter_Tight({
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
  variable: "--font-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.signal.fullName} — Developer portfolio`,
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
  colorScheme: "dark",
  themeColor: "#1b1b1b",
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
    <html lang="en" className={grotesk.variable} suppressHydrationWarning>
      <body>
        {/* Structured data as a plain script tag, as the Next.js docs recommend for JSON-LD. */}
        <script
          id="person-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c"),
          }}
        />
        <a href="#main" className="sh-skip">
          Skip to content
        </a>
        <SmoothScroll>
          <main id="main">{children}</main>
        </SmoothScroll>
      </body>
    </html>
  );
}
