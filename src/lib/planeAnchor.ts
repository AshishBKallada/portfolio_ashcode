/**
 * Where the hero's plane hangs things from: the point under its belly, in client pixels.
 * HeroPlane writes it every frame; FilmRibbon ties the LinkedIn film to it. Plain data, not
 * React state, like smokeField.
 */
export const planeAnchor = { x: 0, y: 0, ok: false };
