import { SiteFooter } from "@/components/layout/SiteFooter";
import { SignalNav } from "@/components/signal/SignalNav";
import { SectionLabel } from "@/components/signal/primitives";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="bg-background text-foreground">
      <SignalNav />
      <section className="flex min-h-[85dvh] flex-col items-center justify-center px-4 pt-24 text-center">
        <SectionLabel>[ 404 ]</SectionLabel>
        <h1 className="mt-6 font-headline text-[clamp(3.5rem,10vw,9rem)] leading-[0.9] tracking-[-0.045em] text-balance">
          Lost in the <span className="font-narrative tracking-[-0.04em]">clouds</span>
        </h1>
        <p className="mt-6 max-w-md font-narrative text-[clamp(1.15rem,1.6vw,1.4rem)] leading-[1.3] tracking-[-0.02em] text-pretty">
          That route doesn&rsquo;t exist. Head back home to see selected work.
        </p>
        <div className="mt-10">
          <Button href="/">Back home</Button>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
