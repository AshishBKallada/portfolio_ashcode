import { Footer } from "@/components/layout/Footer";
import { Contact } from "@/components/sections/Contact";

export function ContactFooterPin() {
  return (
    <>
      <div className="theme-light relative z-20 bg-background">
        <Contact />
      </div>
      <Footer />
    </>
  );
}
