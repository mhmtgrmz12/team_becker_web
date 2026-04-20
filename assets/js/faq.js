/* Renders FAQ accordions from faq.json + small client-side search. */
import { $, $$, create, loadJSON, onReady } from "./utils.js";

async function boot () {
  const list = document.getElementById("faq-list");
  if (!list) return;
  const search = document.getElementById("faq-search");
  const chipsWrap = document.getElementById("faq-chips");

  const data = await loadJSON("/assets/data/faq.json");
  let activeCat = "all";
  let query = "";

  function render () {
    list.innerHTML = "";
    const filtered = data.filter(f =>
      (activeCat === "all" || f.category === activeCat) &&
      (!query || (f.question + " " + f.answer).toLowerCase().includes(query.toLowerCase()))
    );
    if (filtered.length === 0) {
      list.appendChild(create("p", { class: "text-center py-8", style: "color:var(--secondary)" }, "No matching questions. Try a different search."));
      return;
    }
    filtered.forEach(f => {
      const d = create("details", { class: "group rounded-2xl", style: "background:var(--surface-container-lowest);box-shadow:0 2px 10px rgba(25,28,30,0.02)" });
      d.appendChild(create("summary", { class: "flex justify-between items-center font-bold p-6", style: "color:var(--primary)", html: `${f.question}<span class="msi transition group-open:rotate-180" style="color:var(--secondary)">expand_more</span>` }));
      d.appendChild(create("div", { class: "leading-relaxed px-6 pb-6", style: "color:var(--secondary)" }, f.answer));
      list.appendChild(d);
    });
  }

  // Build chips
  if (chipsWrap) {
    const cats = ["all", ...new Set(data.map(f => f.category))];
    cats.forEach(c => {
      const btn = create("button", { class: "px-4 py-2 rounded-full text-sm font-semibold", style: `background:${c === activeCat ? "var(--primary)" : "var(--surface-container-lowest)"};color:${c === activeCat ? "var(--on-primary)" : "var(--primary)"};border:1px solid rgba(196,198,205,0.3)` }, c === "all" ? "All" : c);
      btn.addEventListener("click", () => {
        activeCat = c;
        [...chipsWrap.children].forEach((el, i) => {
          const label = cats[i];
          el.style.background = label === activeCat ? "var(--primary)" : "var(--surface-container-lowest)";
          el.style.color = label === activeCat ? "var(--on-primary)" : "var(--primary)";
        });
        render();
      });
      chipsWrap.appendChild(btn);
    });
  }
  if (search) search.addEventListener("input", (e) => { query = e.target.value; render(); });

  render();
}
onReady(boot);
