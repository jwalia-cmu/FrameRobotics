export type VideoManifest = { videos: string[] };

export type VideoBackgroundOptions = {
  videoA: HTMLVideoElement;
  videoB: HTMLVideoElement;
  manifestUrl: string;
  swapEveryMs: number;
  fadeMs: number;
  statusEl?: HTMLElement | null;
};

async function fetchManifest(url: string): Promise<VideoManifest> {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to load ${url}: ${res.status}`);

  const json = (await res.json()) as unknown;
  if (!json || typeof json !== "object") throw new Error("Invalid video manifest.");

  const rawVideos = (json as { videos?: unknown }).videos;
  if (!Array.isArray(rawVideos)) throw new Error("Invalid video manifest.");

  const videos = rawVideos
    .filter((v): v is string => typeof v === "string")
    .map((v) => v.trim())
    .filter(Boolean);

  return { videos };
}

function playSafe(video: HTMLVideoElement) {
  const p = video.play();
  if (p && typeof (p as Promise<void>).catch === "function") {
    (p as Promise<void>).catch(() => {
      // Autoplay can be blocked in some environments; muted + playsInline usually works.
    });
  }
}

function setActive(video: HTMLVideoElement, active: boolean) {
  video.classList.toggle("is-active", active);
}

export async function initVideoBackground(opts: VideoBackgroundOptions) {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) return () => {};

  let manifest: VideoManifest;
  try {
    manifest = await fetchManifest(opts.manifestUrl);
  } catch (e) {
    if (opts.statusEl) {
      opts.statusEl.textContent = "Add videos to public/videos and run npm run videos:scan.";
    }
    return () => {};
  }

  const playlist = manifest.videos;
  if (playlist.length === 0) {
    if (opts.statusEl) {
      opts.statusEl.textContent = "Add videos to public/videos and run npm run videos:scan.";
    }
    return () => {};
  }

  if (opts.statusEl) {
    opts.statusEl.textContent = `Playing ${playlist.length} background clip${playlist.length === 1 ? "" : "s"}.`;
  }

  const vids = [opts.videoA, opts.videoB];

  // Ensure attributes for mobile autoplay.
  vids.forEach((v) => {
    v.muted = true;
    v.playsInline = true;
    v.setAttribute("playsinline", "");
    v.preload = "metadata";
  });

  let active = 0;
  let idx = 0;
  let timer: number | undefined;
  let stopped = false;

  const load = (video: HTMLVideoElement, src: string) => {
    video.src = src;
    video.load();
  };

  const schedule = () => {
    if (stopped) return;
    if (timer) window.clearTimeout(timer);
    timer = window.setTimeout(() => swap(), opts.swapEveryMs);
  };

  const swap = () => {
    if (stopped) return;

    const next = 1 - active;
    const nextIdx = (idx + 1) % playlist.length;

    const current = vids[active];
    const incoming = vids[next];

    load(incoming, playlist[nextIdx]!);

    const onReady = () => {
      incoming.currentTime = 0;
      playSafe(incoming);

      setActive(incoming, true);
      setActive(current, false);

      window.setTimeout(() => current.pause(), Math.max(250, opts.fadeMs));

      active = next;
      idx = nextIdx;
      schedule();
    };

    incoming.addEventListener("canplay", onReady, { once: true });
  };

  // Start.
  load(vids[0], playlist[0]!);
  setActive(vids[0], true);
  setActive(vids[1], false);

  vids[0].addEventListener(
    "canplay",
    () => {
      playSafe(vids[0]);
      schedule();
    },
    { once: true }
  );

  const onVis = () => {
    if (document.hidden) {
      if (timer) window.clearTimeout(timer);
      vids.forEach((v) => v.pause());
      return;
    }
    playSafe(vids[active]);
    schedule();
  };

  document.addEventListener("visibilitychange", onVis);

  return () => {
    stopped = true;
    if (timer) window.clearTimeout(timer);
    document.removeEventListener("visibilitychange", onVis);
    vids.forEach((v) => {
      v.pause();
      v.removeAttribute("src");
      v.load();
    });
  };
}
