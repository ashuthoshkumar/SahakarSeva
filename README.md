# ?? SahakarSeva — Cooperative Gig Services Platform

> **SIH 2026 Problem Statement: SIH26089**
> Ministry of Cooperation & National Council for Cooperative Training (NCCT)
> Cooperative Gig Services Platform for Household & Community Services

---

## ?? Project Overview

**SahakarSeva** is a full-stack cooperative gig economy platform connecting verified NCCT-certified artisans directly with customers — eliminating exploitative middlemen, guaranteeing fair wages, and building long-term social security through cooperative ownership.

Unlike corporate gig platforms (Urban Company, UrbanClap), SahakarSeva is structured around ICA Cooperative Principles: democratic member control, collective worker ownership, fair wage floors set by the society, and transparent escrow disbursement.

---

## ?? Live URLs

| Service | URL |
|--------|-----|
| Frontend (Vite Dev) | \http://localhost:3000\ |
| Backend API (Express) | \http://localhost:5050\ |
| API Health Check | \http://localhost:5050/api/health\ |
| Production (Render) | \https://sahakar-seva-api-h1zm.onrender.com\ |

---

## ?? Demo Login Credentials

| Role | Email | Password | Access |
|------|-------|----------|--------|
| **Customer** | Register with any phone/email | self-register | Book services |
| **Worker** | Register as a craftsman | self-register | Accept jobs |
| **Society Admin** | \society@sahakar.in\ | \dmin123\ | KYC approvals, wage floor |
| **Federation Admin** | \ederation@sahakar.in\ | \dmin123\ | Multi-society analytics |
| **Super Admin (NCCT)** | \superadmin@sahakar.in\ | \dmin123\ | National dashboard |

---

## ? Complete Feature List

### ?? Customer Portal
- **Multi-language UI** — Full Hindi/English/Telugu/Marathi switching via Bhashini
- **Live GPS Worker Radar** — Leaflet map showing on-duty workers within 2–100 km
- **Service Category Catalog** — 8 categories with real worker counts
- **Worker Verification Cards** — NCCT level, Aadhaar KYC, police clearance, PF & Ayushman badge
- **AI Sahayak Voice Diagnosis** — Describe issue in any language; returns diagnosis + fair price vs. corporate markup
- **Escrow-Protected Booking** — Payment held until customer approves completion photo
- **Emergency SOS Dispatch** — 15-minute rapid dispatch for burst pipes, electrical hazards, gas leaks
- **Sahakari Suraksha Kavach** — Rs.25,000 zero-deductible guarantee + 30-day free redo warranty (with claim portal)
- **Cross-Language Job Chat** — Bhashini-powered bilingual chat between customer and worker
- **Invoice PDF Download** — Receipt with cooperative wage breakdown

### ?? Worker Portal
- **Duty Status Toggle** — On/Off duty with real-time database sync
- **Welfare Passbook (Khata)** — Digital ledger of earnings, PF contributions, Ayushman credits
- **NCCT Academy** — Upskilling roadmap: Level 1 ? Level 3 (Solar PV, EV Charger) certification
- **Material Credit e-RUPI Voucher** — Zero-interest digital vouchers (Rs.500–Rs.5,000) for hardware shops
- **?? Suraksha Bandhu SOS** — Hyperlocal peer emergency network: siren + 3 nearest peers + audio evidence recording
- **?? Sahakar Upkaran Bank** — PACS heavy equipment rental at Rs.50–Rs.90/day, zero security deposit
- **?? Samuhik Seva Tenders** — Form 3–5 member squads to bid directly on RWA bulk contracts (0% middleman cut)
- **Job Navigation Map** — GPS navigation to customer address
- **Voice Job Readout** — Bhashini TTS reads incoming job details in Hindi or regional language
- **Cross-Language Chat** — Real-time bilingual job coordination

### ??? Society Admin Dashboard
- Worker KYC Approval Queue
- Fair Wage Floor Control (enforced on all bookings)
- Welfare Fund Ledger (Ayushman, PF, pension)
- **?? Suraksha Bandhu Vigilance Desk** — Live SOS alert monitor with resolve action
- **?? PACS Equipment Asset Ledger** — Tool depot inventory and rental tracking

### ??? Federation Admin Dashboard
- Multi-society wage and revenue analytics
- Worker pool and NCCT certification overview
- AI demand forecast by category

### ???? Super Admin / NCCT National Dashboard
- National platform statistics
- Cooperative compliance scores
- Wage floor enforcement controls

### ?? AI & Language Features
- **Bhashini Translate** — Real-time translation across Hindi, English, Telugu, Kannada, Marathi
- **Bhashini TTS Voice Readout** — Regional language voice diagnosis and job details
- **AI Diagnostic Engine** — Keyword + semantic classification ? category + tools + hazard + fair price
- **Price Transparency Matrix** — Cooperative price vs. corporate app markup (saves 20–40%)

---

## ?? Innovative Differentiators

### ??? Innovation 1 — Suraksha Bandhu (Hyperlocal Emergency Mesh)
Workers get a pulsing red SOS button on every active job card.
- Web Audio API synthesized emergency siren
- 1.5 km radar with 3 nearest responding cooperative peers
- Incident category classification (harassment / medical / accident)
- Audio evidence recording + PIN standdown
- Society Admin Vigilance Desk sees live SOS in real time

### ?? Innovation 2 — Sahakar Upkaran Bank (PACS Tool Depot)
Workers rent professional heavy tools from PACS cooperative at 90% below market rates.
- Bosch Core Drill, Ridgid Sewer Jetter, Fluke Thermal Camera, Fiberglass 33kV Ladder
- Rs.50–Rs.90/day, Zero Security Deposit, auto-settled from job escrow
- Digital QR Gate Pass on rental confirmation

### ??? Innovation 3 — Samuhik Seva Tenders (Community Bulk Contracting)
RWAs and apartment societies post bulk work orders; cooperative squads bid directly.
- 3 live seeded tenders (48-unit AC deep clean, reservoir UV sterilization, solar rewiring)
- Automated Fair-Wage Split Calculator: 90% workers + 5% welfare + 5% PACS reserve
- Interactive comparison vs. private contractor pricing (40–50% cut vs 0%)
- Squad formation and 1-tap bid submission

---

## ??? Database Tables

| Table | Purpose |
|-------|---------|
| \workers\ | NCCT-certified cooperative artisans |
| \ookings\ | Service bookings with escrow & payment status |
| \societies\ | Primary cooperative societies (PACS) |
| \welfare_fund\ | Worker PF, Ayushman, pension credits |
| \samuhik_tenders\ | ?? RWA community bulk service tenders |

---

## ?? API Endpoints

### Workers
- \GET /api/workers\ — List by GPS radius, category, search
- \POST /api/workers\ — Register new worker
- \PATCH /api/workers/:id/duty\ — Toggle duty status
- \POST /api/workers/:id/approve\ — KYC approval

### Bookings
- \GET /api/bookings\ — All bookings
- \POST /api/bookings\ — Create booking
- \POST /api/bookings/:id/accept\ — Worker accepts
- \POST /api/bookings/:id/photo\ — Upload completion photo
- \POST /api/bookings/:id/approve\ — Customer approves
- \POST /api/bookings/:id/pay\ — Release escrow
- \POST /api/bookings/:id/redo\ — Request re-work

### Societies
- \GET /api/societies\ — All societies
- \PATCH /api/societies/:id/wage-floor\ — Update minimum wage

### Samuhik Tenders (New)
- \GET /api/tenders\ — List all RWA community tenders
- \POST /api/tenders\ — Create new tender
- \POST /api/tenders/:id/bid\ — Submit cooperative squad bid

### Bhashini AI
- \POST /api/bhashini/translate\ — Language translation
- \POST /api/bhashini/asr\ — Speech-to-text
- \POST /api/bhashini/tts\ — Text-to-speech
- \GET /api/bhashini/status\ — API connectivity check

### Analytics
- \GET /api/stats/platform\ — Platform-wide metrics
- \GET /api/stats/categories\ — Worker count per category
- \GET /api/worker/my-stats\ — Individual worker summary

---

## ?? Local Development Setup

\\\ash
# 1. Clone
git clone https://github.com/ashuthoshkumar/SahakarSeva.git
cd SahakarSeva

# 2. Install dependencies
npm install

# 3. Set environment variables
cp .env.example .env
# Add your Bhashini credentials in .env

# 4. Start backend (Terminal 1)
node server/index.js
# Running on http://localhost:5050

# 5. Start frontend (Terminal 2)
npm run dev
# Running on http://localhost:3000
\\\

---

## ?? Environment Variables

\\\env
BHASHINI_USER_ID=your_bhashini_user_id
BHASHINI_API_KEY=your_bhashini_api_key
VITE_API_URL=https://your-backend.onrender.com/api   # Optional for production
\\\

---

## ?? Bug Fixes (v2.1.0)

| Bug | Status | Fix |
|-----|--------|-----|
| \nimate-scaleUp\ CSS class missing across all modals | ? Fixed | Added keyframes + class to \index.css\ |
| \scrollbar-none\ utility undefined | ? Fixed | Added CSS utility to \index.css\ |
| \order-3\ not a Tailwind default class | ? Fixed | Added \.border-3 { border-width: 3px }\ |
| \Users\ icon used but not imported in WorkerDashboard | ? Fixed | Added to lucide-react import |
| \SurakshaKavachModal\ mounted but never triggered | ? Fixed | Added trigger button in CustomerDashboard |
| \ddNotification\ called with object instead of \(message, type)\ | ? Fixed | Corrected signature in SamuhikTendersModal |

---

## ?? Cooperative Wage Distribution

Every booking distributes payment transparently:

| Allocation | % | Purpose |
|-----------|---|---------|
| Worker Base Wage | 90% | Direct take-home for artisan |
| Ayushman / Welfare Fund | 5% | Healthcare + pension float |
| Platform Operations | 5% | Server, audit, insurance |
| Middleman / Commission | **0%** | Eliminated entirely |

### Samuhik Tender Bulk Contract Split (e.g. Rs.28,800 contract, 4 workers)
| Allocation | Each worker gets |
|-----------|-----------------|
| 90% to squad (split equally) | **Rs.6,480 per person** |
| 5% Ayushman welfare | Rs.360 per person |
| 5% PACS Society Reserve | Rs.1,440 shared |

---

## ??? Ministry of Cooperation Alignment

| ICA Principle | Implementation |
|--------------|---------------|
| Voluntary & Open Membership | Any verified artisan can join any PACS society |
| Democratic Member Control | Society Admin sets wage floor |
| Member Economic Participation | 90% direct wage + 5% welfare escrow |
| Autonomy & Independence | No corporate control; surplus owned by members |
| Education, Training, Information | NCCT Academy in Worker Dashboard |
| Cooperation among Cooperatives | Federation Dashboard links societies |
| Concern for Community | Suraksha Bandhu mesh, Samuhik Tenders for RWAs |

---

## ?? License

MIT License — Open source for cooperative development.

Built for **Smart India Hackathon 2026** | Problem Statement **SIH26089**
Ministry of Cooperation & National Council for Cooperative Training (NCCT)
