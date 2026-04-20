# Civic Concierge — Rebuild Plan for the Rheine Vehicle Registration Service

Working brand name used in the Stitch designs: **Civic Concierge**. The real business is the Zulassungsdienst operated by Team Becker at Bayernstraße 90, 48429 Rheine (aloha-rent.com). Decide later whether to keep `aloha-rent` / `Team Becker` as the trading name, or adopt a new premium brand such as **Civic Concierge**, **Rheine Concierge**, or **Concierge Zulassung** for the new site. For the rest of this plan, "Civic Concierge" is used as a placeholder.

---

## A. Extracted summary of the current aloha-rent.com website

### Business identity
- **Operator:** Team Becker (Zulassungsdienst / vehicle registration service).
- **Main location:** Bayernstraße 90, 48429 Rheine (about 200 m behind the Steinfurt district registration office, Rheine branch).
- **Contact person on record (Datenschutz):** Christina Becker, Bayernstraße 101, 48429 Rheine; email `schilderwerkstattbecker@gmail.com` (this is the privacy contact and implies a separate "Schilderwerkstatt Becker" entity — confirm before publishing the new imprint).
- **Phone / WhatsApp:** 0173 322 55 70 (also listed elsewhere as 0176 20801888 — needs to be verified).
- **Email:** info@aloha-rent.com.

### Services offered today
- Vehicle registration (new & imported).
- Re-registration / ownership transfer / address change.
- Deregistration (including i-Kfz / digital).
- License plate sales, plate stamping, plate accessories.
- Wunschkennzeichen (custom plates) handling.
- Express processing (within 24 hours).
- WhatsApp-first customer communication.
- Services "outside opening hours" by appointment.

### Pricing signals
- Headline pricing: **"ab 29 Euro"** (from €29 incl. 19 % VAT for registration service fee).
- Custom plate reservation is free with the authority; Kreis Steinfurt currently charges ~€10.20 for the combination itself.
- Authority fees (KFZ-Zulassungsstelle) are on top of the service fee.

### Opening hours (from public content)
- Mon–Fri: 07:30–12:00.
- Monday afternoon: 13:30–17:00.
- Tuesday & Thursday afternoon: 13:30–15:30.
- Evenings (from 18:00) and weekends by appointment.
- (Exact hours still need a clean re-confirmation from the owner.)

### Structural weaknesses of the current site
1. **Text-heavy layout** with long German paragraphs, little scannable hierarchy, and no visual rhythm.
2. **Weak hero** — no single clear value proposition, no dominant CTA, no trust anchors above the fold.
3. **No conversion flow** — visitors are asked to read, not to act. WhatsApp is mentioned but never presented as a one-tap step-by-step request.
4. **No service cards** — each service is described in prose rather than in comparable, scannable modules.
5. **No documents module** — users cannot quickly understand what to bring.
6. **No pricing transparency** — headline "ab 29 €" appears, but there is no clear, itemised breakdown or "total you will pay".
7. **Trust signals are weak** — no reviews, no photos of the team/office, no process visualisation, no guarantee, no "near the authority" map.
8. **Mobile experience is generic** — no sticky WhatsApp/Call, no bottom nav for fast conversion.
9. **Locations / hours buried** — users cannot answer "can I still come today?" in one glance.
10. **Legal pages are dumped text** — Impressum and Datenschutz are unstyled walls.
11. **SEO is thin** — no schema, no clearly localised landing content, minimal page-level H1/H2 hierarchy.
12. **No chatbot / automation** — all pre-qualification is human work.

---

## B. Product vision summary

**One-liner:** The fastest, calmest way to get a car registered in Rheine and Kreis Steinfurt — with zero queues, zero guesswork, and a WhatsApp concierge who handles the bureaucracy.

**Positioning:** Premium-feeling but practical. Not a startup. Not a government portal. A modern local service that acts like a concierge desk at a high-end hotel. Clear. Calm. Reliable. In and out.

**Experience principles**
1. **Under 10 seconds to understand the value.** Hero + three benefits.
2. **Under 60 seconds to start a request.** Either chatbot, or WhatsApp wizard, or phone.
3. **Trust before friction.** Address + hours + map + reviews are visible before any form.
4. **No dead ends.** Every page has a sticky "Start via WhatsApp" and a fallback to call.
5. **Paper is the enemy.** Everything looks managed, digital, and handled for the user.

**Non-goals**
- No user accounts, no dashboards, no passwords.
- No traditional backend platform or PHP auth.
- No heavy CMS — content lives as JSON/markdown in the repo.
- No "Uber-style" real-time tracking — status updates are WhatsApp messages, not a live map.

---

## C. Recommended sitemap

```
/                          Homepage (conversion-first)
/services/                 Services overview (hub)
  /services/registration/              New vehicle registration
  /services/re-registration/           Re-registration / ownership transfer
  /services/deregistration/            Deregistration
  /services/license-plate/             License plate service (including Wunschkennzeichen)
  /services/express/                   Express / same-day service
/pricing/                  Transparent pricing table
/documents/                Required documents overview + downloads
/how-it-works/             Process, timeline, guarantees
/faq/                      Frequently asked questions
/contact/                  Contact, location, opening hours, map
/request/                  WhatsApp checkout wizard (multi-step)
/chatbot/                  Full-screen chatbot (optional deep link; bot also lives as floating widget everywhere)
/legal/imprint/            Impressum
/legal/privacy/            Datenschutz
/legal/terms/              AGB / Terms
/legal/cookies/            Cookie policy
/404.html                  Friendly 404 with "start a request" CTA
```

**Footer-only / utility pages:** `/sitemap.xml`, `/robots.txt`, `/manifest.webmanifest`.

Later-stage (post-launch) candidates: `/reviews/`, `/fleet-service/` (B2B), `/blog/` (local SEO), `/de/` (German locale).

---

## D. Conversion-first homepage structure

Ordered top-to-bottom, mobile-first. Each section has one job.

1. **Sticky top nav** — Brand · Services · Pricing · Documents · Contact · "WhatsApp" button (emerald).
2. **Hero** — H1 "Fast, modern vehicle registration in Rheine & Kreis Steinfurt." Subheading "Skip the queue. We handle registration, re-registration, and deregistration — with WhatsApp-first communication." Two CTAs: primary "Start via WhatsApp", secondary "View services". Small trust row: "200 m from the registration office · Mon–Fri from 07:30 · Reply in minutes".
3. **Three value pillars** — Fast processing · Trustworthy handling · Local experts (Rheine & Kreis Steinfurt).
4. **Service cards row (5 cards)** — Registration · Re-registration · Deregistration · License plate · Express. Each card has icon, one-line benefit, "From €X" price, and CTA.
5. **How it works — 3 steps** — Send request → We verify documents → You get your plates. Visual stepper, estimated timing under each step.
6. **Required documents teaser** — Small bento grid of 4 common docs (ID, eVB, SEPA, Zulassungsbescheinigung II) with "See full list →".
7. **Pricing transparency strip** — "Our fee from €29 + authority fees. No surprises." Link to `/pricing/`.
8. **Trust row** — Google review score (once available), "5★" tile, team photo placeholder, "Near the Rheine authority" map card.
9. **WhatsApp CTA block** (dark gradient) — "Ready to skip the line?" with "Start your request via WhatsApp" button and "Prefer to call? 0173 322 55 70".
10. **FAQ preview (5 items)** — Accordion; link to `/faq/`.
11. **Location + hours card** — Address, map, today's hours highlighted (JS computes "Open now / closed").
12. **Footer** — Brand, quick links, legal, social, language toggle placeholder (EN → DE later).
13. **Floating chatbot launcher** (bottom-right) on all pages.
14. **Mobile bottom nav** — WhatsApp · Call · Status/FAQ.

---

## E. Full page structure for all main pages

### E.1 Services overview (`/services/`)
Hero → 5 service cards (reused from homepage) → Comparison table (service × price × turnaround × required docs) → Trust block → FAQ preview → Final WhatsApp CTA.

### E.2 Service detail (shared template, used for all 5 services)
1. Breadcrumb + service label badge.
2. Hero: H1 service name, one-paragraph promise, two CTAs (WhatsApp, View pricing).
3. Required documents — bento grid (4–6 docs), each card has icon, title, 1-sentence explanation, and an optional "how to get it" tooltip.
4. Process — 3-step vertical stepper customised per service (e.g. registration vs. deregistration).
5. Pricing card + dark CTA card (side-by-side on desktop, stacked on mobile).
6. Extras / add-ons — license plate stamping, Wunschkennzeichen, courier pickup.
7. Timeline — expected duration, same-day availability.
8. FAQ (5 items filtered to this service).
9. Related services row.
10. Footer.

### E.3 Pricing (`/pricing/`)
- Service-fee table (service name · service fee · typical authority fee · total estimate).
- Express surcharge row.
- Wunschkennzeichen cost explainer.
- "What's included / not included" two-column block.
- Clear note: authority fees are set by Kreis Steinfurt and may change.
- CTA block.

### E.4 Documents (`/documents/`)
- Master required-documents bento grid, filterable by service (JS tabs).
- Each document: icon, title, short description, "Download form" button where applicable (PDF links).
- "Lost a document? Here's what to do" helper block.
- CTA: "Not sure what you need? Ask on WhatsApp."

### E.5 How it works (`/how-it-works/`)
- 4-step vertical timeline with illustrations/photos.
- Turnaround expectations.
- "Secure document handling" trust block (GDPR, courier/lockbox).
- Express service highlight.
- CTA.

### E.6 FAQ (`/faq/`)
- Search input + category chips (Registration, Plates, Documents, Timing, Payment).
- Accordion FAQ groups.
- "Didn't find your answer?" WhatsApp CTA.

### E.7 Contact (`/contact/`)
Inspired by `contact_chatbot_ui/` and `contact_page_mobile/` screens.
- Hero: "Get in touch with the concierge."
- Channel cards: Call · WhatsApp · Email.
- Office card: address, hours list with today's row highlighted, "Get directions".
- Embedded map (static Mapbox/Leaflet or `<iframe>` OSM).
- Legal information block.
- Embedded chatbot panel (docked on desktop, floating on mobile).

### E.8 Request wizard (`/request/`)
Matches `whatsapp_checkout_assistant/`. Three visible steps:
- Step 1 — Service (single-select: Registration / Re-registration / Deregistration / Plates / Express).
- Step 2 — Extras (multi-select: Wunschkennzeichen, Plate stamping, Courier pickup, Express, Foreign vehicle import).
- Step 3 — Details (Name, Phone, Email optional, Preferred date/time, Short note, Consent checkbox).
- Summary drawer (mobile) / sticky summary panel (desktop) that updates as the user progresses.
- Final CTA: "Open WhatsApp with my request" — builds prefilled `wa.me` link.
- Fallback: "WhatsApp not available? Send by email" + "Call us".

### E.9 Chatbot (`/chatbot/`)
Full-screen conversational UI; same widget that floats sitewide, opened in dedicated route for deep-link sharing.

### E.10 Legal pages (`/legal/*`)
Follows `legal_page_style_desktop/`: left sidebar nav (Imprint · Privacy · Terms · Cookies), right content with structured sections, readable typography, light-mode reading cards, clear last-updated date.

---

## F. Chatbot strategy and conversation tree

### Role of the chatbot
The chatbot is a **qualifier and router**, not a full agent. Its job is to:
1. Answer top FAQs instantly.
2. Identify the user's service and urgency.
3. Pre-collect just enough info (3–5 fields).
4. Hand the user to WhatsApp with a prefilled, structured message.
5. Offer a human escalation path ("Talk to the team").

### Top-level intents
- `greeting`
- `ask_price`
- `ask_documents`
- `ask_hours_location`
- `start_request`
- `express_service`
- `wunschkennzeichen`
- `foreign_vehicle_import`
- `talk_to_human`
- `fallback`

### Conversation tree (simplified)

```
Welcome → "Hi! I'm the Civic Concierge assistant. What would you like to do today?"
 ├── Quick replies:
 │    • Register a vehicle
 │    • Re-register / change owner
 │    • Deregister a vehicle
 │    • Get license plates
 │    • Ask about pricing
 │    • Ask about documents
 │    • Talk to the team
 │
 ├── [Register a vehicle]
 │    → "New vehicle or used?"
 │      ├── New / import → explain eVB + SEPA + ID + Zulassungsbescheinigung II.
 │      └── Used → explain additional docs (HU report, previous papers).
 │    → "Do you want Wunschkennzeichen?" Yes / No → collect reservation code if yes.
 │    → "Is it urgent (same-day / express)?" Yes / No.
 │    → Collect: name, phone → summarise → button "Continue on WhatsApp".
 │
 ├── [Re-register]
 │    → "Same owner / new owner / address change?" branches.
 │    → Same collection pattern → WhatsApp handoff.
 │
 ├── [Deregister]
 │    → "Permanent or temporary?"
 │    → Collect VIN or plate, name → WhatsApp handoff.
 │
 ├── [License plates]
 │    → "Do you already have a reservation code?" Yes / No.
 │    → WhatsApp handoff.
 │
 ├── [Pricing] → Send pricing card (service fee, authority fee ranges, express surcharge) → CTA.
 │
 ├── [Documents] → Send document list per service → CTA.
 │
 ├── [Hours / location] → Show address + today's hours (computed) + map link.
 │
 ├── [Talk to team] → Offer WhatsApp / Phone / email; optionally schedule callback.
 │
 └── [Fallback] → "I didn't catch that. Would you like to continue on WhatsApp?"
```

All branches end on the same structured outcome: **hand off to WhatsApp with a prefilled message** or **book a call**.

### Tone
Short sentences. Calm. Helpful. Never pushy. Never asks for more than 1 thing per turn. Always has a visible "Continue on WhatsApp" escape.

### UI elements supported
Text bubbles, quick-reply buttons, option cards (service/extras), form inputs (name/phone), file-upload hint (for later), typing indicator, error toast, "connected to a human" banner when handed off.

---

## G. n8n-based chatbot architecture

### High-level flow
```
Browser (chat widget JS)
   │  HTTPS POST JSON
   ▼
Edge proxy (Cloudflare Worker / Netlify Function / Vercel Edge)
   │  adds secret header, rate-limits, strips IP
   ▼
n8n Webhook (/webhook/chat)
   │
   ├── Session store (n8n variables / Redis / Airtable)
   ├── Intent detection (rules / OpenAI / LLM node)
   ├── Knowledge base lookup (static JSON in n8n / Airtable / Notion)
   ├── Routing (per intent → sub-workflow)
   └── Response builder
   │
   ▼
Response JSON back to browser → widget renders
   │
   └── On "continue on WhatsApp" → browser opens wa.me link with prefilled text,
       n8n also stores the lead in Airtable / Google Sheet / Notion and (optionally)
       sends an internal notification to the team's WhatsApp / Slack / email.
```

### Endpoints / webhooks
- `POST /webhook/chat` — main message handler.
- `POST /webhook/lead` — called by the request wizard just before WhatsApp redirect.
- `POST /webhook/feedback` — optional chatbot rating.
- `GET  /webhook/health` — uptime check.

All behind a custom domain like `api.civic-concierge.de` with TLS.

### Request / response contract
```json
// Request
{
  "sessionId": "a7f3-...uuid",
  "visitorHash": "sha256(ip+ua+salt)",     // anonymised
  "message": "how much does it cost?",
  "intentHint": null,                      // or "ask_price" if from a button
  "context": { "page": "/services/registration/", "locale": "en" },
  "consent": { "chat": true, "analytics": false },
  "ts": 1713600000
}

// Response
{
  "sessionId": "a7f3-...uuid",
  "reply": {
    "type": "message",                     // message | card | form | handoff
    "text": "Our service fee starts at €29 incl. VAT...",
    "quickReplies": ["Documents", "Start a request", "Talk to team"],
    "card": null,
    "handoff": null
  },
  "state": "in_flow"                       // in_flow | collecting | handoff
}
```

### Anonymous visitor sessions (no login)
- First request: browser generates a `sessionId` via `crypto.randomUUID()` and stores it in `sessionStorage`. Optional `visitorId` in `localStorage` (consented).
- n8n keeps session state by `sessionId` with a TTL (e.g., 24 h) in a small key/value store (Redis, Upstash, or even an Airtable base).
- Session record shape:
  ```json
  {
    "sessionId": "...",
    "visitorHash": "...",
    "locale": "en",
    "createdAt": 1713600000,
    "intent": "start_request",
    "collected": { "service": "registration", "name": null, "phone": null },
    "history": [ { "role": "user|bot", "text": "..." } ]
  }
  ```
- No PII is stored unless the user typed it. All storage is subject to the cookie banner.

### Conversation state management
- Held in n8n (the source of truth) keyed by `sessionId`.
- Frontend sends only the new message; server rehydrates state.
- State machine per intent (e.g., `REGISTER → ASK_NEW_OR_USED → ASK_WUNSCHKENNZEICHEN → ASK_URGENCY → COLLECT_NAME → COLLECT_PHONE → HANDOFF`).

### Rate limiting and abuse prevention
- Edge proxy enforces 30 req/min/IP and 300 req/day/sessionId.
- Payload size limit ~8 KB.
- Basic bot detection: reject requests without `Origin` matching the site, or with obvious SSRF strings.
- Token-bucket in n8n keyed by `visitorHash`.
- A shared secret header (`X-Concierge-Key`) injected by the edge proxy so n8n refuses direct calls.
- Optional Turnstile / hCaptcha on the first message (invisible) if abuse appears.

### Intent routing
- Option 1 (cheap): rules-first (keyword + button-id) with a small OpenAI classifier fallback for free-text.
- Option 2 (robust): one small LLM call per turn using a system prompt that restricts to a fixed intent enum. Keep tokens tiny by sending only the last 6 turns.
- Results dispatched to sub-workflows in n8n (one per intent).

### Guiding users to WhatsApp
- Every terminal node includes a `handoff` object:
  ```json
  "handoff": {
    "channel": "whatsapp",
    "phone": "+491733225570",
    "prefill": "Hello Civic Concierge,\nI'd like New Registration. I have eVB, ID, SEPA ready. Preferred time: tomorrow 10:00. – Maria (+49...)"
  }
  ```
- Frontend opens `https://wa.me/491733225570?text=<encoded>` in a new tab.
- If `navigator.userAgent` indicates a non-mobile browser and the user is offline or WhatsApp Web fails, show fallback (`mailto:` or call).

### Human handoff
- Trigger: user clicks "Talk to the team", or intent classifier returns `talk_to_human`, or three consecutive fallbacks.
- n8n:
  1. Saves the conversation summary to Airtable/Sheet.
  2. Pushes an internal notification (Slack, email, team WhatsApp group).
  3. Returns a `handoff` bubble to the user: "I'm connecting you now. You can continue in WhatsApp or wait here — a team member typically replies within X minutes during office hours."
- When staff replies in WhatsApp, the web chat is already parked; no live bridge needed in v1.

### Logs and lead data
- **Leads** (name, phone, desired service, extras, preferred time) → Airtable / Google Sheets / Notion database.
- **Conversation logs** → stored 30 days for quality/training, then purged automatically (n8n cron).
- **PII minimisation** — no IP stored, only a salted hash; consent state stored per record.
- Internal dashboard can be a shared Airtable view with filters.

### What belongs in frontend JS vs. n8n

| Concern | Frontend | n8n |
| --- | --- | --- |
| Widget UI, rendering bubbles | ✅ | ❌ |
| Session ID creation | ✅ | ❌ |
| Quick-reply buttons | ✅ (from server response) | ✅ (defines them) |
| Prefill WhatsApp link | ✅ (builds & opens) | ✅ (provides text) |
| Intent detection, NLP, routing | ❌ | ✅ |
| Knowledge base (FAQ, prices, docs) | ❌ | ✅ |
| Conversation state | ❌ | ✅ |
| Rate limiting | ✅ light (edge) | ✅ strong |
| Lead storage | ❌ | ✅ |
| Sending team notifications | ❌ | ✅ |

### Required webhooks
- `POST /webhook/chat` — chat turn.
- `POST /webhook/lead` — request wizard final step.
- `POST /webhook/feedback` — thumbs up/down.
- `GET  /webhook/kb` (optional) — returns pricing/doc JSON to the frontend so the static site stays in sync without a rebuild.

---

## H. WhatsApp checkout flow

### Goal
Feel like a 60-second intake form, not e-commerce. Always end in a prefilled WhatsApp message the user just has to press "send" on.

### Flow (matches `whatsapp_checkout_mobile/` and `whatsapp_checkout_assistant/`)
1. **Entry points** — "Start a request" CTAs sitewide, bottom nav, chatbot handoff, service card CTAs.
2. **Step 1 — Service** (single-select): Registration · Re-registration · Deregistration · License plates · Express.
3. **Step 2 — Extras** (multi-select per service): Wunschkennzeichen, Plate stamping, Courier pickup, Express (+surcharge), Foreign vehicle, Fleet.
4. **Step 2.5 — Required documents preview** (read-only card) — shows what the user should prepare.
5. **Step 3 — Details** — Full name, Phone, Email (optional), Vehicle hint (plate / VIN / make — optional), Preferred date/time slot, Short note, GDPR consent checkbox.
6. **Review** — summary with edit links.
7. **Lead capture** — `POST /webhook/lead` **before** redirect. Response contains the signed `whatsappUrl` and a fallback `mailtoUrl`.
8. **Redirect** — `window.open(whatsappUrl, '_blank')`. If blocked, show a "Tap to open WhatsApp" button.
9. **Fallback path** — if the device can't open WhatsApp (corporate device, desktop without WhatsApp Web), show: "Open in WhatsApp Web" button, "Call us" button, "Send by email" button with the same prefilled text.
10. **Confirmation screen** — "Your request is ready in WhatsApp. We usually reply within X minutes during office hours. Feel free to close this tab."

### Prefilled message template
```
Hello Civic Concierge,

Service: {{service}}
Extras: {{extras_csv}}
Preferred time: {{preferred_time}}

Name: {{name}}
Phone: {{phone}}
{{#email}}Email: {{email}}{{/email}}
{{#vehicle}}Vehicle: {{vehicle}}{{/vehicle}}

Note: {{note}}

(sent from civic-concierge.de)
```

### Why capture the lead before the redirect
- WhatsApp handoffs are lossy; not every message actually arrives.
- Lets the team follow up even if the user never presses "send".
- Enables analytics: see who dropped off where.

### Things explicitly not in v1
- No real-time WhatsApp Business API (expensive, heavy setup). We use `wa.me` deep links.
- No payments on-site. Price confirmation happens in WhatsApp.

---

## I. Recommended frontend architecture (HTML / CSS / JavaScript)

### Stack decision
- **Plain HTML + a build-less static site** — each page is a real `.html` file for maximum portability and simplicity. Perfect fit for cheap hosting (Netlify, Cloudflare Pages, Hostinger, any static host).
- **CSS:** Tailwind via Play CDN during prototyping (already used in the Stitch output) but replaced at launch with a **pre-built Tailwind CSS file** using the Tailwind CLI or **pure CSS with custom properties** if the team wants no build step. Design tokens come from the Civic Concierge design system (`DESIGN.md`).
- **JavaScript:** vanilla ES modules. No framework. No React. Progressive enhancement.
- **Optional build step:** a tiny `npm run build` that (a) bundles JS with esbuild, (b) runs Tailwind CLI to produce `app.css`, (c) minifies HTML. The user can skip the build and ship raw files if they want.

### Rendering strategy
- Fully static for all marketing pages.
- Wizard and chatbot are dynamic in the browser, backed by n8n webhooks.
- All shared sections (header, footer, nav, chatbot widget, cookie banner) are injected via a tiny client-side include (`<div data-include="partials/header.html"></div>`) — no server required.

### Accessibility
- Semantic HTML (`<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`, `<details>/<summary>` for FAQs).
- All forms have labels, `aria-describedby`, and visible focus rings (`outline-variant` at 15 % or a 2 px navy glow per design system).
- Contrast ratios respect WCAG AA on the Civic Concierge palette (navy `#041627` on `#F7F9FC` is fine; emerald CTA text colour must be verified).
- Keyboard support for wizard steps, chatbot widget, and accordion.

### Performance
- No heavy libraries. Lighthouse target: 95+ across the board on 4G.
- Images: lazy-loaded, WebP/AVIF, responsive `srcset`.
- Fonts: self-host Inter in 400/500/600/700, `font-display: swap`.
- Tailwind: purge all, keep one small `app.css`.
- Service worker (optional in v2): cache static shell for instant navigation.

### Modularity
- Reusable ES-module components: `chatbot.js`, `wizard.js`, `openNowBadge.js`, `cookieBanner.js`, `carousel.js`.
- Shared data files (see section J) feed service cards, pricing, documents, FAQ from a single source.

---

## J. Suggested content / data structure

Keep all copy and business data in version-controlled JSON under `/assets/data/`. Pages read from these files. One place to edit → everywhere updates.

```
/assets/data/
  site.json           // global: brand, phone, whatsapp, address, hours
  services.json       // array of services (id, name, blurb, icon, price, turnaround, extras[])
  extras.json         // optional add-ons with price & description
  documents.json      // per service: required docs (id, icon, title, desc, link?)
  pricing.json        // rows for pricing table
  faq.json            // { categoryId, question, answer, relatedServiceIds }
  reviews.json        // optional pulled Google reviews (static copy for v1)
  legal.json          // imprint, privacy, terms, cookies structured sections
  i18n/en.json        // UI strings EN
  i18n/de.json        // UI strings DE (later)
```

Minimal schemas:

```json
// services.json
[
  {
    "id": "registration",
    "slug": "registration",
    "name": "Vehicle Registration",
    "icon": "directions_car",
    "blurb": "Register a brand-new, imported, or purchased vehicle in Rheine.",
    "serviceFeeFrom": 29,
    "currency": "EUR",
    "authorityFeeHint": "~€28–€40",
    "turnaround": "24–48 h",
    "requiredDocumentIds": ["id_card", "evb", "sepa", "zb2"],
    "extraIds": ["wunschkennzeichen", "plate_stamping", "express", "courier"]
  }
]
```

Copy is written in English now; German copy is added later in `i18n/de.json` and a `<html lang>` + `<link rel="alternate">` switch is wired up.

---

## K. Event tracking and analytics plan

### Tool
Use **Plausible** or **Umami** — privacy-first, no cookies, no consent banner friction. GA4 only if the team really needs it (then put behind the consent banner).

### Key events

| Event | When | Metadata |
| --- | --- | --- |
| `view_home` | Homepage load | locale |
| `view_service` | Service detail load | `serviceId` |
| `click_whatsapp_cta` | Any WhatsApp button click | `location` (hero, sticky, card, footer), `serviceId?` |
| `click_call_cta` | Phone CTA click | `location` |
| `open_chatbot` | Chat widget opened | `entry` (floating, cta, chatbot_page) |
| `chatbot_intent` | Intent detected | `intent` |
| `chatbot_handoff` | Handoff to WhatsApp | `serviceId?` |
| `wizard_start` | Wizard step 1 shown | — |
| `wizard_step_complete` | Step completed | `stepIndex`, `serviceId?` |
| `wizard_submit` | Lead submitted to n8n | `serviceId`, extras count |
| `whatsapp_redirect` | Opened wa.me | `serviceId?` |
| `faq_open` | Accordion opened | `questionId` |
| `download_form` | PDF download click | `formId` |
| `call_open_hours` | Clicks call while closed | — |

### Funnels to watch
1. Hero → WhatsApp (cold).
2. Hero → Service detail → WhatsApp.
3. Hero → Wizard → WhatsApp (warm lead).
4. Chatbot → Handoff.
5. Documents / Pricing → WhatsApp.

### Dashboards
Weekly: total leads, channel split (chatbot vs wizard vs raw CTA), conversion rate per service, FAQ top questions, drop-off step in wizard.

---

## L. SEO and local content strategy

### Priorities
1. **Local intent** — Rheine, Kreis Steinfurt, nearby towns (Emsdetten, Neuenkirchen, Hörstel, Mettingen, Ibbenbüren, Salzbergen).
2. **Service intent** — "auto anmelden Rheine", "zulassungsdienst Rheine", "kfz ummelden Rheine", "auto abmelden Rheine", "wunschkennzeichen Rheine".
3. **Urgency intent** — "kfz zulassung express Rheine", "auto anmelden ohne termin Rheine".

### On-page
- One H1 per page, matching a target query.
- Semantic H2/H3 hierarchy.
- Slugs in English now, German later; use `rel="alternate" hreflang` when DE is published.
- `schema.org` JSON-LD on every page:
  - `LocalBusiness` + `AutomotiveBusiness` with NAP, geo, opening hours, sameAs links.
  - `Service` schema per service page.
  - `FAQPage` on FAQ pages.
  - `BreadcrumbList` where relevant.
- Canonical URLs, OG tags, Twitter cards, favicon set.
- `sitemap.xml` auto-generated from a tiny script.

### Off-page
- Verified Google Business Profile with photos, hours, posts, and reviews.
- Bing Places.
- Local directories: GelbeSeiten, 11880, Das Örtliche, Branchenbuch Rheine.
- Invite 3–5 past customers per week to review on Google.

### Content depth (post-launch)
- Short local guides (`/blog/`): "How to register an imported car in Rheine", "What a Wunschkennzeichen really costs in Kreis Steinfurt", "i-Kfz vs. in-person deregistration". These drive long-tail queries and trust.

---

## M. GDPR / legal UX considerations

### Consent banner
- Two-tier, on first visit, GDPR-compliant. Options: **Accept essentials only** / **Accept all**. No "reject" hidden.
- Categories: Essential (on by default, non-toggleable), Analytics, Chatbot (only if using a third-party LLM that processes content outside EU — otherwise bundle into Essential since it's first-party).
- Store the decision in `localStorage` with a timestamp and a version number so we can force re-consent if policy changes.
- Easy re-opening: a "Privacy settings" link in the footer.

### Data minimisation
- Chatbot should not persist PII unless a user has agreed in-flow.
- Forms should ask for the minimum: name + phone (email optional, email only required when WhatsApp fails).
- IP addresses must not be logged in plain text; hash or drop them.

### Legal pages
- **Impressum (Imprint):** Name of the operator (Christina Becker / Team Becker), address, phone, email, VAT ID if applicable, responsible person per §§ 5 TMG, 18 MStV. Clarify during onboarding whether it's a sole proprietorship or a GmbH — the content varies.
- **Datenschutz (Privacy):** Describe what is collected on the site (forms, chatbot, analytics), legal basis (Art. 6 GDPR), retention periods, rights, contact for the DPO (if any), third-party processors (n8n host, hosting provider, Google Fonts — self-host to avoid), Meta (WhatsApp) reference.
- **AGB / Terms:** Service scope, pricing structure, payment terms, authority fees pass-through, cancellation policy, liability.
- **Cookies:** Categorise and name each cookie/local-storage key used.

### Data-processing notes
- WhatsApp is owned by Meta — the privacy notice must mention that by using WhatsApp, data is transferred to Meta.
- n8n hosting should be EU-based; mention the subprocessor and link to its DPA.
- A short "data flow" diagram in the privacy policy helps with accountability.

---

## N. Reusable component system

Inspired by the Civic Concierge design system and the Stitch screens.

### Design tokens (`/assets/css/tokens.css`)
Map every Material token from `DESIGN.md` to a CSS custom property:
```
--primary: #041627;
--primary-container: #1a2b3c;
--tertiary-fixed: #6ffbbe;     /* emerald CTA */
--on-tertiary-fixed: #002113;
--surface: #f7f9fc;
--surface-container-low: #f2f4f7;
--surface-container-lowest: #ffffff;
--secondary: #545f72;
--outline-variant: #c4c6cd;
--radius-md: 0.75rem;
--radius-2xl: 1.5rem;
--shadow-card: 0 8px 30px rgba(25,28,30,0.04);
--shadow-glow: 0 8px 24px rgba(111,251,190,0.20);
```

### Component library (vanilla)
- `Header` — sticky top nav, glass background, desktop menu + mobile menu drawer.
- `BottomNav` — mobile-only, WhatsApp / Call / Status.
- `Footer` — brand, quick links, legal links, language toggle.
- `Button` — variants: `primary` (emerald), `secondary` (dark navy container), `ghost`.
- `ServiceCard` — icon circle, title, blurb, "From €X", CTA.
- `ValueCard` — icon, title, 1–2 sentence body.
- `DocumentCard` — used in bento grid.
- `StepperVertical` — 3 steps, coloured dots, gradient connectors.
- `StepperHorizontal` — wizard header.
- `PricingCard` — price, feature list, CTA.
- `CTACardDark` — gradient navy, emerald button.
- `FAQAccordion` — `<details>/<summary>` based, chevron rotates.
- `MapCard` — static map + address + "Open now / closed" pill.
- `OpenNowBadge` — JS computes today's row against `site.json` hours.
- `ReviewCard` — star, text, author (from `reviews.json`).
- `ChatbotWidget` — floating launcher + panel; supports bubbles, quick replies, typing indicator, handoff banner.
- `WizardShell` — 3-step progress, summary panel, navigation.
- `CookieBanner` — two-tier consent with re-open handle.
- `LanguageToggle` — EN/DE, future.

### Interaction patterns
- Hover on cards: `translateY(-2px)` + shadow bump.
- Focus states: 2 px navy glow (`--surface-tint`).
- Accordion: 200 ms rotate on chevron, 200 ms fade on body.
- Chatbot: spring-out from launcher, 24-px blur backdrop, smooth scroll-to-bottom.

---

## O. Step-by-step implementation roadmap

Think in 1-week sprints, solo-dev friendly. Dates are relative.

**Sprint 0 — Foundations (2–3 days)**
- Finalise brand name decision (Civic Concierge vs. aloha-rent vs. other).
- Lock design tokens + component inventory from `DESIGN.md`.
- Set up repo, folder skeleton (see section P), Tailwind build or token CSS, Prettier/ESLint.
- Register domain, set up Cloudflare or Netlify, set up `api.` subdomain for n8n.
- Spin up n8n (Hetzner / Railway / self-host) + HTTPS + shared-secret auth.
- Set up Airtable or Google Sheet bases for leads and logs.

**Sprint 1 — Homepage + shared shell (5–6 days)**
- Build `Header`, `Footer`, `BottomNav`, `CookieBanner`.
- Build `index.html` section-by-section, mobile-first.
- Wire `site.json` and `services.json`.
- Ship skeleton to production under `/preview/`.

**Sprint 2 — Service detail template + services hub (4–5 days)**
- Build the shared template once; generate the 5 service pages from `services.json` using a small Node script (or copy-paste on launch).
- Build `/services/` overview with comparison table.
- Implement `OpenNowBadge` and `MapCard`.

**Sprint 3 — Pricing, Documents, FAQ, How it works (3–4 days)**
- Build the 4 remaining content pages from JSON.
- Add `FAQPage` schema and in-page search.

**Sprint 4 — Contact + Legal + SEO base (3 days)**
- Build `/contact/` with channels, map, hours, embedded chatbot slot.
- Build legal pages using the legal template (left sidebar nav).
- JSON-LD schemas, `sitemap.xml`, `robots.txt`, OG tags, favicons.

**Sprint 5 — Chatbot UI + n8n backend (5–7 days)**
- Frontend: floating widget, `/chatbot/` full page, message rendering, quick replies, handoff logic.
- n8n: `/webhook/chat`, session store, intent classifier, knowledge base JSON, handoff node, notifications to Slack/WhatsApp.
- Edge proxy with shared secret + rate limiting.

**Sprint 6 — WhatsApp checkout wizard (4–5 days)**
- Three-step wizard from `whatsapp_checkout_assistant/`.
- Lead `POST` to n8n before redirect.
- Fallbacks for desktop / no-WhatsApp.

**Sprint 7 — Analytics + polish + accessibility (3 days)**
- Plausible/Umami install, event wiring, dashboards.
- Lighthouse / axe pass on every page.
- Copy review; tone consistency pass.

**Sprint 8 — Launch + German translation (ongoing)**
- Hand copy to a native German reviewer, fill `i18n/de.json`.
- Enable language toggle.
- Google Business Profile refresh + review campaign.

---

## P. Final file / folder architecture

```
/
├── README.md
├── package.json                 (optional; only if build step is used)
├── netlify.toml | vercel.json   (hosting config)
├── robots.txt
├── sitemap.xml                  (generated by /scripts/build-sitemap.js)
├── manifest.webmanifest
├── favicon.ico
├── index.html                   (Home)
├── 404.html
│
├── services/
│   ├── index.html               (Services hub)
│   ├── registration/index.html
│   ├── re-registration/index.html
│   ├── deregistration/index.html
│   ├── license-plate/index.html
│   └── express/index.html
│
├── pricing/index.html
├── documents/index.html
├── how-it-works/index.html
├── faq/index.html
├── contact/index.html
├── request/index.html           (WhatsApp wizard)
├── chatbot/index.html           (full-screen bot)
│
├── legal/
│   ├── imprint/index.html
│   ├── privacy/index.html
│   ├── terms/index.html
│   └── cookies/index.html
│
├── partials/                    (injected by /assets/js/include.js)
│   ├── header.html
│   ├── footer.html
│   ├── bottom-nav.html
│   ├── chatbot.html
│   └── cookie-banner.html
│
├── assets/
│   ├── css/
│   │   ├── tokens.css
│   │   ├── base.css
│   │   ├── components.css
│   │   └── utilities.css        (or one compiled tailwind.css)
│   ├── js/
│   │   ├── config.js            (API endpoints, phone, brand constants)
│   │   ├── include.js           (HTML partial injector)
│   │   ├── open-now.js
│   │   ├── faq.js
│   │   ├── wizard.js
│   │   ├── wizard-templates.js
│   │   ├── chatbot.js
│   │   ├── cookie-banner.js
│   │   ├── analytics.js
│   │   └── utils.js
│   ├── data/
│   │   ├── site.json
│   │   ├── services.json
│   │   ├── extras.json
│   │   ├── documents.json
│   │   ├── pricing.json
│   │   ├── faq.json
│   │   ├── reviews.json
│   │   ├── legal.json
│   │   └── i18n/
│   │       ├── en.json
│   │       └── de.json
│   ├── forms/                   (PDF downloads: SEPA, Vollmacht, etc.)
│   ├── img/                     (optimised WebP/AVIF)
│   └── fonts/                   (Inter woff2 self-hosted)
│
├── scripts/                     (tiny Node helpers)
│   ├── build-sitemap.js
│   ├── build-pages.js           (generates service pages from services.json)
│   └── check-links.js
│
└── n8n/                         (workflow exports; deploys to external n8n)
    ├── chat.workflow.json
    ├── lead.workflow.json
    └── feedback.workflow.json
```

### Notes on this structure
- The site works **without a build step**. If you skip `npm`, just edit the `.html` files directly and let `/assets/js/include.js` inject the partials at runtime.
- The `n8n/` folder only holds exported workflow JSON for version control — the actual n8n runs on its own host.
- All business-editable content lives in `/assets/data/`. That's the one folder a non-technical team member can maintain (e.g., to update prices or hours).
- When German is added later, add one file (`i18n/de.json`) and the toggle flips copy without rebuilding pages.

---

## Open decisions for you

1. **Brand name** — Keep `aloha-rent.com` / Team Becker? Adopt a new premium name (Civic Concierge / Rheine Concierge / Concierge Zulassung)? This affects domain, Imprint, and the logo lockup.
2. **Canonical phone / WhatsApp number** — public sources show both `0173 322 55 70` and `0176 20801888`. One must be the single source of truth before launch.
3. **Legal entity** — sole proprietorship vs. GmbH vs. "Schilderwerkstatt Becker". Needed for the Imprint.
4. **Hosting** — Netlify / Cloudflare Pages / Hostinger? Affects deploy scripts and DNS.
5. **n8n host** — self-hosted (Hetzner Cloud ~€5/mo) or managed (n8n Cloud)?
6. **Review source** — pull from Google Business Profile (via a periodic n8n job) or curate statically in `reviews.json` at launch.
7. **LLM usage in the chatbot** — rules-only first, or OpenAI-backed classification behind the consent banner?
8. **Lead storage** — Airtable (easy, hosted), Google Sheets (free), or Notion (nice UI). Affects GDPR wording.

Once these are locked, the roadmap in section O can start immediately with Sprint 0.
