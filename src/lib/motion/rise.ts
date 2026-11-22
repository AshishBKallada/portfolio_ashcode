/**
 * Scroll-linked rise for the LinkedIn triptych: a picture's vertical offset (svh) at a
 * given scroll progress, starting low and settling at its rest line. `lag` delays a picture
 * so the three move at their own speeds; it settles by the end of the run either way.
 */
export function riseAt(progress: number, from: number, to: number, lag = 0) {
  const t = Math.min(1, Math.max(0, (progress - lag) / (1 - lag)));
  // Ease out: fast as it enters, slow as it lands.
  const eased = 1 - (1 - t) ** 3;
  return from + (to - from) * eased;
}
