/* Tiny event wrapper. Only fires if consent granted for analytics.
   Plug in Plausible/Umami/GA4 in the providers map below. */
import { CONFIG } from "./config.js";
import { getConsent } from "./cookie-banner.js";

const providers = {
  plausible (name, props) {
    if (window.plausible) window.plausible(name, { props });
  },
  umami (name, props) {
    if (window.umami) window.umami.track(name, props);
  },
  ga4 (name, props) {
    if (window.gtag) window.gtag("event", name, props);
  },
  noop () {},
};

export function track (name, props = {}) {
  if (!CONFIG.analytics.enabled) return;
  const consent = getConsent();
  if (!consent || !consent.analytics) return;
  const fn = providers[CONFIG.analytics.provider] || providers.noop;
  try { fn(name, props); } catch (e) { console.error("[analytics]", e); }
  // eslint-disable-next-line no-console
  if (location.hostname === "localhost") console.log("[track]", name, props);
}

// Auto-track data-track attributes: <a data-track="click_whatsapp_cta" data-track-location="hero">
document.addEventListener("click", (e) => {
  const el = e.target.closest?.("[data-track]");
  if (!el) return;
  const name = el.getAttribute("data-track");
  const props = {};
  [...el.attributes].forEach(a => {
    if (a.name.startsWith("data-track-") && a.name !== "data-track") {
      props[a.name.replace("data-track-", "")] = a.value;
    }
  });
  track(name, props);
});
