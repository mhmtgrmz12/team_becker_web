/* WhatsApp checkout wizard.
   Renders 3 steps (Service → Extras → Details) plus a review, builds a
   prefilled wa.me link, and posts a lead to n8n before redirecting.
   All visible strings come from i18n; `language:changed` triggers a re-render. */
import { CONFIG } from "./config.js";
import { $, $$, create, loadJSON, onReady, waLink, buildPrefillMessage, sessionId, toast } from "./utils.js";
import { track } from "./analytics.js";

function T (key, vars) {
  const fn = window.CCI18n && window.CCI18n.t;
  if (typeof fn === "function") return fn(key, vars);
  return key;
}
// Resolve a localised name/blurb for a service by id. Falls back to the
// English value from services.json if the i18n key is missing.
function svcField (svc, field) {
  if (!svc) return "";
  const v = T(`services.items.${svc.id}.${field}`);
  if (v && v !== `services.items.${svc.id}.${field}`) return v;
  return svc[field] || "";
}
function extraField (x, field) {
  if (!x) return "";
  const v = T(`extras.items.${x.id}.${field}`);
  if (v && v !== `extras.items.${x.id}.${field}`) return v;
  return x[field] || "";
}

const state = {
  step: 1,
  service: null,
  extras: new Set(),
  details: { name: "", phone: "", email: "", vehicle: "", preferredTime: "", note: "", consent: false },
  services: [],
  extrasList: [],
};

async function boot () {
  const root = document.getElementById("wizard");
  if (!root) return;
  try {
    const [services, extras] = await Promise.all([
      loadJSON("/assets/data/services.json"),
      loadJSON("/assets/data/extras.json"),
    ]);
    state.services = services;
    state.extrasList = extras;
  } catch (e) {
    console.error(e);
    toast(T("request.toast.loadFail"));
    return;
  }

  const qs = new URLSearchParams(location.search);
  const initial = qs.get("service");
  if (initial) state.service = state.services.find(s => s.id === initial) || null;

  render(root);
  track("wizard_start");

  // Re-render entirely whenever the language changes (preserves state)
  document.addEventListener("language:changed", () => {
    const r = document.getElementById("wizard");
    if (r) render(r);
  });
}

function render (root) {
  root.innerHTML = "";
  root.appendChild(progressBar());
  const body = create("div", { class: "p-6 sm:p-12" });
  if (state.step === 1) body.appendChild(stepService());
  else if (state.step === 2) body.appendChild(stepExtras());
  else if (state.step === 3) body.appendChild(stepDetails());
  else if (state.step === 4) body.appendChild(stepReview());
  root.appendChild(body);
}

function progressBar () {
  const wrap = create("div", { class: "wz-progress-bar" });
  const row = create("div", { class: "flex items-center justify-between" });
  const labels = [T("request.steps.service"), T("request.steps.extras"), T("request.steps.details")];
  labels.forEach((label, i) => {
    const n = i + 1;
    const dotCls = state.step > n ? "done" : state.step === n ? "active" : "pending";
    const dot = create("div", { class: "flex flex-col items-center" }, [
      create("div", { class: `wz-step-dot ${dotCls}`, html: dotCls === "done" ? '<span class="msi" style="font-size:18px">check</span>' : String(n) }),
      create("span", { class: "wz-step-label", style: dotCls === "pending" ? "color:var(--secondary);opacity:.6" : "color:var(--primary)" }, label),
    ]);
    row.appendChild(dot);
    if (i < labels.length - 1) row.appendChild(create("div", { class: `wz-step-connector ${state.step > n ? "done" : ""}` }));
  });
  wrap.appendChild(row);
  return wrap;
}

// ---- Step 1: Service ----
function stepService () {
  const wrap = create("div");
  wrap.appendChild(create("div", { class: "mb-8 text-center" }, [
    create("h1", { class: "text-3xl font-bold tracking-tight", style: "color:var(--primary)" }, T("request.step1.title")),
    create("p", { class: "mt-3 max-w-lg mx-auto", style: "color:var(--secondary)" }, T("request.step1.subtitle")),
  ]));
  const grid = create("div", { class: "grid grid-cols-1 md:grid-cols-2 gap-4 mb-8" });
  state.services.forEach(s => {
    const selected = state.service?.id === s.id;
    const card = create("label", { class: "relative cursor-pointer group block" }, [
      create("input", { type: "radio", name: "service", class: "sr-only", ...(selected ? { checked: true } : {}) }),
      create("div", { class: `wz-option ${selected ? "selected" : ""}` }, [
        create("div", { class: "flex justify-between items-start mb-3" }, [
          create("div", {
            class: "w-12 h-12 rounded-full flex items-center justify-center",
            style: selected ? "background:var(--secondary-container);color:var(--primary)" : "background:var(--surface-variant);color:var(--secondary)",
            html: `<span class="msi">${s.icon}</span>`,
          }),
          create("div", {
            class: "w-6 h-6 rounded-full flex items-center justify-center",
            style: selected ? "background:var(--tertiary-fixed);color:var(--on-tertiary-fixed)" : "border:2px solid rgba(196,198,205,0.3)",
            html: selected ? '<span class="msi" style="font-size:16px;font-weight:700">check</span>' : "",
          }),
        ]),
        create("h3", { class: "text-lg font-semibold mb-1", style: "color:var(--primary)" }, svcField(s, "name")),
        create("p", { class: "text-sm", style: "color:var(--secondary)" }, svcField(s, "blurb")),
      ]),
    ]);
    card.addEventListener("click", () => { state.service = s; render(document.getElementById("wizard")); });
    grid.appendChild(card);
  });
  wrap.appendChild(grid);
  wrap.appendChild(actions({
    back: null,
    next: () => {
      if (!state.service) return toast(T("request.step1.errorSelect"));
      state.step = 2;
      track("wizard_step_complete", { stepIndex: 1, serviceId: state.service.id });
      render(document.getElementById("wizard"));
    },
    nextLabel: T("request.step1.next"),
  }));
  return wrap;
}

// ---- Step 2: Extras ----
function stepExtras () {
  const wrap = create("div");
  wrap.appendChild(create("div", { class: "mb-8 text-center" }, [
    create("h1", { class: "text-3xl font-bold tracking-tight", style: "color:var(--primary)" }, T("request.step2.title")),
    create("p", { class: "mt-3 max-w-lg mx-auto", style: "color:var(--secondary)" }, T("request.step2.subtitle")),
  ]));
  const grid = create("div", { class: "grid grid-cols-1 md:grid-cols-2 gap-4 mb-8" });
  state.extrasList.forEach(x => {
    const selected = state.extras.has(x.id);
    const card = create("label", { class: "relative cursor-pointer group block" }, [
      create("div", { class: `wz-option ${selected ? "selected" : ""}` }, [
        create("div", { class: "flex justify-between items-start mb-3" }, [
          create("div", { class: "w-12 h-12 rounded-full flex items-center justify-center", style: "background:var(--surface-variant);color:var(--secondary)", html: `<span class="msi">${x.icon || "add"}</span>` }),
          create("div", { class: `w-6 h-6 rounded-md flex items-center justify-center`, style: selected ? "background:var(--tertiary-fixed);color:var(--on-tertiary-fixed)" : "border:2px solid rgba(196,198,205,0.3)", html: selected ? '<span class="msi" style="font-size:16px;font-weight:700">check</span>' : "" }),
        ]),
        create("h3", { class: "text-lg font-semibold mb-1", style: "color:var(--primary)" }, extraField(x, "name")),
        create("p", { class: "text-sm", style: "color:var(--secondary)" }, extraField(x, "description") || ""),
        x.priceFrom ? create("p", { class: "text-xs mt-2 font-semibold", style: "color:var(--on-tertiary-container)" }, T("serviceDetail.plusFrom", { price: x.priceFrom })) : null,
      ]),
    ]);
    card.addEventListener("click", () => { state.extras.has(x.id) ? state.extras.delete(x.id) : state.extras.add(x.id); render(document.getElementById("wizard")); });
    grid.appendChild(card);
  });
  wrap.appendChild(grid);

  const docs = (state.service?.requiredDocumentIds || []);
  if (docs.length) {
    const docNames = docs.map(id => {
      const v = T(`documents.items.${id}.title`);
      return v !== `documents.items.${id}.title` ? v : id.replace(/_/g, " ");
    });
    const hint = create("div", { class: "p-4 rounded-lg mb-6", style: "background:var(--surface-container-low)" }, [
      create("div", { class: "text-xs uppercase tracking-widest font-bold mb-2", style: "color:var(--secondary)" }, T("request.step2.youllNeed")),
      create("div", { class: "text-sm", style: "color:var(--primary)" }, docNames.join(" · ")),
    ]);
    wrap.appendChild(hint);
  }

  wrap.appendChild(actions({
    back: () => { state.step = 1; render(document.getElementById("wizard")); },
    next: () => { state.step = 3; track("wizard_step_complete", { stepIndex: 2 }); render(document.getElementById("wizard")); },
    nextLabel: T("request.step2.next"),
  }));
  return wrap;
}

// ---- Step 3: Details ----
function stepDetails () {
  const wrap = create("div");
  wrap.appendChild(create("div", { class: "mb-8 text-center" }, [
    create("h1", { class: "text-3xl font-bold tracking-tight", style: "color:var(--primary)" }, T("request.step3.title")),
    create("p", { class: "mt-3 max-w-lg mx-auto", style: "color:var(--secondary)" }, T("request.step3.subtitle")),
  ]));
  const form = create("form", { class: "grid grid-cols-1 md:grid-cols-2 gap-5 max-w-2xl mx-auto" });
  form.addEventListener("submit", (e) => e.preventDefault());

  const fields = [
    { id: "name",          labelKey: "request.step3.fields.name",         type: "text",     required: true,  wide: false, auto: "name" },
    { id: "phone",         labelKey: "request.step3.fields.phone",        type: "tel",      required: true,  wide: false, auto: "tel",  placeholderKey: "request.step3.fields.phonePh" },
    { id: "email",         labelKey: "request.step3.fields.email",        type: "email",    required: false, wide: false, auto: "email" },
    { id: "vehicle",       labelKey: "request.step3.fields.vehicle",      type: "text",     required: false, wide: false },
    { id: "preferredTime", labelKey: "request.step3.fields.preferredTime", type: "text",    required: false, wide: true },
    { id: "note",          labelKey: "request.step3.fields.note",         type: "textarea", required: false, wide: true },
  ];
  fields.forEach(f => {
    const label = T(f.labelKey) + (f.required ? T("request.step3.requiredMark") : "");
    const placeholder = f.placeholderKey ? T(f.placeholderKey) : "";
    const group = create("div", { class: f.wide ? "md:col-span-2" : "" }, [
      create("label", { class: "block text-sm font-semibold mb-2", style: "color:var(--primary)", for: `f-${f.id}` }, label),
      f.type === "textarea"
        ? create("textarea", { id: `f-${f.id}`, name: f.id, rows: 3, class: "w-full px-4 py-3 rounded-lg", style: "background:var(--surface-container-highest);border:none" })
        : create("input", { id: `f-${f.id}`, name: f.id, type: f.type, autocomplete: f.auto, placeholder, class: "w-full px-4 py-3 rounded-lg", style: "background:var(--surface-container-highest);border:none" }),
    ]);
    // Restore previously-entered value (e.g. after language switch re-render)
    setTimeout(() => {
      const el = group.querySelector(`#f-${f.id}`);
      if (el && state.details[f.id]) el.value = state.details[f.id];
    }, 0);
    form.appendChild(group);
  });

  const consentSpan = create("span", { class: "text-sm", style: "color:var(--secondary)" }, T("request.step3.consentBefore"));
  consentSpan.innerHTML += `<a href="/legal/privacy/" style="color:var(--on-tertiary-container);text-decoration:underline">${T("request.step3.privacyPolicy")}</a>${T("request.step3.consentAfter")}`;
  const consent = create("label", { class: "md:col-span-2 flex items-start gap-3 cursor-pointer" }, [
    create("input", { type: "checkbox", id: "f-consent", class: "mt-1", ...(state.details.consent ? { checked: true } : {}) }),
    consentSpan,
  ]);
  form.appendChild(consent);
  wrap.appendChild(form);

  wrap.appendChild(actions({
    back: () => { state.step = 2; render(document.getElementById("wizard")); },
    next: () => {
      const get = (id) => form.querySelector(`#f-${id}`)?.value?.trim() || "";
      state.details.name = get("name");
      state.details.phone = get("phone");
      state.details.email = get("email");
      state.details.vehicle = get("vehicle");
      state.details.preferredTime = get("preferredTime");
      state.details.note = get("note");
      state.details.consent = !!form.querySelector("#f-consent")?.checked;
      if (!state.details.name || !state.details.phone) return toast(T("request.step3.errorRequired"));
      if (!state.details.consent) return toast(T("request.step3.errorConsent"));
      state.step = 4; track("wizard_step_complete", { stepIndex: 3 }); render(document.getElementById("wizard"));
    },
    nextLabel: T("request.step3.next"),
  }));
  return wrap;
}

// ---- Step 4: Review + submit ----
function stepReview () {
  const wrap = create("div", { class: "max-w-2xl mx-auto" });
  const extrasNames = [...state.extras].map(id => {
    const x = state.extrasList.find(e => e.id === id);
    return extraField(x, "name");
  }).filter(Boolean);
  const summary = [
    [T("request.step4.summary.service"), svcField(state.service, "name")],
    [T("request.step4.summary.extras"), extrasNames.length ? extrasNames.join(", ") : "—"],
    [T("request.step4.summary.name"), state.details.name],
    [T("request.step4.summary.phone"), state.details.phone],
    [T("request.step4.summary.email"), state.details.email || "—"],
    [T("request.step4.summary.vehicle"), state.details.vehicle || "—"],
    [T("request.step4.summary.preferredTime"), state.details.preferredTime || "—"],
    [T("request.step4.summary.note"), state.details.note || "—"],
  ];
  wrap.appendChild(create("h1", { class: "text-3xl font-bold text-center mb-2", style: "color:var(--primary)" }, T("request.step4.title")));
  wrap.appendChild(create("p", { class: "text-center mb-8", style: "color:var(--secondary)" }, T("request.step4.subtitle")));

  const table = create("div", { class: "rounded-lg p-5 mb-6", style: "background:var(--surface-container-low)" });
  summary.forEach(([k, v]) => {
    table.appendChild(create("div", { class: "flex justify-between py-2 border-b", style: "border-color:rgba(196,198,205,0.3)" }, [
      create("span", { class: "text-sm font-semibold", style: "color:var(--secondary)" }, k),
      create("span", { class: "text-sm text-right", style: "color:var(--primary)" }, v || "—"),
    ]));
  });
  wrap.appendChild(table);

  wrap.appendChild(create("div", { class: "text-center text-sm mb-6", style: "color:var(--secondary)" }, T("request.step4.fallbackLine")));

  const cta = create("button", {
    class: "w-full px-8 py-4 rounded-lg font-bold text-lg flex items-center justify-center gap-3",
    style: "background:var(--tertiary-fixed);color:var(--on-tertiary-fixed);box-shadow:var(--shadow-glow);border:none;cursor:pointer",
    html: `${T("request.step4.openWa")} <span class="msi">arrow_forward</span>`,
  });
  cta.addEventListener("click", async () => {
    cta.disabled = true;
    const payload = {
      sessionId: sessionId(),
      service: state.service?.id,
      serviceName: svcField(state.service, "name"),
      extras: [...state.extras],
      details: state.details,
      ts: Date.now(),
      origin: location.origin,
      locale: (window.CCI18n && window.CCI18n.getLang && window.CCI18n.getLang()) || "en",
    };
    try {
      await fetch(CONFIG.endpoints.lead, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload), mode: "cors", keepalive: true });
    } catch (e) { /* ignore — redirect anyway */ }
    track("wizard_submit", { serviceId: state.service?.id });
    const text = buildPrefillMessage({
      service: svcField(state.service, "name"),
      extras: extrasNames,
      name: state.details.name,
      phone: state.details.phone,
      email: state.details.email,
      vehicle: state.details.vehicle,
      preferredTime: state.details.preferredTime,
      note: state.details.note,
    });
    const url = waLink(CONFIG.whatsappNumber, text);
    track("whatsapp_redirect", { serviceId: state.service?.id });
    const w = window.open(url, "_blank");
    if (!w) {
      toast(T("request.step4.tapAgain"));
      cta.disabled = false;
      cta.innerHTML = `${T("request.step4.tapHere")} <span class="msi">arrow_forward</span>`;
      cta.onclick = () => (location.href = url);
    } else {
      showSent(wrap, url);
    }
  });
  wrap.appendChild(cta);

  const emailBody = buildPrefillMessage({
    service: svcField(state.service, "name"),
    extras: extrasNames,
    name: state.details.name,
    phone: state.details.phone,
    email: state.details.email,
    vehicle: state.details.vehicle,
    preferredTime: state.details.preferredTime,
    note: state.details.note,
  });
  const emailSubject = T("prefill.emailSubject");
  const fallbacks = create("div", { class: "mt-4 grid grid-cols-2 gap-3" }, [
    create("a", { href: `mailto:${CONFIG.email}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`, class: "text-center py-3 rounded-lg font-semibold", style: "background:var(--surface-container-lowest);color:var(--primary);border:1px solid rgba(196,198,205,0.3)" }, T("request.step4.sendEmail")),
    create("a", { href: `tel:${CONFIG.phoneDial}`, class: "text-center py-3 rounded-lg font-semibold", style: "background:var(--surface-container-lowest);color:var(--primary);border:1px solid rgba(196,198,205,0.3)" }, T("request.step4.callBtn", { phone: CONFIG.phoneDisplay })),
  ]);
  wrap.appendChild(fallbacks);

  wrap.appendChild(actions({ back: () => { state.step = 3; render(document.getElementById("wizard")); }, next: null }));
  return wrap;
}

function showSent (wrap, url) {
  wrap.innerHTML = "";
  wrap.appendChild(create("div", { class: "text-center p-10" }, [
    create("div", { class: "w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center", style: "background:var(--tertiary-fixed);color:var(--on-tertiary-fixed)", html: '<span class="msi" style="font-size:32px">check</span>' }),
    create("h2", { class: "text-2xl font-bold mb-2", style: "color:var(--primary)" }, T("request.sent.title")),
    create("p", { class: "mb-6", style: "color:var(--secondary)" }, T("request.sent.desc")),
    create("a", { href: url, class: "inline-block px-6 py-3 rounded-lg font-semibold", style: "background:var(--primary);color:var(--on-primary)" }, T("request.sent.reopen")),
  ]));
}

function actions ({ back, next, nextLabel }) {
  const wrap = create("div", { class: "flex flex-col sm:flex-row justify-between items-center pt-6", style: "border-top:1px solid rgba(196,198,205,0.2)" });
  const cancel = create("button", { class: "text-sm font-semibold px-4 py-2 rounded-lg mb-3 sm:mb-0", style: "color:var(--primary);background:transparent;border:none;cursor:pointer" }, back ? T("request.actions.back") : T("request.actions.cancel"));
  cancel.addEventListener("click", () => { if (back) back(); else history.length > 1 ? history.back() : (location.href = "/"); });
  wrap.appendChild(cancel);
  if (next) {
    const nxt = create("button", { class: "w-full sm:w-auto px-8 py-3 rounded-lg font-semibold flex items-center justify-center gap-2", style: "background:var(--primary-container);color:white;box-shadow:var(--shadow-soft);border:none;cursor:pointer" }, nextLabel || T("request.actions.continue"));
    nxt.addEventListener("click", next);
    wrap.appendChild(nxt);
  }
  return wrap;
}

onReady(boot);
