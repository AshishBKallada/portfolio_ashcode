# AshCode — portfolio

Personal portfolio built with Next.js 16 (App Router, Turbopack), React 19,
Tailwind CSS v4, Motion, GSAP + ScrollTrigger and Lenis. Every route is
statically prerendered.

## Scripts

```bash
pnpm dev        # local dev server
pnpm build      # production build
pnpm start      # serve the production build
pnpm lint       # ESLint (next/core-web-vitals + typescript)
pnpm typecheck  # tsc --noEmit
```

## Structure

```
src/
  app/                    Routes and route-level files only
    layout.tsx            Root layout: fonts, metadata, JSON-LD, providers
    page.tsx              Home (hero → projects → contact)
    projects/[slug]/      Case-study pages (SSG via generateStaticParams)
    resume/               Printable résumé
    opengraph-image.tsx   Default social card (built at build time)
    robots.ts, sitemap.ts, icon.png, apple-icon.png, not-found.tsx
    fonts/                Local woff2 files for next/font/local
    globals.css           Tailwind entry, theme tokens (brand colours), base styles
  components/
    layout/               Site chrome: navbar, footer, loader, back-to-top
    motion/               Reusable animation primitives and providers
    sections/             Home page sections; hero/, about/, contact/ hold their parts
    resume/               Résumé-only client pieces
    ui/                   Buttons and shared styles
  data/                   Content: site copy, projects, résumé
  lib/                    Non-UI modules: hero timeline + art, motion easing, image helpers
public/images/            Static art (served through next/image optimisation)
design/                   Design references; not part of the build
```

Conventions:

- Server Components by default; `"use client"` only where a component needs
  state, effects or browser APIs.
- Brand colours are Tailwind theme tokens (`bg-brand`, `text-cream`,
  `text-flame`, `bg-paper`) defined once in `globals.css`.
- Images go through `next/image`. Art drawn outside `<Image>` (canvas,
  `motion.img`, loader preloads) uses `optimizedSrc()` from `src/lib/images.ts`
  so it is still served as AVIF/WebP from one cached URL.
- Content changes belong in `src/data/`.
