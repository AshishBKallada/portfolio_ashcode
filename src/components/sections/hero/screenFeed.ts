/**
 * Drives the About gallery while it plays on the hero laptop's screen. The
 * embedded gallery registers here; the hero's scroll engine reads its slide
 * distance and sets its progress, since its own scroll pin can't run inside
 * the hero's sticky stage.
 */
export const aboutGallery: {
  /** Sideways travel of the gallery track, in px of the stage. */
  distance?: () => number;
  /** Slide the gallery to `progress` (0 → first photo, 1 → last). */
  set?: (progress: number) => void;
} = {};
