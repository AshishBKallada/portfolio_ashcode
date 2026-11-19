import { D_BOOM, D_FIRE_C, D_FIRE_X, D_HIT } from "@/components/signal/dragon/duel";
import { audioContext, getSound } from "./sound";

/*
 * The dragons' duel, heard: all synthesized in Web Audio, no files. Plays only once the
 * visitor has turned sound on at the boot screen (lib/sound), on the shared AudioContext.
 *
 *  - a low hum rising as they close in, the pressure you feel before you see it; it cuts out
 *    dead at the impact, so the frozen beat is silent;
 *  - their two beams: a hissing, bright one for Mega X's blue fire, then a deep roar for the
 *    orange one's answer from the corner;
 *  - an air-vacuum suck pulling into the impact, a noise sweep rising fast and cut off;
 *  - the boom: a falling sub thump, a burst of low noise, and a metallic ring over it;
 *  - the blast wind, a whoosh sweeping from the clash out toward the courier on the right.
 *
 * The director calls `update` with the film's clock every frame; each sound starts as the
 * clock crosses its beat, timed on the audio clock from there. A jump of the clock (the
 * loop wrapping, a pinned frame) starts nothing.
 */

const HUM_AT = 9;
const SUCK_AT = D_HIT - 0.42;
const WHOOSH_AT = D_BOOM + 0.2;
const MASTER = 0.55;

type Duel = { update: (t: number) => void; setPaused: (paused: boolean) => void; dispose: () => void };

export function createDuelSound(): Duel {
  let ctx: AudioContext | null = null;
  let master: GainNode | null = null;
  let noise: AudioBuffer | null = null;
  let prev = -1;
  let paused = false;
  /** Everything started, so a pause or unmount can stop it. */
  const live = new Set<AudioScheduledSourceNode>();

  const ready = () => {
    if (getSound() !== true) return null;
    const c = audioContext();
    if (!c) return null;
    if (ctx !== c) {
      ctx = c;
      master = c.createGain();
      master.gain.value = paused ? 0 : MASTER;
      master.connect(c.destination);
      noise = c.createBuffer(1, c.sampleRate * 2, c.sampleRate);
      const d = noise.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    }
    return ctx;
  };

  const track = <T extends AudioScheduledSourceNode>(n: T, stop: number) => {
    live.add(n);
    n.onended = () => live.delete(n);
    n.stop(stop);
    return n;
  };
  const noiseSource = (c: AudioContext, at: number, stop: number) => {
    const s = c.createBufferSource();
    s.buffer = noise;
    s.loop = true;
    s.start(at, Math.random() * 1.5);
    return track(s, stop);
  };
  const osc = (c: AudioContext, type: OscillatorType, hz: number, at: number, stop: number) => {
    const o = c.createOscillator();
    o.type = type;
    o.frequency.setValueAtTime(hz, at);
    o.start(at);
    return track(o, stop);
  };
  const env = (c: AudioContext, out: AudioNode) => {
    const g = c.createGain();
    g.gain.value = 0;
    g.connect(out);
    return g;
  };

  /** The pressure: two detuned saws and a sub, swelling under a low-pass that opens as they near. */
  const hum = (c: AudioContext, now: number, until: number) => {
    const g = env(c, master!);
    const lp = c.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.setValueAtTime(110, now);
    lp.frequency.exponentialRampToValueAtTime(420, until);
    lp.Q.value = 4;
    lp.connect(g);
    const end = until + 0.05;
    for (const hz of [41, 41.7]) {
      const o = osc(c, "sawtooth", hz, now, end);
      o.frequency.exponentialRampToValueAtTime(hz * 1.5, until);
      o.connect(lp);
    }
    const sub = osc(c, "sine", 31, now, end);
    sub.frequency.exponentialRampToValueAtTime(52, until);
    sub.connect(g);
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(0.26, until - 0.05);
    // Dead silence on the impact.
    g.gain.setValueAtTime(0.26, until - 0.02);
    g.gain.linearRampToValueAtTime(0, until);
  };

  /** A breath of fire: filtered noise held for the length of the stream, panned to its side. */
  const roar = (c: AudioContext, now: number, length: number, blue: boolean) => {
    const g = env(c, master!);
    const pan = c.createStereoPanner();
    pan.pan.value = blue ? 0.35 : -0.45;
    pan.connect(g);
    const f1 = c.createBiquadFilter();
    f1.type = blue ? "highpass" : "lowpass";
    f1.frequency.value = blue ? 900 : 1400;
    const f2 = c.createBiquadFilter();
    f2.type = "bandpass";
    f2.frequency.value = blue ? 2600 : 520;
    f2.Q.value = 0.7;
    noiseSource(c, now, now + length + 0.5).connect(f1).connect(f2).connect(pan);
    // A rumble under the amber one's roar; a whistle in the blue one's.
    const tone = osc(c, blue ? "triangle" : "sawtooth", blue ? 1240 : 62, now, now + length + 0.5);
    const tg = c.createGain();
    tg.gain.value = blue ? 0.02 : 0.08;
    tone.connect(tg).connect(pan);
    const peak = blue ? 0.32 : 0.42;
    g.gain.setValueAtTime(0, now);
    g.gain.linearRampToValueAtTime(peak, now + 0.25);
    g.gain.setValueAtTime(peak, now + length - 0.1);
    g.gain.linearRampToValueAtTime(0, now + length + 0.35);
  };

  /** The vacuum: air sucked in, a band of noise and a tone sweeping up fast, then cut. */
  const suck = (c: AudioContext, now: number, until: number) => {
    const g = env(c, master!);
    const bp = c.createBiquadFilter();
    bp.type = "bandpass";
    bp.Q.value = 2.2;
    bp.frequency.setValueAtTime(260, now);
    bp.frequency.exponentialRampToValueAtTime(4200, until);
    bp.connect(g);
    noiseSource(c, now, until + 0.05).connect(bp);
    const o = osc(c, "sine", 110, now, until + 0.05);
    o.frequency.exponentialRampToValueAtTime(980, until);
    const og = c.createGain();
    og.gain.value = 0.25;
    o.connect(og).connect(g);
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(0.5, until - 0.01);
    g.gain.linearRampToValueAtTime(0, until);
  };

  /** The boom: a sub falling away, low noise, a soft clip for weight, and a metallic ring over it. */
  const boom = (c: AudioContext, now: number) => {
    const clip = c.createWaveShaper();
    const curve = new Float32Array(1024);
    for (let i = 0; i < curve.length; i++) {
      const x = (i / (curve.length - 1)) * 2 - 1;
      curve[i] = Math.tanh(x * 2.4);
    }
    clip.curve = curve;
    clip.connect(master!);

    const sub = osc(c, "sine", 78, now, now + 2.2);
    sub.frequency.exponentialRampToValueAtTime(26, now + 1.1);
    const sg = env(c, clip);
    sg.gain.setValueAtTime(0.95, now);
    sg.gain.exponentialRampToValueAtTime(0.001, now + 2);
    sub.connect(sg);

    const lp = c.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.setValueAtTime(1800, now);
    lp.frequency.exponentialRampToValueAtTime(160, now + 0.9);
    const ng = env(c, clip);
    ng.gain.setValueAtTime(0.75, now);
    ng.gain.exponentialRampToValueAtTime(0.001, now + 1.1);
    noiseSource(c, now, now + 1.2).connect(lp).connect(ng);

    // Inharmonic partials, as a struck plate rings.
    [523, 1187, 1873, 2711, 3592, 4410].forEach((hz, i) => {
      const o = osc(c, "sine", hz, now, now + 3);
      o.detune.value = (i % 2 ? 1 : -1) * 6;
      const g = env(c, master!);
      const decay = 2.6 - i * 0.3;
      g.gain.setValueAtTime(0.07 / Math.sqrt(i + 1), now);
      g.gain.exponentialRampToValueAtTime(0.0005, now + decay);
      o.connect(g);
    });
  };

  /** The blast wind passing the courier: noise swept up and down, panned from the clash out to the right. */
  const whoosh = (c: AudioContext, now: number) => {
    const g = env(c, master!);
    const pan = c.createStereoPanner();
    pan.pan.setValueAtTime(-0.4, now);
    pan.pan.linearRampToValueAtTime(0.7, now + 1.3);
    pan.connect(g);
    const bp = c.createBiquadFilter();
    bp.type = "bandpass";
    bp.Q.value = 0.8;
    bp.frequency.setValueAtTime(380, now);
    bp.frequency.exponentialRampToValueAtTime(1700, now + 0.35);
    bp.frequency.exponentialRampToValueAtTime(420, now + 1.6);
    bp.connect(pan);
    noiseSource(c, now, now + 2).connect(bp);
    g.gain.setValueAtTime(0, now);
    g.gain.linearRampToValueAtTime(0.5, now + 0.3);
    g.gain.exponentialRampToValueAtTime(0.001, now + 1.8);
  };

  const crossed = (at: number, t: number) => prev >= 0 && t - prev > 0 && t - prev < 0.5 && prev < at && t >= at;

  return {
    update(t) {
      if (!paused && (crossed(HUM_AT, t) || crossed(D_FIRE_X[0], t) || crossed(D_FIRE_C[0], t) || crossed(SUCK_AT, t) || crossed(D_BOOM, t) || crossed(WHOOSH_AT, t))) {
        const c = ready();
        if (c && master) {
          // Beats this frame crossed, each started on the audio clock where it falls.
          const at = (beat: number) => c.currentTime + Math.max(0, beat - t);
          if (crossed(HUM_AT, t)) hum(c, at(HUM_AT), at(D_HIT));
          if (crossed(D_FIRE_X[0], t)) roar(c, at(D_FIRE_X[0]), D_FIRE_X[1] - D_FIRE_X[0], true);
          if (crossed(D_FIRE_C[0], t)) roar(c, at(D_FIRE_C[0]), D_FIRE_C[1] - D_FIRE_C[0], false);
          if (crossed(SUCK_AT, t)) suck(c, at(SUCK_AT), at(D_HIT));
          if (crossed(D_BOOM, t)) boom(c, at(D_BOOM));
          if (crossed(WHOOSH_AT, t)) whoosh(c, at(WHOOSH_AT));
        }
      }
      prev = t;
    },
    setPaused(p) {
      paused = p;
      if (p) {
        // Covered: stop whatever is playing; the next pass starts clean.
        for (const n of live) {
          try {
            n.stop();
          } catch {
            /* already stopped */
          }
        }
        live.clear();
        prev = -1;
      }
      if (ctx && master) master.gain.setTargetAtTime(p ? 0 : MASTER, ctx.currentTime, 0.05);
    },
    dispose() {
      this.setPaused(true);
      master?.disconnect();
    },
  };
}
