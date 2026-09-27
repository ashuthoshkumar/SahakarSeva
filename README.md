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
[![PWA](https://img.shields.io/badge/PWA-Offline--First-blueviolet?style=flat-square)](https://web.dev/progressive-web-apps/)
[![Security](https://img.shields.io/badge/Auth-Bcrypt%20Salted-success?style=flat-square)]()
[![Build](https://img.shields.io/badge/Build-Passing-brightgreen?style=flat-square)]()
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

<br/>

[📖 Documentation](#-table-of-contents) •
[🚀 Quick Start](#-quick-start) •
[✨ Features](#-features) •
[🌟 Key Innovations](#-key-innovations-our-differentiators) •
[🏗️ Architecture](#%EF%B8%8F-architecture) •
[🔌 API Reference](#-api-reference) •
[🤝 Contributing](#-contributing)

</div>

---

## 📋 Table of Contents

- [About the Project](#-about-the-project)
- [Problem Statement](#-problem-statement)
- [Key Innovations (Our Differentiators)](#-key-innovations-our-differentiators)
  - [1. Suraksha Bandhu (Peer Emergency Mesh)](#-innovation-1--suraksha-bandhu-hyperlocal-peer-emergency-mesh)
  - [2. Sahakar Upkaran Bank (PACS Tool Depot)](#-innovation-2--sahakar-upkaran-bank-pacs-equipment-depot)
  - [3. Samuhik Seva Tenders (Bulk Community Contracting)](#-innovation-3--samuhik-seva-tenders-community-bulk-contracting)
  - [4. Sahakari Sabha (Democratic Digital Assembly & Voting)](#-innovation-4--sahakari-sabha-democratic-digital-assembly--voting)
  - [5. Nyaya Pramaan (Fair Wage Merkle Hash Chain)](#-innovation-5--nyaya-pramaan-fair-wage-merkle-hash-chain-ledger)
  - [6. Offline-First PWA & Low-Bandwidth Architecture](#-innovation-6--offline-first-pwa--low-bandwidth-artisan-resilience)
- [Features Overview](#-features)
- [Architecture & Tech Stack](#%EF%B8%8F-architecture)
- [Database Schema](#-database-schema)
- [API Reference](#-api-reference)
- [Quick Start & Setup](#-quick-start)
- [Environment Variables](#-environment-variables)
- [Official Access Accounts](#-official-federated-access-accounts)
- [Cooperative Wage Distribution Model](#-cooperative-wage-distribution-model)
- [Ministry of Cooperation Alignment](#-ministry-of-cooperation-alignment)
- [Recent Updates & Changelog](#-recent-updates--changelog-v220)
- [Contributing](#-contributing)

---

## 🎯 About the Project

**SahakarSeva** is an enterprise-grade cooperative gig economy platform built for **Smart India Hackathon 2026** under Problem Statement **SIH26089** — Ministry of Cooperation & National Council for Cooperative Training (NCCT).

The platform directly bridges Primary Agricultural Credit Societies (PACS) and urban cooperative federations with households and community complexes (RWAs). It eliminates predatory corporate aggregators, guarantees **90% take-home wages**, builds lifelong healthcare and pension float (Ayushman Bharat + PF Khata), and enforces true **democratic governance** (1-Member, 1-Vote).

```
Platform Philosophy: Worker-Owned • Society-Governed • Middleman-Free • Cryptographically Verifiable
```

### What Makes SahakarSeva Different from Corporate Apps?

| Metric | Corporate Apps (e.g., Urban Company) | 🤝 SahakarSeva Cooperative Model |
|--------|--------------------------------------|-----------------------------------|
| **Worker's Share of Booking** | 50% – 60% after hidden commissions | **90% direct to artisan bank account** |
| **Middleman Commission** | 25% – 40% corporate cut | **0% (Zero middleman fee)** |
| **Social Security & Pension** | None (treated as gig freelancers) | **Auto-deposited PF Khata + Ayushman Fund** |
| **Democratic Voice** | Zero (platform unilaterally sets rules) | **Sahakari Sabha: 1-Member 1-Vote E-Democracy** |
| **Wage Transparency** | Opaque black-box billing | **Nyaya Pramaan: SHA-256 Merkle Hash Chain** |
| **Industrial Tool Access** | Worker must buy or rent at high rates | **PACS Tool Depot at ₹50–₹90/day, ₹0 deposit** |
| **On-Site Safety** | Static support helpline | **Suraksha Bandhu: Peer Mesh SOS + Siren + Radar** |
| **Bulk Community Work** | Sub-contractors take massive margins | **Samuhik Tenders: Worker squads bid directly** |
| **Regional Language Access** | English/Hindi only | **Bhashini MeitY AI: 8 Indian Languages + TTS** |
| **Connectivity Resilience** | Requires constant 4G/5G | **Offline-First PWA (Works in basements & 2G)** |

---

## 🏛️ Problem Statement

**SIH26089** — Ministry of Cooperation & NCCT (National Council for Cooperative Training)

> *"Design and develop a Cooperative Gig Services Platform that leverages cooperative societies (PACS) to provide verified, fair-wage household and community services — ensuring artisan welfare, transparency, and ICA cooperative principles."*

### Why Was This Problem Statement Raised?

1. **Predatory Extraction in Urban Gig Work:** Over 12 million informal artisans in India are trapped in algorithmically controlled corporate platforms where commissions run up to 40%, arbitrary account suspensions occur without hearing, and zero safety nets exist.
2. **Untapped PACS Digital Transformation:** India has over 100,000 Primary Agricultural Credit Societies (PACS). Under the Ministry of Cooperation's mandate to transform PACS into multi-purpose community service hubs, they require digital tools to organize and verify local service labor.
3. **Absence of Verifiable Fair Wages:** Corporate aggregators advertise low prices to consumers while penalizing workers. There has never been an open, cryptographically verifiable ledger proving that artisans received the full wage.
4. **Disenfranchisement of Cooperative Workers:** True cooperatives require democratic member participation (ICA Principle #2). Existing gig software completely ignores worker voting rights and cooperative assemblies.

---

## 🚀 Key Innovations (Our Differentiators)

### 🛡️ Innovation 1 — Suraksha Bandhu (Hyperlocal Peer Emergency Mesh)

> *"No cooperative artisan should ever feel alone on an emergency call."*

Every on-duty worker has a persistent emergency radar and SOS trigger on their active job card:
- 🔊 **Web Audio Synthesized Siren:** Immediate loud acoustic alarm generated purely in-browser, functioning even without network connectivity.
- 📡 **1.5 km Hyperlocal Peer Radar:** Dynamically calculates Haversine proximity to identify and notify the 3 nearest on-duty cooperative peers for immediate on-site backup.
- 🎙️ **Incident Audio Logger:** Automatic client-side audio recording capturing ambient sound during distress calls.
- 📋 **Triage Classification:** Harassment / Medical Emergency / Structural Hazard.
- 🔐 **PIN Standdown Verification:** Prevents unauthorized dismissals.
- 🖥️ **Society Admin Vigilance Desk:** Live visual radar map for society administrators to dispatch local emergency assistance.

---

### 🔧 Innovation 2 — Sahakar Upkaran Bank (PACS Equipment Depot)

> *"Democratizing industrial tools so lack of capital never limits an artisan's earning potential."*

PACS societies leverage collective purchasing power to stock high-end industrial machinery, rented to verified members at 90% below market rates:
- **Bosch Core Drill (Ø112mm):** Market ₹800/day → **PACS ₹80/day** (Worker saves ₹720)
- **Ridgid Sewer Jetter (2500 PSI):** Market ₹700/day → **PACS ₹70/day** (Worker saves ₹630)
- **Fluke Thermal Imager (IR Camera):** Market ₹900/day → **PACS ₹90/day** (Worker saves ₹810)
- **Fiberglass 33kV Safety Ladder:** Market ₹500/day → **PACS ₹50/day** (Worker saves ₹450)
- **Zero Cash Security Deposit:** Equipment fee auto-settles from the customer's escrow deposit upon successful job completion.
- **Digital QR Gate Pass:** Instant verifiable dispatch token for PACS tool custodians.

---

### 🏘️ Innovation 3 — Samuhik Seva Tenders (Community Bulk Contracting)

> *"Empowering cooperative squads to win apartment & institutional contracts without middlemen."*

Large residential complexes (RWAs) post bulk seasonal maintenance work orders:
- **Direct Cooperative Bidding:** Guild squads of 3–6 artisans bid directly without middleman subcontractors.
- **Seeded Active Tenders:**
  - *48-Unit AC Deep Clean & Gas Audit (Dwarka, Delhi)*: ₹28,800 budget → **₹6,480 per worker**
  - *6-Tank Water Reservoir UV Sterilization (Mayur Vihar, Delhi)*: ₹18,000 budget → **₹5,400 per worker**
  - *Solar Inverter & 120-LED Rewiring (Vasant Kunj, Delhi)*: ₹34,500 budget → **₹6,210 per worker**
- **Automated Fair-Wage Split Algorithm:**
  ```
  Total Escrow Budget
      ├── 90% → Distributed equally to all squad members via Direct Bank Transfer
      ├──  5% → Credited to individual Ayushman & Welfare Passbooks
      └──  5% → Transferred to PACS Society Equipment & Operational Reserve
  ```

---

### 🗳️ Innovation 4 — Sahakari Sabha (Democratic Digital Assembly & Voting)

> *"Fulfilling ICA Cooperative Principle #2: Democratic Member Control (1-Member, 1-Vote)."*

Unlike top-down corporate gig platforms where algorithms dictate wages and policies, SahakarSeva includes an interactive digital assembly:
- **Democratic Resolutions:** Society members vote on binding proposals:
  - *Minimum Wage Floor Adjustments (e.g., raise base rate from ₹250 to ₹300/hr)*
  - *Mutual Aid Emergency Health Corpus allocations*
  - *Procurement of specialized tools for the PACS Tool Depot*
  - *Subsidized monsoon safety gear distributions*
- **Real-Time Quorum Tracking:** Dynamically computes voting percentage against active member base.
- **Weighted Consensus Visualizer:** Live progress bars tracking In Favor / Against counts.
- **Role-Based Resolution Authoring:** Society Admins can table new resolutions directly to the assembly.

---

### 🔗 Innovation 5 — Nyaya Pramaan (Fair Wage Merkle Hash Chain Ledger)

> *"Don't trust corporate marketing. Verify with cryptographic mathematics."*

To eliminate wage skimming and guarantee complete transparency, SahakarSeva implements an immutable SHA-256 Merkle hash chain:
- **Cryptographic Chaining:** Each completed job escrow release forms a discrete block (`Block #0` Genesis onward) containing:
  `SHA-256(BlockIndex + BookingID + WorkerID + BaseWage + WelfareAmt + TotalAmount + Timestamp + PrevBlockHash)`
- **Tamper Evidence:** Altering even 1 paisa in any past transaction invalidates the entire subsequent chain.
- **Customer & Worker Verifier:** Anyone can input a Booking Transaction ID or browse the chain to verify that 90% reached the artisan, 5% was locked in Ayushman welfare, and 0% was siphoned by intermediaries.
- **Exportable Audit Ledger:** Downloadable CSV/JSON audit logs for government cooperative registrars.

---

### 📱 Innovation 6 — Offline-First PWA & Low-Bandwidth Artisan Resilience

> *"Designed for real India: basements, electrical vaults, and rural fringe areas."*

Artisans frequently work in shielded environments (basements, elevator shafts, rural outskirts) with weak or nonexistent 4G signals:
- **Service Worker (`sw.js`):** Stored local caching of all UI bundles, maps, icons, and styling.
- **Offline Data Fallback:** Cached job rosters, customer addresses, and emergency safety guidelines available without internet.
- **Installable Web App (PWA):** Home-screen installation on Android and iOS devices with native app performance and responsive layout.

---

## ✨ Features

<details>
<summary><b>👤 Customer Experience Portal</b> — Click to expand</summary>
<br/>

| Feature | Description |
|---------|-------------|
| 🌐 **Multilingual Bhashini Interface** | Real-time switching between English, Hindi, Telugu, Marathi, Kannada. |
| 🗺️ **Live GPS Worker Radar** | Interactive Leaflet map displaying real-time positions of nearby verified artisans. |
| 🤖 **AI Sahayak Voice Diagnosis** | Speak your issue in any language; AI extracts category, estimated cost, tools, and hazards. |
| 🛡️ **Sahakari Suraksha Kavach** | ₹25,000 zero-deductible quality warranty with 30-day free redo guarantee. |
| 💳 **Escrow-Protected Booking** | Funds held safely until the customer approves the worker's uploaded completion photo. |
| 🚨 **Emergency SOS Booking** | 15-minute rapid dispatch for hazardous leaks, electrical faults, and emergency lockouts. |
| 💬 **Cross-Language Live Chat** | Real-time bilingual chat translated automatically via Bhashini API. |
| 📄 **Transparent PDF Invoices** | Itemized receipts detailing the exact 90% / 5% / 5% cooperative breakdown. |
| 🔗 **Nyaya Pramaan Verifier** | Built-in tool to cryptographically verify payment disbursement. |

</details>

<details>
<summary><b>👷 Worker Empowerment Workspace</b> — Click to expand</summary>
<br/>

| Feature | Description |
|---------|-------------|
| 🟢 **Live Duty Toggle** | Instant On/Off duty status synced to database and cross-device cloud. |
| 📒 **Welfare Passbook (Khata)** | Live ledger tracking cumulative earnings, PF contributions, and Ayushman credits. |
| 🗳️ **Sahakari Sabha Assembly** | Vote on cooperative policies, minimum wages, and welfare distributions. |
| 🔗 **Nyaya Pramaan Explorer** | Inspect tamper-proof Merkle chain proving fair payment release. |
| 🛡️ **Suraksha Bandhu SOS** | Web Audio emergency siren + 1.5 km peer radar + audio incident logging. |
| 🔧 **Sahakar Tool Depot** | Rent industrial equipment at ₹50–₹90/day with zero security deposit. |
| 🏘️ **Samuhik Seva Tenders** | Form cooperative squads and bid on high-value community work orders. |
| 💳 **Material Credit e-RUPI** | Zero-interest credit vouchers (₹500–₹5,000) for supplies at partnered hardware stores. |
| 🎓 **NCCT Training Academy** | Upskilling pathways from Level 1 Artisan to Level 3 Master Specialist. |
| 📸 **Photo Work Proof** | Upload completion photo directly from camera to unlock escrow payment. |

</details>

<details>
<summary><b>🏛️ Society Admin & Federation Oversight</b> — Click to expand</summary>
<br/>

| Feature | Description |
|---------|-------------|
| 📋 **Artisan KYC Verification Queue** | Verify Aadhaar, NCCT certification, and police verification badges. |
| 💰 **Fair Wage Floor Governance** | Enforce society-wide minimum hourly wage rates that no booking can breach. |
| 🗳️ **Sahakari Sabha Admin Console** | Author, publish, and monitor democratic resolutions and member quorum. |
| 🚨 **Suraksha Bandhu Vigilance Desk** | Real-time map monitor for active distress signals with emergency resolution tools. |
| 📊 **Welfare Escrow Reconciliation** | Society ledger tracking Ayushman medical reserves and pension deposits. |
| 🌐 **Federation Multi-Society Radar** | Aggregate analytics across multiple PACS societies with AI demand forecasting. |

</details>

---

## 🏗️ Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                        SahakarSeva Architecture                        │
├────────────────────────────┬───────────────────────────────────────────┤
│   FRONTEND (Client)        │            BACKEND (Server)               │
│   • React 18 + Vite 5      │            • Express.js 4 (ESM)           │
│   • Tailwind CSS 3         │            • SQLite (WAL Mode) / Supabase │
│   • Lucide React + Leaflet │            • Bcrypt Salted Auth           │
│   • Offline PWA Worker     │            • SHA-256 Merkle Ledger        │
│   • Web Audio API          │            • Bhashini MeitY AI Gateway    │
│                            │                                           │
│   ┌─────────────────────┐  │            ┌───────────────────────────┐  │
│   │ Customer Dashboard  │──┼──REST API──│  /api/workers             │  │
│   │ Worker Dashboard    │  │  Polling   │  /api/bookings            │  │
│   │ Society Admin       │  │  Fallback  │  /api/sabha/resolutions   │  │
│   │ Federation Admin    │  │            │  /api/nyaya/chain         │  │
│   │ Super Admin (NCCT)  │──┼───────────▶│  /api/tenders             │  │
│   └─────────────────────┘  │            │  /api/bhashini/*          │  │
│                            │            └───────────────────────────┘  │
│   ┌─────────────────────┐  │                          │                │
│   │ Offline Cache (SW)  │  │            ┌─────────────▼─────────────┐  │
│   │ Leaflet GPS Engine  │  │            │  Bhashini Translation API │  │
│   │ Web Speech API      │  │            │  (MeitY Govt of India)    │  │
│   └─────────────────────┘  │            └───────────────────────────┘  │
└────────────────────────────┴───────────────────────────────────────────┘
```

### Tech Stack Details

- **Frontend:** React 18, Vite 5, Tailwind CSS 3, Lucide React, Leaflet, React-Leaflet, jsPDF, Recharts.
- **Backend:** Node.js, Express.js 4, better-sqlite3 / sqlite3 (WAL mode), bcryptjs, Multer, CORS.
- **PWA & Mobile:** Native Service Worker (`sw.js`), Web App Manifest, Capacitor configuration.
- **AI & Speech:** Bhashini MeitY API (Translate, TTS, ASR), Web Speech API fallback, custom AI Diagnostic Engine.
- **Security & Integrity:** Bcrypt password hashing (10 salt rounds), SHA-256 Merkle hash chain for wage verification.

---

## 🗄️ Database Schema

```sql
-- 1. Cooperative Workers Registry
workers (id, name, photo, category, societyId, societyName, rating,
         reviewsCount, jobsCompleted, experienceYears, hourlyRate,
         lat, lng, ncctLevel, kycStatus, policeVerification,
         ayushmanCard, pfAccountNumber, onDuty, skills, phone, passwordHash)

-- 2. Service Bookings with Escrow
bookings (id, workerId, workerName, workerPhone, category, customerName,
          customerPhone, address, scheduledTime, isEmergency, hours,
          baseWage, welfareContribution, healthInsurance, platformFee,
          totalAmount, status, completionPhoto, workApproved,
          customerLat, customerLng, workerLat, workerLng, createdAt)

-- 3. Democratic Assemblies (Sahakari Sabha)
sahakari_resolutions (id, societyId, title, titleHi, description,
                      category, proVotes, againstVotes, quorumPct,
                      status, deadline, createdAt)

-- 4. Immutable Fair Wage Hash Chain (Nyaya Pramaan)
nyaya_wage_chain (blockIndex, bookingId, workerId, workerName,
                  baseWage, welfareAmount, totalPaid, timestamp,
                  prevHash, blockHash)

-- 5. Community Bulk Contracts (Samuhik Tenders)
samuhik_tenders (id, rwaName, title, titleHi, category, description,
                 unitsCount, workersNeeded, budgetEscrow, location,
                 scheduledDates, status, awardedSquadName, bidsCount, createdAt)

-- 6. Cooperative Societies (PACS)
societies (id, name, registrationNo, federation, location, workerCount,
           welfareFundBalance, complianceScore, wageFloor, status)

-- 7. Worker Welfare Khata
welfare_fund (workerId, workerName, pfCredits, ayushmanCredits,
              pensionFloat, lastUpdated)
```

---

## 🔌 API Reference

### 🗳️ Democratic Assembly (Sahakari Sabha)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/sabha/resolutions` | Fetch active democratic resolutions & voting tallies |
| `POST` | `/api/sabha/resolutions` | Society admin proposes new resolution |
| `POST` | `/api/sabha/resolutions/:id/vote` | Member casts vote (`vote: 'yes' \| 'no'`) |

### 🔗 Fair Wage Chain (Nyaya Pramaan)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/nyaya/chain` | Fetch the complete Merkle hash chain blocks |
| `GET` | `/api/nyaya/verify/:id` | Verify cryptographic SHA-256 integrity for a booking |

### 👷 Worker Management & Status

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/workers` | List verified workers (filters: `category`, `lat`, `lng`, `radiusKm`) |
| `POST` | `/api/workers` | Register new worker with bcrypt-hashed credentials |
| `PATCH` | `/api/workers/:id/duty` | Toggle live on/off duty status |
| `POST` | `/api/workers/:id/approve` | Society admin approves Aadhaar/NCCT KYC |

### 📅 Bookings & Escrow Flow

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/bookings` | List active bookings |
| `POST` | `/api/bookings` | Create escrow booking (returns 90/5/5 breakdown) |
| `POST` | `/api/bookings/:id/accept` | Artisan accepts dispatched request |
| `POST` | `/api/bookings/:id/photo` | Worker uploads photo proof of work completion |
| `POST` | `/api/bookings/:id/approve` | Customer approves work proof → releases escrow |
| `POST` | `/api/bookings/:id/pay` | Escrow payment release → writes block to Nyaya chain |

### 🏘️ Samuhik Bulk Tenders

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/tenders` | List open community maintenance tenders |
| `POST` | `/api/tenders` | RWA posts a new bulk service tender |
| `POST` | `/api/tenders/:id/bid` | Cooperative worker squad submits a collective bid |

### 🤖 Bhashini MeitY AI Proxy

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/bhashini/translate` | Translate text across 8 Indian languages |
| `POST` | `/api/bhashini/asr` | Speech-to-text audio transcription |
| `POST` | `/api/bhashini/tts` | Generate natural regional voice readout |

---

## 🚀 Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/ashuthoshkumar/SahakarSeva.git
cd SahakarSeva
npm install
```

### 2. Configure Environment

Copy the example environment configuration:
```bash
cp .env.example .env
```
*(Optional: Add your Bhashini API keys for live government translation, or use built-in smart multilingual fallbacks).*

### 3. Run Locally

```bash
# Terminal 1: Launch Backend API Server
node server/index.js
# ✅ Running on http://localhost:5050

# Terminal 2: Launch Vite Dev Server
npm run dev
# ✅ Running on http://localhost:3000
```

### 4. Build for Production

```bash
npm run build
# Creates optimized bundle in dist/ ready for deployment
```

---

## 🔐 Official Federated Access Accounts

| Role | Email / Phone | Password | Access Capabilities |
|------|---------------|----------|---------------------|
| **Customer** | Free Registration | Any | Book services, AI diagnosis, Escrow release, Nyaya audit |
| **Worker** | Free Registration | Any | Accept jobs, Sahakari Sabha vote, Tool depot, Tenders, SOS |
| **Society Admin** | `society@sahakar.in` | `admin123` | KYC approval, Wage floor control, Resolution management |
| **Federation Admin**| `federation@sahakar.in`| `admin123` | Multi-society analytics, Demand forecaster, Compliance |
| **Super Admin (NCCT)**| `superadmin@sahakar.in`| `admin123` | National oversight, Registrar audit, Cross-state policy |

---

## 📐 Cooperative Wage Distribution Model

```
Customer Booking: ₹1,000
│
├── 💰 90% Worker Base Wage (₹900) .......... Direct transfer to artisan account
├── 🏥  5% Ayushman Welfare Fund (₹50) ...... Deposited into worker's medical passbook
├── ⚙️   5% Platform & Society Fund (₹50) .... Server maintenance, tool depot & insurance
└── 🚫  0% Middleman Commission (₹0) ........ Completely eliminated
```

---

## 🏛️ Ministry of Cooperation Alignment

| ICA Principle | SahakarSeva Implementation |
|---------------|----------------------------|
| **1. Voluntary & Open Membership** | Open registration for any NCCT-certified or trade-tested artisan with zero entry barriers. |
| **2. Democratic Member Control** | **Sahakari Sabha** gives 1 vote per member on binding society resolutions and wage rates. |
| **3. Member Economic Participation** | 90% direct wage + 5% welfare passbook ownership ensures capital remains with workers. |
| **4. Autonomy & Independence** | Governed by autonomous PACS cooperatives, not venture capitalists or private aggregators. |
| **5. Education, Training & Information**| Integrated **NCCT Training Academy** providing career certification pathways. |
| **6. Cooperation among Cooperatives** | Multi-society federations and shared **Samuhik Tenders** squads across societies. |
| **7. Concern for Community** | **Suraksha Bandhu** mutual aid mesh + affordable subsidized community repair tenders. |

---

## 🔄 Recent Updates & Changelog (v2.2.0)

- ✅ **Sahakari Sabha Integrated:** Interactive democratic voting assembly for workers and admins with live quorum monitoring.
- ✅ **Nyaya Pramaan Cryptographic Ledger:** SHA-256 Merkle hash chain providing mathematical proof of fair wage disbursement.
- ✅ **Bcrypt Salted Authentication:** Upgraded password hashing using `bcryptjs` with 10 salt rounds for all user roles.
- ✅ **Offline-First PWA:** Implemented `public/sw.js` and `manifest.json` for installation and offline resilience.
- ✅ **Cross-Device Live Sync:** Multi-device synchronization ensuring worker status updates immediately across all screens.
- ✅ **NCCT Academy Curriculum:** Added structured training modules for Level 1 to Level 3 trade specializations.

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:
1. Fork the repository and create a feature branch (`git checkout -b feature/AmazingFeature`).
2. Adhere to the established modular component structure (`Customer/`, `Worker/`, `SocietyAdmin/`, `Common/`).
3. Verify that production builds succeed without warnings: `npm run build`.
4. Submit a Pull Request with a clear description of your improvements.

---

<div align="center">

**Built with pride for Smart India Hackathon 2026**  
*Ministry of Cooperation & National Council for Cooperative Training (NCCT)*  
*Empowering India's cooperative workforce through dignified technology.*

</div>
