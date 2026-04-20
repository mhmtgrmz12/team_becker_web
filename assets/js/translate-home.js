/* Apply translations to home page */
import { t } from './i18n.js';

export function translateHomePage() {
  // Hero section
  const heroBadge = document.querySelector('.inline-flex.items-center.gap-2.px-3');
  if (heroBadge) heroBadge.childNodes[2].textContent = t('hero.badge');
  
  const heroTitle = document.querySelector('h1');
  if (heroTitle) {
    heroTitle.innerHTML = `${t('hero.title')} <span style="color:var(--on-tertiary-container)">${t('hero.titleHighlight')}</span> ${t('hero.titleEnd')}`;
  }
  
  const heroSubtitle = document.querySelector('h1 + p');
  if (heroSubtitle) heroSubtitle.textContent = t('hero.subtitle');
  
  // CTA buttons in hero
  const heroCtas = document.querySelectorAll('[data-track-location="hero"]');
  if (heroCtas[0]) heroCtas[0].innerHTML = `<span class="msi">chat</span> ${t('hero.ctaWhatsApp')}`;
  if (heroCtas[1]) heroCtas[1].textContent = t('hero.ctaServices');
  
  // Hero features
  const heroFeatures = document.querySelectorAll('.flex.items-center.gap-2');
  if (heroFeatures[0]) heroFeatures[0].childNodes[1].textContent = t('hero.location');
  if (heroFeatures[1]) heroFeatures[1].childNodes[1].textContent = t('hero.hours');
  if (heroFeatures[2]) heroFeatures[2].childNodes[1].textContent = t('hero.response');
  
  // Value pillars
  const pillars = document.querySelectorAll('article h3');
  if (pillars[0]) {
    pillars[0].textContent = t('pillars.fast.title');
    pillars[0].nextElementSibling.textContent = t('pillars.fast.desc');
  }
  if (pillars[1]) {
    pillars[1].textContent = t('pillars.trust.title');
    pillars[1].nextElementSibling.textContent = t('pillars.trust.desc');
  }
  if (pillars[2]) {
    pillars[2].textContent = t('pillars.local.title');
    pillars[2].nextElementSibling.textContent = t('pillars.local.desc');
  }
  
  // Services section
  const servicesHeading = document.querySelector('.text-xs.font-bold.uppercase.tracking-widest.mb-2');
  if (servicesHeading) servicesHeading.textContent = t('services.heading');
  
  const servicesTitle = document.querySelector('.text-4xl.font-bold.tracking-tight');
  if (servicesTitle) servicesTitle.textContent = t('services.title');
  
  // How it works
  const howItWorksSection = document.querySelectorAll('section')[3];
  if (howItWorksSection) {
    const heading = howItWorksSection.querySelector('.text-xs');
    if (heading) heading.textContent = t('howItWorks.heading');
    
    const title = howItWorksSection.querySelector('.text-4xl');
    if (title) title.textContent = t('howItWorks.title');
    
    const subtitle = howItWorksSection.querySelector('.text-4xl + p');
    if (subtitle) subtitle.textContent = t('howItWorks.subtitle');
    
    const steps = howItWorksSection.querySelectorAll('.text-2xl');
    if (steps[0]) {
      steps[0].textContent = t('howItWorks.step1.title');
      steps[0].nextElementSibling.textContent = t('howItWorks.step1.desc');
    }
    if (steps[1]) {
      steps[1].textContent = t('howItWorks.step2.title');
      steps[1].nextElementSibling.textContent = t('howItWorks.step2.desc');
    }
    if (steps[2]) {
      steps[2].textContent = t('howItWorks.step3.title');
      steps[2].nextElementSibling.textContent = t('howItWorks.step3.desc');
    }
  }
  
  // Trust section
  const trustSection = document.querySelectorAll('section')[4];
  if (trustSection) {
    const title = trustSection.querySelector('.text-2xl');
    if (title) title.textContent = t('trust.title');
    
    const desc = trustSection.querySelector('.text-2xl + p');
    if (desc) desc.textContent = t('trust.desc');
  }
  
  // Big CTA
  const bigCta = document.querySelectorAll('section')[5];
  if (bigCta) {
    const title = bigCta.querySelector('.text-3xl');
    if (title) title.textContent = t('cta.title');
    
    const subtitle = bigCta.querySelector('.text-lg');
    if (subtitle) subtitle.textContent = t('cta.subtitle');
    
    const whatsappBtn = bigCta.querySelector('[data-track-location="cta_block"]');
    if (whatsappBtn) whatsappBtn.innerHTML = `<span class="msi">chat</span> ${t('hero.ctaWhatsApp')}`;
    
    const callBtn = bigCta.querySelector('a[href^="tel"]');
    if (callBtn) callBtn.textContent = t('cta.call');
  }
  
  // FAQ section
  const faqSection = document.querySelectorAll('section')[6];
  if (faqSection) {
    const title = faqSection.querySelector('.text-4xl');
    if (title) title.textContent = t('faq.title');
  }
  
  // Location section
  const locationSection = document.querySelectorAll('section')[7];
  if (locationSection) {
    const hoursLabel = locationSection.querySelector('.flex.items-center.gap-2');
    if (hoursLabel) hoursLabel.childNodes[1].textContent = t('location.hours');
    
    const officeLabel = locationSection.querySelectorAll('.flex.items-center.gap-2')[1];
    if (officeLabel) officeLabel.childNodes[1].textContent = t('location.office');
  }
}

// Run on page load
document.addEventListener('DOMContentLoaded', translateHomePage);
document.addEventListener('partials:ready', translateHomePage);
