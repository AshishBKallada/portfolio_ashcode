"use client";

import { SiteFooter } from "@/components/layout/SiteFooter";
import { useInTrack } from "@/components/motion/HorizontalTrack";

/**
 * The close of the home page: the minimal footer, full width. On the sideways row the
 * footer sits along the foot of the contact screen instead (ListTransition), so contact
 * and footer share one screen; nothing renders here.
 */
export function ClosingEdition() {
  if (useInTrack()) return null;
  return <SiteFooter />;
}
