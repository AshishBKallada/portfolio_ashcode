import type { Metadata } from "next";
import { About } from "@/components/kinetic/About";
import { Contact } from "@/components/kinetic/Contact";
import { Cursor } from "@/components/kinetic/Cursor";
import { Footer } from "@/components/kinetic/Footer";
import { Hero } from "@/components/kinetic/Hero";
import { LinkedIn } from "@/components/kinetic/LinkedIn";
import { Stub } from "@/components/kinetic/Stub";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <LinkedIn />
      <Contact />
      <Footer />
      <Stub />
      <Cursor />
    </>
  );
}
