export type TypewriterOptions = {
  words: string[];
  typingSpeedMs: number;
  backspaceSpeedMs: number;
  pauseMs: number;
};

export function startTypewriter(el: HTMLElement, opts: TypewriterOptions) {
  const words = opts.words.filter(Boolean);
  if (words.length === 0) {
    el.textContent = "";
    return () => {};
  }

  let wordIdx = 0;
  let charIdx = 0;
  let direction: "typing" | "backspacing" = "typing";
  let timer: number | undefined;
  let stopped = false;

  const tick = () => {
    if (stopped) return;

    const word = words[wordIdx] ?? words[0];

    if (direction === "typing") {
      charIdx += 1;
      el.textContent = word.slice(0, charIdx);

      if (charIdx >= word.length) {
        direction = "backspacing";
        timer = window.setTimeout(tick, opts.pauseMs);
        return;
      }

      timer = window.setTimeout(tick, opts.typingSpeedMs);
      return;
    }

    // backspacing
    charIdx -= 1;
    el.textContent = word.slice(0, Math.max(0, charIdx));

    if (charIdx <= 0) {
      direction = "typing";
      wordIdx = (wordIdx + 1) % words.length;
      timer = window.setTimeout(tick, Math.max(200, opts.pauseMs * 0.4));
      return;
    }

    timer = window.setTimeout(tick, opts.backspaceSpeedMs);
  };

  tick();

  return () => {
    stopped = true;
    if (timer) window.clearTimeout(timer);
  };
}
