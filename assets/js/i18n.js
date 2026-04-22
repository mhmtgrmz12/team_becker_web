/* Civic Concierge — i18n runtime
 *
 * Responsibilities
 * - Detect language (localStorage > URL ?lang= > <html lang> > navigator)
 * - Load /assets/data/i18n/{lang}.json translations
 * - Apply translations to any element carrying:
 *     data-i18n="key.path"                     → textContent
 *     data-i18n-html="key.path"                → innerHTML (use sparingly, only trusted keys)
 *     data-i18n-attr="placeholder:key,aria-label:key2"
 *     data-i18n-skip                           → element opts out of translation (used for brand
 *                                                name, official German terms, etc.)
 * - Switch language without reloading the page — fires `language:changed` so every script
 *   that rendered dynamic content can re-render.
 * - Re-apply translations when partials are injected (partials:ready) and when new nodes are
 *   mounted by hydration scripts (MutationObserver on <body>).
 * - Expose both ES-module exports AND a `window.CCI18n` global for non-module inline scripts.
 */

const SUPPORTED_LANGS = ['en', 'de', 'tr', 'ar', 'ru'];
const DEFAULT_LANG = 'en';
const STORAGE_KEY = 'cc_lang';

let currentLang = DEFAULT_LANG;
let translations = {};          // active language dictionary
let fallback = {};              // English dictionary used as fallback
let ready = false;
const changeListeners = new Set();

/* ---------- detection ---------- */

export function detectLanguage () {
  // Default language is German. Within the same browser session (tab), any
  // language the user picks is remembered via sessionStorage so it survives
  // page-to-page navigation. When the tab is closed and reopened, the session
  // is cleared and German is shown again.
  try {
    const q = new URLSearchParams(window.location.search).get('lang');
    if (q && SUPPORTED_LANGS.includes(q)) return q;
  } catch (_) { /* ignore */ }

  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored && SUPPORTED_LANGS.includes(stored)) return stored;
  } catch (_) { /* storage unavailable */ }

  return 'de';
}

/* ---------- dictionary loading ---------- */

async function fetchDict (lang) {
  const res = await fetch(`/assets/data/i18n/${lang}.json`, { cache: 'no-cache' });
  if (!res.ok) throw new Error(`Failed to load ${lang}.json (${res.status})`);
  return res.json();
}

async function ensureFallback () {
  if (Object.keys(fallback).length) return;
  try { fallback = await fetchDict(DEFAULT_LANG); } catch (_) { fallback = {}; }
}

/* ---------- key lookup ---------- */

function lookup (dict, key) {
  if (!dict || !key) return undefined;
  const parts = key.split('.');
  let v = dict;
  for (const p of parts) {
    if (v == null || typeof v !== 'object') return undefined;
    v = v[p];
  }
  return v;
}

/**
 * t('nav.services') → translated string; falls back to English, then to the key itself.
 * Supports {placeholders} via the optional vars argument.
 */
export function t (key, vars) {
  let value = lookup(translations, key);
  if (value == null) value = lookup(fallback, key);
  if (value == null) return key;
  if (vars && typeof value === 'string') {
    value = value.replace(/\{(\w+)\}/g, (_, k) => (vars[k] != null ? String(vars[k]) : `{${k}}`));
  }
  return value;
}

/* ---------- DOM application ---------- */

function applyToNode (el) {
  if (!el || el.nodeType !== 1) return;
  if (el.hasAttribute('data-i18n-skip')) return;

  // text / html
  const textKey = el.getAttribute('data-i18n');
  if (textKey) {
    const val = t(textKey);
    if (el.hasAttribute('data-i18n-html')) {
      el.innerHTML = val;
    } else {
      el.textContent = val;
    }
  } else if (el.hasAttribute('data-i18n-html')) {
    const htmlKey = el.getAttribute('data-i18n-html');
    el.innerHTML = t(htmlKey);
  }

  // attributes: data-i18n-attr="placeholder:key1,aria-label:key2,title:key3"
  const attrSpec = el.getAttribute('data-i18n-attr');
  if (attrSpec) {
    attrSpec.split(',').forEach(pair => {
      const [attr, keyPart] = pair.split(':').map(s => s && s.trim());
      if (!attr || !keyPart) return;
      el.setAttribute(attr, t(keyPart));
    });
  }
}

function applyTranslations (root) {
  const scope = root && root.nodeType === 1 ? root : document;
  // Include root itself if it matches
  if (scope.nodeType === 1) {
    if (scope.matches && scope.matches('[data-i18n], [data-i18n-html], [data-i18n-attr]')) {
      applyToNode(scope);
    }
  }
  const nodes = scope.querySelectorAll('[data-i18n], [data-i18n-html], [data-i18n-attr]');
  nodes.forEach(applyToNode);
}

/* ---------- setup: direction, html@lang ---------- */

function applyDirection (lang) {
  const html = document.documentElement;
  html.setAttribute('lang', lang);
  html.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
  document.body && document.body.setAttribute('data-lang', lang);
}

/* ---------- public API ---------- */

export function getCurrentLanguage () { return currentLang; }
export function getLang () { return currentLang; }
export function isRTL () { return currentLang === 'ar'; }
export function getSupportedLanguages () { return SUPPORTED_LANGS.slice(); }

/**
 * Load and apply a translation dictionary. Does NOT reload the page.
 */
export async function loadTranslations (lang) {
  if (!SUPPORTED_LANGS.includes(lang)) lang = DEFAULT_LANG;
  try {
    translations = await fetchDict(lang);
  } catch (err) {
    console.error('[i18n] load failed', err);
    translations = {};
  }
  currentLang = lang;
  // Persist to sessionStorage so language survives page navigation within the same tab.
  // (Not localStorage — closing and reopening the tab resets to German.)
  try { sessionStorage.setItem(STORAGE_KEY, lang); } catch (_) { /* ignore */ }
  applyDirection(lang);
  return translations;
}

/**
 * Switch language live — loads dict, re-applies DOM translations, fires `language:changed`.
 * Dynamic renderers (chatbot, wizard, faq, etc.) should listen for that event and re-render.
 */
export async function setLanguage (lang) {
  if (!SUPPORTED_LANGS.includes(lang)) return;
  if (lang === currentLang && ready) return;
  await loadTranslations(lang);
  applyTranslations();
  updateCurrentLangDisplay();
  // Notify listeners (both DOM event + direct subscribers)
  const detail = { lang, dict: translations };
  document.dispatchEvent(new CustomEvent('language:changed', { detail }));
  changeListeners.forEach(fn => { try { fn(lang); } catch (_) { /* swallow */ } });
}

export function setLang (lang) { return setLanguage(lang); }

/**
 * Register a callback fired whenever the language changes. Returns an unsubscribe fn.
 * Convenient for JS-rendered components that would otherwise need to attach their own
 * DOM listener.
 */
export function onChange (fn) {
  if (typeof fn !== 'function') return () => {};
  changeListeners.add(fn);
  return () => changeListeners.delete(fn);
}

/* ---------- current-lang pill ---------- */

function updateCurrentLangDisplay () {
  const pill = document.getElementById('current-lang');
  if (pill) pill.textContent = currentLang.toUpperCase();
}

/* ---------- initialization ---------- */

export async function initI18n () {
  const lang = detectLanguage();
  await ensureFallback();
  await loadTranslations(lang);
  applyTranslations();
  updateCurrentLangDisplay();
  ready = true;

  // Re-apply whenever partials are injected
  document.addEventListener('partials:ready', () => {
    applyTranslations();
    updateCurrentLangDisplay();
  });

  // Re-apply whenever hydration scripts insert new nodes
  try {
    const mo = new MutationObserver((mutations) => {
      for (const m of mutations) {
        m.addedNodes && m.addedNodes.forEach(n => {
          if (n.nodeType === 1) applyTranslations(n);
        });
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });
  } catch (_) { /* older browsers */ }

  document.dispatchEvent(new CustomEvent('language:changed', {
    detail: { lang: currentLang, dict: translations, initial: true }
  }));
}

/* ---------- global bridge for non-module scripts ---------- */

/* ---------- whenReady: resolves after first initI18n() completes ---------- */
let _readyResolve;
const _readyPromise = new Promise(res => { _readyResolve = res; });

export function whenReady () { return _readyPromise; }

// Patch initI18n to resolve the promise when done
const _origInit = initI18n;
// Note: initI18n is patched via the module scope — we override the exported symbol
// by resolving _readyPromise inside initI18n itself (see initI18n body above for the dispatch).
// We hook via the language:changed initial event instead:
document.addEventListener('language:changed', function _onFirst(e) {
  if (e.detail && e.detail.initial) {
    _readyResolve();
    document.removeEventListener('language:changed', _onFirst);
  }
});

window.CCI18n = {
  t,
  setLang: setLanguage,
  setLanguage,
  getLang,
  getCurrentLanguage,
  isRTL,
  onChange,
  getSupportedLanguages,
  apply: applyTranslations,
  whenReady,
};
