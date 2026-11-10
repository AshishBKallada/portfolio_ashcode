/*
 * The hero's sound, synthesized in Web Audio: no recording to license or fetch.
 *
 * The biplane: a vintage radial engine. Two detuned sawtooths under a low-pass
 * make the engine note, a 22 Hz tremolo is the propeller beat, and brown
 * noise through a band-pass is the wind and exhaust rasp. When it sputters
 * (the black smoke) the note sags and drops out in coughs, the rasp thickens,
 * and now and then it backfires.
 *
 * The desert under it: wind, brown noise through a low-pass whose level,
 * cutoff and side wander in gusts, and blown sand, a high hiss with sparse
 * grain ticks, that lifts with each gust.
 *
 * It plays only if the visitor turned sound on at the boot screen (lib/sound):
 * `arm()` builds the graph on the shared AudioContext that click started, at
 * once if sound is already on, or the moment it's turned on. Each frame the plane sets
 * how loud (its distance), how high (doppler), where (pan) and how sick
 * (sputter) it is; `setWind` sets the desert's level.
 */

import { audioContext, getSound, onSound } from "./sound";

export type PlaneEngine = {
  /** Build once sound is on (now, or when it's turned on). Returns a cleanup. */
  arm: () => () => void;
  /**
   * Per-frame: level 0..1, pitch as a multiplier of the idle note, pan −1..1, sputter 0..1
   * (0 runs clean, 1 coughs and backfires).
   */
  set: (level: number, pitch: number, pan: number, sputter?: number) => void;
  /** The desert's wind and sand, 0..1. */
  setWind: (level: number) => void;
  dispose: () => void;
};

const BASE_HZ = 58;
const PROP_HZ = 22;
/** Ceilings, well under the music. */
const ENGINE_MAX = 0.42;
const WIND_MAX = 0.11;

const clamp = (x: number, a: number, b: number) => Math.min(b, Math.max(a, x));

/** A looping buffer of noise: brown (a slow random walk) or white. */
function noiseBuffer(ctx: AudioContext, seconds: number, kind: "brown" | "white" | "grains") {
  const len = Math.floor(ctx.sampleRate * seconds);
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const data = buf.getChannelData(0);
  let last = 0;
  for (let i = 0; i < len; i++) {
    const white = Math.random() * 2 - 1;
    if (kind === "brown") {
      last = (last + 0.02 * white) / 1.02;
      data[i] = last * 3.5;
    } else if (kind === "white") {
      data[i] = white;
    } else {
      // Sand grains: silence with sparse ticks, each a short decaying click.
      data[i] = Math.random() < 0.0012 ? white : data[i - 1] ? data[i - 1] * 0.55 : 0;
    }
  }
  return buf;
}

export function createPlaneEngine(): PlaneEngine {
  let ctx: AudioContext | null = null;
  /** Everything this engine plays goes out through here, so dispose can cut it from the shared context. */
  let out: GainNode | null = null;
  const sources: AudioScheduledSourceNode[] = [];
  let master: GainNode | null = null;
  let cough: GainNode | null = null;
  let lp: BiquadFilterNode | null = null;
  let oscA: OscillatorNode | null = null;
  let oscB: OscillatorNode | null = null;
  let lfo: OscillatorNode | null = null;
  let panner: StereoPannerNode | null = null;
  let noiseFilter: BiquadFilterNode | null = null;
  let noiseGain: GainNode | null = null;
  let popBuf: AudioBuffer | null = null;
  let wind: GainNode | null = null;
  let gusts: ReturnType<typeof setInterval> | null = null;
  let armedOff: (() => void) | null = null;
  let windLevel = 0;
  let lastCough = 0;

  const build = () => {
    if (ctx) return;
    ctx = audioContext();
    if (!ctx) return;
    const t = ctx.currentTime;
    out = ctx.createGain();
    out.connect(ctx.destination);

    master = ctx.createGain();
    master.gain.setValueAtTime(0, t);
    panner = ctx.createStereoPanner();
    master.connect(panner).connect(out);
    // Coughs: the engine dropping out for a beat while it sputters.
    cough = ctx.createGain();
    cough.gain.setValueAtTime(1, t);
    cough.connect(master);

    // Engine note: two saws a fifth apart, slightly detuned, dulled by a low-pass. The low-pass
    // is left open enough for the harmonics to carry: laptop speakers drop the 58 Hz fundamental.
    lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.setValueAtTime(900, t);
    lp.Q.setValueAtTime(0.8, t);
    oscA = ctx.createOscillator();
    oscA.type = "sawtooth";
    oscA.frequency.setValueAtTime(BASE_HZ, t);
    oscB = ctx.createOscillator();
    oscB.type = "sawtooth";
    oscB.frequency.setValueAtTime(BASE_HZ * 1.5 + 1.3, t);
    const engineGain = ctx.createGain();
    engineGain.gain.setValueAtTime(0.5, t);
    oscA.connect(lp);
    oscB.connect(lp);
    lp.connect(engineGain);

    // Propeller beat: a tremolo on the engine, from an LFO into the gain.
    const trem = ctx.createGain();
    trem.gain.setValueAtTime(0.6, t);
    lfo = ctx.createOscillator();
    lfo.type = "sine";
    lfo.frequency.setValueAtTime(PROP_HZ, t);
    const lfoDepth = ctx.createGain();
    lfoDepth.gain.setValueAtTime(0.4, t);
    lfo.connect(lfoDepth).connect(trem.gain);
    engineGain.connect(trem).connect(cough);

    // Wind and exhaust: brown noise, band-passed, under the note.
    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer(ctx, 2, "brown");
    noise.loop = true;
    noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = "bandpass";
    noiseFilter.frequency.setValueAtTime(380, t);
    noiseFilter.Q.setValueAtTime(0.7, t);
    noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.35, t);
    noise.connect(noiseFilter).connect(noiseGain).connect(master);
    popBuf = noiseBuffer(ctx, 0.3, "white");

    // The desert: its own bus, straight out, not panned with the plane.
    wind = ctx.createGain();
    wind.gain.setValueAtTime(0, t);
    wind.connect(out);
    const windPan = ctx.createStereoPanner();
    windPan.connect(wind);

    // Wind: brown noise under a low-pass that opens with each gust.
    const air = ctx.createBufferSource();
    air.buffer = noiseBuffer(ctx, 4, "brown");
    air.loop = true;
    const airFilter = ctx.createBiquadFilter();
    airFilter.type = "lowpass";
    airFilter.frequency.setValueAtTime(420, t);
    airFilter.Q.setValueAtTime(1.6, t);
    const airGain = ctx.createGain();
    airGain.gain.setValueAtTime(0.6, t);
    air.connect(airFilter).connect(airGain).connect(windPan);

    // Sand: a high hiss and sparse grain ticks, both lifted by the gusts.
    const hiss = ctx.createBufferSource();
    hiss.buffer = noiseBuffer(ctx, 3, "white");
    hiss.loop = true;
    const hissFilter = ctx.createBiquadFilter();
    hissFilter.type = "bandpass";
    hissFilter.frequency.setValueAtTime(6200, t);
    hissFilter.Q.setValueAtTime(0.6, t);
    const grains = ctx.createBufferSource();
    grains.buffer = noiseBuffer(ctx, 5, "grains");
    grains.loop = true;
    const grainFilter = ctx.createBiquadFilter();
    grainFilter.type = "highpass";
    grainFilter.frequency.setValueAtTime(2800, t);
    const sandGain = ctx.createGain();
    sandGain.gain.setValueAtTime(0.05, t);
    const hissGain = ctx.createGain();
    hissGain.gain.setValueAtTime(0.18, t);
    hiss.connect(hissFilter).connect(hissGain).connect(sandGain);
    grains.connect(grainFilter).connect(sandGain);
    sandGain.connect(windPan);

    // Gusts: every second or so, a new target for the wind's strength, brightness and side;
    // sand only lifts once the wind is up.
    const gust = () => {
      if (!ctx) return;
      const now = ctx.currentTime;
      const g = 0.25 + Math.random() ** 1.5 * 0.75;
      const ease = 0.5 + Math.random() * 1.2;
      airGain.gain.setTargetAtTime(0.35 + g * 0.65, now, ease);
      airFilter.frequency.setTargetAtTime(260 + g * 900, now, ease);
      sandGain.gain.setTargetAtTime(0.02 + g ** 2 * 0.55, now, ease * 0.8);
      windPan.pan.setTargetAtTime((Math.random() * 2 - 1) * 0.5, now, 2);
    };
    gust();
    gusts = setInterval(gust, 1100);

    sources.push(oscA, oscB, lfo, noise, air, hiss, grains);
    for (const src of sources) src.start();
    setWind(windLevel);
  };

  /** A backfire: a short low thump of noise through the engine's bus. */
  const pop = () => {
    if (!ctx || !master || !popBuf) return;
    const t = ctx.currentTime;
    const src = ctx.createBufferSource();
    src.buffer = popBuf;
    const f = ctx.createBiquadFilter();
    f.type = "lowpass";
    f.frequency.setValueAtTime(260 + Math.random() * 200, t);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(1.6, t + 0.006);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.12 + Math.random() * 0.08);
    src.connect(f).connect(g).connect(master);
    src.start(t);
    src.stop(t + 0.3);
  };

  const arm = () => {
    if (getSound()) build();
    // Off: build() finds no context and does nothing; turned off later, it fades out.
    const off = onSound((on) => {
      build();
      if (ctx && out) out.gain.setTargetAtTime(on ? 1 : 0, ctx.currentTime, 0.2);
    });
    armedOff = off;
    return off;
  };

  const set = (level: number, pitch: number, pan: number, sputter = 0) => {
    if (!ctx || !master || !cough || !lp || !oscA || !oscB || !lfo || !panner || !noiseFilter || !noiseGain) return;
    const t = ctx.currentTime;
    const s = clamp(sputter, 0, 1);
    // Sputtering: the note sags and wobbles, chokes (the low-pass closes), and the rasp thickens.
    const p = pitch * (1 - 0.14 * s + (Math.random() - 0.5) * 0.08 * s);
    // Smoothed, so a frame's jump never clicks.
    master.gain.setTargetAtTime(clamp(level, 0, 1) * ENGINE_MAX, t, 0.08);
    oscA.frequency.setTargetAtTime(BASE_HZ * p, t, 0.1);
    oscB.frequency.setTargetAtTime((BASE_HZ * 1.5 + 1.3) * p, t, 0.1);
    lfo.frequency.setTargetAtTime(PROP_HZ * p, t, 0.1);
    lp.frequency.setTargetAtTime(900 - 450 * s, t, 0.1);
    noiseFilter.frequency.setTargetAtTime(380 * p * (1 - 0.3 * s), t, 0.1);
    noiseGain.gain.setTargetAtTime(0.35 + 0.55 * s, t, 0.1);
    panner.pan.setTargetAtTime(clamp(pan, -1, 1), t, 0.1);
    // Coughs: every so often the engine drops out for a beat, then catches; a backfire with some.
    if (s > 0.05 && t - lastCough > 0.09) {
      lastCough = t;
      const out = Math.random() < 0.45 * s;
      cough.gain.setTargetAtTime(out ? 0.12 : 1 - 0.25 * s * Math.random(), t, 0.025);
      if (out && Math.random() < 0.5) pop();
    } else if (s <= 0.05) {
      cough.gain.setTargetAtTime(1, t, 0.05);
    }
  };

  const setWind = (level: number) => {
    windLevel = clamp(level, 0, 1);
    if (!ctx || !wind) return;
    // Slow, so the desert swells in and out rather than switching.
    wind.gain.setTargetAtTime(windLevel * WIND_MAX, ctx.currentTime, 1.2);
  };

  const dispose = () => {
    armedOff?.();
    if (gusts) clearInterval(gusts);
    gusts = null;
    // The context is shared: stop and unplug this engine's part of it, don't close it.
    for (const src of sources) src.stop();
    sources.length = 0;
    out?.disconnect();
    out = null;
    ctx = null;
  };

  return { arm, set, setWind, dispose };
}
