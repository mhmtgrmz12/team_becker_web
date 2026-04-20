/* Global runtime config — single source of truth for the site. */
export const CONFIG = {
  brand: "Civic Concierge",
  tagline: "Fast, Modern Vehicle Registration in Rheine",
  // Canonical phone / WhatsApp — confirm with owner before launch.
  phoneDisplay: "+49 173 322 55 70",
  phoneDial: "+491733225570",
  whatsappNumber: "491733225570", // international format without leading + for wa.me
  email: "info@civic-concierge.de",
  address: {
    street: "Bayernstraße 90",
    postcode: "48429",
    city: "Rheine",
    country: "Germany",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Bayernstra%C3%9Fe+90%2C+48429+Rheine",
    lat: 52.2800,
    lng: 7.4200,
  },
  // API endpoints (n8n behind edge proxy)
  endpoints: {
    chat: "https://api.civic-concierge.de/webhook/chat",
    lead: "https://api.civic-concierge.de/webhook/lead",
    feedback: "https://api.civic-concierge.de/webhook/feedback",
  },
  analytics: {
    enabled: false, // flip on after consent
    provider: "plausible", // or "umami" | "ga4"
  },
  waFallbackEmailSubject: "Service request via civic-concierge.de",
  locale: "en",
};

// Make accessible to non-module code (partials, inline handlers)
if (typeof window !== "undefined") window.CC_CONFIG = CONFIG;
