/* Civic Concierge chatbot widget.
   - Mounts into whatever container it finds (.cb-root)
   - Sends messages to CONFIG.endpoints.chat (n8n via edge proxy)
   - Falls back to a local scripted flow when the endpoint is unreachable
     so the UI is testable offline.
   - All user-facing strings come from i18n; language changes re-render the
     quick replies, placeholder, and every displayed bot message. */
import { CONFIG } from "./config.js";
import { $, create, sessionId, onReady, waLink, buildPrefillMessage, toast } from "./utils.js";

// Shortcut to the i18n bridge. Falls back gracefully if i18n hasn't loaded yet.
function T (key, vars) {
  const fn = window.CCI18n && window.CCI18n.t;
  if (typeof fn === "function") return fn(key, vars);
  return key;
}

// Quick-reply KEYS (not labels). We resolve them to human labels at render
// time so the buttons re-localise when the language changes.
const QUICK = {
  GREET: [
    "chatbot.quick.registerVehicle",
    "chatbot.quick.reRegister",
    "chatbot.quick.deregister",
    "chatbot.quick.getPlates",
    "chatbot.quick.askPricing",
    "chatbot.quick.askDocuments",
    "chatbot.quick.talkTeam"
  ],
  ASK_SERVICE: ["chatbot.quick.yesExpress", "chatbot.quick.noStandard", "chatbot.quick.back"],
  ASK_PRICE: [
    "chatbot.quick.registerVehicle",
    "chatbot.quick.reRegister",
    "chatbot.quick.deregister",
    "chatbot.quick.talkTeam"
  ],
  ASK_DOCS: ["chatbot.quick.startRequest", "chatbot.quick.talkTeam"]
};

// Map a quick-reply KEY to the intent data the flow needs. We always store
// intent metadata on the <button> itself (via data attributes) so we never
// rely on string-matching the localised label.
const INTENT_BY_KEY = {
  "chatbot.quick.registerVehicle": { intent: "start_request", serviceKey: "chatbot.services.newRegistration" },
  "chatbot.quick.reRegister":      { intent: "start_request", serviceKey: "chatbot.services.reRegistration" },
  "chatbot.quick.deregister":      { intent: "start_request", serviceKey: "chatbot.services.deregistration" },
  "chatbot.quick.getPlates":       { intent: "start_request", serviceKey: "chatbot.services.licensePlates" },
  "chatbot.quick.askPricing":      { intent: "ask_price" },
  "chatbot.quick.askDocuments":    { intent: "ask_documents" },
  "chatbot.quick.talkTeam":        { intent: "talk_to_human" },
  "chatbot.quick.startRequest":    { intent: "start_request", serviceKey: "chatbot.services.newRegistration" },
  "chatbot.quick.yesExpress":      { extras: ["Express"] },
  "chatbot.quick.noStandard":      {},
  "chatbot.quick.back":            { intent: "greet" }
};

const STATE = {
  open: false,
  history: [],          // {role, textKey?, text, vars?}
  collected: {},        // { service, serviceKey, name, phone, extras, ... }
  intent: null,
  step: "greet",
  lastQuickKeys: [],    // current quick-reply keys (for re-render on lang change)
  lastHandoff: null,    // whether the last bot reply offered a WhatsApp handoff
};

// --- Flow helpers: always return { textKey, quickKeys, vars?, handoff? } ---
function flowGreet () {
  return { textKey: "chatbot.greet", quickKeys: QUICK.GREET };
}
function flowAskService (serviceLabel) {
  // The service label is dynamic and comes from a translation key; we inject
  // it as a {service} placeholder prefix/suffix would be awkward, so we
  // render it as two keys concatenated by the renderer.
  return { textKey: null, textParts: ["chatbot.askServicePrefix", { literal: serviceLabel }, "chatbot.askServiceSuffix"], quickKeys: QUICK.ASK_SERVICE };
}
function flowAskName () { return { textKey: "chatbot.askName", quickKeys: [] }; }
function flowAskPhone () { return { textKey: "chatbot.askPhone", quickKeys: [] }; }
function flowHandoff (data) {
  const fallbackName = T("chatbot.handoffFallbackName") || "there";
  return {
    textKey: "chatbot.handoff",
    vars: { name: data.name || fallbackName },
    quickKeys: [],
    handoff: { channel: "whatsapp" }
  };
}
function flowAskPrice () { return { textKey: "chatbot.askPrice", quickKeys: QUICK.ASK_PRICE }; }
function flowAskDocuments () { return { textKey: "chatbot.askDocuments", quickKeys: QUICK.ASK_DOCS }; }
function flowTalkHuman () { return { textKey: "chatbot.talkHuman", quickKeys: [], handoff: { channel: "whatsapp" } }; }
function flowFallback () { return { textKey: "chatbot.fallback", quickKeys: [], handoff: { channel: "whatsapp" } }; }

// --- Local flow (runs when n8n endpoint is unreachable) ---
function localReply (hint, freeText) {
  if (hint && hint.intent === "ask_price") return flowAskPrice();
  if (hint && hint.intent === "ask_documents") return flowAskDocuments();
  if (hint && hint.intent === "talk_to_human") return flowTalkHuman();

  if (hint && hint.intent === "start_request") {
    const serviceLabel = hint.serviceKey ? T(hint.serviceKey) : "";
    STATE.collected.service = serviceLabel;
    STATE.collected.serviceKey = hint.serviceKey || null;
    STATE.step = "ask_name";
    return flowAskService(serviceLabel);
  }
  if (hint && hint.extras) {
    STATE.collected.extras = (STATE.collected.extras || []).concat(hint.extras);
    STATE.step = "ask_name";
    return flowAskName();
  }
  if (hint && hint.intent === "greet") {
    STATE.step = "greet";
    return flowGreet();
  }

  if (STATE.step === "ask_name" && freeText) {
    STATE.collected.name = freeText;
    STATE.step = "ask_phone";
    return flowAskPhone();
  }
  if (STATE.step === "ask_phone" && freeText) {
    STATE.collected.phone = freeText;
    STATE.step = "handoff";
    return flowHandoff(STATE.collected);
  }
  if (STATE.step === "greet" || !STATE.step) return flowGreet();
  return flowFallback();
}

// --- Rendering ---
function resolveMessageText (m) {
  if (m.textKey) return T(m.textKey, m.vars);
  if (m.textParts) {
    return m.textParts.map(p => typeof p === "string" ? T(p) : (p && p.literal) || "").join("");
  }
  return m.text || "";
}

function renderMessages (root) {
  const box = $(".cb-messages", root);
  const quickBox = $(".cb-quick", root);
  if (!box) return;
  box.innerHTML = "";
  if (quickBox) quickBox.innerHTML = "";
  STATE.history.forEach(m => {
    const text = resolveMessageText(m);
    const el = create("div", { class: `cb-msg ${m.role}`, html: text });
    box.appendChild(el);
  });
  box.scrollTop = box.scrollHeight;
}

function showQuick (root, keys, handoff) {
  const quickBox = $(".cb-quick", root);
  if (!quickBox) return;
  quickBox.innerHTML = "";
  (keys || []).forEach(key => {
    const label = T(key);
    const intent = INTENT_BY_KEY[key] || {};
    const b = create("button", {
      "data-key": key,
      onclick: () => handleUser(root, label, { key, ...intent })
    }, label);
    quickBox.appendChild(b);
  });
  if (handoff) {
    const msg = buildPrefillMessage({
      service: STATE.collected.service,
      extras: STATE.collected.extras,
      name: STATE.collected.name,
      phone: STATE.collected.phone,
      note: T("prefill.chatbotNote"),
    });
    const a = create("a", {
      class: "cb-quick-primary",
      href: waLink(CONFIG.whatsappNumber, msg),
      target: "_blank",
      rel: "noopener",
      style: "background:var(--tertiary-fixed);color:var(--on-tertiary-fixed);padding:10px 16px;border-radius:9999px;font-weight:700;text-decoration:none;display:inline-flex;align-items:center;gap:6px;",
      "data-track": "chatbot_handoff",
      "data-handoff-btn": "1",
    }, T("chatbot.continueWa"));
    quickBox.appendChild(a);
  }
}

function showTyping (root, on = true) {
  const box = $(".cb-messages", root);
  let t = box.querySelector(".cb-typing-wrap");
  if (on) {
    if (t) return;
    t = create("div", { class: "cb-msg bot cb-typing-wrap", html: '<span class="cb-typing"><span></span><span></span><span></span></span>' });
    box.appendChild(t); box.scrollTop = box.scrollHeight;
  } else if (t) { t.remove(); }
}

// --- Server call with graceful fallback ---
async function serverReply (message, hint) {
  try {
    const res = await fetch(CONFIG.endpoints.chat, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: sessionId(),
        message,
        intentHint: hint?.intent || null,
        context: { page: location.pathname, locale: (window.CCI18n && window.CCI18n.getLang && window.CCI18n.getLang()) || CONFIG.locale },
        ts: Date.now(),
      }),
      mode: "cors",
    });
    if (!res.ok) throw new Error("chat endpoint " + res.status);
    const data = await res.json();
    return {
      text: data?.reply?.text || "",
      quickKeys: [],                 // server may return localised labels directly — treated as literals
      quickLabels: data?.reply?.quickReplies || [],
      handoff: data?.reply?.handoff || null,
    };
  } catch (err) {
    return localReply(hint, message);
  }
}

async function handleUser (root, text, hint) {
  if (!text) return;
  STATE.history.push({ role: "user", text });
  renderMessages(root);
  showTyping(root, true);
  const reply = await serverReply(text, hint || null);
  setTimeout(() => {
    showTyping(root, false);
    // A local reply carries textKey/textParts; a server reply may carry plain text
    STATE.history.push({
      role: "bot",
      textKey: reply.textKey || null,
      textParts: reply.textParts || null,
      text: reply.text || "",
      vars: reply.vars || null
    });
    STATE.lastQuickKeys = reply.quickKeys || [];
    STATE.lastHandoff = reply.handoff || null;
    renderMessages(root);
    if (reply.quickLabels && reply.quickLabels.length) {
      // Server returned raw localised labels; just render as buttons with no i18n key.
      const quickBox = $(".cb-quick", root);
      if (quickBox) {
        quickBox.innerHTML = "";
        reply.quickLabels.forEach(label => {
          const b = create("button", { onclick: () => handleUser(root, label, null) }, label);
          quickBox.appendChild(b);
        });
      }
    } else {
      showQuick(root, reply.quickKeys || [], reply.handoff);
    }
  }, 400);
}

function openPanel (root) {
  STATE.open = true;
  $(".cb-panel", root)?.classList.add("open");
  if (STATE.history.length === 0) {
    const greet = flowGreet();
    STATE.history.push({ role: "bot", textKey: greet.textKey });
    STATE.lastQuickKeys = greet.quickKeys;
    STATE.lastHandoff = null;
    renderMessages(root);
    showQuick(root, greet.quickKeys);
  }
}
function closePanel (root) {
  STATE.open = false;
  $(".cb-panel", root)?.classList.remove("open");
}

// Re-render whenever the language changes
function relocalise (root) {
  if (!root) return;
  renderMessages(root);
  if (STATE.lastQuickKeys && STATE.lastQuickKeys.length || STATE.lastHandoff) {
    showQuick(root, STATE.lastQuickKeys, STATE.lastHandoff);
  }
  // input placeholder + aria labels
  const input = root.querySelector(".cb-input input");
  if (input) input.setAttribute("placeholder", T("chatbot.inputPlaceholder"));
  const launcher = root.querySelector(".cb-launcher");
  if (launcher) launcher.setAttribute("aria-label", T("chatbot.launcherAria"));
  const title = root.querySelector(".cb-header .title");
  if (title) title.textContent = T("chatbot.title");
  const closeBtn = root.querySelector(".cb-header .close");
  if (closeBtn) closeBtn.setAttribute("aria-label", T("chatbot.closeAria"));
  const sendBtn = root.querySelector(".cb-input button[type=submit]");
  if (sendBtn) sendBtn.setAttribute("aria-label", T("chatbot.sendAria"));
}

// --- Mount ---
function mount () {
  const root = document.querySelector(".cb-root");
  if (!root || root.dataset.mounted) return;
  root.dataset.mounted = "1";
  $(".cb-launcher", root)?.addEventListener("click", () => STATE.open ? closePanel(root) : openPanel(root));
  $(".cb-header .close", root)?.addEventListener("click", () => closePanel(root));
  const form = $(".cb-input", root);
  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = $("input", form);
    const v = input.value.trim();
    if (!v) return;
    input.value = "";
    handleUser(root, v, null);
  });

  // Initial i18n pass on static markup
  relocalise(root);

  // Auto-open when ?chat=1 in URL
  if (new URLSearchParams(location.search).get("chat") === "1") openPanel(root);

  // Allow external buttons to open with a prefilled intent
  document.addEventListener("click", (e) => {
    const el = e.target.closest?.("[data-chat-open]");
    if (!el) return;
    e.preventDefault();
    openPanel(root);
    const label = el.getAttribute("data-chat-open");
    if (label) setTimeout(() => handleUser(root, label, null), 400);
  });
}

onReady(mount);
document.addEventListener("partials:ready", mount);
// Re-localise UI whenever language changes
document.addEventListener("language:changed", () => {
  const root = document.querySelector(".cb-root");
  relocalise(root);
});
