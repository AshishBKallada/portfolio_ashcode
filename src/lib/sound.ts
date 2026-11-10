/*
 * The site's sound switch, asked once on the boot screen (SiteLoader).
 *
 * `null` until the visitor answers, then on or off. Browsers only let audio
 * start inside a gesture, so `setSound(true)` is called from the click
 * itself: it creates and resumes the one shared AudioContext there, and tells
 * listeners synchronously, still inside that click, so the music player can
 * call play() and the hero's synthesized sound (lib/planeEngine) can build on
 * a running context.
 */

type Listener = (on: boolean) => void;

let state: boolean | null = null;
let ctx: AudioContext | null = null;
const listeners = new Set<Listener>();

export function getSound() {
  return state;
}

/** The shared AudioContext, once sound is on; null before. */
export function audioContext() {
  return ctx;
}

export function setSound(on: boolean) {
  state = on;
  if (on) {
    ctx ??= new AudioContext();
    if (ctx.state === "suspended") void ctx.resume();
  }
  for (const l of listeners) l(on);
}

/** Calls `fn` on every change. Returns an unsubscribe. */
export function onSound(fn: Listener) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}
