/**
 * Where the biplane's smoke is on screen, for anything that wants to react to it (the hero
 * card's letters blow apart as it passes). HeroPlane writes it every frame; readers only read.
 * Each puff is x, y and radius in CSS pixels, relative to the viewport.
 */
export const SMOKE_FIELD_MAX = 160;

export const smokeField = {
  /** x, y, r for each puff, packed. */
  puffs: new Float32Array(SMOKE_FIELD_MAX * 3),
  count: 0,
};
