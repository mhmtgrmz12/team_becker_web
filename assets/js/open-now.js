/* Highlights today's opening row and renders a small "Open now / Closed" pill. */
import { $, $$, loadJSON, whenI18nReady } from "./utils.js";

function parseRange (str) {
  // "08:00-17:00" -> [{ h: 8, m: 0 }, { h: 17, m: 0 }]
  if (!str || typeof str !== "string" || !str.includes("-")) return null;
  const [a, b] = str.split("-").map(s => s.trim());
  const toHM = (s) => { const [h, m] = s.split(":").map(Number); return { h, m: m || 0 }; };
  return [toHM(a), toHM(b)];
}

function isNowInRanges (ranges) {
  if (!ranges || !ranges.length) return false;
  const now = new Date();
  const cur = now.getHours() * 60 + now.getMinutes();
  return ranges.some(r => {
    const [a, b] = r;
    if (!a || !b) return false;
    return cur >= (a.h * 60 + a.m) && cur < (b.h * 60 + b.m);
  });
}

function dayKey (d) {
  return ["sun", "mon", "tue", "wed", "thu", "fri", "sat"][d];
}

export async function renderOpenNow () {
  try {
    const site = await loadJSON("/assets/data/site.json");
    const todayIdx = new Date().getDay();
    const todayKey = dayKey(todayIdx);
    const hours = site.hours || {};
    const todayRanges = (hours[todayKey] || []).map(parseRange).filter(Boolean);
    const open = isNowInRanges(todayRanges);

    // Pills (text comes from i18n so it re-localises on language change)
    const t = (window.CCI18n && window.CCI18n.t) || ((k) => k);
    const label = open ? t("location.openNow") : t("location.closedNow");
    $$(".open-now-pill").forEach(el => {
      el.innerHTML = `<span class="status-dot ${open ? "open" : "closed"}"></span>${label}`;
      el.classList.toggle("is-open", open);
    });

    // Highlight today's row in hours lists
    $$("[data-hours-row]").forEach(row => {
      if (row.getAttribute("data-hours-row") === todayKey) row.classList.add("is-today");
    });
  } catch (err) {
    console.error("[open-now]", err);
  }
}

whenI18nReady().then(renderOpenNow);
document.addEventListener("partials:ready", renderOpenNow);
document.addEventListener("language:changed", renderOpenNow);
