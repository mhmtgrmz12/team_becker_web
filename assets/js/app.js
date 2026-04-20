/* Entry module loaded by every page. */
import "./config.js";
import "./include.js";       // injects partials
import { initI18n } from "./i18n.js";
import "./consent.js";
import "./open-now.js";
import "./chatbot.js";
import "./analytics.js";

// Initialize i18n
initI18n();

// Year in footer
document.addEventListener("partials:ready", () => {
  const y = new Date().getFullYear();
  document.querySelectorAll("[data-year]").forEach(n => (n.textContent = y));
});
