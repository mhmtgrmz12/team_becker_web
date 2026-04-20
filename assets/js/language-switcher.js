/* Language switcher UI logic */
import { setLanguage, getCurrentLanguage } from './i18n.js';

function initLanguageSwitcher() {
  const langBtn = document.getElementById('lang-btn');
  const langMenu = document.getElementById('lang-menu');
  
  if (!langBtn || !langMenu) {
    console.warn('[language-switcher] Elements not found, retrying...');
    return;
  }

  // Toggle language menu
  langBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    langMenu.classList.toggle('hidden');
  });
  
  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!langMenu.contains(e.target) && !langBtn.contains(e.target)) {
      langMenu.classList.add('hidden');
    }
  });
  
  // Language selection
  document.querySelectorAll('.lang-option, .lang-option-mobile').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const lang = btn.getAttribute('data-lang');
      console.log('[language-switcher] Switching to:', lang);
      await setLanguage(lang);
      langMenu.classList.add('hidden');
      updateCurrentLangDisplay();
    });
  });
  
  // Update current language display
  updateCurrentLangDisplay();
}

function updateCurrentLangDisplay() {
  const lang = getCurrentLanguage().toUpperCase();
  const display = document.getElementById('current-lang');
  if (display) display.textContent = lang;
}

// Initialize when partials are ready
document.addEventListener('partials:ready', () => {
  console.log('[language-switcher] Initializing...');
  initLanguageSwitcher();
});

// Also try to initialize immediately in case partials are already loaded
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  setTimeout(initLanguageSwitcher, 100);
}
