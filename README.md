<div align="center">

<!-- LOGO & HERO BANNER -->
<img src="https://img.shields.io/badge/SIH-2026-orange?style=for-the-badge&logo=india&logoColor=white" alt="SIH 2026"/>
<img src="https://img.shields.io/badge/Ministry%20of%20Cooperation-Government%20of%20India-green?style=for-the-badge" alt="Ministry of Cooperation"/>
<img src="https://img.shields.io/badge/Problem%20Statement-SIH26089-blue?style=for-the-badge" alt="SIH26089"/>

<br/><br/>

# 🤝 SahakarSeva
### *Cooperative Gig Services Platform for Household & Community Services*

> **Eliminating middlemen. Empowering artisans. Building cooperative dignity.**

<br/>

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Express-4-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)
[![SQLite](https://img.shields.io/badge/SQLite-3-003B57?style=flat-square&logo=sqlite&logoColor=white)](https://sqlite.org/)
[![Bhashini](https://img.shields.io/badge/Bhashini-MeitY%20AI-FF9900?style=flat-square)](https://bhashini.gov.in/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)
[![Build](https://img.shields.io/badge/Build-Passing-brightgreen?style=flat-square)]()

<br/>

[📖 Documentation](#-table-of-contents) •
[🚀 Quick Start](#-quick-start) •
[✨ Features](#-features) •
[🏗️ Architecture](#%EF%B8%8F-architecture) •
[🔌 API Reference](#-api-reference) •
[🤝 Contributing](#-contributing)

</div>

---

## 📋 Table of Contents

- [About the Project](#-about-the-project)
- [Problem Statement](#-problem-statement)
- [Key Innovations](#-key-innovations-our-differentiators)
- [Features](#-features)
- [Architecture](#%EF%B8%8F-architecture)
- [Tech Stack](#-tech-stack)
- [Database Schema](#-database-schema)
- [API Reference](#-api-reference)
- [Quick Start](#-quick-start)
- [Environment Variables](#-environment-variables)
- [Demo Credentials](#-demo-credentials)
- [Cooperative Wage Model](#-cooperative-wage-distribution-model)
- [Ministry Alignment](#-ministry-of-cooperation-alignment)
- [Bug Fixes](#-recent-bug-fixes)
- [Contributing](#-contributing)

---

## 🎯 About the Project

**SahakarSeva** is a full-stack cooperative gig economy platform built for **Smart India Hackathon 2026** under Problem Statement **SIH26089** — Ministry of Cooperation & National Council for Cooperative Training (NCCT).

The platform directly connects NCCT-certified cooperative artisans (electricians, plumbers, carpenters, AC technicians, cleaners, painters) with urban and semi-urban households — while building long-term social security through cooperative ownership structures.

```
Platform Philosophy: Worker-First, Society-Owned, Middleman-Free
```

### What Makes SahakarSeva Different from Urban Company / UrbanClap?

| Metric | Corporate Gig Apps | 🤝 SahakarSeva |
|--------|-------------------|----------------|
| Worker's share of each booking | ~52–60% | **90%** |
| Middleman commission | 28–40% | **0%** |
| Social security (PF/Ayushman) | None | **Auto-deducted, cooperative-backed** |
| Tool access | Worker pays full market price | **PACS Tool Depot at ₹50/day** |
| Emergency safety on-site | None | **Suraksha Bandhu peer SOS mesh** |
| Bulk community contracts | Not available | **Samuhik Seva Community Tenders** |
| Language support | English only | **Hindi, Telugu, Marathi, Kannada + Voice** |

---

## 🏛️ Problem Statement

**SIH26089** — Ministry of Cooperation & NCCT (National Council for Cooperative Training)

> *Design and develop a Cooperative Gig Services Platform that leverages cooperative societies (PACS) to provide verified, fair-wage household and community services — ensuring artisan welfare, transparency, and ICA cooperative principles.*

### Core Challenges Addressed

- ❌ **Exploitation by middlemen** — private contractors take 40–50% of artisan wages
- ❌ **Zero social security** for informal gig workers (no PF, no health insurance)
- ❌ **Language barrier** — rural artisans cannot navigate English-only platforms
- ❌ **Tool access inequality** — artisans lose high-paying jobs for lack of ₹2,000–₹5,000 equipment
- ❌ **Safety gaps** — no protection against on-site harassment or accidents
- ❌ **Bulk contract exclusion** — individual artisans cannot bid on large society/RWA contracts

---

## 🚀 Key Innovations (Our Differentiators)

### 🛡️ Innovation 1 — Suraksha Bandhu (Hyperlocal Peer Emergency Mesh)

> *"Every cooperative artisan deserves to work safely."*

Workers get a **pulsing red SOS button** on every active job card. One tap activates:

- 🔊 **Web Audio API synthesized emergency siren** — works offline, no app required
- 📡 **1.5 km live radar** — identifies and alerts 3 nearest on-duty cooperative peers who are en-route
- 🎙️ **Automatic audio evidence recording** — timestamps and stores incident audio
- 📋 **Incident classification** — Harassment / Medical Emergency / Accident
- 🔐 **PIN standdown code** — secure deactivation prevents false dismissal
- 🖥️ **Society Admin Vigilance Desk** — admins see live SOS alerts in real time

---

### 🔧 Innovation 2 — Sahakar Upkaran Bank (PACS Equipment Depot)

> *"The best artisan needs the best tools — not a moneylender."*

PACS-backed heavy equipment rental at 90% below market rate:

| Tool | Market Rent | PACS Rate | Worker Savings |
|------|------------|-----------|---------------|
| Bosch Core Drill (Ø112mm) | ₹800/day | ₹80/day | ₹720 |
| Ridgid Sewer Jetter (2500 PSI) | ₹700/day | ₹70/day | ₹630 |
| Fluke Thermal Imager (IR Camera) | ₹900/day | ₹90/day | ₹810 |
| Fiberglass 33kV Ladder (6m) | ₹500/day | ₹50/day | ₹450 |

**Zero Security Deposit** — auto-settled from job escrow on completion. Digital QR Gate Pass generated instantly.

---

### 🏘️ Innovation 3 — Samuhik Seva Tenders (Community Bulk Contracting)

> *"Together, cooperative workers win contracts that individuals never could."*

RWAs and apartment societies post bulk maintenance work orders. Cooperative worker squads bid directly — **0% subcontractor commission cut**.

**Live Seeded Tenders:**

| Tender | Location | Budget | Workers Needed | Per-Worker Take-Home |
|--------|----------|--------|----------------|---------------------|
| 48-unit AC Deep Clean + Gas Check | Dwarka, New Delhi | ₹28,800 | 4 | **₹6,480** |
| Water Reservoir UV Sterilization (6 tanks) | Mayur Vihar, Delhi | ₹18,000 | 3 | **₹5,400** |
| Solar Inverter + 120 LED Rewiring (12 blocks) | Vasant Kunj, Delhi | ₹34,500 | 5 | **₹6,210** |

**Automated Fair-Wage Split:**
```
Total Escrow Budget
    ├── 90% → Split equally among all squad workers (Direct Bank Transfer)
    ├──  5% → Ayushman / Welfare Escrow per member (Pension Float)
    └──  5% → PACS Society Operations Reserve
```

---

## ✨ Features

<details>
<summary><b>👤 Customer Portal</b> — Click to expand</summary>
<br/>

| Feature | Description |
|---------|-------------|
| 🌐 Multi-language UI | Full Hindi / English / Telugu / Marathi switching via Bhashini |
| 🗺️ Live GPS Worker Radar | Leaflet map showing on-duty workers within 2–100 km radius |
| 📂 Service Catalog | 8 categories with real-time worker counts |
| 🔍 Smart Search | Filter by category, distance, skills, society name |
| 🏅 Worker Verification Badges | NCCT level, Aadhaar KYC, police clearance, PF & Ayushman details |
| 🤖 AI Sahayak Voice Diagnosis | Describe issue in any language — returns diagnosis, tools, fair price vs. corporate markup |
| 💰 Escrow-Protected Booking | Payment held until customer approves worker's completion photo |
| 🚨 Emergency SOS Dispatch | 15-minute rapid dispatch for burst pipes, electrical hazards, gas leaks |
| 🛡️ Sahakari Suraksha Kavach | ₹25,000 zero-deductible guarantee + 30-day free redo warranty + claim portal |
| 💬 Cross-Language Chat | Bhashini-powered bilingual real-time chat |
| 📄 PDF Invoice | Receipt with full cooperative wage breakdown |

</details>

<details>
<summary><b>👷 Worker Portal</b> — Click to expand</summary>
<br/>

| Feature | Description |
|---------|-------------|
| 🟢 Duty Status Toggle | On/Off duty with real-time database sync |
| 📒 Welfare Passbook (Khata) | Digital ledger: earnings, PF contributions, Ayushman credits, pension float |
| 🎓 NCCT Academy | Upskilling roadmap: Level 1 → Level 3 (Solar PV, EV Charger) |
| 💳 Material Credit e-RUPI | Zero-interest digital vouchers (₹500–₹5,000) for local hardware shops |
| 🛡️ Suraksha Bandhu SOS | Peer emergency SOS network with siren + peer dispatch + audio recording |
| 🔧 Sahakar Upkaran Bank | PACS tool depot: heavy equipment at ₹50–₹90/day, zero deposit |
| 🏘️ Samuhik Seva Tenders | Form cooperative squads → bid on RWA/society bulk contracts |
| 🗺️ GPS Job Navigation | One-tap navigation to customer address |
| 🔊 Bhashini Voice Readout | TTS reads job details in Hindi or regional language |
| 💬 Cross-Language Chat | Real-time bilingual job coordination |
| 📸 Completion Photo Upload | Submit work proof → triggers escrow release |

</details>

<details>
<summary><b>🏛️ Society Admin Dashboard</b> — Click to expand</summary>
<br/>

| Feature | Description |
|---------|-------------|
| ✅ Worker KYC Approval Queue | Review and approve Aadhaar + NCCT submissions |
| 💰 Fair Wage Floor Control | Set minimum hourly rate (enforced platform-wide) |
| 📊 Welfare Fund Ledger | Track Ayushman, PF and pension contribution balances |
| 🚨 Suraksha Bandhu Vigilance Desk | Live SOS alert monitor — view and resolve distress signals |
| 🔧 PACS Equipment Asset Ledger | Tool depot inventory and rental status tracking |

</details>

<details>
<summary><b>🏗️ Federation Admin & Super Admin</b> — Click to expand</summary>
<br/>

**Federation Admin:**
- Multi-society wage floor comparison and analytics
- Aggregate NCCT certification levels across cooperative societies
- AI-powered monthly demand forecast by category

**Super Admin (NCCT National):**
- National platform statistics (societies, workers, bookings, wages)
- Cooperative compliance scores per society
- National wage floor override controls

</details>

<details>
<summary><b>🤖 AI & Language Intelligence</b> — Click to expand</summary>
<br/>

| Feature | Description |
|---------|-------------|
| 🌏 Bhashini Translate | Real-time translation: Hindi ↔ English ↔ Telugu ↔ Kannada ↔ Marathi |
| 🔊 Bhashini TTS | Text-to-speech voice readout in regional languages |
| 🎙️ Speech-to-Text | Voice input diagnosis in any Indian language |
| 🧠 AI Diagnostic Engine | Keyword + semantic classification → category, tools, hazard level, fair price |
| 📊 Price Matrix | Cooperative price vs. corporate app markup (customer saves 20–40%) |
| 📈 Demand Forecast | AI-predicted monthly service demand by category |

</details>

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    SahakarSeva Platform                  │
├──────────────────────┬──────────────────────────────────┤
│   FRONTEND (React)   │        BACKEND (Express.js)       │
│   Vite + Tailwind    │        SQLite + WAL Mode           │
│   Port: 3000         │        Port: 5050                  │
│                      │                                    │
│  ┌───────────────┐   │  ┌────────────────────────────┐   │
│  │  Customer UI  │   │  │   REST API (1,097 lines)   │   │
│  │  Worker UI    │───┼─▶│   /api/workers             │   │
│  │  Admin UIs    │   │  │   /api/bookings            │   │
│  │  Landing Page │   │  │   /api/societies           │   │
│  └───────────────┘   │  │   /api/tenders             │   │
│                      │  │   /api/bhashini/*          │   │
│  ┌───────────────┐   │  │   /api/stats/*             │   │
│  │  Bhashini AI  │   │  └────────────────────────────┘   │
│  │  GPS + Leaflet│   │                                    │
│  │  Web Speech   │   │  ┌────────────────────────────┐   │
│  │  PDF/Invoice  │   │  │   Bhashini API Proxy       │   │
│  └───────────────┘   │  │   (MeitY Government AI)    │   │
│                      │  └────────────────────────────┘   │
└──────────────────────┴──────────────────────────────────┘
```

### Directory Structure

```
SahakarSeva/
├── 📁 src/                          # React + Vite Frontend
│   ├── App.jsx                      # Root router (role-based views)
│   ├── index.css                    # Tailwind + custom CSS utilities
│   ├── 📁 components/
│   │   ├── 📁 AI/
│   │   │   └── AiSahayakModal.jsx   # Voice AI diagnosis + Bhashini TTS
│   │   ├── 📁 Auth/
│   │   │   ├── AuthModal.jsx        # Login / Register
│   │   │   └── DigiLockerKycModal   # Aadhaar KYC integration
│   │   ├── 📁 Common/
│   │   │   ├── CrossLanguageChatModal.jsx
│   │   │   ├── ErrorBoundary.jsx
│   │   │   ├── LanguageSelectModal.jsx
│   │   │   └── Modal.jsx
│   │   ├── 📁 Customer/
│   │   │   ├── CustomerDashboard.jsx
│   │   │   ├── BookingModal.jsx     # Escrow booking form
│   │   │   ├── EmergencyBooking.jsx # SOS dispatch
│   │   │   ├── ServiceCatalog.jsx   # 8-category grid
│   │   │   ├── SurakshaKavachModal  # Warranty claim portal
│   │   │   └── WorkerList.jsx       # Filtered worker directory
│   │   ├── 📁 Worker/
│   │   │   ├── WorkerDashboard.jsx
│   │   │   ├── WelfarePassbookModal.jsx
│   │   │   ├── NcctAcademyModal.jsx
│   │   │   ├── MaterialCreditModal.jsx
│   │   │   ├── SurakshaBandhuModal.jsx  ⭐ Innovation 1
│   │   │   ├── SahakarToolDepotModal.jsx  ⭐ Innovation 2
│   │   │   └── SamuhikTendersModal.jsx  ⭐ Innovation 3
│   │   ├── 📁 SocietyAdmin/
│   │   ├── 📁 FederationAdmin/
│   │   └── 📁 SuperAdmin/
│   ├── 📁 context/
│   │   ├── AppContext.jsx           # Global state + API orchestration
│   │   ├── AuthContext.jsx          # RBAC + registration
│   │   └── LanguageContext.jsx      # i18n provider
│   ├── 📁 services/
│   │   └── bhashiniService.js       # Bhashini Translate / TTS / ASR
│   └── 📁 utils/
│       ├── aiDiagnosticEngine.js    # Issue classification engine
│       ├── cloudSync.js             # Multi-device worker sync
│       ├── translateHelpers.js      # Category/role/NCCT i18n helpers
│       └── validation.js            # Phone/Aadhaar/email validators
│
├── 📁 server/                       # Express.js Backend
│   ├── index.js                     # All REST routes (~1,100 lines)
│   ├── db.js                        # SQLite schema + seed data
│   ├── aiEngine.js                  # Haversine + demand forecast
│   └── bhashiniService.js           # Backend Bhashini proxy
│
├── .env                             # API credentials (local only)
├── .env.example                     # Template for setup
├── vite.config.js                   # Vite + /api proxy → :5050
├── tailwind.config.js
├── render.yaml                      # Render.com deployment
└── capacitor.config.json            # Android APK (Capacitor)
```

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 18 | Component framework |
| Vite | 5 | Build tool + HMR dev server |
| Tailwind CSS | 3 | Utility-first styling |
| Lucide React | Latest | Icon system |
| Leaflet.js | Latest | Interactive GPS maps |
| React-Leaflet | Latest | React map bindings |
| Recharts | Latest | Analytics charts |
| jsPDF | Latest | Invoice PDF generation |
| Capacitor | Latest | Android APK packaging |

### Backend
| Technology | Version | Purpose |
|-----------|---------|---------|
| Express.js | 4 (ESM) | REST API server |
| SQLite3 | 3 (WAL mode) | Persistent database |
| better-sqlite3 | Latest | Sync SQLite driver |
| CORS | Latest | Cross-origin handling |
| Multer | Latest | Photo upload handling |

### AI & Language
| Service | Provider | Use Case |
|---------|---------|---------|
| Bhashini Translate | MeitY / Govt of India | Text translation (8 Indian languages) |
| Bhashini TTS | MeitY / Govt of India | Voice readout in regional languages |
| Bhashini ASR | MeitY / Govt of India | Speech-to-text input |
| Web Speech API | Browser Native | Real-time voice recognition fallback |
| AI Diagnostic Engine | Custom-built | Issue → category + tools + fair price |

---

## 🗄️ Database Schema

```sql
-- Cooperative Workers Registry
workers (id, name, photo, category, societyId, societyName, rating,
         reviewsCount, jobsCompleted, experienceYears, hourlyRate,
         lat, lng, ncctLevel, kycStatus, policeVerification,
         ayushmanCard, pfAccountNumber, onDuty, skills, phone)

-- Service Bookings with Escrow
bookings (id, workerId, workerName, workerPhone, category, customerName,
          customerPhone, address, scheduledTime, isEmergency, hours,
          baseWage, welfareContribution, healthInsurance, platformFee,
          totalAmount, status, completionPhoto, workApproved,
          customerLat, customerLng, workerLat, workerLng, createdAt)

-- Cooperative Societies (PACS)
societies (id, name, registrationNo, federation, location, workerCount,
           welfareFundBalance, complianceScore, wageFloor, status)

-- Worker Welfare Fund Credits
welfare_fund (workerId, workerName, pfCredits, ayushmanCredits, 
              pensionFloat, lastUpdated)

-- ⭐ Samuhik Seva Community Tenders
samuhik_tenders (id, rwaName, title, titleHi, category, description,
                 unitsCount, workersNeeded, budgetEscrow, location,
                 scheduledDates, status, awardedSquadName, bidsCount, createdAt)
```

---

## 🔌 API Reference

### 🔵 Workers

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/workers` | List workers (supports `lat`, `lng`, `radiusKm`, `category`, `search` params) |
| `POST` | `/api/workers` | Register new cooperative worker |
| `PATCH` | `/api/workers/:id/duty` | Toggle on/off duty status |
| `POST` | `/api/workers/:id/approve` | Society admin approves worker KYC |

### 🟢 Bookings

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/bookings` | Get all bookings |
| `POST` | `/api/bookings` | Create booking (returns escrow breakdown) |
| `POST` | `/api/bookings/:id/accept` | Worker accepts dispatched job |
| `POST` | `/api/bookings/:id/photo` | Worker uploads completion photo |
| `POST` | `/api/bookings/:id/approve` | Customer approves completed work |
| `POST` | `/api/bookings/:id/pay` | Release escrow payment to worker |
| `POST` | `/api/bookings/:id/redo` | Customer requests re-work |

### 🟣 Societies

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/societies` | List all cooperative societies |
| `PATCH` | `/api/societies/:id/wage-floor` | Update minimum hourly wage |

### 🟠 Samuhik Tenders ⭐

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/tenders` | List all open RWA community bulk tenders |
| `POST` | `/api/tenders` | RWA posts a new community bulk tender |
| `POST` | `/api/tenders/:id/bid` | Cooperative squad submits a bid |

### 🤖 Bhashini AI

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/bhashini/translate` | Translate text between Indian languages |
| `POST` | `/api/bhashini/asr` | Speech-to-text transcription |
| `POST` | `/api/bhashini/tts` | Generate regional language voice audio |
| `GET` | `/api/bhashini/status` | Check Bhashini API connectivity |

### 📊 Analytics

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/stats/platform` | Platform-wide metrics |
| `GET` | `/api/stats/categories` | Worker count per service category |
| `GET` | `/api/worker/my-stats` | Individual worker earnings + welfare summary |
| `GET` | `/api/health` | Server health check |

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm 9+
- Bhashini API credentials (from [bhashini.gov.in](https://bhashini.gov.in))

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/ashuthoshkumar/SahakarSeva.git
cd SahakarSeva

# 2. Install all dependencies
npm install

# 3. Configure environment variables
cp .env.example .env
# Edit .env with your Bhashini credentials (see below)
```

### Running Locally

```bash
# Terminal 1 — Start the Express backend
node server/index.js
# ✅ Backend running at http://localhost:5050

# Terminal 2 — Start the Vite frontend
npm run dev
# ✅ Frontend running at http://localhost:3000
```

> The Vite dev server automatically proxies all `/api/*` requests to port 5050.

### Production Build

```bash
npm run build
# Creates optimized bundle in /dist
```

---

## ⚙️ Environment Variables

Create a `.env` file in the project root:

```env
# ─── Bhashini API (Government of India — MeitY AI Platform) ───────────────
BHASHINI_USER_ID=your_bhashini_user_id
BHASHINI_API_KEY=your_bhashini_api_key

# ─── Optional: Override API URL for production deployment ─────────────────
# VITE_API_URL=https://your-backend.onrender.com/api
```

> **Get Bhashini credentials free at:** [https://bhashini.gov.in/ulca/auth/sign-up](https://bhashini.gov.in/ulca/auth/sign-up)

---

## 🔐 Demo Credentials

| Role | Email | Password | What You Can Do |
|------|-------|----------|-----------------|
| **Customer** | Register freely | any | Book services, use AI Sahayak, view workers |
| **Worker** | Register as craftsman | any | Accept jobs, use SOS, tool depot, tenders |
| **Society Admin** | `society@sahakar.in` | `admin123` | KYC approvals, wage floor, vigilance desk |
| **Federation Admin** | `federation@sahakar.in` | `admin123` | Multi-society analytics and reports |
| **Super Admin (NCCT)** | `superadmin@sahakar.in` | `admin123` | National dashboard, compliance scores |

---

## 📐 Cooperative Wage Distribution Model

Every booking on SahakarSeva distributes payment **transparently and automatically**:

```
Customer Pays: ₹1,000 (example booking)
│
├── 💰 Worker Base Wage (90%) .............. ₹900  → Direct to artisan
├── 🏥 Ayushman Welfare Fund  (5%) ......... ₹50   → Healthcare + NPS-Lite pension
├── ⚙️  Platform Operations   (5%) ......... ₹50   → Server, audit, insurance
└── 🚫 Middleman Commission   (0%) ......... ₹0    → Eliminated entirely
```

### Samuhik Tender Bulk Contract Distribution

```
RWA Society pays: ₹28,800 (48-unit AC contract)
│
├── 90% to Cooperative Squad (₹25,920) → Split equally
│       ├── Worker 1: ₹6,480
│       ├── Worker 2: ₹6,480
│       ├── Worker 3: ₹6,480
│       └── Worker 4: ₹6,480
│
├──  5% Ayushman Welfare (₹1,440) → ₹360 per member passbook
└──  5% PACS Society Reserve (₹1,440) → Equipment depot & insurance
```

**Compare with private contractors:** Sub-contractors take 40–50% commission, leaving each artisan only ₹2,500–₹3,500 on the same ₹28,800 contract.

---

## 🏛️ Ministry of Cooperation Alignment

| ICA Cooperative Principle | SahakarSeva Implementation |
|--------------------------|---------------------------|
| **Voluntary & Open Membership** | Any verified artisan can join any PACS society — no lock-in, no exclusivity clause |
| **Democratic Member Control** | Society Admin (elected) sets wage floor; workers can challenge via welfare fund governance |
| **Member Economic Participation** | 90% direct wage + 5% welfare escrow — surplus stays with members |
| **Autonomy & Independence** | No VC/corporate control; cooperative surplus owned and governed by members |
| **Education, Training & Information** | NCCT Academy integrated directly in Worker Dashboard |
| **Cooperation among Cooperatives** | Federation Dashboard links multiple societies; Samuhik Tenders allow cross-society squads |
| **Concern for Community** | Suraksha Bandhu peer safety mesh; Samuhik Tenders for community RWA maintenance |

---

## 🐛 Recent Bug Fixes (v2.1.0)

| Bug | Severity | Status | Fix Applied |
|-----|----------|--------|-------------|
| `animate-scaleUp` class missing — all modals had no animation | Medium | ✅ Fixed | Added `@keyframes scaleUp` + utility class to `index.css` |
| `scrollbar-none` utility undefined | Low | ✅ Fixed | Added `.scrollbar-none` CSS utility |
| `border-3` not a default Tailwind class | Low | ✅ Fixed | Added `.border-3 { border-width: 3px }` to CSS |
| `Users` icon used in WorkerDashboard but not imported | **High** | ✅ Fixed | Added `Users` to `lucide-react` import — prevented ReferenceError crash |
| `SurakshaKavachModal` mounted but had no trigger button | Medium | ✅ Fixed | Added "View Guarantee / File Warranty Claim" button |
| `addNotification()` called with object instead of `(message, type)` | Medium | ✅ Fixed | Corrected API call signature in `SamuhikTendersModal` |

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

```bash
# 1. Fork the repository
# 2. Create your feature branch
git checkout -b feature/your-feature-name

# 3. Commit your changes
git commit -m "feat: add your feature"

# 4. Push to branch
git push origin feature/your-feature-name

# 5. Open a Pull Request
```

### Development Guidelines

- Follow the existing component architecture (`Customer/`, `Worker/`, `Common/`)
- All API calls go through `AppContext.jsx` helpers (`apiFetch`, `apiPost`, `apiPatch`)
- Use `addNotification(message, type)` for toast feedback (`'success'` / `'error'` / `'info'`)
- All modals receive `isOpen` and `onClose` props — use `if (!isOpen) return null` pattern
- Add the `animate-scaleUp` class to all new modal containers

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Built with ❤️ for Smart India Hackathon 2026**

Problem Statement **SIH26089** | Ministry of Cooperation | National Council for Cooperative Training (NCCT)

*"Cooperative gig work — dignified, fair, and worker-owned."*

<br/>

[![GitHub Stars](https://img.shields.io/github/stars/ashuthoshkumar/SahakarSeva?style=social)](https://github.com/ashuthoshkumar/SahakarSeva)
[![GitHub Forks](https://img.shields.io/github/forks/ashuthoshkumar/SahakarSeva?style=social)](https://github.com/ashuthoshkumar/SahakarSeva/fork)

</div>
