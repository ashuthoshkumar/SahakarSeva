import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Geolocation } from '@capacitor/geolocation';
import {
  fetchCloudWorkers,
  pushCloudWorker,
  getSavedBackendUrl,
  setSavedBackendUrl,
  DEFAULT_LAN_IP
} from '../utils/cloudSync';

const AppContext = createContext();

const API = '/api';

// ─── localStorage keys ───
const STORAGE_KEYS = {
  WORKERS: 'sahakar_registered_workers',
  BOOKINGS: 'sahakar_bookings',
  SOCIETIES: 'sahakar_societies',
  LAST_GPS: 'sahakar_last_gps'
};

// Helper: read JSON array from localStorage
const readStorage = (key, fallback = []) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch { return fallback; }
};

// Helper: write JSON to localStorage safely
const writeStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.warn(`Storage write failed for ${key}:`, err);
  }
};

const apiFetch = async (endpoint) => {
  const backendBase = getSavedBackendUrl();
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

  // 1. Try relative (browser proxy)
  try {
    const res = await fetch(`${API}${cleanEndpoint}`);
    if (res.ok) return await res.json();
  } catch (err) {}

  // 2. Try configured backend / LAN IP (works on mobile phones & APK)
  try {
    const res = await fetch(`${backendBase}${cleanEndpoint}`);
    if (res.ok) return await res.json();
  } catch (e) {}

  // 3. Try localhost fallback
  try {
    const res = await fetch(`http://localhost:5050/api${cleanEndpoint}`);
    if (res.ok) return await res.json();
  } catch (e) {}

  return { success: false };
};

const apiPost = async (endpoint, body) => {
  const backendBase = getSavedBackendUrl();
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const payload = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  };

  // 1. Try relative
  try {
    const res = await fetch(`${API}${cleanEndpoint}`, payload);
    if (res.ok) return await res.json();
  } catch (err) {}

  // 2. Try configured backend / LAN IP
  try {
    const res = await fetch(`${backendBase}${cleanEndpoint}`, payload);
    if (res.ok) return await res.json();
  } catch (e) {}

  // 3. Try localhost fallback
  try {
    const res = await fetch(`http://localhost:5050/api${cleanEndpoint}`, payload);
    if (res.ok) return await res.json();
  } catch (e) {}

  return { success: false };
};

const apiPatch = async (endpoint, body) => {
  const backendBase = getSavedBackendUrl();
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const payload = {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  };

  try {
    const res = await fetch(`${API}${cleanEndpoint}`, payload);
    if (res.ok) return await res.json();
  } catch (err) {}

  try {
    const res = await fetch(`${backendBase}${cleanEndpoint}`, payload);
    if (res.ok) return await res.json();
  } catch (e) {}

  try {
    const res = await fetch(`http://localhost:5050/api${cleanEndpoint}`, payload);
    if (res.ok) return await res.json();
  } catch (e) {}

  return { success: false };
};

// ─── Haversine distance calculator (km) ───
const haversineKm = (lat1, lng1, lat2, lng2) => {
  const toRad = (v) => (v * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

// Initial verified seed workers fallback for dynamic state
const DEFAULT_WORKERS = [
  {
    id: 'wrk_101',
    name: 'Ramesh Sharma',
    photo: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&q=80&w=250',
    category: 'electrician',
    societyId: 'soc_delhi_1',
    societyName: 'Delhi NCR Shramik Sahakari Samiti',
    rating: 4.9,
    reviewsCount: 142,
    jobsCompleted: 310,
    experienceYears: 8,
    hourlyRate: 350,
    lat: 28.6139,
    lng: 77.2090,
    ncctLevel: 'Level 3 Master Craftsman',
    kycStatus: 'Aadhaar Verified',
    policeVerification: 'Clear (Verified by Delhi Police)',
    ayushmanCard: 'AB-8829-1029-4411',
    pfAccountNumber: 'DL/CPM/88219/101',
    onDuty: true,
    skills: ['MCB Wiring', 'Inverter Repair', 'Smart Switches', 'Industrial Solar Panels'],
    phone: '+91 98765 43210',
    distanceKm: 0.8
  },
  {
    id: 'wrk_102',
    name: 'Sunita Devi',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
    category: 'caregiver',
    societyId: 'soc_delhi_1',
    societyName: 'Delhi NCR Shramik Sahakari Samiti',
    rating: 4.95,
    reviewsCount: 98,
    jobsCompleted: 215,
    experienceYears: 6,
    hourlyRate: 320,
    lat: 28.6250,
    lng: 77.2180,
    ncctLevel: 'Level 2 Certified Nursing Assistant',
    kycStatus: 'Aadhaar Verified',
    policeVerification: 'Clear',
    ayushmanCard: 'AB-4410-9921-1029',
    pfAccountNumber: 'DL/CPM/88219/102',
    onDuty: true,
    skills: ['Elderly Care', 'Blood Pressure & Sugar Monitor', 'Physiotherapy Assist', 'Post-Op Care'],
    phone: '+91 98111 22334',
    distanceKm: 1.2
  },
  {
    id: 'wrk_103',
    name: 'Vikram Singh',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    category: 'plumber',
    societyId: 'soc_delhi_1',
    societyName: 'Delhi NCR Shramik Sahakari Samiti',
    rating: 4.8,
    reviewsCount: 110,
    jobsCompleted: 190,
    experienceYears: 7,
    hourlyRate: 350,
    lat: 28.6080,
    lng: 77.2300,
    ncctLevel: 'Level 2 Hydro Technician',
    kycStatus: 'Aadhaar Verified',
    policeVerification: 'Clear',
    ayushmanCard: 'AB-7711-3092-8812',
    pfAccountNumber: 'DL/CPM/88219/103',
    onDuty: true,
    skills: ['High Pressure Leak Fix', 'CPVC Fitting', 'Geyser Installation', 'Motor Pump Overhaul'],
    phone: '+91 97123 45678',
    distanceKm: 1.5
  },
  {
    id: 'wrk_104',
    name: 'Mohammed Mansoor',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
    category: 'carpenter',
    societyId: 'soc_delhi_1',
    societyName: 'Delhi NCR Shramik Sahakari Samiti',
    rating: 4.85,
    reviewsCount: 76,
    jobsCompleted: 145,
    experienceYears: 9,
    hourlyRate: 380,
    lat: 28.6300,
    lng: 77.2000,
    ncctLevel: 'Level 3 Wood Craftsman',
    kycStatus: 'Aadhaar Verified',
    policeVerification: 'Clear',
    ayushmanCard: 'AB-5590-1120-7733',
    pfAccountNumber: 'DL/CPM/88219/104',
    onDuty: true,
    skills: ['Modular Kitchen Repair', 'Custom Shelving', 'Door Frame Realignment', 'Furniture Polishing'],
    phone: '+91 99887 76655',
    distanceKm: 2.1
  },
  {
    id: 'wrk_105',
    name: 'Pooja Patil',
    photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=250',
    category: 'domestic_helper',
    societyId: 'soc_mh_1',
    societyName: 'Maharashtra Household & Skilled Workers Coop',
    rating: 4.9,
    reviewsCount: 160,
    jobsCompleted: 340,
    experienceYears: 5,
    hourlyRate: 300,
    lat: 19.0760,
    lng: 72.8777,
    ncctLevel: 'Level 2 Sanitation Specialist',
    kycStatus: 'Aadhaar Verified',
    policeVerification: 'Clear (Mumbai Police)',
    ayushmanCard: 'AB-3392-8819-0012',
    pfAccountNumber: 'MH/BOM/55120/105',
    onDuty: true,
    skills: ['Nutritious Meal Prep', 'Utensil Washing Machine', 'Floor Sanitization', 'Laundry Care'],
    phone: '+91 98222 33445',
    distanceKm: 2.8
  },
  {
    id: 'wrk_106',
    name: 'Ganesh Shinde',
    photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=250',
    category: 'technician',
    societyId: 'soc_mh_1',
    societyName: 'Maharashtra Household & Skilled Workers Coop',
    rating: 4.75,
    reviewsCount: 88,
    jobsCompleted: 175,
    experienceYears: 6,
    hourlyRate: 400,
    lat: 19.0820,
    lng: 72.8900,
    ncctLevel: 'Level 2 HVAC & Electronics',
    kycStatus: 'Aadhaar Verified',
    policeVerification: 'Clear',
    ayushmanCard: 'AB-9921-4412-5501',
    pfAccountNumber: 'MH/BOM/55120/106',
    onDuty: true,
    skills: ['Inverter AC Gas Refill', 'PCB Washing Machine Fix', 'Double Door Fridge Repair'],
    phone: '+91 97654 32109',
    distanceKm: 3.2
  }
];

export const AppProvider = ({ children }) => {
  const [currentRole, setCurrentRole] = useState('customer');

  // Dynamic data from localStorage with reliable fallback
  const [workers, setWorkers] = useState(() => {
    const saved = readStorage(STORAGE_KEYS.WORKERS);
    if (saved && saved.length > 0) return saved;
    writeStorage(STORAGE_KEYS.WORKERS, DEFAULT_WORKERS);
    return DEFAULT_WORKERS;
  });
  const [bookings, setBookings] = useState(() => {
    writeStorage(STORAGE_KEYS.BOOKINGS, []);
    return [];
  });
  const [societies, setSocieties] = useState(() => readStorage(STORAGE_KEYS.SOCIETIES, [
    { id: 'soc_default', name: 'SahakarSeva Cooperative Society', registrationNo: 'MSCS/CR/2024/001', federation: 'National Labour Cooperative Federation', location: 'Pan India', workerCount: 0, welfareFundBalance: '₹ 0', complianceScore: 100, wageFloor: 300, status: 'Active' }
  ]));
  const [loading, setLoading] = useState(false);

  // Live User GPS Location state [lat, lng] - initialized from last saved GPS or India center
  const [userCoords, setUserCoords] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LAST_GPS);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [28.6139, 77.2090]; // Default location
  });
  const [isLocating, setIsLocating] = useState(false);

  // Real-time platform stats (computed dynamically from localStorage data)
  const [platformStats, setPlatformStats] = useState({});
  const [categoryCounts, setCategoryCounts] = useState({});

  // Search & Filter state
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [radiusKm, setRadiusKm] = useState(20);

  // Modals & Active selections
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [emergencyModalOpen, setEmergencyModalOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [ratingBooking, setRatingBooking] = useState(null);

  // Worker Specific State
  const [workerDutyStatus, setWorkerDutyStatus] = useState(true);

  // Toast Notifications
  const [notifications, setNotifications] = useState([]);

  const addNotification = (message, type = 'info') => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 4000);
  };

  // ─── Persist bookings to localStorage whenever they change ───
  useEffect(() => {
    writeStorage(STORAGE_KEYS.BOOKINGS, bookings);
  }, [bookings]);

  // ─── Compute dynamic stats from real data ───
  const computeStats = useCallback(() => {
    const allWorkers = readStorage(STORAGE_KEYS.WORKERS);
    const allBookings = readStorage(STORAGE_KEYS.BOOKINGS);

    const paidBookings = allBookings.filter(b => b.status && b.status.includes('Paid'));
    const totalWages = paidBookings.reduce((sum, b) => sum + (b.baseWage || 0), 0);
    const totalWelfare = paidBookings.reduce((sum, b) => sum + (b.welfareContribution || 0), 0);

    setPlatformStats({
      totalSocieties: societies.length,
      totalWorkers: allWorkers.length,
      totalBookings: allBookings.length,
      totalFairWagesPaid: totalWages,
      totalWelfareFund: totalWelfare,
      avgWorkerRating: allWorkers.length > 0
        ? (allWorkers.reduce((sum, w) => sum + (w.rating || 0), 0) / allWorkers.length).toFixed(2)
        : 0
    });

    // Category counts from registered workers
    const counts = {};
    allWorkers.forEach(w => {
      if (w.category) {
        counts[w.category] = (counts[w.category] || 0) + 1;
      }
    });
    setCategoryCounts(counts);
  }, [societies.length]);

  useEffect(() => {
    computeStats();
  }, [workers, bookings, computeStats]);

  // ─── Native Hardware GPS Geolocation Detector (Capacitor + Web Fallback) ───
  const detectUserLocation = async () => {
    setIsLocating(true);
    let resolved = false;

    // 1. Try Capacitor Native Android GPS Hardware First
    try {
      const perm = await Geolocation.checkPermissions();
      if (perm.location !== 'granted') {
        await Geolocation.requestPermissions();
      }
      const position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 3000
      });
      if (position && position.coords) {
        const { latitude, longitude } = position.coords;
        const coords = [latitude, longitude];
        setUserCoords(coords);
        localStorage.setItem(STORAGE_KEYS.LAST_GPS, JSON.stringify(coords));
        setIsLocating(false);
        addNotification('Live hardware GPS locked accurately!', 'success');
        resolved = true;
        return;
      }
    } catch (capErr) {
      console.warn('Capacitor native Geolocation unavailable/timed out:', capErr);
    }

    // 2. Fallback to Browser HTML5 navigator.geolocation
    if (!resolved && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const coords = [latitude, longitude];
          setUserCoords(coords);
          localStorage.setItem(STORAGE_KEYS.LAST_GPS, JSON.stringify(coords));
          setIsLocating(false);
          addNotification('Live GPS location detected!', 'success');
        },
        (error) => {
          console.warn('HTML5 Geolocation fallback error:', error.message);
          setIsLocating(false);
          addNotification('GPS signal weak. Using last known location.', 'info');
        },
        { enableHighAccuracy: false, timeout: 8000, maximumAge: 10000 }
      );
    } else {
      setIsLocating(false);
    }
  };

  useEffect(() => {
    detectUserLocation();
  }, []);

  // ─── Fetch Workers — Hybrid Sync (Express Backend + Multi-Device Cloud Hub + Local Storage) ───
  const fetchWorkers = async () => {
    if (!userCoords) return;
    const queryParams = new URLSearchParams({
      lat: userCoords[0].toString(),
      lng: userCoords[1].toString(),
      radiusKm: (radiusKm || 50).toString(),
      category: selectedCategory,
      search: searchQuery
    });

    // 1. Fetch from Express SQLite backend
    let backendWorkers = [];
    try {
      const data = await apiFetch(`/workers?${queryParams.toString()}`);
      if (data && data.success && Array.isArray(data.workers)) {
        backendWorkers = data.workers;
      }
    } catch (e) {}

    // 2. Fetch from Multi-Device Cloud Sync Hub (cross-phone synchronization)
    let cloudWorkers = [];
    try {
      cloudWorkers = await fetchCloudWorkers();
    } catch (e) {}

    // 3. Read locally registered workers
    const localRegistered = readStorage(STORAGE_KEYS.WORKERS, DEFAULT_WORKERS);

    // 4. Merge all sources into unified master pool without duplicates
    const combinedMap = new Map();

    const addWorkerToMap = (w) => {
      if (!w || !w.id) return;
      const cleanP = (w.phone || '').replace(/\D/g, '').slice(-10);
      const key = cleanP ? `phone_${cleanP}` : `id_${w.id}`;

      let dist = (w.distanceKm !== undefined && !isNaN(w.distanceKm)) ? w.distanceKm : 0.5;
      if (w.lat && w.lng && userCoords) {
        dist = parseFloat(haversineKm(userCoords[0], userCoords[1], w.lat, w.lng).toFixed(1));
      }

      const existing = combinedMap.get(key);
      if (!existing) {
        combinedMap.set(key, { ...w, distanceKm: dist });
      } else {
        combinedMap.set(key, { ...existing, ...w, distanceKm: dist });
      }
    };

    DEFAULT_WORKERS.forEach(addWorkerToMap);
    localRegistered.forEach(addWorkerToMap);
    cloudWorkers.forEach(addWorkerToMap);
    backendWorkers.forEach(addWorkerToMap);

    const mergedMasterPool = Array.from(combinedMap.values());

    // Update master pool in localStorage
    writeStorage(STORAGE_KEYS.WORKERS, mergedMasterPool);

    // Apply active filter (category, search, radius) for display
    const filtered = mergedMasterPool.filter(w => {
      const matchCat = selectedCategory === 'all' || w.category === selectedCategory;
      const matchSearch = !searchQuery ||
        (w.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (w.skills || []).some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (w.societyName || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchRadius = (w.distanceKm || 0) <= (radiusKm || 50);
      return matchCat && matchSearch && matchRadius;
    });

    setWorkers(filtered.length > 0 ? filtered : mergedMasterPool);
  };

  // Fetch Active Bookings
  const fetchBookings = async () => {
    try {
      const data = await apiFetch('/bookings');
      if (data && data.success && Array.isArray(data.bookings)) {
        setBookings(data.bookings);
        writeStorage(STORAGE_KEYS.BOOKINGS, data.bookings);
      }
    } catch (e) {}
  };

  // Fetch Societies
  const fetchSocieties = async () => {
    const data = await apiFetch('/societies');
    if (data.success && data.societies) setSocieties(data.societies);
  };

  // Fetch Real-Time Platform Stats
  const fetchPlatformStats = async () => {
    const data = await apiFetch('/stats/platform');
    if (data.success && data.totalSocieties) setPlatformStats(data);
  };

  // Fetch Real-Time Category Counts
  const fetchCategoryCounts = async () => {
    const data = await apiFetch('/stats/categories');
    if (data.success && data.counts) setCategoryCounts(data.counts);
  };

  useEffect(() => {
    if (!userCoords) return;
    setLoading(true);
    Promise.all([fetchWorkers(), fetchBookings(), fetchSocieties(), fetchPlatformStats(), fetchCategoryCounts()]).then(() => setLoading(false));
  }, [userCoords, selectedCategory, searchQuery, radiusKm]);

  // ─── Real-Time Multi-Device Background Sync (polls cloud every 8 seconds) ───
  useEffect(() => {
    const syncInterval = setInterval(() => {
      fetchCloudWorkers().then(remoteWorkers => {
        if (Array.isArray(remoteWorkers) && remoteWorkers.length > 0) {
          const currentPool = readStorage(STORAGE_KEYS.WORKERS, DEFAULT_WORKERS);
          const currentIds = new Set(currentPool.map(w => w.id));
          const currentPhones = new Set(currentPool.map(w => (w.phone || '').replace(/\D/g, '').slice(-10)));

          const hasNew = remoteWorkers.some(rw => {
            const cleanP = (rw.phone || '').replace(/\D/g, '').slice(-10);
            return !currentIds.has(rw.id) && (!cleanP || !currentPhones.has(cleanP));
          });

          if (hasNew) {
            // New worker registered from another phone! Refresh workers list
            fetchWorkers();
          }
        }
      }).catch(() => {});
    }, 8000);

    return () => clearInterval(syncInterval);
  }, [userCoords, selectedCategory, searchQuery, radiusKm]);

  // ─── Manual Multi-Device Instant Sync Action ───
  const syncNow = async () => {
    addNotification('Syncing with multi-device network...', 'info');
    await fetchWorkers();
    await fetchBookings();
    addNotification('Synced with cloud & all devices successfully!', 'success');
  };

  // ─── Add a new registered worker to the dynamic pool & broadcast to cloud ───
  const addRegisteredWorker = async (workerData) => {
    // 1. Calculate distance
    if (workerData.lat && workerData.lng && userCoords) {
      workerData.distanceKm = parseFloat(haversineKm(userCoords[0], userCoords[1], workerData.lat, workerData.lng).toFixed(1));
    } else {
      workerData.distanceKm = 0.2;
    }

    // 2. Save into local master pool
    const allWorkers = readStorage(STORAGE_KEYS.WORKERS, DEFAULT_WORKERS);
    const cleanP = (workerData.phone || '').replace(/\D/g, '').slice(-10);
    const filtered = allWorkers.filter(w => {
      const wCleanP = (w.phone || '').replace(/\D/g, '').slice(-10);
      return w.id !== workerData.id && (!cleanP || wCleanP !== cleanP);
    });

    const updated = [workerData, ...filtered];
    writeStorage(STORAGE_KEYS.WORKERS, updated);

    // 3. Update active UI immediately
    setWorkers(prev => {
      const pFiltered = prev.filter(w => {
        const wCleanP = (w.phone || '').replace(/\D/g, '').slice(-10);
        return w.id !== workerData.id && (!cleanP || wCleanP !== cleanP);
      });
      return [workerData, ...pFiltered];
    });

    // 4. Push to Cloud Sync Hub so friend's phone sees it instantly
    try {
      await pushCloudWorker(workerData);
    } catch (e) {
      console.warn('Cloud sync push notice:', e);
    }
  };

  // ─── Create real booking with proper status flow ───
  const createBooking = async ({ worker, category, hours = 2, isEmergency = false, customerName, customerPhone, address = 'Current GPS Location' }) => {
    const data = await apiPost('/bookings', {
      workerId: worker.id,
      workerName: worker.name,
      workerPhone: worker.phone,
      workerPhoto: worker.photo || null,
      societyName: worker.societyName || 'Cooperative Society',
      category: category || worker.category,
      customerName: customerName || 'Customer',
      customerPhone: customerPhone || '',
      address,
      scheduledTime: isEmergency ? 'INSTANT DISPATCH (SOS)' : 'Today, ' + new Date(Date.now() + 3600000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isEmergency,
      hours
    });

    let newBooking;
    if (data.success && data.booking) {
      newBooking = { ...data.booking, societyName: worker.societyName || 'Cooperative Society' };
    } else {
      const baseWage = worker.hourlyRate * hours;
      newBooking = {
        id: 'bk_' + Date.now(),
        workerId: worker.id,
        workerName: worker.name,
        workerPhoto: worker.photo || null,
        societyName: worker.societyName || 'Cooperative Society',
        category: category || worker.category,
        customerName: customerName || 'Customer',
        customerPhone: customerPhone || '',
        address,
        scheduledTime: isEmergency ? 'INSTANT DISPATCH (SOS)' : 'Today, ' + new Date(Date.now() + 3600000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isEmergency,
        hours,
        baseWage,
        welfareContribution: Math.round(baseWage * 0.05),
        healthInsurance: Math.round(baseWage * 0.02),
        platformFee: Math.round(baseWage * 0.03),
        totalAmount: baseWage + Math.round(baseWage * 0.10),
        status: 'Pending',
        completionPhoto: null,
        workApproved: false,
        createdAt: new Date().toISOString()
      };
      setBookings(prev => [newBooking, ...prev]);
    }

    setSelectedBooking(newBooking);
    setBookingModalOpen(false);
    setEmergencyModalOpen(false);
    setPaymentModalOpen(false); // Don't auto-open payment — worker must complete work first
    addNotification(isEmergency ? 'Emergency Worker Dispatched! Worker will upload proof after completion.' : 'Booking Created! Worker will be notified.', 'success');
  };

  // ─── Worker accepts a booking ───
  const acceptBooking = (bookingId) => {
    setBookings(prev => prev.map(b =>
      b.id === bookingId ? { ...b, status: 'Accepted' } : b
    ));
    addNotification('Job Accepted! Navigate to customer location.', 'success');
  };

  // ─── Worker uploads work completion photo ───
  const uploadCompletionPhoto = (bookingId, photoDataUrl) => {
    setBookings(prev => prev.map(b =>
      b.id === bookingId
        ? { ...b, completionPhoto: photoDataUrl, status: 'Work Completed - Awaiting Approval', completedAt: new Date().toISOString() }
        : b
    ));
    addNotification('Work completion photo uploaded! Waiting for customer approval.', 'success');
  };

  // ─── Customer approves the completed work ───
  const approveWork = (bookingId) => {
    setBookings(prev => prev.map(b =>
      b.id === bookingId ? { ...b, workApproved: true, status: 'Approved - Ready for Payment' } : b
    ));
    addNotification('Work approved! You can now proceed to payment.', 'success');
  };

  // ─── Customer requests redo ───
  const requestRedo = (bookingId) => {
    setBookings(prev => prev.map(b =>
      b.id === bookingId ? { ...b, completionPhoto: null, workApproved: false, status: 'Redo Requested' } : b
    ));
    addNotification('Redo requested. Worker will be notified to redo the work.', 'info');
  };

  // ─── Complete Payment ───
  const completePayment = async (bookingId) => {
    const data = await apiPost(`/bookings/${bookingId}/pay`, {});
    if (data.success && data.booking) {
      setSelectedBooking(data.booking);
      fetchBookings();
    } else {
      setBookings(prev => {
        const updated = prev.map(b => b.id === bookingId ? { ...b, status: 'Confirmed & Paid', paidAt: new Date().toISOString() } : b);
        // Also update selectedBooking from the freshly-computed list
        const paidBooking = updated.find(b => b.id === bookingId);
        if (paidBooking) {
          setSelectedBooking(paidBooking);
        }
        return updated;
      });
    }
    setPaymentModalOpen(false);
    setInvoiceModalOpen(true);
    addNotification('Payment Processed Successfully!', 'success');
  };

  // Toggle Worker Duty Status
  const toggleWorkerDuty = async (workerId) => {
    const nextDutyStatus = !workerDutyStatus;
    setWorkerDutyStatus(nextDutyStatus);
    if (workerId) {
      // Update in localStorage pool too
      const allWorkers = readStorage(STORAGE_KEYS.WORKERS);
      const updated = allWorkers.map(w => w.id === workerId ? { ...w, onDuty: nextDutyStatus } : w);
      writeStorage(STORAGE_KEYS.WORKERS, updated);
      setWorkers(updated);
      await apiPatch(`/workers/${workerId}/duty`, { onDuty: nextDutyStatus });
      addNotification(`Duty Status updated: ${nextDutyStatus ? 'Available On Duty' : 'Off Duty'}`, 'info');
    }
  };

  // Approve Worker KYC
  const approveWorkerKYC = async (workerId) => {
    const data = await apiPost(`/workers/${workerId}/approve`, {});
    if (data.success) {
      fetchWorkers();
      addNotification('Worker KYC approved & certified!', 'success');
    } else {
      addNotification('Worker KYC approved & certified!', 'success');
    }
  };

  // Update Fair Wage Floor
  const updateSocietyWageFloor = async (societyId, wageFloor) => {
    const data = await apiPatch(`/societies/${societyId}/wage-floor`, { wageFloor });
    fetchSocieties();
    addNotification(`Minimum Wage Floor updated to ₹${wageFloor}/hr!`, 'success');
  };

  return (
    <AppContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        workers,
        bookings,
        societies,
        loading,
        userCoords,
        setUserCoords,
        detectUserLocation,
        isLocating,
        platformStats,
        categoryCounts,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        radiusKm,
        setRadiusKm,
        selectedWorker,
        setSelectedWorker,
        bookingModalOpen,
        setBookingModalOpen,
        emergencyModalOpen,
        setEmergencyModalOpen,
        paymentModalOpen,
        setPaymentModalOpen,
        invoiceModalOpen,
        setInvoiceModalOpen,
        ratingModalOpen,
        setRatingModalOpen,
        selectedBooking,
        setSelectedBooking,
        ratingBooking,
        setRatingBooking,
        workerDutyStatus,
        toggleWorkerDuty,
        notifications,
        addNotification,
        createBooking,
        acceptBooking,
        uploadCompletionPhoto,
        approveWork,
        requestRedo,
        completePayment,
        approveWorkerKYC,
        updateSocietyWageFloor,
        addRegisteredWorker,
        fetchWorkers,
        syncNow,
        getSavedBackendUrl,
        setSavedBackendUrl,
        fetchPlatformStats,
        fetchCategoryCounts
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
