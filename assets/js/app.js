/* Entry module loaded by every page. */
import "./config.js";
import { partialsReady } from "./include.js";  // injects partials, returns a promise
import { initI18n } from "./i18n.js";
import "./language-switcher.js";
import "./consent.js";
import "./open-now.js";
import "./chatbot.js";
import "./analytics.js";

// Wait for all partials (header, footer, etc.) to be in the DOM before
// starting i18n — this ensures applyTranslations() sees every element.
partialsReady.then(() => {
  initI18n();
});

// Safety fallback: if i18n fails to load within 3s, show the page anyway
setTimeout(() => {
  if (document.body && !document.body.classList.contains('i18n-ready')) {
    document.body.classList.add('i18n-ready');
  }
}, 3000);

// Year in footer
document.addEventListener("partials:ready", () => {
  const y = new Date().getFullYear();
  document.querySelectorAll("[data-year]").forEach(n => (n.textContent = y));
});
