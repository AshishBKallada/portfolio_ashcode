/** Where the first work hangs along the corridor and the spacing between works (m). */
export const HANG = { first: 6, every: 3.4 };
/** How far before a work the camera stands to look at it (m). */
export const VIEW_BACK = 3.2;

/** How far along the corridor work `i` hangs (m). */
export const pieceAt = (i: number) => HANG.first + i * HANG.every;

/** Where the camera stands to look at work `i` (m along). */
export const viewFor = (i: number) => Math.max(0, pieceAt(i) - VIEW_BACK);

/** The work the camera is looking at from `along` metres down the corridor. */
export function pieceInView(along: number, count: number) {
  const i = Math.round((along + VIEW_BACK - HANG.first) / HANG.every);
  return Math.min(count - 1, Math.max(0, i));
}
