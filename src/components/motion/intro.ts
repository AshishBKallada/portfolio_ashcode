export const introEase = [0.22, 1, 0.36, 1] as const;

export const intro = {
  textDuration: 0.65,
  textStagger: 0.14,
  textDelay: 0.08,
  imageDuration: 0.95,
  footerDuration: 0.7,
} as const;

export const introImageDelay = intro.textDelay + intro.textStagger * 3;
export const introFooterDelay = introImageDelay + intro.imageDuration * 0.55;
