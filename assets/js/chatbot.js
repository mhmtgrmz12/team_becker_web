/* Civic Concierge chatbot widget.
   - Mounts into whatever container it finds (.cb-root)
   - Sends messages to CONFIG.endpoints.chat (n8n via edge proxy)
   - Falls back to a local scripted flow when the endpoint is unreachable
     so the UI is testable offline. */
import { CONFIG } from "./config.js";
import { $, create, sessionId, onReady, waLink, buildPrefillMessage, toast } from "./utils.js";

const STATE = {
  open: false,
  history: [], // {role, text}
  collected: {}, // { service, name, phone, ... }
  intent: null,
  step: "greet",
};

// --- Local fallback flow (used when n8n is not reachable) ---
const LOCAL_FLOWS = {
  greet: {
    text: "Hi! I'm the Civic Concierge assistant. What would you like to do today?",
    quick: ["Register a vehicle", "Re-register / change owner", "Deregister a vehicle", "Get license plates", "Ask about pricing", "Ask about documents", "Talk to the team"],
  },
  ask_service: (service) => ({
    text: `Great — ${service}. Do you want our Express service (same-day if possible)?`,
    quick: ["Yes, express", "No, standard", "Back"],
    next: "ask_name",
  }),
  ask_name: {
    text: "Perfect. What's your full name?",
    input: "text",
    next: "ask_phone",
  },
  ask_phone: {
    text: "And your WhatsApp / phone number?",
    input: "tel",
    next: "handoff",
  },
  handoff: (data) => ({
    text: `Thanks ${data.name || "there"} — I've prepared a request. You can continue on WhatsApp and we'll take it from here.`,
    handoff: { channel: "whatsapp" },
  }),
  ask_price: {
    text: "Our service fee starts at €29 incl. VAT. Authority fees from Kreis Steinfurt come on top. Would you like a quote for a specific service?",
    quick: ["Register a vehicle", "Re-register / change owner", "Deregister a vehicle", "Talk to the team"],
  },
  ask_documents: {
    text: "For most registrations you'll need: ID or passport, eVB insurance confirmation, SEPA mandate for motor tax, and the Zulassungsbescheinigung II (vehicle title). Shall I start a request?",
    quick: ["Start a request", "Talk to the team"],
  },
  talk_to_human: {
    text: "I can hand you to the team directly. You'll get a reply in WhatsApp within minutes during office hours.",
    handoff: { channel: "whatsapp" },
  },
  fallback: {
    text: "Sorry, I didn't catch that. Would you like to continue on WhatsApp?",
    handoff: { channel: "whatsapp" },
  },
};

function mapQuickToIntent (label) {
  const map = {
    "Register a vehicle": { intent: "start_request", service: "New Registration" },
    "Re-register / change owner": { intent: "start_request", service: "Re-registration" },
    "Deregister a vehicle": { intent: "start_request", service: "Deregistration" },
    "Get license plates": { intent: "start_request", service: "License Plates" },
    "Ask about pricing": { intent: "ask_price" },
    "Ask about documents": { intent: "ask_documents" },
    "Talk to the team": { intent: "talk_to_human" },
    "Start a request": { intent: "start_request", service: "New Registration" },
    "Yes, express": { extras: ["Express"] },
    "No, standard": {},
    "Back": { intent: "greet" },
  };
  return map[label] || {};
}

function localReply (message, button) {
  const hint = button || mapQuickToIntent(message);

  if (hint.intent === "ask_price") return LOCAL_FLOWS.ask_price;
  if (hint.intent === "ask_documents") return LOCAL_FLOWS.ask_documents;
  if (hint.intent === "talk_to_human") return LOCAL_FLOWS.talk_to_human;

  if (hint.intent === "start_request") {
    STATE.collected.service = hint.service;
    STATE.step = "ask_name";
    return LOCAL_FLOWS.ask_service(hint.service);
  }
  if (hint.extras) {
    STATE.collected.extras = (STATE.collected.extras || []).concat(hint.extras);
    STATE.step = "ask_name";
    return LOCAL_FLOWS.ask_name;
  }

  if (STATE.step === "ask_name" && message) {
    STATE.collected.name = message;
    STATE.step = "ask_phone";
    return LOCAL_FLOWS.ask_phone;
  }
  if (STATE.step === "ask_phone" && message) {
    STATE.collected.phone = message;
    STATE.step = "handoff";
    return LOCAL_FLOWS.handoff(STATE.collected);
  }
  if (STATE.step === "greet" || !STATE.step) {
    return LOCAL_FLOWS.greet;
  }
  return LOCAL_FLOWS.fallback;
}

// --- Rendering ---
function renderMessages (root) {
  const box = $(".cb-messages", root);
  const quickBox = $(".cb-quick", root);
  box.innerHTML = "";
  quickBox.innerHTML = "";
  STATE.history.forEach(m => {
    const el = create("div", { class: `cb-msg ${m.role}`, html: m.text });
    box.appendChild(el);
  });
  box.scrollTop = box.scrollHeight;
}

function showQuick (root, items, handoff) {
  const quickBox = $(".cb-quick", root);
  quickBox.innerHTML = "";
  (items || []).forEach(label => {
    const b = create("button", { onclick: () => handleUser(root, label, true) }, label);
    quickBox.appendChild(b);
  });
  if (handoff) {
    const msg = buildPrefillMessage({
      service: STATE.collected.service,
      extras: STATE.collected.extras,
      name: STATE.collected.name,
      phone: STATE.collected.phone,
      note: "Started from chatbot",
    });
    const a = create("a", {
      class: "cb-quick-primary",
      href: waLink(CONFIG.whatsappNumber, msg),
      target: "_blank",
      rel: "noopener",
      style: "background:var(--tertiary-fixed);color:var(--on-tertiary-fixed);padding:10px 16px;border-radius:9999px;font-weight:700;text-decoration:none;display:inline-flex;align-items:center;gap:6px;",
      "data-track": "chatbot_handoff",
    }, "Continue on WhatsApp →");
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
async function serverReply (message, button) {
  try {
    const res = await fetch(CONFIG.endpoints.chat, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: sessionId(),
        message,
        intentHint: button?.intent || null,
        context: { page: location.pathname, locale: CONFIG.locale },
        ts: Date.now(),
      }),
      mode: "cors",
    });
    if (!res.ok) throw new Error("chat endpoint " + res.status);
    const data = await res.json();
    return {
      text: data?.reply?.text || "",
      quick: data?.reply?.quickReplies || [],
      handoff: data?.reply?.handoff || null,
    };
  } catch (err) {
    // Fallback to local flow
    return localReply(message, button);
  }
}

async function handleUser (root, text, isButton = false) {
  if (!text) return;
  STATE.history.push({ role: "user", text });
  renderMessages(root);
  showTyping(root, true);
  const hint = isButton ? mapQuickToIntent(text) : null;
  const reply = await serverReply(text, hint);
  setTimeout(() => {
    showTyping(root, false);
    STATE.history.push({ role: "bot", text: reply.text });
    renderMessages(root);
    showQuick(root, reply.quick || [], reply.handoff);
  }, 400);
}

function openPanel (root) {
  STATE.open = true;
  $(".cb-panel", root)?.classList.add("open");
  if (STATE.history.length === 0) {
    const greet = LOCAL_FLOWS.greet;
    STATE.history.push({ role: "bot", text: greet.text });
    renderMessages(root);
    showQuick(root, greet.quick);
  }
}
function closePanel (root) {
  STATE.open = false;
  $(".cb-panel", root)?.classList.remove("open");
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
    handleUser(root, v, false);
  });

  // Auto-open when ?chat=1 in URL
  if (new URLSearchParams(location.search).get("chat") === "1") openPanel(root);

  // Allow external buttons to open with a prefilled intent: [data-chat-intent="start_request"]
  document.addEventListener("click", (e) => {
    const el = e.target.closest?.("[data-chat-open]");
    if (!el) return;
    e.preventDefault();
    openPanel(root);
    const label = el.getAttribute("data-chat-open");
    if (label) setTimeout(() => handleUser(root, label, true), 400);
  });
}

onReady(mount);
document.addEventListener("partials:ready", mount);
