import { SITE } from "./site";

export const LOADER = {
  labels: [SITE.brand, SITE.brandJp] as const,
  cycles: 3,
  stepDuration: 0.9,
} as const;
