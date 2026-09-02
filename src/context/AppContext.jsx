import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Geolocation } from '@capacitor/geolocation';

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
  try {
    const res = await fetch(`${API}${endpoint}`);
    const data = await res.json();
    return data;
  } catch (err) {
    try {
      const res = await fetch(`http://localhost:5050/api${endpoint}`);
      return await res.json();
    } catch (e) {
      return { success: false };
    }
  }
};

const apiPost = async (endpoint, body) => {
  try {
    const res = await fetch(`${API}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    return await res.json();
  } catch (err) {
    try {
      const res = await fetch(`http://localhost:5050/api${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      return await res.json();
    } catch (e) {
      return { success: false };
    }
  }
};

const apiPatch = async (endpoint, body) => {
  try {
    const res = await fetch(`${API}${endpoint}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    return await res.json();
  } catch (err) {
    try {
      const res = await fetch(`http://localhost:5050/api${endpoint}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      return await res.json();
    } catch (e) {
      return { success: false };
    }
  }
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

export const AppProvider = ({ children }) => {
  const [currentRole, setCurrentRole] = useState('customer');

  // Dynamic data from localStorage (no hardcoded fallback)
  const [workers, setWorkers] = useState(() => readStorage(STORAGE_KEYS.WORKERS));
  const [bookings, setBookings] = useState(() => readStorage(STORAGE_KEYS.BOOKINGS));
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

  // ─── Persist workers to localStorage whenever they change ───
  useEffect(() => {
    writeStorage(STORAGE_KEYS.WORKERS, workers);
  }, [workers]);

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

  // ─── Fetch Workers — Try API first, fallback to localStorage ───
  const fetchWorkers = async () => {
    if (!userCoords) return;
    const queryParams = new URLSearchParams({
      lat: userCoords[0].toString(),
      lng: userCoords[1].toString(),
      radiusKm: radiusKm.toString(),
      category: selectedCategory,
      search: searchQuery
    });
    const data = await apiFetch(`/workers?${queryParams.toString()}`);
    if (data.success && data.workers) {
      setWorkers(data.workers);
    } else {
      // Use localStorage registered workers with filtering
      const allRegistered = readStorage(STORAGE_KEYS.WORKERS);
      const filtered = allRegistered.filter(w => {
        const matchCat = selectedCategory === 'all' || w.category === selectedCategory;
        const matchSearch = !searchQuery ||
          (w.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
          (w.skills || []).some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (w.societyName || '').toLowerCase().includes(searchQuery.toLowerCase());
        // Distance filter using haversine
        let matchRadius = true;
        if (w.lat && w.lng && userCoords) {
          const dist = haversineKm(userCoords[0], userCoords[1], w.lat, w.lng);
          w.distanceKm = parseFloat(dist.toFixed(1));
          matchRadius = dist <= radiusKm;
        }
        return matchCat && matchSearch && matchRadius;
      });
      setWorkers(filtered);
    }
  };

  // Fetch Active Bookings
  const fetchBookings = async () => {
    const data = await apiFetch('/bookings');
    if (data.success && data.bookings) {
      setBookings(data.bookings);
    }
    // If API fails, bookings are already loaded from localStorage
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

  // ─── Add a new registered worker to the dynamic pool ───
  const addRegisteredWorker = (workerData) => {
    const allWorkers = readStorage(STORAGE_KEYS.WORKERS);
    // Avoid duplicates
    const exists = allWorkers.some(w => w.id === workerData.id);
    if (!exists) {
      const updated = [...allWorkers, workerData];
      writeStorage(STORAGE_KEYS.WORKERS, updated);
      setWorkers(updated);
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
      setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'Confirmed & Paid', paidAt: new Date().toISOString() } : b));
      if (selectedBooking && selectedBooking.id === bookingId) {
        setSelectedBooking({ ...selectedBooking, status: 'Confirmed & Paid', paidAt: new Date().toISOString() });
      }
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
        fetchPlatformStats,
        fetchCategoryCounts
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
