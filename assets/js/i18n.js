/* Multi-language support */

const SUPPORTED_LANGS = ['en', 'de', 'tr', 'ar'];
const DEFAULT_LANG = 'en';
let currentLang = DEFAULT_LANG;
let translations = {};

// Get language from localStorage or browser
export function detectLanguage() {
  const stored = localStorage.getItem('lang');
  if (stored && SUPPORTED_LANGS.includes(stored)) return stored;
  
  const browser = navigator.language.split('-')[0];
  return SUPPORTED_LANGS.includes(browser) ? browser : DEFAULT_LANG;
}

// Load translation file
export async function loadTranslations(lang) {
  try {
    const res = await fetch(`/assets/data/i18n/${lang}.json`);
    if (!res.ok) throw new Error(`Failed to load ${lang}`);
    translations = await res.json();
    currentLang = lang;
    localStorage.setItem('lang', lang);
    document.documentElement.lang = lang;
    if (lang === 'ar') {
      document.documentElement.dir = 'rtl';
    } else {
      document.documentElement.dir = 'ltr';
    }
    return translations;
  } catch (err) {
    console.error('[i18n]', err);
    return {};
  }
}

// Get translation by key path (e.g., "nav.services")
export function t(key) {
  const keys = key.split('.');
  let value = translations;
  for (const k of keys) {
    value = value?.[k];
    if (!value) return key;
  }
  return value;
}

// Change language
export async function setLanguage(lang) {
  if (!SUPPORTED_LANGS.includes(lang)) return;
  await loadTranslations(lang);
  document.dispatchEvent(new CustomEvent('language:changed', { detail: { lang } }));
}

// Get current language
export function getCurrentLanguage() {
  return currentLang;
}

// Initialize
export async function initI18n() {
  const lang = detectLanguage();
  await loadTranslations(lang);
  applyTranslations();
}

// Apply translations to elements with data-i18n attribute
function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    el.textContent = t(key);
  });
}

// Re-apply translations when language changes
document.addEventListener('language:changed', applyTranslations);
