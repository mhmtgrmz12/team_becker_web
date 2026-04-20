/* Minimal GDPR consent banner. Stores choice in localStorage. */
import { $, onReady } from "./utils.js";

const KEY = "cc_consent_v1";

function getConsent () {
  try { return JSON.parse(localStorage.getItem(KEY) || "null"); }
  catch { return null; }
}

function saveConsent (obj) {
  localStorage.setItem(KEY, JSON.stringify({ ...obj, ts: Date.now() }));
  document.dispatchEvent(new CustomEvent("consent:change", { detail: obj }));
}

function mount () {
  const banner = $(".cb-consent");
  if (!banner) return;
  const state = getConsent();
  if (!state) banner.classList.add("show");

  $(".cb-accept-all", banner)?.addEventListener("click", () => {
    saveConsent({ essential: true, analytics: true, chatbot: true });
    banner.classList.remove("show");
  });
  $(".cb-accept-essentials", banner)?.addEventListener("click", () => {
    saveConsent({ essential: true, analytics: false, chatbot: true });
    banner.classList.remove("show");
  });
  $(".cb-reopen-consent")?.addEventListener("click", (e) => {
    e.preventDefault(); banner.classList.add("show");
  });
}

onReady(mount);
document.addEventListener("partials:ready", mount);
export { getConsent };
