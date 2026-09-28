// Screen rect of the loader's character at the moment the loader dismisses.
// HeroOverlay reads it once to fly its figure from there into place, so the
// loader image and the hero figure read as one continuous element.
let rect: DOMRect | null = null;

export function setHeroHandoff(next: DOMRect) {
  rect = next;
}

export function peekHeroHandoff() {
  return rect;
}

export function takeHeroHandoff() {
  const current = rect;
  rect = null;
  return current;
}
