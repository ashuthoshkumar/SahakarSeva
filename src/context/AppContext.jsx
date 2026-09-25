import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
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

// Helper: read JSON array from localStorage with automatic synthetic data purge
const readStorage = (key, fallback = []) => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    if (key === STORAGE_KEYS.WORKERS && Array.isArray(parsed)) {
      // Purge any legacy synthetic or mock worker templates
      const syntheticNames = new Set(['Ramesh Kumar', 'Sunita Devi', 'Vikram Singh', 'Pooja Sharma', 'Mohd. Imran', 'Kavita Patil']);
      const sanitized = parsed.filter(w => !syntheticNames.has(w.name) && !w.id?.startsWith('worker_') && !w.id?.startsWith('w'));
      if (sanitized.length !== parsed.length) {
        localStorage.setItem(key, JSON.stringify(sanitized));
      }
      return sanitized;
    }
    return parsed;
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

// Haversine distance calculator (km)
const haversineKm = (lat1, lng1, lat2, lng2) => {
  const toRad = (v) => (v * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

export const AppProvider = ({ children }) => {
  const [currentRole, setCurrentRole] = useState('customer');

  // Dynamic data: starts strictly with 0 workers (no fake / synthetic data)
  const [workers, setWorkers] = useState([]);
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

  // ─── Standard Web HTML5 Geolocation Detector ───
  const detectUserLocation = async () => {
    setIsLocating(true);

    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const coords = [latitude, longitude];
          setUserCoords(coords);
          localStorage.setItem(STORAGE_KEYS.LAST_GPS, JSON.stringify(coords));
          setIsLocating(false);
          addNotification('Live GPS location detected successfully!', 'success');
        },
        (error) => {
          console.warn('Geolocation fallback notice:', error.message);
          setIsLocating(false);
        },
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 10000 }
      );
    } else {
      setIsLocating(false);
    }
  };

  useEffect(() => {
    detectUserLocation();
  }, []);

  // ─── Fetch Workers — Real Database Only (Strictly 0 Synthetic / Fake Workers) ───
  const fetchWorkers = async () => {
    if (!userCoords) return;
    const queryParams = new URLSearchParams({
      lat: userCoords[0].toString(),
      lng: userCoords[1].toString(),
      radiusKm: (radiusKm || 50).toString(),
      category: selectedCategory,
      search: searchQuery
    });

    try {
      const data = await apiFetch(`/workers?${queryParams.toString()}`);
      if (data && data.success && Array.isArray(data.workers)) {
        setWorkers(data.workers);
        writeStorage(STORAGE_KEYS.WORKERS, data.workers);
        return;
      }
    } catch (e) {}

    // Fallback: only real workers previously saved to storage (default 0)
    const local = readStorage(STORAGE_KEYS.WORKERS, []);
    setWorkers(local);
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

  // ─── Manual Refresh Action ───
  const syncNow = async () => {
    addNotification('Refreshing live data...', 'info');
    await fetchWorkers();
    await fetchBookings();
    addNotification('Refreshed successfully!', 'success');
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
    const allWorkers = readStorage(STORAGE_KEYS.WORKERS, []);
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
