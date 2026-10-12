import { SiteFooter } from "@/components/layout/SiteFooter";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="bg-brand text-cream">
      <section className="flex min-h-[80svh] flex-col items-center justify-center px-4 text-center">
        <p className="font-display text-[clamp(7rem,28vw,22rem)] leading-[0.8] uppercase">
          404
        </p>
        <h1 className="mt-6 text-[clamp(1.75rem,4vw,3rem)] leading-[1.05]">
          This page went <em className="font-script not-italic">missing</em>.
        </h1>
        <p className="mt-4 max-w-md text-[15px] leading-relaxed text-cream/75">
          That route doesn&rsquo;t exist. Head back home to see selected work.
        </p>
        <div className="mt-10">
          <Button href="/">Back home ↗</Button>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
