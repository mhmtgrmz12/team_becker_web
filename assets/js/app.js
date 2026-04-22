/* Entry module loaded by every page. */
import "./config.js";
import "./include.js";       // injects partials
import { initI18n } from "./i18n.js";
import "./language-switcher.js";
import "./consent.js";
import "./open-now.js";
import "./chatbot.js";
import "./analytics.js";

// Initialize i18n (reveals page via i18n-ready class when done)
initI18n();

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
