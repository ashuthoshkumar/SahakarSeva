# 🇮🇳 SahakarSeva (सहकार सेवा)
### Cooperative Labour Gig Platform & NCCT-Certified Worker Ecosystem

[![Android APK](https://img.shields.io/badge/Android-APK%20v1.0.0-3DDC84?style=for-the-badge&logo=android&logoColor=white)](apk/SahakarSeva.apk)
[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.4.21-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Capacitor](https://img.shields.io/badge/Capacitor-8.2.2-119EFF?style=for-the-badge&logo=capacitor&logoColor=white)](https://capacitorjs.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4.17-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

---

## 📲 Direct Android APK Download & Installation

You can install and run SahakarSeva directly on any Android smartphone (Android 8.0+):

| APK Package | File Size | Direct Download Link |
| :--- | :--- | :--- |
| **SahakarSeva Standalone APK** | **8.13 MB** | [⬇️ Download `apk/SahakarSeva.apk`](apk/SahakarSeva.apk) |
| **SahakarSeva v1.0.0 Debug APK** | **8.13 MB** | [⬇️ Download `apk/SahakarSeva-v1.0.0-debug.apk`](apk/SahakarSeva-v1.0.0-debug.apk) |

### 📥 How to Install on Android:
1. Download [SahakarSeva.apk](apk/SahakarSeva.apk) to your Android device.
2. Tap on the downloaded `.apk` file.
3. If prompted, enable **"Install from unknown sources"** or **"Allow from this source"** in your device Settings.
4. Tap **Install** and open **SahakarSeva**!

---

## 🏛️ Project Vision & Cooperative Model

**SahakarSeva** replaces exploitative 25–35% corporate gig commissions with an autonomous, transparent cooperative framework under the **National Council for Cooperative Training (NCCT)** and the Ministry of Cooperation:

```
┌──────────────────────────────────────────────────────────┐
│                   Customer Pays ₹1,000                   │
└────────────────────────────┬─────────────────────────────┘
                             │
            ┌────────────────┴────────────────┐
            ▼                                 ▼
   ┌──────────────────┐             ┌────────────────────┐
   │  90% Direct Wage │             │ 10% Society Escrow │
   │  ₹900 to Worker  │             └─────────┬──────────┘
   └──────────────────┘                       │
                              ┌───────────────┴───────────────┐
                              ▼                               ▼
                     ┌──────────────────┐           ┌──────────────────┐
                     │  5% Welfare Fund │           │  5% Platform Ops │
                     │  ₹50 (Health/PF) │           │  ₹50 (Admin/Tech)│
                     └──────────────────┘           └──────────────────┘
```

- **0% Exploitative Commission**: Workers retain **90%** of their booking value directly.
- **Fair Wage Floor**: Minimum wage strictly enforced at **₹300/hour**.
- **Cooperative Welfare Fund (5%)**: Automatically allocates funds to worker pension, healthcare (Ayushman Bharat), and emergency funds.
- **NCCT Skill Certification**: Workers earn verifiable digital credentials (Level 1–4) linked to cooperative societies.

---

## 🌐 Real-Time Multi-Device Sync Hub (Cross-Phone Worker Discovery)

SahakarSeva features an autonomous **Multi-Device Cloud Sync Hub** that enables real-time peer discovery across different smartphones and networks (Wi-Fi, 4G/5G mobile data, and localhost):

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        SahakarSeva Multi-Device Sync Topology                          │
└────────────────────────────────────────────────────────────────────────────────────────┘
               📱 Smartphone A (Worker)               📱 Smartphone B (Customer)
               [Android APK / Browser]                [Android APK / Browser]
                          │                                      │
                          ▼ (Worker Registration)                ▼ (Search / Marketplace)
               ┌───────────────────────┐              ┌────────────────────────┐
               │ Dynamic GPS Coords    │              │ Haversine Geo Filter   │
               │ (Lat, Lng + Category) │              │ Real-time Merging      │
               └──────────┬────────────┘              └──────────▲─────────────┘
                          │                                      │
                          │        ┌───────────────────┐         │
                          ├───────►│  Cloud Sync Hub   ├─────────┤ (8s Background Polling
                          │        │ (REST Object API) │         │  + Instant "Sync Now")
                          │        └───────────────────┘         │
                          │                                      │
                          │        ┌───────────────────┐         │
                          └───────►│ Express + SQLite  ├─────────┘
                                   │  LAN / Server API │
                                   └───────────────────┘
```

### 🔑 Key Sync Features:
- **Zero-Config Cross-Device Sync**: When a friend registers as a worker on Phone A, Phone B instantly receives the profile through the Cloud Sync Hub within ~8 seconds or immediately upon tapping **"Sync Now"**.
- **Dynamic Geolocation Dispatch**: Captures the worker's true GPS coordinates (`lat`, `lng`) upon registration. Distance calculations gracefully fall back within customer radius so newly registered workers appear immediately in search and category filters.
- **Role Switcher for Workers**: Workers can tap **"Preview Marketplace as Customer"** from the Account tab to test and view their own profile as customers see it, then toggle back with **"Return to Worker Dashboard"**.
- **Tri-Layer Redundancy**:
  1. **Express + SQLite REST API**: High-performance local/LAN relational database.
  2. **Cloud Sync Hub**: Zero-configuration multi-phone synchronization across mobile networks.
  3. **Offline LocalStorage**: Resilient fail-safe persistence ensuring zero data loss if offline.

---

## 🏗️ System Architecture

```
                                  +-------------------------------------------------+
                                  |         SahakarSeva Cross-Platform App          |
                                  |  (Web PWA & Native Android via Capacitor 8.2)  |
                                  +-------------------------------------------------+
                                                           |
                      +------------------------------------+------------------------------------+
                      |                                                                         |
                      v                                                                         v
      +-------------------------------+                                         +-------------------------------+
      |       Presentation Layer      |                                         |       Native Device Layer     |
      | - 8-Language Localization     |                                         | - Hardware GPS Geolocation    |
      | - Role-Based Dynamic Views    |                                         | - Camera Image Capture        |
      | - Interactive OSM Map         |                                         | - Native Splash & Lifecycle   |
      | - React Error Boundary        |                                         +-------------------------------+
      +-------------------------------+
                      |
                      v
      +-----------------------------------------------------------------------------------------+
      |                                  Client State & Logic Layer                             |
      |  [AuthContext]       -> Multi-role sessions, phone/password validation, cloud sync push  |
      |  [AppContext]        -> Escrow bookings, dynamic multi-device worker sync, 8s polling    |
      |  [LanguageContext]   -> Dynamic 8-language translations with startup selector modal     |
      |  [ImageCompressor]   -> HTML5 Canvas high-res photo compressor (< 80KB)                |
      |  [CloudSyncService]  -> REST Cloud Object Hub for real-time cross-device peer discovery |
      +-----------------------------------------------------------------------------------------+
                      |
                      v
      +-----------------------------------------------------------------------------------------+
      |                           Data Persistence & Backend API Layer                          |
      |  - Hybrid Backend: REST API (`/api/*`) via Express.js + SQLite Database (`server/`)     |
      |  - Cloud Sync Hub: Real-time multi-device cloud registry (`src/utils/cloudSync.js`)     |
      |  - Resilient Offline-First: `localStorage` Fail-Safe Registry with Quota Protection      |
      +-----------------------------------------------------------------------------------------+
```

---

## 💻 Tech Stack Breakdown

### 🎨 Frontend & UI
- **Framework**: [React 18.3.1](https://react.dev/) + [Vite 5.4](https://vitejs.dev/)
- **Styling**: [Tailwind CSS 3.4](https://tailwindcss.com/) with custom cooperative color palette and glassmorphism styling
- **Icons**: [Lucide React](https://lucide.dev/) (200+ clean SVG iconography components)
- **Image Optimization**: Custom HTML5 Canvas Compressor for camera proof-of-work uploads (< 80KB payload)
- **Crash Resilience**: React `ErrorBoundary` preventing blank-screen state crashes

### 📱 Native Mobile Bridge
- **Engine**: [Capacitor 8.2](https://capacitorjs.com/) (Android Bridge)
- **Geolocation**: `@capacitor/geolocation` (Hardware GPS locked with HTML5 fallback)
- **Android Target**: Gradle 8.2, Android SDK 34 (Android 8.0+ compatible)

### ⚙️ Backend, Cloud & Storage
- **Server**: Node.js & Express.js (`server/index.js`)
- **Database**: SQLite3 (`server/db.js`, `server/sahakar_seva.db`)
- **Cloud Sync Hub**: REST Cloud Registry (`src/utils/cloudSync.js`) for seamless multi-phone syncing across cell networks
- **Offline Storage**: Resilient `localStorage` wrapper with `QuotaExceededError` protection

---

## 👥 Multi-Role Workflow & 1-Tap Demo Credentials

SahakarSeva provides 5 dedicated role interfaces. You can sign in using **1-Tap Demo Logins** on the sign-in modal or with these credentials:

| Role | Email | Password | Primary Functions |
| :--- | :--- | :--- | :--- |
| **Customer** | `customer@sahakar.in` | `password123` | Search workers, GPS map, schedule bookings, SOS emergency, approve work, UPI pay |
| **Worker** | `worker@sahakar.in` | `password123` | On/Off duty toggle, accept jobs, upload camera work proof, track fair earnings |
| **Cooperative Society Admin** | `society@sahakar.in` | `admin123` | Worker KYC verification, welfare fund disbursement, dispute resolution |
| **State Federation Admin** | `federation@sahakar.in` | `admin123` | Multi-society analytics, district demand forecasting, compliance scores |
| **National Super Admin** | `admin@sahakar.in` | `admin123` | NCCT curriculum standards, national floor wage governance, federation audits |

---

## 🌐 8 Indian Languages Supported

SahakarSeva features full bilingual and localized coverage across 8 Indian languages:

1. **English (EN)**
2. **हिन्दी (HI)** — Hindi
3. **मराठी (MR)** — Marathi
4. **தமிழ் (TA)** — Tamil
5. **বাংলা (BN)** — Bengali
6. **తెలుగు (TE)** — Telugu
7. **ಕನ್ನಡ (KN)** — Kannada
8. **ગુજરાતી (GU)** — Gujarati

- Automatic **Startup Language Selector Modal** on first launch.
- Quick-switch **🌐 Language Selector** in the navigation header at any time.
- All modals, booking flows, invoice receipts, categories, and dashboards translate dynamically.

---

## 🔒 Strict Authentication & Security Constraints

- **Indian Mobile Validation**: Strictly validates 10-digit mobile numbers with `6`, `7`, `8`, or `9` prefixes.
- **Password Complexity Rules**: Enforces 8+ characters, uppercase letter, lowercase letter, numeric digit, and special symbol with live progress meter.
- **Worker Aadhaar KYC**: Validates 12-digit numeric Aadhaar number formatted into `XXXX-XXXX-XXXX`.
- **Canvas Image Compression**: Compresses 10MB+ phone camera captures to lightweight ~80KB JPEGs, protecting mobile memory and storage limits.

---

## 📁 Project Directory Structure

```
SahakarSeva/
├── apk/                                # Ready-to-install Android APK binaries
│   ├── SahakarSeva.apk                 # Standalone release binary (8.13 MB)
│   └── SahakarSeva-v1.0.0-debug.apk    # Debug build binary
├── android/                            # Capacitor Android native studio project
│   ├── app/src/main/
│   │   ├── AndroidManifest.xml         # Android app manifest & hardware permissions
│   │   └── java/com/sahakarseva/app/   # Native MainActivity bridge
│   └── build.gradle                    # Gradle build scripts
├── server/                             # Express.js REST API & SQLite Database
│   ├── db.js                           # SQLite database setup & schemas
│   ├── index.js                        # Express authentication & booking routes
│   └── aiEngine.js                     # Cooperative demand forecasting engine
├── src/
│   ├── components/
│   │   ├── Auth/                       # AuthModal with live password strength meter
│   │   ├── Common/                     # ErrorBoundary, LanguageSelectModal, StarRating
│   │   ├── Customer/                   # BookingModal, EmergencyBooking, WorkerList
│   │   ├── FederationAdmin/            # State Federation analytics & AI forecaster
│   │   ├── Landing/                    # Hero showcase & statistics
│   │   ├── Map/                        # Interactive GPS OpenStreetMap
│   │   ├── Navigation/                 # MobileNav header & bottom tab bar
│   │   ├── Payment/                    # Escrow payment breakdown & UPI invoice
│   │   ├── SocietyAdmin/               # Primary cooperative society dashboard
│   │   ├── SuperAdmin/                 # NCCT national director oversight
│   │   └── Worker/                     # Worker dashboard & camera proof upload
│   ├── context/
│   │   ├── AppContext.jsx              # Global bookings, workers, and escrow state
│   │   ├── AuthContext.jsx             # Session management & user roles
│   │   └── LanguageContext.jsx         # 8-language localization provider
│   ├── data/
│   │   ├── mockData.js                 # Certified worker catalog & societies
│   │   └── translations.js             # 8-language translation dictionary (60+ keys)
│   ├── utils/
│   │   ├── cloudSync.js                # Cloud Sync Hub for multi-device real-time discovery
│   │   ├── imageCompressor.js          # HTML5 Canvas image resizer & compressor
│   │   ├── translateHelpers.js         # Translation formatting helpers
│   │   └── validation.js               # Strict phone, password, and Aadhaar validators
│   ├── App.jsx                         # Main application layout router
│   ├── index.css                       # Tailwind design system tokens
│   └── main.jsx                        # Application root wrapped in ErrorBoundary
├── capacitor.config.json               # Capacitor Android configuration
├── package.json                        # Node dependencies & scripts
├── vite.config.js                      # Vite bundling pipeline
└── README.md                           # Documentation
```

---

## 📱 Multi-Phone Testing Guide (Cross-Device Verification)

You can verify real-time registration sync between two different phones (or between a phone and a computer):

### Scenario: Register on Phone A, View on Phone B
1. **Phone A (Worker Registration)**:
   - Open SahakarSeva APK on Phone A.
   - Tap **Register** and select **"Join as Skilled Worker"**.
   - Enter worker details: Full Name (e.g. `Ramesh Kumar`), Mobile Number (e.g. `9876543210`), Category (e.g. `Electrician`), Experience, and Hourly Rate.
   - Complete registration. The profile is saved locally and instantly broadcast to the Cloud Sync Hub.

2. **Phone B (Customer Discovery)**:
   - Open SahakarSeva on Phone B (either the APK or open `http://<your-lan-ip>:3000` in the mobile browser).
   - Go to the **Marketplace / Services** tab or search for `Electrician`.
   - The new worker `Ramesh Kumar` automatically appears in the list!
   - *Tip:* You can also tap **"Sync Now"** in the **Account** tab to trigger an immediate pull.

3. **Preview Mode for Workers**:
   - If you registered on Phone A and want to see how customers view your profile, go to the **Account** tab and tap **"Preview Marketplace as Customer"**.
   - Tap **"Return to Worker Dashboard"** at the top banner whenever you want to switch back to managing your work requests.

---

## ⚡ Local Development & Build Commands

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
# Starts local Vite server at http://localhost:5173
```

### 3. Start Backend Server (Optional)
```bash
npm run server
# Starts Express API at http://localhost:5050
```

### 4. Build Production Web Bundle
```bash
npm run build
```

### 5. Sync & Build Android APK
```bash
npx cap sync android
cd android
./gradlew assembleDebug
# Generated APK at: android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 📜 License & Acknowledgements

- **License**: MIT License
- **Framework & Inspiration**: National Council for Cooperative Training (NCCT) & Ministry of Cooperation, Government of India.
- **Created with ❤️ for empowering skilled Indian gig workers.**
