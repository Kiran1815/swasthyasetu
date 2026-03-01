# Software Requirements Specification (SRS)

## SwasthyaSetu — Intelligent Rural Healthcare Network

**Version:** 2.0  
**Date:** February 23, 2026  
**Standard:** IEEE 830 / ISO/IEC/IEEE 29148  
**Classification:** Confidential — For Internal, Investor & Jury Review  
**Prepared by:** SwasthyaSetu Engineering Division  
**Organization:** Government of India · National Health Mission  

---

## Revision History

| Version | Date | Author | Description |
|---------|------|--------|-------------|
| 1.0 | Jan 10, 2026 | Engineering Team | Initial draft |
| 1.5 | Feb 01, 2026 | Engineering Team | Added family module, multilingual support |
| 2.0 | Feb 23, 2026 | Engineering Team | Added Supabase persistence, deaf/caption mode, nearby search, clinic live data |

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Overall Description](#2-overall-description)
3. [System Architecture](#3-system-architecture)
4. [Functional Requirements](#4-functional-requirements)
5. [Non-Functional Requirements](#5-non-functional-requirements)
6. [Design System & UI/UX Specifications](#6-design-system--uiux-specifications)
7. [Technology Stack](#7-technology-stack)
8. [Development Tools](#8-development-tools)
9. [Data Model & Database Schema](#9-data-model--database-schema)
10. [Deployment Strategy](#10-deployment-strategy)
11. [Risk Analysis](#11-risk-analysis)
12. [Future Enhancements](#12-future-enhancements)

---

# 1. Introduction

## 1.1 Purpose

This Software Requirements Specification defines the complete functional, non-functional, architectural, and design requirements for **SwasthyaSetu** ("Health Bridge") — an AI-powered, emergency-enabled rural healthcare digital platform operating under the Government of India's National Health Mission. This document serves as the authoritative reference for development, quality assurance, stakeholder review, investor evaluation, and award jury assessment.

## 1.2 Scope

SwasthyaSetu is a single-page, mobile-first web application that bridges the healthcare access gap in rural India by providing:

- **AI-powered symptom analysis** with urgency scoring and specialist matching
- **Real-time emergency SOS system** with ambulance routing (108 integration)
- **Multi-platform medicine ordering** with price comparison across 4 national pharmacy platforms (Tata 1mg, Apollo Pharmacy, MedPlus, PharmEasy)
- **Live mobile clinic tracking** with real-time Overpass API facility data across 100km radius
- **Family health accounts** with per-person prescription storage, risk prediction, and health timelines
- **Nearby healthcare search** with interactive Leaflet/OpenStreetMap maps and geolocation-based facility discovery
- **6-mode accessibility engine** covering elderly, illiterate, deaf/mute, low-bandwidth, visually impaired, and voice-dependent users
- **4-language internationalization** (English, Hindi, Kannada, Telugu) with full RTL-ready architecture
- **Dual-layer persistence** via localStorage (instant/offline) and Supabase PostgreSQL (cloud sync)
- **Instant Relief Engine** with timed first-aid guidance and family alerting

The platform targets 500+ million rural Indians across 6.4 lakh villages, with architecture designed to scale to 100 million concurrent users.

## 1.3 Definitions, Acronyms, and Abbreviations

| Term | Definition |
|------|------------|
| **SwasthyaSetu** | "Health Bridge" — the platform name (Hindi) |
| **SPA** | Single-Page Application |
| **SOS** | Emergency alert system triggering ambulance dispatch |
| **PHC** | Primary Health Centre |
| **CHC** | Community Health Centre |
| **AYUSH** | Ayurveda, Yoga, Unani, Siddha, Homeopathy (Indian traditional medicine systems) |
| **NHM** | National Health Mission (Government of India) |
| **Overpass API** | OpenStreetMap query API for geospatial facility data |
| **Haversine** | Great-circle distance formula for geolocation calculations |
| **Urgency Score** | Computed health risk score (0–100) from symptom analysis |
| **COD** | Cash on Delivery |
| **MRP** | Maximum Retail Price |
| **a11y** | Accessibility |
| **i18n** | Internationalization |
| **RLS** | Row-Level Security (Supabase/PostgreSQL) |
| **WCAG** | Web Content Accessibility Guidelines |
| **BCP-47** | IETF language tag standard (e.g., `en-IN`, `hi-IN`) |
| **CDN** | Content Delivery Network |
| **JSONB** | Binary JSON storage format in PostgreSQL |

## 1.4 References

| ID | Reference | Version |
|----|-----------|---------|
| R-001 | IEEE 830-1998 — Recommended Practice for SRS | 1998 |
| R-002 | ISO/IEC/IEEE 29148:2018 — Systems and Software Engineering — Life Cycle Processes — Requirements Engineering | 2018 |
| R-003 | WCAG 2.1 — Web Content Accessibility Guidelines | Level AA |
| R-004 | National Health Mission Guidelines, Government of India | 2024 |
| R-005 | Leaflet.js Documentation | v1.9.4 |
| R-006 | Overpass API Documentation (OpenStreetMap) | Latest |
| R-007 | Supabase JS SDK Documentation | v2.x |
| R-008 | Web Speech API Specification (W3C) | Draft |
| R-009 | Indian Emergency Number System — Ambulance 108 | Current |

## 1.5 Overview

This SRS is structured in 12 sections. Sections 1–2 provide context and scope. Section 3 details system architecture. Section 4 specifies all functional requirements with unique IDs, validation criteria, and priority levels. Section 5 covers non-functional requirements. Sections 6–8 define design systems, technology stack, and development tooling. Section 9 specifies the data model. Section 10 describes deployment strategy. Sections 11–12 address risk analysis and future enhancements.

---

# 2. Overall Description

## 2.1 Product Perspective

SwasthyaSetu is a standalone web application designed to operate as the primary digital healthcare gateway for rural India. It integrates with:

- **OpenStreetMap/Overpass API** for real-time healthcare facility discovery
- **National Emergency Services** (Ambulance 108) for SOS routing
- **Four national pharmacy platforms** (Tata 1mg, Apollo Pharmacy, MedPlus, PharmEasy) for medicine ordering
- **Supabase** (PostgreSQL-backed BaaS) for cloud data persistence
- **Browser native APIs** (Geolocation, Web Speech Recognition, Web Speech Synthesis, localStorage)

The system operates independently without requiring backend server infrastructure for core functionality — all AI analysis, routing, and rendering execute client-side.

## 2.2 Product Functions (High-Level)

| # | Function | Description |
|---|----------|-------------|
| F-01 | AI Health Analysis | Rule-based symptom analysis with urgency scoring (0–100), specialist matching, and condition identification |
| F-02 | Emergency SOS | One-tap emergency activation with ambulance routing, visual/audio alerts, and family notification |
| F-03 | Doctor Discovery | AI-ranked doctor recommendations based on symptom match, proximity, availability, and rating |
| F-04 | Appointment Booking | Time-slot-based booking with real-time availability across doctors and mobile clinics |
| F-05 | Medicine Ordering | AI-generated prescriptions with cross-platform price comparison and COD delivery tracking |
| F-06 | Live Clinic Tracking | Real-time mobile clinic/health camp discovery via Overpass API with interactive maps |
| F-07 | Nearby Healthcare Search | Geolocation-based facility search (hospitals, clinics, doctors, pharmacies) within 10–25km |
| F-08 | Family Health Accounts | Multi-member health management with risk prediction, prescription history, and health timelines |
| F-09 | Multilingual Support | Full i18n across English, Hindi, Kannada, Telugu with runtime language switching |
| F-10 | Accessibility Engine | 6-mode accessibility (Caretaker, Icon Nav, Low Bandwidth, Voice Nav, High Contrast, Deaf/Caption) |
| F-11 | Instant Relief Engine | Timed first-aid guidance with 28-minute countdown and emergency escalation |
| F-12 | Persistent Storage | Dual-layer data persistence (localStorage + Supabase cloud) |

## 2.3 User Classes and Characteristics

| User Class | Description | Technical Proficiency | Primary Needs |
|------------|-------------|----------------------|---------------|
| **Rural Patient** | Adult (18–60 yrs) in rural/semi-urban India | Low to moderate smartphone literacy | Symptom assessment, doctor booking, medicine ordering |
| **Elderly User** | Adults 60+ years, often with chronic conditions | Very low; may require caretaker assistance | Large text, voice navigation, simplified UI |
| **Caretaker/Family Member** | Educated family member managing health for others | Moderate | Family account management, prescription tracking |
| **Illiterate User** | Users who cannot read or write | Minimal; relies on visual/audio cues | Icon-based navigation, voice input/output |
| **Deaf/Mute User** | Users with hearing or speech impairment | Varies | Visual captions, text-only input, screen flash alerts |
| **Low-Bandwidth User** | Users in areas with limited connectivity (2G/3G) | Varies | Lite mode, offline capability, SMS fallback |
| **Healthcare Provider** | Doctors, clinic staff, mobile clinic operators | Moderate to high | Patient booking management, consultation scheduling |
| **System Administrator** | Platform management and monitoring | High | Dashboard, analytics, system health |

## 2.4 Operating Environment

| Component | Specification |
|-----------|---------------|
| **Client Platform** | Web browser (mobile-first SPA) |
| **Minimum Browser** | Chrome 80+, Firefox 78+, Safari 13+, Edge 80+ |
| **Minimum Device** | Android 8+ smartphone with 2GB RAM |
| **Network** | Functional on 2G (offline-capable with localStorage); optimal on 3G+ |
| **Screen Sizes** | 320px–1920px+ (5 responsive breakpoints) |
| **Cloud Backend** | Supabase (PostgreSQL 15+, PostgREST API) |
| **Map Tiles** | OpenStreetMap via Leaflet.js 1.9.4 |
| **Geospatial Data** | Overpass API (OpenStreetMap) |
| **Speech APIs** | Web Speech API (SpeechRecognition + SpeechSynthesis) |

## 2.5 Design and Implementation Constraints

| ID | Constraint | Rationale |
|----|-----------|-----------|
| C-01 | No JavaScript framework (React, Vue, Angular) | Minimize payload for rural 2G/3G connections; ensure sub-100KB JS |
| C-02 | Client-side AI only | Eliminate server dependency for health analysis; works offline |
| C-03 | All text externalized via i18n keys | Mandatory for 4-language support |
| C-04 | Mobile-first responsive design | 80%+ rural users access via low-end Android smartphones |
| C-05 | Graceful degradation for all external APIs | Seed data fallback when Overpass, Geolocation, or Speech APIs are unavailable |
| C-06 | No user authentication required for core features | Reduce friction for low-literacy users; anonymous usage permitted |
| C-07 | Compliance with Government of India digital accessibility standards | WCAG 2.1 AA + Indian accessibility guidelines |
| C-08 | Emergency number compliance | Must use national emergency number 108 for ambulance |

## 2.6 User Documentation

| Document | Format | Audience |
|----------|--------|----------|
| In-app tooltips and labels | HTML/i18n, 4 languages | All users |
| Voice-guided navigation | Web Speech Synthesis | Elderly, visually impaired |
| Icon-based instruction set | Emoji-based visual cues | Illiterate users |
| Caption mode visual guides | On-screen captions | Deaf/mute users |
| README.md | Markdown | Developers |
| SRS Document (this document) | Markdown | Engineers, investors, jury |

## 2.7 Assumptions and Dependencies

| ID | Assumption/Dependency | Type |
|----|----------------------|------|
| A-01 | Users have access to a smartphone with a modern web browser | Assumption |
| A-02 | OpenStreetMap/Overpass API maintains uptime and data accuracy for India | Dependency |
| A-03 | Supabase free/pro tier provides sufficient throughput for initial deployment | Dependency |
| A-04 | Web Speech API is available in target browsers (Chrome, Edge — primary) | Dependency |
| A-05 | Indian government emergency number 108 remains operational | Dependency |
| A-06 | Pharmacy platforms (Tata 1mg, Apollo, MedPlus, PharmEasy) maintain their URL structures | Dependency |
| A-07 | Users consent to browser geolocation access for facility search | Assumption |
| A-08 | At least one family member per household has basic smartphone literacy | Assumption |

---

# 3. System Architecture

## 3.1 High-Level Architecture Diagram

```
┌──────────────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser SPA)                          │
│                                                                      │
│  ┌─────────┐  ┌──────────┐  ┌───────────┐  ┌──────────────────────┐ │
│  │ index   │  │ 4 CSS    │  │ 13 JS     │  │ Browser Native APIs  │ │
│  │ .html   │  │ Modules  │  │ Modules   │  │ ├─ Geolocation       │ │
│  └─────────┘  └──────────┘  └───────────┘  │ ├─ SpeechRecognition │ │
│                                             │ ├─ SpeechSynthesis   │ │
│                                             │ ├─ localStorage      │ │
│                                             │ └─ Fetch API         │ │
│                                             └──────────────────────┘ │
└──────────┬──────────┬──────────┬──────────┬──────────────────────────┘
           │          │          │          │
    ┌──────▼──┐ ┌─────▼────┐ ┌──▼────┐ ┌──▼──────────────────┐
    │Supabase │ │ Overpass  │ │Leaflet│ │ Pharmacy Platform   │
    │ Cloud   │ │   API     │ │ Tiles │ │ Redirect Links      │
    │(Postgres│ │(OSM Query)│ │ (OSM) │ │ ├─ Tata 1mg         │
    │+ REST)  │ │           │ │       │ │ ├─ Apollo Pharmacy   │
    └─────────┘ └───────────┘ └───────┘ │ ├─ MedPlus           │
                                        │ └─ PharmEasy         │
                                        └──────────────────────┘
```

## 3.2 Frontend Architecture

### 3.2.1 Module Structure

The frontend consists of a single HTML document with 13 sequentially-loaded JavaScript modules and 4 CSS stylesheets. All modules communicate through shared global functions and a centralized reactive state object (`AppState`).

**Module Loading Order (dependency chain):**

```
data.js → state.js → i18n.js → utils.js → ai-engine.js → ui-doctors.js
  → nearby-search.js → ui-medicines.js → ui-clinic.js → ui-family.js
    → supabase-db.js → accessibility.js → app.js
```

**Module Responsibilities:**

| Module | LOC | Responsibility |
|--------|-----|----------------|
| `data.js` | 292 | Static data constants, seed data, medicine/doctor/family datasets |
| `state.js` | 33 | Centralized `AppState` object — single source of truth |
| `i18n.js` | 1350 | Translation engine, 4-language dictionaries, `t()` function, `applyTranslations()` |
| `utils.js` | 100 | SPA navigation, toast system, modal management, speech synthesis, stats ticker |
| `ai-engine.js` | 303 | Urgency scoring, doctor ranking, condition mapping, symptom analysis pipeline |
| `ui-doctors.js` | 200 | Doctor cards, booking modal, voice input (Web Speech), emergency triggers |
| `nearby-search.js` | 333 | Geolocation, Overpass API queries, facility cards, Leaflet map rendering |
| `ui-medicines.js` | 374 | Prescription generation, platform price comparison, delivery tracking, relief engine |
| `ui-clinic.js` | 479 | Clinic/camp discovery, Overpass live data, clinic maps, real-time countdowns |
| `ui-family.js` | 379 | Family member CRUD, prescription storage, risk prediction, health charts |
| `supabase-db.js` | 160 | Dual-layer persistence (localStorage + Supabase), `initStorage()`, `persistData()` |
| `accessibility.js` | 220 | 6 accessibility modes, deaf caption engine, monkey-patching teardown |
| `app.js` | 24 | Entry point — initialization sequence |

### 3.2.2 View Architecture

Five primary views managed via CSS class switching:

| View | ID | Modules | Key Features |
|------|----|---------|--------------|
| Home | `#view-home` | utils, ui-doctors | Stats ticker, hero CTA, quick actions, doctor recommendations |
| Consult | `#view-consult` | ai-engine, ui-doctors, nearby-search | 3-mode input (Voice/Text/Icons), AI analysis, facility search |
| Medicines | `#view-medicines` | ui-medicines | Prescription, 4-platform comparison, delivery tracker |
| Clinic | `#view-clinic` | ui-clinic | Live facility map, Overpass API data, booking |
| Family | `#view-family` | ui-family | Member grid, profiles, risk alerts, prescription history |

### 3.2.3 CSS Architecture

| Stylesheet | LOC | Scope |
|------------|-----|-------|
| `base.css` | 200 | Design tokens, CSS reset, typography, layout grid, responsive breakpoints |
| `components.css` | 713 | 30+ reusable components (buttons, badges, cards, modals, inputs, etc.) |
| `views.css` | 513 | View-specific layouts and animations |
| `accessibility.css` | 280 | 6 accessibility mode overrides, FAB, settings panel |

## 3.3 Backend Architecture

### 3.3.1 Client-Side Intelligence

SwasthyaSetu employs a serverless architecture where all critical intelligence executes client-side:

- **AI Urgency Scoring Engine** — Multi-factor weighted formula (symptom severity × 0.40 + duration × 0.25 + age risk × 0.15 + chronic history × 0.20)
- **Doctor Ranking Algorithm** — Composite scoring (availability × 30 + proximity × 25 + wait time × 25 + rating × 4 + symptom match + specialty boosts)
- **Condition-to-Medicine Mapping** — Rule-based prescription generation from 13 symptom categories
- **Risk Prediction Engine** — Pattern-based risk alerts (chronic repeat detection, hypertension trending, test due reminders)

### 3.3.2 Cloud Backend (Supabase)

- **Service:** Supabase (PostgreSQL 15 + PostgREST + Row-Level Security)
- **Role:** Asynchronous cloud backup for family data and prescriptions
- **Table:** `app_data` (key TEXT PK, value JSONB, updated_at TIMESTAMPTZ)
- **Security:** Row-Level Security with anonymous access policy for public health use
- **Sync Strategy:** Write-through — localStorage is primary (instant), Supabase is secondary (async non-blocking)

## 3.4 Emergency Intelligence Engine Architecture

```
┌─────────────────────────────────────────────────────────┐
│              EMERGENCY FLOW                              │
│                                                          │
│  SOS Button Press                                        │
│       │                                                  │
│       ▼                                                  │
│  triggerEmergency()                                      │
│       │                                                  │
│  ┌────▼─────────────────────────────────────────┐        │
│  │ Emergency Overlay (full-screen red)          │        │
│  │ ├─ Visual: Pulsing 🚨 animation             │        │
│  │ ├─ Audio: Voice announcement (if enabled)    │        │
│  │ ├─ Deaf mode: Triple red screen flash        │        │
│  │ ├─ Caption bar: "EMERGENCY ACTIVATED"        │        │
│  │ └─ Actions:                                  │        │
│  │    ├─ Call Ambulance 108 (tel: redirect)     │        │
│  │    └─ Dismiss → Relief Modal                 │        │
│  └──────────────────────────────────────────────┘        │
│       │                                                  │
│  AI Analysis (if symptoms entered):                      │
│  Score ≥ 85 → Auto-trigger Emergency Overlay             │
│  Score ≥ 40 → Show Relief Modal with first-aid steps     │
│       │                                                  │
│  Relief Modal:                                           │
│  ├─ Contextual first-aid steps (4 categories)            │
│  ├─ 28-minute countdown timer                            │
│  ├─ "Call 108" button                                    │
│  └─ "Alert Family" button (simulated notification)       │
└─────────────────────────────────────────────────────────┘
```

## 3.5 Database Architecture

### 3.5.1 Dual-Layer Persistence Model

```
┌────────────────────────────────┐    ┌──────────────────────────────┐
│     LAYER 1: localStorage     │    │    LAYER 2: Supabase Cloud   │
│     (Primary — Instant)       │    │    (Secondary — Async)       │
│                                │    │                              │
│  Key: setu_family_members     │───▶│  Row: family_members (JSONB) │
│  Key: setu_prescriptions      │───▶│  Row: prescriptions  (JSONB) │
│                                │    │                              │
│  ✓ Instant read/write         │    │  ✓ Cross-device sync         │
│  ✓ Works offline              │    │  ✓ Cloud backup              │
│  ✓ No network dependency      │    │  ✓ Data durability           │
│  ✗ Device-bound               │    │  ✗ Requires internet         │
└────────────────────────────────┘    └──────────────────────────────┘
```

### 3.5.2 Supabase Table Schema

```sql
CREATE TABLE app_data (
  key        TEXT PRIMARY KEY,
  value      JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

**Row-Level Security Policy:**
```sql
CREATE POLICY "allow_anon_all" ON app_data
  FOR ALL TO anon
  USING (true) WITH CHECK (true);
```

## 3.6 API Integrations

| API | Protocol | Purpose | Module | Fallback |
|-----|----------|---------|--------|----------|
| Overpass API | HTTP POST | Healthcare facility discovery (hospitals, clinics, PHCs) within 10–100km radius | nearby-search.js, ui-clinic.js | Seed data (5 clinics, 4 pharmacies) |
| Supabase REST | HTTPS | Cloud persistence (JSONB upsert/select) | supabase-db.js | localStorage |
| Browser Geolocation | Navigator API | User position for facility search | nearby-search.js, ui-clinic.js | Fallback: Gulbarga, Karnataka (17.3297°N, 76.8343°E) |
| Web Speech Recognition | Browser API | Voice symptom input (4 locales) | ui-doctors.js | Demo transcript fallback |
| Web Speech Synthesis | Browser API | Voice navigation announcements | utils.js | Silent (text-only) |
| OpenStreetMap Tile Server | HTTPS | Map tile rendering via Leaflet.js | ui-clinic.js, nearby-search.js | No fallback (graceful empty map) |
| Google Maps Directions | URL redirect | Turn-by-turn navigation to facilities | ui-clinic.js, nearby-search.js | N/A (external link) |
| Pharmacy Platforms | URL redirect | Medicine ordering (COD) | ui-medicines.js | Local pharmacy selection |

## 3.7 Infrastructure & Cloud Architecture

### 3.7.1 Current Deployment

| Tier | Technology | Purpose |
|------|-----------|---------|
| **Static Hosting** | Any static host (GitHub Pages / Netlify / Vercel / S3+CloudFront) | Serve HTML/CSS/JS assets |
| **CDN** | Cloudflare / CloudFront | Edge caching of static assets globally |
| **Cloud Database** | Supabase (PostgreSQL 15) | Family and prescription data persistence |
| **Map Tiles** | OpenStreetMap tile servers | Leaflet map rendering |
| **Geospatial Queries** | Overpass API (public infrastructure) | Facility search |

### 3.7.2 Production Architecture

```
                    ┌──────────────┐
                    │   Cloudflare  │
                    │     CDN       │
                    │   (Edge PoPs) │
                    └──────┬───────┘
                           │
                    ┌──────▼───────┐
                    │ Static Host  │
                    │ (S3/Netlify) │
                    │ HTML/CSS/JS  │
                    └──────┬───────┘
                           │
            ┌──────────────┼──────────────┐
            │              │              │
     ┌──────▼──────┐ ┌────▼─────┐ ┌──────▼──────┐
     │  Supabase   │ │ Overpass │ │    OSM      │
     │  Cloud      │ │   API    │ │ Tile Server │
     │ (PostgreSQL)│ │          │ │             │
     └─────────────┘ └──────────┘ └─────────────┘
```

## 3.8 Scalability Strategy (up to 100M Users)

| Phase | Users | Strategy |
|-------|-------|----------|
| **Phase 1 (Current)** | 0–100K | Static hosting + Supabase free tier + public Overpass API |
| **Phase 2** | 100K–1M | Supabase Pro; dedicated Overpass instance; CDN with edge caching |
| **Phase 3** | 1M–10M | Multi-region Supabase; sharded `app_data` by user hash; own tile server; service worker caching |
| **Phase 4** | 10M–100M | Supabase Enterprise or self-hosted PostgreSQL cluster; private Overpass cluster; edge computing (Cloudflare Workers); per-state data partitioning; authenticated user model with JWT |

**Key scalability properties of current architecture:**
1. Zero backend compute for core features (all client-side)
2. Static assets cacheable at CDN edge indefinitely
3. Supabase JSONB allows schema-less data evolution
4. Overpass API load distributable across multiple public instances
5. localStorage eliminates read traffic to backend for repeat users

## 3.9 Security Architecture

| Layer | Mechanism |
|-------|-----------|
| **Transport** | HTTPS/TLS 1.3 for all API communications |
| **Data at Rest** | Supabase PostgreSQL encryption at rest (AES-256) |
| **API Authentication** | Supabase anon key (publishable, rate-limited) |
| **Client Storage** | localStorage (same-origin policy protected) |
| **Database Access** | Row-Level Security (RLS) policies on all Supabase tables |
| **Input Validation** | Client-side form validation, type coercion, length limits |
| **XSS Prevention** | No `eval()`, template literals only for controlled data |
| **CORS** | Supabase CORS configured for allowed origins |
| **Content Security** | CSP headers configurable at hosting layer |
| **Health Data** | No PII beyond names; no government ID storage; no medical records |

## 3.10 Disaster Recovery & Failover Strategy

| Scenario | Recovery Strategy | RTO | RPO |
|----------|-------------------|-----|-----|
| **Supabase outage** | localStorage provides full offline functionality; data syncs on reconnection | 0 min (auto) | 0 (local data intact) |
| **Overpass API unavailable** | Seed data fallback (5 clinics, 12 doctors, 4 pharmacies) | 0 min (auto) | N/A (static fallback) |
| **Geolocation denied** | Default to Gulbarga, Karnataka (17.3297°N, 76.8343°E) | 0 min (auto) | N/A |
| **Speech API unavailable** | Demo transcript fallback; text input always available | 0 min (auto) | N/A |
| **CDN failure** | Multi-CDN configuration; origin fallback | < 5 min | 0 |
| **Static host failure** | Mirror deployment on secondary host | < 15 min | 0 |
| **Data corruption** | Supabase point-in-time recovery (24h retention on Pro) | < 30 min | < 24h |
| **Browser crash** | localStorage persists across sessions; auto-reload recovery | 0 min (auto) | 0 |

---

# 4. Functional Requirements

## 4.1 AI-Powered Symptom Analysis & Diagnosis

### FR-001: Multi-Modal Symptom Input

| Field | Value |
|-------|-------|
| **ID** | FR-001 |
| **Description** | The system shall accept symptom input through three distinct modes: voice recognition, text input, and icon-based selection |
| **Inputs** | Voice audio stream (BCP-47 locale), free-text symptom description, icon tap selections from 16 symptom categories |
| **Outputs** | Parsed symptom array mapped to standardized symptom keys |
| **Priority** | High |
| **Validation Criteria** | 1. Voice input transcribes with ≥80% accuracy for supported languages. 2. Text input tokenizes and matches keywords against 16 symptom categories. 3. Icon selection toggles symptoms with visual feedback. 4. All three modes produce identical downstream analysis. |

### FR-002: AI Urgency Scoring Engine

| Field | Value |
|-------|-------|
| **ID** | FR-002 |
| **Description** | The system shall compute a health urgency score (0–100) using a weighted multi-factor formula: Symptom Severity (40%) + Duration (25%) + Age Risk (15%) + Chronic History (20%) |
| **Inputs** | Selected symptoms (with severity 3–9), patient age, symptom duration (days), chronic condition history |
| **Outputs** | Numeric score (0–100), urgency classification (NORMAL/MODERATE/URGENT/EMERGENCY), color code, recommended action string, emoji indicator |
| **Priority** | High |
| **Validation Criteria** | 1. Score 0–39 classifies as NORMAL (green). 2. Score 40–69 classifies as MODERATE (yellow). 3. Score 70–84 classifies as URGENT (orange). 4. Score 85–100 classifies as EMERGENCY (red). 5. Age risk mapping: 0–12→6, 12–18→3, 18–40→0, 40–60→2, 60–75→5, 75+→8. 6. Chronic boosts: heart=10, other=6. |

### FR-003: Specialist Matching

| Field | Value |
|-------|-------|
| **ID** | FR-003 |
| **Description** | The system shall map detected symptoms to appropriate medical specialist categories using a rule-based mapping of 17 symptom keys to 11 specialist types |
| **Inputs** | Detected symptom keys |
| **Outputs** | Specialist type string (e.g., "Cardiologist", "Neurologist") |
| **Priority** | High |
| **Validation Criteria** | 1. Chest/sweating → Cardiologist. 2. Fever/diarrhea/nausea → General Physician. 3. Headache → Neurologist. 4. Joint pain → Orthopedic. 5. Breathing → Pulmonologist. 6. Eye → Ophthalmologist. 7. Rash → Dermatologist. |

### FR-004: Doctor Ranking Algorithm

| Field | Value |
|-------|-------|
| **ID** | FR-004 |
| **Description** | The system shall rank available doctors using a composite scoring algorithm factoring availability, proximity, wait time, rating, symptom match, and specialty boosts |
| **Inputs** | Detected symptoms, patient age, doctor database (12 doctors) |
| **Outputs** | Top 4 ranked doctors with composite scores |
| **Priority** | High |
| **Validation Criteria** | 1. Available doctors score 30 points. 2. Closer doctors score higher (25/distance). 3. Lower wait time scores higher (25/wait). 4. Higher rating scores higher (rating×4). 5. Child patients boost Pediatrician (+40). 6. Pregnancy boosts Gynaecologist (+40). 7. Chest/sweating boosts Cardiologist (+30). |

### FR-005: AI Assessment Result Display

| Field | Value |
|-------|-------|
| **ID** | FR-005 |
| **Description** | The system shall render a structured AI assessment card displaying urgency score, classification badge, recommended action, condition category, matched specialist, and medical disclaimer |
| **Inputs** | Computed urgency score, urgency classification, specialist type, detected symptoms |
| **Outputs** | Rendered HTML assessment card with color-coded urgency indicator |
| **Priority** | High |
| **Validation Criteria** | 1. Score displayed as percentage. 2. Badge color matches urgency level. 3. Action text is specific to urgency level. 4. Condition descriptions map from 16 coded categories. 5. Disclaimer text always visible. |

## 4.2 Emergency SOS System

### FR-006: One-Tap Emergency Activation

| Field | Value |
|-------|-------|
| **ID** | FR-006 |
| **Description** | The system shall provide a persistent SOS button in the header that triggers a full-screen emergency overlay with ambulance dispatch (108) and first-aid guidance |
| **Inputs** | SOS button tap |
| **Outputs** | Full-screen red emergency overlay with pulsing animation, ambulance call link (tel:108), dismiss action |
| **Priority** | High |
| **Validation Criteria** | 1. SOS button visible on all views. 2. Overlay covers entire viewport. 3. Ambulance button initiates tel:108 call. 4. Dismiss action shows relief modal. 5. Voice announcement triggered if voice nav enabled. 6. Deaf mode: triple red screen flash + caption. |

### FR-007: Auto-Emergency from AI Analysis

| Field | Value |
|-------|-------|
| **ID** | FR-007 |
| **Description** | The system shall automatically trigger the emergency overlay when AI urgency score reaches 85 or above (EMERGENCY classification) |
| **Inputs** | Computed urgency score ≥ 85 |
| **Outputs** | Emergency overlay activation, pre-selected chest + sweating symptoms |
| **Priority** | High |
| **Validation Criteria** | 1. Overlay triggers automatically for score ≥ 85. 2. Chest and sweating symptoms pre-selected. 3. Input mode switches to icon view. |

### FR-008: Instant Relief Engine

| Field | Value |
|-------|-------|
| **ID** | FR-008 |
| **Description** | The system shall display contextual first-aid steps with a 28-minute countdown timer for moderate-to-urgent health situations |
| **Inputs** | Symptom category (emergency/fever/stomach/general), urgency score ≥ 40 or duration ≥ 4 days |
| **Outputs** | Modal with numbered first-aid steps, countdown timer (28:00), emergency call button, family alert button |
| **Priority** | High |
| **Validation Criteria** | 1. Content maps symptom to 4 relief categories. 2. Timer counts down from 28:00 in 1-second intervals. 3. "Call 108" button functional. 4. "Alert Family" sends simulated notification. |

## 4.3 Doctor Discovery & Booking

### FR-009: Doctor Card Rendering

| Field | Value |
|-------|-------|
| **ID** | FR-009 |
| **Description** | The system shall render doctor cards displaying avatar, name, specialty, availability status, distance, estimated wait time, rating, languages spoken, consultation fee, call button, and book button |
| **Inputs** | Doctor database (12 doctors with full metadata) |
| **Outputs** | Rendered doctor cards in home view (top 3) and consult view (AI-matched top 4) |
| **Priority** | High |
| **Validation Criteria** | 1. Availability dot: green (available), amber (busy), red (unavailable). 2. Distance displayed in km. 3. Wait time in minutes. 4. Rating as star value. 5. Call button opens tel: link. 6. Book button opens booking modal. |

### FR-010: Appointment Booking

| Field | Value |
|-------|-------|
| **ID** | FR-010 |
| **Description** | The system shall allow users to select a time slot and confirm a booking with a selected doctor via a modal interface |
| **Inputs** | Selected doctor ID, selected time slot |
| **Outputs** | Booking confirmation toast, voice announcement, slot marked as selected |
| **Priority** | High |
| **Validation Criteria** | 1. Modal displays doctor info and 12 time slots (6 AM + 6 PM). 2. 3 random slots marked unavailable. 3. Single slot selection (previous deselected). 4. Confirmation required. 5. Toast notification on success. |

## 4.4 Medicine Ordering & Delivery

### FR-011: AI Prescription Generation

| Field | Value |
|-------|-------|
| **ID** | FR-011 |
| **Description** | The system shall generate a prescription from detected symptoms by mapping each symptom to condition-specific medicines, deduplicating, and storing per-family-member |
| **Inputs** | Detected symptoms, specialist type, family member ID |
| **Outputs** | Medicine array (name, dose, frequency, duration, category, generic flag), stored in `memberPrescriptions` |
| **Priority** | High |
| **Validation Criteria** | 1. Medicines sourced from 13 condition mappings. 2. Duplicate medicines eliminated. 3. Prescription stored with date, doctor, medicine list. 4. Data persisted to localStorage and Supabase. |

### FR-012: Multi-Platform Price Comparison

| Field | Value |
|-------|-------|
| **ID** | FR-012 |
| **Description** | The system shall compare medicine prices across 4 online pharmacy platforms (Tata 1mg, Apollo Pharmacy, MedPlus, PharmEasy) and identify the cheapest option |
| **Inputs** | Medicine list, platform price database (24 medicines × 4 platforms) |
| **Outputs** | Per-medicine cheapest price, MRP comparison with savings %, total order cost per platform, "BEST DEAL" indicator, expandable per-medicine breakdown |
| **Priority** | High |
| **Validation Criteria** | 1. MRP displayed with strikethrough. 2. Savings percentage calculated correctly. 3. Best platform highlighted with ribbon. 4. Per-medicine price breakdown expandable. 5. COD and free delivery thresholds displayed. |

### FR-013: Delivery Tracking

| Field | Value |
|-------|-------|
| **ID** | FR-013 |
| **Description** | The system shall simulate a 4-step delivery tracking process (Confirmed → Packing → Out for Delivery → Delivered) with live ETA countdown |
| **Inputs** | Order confirmation (platform or local pharmacy selection) |
| **Outputs** | Visual 4-step tracker with animated progress, live ETA countdown, voice announcement on delivery |
| **Priority** | Medium |
| **Validation Criteria** | 1. 4 steps rendered with connecting lines. 2. Steps auto-advance at 5min, 20min, 35min marks. 3. ETA countdown updates every second. 4. Delivery completion notified via toast + voice. 5. Simulated 45-min delivery (1 real second = 30 simulated seconds). |

### FR-014: Platform Order Redirect

| Field | Value |
|-------|-------|
| **ID** | FR-014 |
| **Description** | The system shall redirect users to the selected pharmacy platform's search page with all prescribed medicine names pre-filled in the URL |
| **Inputs** | Selected platform, medicine names |
| **Outputs** | Browser redirect to platform search URL (e.g., `tata1mg.com/search/all?name=...`) |
| **Priority** | Medium |
| **Validation Criteria** | 1. URL contains all medicine names. 2. Redirect opens in new tab. 3. Redirect delayed 2 seconds after order confirmation toast. |

## 4.5 Mobile Clinic & Health Camp Discovery

### FR-015: Live Facility Data from Overpass API

| Field | Value |
|-------|-------|
| **ID** | FR-015 |
| **Description** | The system shall query the Overpass API for healthcare facilities (hospitals, clinics, doctors, PHCs, CHCs, Medical Colleges) within 100km of the user's location |
| **Inputs** | User latitude/longitude (from Geolocation API), 100km search radius |
| **Outputs** | Up to 50 facilities with name, address, distance, specialty, type, schedule, capacity |
| **Priority** | High |
| **Validation Criteria** | 1. Query includes 7 facility types. 2. 15-second fetch timeout. 3. Results deduplicated by name. 4. Distance calculated via haversine. 5. Results sorted by distance. 6. Capped at 50 results. 7. Seed data shown as fallback during/on-failure. |

### FR-016: Interactive Clinic Map

| Field | Value |
|-------|-------|
| **ID** | FR-016 |
| **Description** | The system shall render an interactive Leaflet map with user location marker and facility markers (emoji icons), each with popup details and directions link |
| **Inputs** | Parsed facility data, user coordinates |
| **Outputs** | Leaflet map with OSM tiles, user marker (📍), facility markers (type-specific emoji), popups, auto-fit bounds |
| **Priority** | High |
| **Validation Criteria** | 1. Map renders with OSM tiles. 2. User location marked. 3. Max 30 facility markers. 4. Popups show name, type, distance, directions link. 5. Map auto-fits bounds. |

### FR-017: Clinic Booking

| Field | Value |
|-------|-------|
| **ID** | FR-017 |
| **Description** | The system shall allow booking at mobile clinics/health camps with 8 time slots per clinic |
| **Inputs** | Selected clinic ID, selected time slot |
| **Outputs** | Booking confirmation toast, voice announcement |
| **Priority** | Medium |
| **Validation Criteria** | 1. 8 time slots (8:00 AM – 11:30 AM, 30-minute intervals). 2. Unavailable slots based on booking percentage. 3. Confirmation via modal. |

## 4.6 Nearby Healthcare Search

### FR-018: Geolocation-Based Facility Search

| Field | Value |
|-------|-------|
| **ID** | FR-018 |
| **Description** | The system shall search for nearby healthcare facilities (hospitals, clinics, doctors, pharmacies) within 10km, expanding to 25km if insufficient results |
| **Inputs** | User geolocation, specialist type from AI analysis |
| **Outputs** | Facility cards with type badge, distance, name, address, phone, specialty, call + directions buttons |
| **Priority** | High |
| **Validation Criteria** | 1. Initial search radius: 10km. 2. Auto-expand to 25km if results < threshold. 3. Results capped at 20. 4. Sorted by type priority (hospital > clinic > doctors > pharmacy), then distance. 5. Call button functional. 6. Directions button opens Google Maps. |

### FR-019: Nearby Facility Map

| Field | Value |
|-------|-------|
| **ID** | FR-019 |
| **Description** | The system shall render an interactive map showing the user's position and nearby facilities with color-coded markers |
| **Inputs** | Facility data, user coordinates |
| **Outputs** | Leaflet map with pulsing user marker (blue), facility markers (🏥 red, 🏪 blue, 🩺 green, 💊 orange), popups |
| **Priority** | Medium |
| **Validation Criteria** | 1. User marker pulses with CSS animation. 2. Facility markers color-coded by type. 3. Popups show name, type, distance, directions. 4. Map auto-fits bounds. |

## 4.7 Family Health Accounts

### FR-020: Family Member Management

| Field | Value |
|-------|-------|
| **ID** | FR-020 |
| **Description** | The system shall allow adding and removing family members with name, relation (11 types), age, and auto-assigned avatar emoji |
| **Inputs** | Member name, relation type, age |
| **Outputs** | New family member card in grid, updated consult dropdown, persisted to storage |
| **Priority** | High |
| **Validation Criteria** | 1. Name and age required fields. 2. 11 relation types with emoji mapping. 3. Minimum 1 member enforced (cannot remove last). 4. Remove mode with visual ✕ badges. 5. Confirmation dialog on remove. 6. Data persisted to localStorage + Supabase. |

### FR-021: Per-Member Prescription Storage

| Field | Value |
|-------|-------|
| **ID** | FR-021 |
| **Description** | The system shall store and display prescriptions per family member, including AI-generated prescriptions and seed data |
| **Inputs** | Family member ID, medicine array, doctor name |
| **Outputs** | Stored prescription with date, doctor, medicine summary, full medicine objects; prescription history list with view detail modal |
| **Priority** | High |
| **Validation Criteria** | 1. Prescriptions stored in `memberPrescriptions[memberId]`. 2. New prescriptions prepended (most recent first). 3. Seed + dynamic prescriptions merged for display. 4. Detail modal shows full medicine info (name, dose, frequency, duration). 5. Prescription count badge on family card. |

### FR-022: Risk Prediction Engine

| Field | Value |
|-------|-------|
| **ID** | FR-022 |
| **Description** | The system shall display predictive health risk alerts based on member chronic conditions, visit patterns, and test schedules |
| **Inputs** | Member risk alert flags, chronic conditions, visit history |
| **Outputs** | Color-coded risk alert cards (chronic=amber, hypertension=red, reminder=blue) |
| **Priority** | Medium |
| **Validation Criteria** | 1. Chronic Risk: same symptom 4+ times in 60 days. 2. Hypertension Watch: BP trending upward. 3. Thyroid Check Due: overdue regular test. 4. Alerts color-coded by severity. |

### FR-023: Health Chart & Profile

| Field | Value |
|-------|-------|
| **ID** | FR-023 |
| **Description** | The system shall display a member profile card with chronic conditions, medications, visit history chart (6-month bar chart), and risk trend indicator |
| **Inputs** | Member data object |
| **Outputs** | Profile card, pure CSS bar chart (6 months), risk trend badge (Stable/Watch/Worsening) |
| **Priority** | Medium |
| **Validation Criteria** | 1. Profile shows avatar, name, relation, age, chronic badges, last visit, next due, current medications. 2. Bar chart renders 6 months of visit data. 3. Risk trend computed from visit pattern. |

### FR-024: Consult-Tab Family Integration

| Field | Value |
|-------|-------|
| **ID** | FR-024 |
| **Description** | The system shall allow selecting which family member a consultation is for via a dropdown in the consult tab, ensuring prescriptions are stored to the correct member |
| **Inputs** | Family member selection from dropdown |
| **Outputs** | Updated `consultForMember` state, prescription stored to selected member |
| **Priority** | High |
| **Validation Criteria** | 1. Dropdown populated with all family members (emoji + name). 2. Default: first member (self). 3. Selection persists during session. 4. Prescription generated after AI analysis stores to selected member. |

## 4.8 Multilingual Support

### FR-025: Runtime Language Switching

| Field | Value |
|-------|-------|
| **ID** | FR-025 |
| **Description** | The system shall support runtime switching between 4 languages (English, Hindi, Kannada, Telugu) with immediate UI translation of all visible text |
| **Inputs** | Language code selection (en/hi/kn/te) |
| **Outputs** | All `data-i18n` and `data-i18n-placeholder` elements updated, dynamic content re-rendered, voice locale updated |
| **Priority** | High |
| **Validation Criteria** | 1. 300+ translation keys per language. 2. All static text translated via DOM walker. 3. Dynamic content re-rendered (doctors, clinics, family, prescriptions). 4. Voice synthesis locale matches selected language (BCP-47 mapping). 5. Toast notification confirms switch. |

## 4.9 Accessibility Engine

### FR-026: Caretaker/Elderly Mode

| Field | Value |
|-------|-------|
| **ID** | FR-026 |
| **Description** | The system shall provide an elderly-friendly mode with enlarged text (base 20px), giant buttons (min-height 72px), and auto-enabled voice navigation |
| **Inputs** | Toggle switch or "Caretaker Mode" button in family view |
| **Outputs** | Body class `caretaker-mode` applied; font-size tokens overridden; voice navigation enabled |
| **Priority** | High |
| **Validation Criteria** | 1. Base font size increases to 20px. 2. All buttons min-height 72px. 3. Voice navigation auto-enabled. 4. All card text enlarged. |

### FR-027: Icon Navigation Mode

| Field | Value |
|-------|-------|
| **ID** | FR-027 |
| **Description** | The system shall provide an icon-based navigation mode for illiterate users, auto-navigating to the symptom icon grid |
| **Inputs** | Toggle switch |
| **Outputs** | Navigation to consult view, icon input tab activated |
| **Priority** | Medium |
| **Validation Criteria** | 1. Auto-navigates to consult view. 2. Icon input tab selected. 3. 16 emoji-based symptom icons displayed. |

### FR-028: Low Bandwidth / Lite Mode

| Field | Value |
|-------|-------|
| **ID** | FR-028 |
| **Description** | The system shall provide a lite mode that disables all CSS animations/transitions and shows offline/SMS fallback banners |
| **Inputs** | Toggle switch |
| **Outputs** | Body class `lite-mode` applied; all `animation: none !important` and `transition: none !important`; offline + SMS banners visible |
| **Priority** | Medium |
| **Validation Criteria** | 1. All CSS animations disabled. 2. All CSS transitions disabled. 3. Offline mode banner displayed. 4. SMS fallback banner displayed. |

### FR-029: Voice Navigation

| Field | Value |
|-------|-------|
| **ID** | FR-029 |
| **Description** | The system shall provide voice announcements for key actions (navigation, booking confirmation, analysis results) using Web Speech Synthesis |
| **Inputs** | Toggle switch |
| **Outputs** | `speak()` function enabled; announcements in selected language locale |
| **Priority** | Medium |
| **Validation Criteria** | 1. Speech rate: 0.9. 2. Language matches BCP-47 locale (en-IN, hi-IN, kn-IN, te-IN). 3. Announcements on: navigation, member selection, booking, analysis completion. |

### FR-030: High Contrast Mode

| Field | Value |
|-------|-------|
| **ID** | FR-030 |
| **Description** | The system shall provide a high-contrast mode with darker muted colors, thicker borders, and enhanced readability |
| **Inputs** | Toggle switch |
| **Outputs** | Body class `high-contrast` applied; muted text darkened; borders thickened to 2px |
| **Priority** | Medium |
| **Validation Criteria** | 1. Muted text color darkened. 2. All borders increased to 2px. 3. Surface color darkened. |

### FR-031: Deaf / Caption Mode

| Field | Value |
|-------|-------|
| **ID** | FR-031 |
| **Description** | The system shall provide a comprehensive deaf/caption mode that converts all audio feedback to visual feedback: caption bar, screen flashes, enhanced toasts, voice UI hiding |
| **Inputs** | Toggle switch |
| **Outputs** | Body class `deaf-mode`; caption bar created; `speak()` overridden to visual captions; `showToast()` patched for 6s display; voice tab/button hidden; text input auto-selected; emergency flash overlay on SOS; 🔕 badge on FAB |
| **Priority** | High |
| **Validation Criteria** | 1. Caption bar appears at bottom of screen. 2. All `speak()` calls display as visual captions (6s auto-hide). 3. Voice input tab and mic button hidden. 4. Text input tab auto-selected. 5. Toast duration extended to 6s. 6. Emergency triggers triple red screen flash. 7. SOS button pulses visually. 8. All features cleanly teardown on deactivation. |

## 4.10 Data Persistence

### FR-032: localStorage Persistence

| Field | Value |
|-------|-------|
| **ID** | FR-032 |
| **Description** | The system shall persist family members and prescriptions to browser localStorage on every data mutation, providing instant offline-capable data access |
| **Inputs** | `FAMILY_MEMBERS` array, `AppState.memberPrescriptions` object |
| **Outputs** | JSON-serialized data stored under keys `setu_family_members` and `setu_prescriptions` |
| **Priority** | High |
| **Validation Criteria** | 1. Data persists across page reloads. 2. Data persists across browser restarts. 3. Write occurs on every add/remove member and every prescription store. 4. Load occurs on app initialization before rendering. |

### FR-033: Supabase Cloud Sync

| Field | Value |
|-------|-------|
| **ID** | FR-033 |
| **Description** | The system shall asynchronously backup family and prescription data to Supabase PostgreSQL via JSONB upsert, with graceful fallback if cloud is unavailable |
| **Inputs** | Same data as FR-032 |
| **Outputs** | Rows upserted in `app_data` table (keys: `family_members`, `prescriptions`) |
| **Priority** | Medium |
| **Validation Criteria** | 1. Upsert is non-blocking (async). 2. Cloud failure does not affect app functionality. 3. Cloud data overwrites local on load if present. 4. Local data pushed to cloud if cloud is empty. 5. Console warning on table-not-found error. |

### FR-034: Storage Initialization Sequence

| Field | Value |
|-------|-------|
| **ID** | FR-034 |
| **Description** | The system shall execute a storage initialization sequence on app load: load localStorage → init Supabase → try cloud load → sync if needed → re-render UI |
| **Inputs** | N/A (triggers on `DOMContentLoaded`) |
| **Outputs** | `FAMILY_MEMBERS` and `AppState.memberPrescriptions` populated from best available source; family grid rendered with loaded data |
| **Priority** | High |
| **Validation Criteria** | 1. localStorage loads first (instant). 2. Supabase client initializes from CDN library. 3. Cloud data attempted if client available. 4. Cloud data takes precedence over local if present. 5. Seed data persisted on first visit. 6. Family grid re-rendered after load. |

## 4.11 Navigation & Core UI

### FR-035: SPA View Navigation

| Field | Value |
|-------|-------|
| **ID** | FR-035 |
| **Description** | The system shall provide tab-based single-page navigation across 5 views (Home, Consult, Medicines, Clinic, Family) with CSS class switching, active tab highlighting, and optional voice announcement |
| **Inputs** | Tab button tap or programmatic `navigateTo(view)` call |
| **Outputs** | Active view displayed, other views hidden, bottom nav tab highlighted, Leaflet maps invalidated on clinic/consult views |
| **Priority** | High |
| **Validation Criteria** | 1. Only one view visible at a time. 2. Active tab highlighted with trust-light background. 3. Leaflet map size recalculated on view switch. 4. Voice announcement if voice nav enabled. |

### FR-036: Toast Notification System

| Field | Value |
|-------|-------|
| **ID** | FR-036 |
| **Description** | The system shall display slide-down toast notifications with HTML support, auto-dismiss after 3.2 seconds (6 seconds in deaf mode) |
| **Inputs** | Message string (HTML-capable) |
| **Outputs** | Pill-shaped toast at top-center of viewport, auto-dismissed |
| **Priority** | High |
| **Validation Criteria** | 1. Toast slides down from top. 2. Auto-dismiss after 3.2s (6s in deaf mode). 3. Only one toast visible at a time. 4. HTML content supported. |

### FR-037: Modal System

| Field | Value |
|-------|-------|
| **ID** | FR-037 |
| **Description** | The system shall provide bottom-sheet style modals with backdrop blur, slide-up animation, click-outside-to-close, and max 85vh scrollable content |
| **Inputs** | Modal ID to open/close |
| **Outputs** | Modal overlay visible/hidden with CSS transitions |
| **Priority** | High |
| **Validation Criteria** | 1. Modal slides up from bottom. 2. Backdrop blur applied behind modal. 3. Click outside modal to close. 4. Content scrollable at max 85vh. 5. Multiple modals: booking, clinic booking, relief, add family, prescription detail. |

### FR-038: Voice Input (Web Speech Recognition)

| Field | Value |
|-------|-------|
| **ID** | FR-038 |
| **Description** | The system shall accept voice input for symptom description using the Web Speech Recognition API with locale-aware recognition (en-IN, hi-IN, kn-IN, te-IN) and demo fallback |
| **Inputs** | Voice audio stream via browser microphone |
| **Outputs** | Transcribed text in transcript area, visual listening indicator |
| **Priority** | Medium |
| **Validation Criteria** | 1. Language matches app locale via `LANG_VOICE_MAP`. 2. `continuous: false`, `interimResults: true`. 3. Visual pulse animation on mic button during listening. 4. Transcript populated on recognition result. 5. Demo fallback if Speech API unavailable (3 demo phrases). |

## 4.12 Offline Mode & Fallback Systems

### FR-039: Offline Data Access

| Field | Value |
|-------|-------|
| **ID** | FR-039 |
| **Description** | The system shall provide full offline functionality for family data, prescription history, and AI analysis using localStorage and seed data |
| **Inputs** | N/A |
| **Outputs** | All family and prescription data available offline; seed doctors, clinics, medicines available without network |
| **Priority** | High |
| **Validation Criteria** | 1. Family data loads from localStorage without network. 2. AI analysis functions entirely client-side. 3. Seed doctors/clinics/medicines available without API calls. 4. Lite mode banners indicate offline status. |

### FR-040: API Fallback Hierarchy

| Field | Value |
|-------|-------|
| **ID** | FR-040 |
| **Description** | The system shall implement graceful degradation for all external API dependencies |
| **Inputs** | API timeout or error |
| **Outputs** | Fallback data loaded; user notified via toast/console |
| **Priority** | High |
| **Validation Criteria** | 1. Overpass API failure → seed data (5 clinics). 2. Geolocation denied → Gulbarga, Karnataka fallback. 3. Speech API unavailable → demo transcript. 4. Supabase failure → localStorage-only. 5. Map load failure → graceful empty container. |

---

# 5. Non-Functional Requirements

## 5.1 Performance Requirements

| ID | Requirement | Target | Measurement |
|----|-------------|--------|-------------|
| NFR-001 | Initial page load (FCP) | ≤ 2.0 seconds on 3G | Lighthouse audit |
| NFR-002 | Time to interactive (TTI) | ≤ 3.5 seconds on 3G | Lighthouse audit |
| NFR-003 | AI urgency score computation | ≤ 50 milliseconds | Console timing |
| NFR-004 | Doctor ranking computation | ≤ 100 milliseconds | Console timing |
| NFR-005 | View navigation switch | ≤ 100 milliseconds perceived | CSS transition measurement |
| NFR-006 | localStorage read/write | ≤ 10 milliseconds | Performance API |
| NFR-007 | Overpass API query response | ≤ 15 seconds (with AbortSignal timeout) | Network timing |
| NFR-008 | Total JS payload | ≤ 150 KB uncompressed | Build measurement |
| NFR-009 | Total CSS payload | ≤ 80 KB uncompressed | Build measurement |
| NFR-010 | Leaflet map render | ≤ 2 seconds including tile load on 4G | Visual timing |

## 5.2 Availability & Uptime Targets

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-011 | Core application availability (client-side) | 99.9% (limited only by hosting uptime) |
| NFR-012 | Supabase cloud sync availability | 99.5% (Supabase SLA) |
| NFR-013 | Offline functionality | 100% for localStorage-backed features |
| NFR-014 | Overpass API dependency | 95% (public infrastructure) with seed data fallback |
| NFR-015 | Emergency SOS availability | 100% (client-side, no network dependency for tel: link) |

## 5.3 Security & Compliance

| ID | Requirement | Implementation |
|----|-------------|----------------|
| NFR-016 | Transport encryption | HTTPS/TLS 1.3 for all external API calls |
| NFR-017 | Data at rest encryption | Supabase PostgreSQL AES-256 storage encryption |
| NFR-018 | No PII beyond family names | No government IDs, no medical records, no authentication credentials stored |
| NFR-019 | Supabase RLS enforcement | Row-Level Security policies on all tables |
| NFR-020 | XSS prevention | No `eval()`, controlled template literals, no raw user HTML injection in critical paths |
| NFR-021 | CORS policy | Supabase configured for allowed origins only |
| NFR-022 | API key exposure | Publishable anon key only; no server-side secrets in client code |
| NFR-023 | Health data handling | HIPAA-style principles: minimum necessary data, no diagnosis storage in cloud, disclaimers on AI output |

## 5.4 Usability & Accessibility (WCAG 2.1 AA)

| ID | Requirement | Implementation |
|----|-------------|----------------|
| NFR-024 | Color contrast ratio | Minimum 4.5:1 for normal text, 3:1 for large text (base palette) |
| NFR-025 | High contrast mode | Enhanced contrast mode available via accessibility panel |
| NFR-026 | Touch target size | Minimum 44×44px (48×48px in caretaker mode) per WCAG 2.5.5 |
| NFR-027 | Keyboard navigation | Focus-visible styles on all interactive elements |
| NFR-028 | Screen reader alternative | Voice navigation mode with `speak()` announcements |
| NFR-029 | Non-text content | Emoji indicators, color-coded badges with text labels |
| NFR-030 | Deaf/mute support | Full deaf/caption mode with visual-only alerts |
| NFR-031 | Illiteracy support | Icon navigation mode with emoji-based symptom input |
| NFR-032 | Elderly support | Caretaker mode with enlarged text and simplified UI |
| NFR-033 | Low-bandwidth support | Lite mode disabling animations and reducing visual overhead |

## 5.5 Reliability

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-034 | Data persistence reliability | Zero data loss for localStorage operations |
| NFR-035 | API failure recovery | Automatic fallback to seed data within 0 seconds |
| NFR-036 | Browser crash recovery | Full state recovery from localStorage on restart |
| NFR-037 | Emergency system reliability | SOS functional regardless of network status (tel: protocol) |

## 5.6 Maintainability

| ID | Requirement | Implementation |
|----|-------------|----------------|
| NFR-038 | Module separation | 13 JS modules with defined responsibilities, no circular dependencies |
| NFR-039 | CSS architecture | 4 separate stylesheets (base, components, views, accessibility) |
| NFR-040 | i18n externalization | All user-facing strings externalized to i18n.js with `data-i18n` attributes |
| NFR-041 | Code documentation | File-level JSDoc headers, section separators, inline comments |
| NFR-042 | Naming conventions | camelCase for JS functions/variables, kebab-case for CSS classes, BEM-inspired component naming |

## 5.7 Scalability

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-043 | Concurrent users | Architecture supports 100M users (static assets, client-side processing) |
| NFR-044 | Data growth | JSONB schema supports unbounded family members and prescriptions per user |
| NFR-045 | Language expansion | i18n architecture supports adding languages by extending `TRANSLATIONS` object |
| NFR-046 | Feature modularity | New modules addable without modifying existing code (append-only JS loading) |

## 5.8 Responsiveness (Mobile-First)

| ID | Requirement | Implementation |
|----|-------------|----------------|
| NFR-047 | Mobile phone (320–375px) | Full functionality, single-column layout, 56px nav |
| NFR-048 | Standard phone (376–767px) | Primary target, 64px nav, 2-column grids where applicable |
| NFR-049 | Tablet (768–1023px) | 72px nav, 720px max-width centered, 3-column grids |
| NFR-050 | Desktop (1024–1439px) | 76px nav, 960px max-width, 4-column grids |
| NFR-051 | Large desktop (1440px+) | 76px nav, 1100px max-width, full grid layouts |

## 5.9 Browser & Device Compatibility

| ID | Browser | Minimum Version | Support Level |
|----|---------|-----------------|---------------|
| NFR-052 | Google Chrome | 80+ | Full |
| NFR-053 | Mozilla Firefox | 78+ | Full (no Speech Recognition) |
| NFR-054 | Apple Safari | 13+ | Full (limited Speech Recognition) |
| NFR-055 | Microsoft Edge | 80+ | Full |
| NFR-056 | Samsung Internet | 12+ | Full |
| NFR-057 | Opera Mobile | 46+ | Full |
| NFR-058 | Android WebView | 80+ | Full |

---

# 6. Design System & UI/UX Specifications

## 6.1 Design Philosophy

SwasthyaSetu follows a **"Rural-First Cinematic"** design philosophy:

1. **Clarity over decoration** — Every visual element serves a functional purpose
2. **Immediate comprehension** — Icons, colors, and badges provide instant status understanding
3. **Reduced cognitive load** — Progressive disclosure, one action per card, clear hierarchy
4. **Cultural sensitivity** — Indian name conventions, local language support, familiar emoji symbols
5. **Emergency prominence** — SOS always accessible, danger states visually dominant
6. **Trust signals** — Government branding, doctor credentials, pharmacy verification badges

## 6.2 Color Token System

| Token | CSS Variable | Hex Value | Usage |
|-------|-------------|-----------|-------|
| Safe / Green | `--c-safe` | `#1B8A5A` | Success states, availability, normal status |
| Safe Light | `--c-safe-light` | `#E6F4ED` | Safe backgrounds |
| Trust / Blue | `--c-trust` | `#1A56DB` | Primary actions, links, active states |
| Trust Light | `--c-trust-light` | `#E8EFFA` | Trust backgrounds, active nav tabs |
| Emergency / Red | `--c-emergency` | `#E02020` | SOS, emergency overlay, danger badges |
| Emergency Light | `--c-emergency-light` | `#FDECEC` | Emergency backgrounds |
| Caution / Amber | `--c-caution` | `#D97706` | Warning states, moderate urgency |
| Caution Light | `--c-caution-light` | `#FEF3E2` | Warning backgrounds |
| Urgent / Orange | `--c-urgent` | `#EA580C` | High urgency states |
| Surface | `--c-surface` | `#F8FAFC` | Page background |
| White | `--c-white` | `#FFFFFF` | Card backgrounds |
| Ink | `--c-ink` | `#1E293B` | Primary text |
| Muted | `--c-muted` | `#64748B` | Secondary text, labels |
| Border | `--c-border` | `#E2E8F0` | Card borders, dividers |

## 6.3 Typography System

| Token | CSS Variable | Value | Usage |
|-------|-------------|-------|-------|
| Font Primary | `--f-primary` | `'DM Sans', sans-serif` | All body text, UI elements |
| Font Display | `--f-display` | `'DM Serif Display', serif` | Hero headings, brand elements |
| Size XS | `--fs-xs` | `11px` | Micro labels, badges |
| Size SM | `--fs-sm` | `13px` | Secondary text, captions |
| Size Base | `--fs-base` | `15px` | Body text, inputs |
| Size MD | `--fs-md` | `17px` | Card titles, section labels |
| Size LG | `--fs-lg` | `20px` | Section headings |
| Size XL | `--fs-xl` | `24px` | View titles |
| Size 2XL | `--fs-2xl` | `30px` | Hero heading |
| Size 3XL | `--fs-3xl` | `38px` | Display heading |
| Line Height | `--lh` | `1.65` | Universal line height |

**Caretaker Mode Overrides:** Base → 20px, SM → 17px, MD → 20px, LG → 24px

## 6.4 Spacing & Grid Rules

| Token | CSS Variable | Value | Usage |
|-------|-------------|-------|-------|
| Radius SM | `--r-sm` | `6px` | Input fields, small elements |
| Radius MD | `--r-md` | `10px` | Cards, buttons |
| Radius LG | `--r-lg` | `14px` | Modals, large cards |
| Radius XL | `--r-xl` | `20px` | Hero sections |
| Radius Full | `--r-full` | `9999px` | Pills, badges, FAB |

**Grid System:**
- `.card-grid` — CSS Grid with `auto-fill`, `minmax(280px, 1fr)`, gap 16px
- Family grid: 2 columns (mobile) → 3 columns (tablet) → 5 columns (desktop)
- Symptom grid: 4 columns (mobile) → 8 columns (desktop)
- Slot grid: 3 columns fixed

**Spacing Scale:** 4px base unit — `4, 8, 12, 16, 20, 24, 32, 40, 48, 64`

## 6.5 Motion & Animation Guidelines

| Animation | Token | Duration | Easing | Usage |
|-----------|-------|----------|--------|-------|
| Fast | `--t-fast` | `160ms` | `--ease-out` | Hover states, toggle switches |
| Base | `--t-base` | `280ms` | `--ease-out` | View transitions, modal open |
| Slow | `--t-slow` | `480ms` | `--ease-in-out` | Hero reveals, map loads |
| SOS Glow | `sos-glow` | `1.5s` | `ease-in-out` | Continuous SOS button pulse |
| Emergency Pulse | `emergency-pulse` | `0.8s` | Infinite | Emergency overlay flash |
| Stat Blink | `blink` | `1.5s` | Infinite | Stats ticker green dot |
| View Slide | `slideIn` | `0.3s` | `ease-out` | View entry animation |
| Voice Pulse | `pulse-ring` | `1.2s` | Infinite | Voice input active indicator |
| Toast Slide | `slideDown` | `0.3s` | `ease-out` | Toast notification entry |
| Delivery Pulse | `pulse` | `1.5s` | Infinite | Active delivery step |
| Deaf Caption Flash | `caption-flash` | `0.4s` | — | New caption highlight |
| Deaf Screen Flash | `deaf-screen-flash` | `0.5s` | — | Emergency visual alert |

**Lite Mode:** All animations set to `none !important`, all transitions set to `none !important`.

## 6.6 Emergency Mode Visual Inversion Rules

| Normal State | Emergency State |
|-------------|-----------------|
| White background | Red (#E02020) full-screen overlay |
| Standard typography | 2XL bold centered text |
| Subtle shadows | No shadows, high contrast red/white |
| Standard buttons | Oversized ambulance button with scale animation |
| SOS button glow | SOS hidden behind overlay |
| Standard transitions | Pulsing 0.8s infinite animation |
| Voice navigation | "EMERGENCY ALERT" spoken announcement |
| Toast notifications | Emergency overlay supersedes all toasts |

**Deaf Mode Emergency Inversion:**
- Triple screen flash (red → transparent, 500ms each)
- Caption bar: "🚨 EMERGENCY — Visual alert active"
- SOS button: `deaf-sos-pulse` animation (ring expansion)
- Emergency badge: `deaf-badge-flash` opacity animation

## 6.7 Button System

| Variant | Class | Background | Text | Border | Usage |
|---------|-------|------------|------|--------|-------|
| Primary | `.btn` | `--c-trust` | White | None | Primary actions (Book, Confirm, Analyze) |
| Success | `.btn-success` | `--c-safe` | White | None | Positive actions (Confirm Order) |
| Danger | `.btn-danger` | `--c-emergency` | White | None | Emergency actions (Call 108) |
| Outline | `.btn-outline` | Transparent | `--c-trust` | 1px trust | Secondary actions (View, Details) |
| Ghost | `.btn-ghost` | Transparent | `--c-trust` | None | Tertiary actions (Dismiss, Cancel) |
| Full Width | `.btn-full` | Inherits variant | — | — | Mobile CTAs |
| Small | `.btn-sm` | Inherits variant | 12px | — | Inline actions |

**States:** `:hover` (brightness 1.08, translateY -1px), `:active` (brightness 0.95), `:focus-visible` (3px trust outline)

**Caretaker Mode:** Minimum height 72px, font size 17px.

## 6.8 Component Library

| Component | Description | Variants |
|-----------|-------------|----------|
| **Card** | Container with border-radius, shadow, hover lift | Default, Doctor, Family, Clinic, Platform, Relief |
| **Badge** | Small pill-shaped status indicator | Safe, Moderate, Urgent, Emergency, Trust |
| **Modal** | Bottom-sheet overlay with backdrop blur | Booking, Clinic Booking, Relief, Add Family, Rx Detail |
| **Toast** | Slide-down notification pill | Default (3.2s), Deaf-enhanced (6s) |
| **Toggle Switch** | 44×24px pill switch for accessibility | Default, Active (trust blue) |
| **Slot Button** | Time slot selector in booking modals | Default, Selected (trust), Unavailable (muted) |
| **Doctor Card** | Full doctor info card with actions | Home (compact), Consult (full with match info) |
| **Family Card** | Member avatar card with status | Default, Active (trusted border), Remove mode (red) |
| **Delivery Tracker** | 4-step horizontal progress indicator | Steps: completed, active (pulsing), pending |
| **Risk Alert** | Left-bordered alert card | Chronic (amber), Hypertension (red), Reminder (blue) |
| **Health Chart** | Pure CSS vertical bar chart | 6-month bars with color scaling |
| **Caption Bar** | Fixed bottom caption strip | Default, Flash animation on new content |
| **Platform Card** | Pharmacy comparison card | Default, Best Deal (ribbon) |
| **Pharmacy Row** | Selectable radio-style table row | Default, Selected (highlighted) |
| **Symptom Button** | Emoji symptom selector | Default, Selected (trust background) |
| **Input Field** | Styled text/number input | Default, Focus (trust ring) |

## 6.9 Interaction Behavior

| Interaction | Behavior |
|-------------|----------|
| **Card Tap** | Hover lift (translateY -2px), shadow elevation increase |
| **Button Tap** | Scale down (0.95), brightness decrease; release → action |
| **Modal Open** | Backdrop fade-in (280ms), sheet slide-up (280ms) |
| **Modal Close** | Click outside backdrop or close button; reverse animation |
| **Tab Switch** | Instant CSS class swap, Leaflet invalidateSize on map views |
| **Toast** | Slide down from top-center, auto-dismiss with fade |
| **Symptom Toggle** | Background color swap (trust-light), selected class toggle |
| **Voice Input** | Pulse animation on mic button, transcript updates in real-time |
| **Delivery Progress** | Step dots animate from gray → green (completed), active step pulses |
| **Language Switch** | Immediate text replacement, no reload, dynamic content re-rendered |
| **Family Card Select** | Trust-colored left border, profile section scroll-into-view |
| **Remove Mode** | Red border on all cards, ✕ badge overlay, tap-to-remove |

## 6.10 Accessibility Rules

| Rule | Specification |
|------|---------------|
| **Focus Indicator** | 3px `--c-trust` outline offset 2px on `:focus-visible` |
| **Touch Targets** | Minimum 44×44px; 72×72px in caretaker mode |
| **Color Independence** | All status information conveyed via text + color (never color-only) |
| **Animation Preference** | Lite mode disables all motion; respects `prefers-reduced-motion` |
| **Language Support** | All text localizable; no hardcoded strings in JS/HTML |
| **Voice Feedback** | Key actions announced via Speech Synthesis when enabled |
| **Caption Equivalence** | All voice output has visual caption equivalent in deaf mode |
| **Emergency Visibility** | SOS button minimum 60×36px, high contrast red, always visible |
| **Readable Line Length** | Max content width 1100px to maintain comfortable reading line |
| **Font Scaling** | Base 15px, scales to 20px in caretaker mode, respects browser zoom |

---

# 7. Technology Stack

## 7.1 Frontend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| HTML5 | Living Standard | Document structure, semantic elements, native form validation |
| CSS3 | Living Standard | Styling, layout (Flexbox + Grid), animations, design tokens via custom properties |
| JavaScript (ES6+) | ES2020+ | Application logic, DOM manipulation, API integration |
| Leaflet.js | 1.9.4 | Interactive map rendering with OpenStreetMap tiles |
| Google Fonts | — | DM Sans (primary), DM Serif Display (display) typefaces |

## 7.2 Backend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| Supabase | v2 (JS SDK) | PostgreSQL BaaS — cloud data persistence, REST API, RLS |
| PostgreSQL | 15+ (via Supabase) | Relational database with JSONB support |
| PostgREST | (via Supabase) | Auto-generated REST API from PostgreSQL schema |

## 7.3 Database Technologies

| Technology | Purpose |
|------------|---------|
| PostgreSQL 15+ (Supabase) | Cloud persistence — JSONB document storage |
| Browser localStorage | Client-side persistence — key-value JSON storage |

## 7.4 Real-Time Infrastructure

| Technology | Purpose |
|------------|---------|
| Overpass API (OpenStreetMap) | Real-time healthcare facility geospatial queries |
| Browser Geolocation API | User position for proximity-based search |
| Web Speech Recognition API | Real-time voice-to-text transcription |
| Web Speech Synthesis API | Text-to-speech voice announcements |
| CSS Animations + `setInterval` | Real-time countdowns, delivery tracking, stats ticker |

## 7.5 DevOps & CI/CD

| Tool | Purpose |
|------|---------|
| Git | Version control |
| GitHub / GitLab | Repository hosting, issue tracking |
| GitHub Actions / Netlify Build | CI/CD pipeline for static asset deployment |
| Static Host (Netlify / Vercel / S3) | Production hosting |
| Cloudflare | CDN, DDoS protection, SSL |

## 7.6 Monitoring & Logging

| Tool | Purpose |
|------|---------|
| Browser Console | Development logging (`console.log`, `console.warn`) |
| Supabase Dashboard | Database monitoring, query performance, row counts |
| Lighthouse | Performance auditing (FCP, TTI, accessibility score) |
| Cloudflare Analytics | Traffic, edge cache hit rates, security events |

## 7.7 Third-Party Services

| Service | Purpose | Integration Type |
|---------|---------|-----------------|
| OpenStreetMap | Map tile rendering, geospatial data | HTTPS (Leaflet + Overpass) |
| Supabase | Cloud database persistence | HTTPS (JS SDK) |
| Google Maps | Turn-by-turn directions to facilities | URL redirect |
| Tata 1mg | Online pharmacy (medicine ordering) | URL redirect |
| Apollo Pharmacy | Online pharmacy (medicine ordering) | URL redirect |
| MedPlus | Online pharmacy (medicine ordering) | URL redirect |
| PharmEasy | Online pharmacy (medicine ordering) | URL redirect |
| Google Fonts | Typography (DM Sans, DM Serif Display) | CSS link |
| National Emergency (108) | Ambulance dispatch | `tel:` protocol |

## 7.8 Security Tools

| Tool | Purpose |
|------|---------|
| Supabase RLS | Row-Level Security enforcement on database |
| HTTPS/TLS 1.3 | Transport layer encryption |
| Cloudflare WAF | Web Application Firewall (production) |
| Content-Security-Policy | Header-based XSS prevention (configurable at host) |
| SameSite Cookies | CSRF prevention (framework-level) |
| Subresource Integrity (SRI) | CDN asset verification (configurable) |

---

# 8. Development Tools

## 8.1 Design Tools

| Tool | Purpose |
|------|---------|
| Figma | UI/UX design, component design, responsive layouts |
| CSS Custom Properties | Live design token system (no preprocessor needed) |
| Browser DevTools | Responsive design testing, CSS debugging, accessibility audit |
| Contrast Checker | WCAG color contrast ratio validation |

## 8.2 Development Tools

| Tool | Purpose |
|------|---------|
| VS Code | Primary IDE with Copilot AI assistance |
| Live Server | Local development server with hot-reload |
| Chrome DevTools | Debugging, performance profiling, network analysis |
| Emmet | HTML/CSS rapid authoring |
| Prettier | Code formatting (optional) |
| ESLint | JavaScript linting (optional) |

## 8.3 Testing Tools

| Tool | Purpose |
|------|---------|
| Manual Testing | Cross-browser, cross-device, accessibility testing |
| Chrome Lighthouse | Performance, accessibility, best practices, SEO audit |
| WAVE | Web accessibility evaluation |
| Browser DevTools (Network) | API integration testing, offline simulation |
| Screen Reader Testing | Voice navigation mode validation |
| Mobile Device Testing | Physical device testing on low-end Android devices |

## 8.4 Collaboration Tools

| Tool | Purpose |
|------|---------|
| GitHub / GitLab | Code repository, pull requests, code review |
| GitHub Issues | Bug tracking, feature requests |
| Markdown | Documentation (README, SRS, changelogs) |

## 8.5 Version Control Strategy

| Aspect | Strategy |
|--------|----------|
| **Branching Model** | GitHub Flow (main + feature branches) |
| **Branch Naming** | `feature/module-name`, `fix/issue-id`, `docs/topic` |
| **Commit Convention** | Conventional Commits: `feat:`, `fix:`, `docs:`, `style:`, `refactor:` |
| **Merge Strategy** | Squash merge for feature branches into main |
| **Release Tags** | Semantic versioning: `v2.0.0`, `v2.1.0` |
| **Protected Branch** | Main branch — requires PR review before merge |

---

# 9. Data Model & Database Schema

## 9.1 Entity Relationship Overview

```
┌──────────────┐       1:N        ┌────────────────────┐
│ FamilyMember │──────────────────│    Prescription     │
│              │                  │                     │
│ id (PK)      │                  │ memberId (FK)       │
│ name         │                  │ date                │
│ relation     │                  │ doc (doctor name)   │
│ age          │                  │ meds (summary)      │
│ avatar       │                  │ medicines[] (detail)│
│ chronic[]    │                  └────────────────────┘
│ status       │
│ meds[]       │       N:1        ┌────────────────────┐
│ visits[]     │──────────────────│    Doctor           │
│ riskAlerts[] │                  │                     │
│ prescriptions│                  │ id (PK)             │
└──────────────┘                  │ name, specialty     │
                                  │ location, distance  │
                                  │ wait, rating, fee   │
                                  │ phone, languages[]  │
                                  └────────────────────┘

┌──────────────┐                  ┌────────────────────┐
│    Clinic    │                  │   Medicine          │
│              │                  │                     │
│ id (PK)      │                  │ name                │
│ name, route  │                  │ dose, frequency     │
│ specialty    │                  │ duration, category  │
│ type, lat/lon│                  │ generic flag        │
│ capacity     │                  │ prices{platform}    │
│ schedule     │                  └────────────────────┘
└──────────────┘
                                  ┌────────────────────┐
┌──────────────┐                  │  PharmacyPlatform   │
│  app_data    │                  │                     │
│ (Supabase)   │                  │ id, name, baseUrl   │
│              │                  │ discount, rating    │
│ key (PK)     │                  │ delivery, cod flag  │
│ value (JSONB)│                  │ freeDeliveryAbove   │
│ updated_at   │                  └────────────────────┘
└──────────────┘
```

## 9.2 Core Entities

| Entity | Storage | Source |
|--------|---------|--------|
| FamilyMember | localStorage + Supabase | Seed data (5) + user-created |
| Prescription | localStorage + Supabase | AI-generated + seed data |
| Doctor | Client-side constant | Seed data (12) |
| Medicine | Client-side constant | Seed data (3 base + 13 condition maps) |
| MedicinePrice | Client-side constant | Seed data (24 medicines × 4 platforms) |
| PharmacyPlatform | Client-side constant | Seed data (4 platforms) |
| Pharmacy (Local) | Client-side constant | Seed data (4 shops) |
| MobileClinic | Client-side constant + Overpass API | Seed (5) + live API data |
| SymptomIcon | Client-side constant | Seed data (16) |
| ReliefStep | Client-side constant | Seed data (4 categories) |

## 9.3 Data Fields per Entity

### FamilyMember

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | Integer | Yes | Auto-incremented unique identifier |
| `name` | String | Yes | Display name |
| `relation` | String (enum) | Yes | Self, Father, Mother, Son, Daughter, Spouse, Brother, Sister, Grandfather, Grandmother, Other |
| `age` | Integer | Yes | Age in years |
| `avatar` | String (emoji) | Yes | Auto-assigned from relation mapping |
| `chronic` | String[] | No | List of chronic conditions |
| `lastVisit` | String (date) | No | Last healthcare visit date |
| `nextDue` | String (date) | No | Next scheduled visit/checkup |
| `status` | String (enum) | Yes | normal, caution, urgent |
| `meds` | String[] | No | Current medications |
| `visits` | Integer[6] | No | Monthly visit counts (6-month history) |
| `riskAlerts` | String[] | No | Active risk alert flags |
| `prescriptions` | Object[] | No | Seed prescription records |

### Prescription

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `date` | String | Yes | Date string (localized format) |
| `doc` | String | Yes | Doctor/specialist name |
| `meds` | String | Yes | Comma-separated medicine summary |
| `medicines` | Object[] | No | Full medicine objects (name, dose, frequency, duration) |

### Doctor

| Field | Type | Description |
|-------|------|-------------|
| `id` | Integer | Unique identifier |
| `name` | String | Full name with title |
| `specialty` | String | Primary medical specialty |
| `location` | String | Clinic/hospital location |
| `languages` | String[] | Languages spoken |
| `distance` | Float | Distance in km from reference point |
| `wait` | Integer | Estimated wait time in minutes |
| `rating` | Float | Patient rating (0.0–5.0) |
| `available` | Boolean | Current availability status |
| `fee` | Integer | Consultation fee in INR |
| `phone` | String | Contact phone number |
| `specialties` | String[] | List of specialties for matching |

### app_data (Supabase)

| Field | Type | Constraint | Description |
|-------|------|------------|-------------|
| `key` | TEXT | PRIMARY KEY | Data identifier ('family_members' or 'prescriptions') |
| `value` | JSONB | NOT NULL | Full data object (family array or prescriptions map) |
| `updated_at` | TIMESTAMPTZ | DEFAULT now() | Last modification timestamp |

## 9.4 Data Retention Policy

| Data Type | Retention | Location |
|-----------|-----------|----------|
| Family members | Indefinite | localStorage + Supabase |
| Prescriptions | Indefinite | localStorage + Supabase |
| Session state (AppState) | Session only (lost on reload except persisted fields) | Memory |
| Seed/static data | Permanent (code constants) | JS bundles |
| Map tile cache | Browser-managed | Browser cache |
| Geolocation | Single use (not stored) | Memory |
| Voice transcripts | Session only | Memory |

## 9.5 Encryption Strategy

| Layer | Method | Scope |
|-------|--------|-------|
| Transport | TLS 1.3 | All HTTPS communications (Supabase, Overpass, CDN) |
| Supabase at rest | AES-256 | All PostgreSQL data, backups, WAL |
| localStorage | Same-origin policy | Protected by browser sandbox; not encrypted on disk |
| API keys | Publishable only | No server secrets; anon key rate-limited |
| Passwords | N/A | No user authentication in current version |

---

# 10. Deployment Strategy

## 10.1 Environment Setup

| Environment | URL Pattern | Purpose | Data |
|------------|-------------|---------|------|
| **Development** | `localhost:5500` | Local development with Live Server | Seed data only |
| **Staging** | `staging.swasthyasetu.in` | Pre-production testing | Supabase staging project |
| **Production** | `swasthyasetu.in` | Live deployment | Supabase production project |

## 10.2 Containerization Strategy

The application is a static site requiring no containerization for deployment. However, for development consistency:

| Tool | Purpose |
|------|---------|
| Docker (optional) | Consistent dev environment with nginx serving static files |
| `nginx:alpine` | Lightweight container image for static hosting |
| `.dockerignore` | Exclude `.git`, `node_modules`, documentation |

**Dockerfile (if containerized):**
```dockerfile
FROM nginx:alpine
COPY swasthyasetu/ /usr/share/nginx/html/
EXPOSE 80
```

## 10.3 Cloud Provider Setup

| Component | Provider | Configuration |
|-----------|----------|---------------|
| Static Hosting | Netlify / Vercel / AWS S3 | Auto-deploy from Git; SPA redirect rules |
| CDN | Cloudflare | Edge caching; DDoS protection; WAF |
| Database | Supabase | PostgreSQL 15; Region: Asia South (Mumbai) |
| DNS | Cloudflare | A/CNAME records for production domain |

## 10.4 CDN Configuration

| Setting | Value |
|---------|-------|
| Cache TTL (HTML) | 1 hour (short for updates) |
| Cache TTL (CSS/JS) | 30 days (versioned via query string or filename hash) |
| Cache TTL (Fonts) | 365 days |
| Edge Locations | Global (Cloudflare 300+ PoPs), prioritize India PoPs |
| Compression | Brotli + Gzip |
| HTTP/2 Push | CSS and critical JS |
| Browser Cache | `Cache-Control: public, max-age=2592000` for versioned assets |

## 10.5 Domain & SSL

| Component | Configuration |
|-----------|---------------|
| Domain | `swasthyasetu.in` (or `swasthyasetu.gov.in` for government deployment) |
| SSL Certificate | Cloudflare Universal SSL (auto-renewed) or Let's Encrypt |
| SSL Mode | Full (strict) — end-to-end encryption |
| HSTS | Enabled with `max-age=31536000; includeSubDomains` |
| Redirect | HTTP → HTTPS (301 permanent redirect) |

## 10.6 Auto-Scaling Strategy

| Load Tier | Strategy |
|-----------|----------|
| **Static Assets** | CDN edge caching — auto-scales to unlimited concurrent users |
| **Supabase Free** | 500MB DB, 2GB bandwidth — sufficient for 0–10K users |
| **Supabase Pro** | 8GB DB, 250GB bandwidth — sufficient for 10K–500K users |
| **Supabase Enterprise** | Custom limits, dedicated Postgres, read replicas — 500K–10M users |
| **Self-Hosted† ** | Kubernetes PostgreSQL cluster with horizontal sharding — 10M–100M users |

†For government-scale deployment, self-hosted PostgreSQL with per-state partitioning is recommended.

## 10.7 Monitoring & Alerts

| Monitor | Tool | Alert Threshold |
|---------|------|----------------|
| Uptime | Cloudflare Health Checks / UptimeRobot | Downtime > 1 minute |
| Response Time | Cloudflare Analytics | p95 > 3 seconds |
| Error Rate | Cloudflare / Supabase Dashboard | 5xx rate > 1% |
| Database Size | Supabase Dashboard | > 80% of plan limit |
| API Rate Limits | Supabase Dashboard | > 70% of rate limit |
| SSL Expiry | Cloudflare auto-renewal | 30 days before expiry |

## 10.8 Backup Policy

| Data | Backup Method | Frequency | Retention |
|------|--------------|-----------|-----------|
| Supabase Database | Supabase PITR (Point-in-Time Recovery) | Continuous | 24h (Free), 7 days (Pro) |
| Static Assets | Git repository | On every commit | Indefinite |
| Configuration | Git repository | On every change | Indefinite |
| localStorage (user) | User's browser | Automatic | Until cleared |

---

# 11. Risk Analysis

## 11.1 Technical Risks

| ID | Risk | Probability | Impact | Severity |
|----|------|-------------|--------|----------|
| TR-001 | Overpass API rate limiting or downtime | Medium | Medium | Medium |
| TR-002 | Web Speech API browser compatibility gaps | Medium | Low | Low |
| TR-003 | localStorage storage limits (5–10MB) | Low | Medium | Low |
| TR-004 | Supabase free tier exhaustion under load | Medium | Medium | Medium |
| TR-005 | Leaflet tile server throttling | Low | Low | Low |
| TR-006 | Client-side AI accuracy limitations (rule-based) | Medium | High | High |
| TR-007 | Browser geolocation permission denial | High | Medium | Medium |

## 11.2 Operational Risks

| ID | Risk | Probability | Impact | Severity |
|----|------|-------------|--------|----------|
| OR-001 | User misinterprets AI health assessment as medical diagnosis | High | Very High | Critical |
| OR-002 | Emergency 108 service unreachable in remote areas | Medium | Very High | High |
| OR-003 | Outdated facility data in OpenStreetMap | Medium | Medium | Medium |
| OR-004 | Users unable to operate app despite accessibility modes | Medium | Medium | Medium |
| OR-005 | Pharmacy platform URL structure changes | Medium | Low | Low |

## 11.3 Security Risks

| ID | Risk | Probability | Impact | Severity |
|----|------|-------------|--------|----------|
| SR-001 | Supabase anon key abuse (mass data insertion) | Medium | Medium | Medium |
| SR-002 | localStorage data tampering by malicious extensions | Low | Low | Low |
| SR-003 | Man-in-the-middle on non-HTTPS fallback | Low | High | Medium |
| SR-004 | JSONB injection via crafted family member names | Low | Medium | Low |
| SR-005 | Data privacy concerns — family health data in cloud without auth | Medium | High | High |

## 11.4 Mitigation Strategies

| Risk ID | Mitigation |
|---------|------------|
| TR-001 | Seed data fallback; dedicated Overpass instance for production; request caching |
| TR-002 | Demo transcript fallback; text input always available as primary method |
| TR-003 | Data compression; pagination of prescription history; periodic cleanup |
| TR-004 | Upgrade to Supabase Pro; implement request batching; local-first architecture reduces cloud load |
| TR-006 | Mandatory medical disclaimer on all AI output; redirect to professional consultation |
| TR-007 | Default location fallback (Gulbarga, Karnataka); allow manual location entry |
| OR-001 | **Critical: Disclaimer always visible** — "This is an AI-powered preliminary assessment, not a medical diagnosis. Always consult a qualified healthcare professional." |
| OR-002 | Show alternative emergency numbers; offline first-aid guide (Relief Engine) |
| OR-003 | Allow user feedback on facility data; scheduled data refresh |
| SR-001 | Implement Supabase rate limiting; add user authentication in Phase 2 |
| SR-005 | **Phase 2: Implement user authentication + per-user RLS policies**; encrypt sensitive JSONB fields |

---

# 12. Future Enhancements

## 12.1 AI Prediction Systems

| ID | Enhancement | Description | Priority |
|----|-------------|-------------|----------|
| FE-001 | ML-based health risk prediction | Replace rule-based risk alerts with trained ML model analyzing visit patterns, chronic history, and demographics | High |
| FE-002 | Natural Language Understanding | Integrate NLU model (e.g., MedBERT) for better symptom extraction from free-text and voice input | High |
| FE-003 | Medication interaction checker | AI-powered drug interaction analysis across family members' combined medication lists | Medium |
| FE-004 | Personalized health recommendations | ML model generating personalized diet, exercise, and preventive care advice based on individual health profiles | Medium |
| FE-005 | Epidemic detection | Aggregate symptom data across users to detect potential disease outbreaks in specific geographies | Low |

## 12.2 Predictive Emergency Routing

| ID | Enhancement | Description | Priority |
|----|-------------|-------------|----------|
| FE-006 | Real-time ambulance tracking | Integration with state ambulance services for live GPS tracking of dispatched ambulances | High |
| FE-007 | Optimal hospital routing | AI-powered routing considering hospital bed availability, specialization match, and traffic conditions | High |
| FE-008 | Pre-arrival patient briefing | Transmit AI assessment summary to receiving hospital before patient arrival | Medium |
| FE-009 | Multi-tier emergency escalation | Automated escalation: local PHC → district hospital → tertiary care based on urgency level | Medium |

## 12.3 Wearable Integration

| ID | Enhancement | Description | Priority |
|----|-------------|-------------|----------|
| FE-010 | Smartwatch vital monitoring | Integration with smartwatch APIs for continuous heart rate, SpO2, blood pressure monitoring | Medium |
| FE-011 | Glucometer Bluetooth sync | Bluetooth integration with portable glucometers for automatic blood sugar logging | Medium |
| FE-012 | BP monitor sync | Integration with Bluetooth blood pressure monitors for automated BP tracking | Medium |
| FE-013 | Fall detection alert | Accelerometer-based fall detection triggering automatic SOS for elderly users | High |
| FE-014 | Abnormal vital auto-alert | Automatic emergency trigger when wearable detects critical vital signs | High |

## 12.4 Government Infrastructure Integration

| ID | Enhancement | Description | Priority |
|----|-------------|-------------|----------|
| FE-015 | Ayushman Bharat integration | Integration with PM-JAY (Pradhan Mantri Jan Arogya Yojana) for insurance eligibility verification and cashless treatment | High |
| FE-016 | ABHA (Ayushman Bharat Health Account) | Link with ABHA health IDs for national health record interoperability | High |
| FE-017 | CoWIN/vaccination records | Integration with CoWIN platform for complete vaccination history | Medium |
| FE-018 | eHospital/eSanjeevani | Integration with NIC's eHospital OPD system and eSanjeevani telemedicine platform | Medium |
| FE-019 | District health dashboard | Real-time dashboard for District Medical Officers showing aggregate health data, facility utilization, outbreak indicators | Medium |
| FE-020 | ASHA worker integration | Mobile interface for ASHA workers to manage village-level health data through SwasthyaSetu | High |
| FE-021 | National Health Stack APIs | Integration with NDHM (National Digital Health Mission) APIs for health data exchange | High |

---

# Appendix A: Requirement Traceability Matrix

| Requirement | Module | Test Method | Status |
|-------------|--------|-------------|--------|
| FR-001 | ai-engine.js, ui-doctors.js | Manual + automated voice/text/icon input testing | Implemented |
| FR-002 | ai-engine.js | Unit test: score computation with known inputs | Implemented |
| FR-003 | ai-engine.js | Unit test: symptom → specialist mapping | Implemented |
| FR-004 | ai-engine.js | Unit test: doctor ranking output validation | Implemented |
| FR-005 | ai-engine.js | Visual inspection + accessibility audit | Implemented |
| FR-006 | ui-doctors.js | Manual: SOS button → overlay → tel:108 | Implemented |
| FR-007 | ai-engine.js | Automated: input score ≥ 85 → overlay trigger | Implemented |
| FR-008 | ui-medicines.js | Manual: relief modal + countdown verification | Implemented |
| FR-009 | ui-doctors.js | Visual: doctor card render with all fields | Implemented |
| FR-010 | ui-doctors.js | Manual: slot selection → confirmation | Implemented |
| FR-011 | ui-medicines.js | Automated: symptom → medicine mapping | Implemented |
| FR-012 | ui-medicines.js | Visual: 4-platform price comparison accuracy | Implemented |
| FR-013 | ui-medicines.js | Manual: delivery step auto-advance | Implemented |
| FR-014 | ui-medicines.js | Manual: URL redirect verification | Implemented |
| FR-015 | ui-clinic.js | Manual: Overpass API response parsing | Implemented |
| FR-016 | ui-clinic.js | Visual: Leaflet map with markers | Implemented |
| FR-017 | ui-clinic.js | Manual: clinic booking flow | Implemented |
| FR-018 | nearby-search.js | Manual: geolocation + search results | Implemented |
| FR-019 | nearby-search.js | Visual: nearby map rendering | Implemented |
| FR-020 | ui-family.js | Manual: add/remove member + persistence | Implemented |
| FR-021 | ui-family.js | Manual: prescription store + view | Implemented |
| FR-022 | ui-family.js | Visual: risk alert card rendering | Implemented |
| FR-023 | ui-family.js | Visual: profile card + bar chart | Implemented |
| FR-024 | ui-family.js | Manual: dropdown selection + prescription routing | Implemented |
| FR-025 | i18n.js | Manual: 4-language switch verification | Implemented |
| FR-026 | accessibility.js | Manual: font-size increase + voice enable | Implemented |
| FR-027 | accessibility.js | Manual: auto-navigate to icon input | Implemented |
| FR-028 | accessibility.js | Manual: animation disable + banner display | Implemented |
| FR-029 | accessibility.js | Manual: voice announcement playback | Implemented |
| FR-030 | accessibility.js | Visual: contrast enhancement | Implemented |
| FR-031 | accessibility.js | Manual: caption bar + flash + voice hiding | Implemented |
| FR-032 | supabase-db.js | Automated: localStorage read/write cycle | Implemented |
| FR-033 | supabase-db.js | Manual: Supabase dashboard row verification | Implemented |
| FR-034 | supabase-db.js, app.js | Manual: app reload → data restored | Implemented |
| FR-035 | utils.js | Manual: tab navigation across 5 views | Implemented |
| FR-036 | utils.js | Visual: toast appearance + auto-dismiss | Implemented |
| FR-037 | utils.js | Manual: modal open/close, click-outside | Implemented |
| FR-038 | ui-doctors.js | Manual: voice input across 4 locales | Implemented |
| FR-039 | supabase-db.js | Manual: airplane mode → data access | Implemented |
| FR-040 | All modules | Manual: disable network → verify fallbacks | Implemented |

---

# Appendix B: Glossary of Urgency Score Components

| Factor | Weight | Range | Calculation |
|--------|--------|-------|-------------|
| Symptom Severity | 40% | 3–9 per symptom | Max severity among all selected symptoms, scaled to 0–100 |
| Duration | 25% | 1–30 days | Mapped: 1→5, 2→10, 3→15, 4→25, 5→35, 7→50, 10→65, 14→80, 21→90, 30→100 |
| Age Risk | 15% | 0–8 points | Infant(0–12)→6, Teen(12–18)→3, Adult(18–40)→0, Middle(40–60)→2, Senior(60–75)→5, Elderly(75+)→8 |
| Chronic History | 20% | 0–10 points | Heart conditions→10, Other chronic→6, None→0 |

**Formula:**
$$\text{UrgencyScore} = (\text{SymptomSeverity} \times 0.40) + (\text{Duration} \times 0.25) + (\text{AgeRisk} \times 0.15) + (\text{ChronicHistory} \times 0.20)$$

---

**End of Document**

*SwasthyaSetu — Intelligent Rural Healthcare Network*  
*© 2026 Government of India · National Health Mission*  
*All rights reserved.*
