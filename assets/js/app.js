/* Entry module loaded by every page. */
import "./config.js";
import "./include.js";       // injects partials
import "./consent.js";
import "./open-now.js";
import "./chatbot.js";
import "./analytics.js";

// Year in footer
document.addEventListener("partials:ready", () => {
  const y = new Date().getFullYear();
  document.querySelectorAll("[data-year]").forEach(n => (n.textContent = y));
});
