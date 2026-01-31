import "./styles.css";
import { DOMAINS, FOUNDERS, HERO, SITE, VIDEO } from "./config";
import { startTypewriter } from "./typing";
import { initVideoBackground } from "./video";

function $(sel: string) {
  return document.querySelector(sel);
}

function setText(el: Element | null, text: string) {
  if (!el) return;
  el.textContent = text;
}

function setupBranding() {
  const kicker = document.querySelector(".hero__kicker");
  setText(kicker, SITE.brand);

  const footerBrand = document.querySelector(".footer__inner > div");
  if (footerBrand) {
    // footerBrand currently contains © YEAR BRAND. Keep structure but update brand.
    const yearSpan = footerBrand.querySelector("#year") as HTMLSpanElement | null;
    const year = new Date().getFullYear().toString();
    if (yearSpan) yearSpan.textContent = year;
    footerBrand.childNodes.forEach((n) => {
      if (n.nodeType === Node.TEXT_NODE) {
        // noop
      }
    });
    // Replace brand text after year.
    const textNodes = Array.from(footerBrand.childNodes).filter((n) => n.nodeType === Node.TEXT_NODE);
    if (textNodes.length) {
      textNodes[textNodes.length - 1]!.textContent = ` ${SITE.brand}`;
    }
  } else {
    const yearEl = $("#year");
    if (yearEl) yearEl.textContent = new Date().getFullYear().toString();
  }

  const contactEmail = document.querySelector(".contact__email") as HTMLAnchorElement | null;
  if (contactEmail) {
    contactEmail.href = `mailto:${SITE.email}`;
    contactEmail.textContent = SITE.email;
  }
}

function setupFounders() {
  const cards = Array.from(document.querySelectorAll<HTMLElement>(".people .person"));
  if (cards.length === 0) return;

  for (let i = 0; i < Math.min(cards.length, FOUNDERS.length); i++) {
    const cfg = FOUNDERS[i]!;
    const card = cards[i]!;
    const img = card.querySelector("img") as HTMLImageElement | null;
    const name = card.querySelector(".person__name");
    const line = card.querySelector(".person__line");
    const link = card.querySelector(".person__link") as HTMLAnchorElement | null;

    if (img) {
      const base = (import.meta as any).env?.BASE_URL ?? "/";
      const p = cfg.photo;
      img.src = /^https?:\/\//i.test(p) ? p : `${base}${p.replace(/^\//, "")}`;
    }
    setText(name, cfg.name);
    setText(line, cfg.line);
    if (link) link.href = cfg.linkedin;
  }
}

function setupTypewriter() {
  const el = $("#typingTarget") as HTMLElement | null;
  if (!el) return;

  // If user prefers reduced motion, just show a single word.
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    el.textContent = DOMAINS[0] ?? "Robots";
    return;
  }

  startTypewriter(el, {
    words: DOMAINS,
    typingSpeedMs: HERO.typingSpeedMs,
    backspaceSpeedMs: HERO.backspaceSpeedMs,
    pauseMs: HERO.typingPauseMs,
  });
}

async function setupVideo() {
  const videoA = $("#videoA") as HTMLVideoElement | null;
  const videoB = $("#videoB") as HTMLVideoElement | null;
  if (!videoA || !videoB) return;

  const statusEl = $("#videoStatus") as HTMLElement | null;

  await initVideoBackground({
    videoA,
    videoB,
    manifestUrl: VIDEO.manifestUrl,
    swapEveryMs: VIDEO.swapEveryMs,
    fadeMs: VIDEO.fadeMs,
    statusEl,
  });
}

setupBranding();
setupFounders();
setupTypewriter();
setupVideo();

// Keep the year correct even if the footer markup changes.
const yearEl = $("#year");
if (yearEl) yearEl.textContent = new Date().getFullYear().toString();
