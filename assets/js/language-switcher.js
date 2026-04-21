/* Language switcher UI logic
 *
 * Wires the header dropdown + mobile button group to the i18n runtime, updates
 * the active-state styles, and keeps the displayed language code in sync on
 * every `language:changed` event.
 */
import { setLanguage, getCurrentLanguage } from './i18n.js';

function bindSwitchers () {
  const buttons = document.querySelectorAll('.lang-option, .lang-option-mobile');
  buttons.forEach(btn => {
    if (btn.dataset.bound === '1') return;
    btn.dataset.bound = '1';
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      e.stopPropagation();
      const lang = btn.getAttribute('data-lang');
      if (!lang) return;
      await setLanguage(lang);
      // Close the dropdown on desktop after switching
      const menu = document.getElementById('lang-menu');
      if (menu && !menu.classList.contains('hidden')) menu.classList.add('hidden');
    });
  });
}

function updateActiveStates () {
  const active = getCurrentLanguage();
  document.querySelectorAll('.lang-option, .lang-option-mobile').forEach(btn => {
    const lang = btn.getAttribute('data-lang');
    const isActive = lang === active;
    btn.setAttribute('aria-current', isActive ? 'true' : 'false');
    if (btn.classList.contains('lang-option-mobile')) {
      btn.style.background = isActive
        ? 'var(--tertiary-fixed)'
        : 'var(--surface-container-low)';
      btn.style.color = isActive
        ? 'var(--on-tertiary-fixed)'
        : 'var(--primary)';
    } else {
      btn.style.fontWeight = isActive ? '700' : '500';
    }
  });
  const pill = document.getElementById('current-lang');
  if (pill) pill.textContent = active.toUpperCase();
}

function initLanguageSwitcher () {
  bindSwitchers();
  updateActiveStates();
}

// Close the desktop dropdown when clicking outside
document.addEventListener('click', (e) => {
  const menu = document.getElementById('lang-menu');
  const btn = document.getElementById('lang-btn');
  if (!menu || menu.classList.contains('hidden')) return;
  if (menu.contains(e.target) || (btn && btn.contains(e.target))) return;
  menu.classList.add('hidden');
});

// Initialize whenever the header partial loads
document.addEventListener('partials:ready', () => {
  setTimeout(initLanguageSwitcher, 0);
});

// And whenever the language changes (to keep active state in sync)
document.addEventListener('language:changed', updateActiveStates);

// Immediate init in case the header is already present
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLanguageSwitcher);
} else {
  initLanguageSwitcher();
}
