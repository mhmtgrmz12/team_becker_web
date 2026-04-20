/* Small helpers used across the site. */

export function $ (sel, root = document) { return root.querySelector(sel); }
export function $$ (sel, root = document) { return [...root.querySelectorAll(sel)]; }

export function create (tag, props = {}, children = []) {
  const el = document.createElement(tag);
  Object.entries(props).forEach(([k, v]) => {
    if (k === "class") el.className = v;
    else if (k === "html") el.innerHTML = v;
    else if (k.startsWith("on") && typeof v === "function") el.addEventListener(k.slice(2).toLowerCase(), v);
    else if (v === true) el.setAttribute(k, "");
    else if (v === false || v == null) { /* noop */ }
    else el.setAttribute(k, v);
  });
  (Array.isArray(children) ? children : [children]).forEach(c => {
    if (c == null) return;
    el.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
  });
  return el;
}

export function uuid () {
  if (crypto && crypto.randomUUID) return crypto.randomUUID();
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    return (c === "x" ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

export function sessionId () {
  let id = sessionStorage.getItem("cc_session_id");
  if (!id) { id = uuid(); sessionStorage.setItem("cc_session_id", id); }
  return id;
}

export async function loadJSON (path) {
  const res = await fetch(path, { credentials: "same-origin" });
  if (!res.ok) throw new Error(`Failed to load ${path} (${res.status})`);
  return res.json();
}

export function formatEUR (n) {
  if (n == null || Number.isNaN(+n)) return "";
  return "€" + Number(n).toLocaleString("en-DE", { maximumFractionDigits: 0 });
}

export function waLink (phone, text) {
  const encoded = encodeURIComponent(text || "");
  return `https://wa.me/${phone}?text=${encoded}`;
}

export function toast (msg, ms = 2400) {
  let el = document.querySelector(".toast");
  if (!el) { el = document.createElement("div"); el.className = "toast"; document.body.appendChild(el); }
  el.textContent = msg; el.classList.add("show");
  setTimeout(() => el.classList.remove("show"), ms);
}

export function buildPrefillMessage (data) {
  const lines = [
    "Hello Civic Concierge,",
    "",
    `Service: ${data.service || "—"}`,
  ];
  if (data.extras && data.extras.length) lines.push(`Extras: ${data.extras.join(", ")}`);
  if (data.preferredTime) lines.push(`Preferred time: ${data.preferredTime}`);
  lines.push("");
  if (data.name) lines.push(`Name: ${data.name}`);
  if (data.phone) lines.push(`Phone: ${data.phone}`);
  if (data.email) lines.push(`Email: ${data.email}`);
  if (data.vehicle) lines.push(`Vehicle: ${data.vehicle}`);
  if (data.note) { lines.push(""); lines.push(`Note: ${data.note}`); }
  lines.push("");
  lines.push("(sent from civic-concierge.de)");
  return lines.join("\n");
}

export function onReady (fn) {
  if (document.readyState !== "loading") fn();
  else document.addEventListener("DOMContentLoaded", fn);
}
