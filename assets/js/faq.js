/* Renders FAQ accordions from faq.json + small client-side search.
   Questions, answers, and category labels come from i18n (falls back to the
   values in faq.json when a key is missing). Re-renders on `language:changed`. */
import { $, $$, create, loadJSON, whenI18nReady } from "./utils.js";

function T (key, fallback) {
  const fn = window.CCI18n && window.CCI18n.t;
  if (typeof fn === "function") {
    const v = fn(key);
    if (v && v !== key) return v;
  }
  return fallback;
}

async function boot () {
  const list = document.getElementById("faq-list");
  if (!list) return;
  const search = document.getElementById("faq-search");
  const chipsWrap = document.getElementById("faq-chips");

  const data = await loadJSON("/assets/data/faq.json");
  let activeCat = "all";
  let query = "";

  const q = (f) => T(`faq.items.${f.id}.question`, f.question);
  const a = (f) => T(`faq.items.${f.id}.answer`, f.answer);
  const catLabel = (c) => c === "all"
    ? T("faq.allCategory", "All")
    : T(`faq.categories.${c}`, c);

  function renderList () {
    list.innerHTML = "";
    const filtered = data.filter(f =>
      (activeCat === "all" || f.category === activeCat) &&
      (!query || (q(f) + " " + a(f)).toLowerCase().includes(query.toLowerCase()))
    );
    if (filtered.length === 0) {
      list.appendChild(create("p", { class: "text-center py-8", style: "color:var(--secondary)" }, T("faq.noResults", "No matching questions. Try a different search.")));
      return;
    }
    filtered.forEach(f => {
      const d = create("details", { class: "group rounded-2xl", style: "background:var(--surface-container-lowest);box-shadow:0 2px 10px rgba(25,28,30,0.02)" });
      d.appendChild(create("summary", { class: "flex justify-between items-center font-bold p-6", style: "color:var(--primary)", html: `${q(f)}<span class="msi transition group-open:rotate-180" style="color:var(--secondary)">expand_more</span>` }));
      d.appendChild(create("div", { class: "leading-relaxed px-6 pb-6", style: "color:var(--secondary)" }, a(f)));
      list.appendChild(d);
    });
  }

  function renderChips () {
    if (!chipsWrap) return;
    chipsWrap.innerHTML = "";
    const cats = ["all", ...new Set(data.map(f => f.category))];
    cats.forEach(c => {
      const isActive = c === activeCat;
      const btn = create("button", {
        class: "px-4 py-2 rounded-full text-sm font-semibold",
        "data-cat": c,
        style: `background:${isActive ? "var(--primary)" : "var(--surface-container-lowest)"};color:${isActive ? "var(--on-primary)" : "var(--primary)"};border:1px solid rgba(196,198,205,0.3)`
      }, catLabel(c));
      btn.addEventListener("click", () => {
        activeCat = c;
        renderChips();
        renderList();
      });
      chipsWrap.appendChild(btn);
    });
  }

  function renderSearchPlaceholder () {
    if (!search) return;
    const ph = T("faq.searchPlaceholder");
    if (ph && ph !== "faq.searchPlaceholder") search.setAttribute("placeholder", ph);
  }

  if (search) search.addEventListener("input", (e) => { query = e.target.value; renderList(); });

  // Re-render on every language change
  document.addEventListener("language:changed", () => {
    renderChips();
    renderList();
    renderSearchPlaceholder();
  });

  // Initial render — wait for i18n to be ready so T() returns real translations
  await whenI18nReady();
  renderChips();
  renderList();
  renderSearchPlaceholder();
}

boot();
