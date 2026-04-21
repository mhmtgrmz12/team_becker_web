# Civic Concierge Chatbot - n8n Integration Reference

## Overview
This document contains all conversation flows, responses, and logic for the Civic Concierge chatbot. The n8n workflow should use this as a reference to select appropriate responses based on user intent, rather than generating responses dynamically.

---

## Configuration

### Contact Information
- **WhatsApp Number**: +491733225570
- **Phone Display**: +49 173 322 55 70
- **Email**: info@civic-concierge.de
- **Address**: Bayernstraße 90, 48429 Rheine, Germany

### Office Hours
- **Monday**: 07:30-17:00
- **Tuesday**: 07:30-15:30
- **Wednesday**: 07:30-12:00
- **Thursday**: 07:30-15:30
- **Friday**: 07:30-12:00
- **Saturday/Sunday**: By appointment only (from 18:00)

### Response Time
- Within minutes during office hours

---

## Conversation Flow Structure

### Intent: GREET
**Trigger**: User opens chatbot or says hello

**Response (EN)**: 
"Hi! I'm the Civic Concierge assistant. I can help you with vehicle registration in Rheine. What would you like to do?"

**Response (DE)**: 
"Hallo! Ich bin der Civic Concierge Assistent. Ich kann Ihnen bei der Fahrzeugzulassung in Rheine helfen. Was möchten Sie tun?"

**Response (TR)**: 
"Merhaba! Ben Civic Concierge asistanıyım. Rheine'da araç kaydı konusunda size yardımcı olabilirim. Ne yapmak istersiniz?"

**Response (AR)**: 
"مرحباً! أنا مساعد Civic Concierge. يمكنني مساعدتك في تسجيل المركبات في راينه. ماذا تريد أن تفعل؟"

**Quick Reply Options**:
1. Register a vehicle → Intent: START_REQUEST (serviceKey: newRegistration)
2. Re-register (Ummeldung) → Intent: START_REQUEST (serviceKey: reRegistration)
3. Deregister (Abmeldung) → Intent: START_REQUEST (serviceKey: deregistration)
4. Get license plates → Intent: START_REQUEST (serviceKey: licensePlates)
5. Ask about pricing → Intent: ASK_PRICE
6. What documents do I need? → Intent: ASK_DOCUMENTS
7. Talk to the team → Intent: TALK_TO_HUMAN

---

### Intent: START_REQUEST
**Trigger**: User selects a service

**Response (EN)**: 
"Great! You selected: {service}. Would you like express service (same-day) or standard processing?"

**Response (DE)**: 
"Großartig! Sie haben gewählt: {service}. Möchten Sie Express-Service (am selben Tag) oder Standardbearbeitung?"

**Response (TR)**: 
"Harika! Seçtiğiniz: {service}. Ekspres hizmet (aynı gün) mi yoksa standart işlem mi istersiniz?"

**Response (AR)**: 
"رائع! اخترت: {service}. هل تريد خدمة سريعة (نفس اليوم) أم معالجة قياسية؟"

**Service Names**:
- newRegistration: "Vehicle Registration (Zulassung)" / "Fahrzeugzulassung" / "Araç Kaydı" / "تسجيل المركبة"
- reRegistration: "Re-registration (Ummeldung)" / "Ummeldung" / "Yeniden Kayıt" / "إعادة التسجيل"
- deregistration: "Deregistration (Abmeldung)" / "Abmeldung" / "Kayıt Silme" / "إلغاء التسجيل"
- licensePlates: "License Plates" / "Kennzeichen" / "Plakalar" / "لوحات الترخيص"

**Quick Reply Options**:
1. Yes, express (same-day) → Intent: ASK_NAME (extras: ["Express"])
2. No, standard (24-48h) → Intent: ASK_NAME
3. ← Back → Intent: GREET

---

### Intent: ASK_NAME
**Trigger**: User confirms service selection

**Response (EN)**: 
"Perfect! What's your name?"

**Response (DE)**: 
"Perfekt! Wie ist Ihr Name?"

**Response (TR)**: 
"Mükemmel! Adınız nedir?"

**Response (AR)**: 
"ممتاز! ما اسمك؟"

**Expected Input**: Free text (user's name)
**Next Intent**: ASK_PHONE

---

### Intent: ASK_PHONE
**Trigger**: User provides their name

**Response (EN)**: 
"Thanks, {name}! What's your phone number?"

**Response (DE)**: 
"Danke, {name}! Wie ist Ihre Telefonnummer?"

**Response (TR)**: 
"Teşekkürler, {name}! Telefon numaranız nedir?"

**Response (AR)**: 
"شكراً، {name}! ما رقم هاتفك؟"

**Expected Input**: Free text (phone number)
**Next Intent**: HANDOFF

---

### Intent: HANDOFF
**Trigger**: User provides phone number

**Response (EN)**: 
"Perfect, {name}! I've prepared everything for you. Click below to continue on WhatsApp — we'll reply within minutes during office hours."

**Response (DE)**: 
"Perfekt, {name}! Ich habe alles für Sie vorbereitet. Klicken Sie unten, um auf WhatsApp fortzufahren — wir antworten innerhalb von Minuten während der Bürozeiten."

**Response (TR)**: 
"Mükemmel, {name}! Her şeyi sizin için hazırladım. WhatsApp'ta devam etmek için aşağıya tıklayın — mesai saatlerinde dakikalar içinde yanıt vereceğiz."

**Response (AR)**: 
"ممتاز، {name}! لقد أعددت كل شيء لك. انقر أدناه للمتابعة على واتساب — سنرد في غضون دقائق خلال ساعات العمل."

**Action**: Generate WhatsApp link with prefilled message
**WhatsApp Message Format**:
```
Hello Civic Concierge,

Service: {service_name}
Extras: {extras_list}
Name: {name}
Phone: {phone}

(sent from civic-concierge.de chatbot)
```

---

### Intent: ASK_PRICE
**Trigger**: User asks about pricing

**Response (EN)**: 
"Our pricing is transparent and fixed:

• Vehicle Registration: from €29 + authority fees
• Re-registration: from €35 + authority fees
• Deregistration: from €19 + authority fees
• License Plates: from €29 + authority fees
• Express Service: from €59 + authority fees

Authority fees are set by Kreis Steinfurt. Which service interests you?"

**Response (DE)**: 
"Unsere Preise sind transparent und fest:

• Fahrzeugzulassung: ab €29 + Behördengebühren
• Ummeldung: ab €35 + Behördengebühren
• Abmeldung: ab €19 + Behördengebühren
• Kennzeichen: ab €29 + Behördengebühren
• Express-Service: ab €59 + Behördengebühren

Behördengebühren werden vom Kreis Steinfurt festgelegt. Welcher Service interessiert Sie?"

**Response (TR)**: 
"Fiyatlandırmamız şeffaf ve sabittir:

• Araç Kaydı: €29'dan başlayan + resmi harçlar
• Yeniden kayıt: €35'ten başlayan + resmi harçlar
• Kayıt silme: €19'dan başlayan + resmi harçlar
• Plakalar: €29'dan başlayan + resmi harçlar
• Ekspres Hizmet: €59'dan başlayan + resmi harçlar

Resmi harçlar Kreis Steinfurt tarafından belirlenir. Hangi hizmet ilginizi çekiyor?"

**Response (AR)**: 
"أسعارنا شفافة وثابتة:

• تسجيل المركبة: من €29 + رسوم حكومية
• إعادة التسجيل: من €35 + رسوم حكومية
• إلغاء التسجيل: من €19 + رسوم حكومية
• لوحات الترخيص: من €29 + رسوم حكومية
• خدمة سريعة: من €59 + رسوم حكومية

الرسوم الحكومية يحددها كرايس شتاينفورت. أي خدمة تهمك؟"

**Quick Reply Options**:
1. Register a vehicle → Intent: START_REQUEST (serviceKey: newRegistration)
2. Re-register → Intent: START_REQUEST (serviceKey: reRegistration)
3. Deregister → Intent: START_REQUEST (serviceKey: deregistration)
4. Talk to the team → Intent: TALK_TO_HUMAN

---

### Intent: ASK_DOCUMENTS
**Trigger**: User asks about required documents

**Response (EN)**: 
"Required documents depend on your service:

📋 For Registration:
• ID or passport
• eVB number (insurance)
• Vehicle documents (Fahrzeugbrief/Fahrzeugschein)
• SEPA mandate
• TÜV certificate (if applicable)

📋 For Re-registration:
• ID or passport
• Current registration certificate
• SEPA mandate
• Proof of address (if changed)

📋 For Deregistration:
• ID or passport
• Registration certificate
• License plates

We verify everything digitally before you visit. Want to start a request?"

**Response (DE)**: 
"Erforderliche Dokumente hängen von Ihrem Service ab:

📋 Für Zulassung:
• Ausweis oder Reisepass
• eVB-Nummer (Versicherung)
• Fahrzeugdokumente (Fahrzeugbrief/Fahrzeugschein)
• SEPA-Mandat
• TÜV-Bescheinigung (falls zutreffend)

📋 Für Ummeldung:
• Ausweis oder Reisepass
• Aktuelle Zulassungsbescheinigung
• SEPA-Mandat
• Adressnachweis (bei Änderung)

📋 Für Abmeldung:
• Ausweis oder Reisepass
• Zulassungsbescheinigung
• Kennzeichen

Wir prüfen alles digital, bevor Sie uns besuchen. Möchten Sie eine Anfrage starten?"

**Response (TR)**: 
"Gerekli belgeler hizmetinize bağlıdır:

📋 Kayıt için:
• Kimlik veya pasaport
• eVB numarası (sigorta)
• Araç belgeleri (Fahrzeugbrief/Fahrzeugschein)
• SEPA yetkisi
• TÜV sertifikası (varsa)

📋 Yeniden kayıt için:
• Kimlik veya pasaport
• Mevcut kayıt belgesi
• SEPA yetkisi
• Adres kanıtı (değiştiyse)

📋 Kayıt silme için:
• Kimlik veya pasaport
• Kayıt belgesi
• Plakalar

Ziyaret etmeden önce her şeyi dijital olarak doğrularız. Talep başlatmak ister misiniz?"

**Response (AR)**: 
"المستندات المطلوبة تعتمد على خدمتك:

📋 للتسجيل:
• الهوية أو جواز السفر
• رقم eVB (التأمين)
• مستندات المركبة (Fahrzeugbrief/Fahrzeugschein)
• تفويض SEPA
• شهادة TÜV (إن وجدت)

📋 لإعادة التسجيل:
• الهوية أو جواز السفر
• شهادة التسجيل الحالية
• تفويض SEPA
• إثبات العنوان (إذا تغير)

📋 لإلغاء التسجيل:
• الهوية أو جواز السفر
• شهادة التسجيل
• لوحات الترخيص

نتحقق من كل شيء رقمياً قبل زيارتك. هل تريد بدء طلب؟"

**Quick Reply Options**:
1. Yes, start a request → Intent: START_REQUEST (serviceKey: newRegistration)
2. Talk to the team → Intent: TALK_TO_HUMAN

---

### Intent: TALK_TO_HUMAN
**Trigger**: User wants to speak with a human

**Response (EN)**: 
"No problem! Our team is available Mon-Fri, 07:30-17:00. Click below to message us on WhatsApp — we typically reply within minutes during office hours."

**Response (DE)**: 
"Kein Problem! Unser Team ist Mo-Fr, 07:30-17:00 Uhr verfügbar. Klicken Sie unten, um uns auf WhatsApp zu schreiben — wir antworten normalerweise innerhalb von Minuten während der Bürozeiten."

**Response (TR)**: 
"Sorun değil! Ekibimiz Pzt-Cum, 07:30-17:00 saatleri arasında müsait. WhatsApp'tan bize mesaj atmak için aşağıya tıklayın — mesai saatlerinde genellikle dakikalar içinde yanıt veririz."

**Response (AR)**: 
"لا مشكلة! فريقنا متاح الإثنين-الجمعة، 07:30-17:00. انقر أدناه لمراسلتنا على واتساب — عادة نرد في غضون دقائق خلال ساعات العمل."

**Action**: Generate WhatsApp link (no prefilled message)

---

### Intent: FALLBACK
**Trigger**: Bot doesn't understand user input

**Response (EN)**: 
"I'm not sure I understood that. Would you like to talk to our team on WhatsApp? They can help with any question."

**Response (DE)**: 
"Ich bin mir nicht sicher, ob ich das verstanden habe. Möchten Sie mit unserem Team auf WhatsApp sprechen? Sie können bei jeder Frage helfen."

**Response (TR)**: 
"Bunu anladığımdan emin değilim. WhatsApp'tan ekibimizle konuşmak ister misiniz? Her sorunuzda yardımcı olabilirler."

**Response (AR)**: 
"لست متأكداً من أنني فهمت ذلك. هل تريد التحدث مع فريقنا على واتساب؟ يمكنهم المساعدة في أي سؤال."

**Action**: Generate WhatsApp link (no prefilled message)

---

## Intent Detection Keywords

### START_REQUEST (Service Selection)
- Keywords: "register", "registration", "zulassung", "kayıt", "تسجيل"
- Keywords: "re-register", "ummeldung", "yeniden", "إعادة"
- Keywords: "deregister", "abmeldung", "silme", "إلغاء"
- Keywords: "plates", "kennzeichen", "plaka", "لوحات"

### ASK_PRICE
- Keywords: "price", "cost", "how much", "preis", "kosten", "fiyat", "سعر"
- Keywords: "€", "euro", "fee", "gebühr", "ücret", "رسوم"

### ASK_DOCUMENTS
- Keywords: "documents", "papers", "need", "dokumente", "belge", "مستندات"
- Keywords: "bring", "required", "mitbringen", "gerekli", "مطلوب"

### TALK_TO_HUMAN
- Keywords: "human", "person", "team", "mensch", "insan", "شخص"
- Keywords: "call", "phone", "speak", "anrufen", "ara", "اتصل"

---

## State Management

### Session Data to Track
1. **service**: Selected service (newRegistration, reRegistration, deregistration, licensePlates)
2. **serviceKey**: Translation key for the service name
3. **extras**: Array of selected extras (e.g., ["Express"])
4. **name**: User's name
5. **phone**: User's phone number
6. **language**: Current language (en, de, tr, ar)
7. **currentIntent**: Current conversation intent
8. **step**: Current step in the flow (greet, ask_name, ask_phone, handoff)

### Flow Logic
```
1. User opens chatbot → Intent: GREET
2. User selects service → Intent: START_REQUEST → Store service
3. User selects express/standard → Intent: ASK_NAME → Store extras
4. User provides name → Intent: ASK_PHONE → Store name
5. User provides phone → Intent: HANDOFF → Store phone → Generate WhatsApp link
```

---

## n8n Implementation Notes

### Webhook Input
Expected JSON structure:
```json
{
  "sessionId": "unique-session-id",
  "message": "user message text",
  "intentHint": "optional-intent-name",
  "context": {
    "page": "/path",
    "locale": "en"
  },
  "ts": 1234567890
}
```

### Webhook Response
Expected JSON structure:
```json
{
  "reply": {
    "text": "Bot response text in user's language",
    "quickReplies": ["Button 1", "Button 2"],
    "handoff": {
      "channel": "whatsapp",
      "url": "https://wa.me/491733225570?text=..."
    }
  }
}
```

### Language Detection
1. Check `context.locale` from request
2. Fall back to browser language
3. Default to "en" if not specified

### Intent Detection Strategy
1. Check if `intentHint` is provided in request
2. If not, analyze `message` for keywords
3. Consider current `step` in session state
4. Default to FALLBACK if no match

---

## Quick Reply Button Labels

### English (EN)
- "Register a vehicle"
- "Re-register / change owner"
- "Deregister a vehicle"
- "Get license plates"
- "Ask about pricing"
- "Ask about documents"
- "Talk to the team"
- "Yes, express"
- "No, standard"
- "Back"
- "Start a request"

### German (DE)
- "Fahrzeug zulassen"
- "Ummeldung"
- "Fahrzeug abmelden"
- "Kennzeichen erhalten"
- "Nach Preisen fragen"
- "Welche Dokumente brauche ich?"
- "Mit dem Team sprechen"
- "Ja, Express"
- "Nein, Standard"
- "Zurück"
- "Anfrage starten"

### Turkish (TR)
- "Araç kaydı"
- "Yeniden kayıt (Ummeldung)"
- "Kayıt silme (Abmeldung)"
- "Plaka al"
- "Fiyat sor"
- "Hangi belgelere ihtiyacım var?"
- "Ekiple konuş"
- "Evet, ekspres"
- "Hayır, standart"
- "Geri"
- "Talep başlat"

### Arabic (AR)
- "تسجيل مركبة"
- "إعادة التسجيل (Ummeldung)"
- "إلغاء التسجيل (Abmeldung)"
- "الحصول على لوحات"
- "السؤال عن الأسعار"
- "ما المستندات التي أحتاجها؟"
- "التحدث مع الفريق"
- "نعم، سريع"
- "لا، قياسي"
- "رجوع"
- "بدء طلب"

---

## Error Handling

### Network Errors
- If n8n endpoint is unreachable, chatbot.js falls back to local flow
- Local flow provides same user experience with predefined responses

### Invalid Input
- If user provides unexpected input, use FALLBACK intent
- Always offer option to talk to human team

### Missing Session Data
- If session data is lost, restart from GREET intent
- Preserve user's language preference if available

---

## Testing Scenarios

### Happy Path - New Registration
1. User: Opens chatbot
2. Bot: GREET with quick replies
3. User: Clicks "Register a vehicle"
4. Bot: START_REQUEST asking about express service
5. User: Clicks "Yes, express"
6. Bot: ASK_NAME
7. User: Types "John Doe"
8. Bot: ASK_PHONE
9. User: Types "+49 123 456789"
10. Bot: HANDOFF with WhatsApp link

### Pricing Inquiry
1. User: Opens chatbot
2. Bot: GREET
3. User: Clicks "Ask about pricing"
4. Bot: ASK_PRICE with detailed pricing
5. User: Clicks "Register a vehicle"
6. Bot: START_REQUEST
7. Continue to handoff...

### Direct to Human
1. User: Opens chatbot
2. Bot: GREET
3. User: Clicks "Talk to the team"
4. Bot: TALK_TO_HUMAN with WhatsApp link

---

## Maintenance Notes

### Updating Responses
- All responses are stored in this document and `n8n/chatbot-flow.json`
- Update both files when changing conversation flow
- Test in all 4 languages after updates

### Adding New Intents
1. Define intent name and trigger conditions
2. Write responses in all 4 languages
3. Define quick reply options
4. Update intent detection keywords
5. Update n8n workflow nodes

### Pricing Updates
- Update ASK_PRICE responses when prices change
- Ensure consistency with pricing page
- Update in all 4 languages

---

## Contact for Issues
- Technical issues: Check chatbot.js console logs
- Content updates: Edit this file and chatbot-flow.json
- n8n workflow: Access n8n dashboard at api.civic-concierge.de
