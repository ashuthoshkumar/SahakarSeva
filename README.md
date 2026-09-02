# 🇮🇳 SahakarSeva (सहकार सेवा)
### Cooperative Labour Gig Platform & NCCT-Certified Worker Ecosystem

SahakarSeva is a state-of-the-art cooperative labor management and on-demand gig services platform designed to eliminate commission exploitation of gig workers through transparent multi-state cooperative federation networks, NCCT skill ratings, Aadhaar KYC verification, fair floor wages, cooperative welfare funds, and escrow payment settlement.

---

## 🌟 Key Features

1. **8 Indian Languages with Startup Localization**:
   - Hindi (हिन्दी), English, Marathi (मराठी), Tamil (தமிழ்), Bengali (বাংলা), Telugu (తెలుగు), Kannada (ಕನ್ನಡ), Gujarati (ગુજરાતી).
   - Real-time language switching across all dashboards, modals, categories, and payment receipts.

2. **Strict Multi-Role Authentication & Role-Based Authorization**:
   - **Customer**: On-demand and SOS emergency service bookings with GPS tracking.
   - **Worker**: NCCT-certified badge, live duty toggle, proof-of-work camera uploads with automatic canvas compression.
   - **Cooperative Society Admin**: Worker onboarding, dispute resolution, welfare fund management.
   - **State Federation Admin**: Inter-society analytics, district-level compliance oversight.
   - **National NCCT Director**: National standards, certification audits, wage floors.
   - Strict validation for Indian 10-digit mobile numbers (`6-9` prefix), 12-digit Aadhaar KYC, and 5-point password complexity.

3. **Cooperative Escrow & Instant UPI Payments**:
   - Transparent fee breakdown: 90% Fair Base Wage, 5% Cooperative Welfare Fund, 5% Platform Operation Fee (0% corporate commission drain).
   - Visual work completion approval before escrow release.

4. **Mobile Native First (Capacitor Android)**:
   - Standalone Android APK support with native hardware GPS Geolocation.

---

## 🚀 Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons, HTML5 Canvas Image Compressor
- **State & Localization**: React Context (AuthContext, AppContext, LanguageContext)
- **Mobile Bridge**: Capacitor 8 (Android Bridge & Native Geolocation)
- **Backend**: Node.js, Express, SQLite / LocalStorage Offline Registry

---

## 🛠️ Getting Started

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/ashuthoshkumar/SahakarSeva.git
cd SahakarSeva
npm install
```

### 2. Run Locally (Dev Mode)
```bash
npm run dev
```

### 3. Build Web Bundle
```bash
npm run build
```

### 4. Build Android APK
```bash
npx cap sync android
cd android
./gradlew assembleDebug
```

---

## 🔒 Security & Privacy
- Client-side and server-side input sanitization.
- Image auto-compression prevents local memory and storage quota overflow.
- React Error Boundary ensures resilience against runtime UI interruptions.

---

## 📜 License
MIT License. Developed for cooperative worker empowerment and fair gig labor standards.
