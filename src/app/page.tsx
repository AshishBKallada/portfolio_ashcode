import type { Metadata } from "next";
import { AboutSheet } from "@/components/sheet/AboutSheet";
import { Colophon } from "@/components/sheet/Colophon";
import { ContactSheet } from "@/components/sheet/ContactSheet";
import { Cover } from "@/components/sheet/Cover";
import { LinkedInSheet } from "@/components/sheet/LinkedInSheet";
import { RedDot } from "@/components/sheet/RedDot";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <>
      <Cover />
      <AboutSheet />
      <LinkedInSheet />
      <ContactSheet />
      <Colophon />
      <RedDot />
    </>
  );
}
