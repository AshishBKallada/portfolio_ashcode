/**
 * The hero sky's timelapse: every so often the clouds race across it, as if the film were
 * sped up, then settle back to their slow drift. Shared by the panorama's photographed sky
 * (HeroPanorama) and the cloud sprites over it (dragon/Atmosphere), so they race together.
 */

/** Seconds from one burst to the next, and how long each burst lasts. */
const EVERY_S = 12;
const BURST_S = 3.2;
/** How many times faster than the drift the clouds run at the burst's peak. */
const PEAK = 28;

/** How fast the clouds run at `now` (seconds), as a multiple of their drift: 1 between bursts. */
export function skyRate(now: number) {
  const into = (now % EVERY_S) - (EVERY_S - BURST_S);
  if (into <= 0) return 1;
  // Up and back down on a smooth hump, so a burst eases in and out.
  const k = Math.sin((into / BURST_S) * Math.PI);
  return 1 + (PEAK - 1) * k * k;
}
