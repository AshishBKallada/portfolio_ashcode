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
        <h1 className="mt-6 font-serif text-[clamp(3.5rem,10vw,9rem)] leading-[0.9] tracking-[-0.035em] text-balance">
          Lost in the <em className="font-script text-[1.05em] text-cream not-italic">clouds</em>
        </h1>
        <p className="mt-6 max-w-md text-[clamp(1.05rem,1.5vw,1.25rem)] leading-[1.45] text-pretty">
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
