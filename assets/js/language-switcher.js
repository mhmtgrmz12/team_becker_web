/* Language switcher UI logic */
import { setLanguage, getCurrentLanguage } from './i18n.js';

function initLanguageSwitcher() {
  console.log('[language-switcher] Initializing...');
  
  // Language selection
  document.querySelectorAll('.lang-option, .lang-option-mobile').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      e.stopPropagation();
      const lang = btn.getAttribute('data-lang');
      console.log('[language-switcher] Switching to:', lang);
      await setLanguage(lang);
    });
  });
  
  // Update current language display
  updateCurrentLangDisplay();
  
  console.log('[language-switcher] Initialized successfully');
}

function updateCurrentLangDisplay() {
  const lang = getCurrentLanguage().toUpperCase();
  const display = document.getElementById('current-lang');
  if (display) display.textContent = lang;
}

// Initialize when partials are ready
document.addEventListener('partials:ready', () => {
  console.log('[language-switcher] partials:ready event fired');
  setTimeout(initLanguageSwitcher, 100);
});

// Also try to initialize immediately
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLanguageSwitcher);
} else {
  initLanguageSwitcher();
}
