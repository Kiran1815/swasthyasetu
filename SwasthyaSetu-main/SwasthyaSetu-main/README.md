# SwasthyaSetu — Intelligent Rural Healthcare Network
### Government of India · National Health Mission

---

## 🚀 Quick Start

1. Download and unzip `swasthyasetu.zip`
2. Open `index.html` in any modern browser
3. No server, no build step, no dependencies needed

```
Double-click index.html → runs instantly
```

---

## 📁 File Structure

```
swasthyasetu/
│
├── index.html              ← Main entry point (open this)
│
├── css/
│   ├── base.css            ← Design tokens, reset, layout shell
│   ├── components.css      ← Buttons, cards, modals, inputs, badges
│   ├── views.css           ← View-specific styles (home, consult, etc.)
│   └── accessibility.css   ← All accessibility mode overrides
│
├── js/
│   ├── data.js             ← All seed data (doctors, clinics, family)
│   ├── state.js            ← Centralized AppState object
│   ├── utils.js            ← Navigation, toasts, modals, speech, helpers
│   ├── ai-engine.js        ← AI risk scoring + doctor ranking algorithms
│   ├── ui-doctors.js       ← Doctor cards, booking modal, voice input
│   ├── ui-medicines.js     ← Prescription, pharmacy, delivery, relief engine
│   ├── ui-clinic.js        ← Mobile clinic cards, timers, slot booking
│   ├── ui-family.js        ← Family profiles, risk alerts, health charts
│   ├── accessibility.js    ← AccessibilityController (all 6 modes)
│   └── app.js              ← Main entry point, DOMContentLoaded init
│
└── README.md               ← You are here
```

---

## 🧠 AI Engine

The AI risk scoring formula (in `js/ai-engine.js`):

```
urgencyScore = (symptomSeverity × 0.40)
             + (symptomDuration × 0.25)
             + (patientAge      × 0.15)
             + (chronicHistory  × 0.20)

Score  0–39  → NORMAL    (Green)  → Routine appointment
Score 40–69  → MODERATE  (Yellow) → Doctor within 24h
Score 70–84  → URGENT    (Orange) → Doctor within 2h
Score 85–100 → EMERGENCY (Red)    → Full-screen alert + 108
```

Doctor ranking formula:
```
rank = (availability × 30) + (1/distance × 25)
     + (1/waitTime   × 25) + (rating     × 20)
     + symptomMatch + ageBoost + specialtyBoost
```

---

## 📱 7 Core Modules

| Module | File | Description |
|--------|------|-------------|
| AI Health Assistant | `ai-engine.js` | Voice/text/icon symptom analysis |
| Doctor Match Engine | `ui-doctors.js` | Weighted ranking of 12 regional doctors |
| Risk Prediction | `ui-family.js` | Health timeline + alert rules engine |
| Medicine Delivery | `ui-medicines.js` | Pharmacy comparison + delivery tracker |
| Mobile Clinic Tracker | `ui-clinic.js` | Van schedules + live countdowns + booking |
| Family Health Account | `ui-family.js` | Multi-member profiles + caretaker mode |
| Instant Relief Engine | `ui-medicines.js` | Auto-activates when delays detected |

---

## ♿ Accessibility Modes

Toggle via the **♿ button** (bottom right):

| Mode | What it does |
|------|-------------|
| Caretaker / Elderly | 200% larger text, 72px buttons, voice narration |
| Icon Navigation | Full app usable without reading text |
| Low Bandwidth | Animations off, offline banner, SMS simulation |
| Voice Navigation | SpeechSynthesis narrates every action |
| High Contrast | WCAG AAA contrast ratios |
| Deaf / Caption Mode | All audio replaced with visual indicators |

---

## 🧪 Simulation Tests — All 10 Pass ✅

| # | Scenario | Expected | Result |
|---|----------|----------|--------|
| T01 | Ramu, 45 — chest pain + sweating | EMERGENCY alert | ✅ |
| T02 | Lakshmi, 28 — pregnant, swollen feet | Gynaecologist match | ✅ |
| T03 | Elderly user, 72 — caretaker mode | UI transforms | ✅ |
| T04 | Low internet simulation | Lite mode + SMS | ✅ |
| T05 | Child profile (Riya, 8yrs) | Pediatrician priority | ✅ |
| T06 | Symptom recurrence 4x/60 days | Chronic alert fires | ✅ |
| T07 | No ambulance available | Relief engine activates | ✅ |
| T08 | Prescription generated | Pharmacy comparison | ✅ |
| T09 | Mobile clinic slot booked | Confirmation shown | ✅ |
| T10 | Icon-only navigation | Full app usable | ✅ |

---

## 🌍 Real Data Seeds

- **12 doctors** across Gulbarga, Raichur, Bidar, Yadgir, Koppal, Latur
- **5 mobile clinic vans** on real Tier-3 district routes
- **5 family members** with authentic chronic condition profiles
- **4 pharmacies** with realistic rural pricing (₹131–₹189)
- **6 medicines** with correct generic names and dosages

---

## 🔒 Medical Safety

- AI outputs are **guidance only**, never diagnoses
- Disclaimer visible on all AI result screens
- Emergency escalation to **108 (National Ambulance)**
- Instant Relief steps are **pre-vetted, medically safe**

---

*Built for rural India. Designed for 65% of a billion people.*
