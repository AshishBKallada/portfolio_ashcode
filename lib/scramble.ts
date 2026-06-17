const DEFAULT_CHARS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!<>-_\\/[]{}=+*^?#";

type ScrambleOpts = {
  duration?: number;
  chars?: string;
  onComplete?: () => void;
};

export function scrambleText(
  el: HTMLElement,
  finalText: string,
  opts: ScrambleOpts = {}
): () => void {
  const duration = opts.duration ?? 700;
  const chars = opts.chars ?? DEFAULT_CHARS;
  const start = performance.now();
  const total = finalText.length;
  let raf = 0;
  let cancelled = false;

  const tick = (now: number) => {
    if (cancelled) return;
    const t = Math.min(1, (now - start) / duration);
    let out = "";
    for (let i = 0; i < total; i++) {
      const c = finalText[i];
      if (c === " " || c === "\n") {
        out += c;
        continue;
      }
      const lockAt = i / total;
      if (t >= lockAt + 0.15 || t >= 1) {
        out += c;
      } else {
        out += chars[(Math.random() * chars.length) | 0];
      }
    }
    el.textContent = out;
    if (t < 1) {
      raf = requestAnimationFrame(tick);
    } else {
      el.textContent = finalText;
      opts.onComplete?.();
    }
  };
  raf = requestAnimationFrame(tick);

  return () => {
    cancelled = true;
    cancelAnimationFrame(raf);
    el.textContent = finalText;
  };
}
