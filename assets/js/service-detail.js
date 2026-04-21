/* Renders a service detail page from services.json + documents.json + faq.json
   based on <body data-service-id="...">. Localised via i18n. */
import { loadJSON, create, whenI18nReady } from "./utils.js";

function T (key, vars) {
  const fn = window.CCI18n && window.CCI18n.t;
  if (typeof fn === "function") return fn(key, vars);
  return key;
}
function Tf (key, fallback, vars) {
  const v = T(key, vars);
  return v && v !== key ? v : fallback;
}

function svcField (svc, field) {
  const v = T(`services.items.${svc.id}.${field}`);
  return v && v !== `services.items.${svc.id}.${field}` ? v : (svc[field] || "");
}

let cached = null; // { services, documents, extras, faqs }

async function boot () {
  const id = document.body.dataset.serviceId;
  if (!id) return;
  if (!cached) {
    const [services, documents, extras, faqs] = await Promise.all([
      loadJSON("/assets/data/services.json"),
      loadJSON("/assets/data/documents.json"),
      loadJSON("/assets/data/extras.json"),
      loadJSON("/assets/data/faq.json"),
    ]);
    cached = { services, documents, extras, faqs };
  }
  const { services, documents, extras, faqs } = cached;
  const svc = services.find(s => s.id === id);
  if (!svc) return;

  // Title & meta
  document.title = `${svcField(svc, "name")} — ${Tf("brand.name", "Civic Concierge")}`;
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute("content", svcField(svc, "blurb"));

  // Hero
  const hero = document.getElementById("svc-hero");
  if (hero) { hero.innerHTML = ""; hero.appendChild(heroBlock(svc)); }

  // Required documents
  const dbox = document.getElementById("svc-docs");
  if (dbox) {
    dbox.innerHTML = "";
    svc.requiredDocumentIds.forEach(docId => {
      const d = documents.find(x => x.id === docId);
      if (!d) return;
      dbox.appendChild(docCard(d));
    });
  }

  // Extras
  const ebox = document.getElementById("svc-extras");
  if (ebox && svc.extraIds) {
    ebox.innerHTML = "";
    svc.extraIds.forEach(eid => {
      const x = extras.find(e => e.id === eid);
      if (!x) return;
      ebox.appendChild(extraCard(x));
    });
  }

  // Pricing card
  const pbox = document.getElementById("svc-pricing");
  if (pbox) { pbox.innerHTML = ""; pbox.appendChild(pricingCard(svc)); }

  // Related services
  const rbox = document.getElementById("svc-related");
  if (rbox) {
    rbox.innerHTML = "";
    services.filter(s => s.id !== id).slice(0, 3).forEach(s => rbox.appendChild(relatedCard(s)));
  }

  // FAQ
  const fbox = document.getElementById("svc-faq");
  if (fbox) {
    fbox.innerHTML = "";
    faqs.slice(0, 5).forEach(f => fbox.appendChild(faqItem(f)));
  }
}

function heroBlock (svc) {
  const name = svcField(svc, "name");
  const blurb = svcField(svc, "blurb");
  const turnaround = svcField(svc, "turnaround");
  const wrap = create("div", { class: "max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center" });
  wrap.appendChild(create("div", { class: "lg:col-span-7" }, [
    create("div", { class: "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6", style: "background:var(--surface-container-low);color:var(--secondary)", html: `<span class="msi" style="font-size:16px">${svc.icon}</span> ${T("serviceDetail.eyebrow")}` }),
    create("h1", { class: "text-4xl md:text-6xl font-bold tracking-tight leading-tight mb-5", style: "color:var(--primary)" }, name),
    create("p", { class: "text-lg md:text-xl max-w-2xl leading-relaxed", style: "color:var(--secondary)" }, blurb),
    create("div", { class: "mt-8 flex flex-wrap gap-3" }, [
      create("a", { href: `/request/?service=${svc.slug}`, class: "px-7 py-4 rounded-xl font-bold flex items-center gap-2", style: "background:var(--tertiary-fixed);color:var(--on-tertiary-fixed);box-shadow:var(--shadow-glow)", "data-track": "click_whatsapp_cta", "data-track-location": "service_hero", "data-track-serviceId": svc.id, html: `<span class="msi">chat</span> ${T("serviceDetail.startWa")}` }),
      create("a", { href: "/pricing/", class: "px-7 py-4 rounded-xl font-semibold", style: "background:var(--surface-container-lowest);color:var(--primary);box-shadow:var(--shadow-soft)" }, T("serviceDetail.viewPricing")),
    ]),
    create("div", { class: "mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm", style: "color:var(--secondary)" }, [
      create("span", { class: "flex items-center gap-1", html: `<span class="msi" style="font-size:18px;color:var(--on-tertiary-container)">schedule</span> ${turnaround}` }),
      create("span", { class: "flex items-center gap-1", html: `<span class="msi" style="font-size:18px;color:var(--on-tertiary-container)">payments</span> ${T("services.from")} €${svc.serviceFeeFrom} ${T("serviceDetail.feeSuffix")}` }),
    ]),
  ]));

  const visual = create("div", { class: "lg:col-span-5 relative rounded-[2rem] overflow-hidden", style: "background:var(--primary);aspect-ratio:4/5;min-height:360px" });
  visual.innerHTML = `<div class="absolute inset-0 flex items-center justify-center"><span class="msi" style="font-size:240px;color:var(--tertiary-fixed);opacity:0.85">${svc.icon}</span></div>`;
  wrap.appendChild(visual);
  return wrap;
}

function docCard (d) {
  const title = Tf(`documents.items.${d.id}.title`, d.title);
  const desc = Tf(`documents.items.${d.id}.description`, d.description);
  const card = create("div", { class: "p-6 rounded-2xl flex flex-col h-full", style: "background:var(--surface-container-lowest);box-shadow:var(--shadow-card)" });
  card.innerHTML = `
    <div class="w-12 h-12 rounded-full flex items-center justify-center mb-4" style="background:var(--secondary-container);color:var(--primary)">
      <span class="msi fill">${d.icon}</span>
    </div>
    <h3 class="text-lg font-bold mb-2" style="color:var(--primary)">${title}</h3>
    <p class="text-sm leading-relaxed mt-auto" style="color:var(--secondary)">${desc}</p>
    ${d.formUrl ? `<a href="${d.formUrl}" class="mt-4 text-sm font-semibold" style="color:var(--on-tertiary-container)" data-track="download_form" data-track-formId="${d.id}">${T("serviceDetail.downloadForm")}</a>` : ""}
  `;
  return card;
}

function extraCard (x) {
  const name = Tf(`extras.items.${x.id}.name`, x.name);
  const desc = Tf(`extras.items.${x.id}.description`, x.description || "");
  const card = create("div", { class: "p-5 rounded-xl", style: "background:var(--surface-container-lowest);box-shadow:var(--shadow-soft)" });
  card.innerHTML = `
    <div class="flex items-start gap-3">
      <div class="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style="background:var(--surface-container-low);color:var(--secondary)">
        <span class="msi">${x.icon || "add"}</span>
      </div>
      <div>
        <h4 class="font-bold mb-1" style="color:var(--primary)">${name}</h4>
        <p class="text-sm" style="color:var(--secondary)">${desc}</p>
        ${x.priceFrom ? `<p class="text-xs mt-2 font-bold" style="color:var(--on-tertiary-container)">${T("serviceDetail.plusFrom", { price: x.priceFrom })}</p>` : ""}
      </div>
    </div>
  `;
  return card;
}

function pricingCard (svc) {
  const name = svcField(svc, "name");
  const authHint = svcField(svc, "authorityFeeHint");
  const turnaround = svcField(svc, "turnaround");
  const wrap = create("div", { class: "rounded-[2rem] p-10 relative overflow-hidden", style: "background:var(--surface-container-lowest);box-shadow:var(--shadow-dark)" });
  wrap.innerHTML = `
    <div class="absolute top-0 right-0 w-24 h-24 rounded-bl-[80px] opacity-70" style="background:var(--secondary-container)"></div>
    <h3 class="text-2xl font-bold mb-1" style="color:var(--primary)">${name}</h3>
    <p class="mb-6" style="color:var(--secondary)">${T("serviceDetail.allInclusive")}</p>
    <div class="flex items-baseline gap-2 mb-6">
      <span class="text-5xl font-black tracking-tighter" style="color:var(--primary)">€${svc.serviceFeeFrom}</span>
      <span class="font-medium" style="color:var(--secondary)">+ ${Tf("pricing.tableHeaders.authorityFees", "authority fees")} (${authHint})</span>
    </div>
    <ul class="space-y-3 mb-6 text-sm" style="color:var(--secondary)">
      <li class="flex items-center gap-2"><span class="msi" style="color:var(--tertiary-fixed-dim)">check_circle</span> ${T("serviceDetail.includedPreVerification")}</li>
      <li class="flex items-center gap-2"><span class="msi" style="color:var(--tertiary-fixed-dim)">check_circle</span> ${T("serviceDetail.includedPriority")}</li>
      <li class="flex items-center gap-2"><span class="msi" style="color:var(--tertiary-fixed-dim)">check_circle</span> ${T("serviceDetail.includedUpdates")}</li>
      <li class="flex items-center gap-2"><span class="msi" style="color:var(--tertiary-fixed-dim)">check_circle</span> ${T("serviceDetail.includedTurnaround", { turnaround })}</li>
    </ul>
    <a href="/request/?service=${svc.slug}" class="block w-full text-center px-6 py-4 rounded-xl font-bold" style="background:var(--primary);color:var(--on-primary)">${T("serviceDetail.startThisService")}</a>
  `;
  return wrap;
}

function relatedCard (s) {
  const name = svcField(s, "name");
  const turnaround = svcField(s, "turnaround");
  const a = create("a", { href: `/services/${s.slug}/`, class: "p-5 rounded-2xl block hover:-translate-y-0.5 transition-transform", style: "background:var(--surface-container-lowest);box-shadow:var(--shadow-card)" });
  a.innerHTML = `
    <div class="w-10 h-10 rounded-full flex items-center justify-center mb-3" style="background:var(--secondary-container);color:var(--primary)"><span class="msi">${s.icon}</span></div>
    <h4 class="font-bold mb-1" style="color:var(--primary)">${name}</h4>
    <p class="text-sm" style="color:var(--secondary)">${T("serviceDetail.fromPriceAnd", { price: s.serviceFeeFrom, turnaround })}</p>
  `;
  return a;
}

function faqItem (f) {
  const q = Tf(`faq.items.${f.id}.question`, f.question);
  const a = Tf(`faq.items.${f.id}.answer`, f.answer);
  const d = document.createElement("details");
  d.className = "group rounded-2xl";
  d.style = "background:var(--surface-container-lowest);box-shadow:0 2px 10px rgba(25,28,30,0.02)";
  d.innerHTML = `<summary class="flex justify-between items-center font-bold p-5" style="color:var(--primary)">${q}<span class="msi transition group-open:rotate-180" style="color:var(--secondary)">expand_more</span></summary><div class="px-5 pb-5" style="color:var(--secondary)">${a}</div>`;
  return d;
}

// Re-render on every language change (data is cached, only DOM is rebuilt)
document.addEventListener("language:changed", () => boot());
// Initial render — wait for i18n to be ready so T() returns real translations
whenI18nReady().then(boot);
