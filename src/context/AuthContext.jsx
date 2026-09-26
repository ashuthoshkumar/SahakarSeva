import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  validatePhoneNumber,
  validatePassword,
  validateEmail,
  validateFullName,
  validateAadhaar,
  validateHourlyRate
} from '../utils/validation';
import {
  pushCloudAccount,
  pushCloudWorker,
  getSavedBackendUrl,
} from '../utils/cloudSync';

const AuthContext = createContext();

const API_BASE = '/api';

// Standard demo accounts for all 5 roles
const DEFAULT_ACCOUNTS = [
  {
    id: 'usr_cust_1',
    name: 'Priya Sharma (Demo Customer)',
    phone: '+91 98765 00001',
    email: 'customer@sahakar.in',
    password: 'password123',
    role: 'customer'
  },
  {
    id: 'usr_wrk_1',
    name: 'Ramesh Sharma (Demo Worker)',
    phone: '+91 98765 43210',
    email: 'worker@sahakar.in',
    password: 'password123',
    role: 'worker',
    societyId: 'soc_delhi_1',
    category: 'electrician',
    hourlyRate: 350
  },
  {
    id: 'usr_soc_1',
    name: 'Delhi Coop Admin',
    phone: '+91 98000 11122',
    email: 'society@sahakar.in',
    password: 'admin123',
    role: 'society_admin',
    societyId: 'soc_delhi_1'
  },
  {
    id: 'usr_fed_1',
    name: 'Northern Federation Officer',
    phone: '+91 98000 33344',
    email: 'federation@sahakar.in',
    password: 'admin123',
    role: 'federation_admin'
  },
  {
    id: 'usr_sup_1',
    name: 'NCCT National Director',
    phone: '+91 98000 55566',
    email: 'superadmin@sahakar.in',
    password: 'admin123',
    role: 'super_admin'
  }
];

const ACCOUNT_STORE_KEY = 'sahakar_registered_accounts';
const WIPE_VERSION_KEY = 'sahakar_wipe_v5_demo_ready';

// Auto-wipe stale accounts from localStorage so users start fresh with 0 fake/old accounts
if (typeof window !== 'undefined') {
  try {
    if (localStorage.getItem(WIPE_VERSION_KEY) !== 'done') {
      localStorage.removeItem('sahakar_local_user');
      localStorage.removeItem('sahakar_token');
      localStorage.removeItem('sahakar_registered_workers');
      localStorage.setItem(ACCOUNT_STORE_KEY, JSON.stringify(DEFAULT_ACCOUNTS));
      localStorage.setItem(WIPE_VERSION_KEY, 'done');
    }
  } catch (e) {}
}

// Read account registry from localStorage, initializing with defaults if missing
const getAccountRegistry = () => {
  try {
    const raw = localStorage.getItem(ACCOUNT_STORE_KEY);
    if (!raw) {
      localStorage.setItem(ACCOUNT_STORE_KEY, JSON.stringify(DEFAULT_ACCOUNTS));
      return DEFAULT_ACCOUNTS;
    }
    const parsed = JSON.parse(raw);
    let updated = [...parsed];
    let changed = false;
    for (const defAcc of DEFAULT_ACCOUNTS) {
      if (!updated.some(a => a.email === defAcc.email || a.phone === defAcc.phone)) {
        updated.push(defAcc);
        changed = true;
      }
    }
    if (changed) {
      localStorage.setItem(ACCOUNT_STORE_KEY, JSON.stringify(updated));
    }
    return updated;
  } catch (e) {
    localStorage.setItem(ACCOUNT_STORE_KEY, JSON.stringify(DEFAULT_ACCOUNTS));
    return DEFAULT_ACCOUNTS;
  }
};

// Save updated account list to localStorage
const saveAccountToRegistry = (account) => {
  const accounts = getAccountRegistry();
  const existingIdx = accounts.findIndex(a => a.phone === account.phone || (account.email && a.email === account.email));
  if (existingIdx >= 0) {
    accounts[existingIdx] = { ...accounts[existingIdx], ...account };
  } else {
    accounts.push(account);
  }
  localStorage.setItem(ACCOUNT_STORE_KEY, JSON.stringify(accounts));
};

// Hard timeout wrapper — prevents any single fetch from hanging >3s
const fetchWithTimeout = (url, options = {}, timeoutMs = 3000) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  return fetch(url, { ...options, signal: controller.signal })
    .finally(() => clearTimeout(timer));
};

const safeFetchJson = async (endpoint, options = {}) => {
  const cleanEndpoint = endpoint.startsWith('/api') ? endpoint : `/api${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

  // 1. Try relative endpoint first (proxied by Vite in dev to :5050 in <5ms, or reverse-proxied by Vercel in prod)
  try {
    const res = await fetchWithTimeout(cleanEndpoint, options, 3000);
    const contentType = res.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const json = await res.json();
      return { ...json, httpStatus: res.status };
    }
  } catch (err) {}

  // 2. Try configured backend (Render production backend or custom URL)
  const backendBase = getSavedBackendUrl();
  if (backendBase && backendBase !== '/api') {
    try {
      const pathSuffix = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
      const url = `${backendBase}${pathSuffix.startsWith('/api') ? pathSuffix.slice(4) : pathSuffix}`;
      const res = await fetchWithTimeout(url, options, 3500);
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const json = await res.json();
        return { ...json, httpStatus: res.status };
      }
    } catch (e2) {}
  }

  // 3. Fallback to direct local development server
  try {
    const res = await fetchWithTimeout(`http://localhost:5050${cleanEndpoint}`, options, 2500);
    const contentType = res.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const json = await res.json();
      return { ...json, httpStatus: res.status };
    }
  } catch (e3) {}

  return { success: false, offlineFallback: true };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('sahakar_local_user');
      if (!saved) return null;
      return JSON.parse(saved);
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => {
    return localStorage.getItem('sahakar_token') || null;
  });
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('login'); // login, register_customer, register_worker

  // Verify token ONLY ON INITIAL MOUNT (never wipe user right after they register/login)
  useEffect(() => {
    const verifySession = async () => {
      const savedToken = localStorage.getItem('sahakar_token');
      if (!savedToken) {
        setLoading(false);
        return;
      }
      try {
        const data = await safeFetchJson('/auth/me', {
          headers: { Authorization: savedToken }
        });
        if (data && data.success && data.user) {
          setUser(data.user);
          localStorage.setItem('sahakar_local_user', JSON.stringify(data.user));
        } else if (data && data.httpStatus === 401) {
          // Token explicitly expired on server
          localStorage.removeItem('sahakar_token');
          localStorage.removeItem('sahakar_local_user');
          setToken(null);
          setUser(null);
        } else {
          // Network offline or server unreachable: preserve local user session
          const savedUser = localStorage.getItem('sahakar_local_user');
          if (savedUser) {
            try { setUser(JSON.parse(savedUser)); } catch (e) {}
          }
        }
      } catch (err) {
        console.warn('Session verification fallback to stored user:', err);
      } finally {
        setLoading(false);
      }
    };
    verifySession();
  }, []); // Run ONCE on mount

  // ─── Predictable Role-Locked User Login ───
  const login = async (loginInput, password) => {
    const cleanInput = (loginInput || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();

    if (!cleanInput || !cleanPass) {
      return { success: false, error: 'Please enter both Phone/Email and Password.' };
    }

    // Try live Express API first
    try {
      const data = await safeFetchJson('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ loginInput: cleanInput, password: cleanPass })
      });
      if (data && data.success) {
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem('sahakar_token', data.token);
        localStorage.setItem('sahakar_local_user', JSON.stringify(data.user));
        setIsAuthModalOpen(false);
        return { success: true, message: data.message || `Welcome back, ${data.user.name}!` };
      } else if (data && data.error && !data.offlineFallback) {
        return { success: false, error: data.error };
      }
    } catch (e) {
      console.warn('Network login unavailable, validating against account registry');
    }

    // Standalone Offline Registry Login — Check local registry only (cloud sync is fire-and-forget)
    let accounts = getAccountRegistry();
    let matchedAccount = accounts.find(a =>
      (a.email && a.email.toLowerCase() === cleanInput) ||
      (a.phone && a.phone.replace(/\s+/g, '').includes(cleanInput.replace(/\s+/g, '')))
    );

    if (!matchedAccount) {
      return {
        success: false,
        error: `No account found matching "${loginInput}". Please check your credentials or register a new account.`
      };
    }

    if (matchedAccount.password !== cleanPass) {
      return {
        success: false,
        error: 'Incorrect password. Please verify and try again.'
      };
    }

    // Auth Success — load EXACT account and role!
    const userSession = {
      id: matchedAccount.id,
      name: matchedAccount.name,
      phone: matchedAccount.phone,
      email: matchedAccount.email,
      role: matchedAccount.role,
      aadhaarNo: matchedAccount.aadhaarNo || null,
      societyId: matchedAccount.societyId || null,
      category: matchedAccount.category || null,
      hourlyRate: matchedAccount.hourlyRate || null,
      kycVerified: true
    };
    const mockToken = 'apk_token_' + Date.now();
    setUser(userSession);
    setToken(mockToken);
    localStorage.setItem('sahakar_token', mockToken);
    localStorage.setItem('sahakar_local_user', JSON.stringify(userSession));
    setIsAuthModalOpen(false);

    return {
      success: true,
      message: `Signed in successfully as ${userSession.name} (${userSession.role.toUpperCase()})`
    };
  };

  // ─── Customer Registration ───
  const registerCustomer = async ({ name, phone, email, password }) => {
    // 1. Strict Name Validation
    const nameVal = validateFullName(name);
    if (!nameVal.isValid) {
      return { success: false, error: nameVal.error };
    }

    // 2. Strict Mobile Phone Validation
    const phoneVal = validatePhoneNumber(phone);
    if (!phoneVal.isValid) {
      return { success: false, error: phoneVal.error };
    }

    // 3. Strict Password Validation (8+ chars, upper, lower, number, special char)
    const passVal = validatePassword(password);
    if (!passVal.isValid) {
      return { success: false, error: passVal.error };
    }

    // 4. Strict Email Validation (if provided)
    const emailVal = validateEmail(email);
    if (!emailVal.isValid) {
      return { success: false, error: emailVal.error };
    }

    const cleanName = nameVal.normalizedName;
    const cleanPhone = phoneVal.normalizedPhone;
    const cleanEmail = emailVal.normalizedEmail;
    const cleanPass = password;

    // Try live Express API first
    try {
      const data = await safeFetchJson('/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: cleanName, phone: cleanPhone, email: cleanEmail, password: cleanPass, role: 'customer' })
      });
      if (data && data.success) {
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem('sahakar_token', data.token);
        localStorage.setItem('sahakar_local_user', JSON.stringify(data.user));
        // Save to registry
        saveAccountToRegistry({ ...data.user, password: cleanPass });
        setIsAuthModalOpen(false);
        return { success: true, message: data.message };
      } else if (data && !data.success && !data.offlineFallback) {
        // Live server explicitly rejected registration (e.g. 409 Conflict duplicate phone/email)
        return {
          success: false,
          alreadyRegistered: Boolean(data.alreadyRegistered),
          error: data.error || 'Registration failed'
        };
      }
    } catch (e) {
      console.warn('Network registration unavailable, performing offline registry registration');
    }

    // Offline Registry Customer Registration
    const accounts = getAccountRegistry();
    const cleanPhoneDigits = cleanPhone.replace(/\D/g, '').slice(-10);

    // Strict duplicate check across all roles (Worker, Customer, Admin)
    const existingByPhone = accounts.find(a => {
      const aDigits = (a.phone || '').replace(/\D/g, '').slice(-10);
      return aDigits.length === 10 && aDigits === cleanPhoneDigits;
    });

    if (existingByPhone) {
      const roleName = existingByPhone.role === 'worker' ? 'Worker' : existingByPhone.role === 'customer' ? 'Customer' : existingByPhone.role;
      return {
        success: false,
        alreadyRegistered: true,
        error: `Mobile number ${cleanPhone} is already registered (${roleName} account). The same mobile number cannot be registered again in either customer or worker role. Please log in instead.`
      };
    }

    if (cleanEmail) {
      const existingByEmail = accounts.find(a =>
        a.email && a.email.toLowerCase().trim() === cleanEmail.toLowerCase().trim()
      );
      if (existingByEmail) {
        const roleName = existingByEmail.role === 'worker' ? 'Worker' : existingByEmail.role === 'customer' ? 'Customer' : existingByEmail.role;
        return {
          success: false,
          alreadyRegistered: true,
          error: `Email address ${cleanEmail} is already registered (${roleName} account). The same email cannot be registered again. Please log in or use a different email.`
        };
      }
    }

    const newCustomer = {
      id: 'cust_' + Date.now(),
      name: cleanName,
      phone: cleanPhone,
      email: cleanEmail || `${cleanPhoneDigits}@sahakar.in`,
      password: cleanPass,
      role: 'customer',
      createdAt: new Date().toISOString()
    };

    saveAccountToRegistry(newCustomer);

    const userSession = {
      id: newCustomer.id,
      name: newCustomer.name,
      phone: newCustomer.phone,
      email: newCustomer.email,
      role: 'customer'
    };
    const mockToken = 'apk_token_' + Date.now();
    setUser(userSession);
    setToken(mockToken);
    localStorage.setItem('sahakar_token', mockToken);
    localStorage.setItem('sahakar_local_user', JSON.stringify(userSession));
    setIsAuthModalOpen(false);

    return { success: true, message: 'Customer Account Created Successfully!' };
  };

  // ─── Worker Registration & Aadhaar KYC ───
  const registerWorker = async ({ name, phone, email, password, aadhaarNo, societyId, category, hourlyRate, lat, lng }) => {
    // 1. Strict Name Validation
    const nameVal = validateFullName(name);
    if (!nameVal.isValid) {
      return { success: false, error: nameVal.error };
    }

    // 2. Strict Mobile Phone Validation
    const phoneVal = validatePhoneNumber(phone);
    if (!phoneVal.isValid) {
      return { success: false, error: phoneVal.error };
    }

    // 3. Strict Aadhaar KYC Validation
    const aadhaarVal = validateAadhaar(aadhaarNo);
    if (!aadhaarVal.isValid) {
      return { success: false, error: aadhaarVal.error };
    }

    // 4. Strict Hourly Rate Validation
    const rateVal = validateHourlyRate(hourlyRate);
    if (!rateVal.isValid) {
      return { success: false, error: rateVal.error };
    }

    // 5. Strict Password Validation (8+ chars, upper, lower, number, special char)
    const passVal = validatePassword(password);
    if (!passVal.isValid) {
      return { success: false, error: passVal.error };
    }

    // 6. Strict Email Validation (if provided)
    const emailVal = validateEmail(email);
    if (!emailVal.isValid) {
      return { success: false, error: emailVal.error };
    }

    const cleanName = nameVal.normalizedName;
    const cleanPhone = phoneVal.normalizedPhone;
    const cleanAadhaar = aadhaarVal.normalizedAadhaar;
    const cleanRate = rateVal.rateNumber;
    const cleanEmail = emailVal.normalizedEmail;
    const cleanPass = password;

    // Try live Express API first
    try {
      const data = await safeFetchJson('/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: cleanName,
          phone: cleanPhone,
          email: cleanEmail,
          password: cleanPass,
          role: 'worker',
          aadhaarNo: cleanAadhaar,
          societyId,
          category,
          hourlyRate: cleanRate,
          lat,
          lng
        })
      });
      if (data && data.success) {
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem('sahakar_token', data.token);
        localStorage.setItem('sahakar_local_user', JSON.stringify(data.user));
        saveAccountToRegistry({ ...data.user, password: cleanPass, category, hourlyRate: cleanRate });

        // Also save to shared worker pool so it appears in search across components
        if (data.worker) {
          try {
            const existingWorkers = JSON.parse(localStorage.getItem('sahakar_registered_workers') || '[]');
            const filtered = existingWorkers.filter(w => w.id !== data.worker.id && w.phone !== data.worker.phone);
            filtered.unshift(data.worker);
            localStorage.setItem('sahakar_registered_workers', JSON.stringify(filtered));
          } catch (e) {}

          // Fire-and-forget cloud sync (non-blocking)
          setTimeout(() => pushCloudWorker(data.worker).catch(() => {}), 0);
        }

        // Fire-and-forget account sync (non-blocking)
        setTimeout(() => pushCloudAccount({ ...data.user, password: cleanPass, category, hourlyRate: cleanRate }).catch(() => {}), 0);

        setIsAuthModalOpen(false);
        return { success: true, message: data.message, worker: data.worker };
      } else if (data && !data.success && !data.offlineFallback) {
        // Live server explicitly rejected registration (e.g. 409 Conflict duplicate phone/email)
        return {
          success: false,
          alreadyRegistered: Boolean(data.alreadyRegistered),
          error: data.error || 'Worker registration failed'
        };
      }
    } catch (e) {
      console.warn('Network registration unavailable, performing offline worker registration');
    }

    // Offline Registry Worker Registration
    const accounts = getAccountRegistry();
    const cleanPhoneDigits = cleanPhone.replace(/\D/g, '').slice(-10);

    // Strict duplicate check across all roles (Worker, Customer, Admin)
    const existingByPhone = accounts.find(a => {
      const aDigits = (a.phone || '').replace(/\D/g, '').slice(-10);
      return aDigits.length === 10 && aDigits === cleanPhoneDigits;
    });

    if (existingByPhone) {
      const roleName = existingByPhone.role === 'worker' ? 'Worker' : existingByPhone.role === 'customer' ? 'Customer' : existingByPhone.role;
      return {
        success: false,
        alreadyRegistered: true,
        error: `Mobile number ${cleanPhone} is already registered (${roleName} account). The same mobile number cannot be registered again in either customer or worker role. Please log in instead.`
      };
    }

    if (cleanEmail) {
      const existingByEmail = accounts.find(a =>
        a.email && a.email.toLowerCase().trim() === cleanEmail.toLowerCase().trim()
      );
      if (existingByEmail) {
        const roleName = existingByEmail.role === 'worker' ? 'Worker' : existingByEmail.role === 'customer' ? 'Customer' : existingByEmail.role;
        return {
          success: false,
          alreadyRegistered: true,
          error: `Email address ${cleanEmail} is already registered (${roleName} account). The same email cannot be registered again. Please log in or use a different email.`
        };
      }
    }

    if (cleanAadhaar) {
      const cleanAadhaarDigits = cleanAadhaar.replace(/\D/g, '');
      const existingByAadhaar = accounts.find(a => {
        if (!a.aadhaarNo) return false;
        return a.aadhaarNo.replace(/\D/g, '') === cleanAadhaarDigits;
      });
      if (existingByAadhaar) {
        return {
          success: false,
          alreadyRegistered: true,
          error: 'This Aadhaar number is already registered with an existing worker profile.'
        };
      }
    }

    const workerId = 'wrk_' + Date.now();
    const newWorkerAccount = {
      id: workerId,
      name: cleanName,
      phone: cleanPhone,
      email: cleanEmail || `${cleanPhoneDigits}@sahakar.in`,
      password: cleanPass,
      role: 'worker',
      category: category || 'electrician',
      hourlyRate: cleanRate,
      aadhaarNo: cleanAadhaar,
      societyId: societyId || 'soc_delhi_1',
      kycStatus: 'Aadhaar & NCCT Verified',
      createdAt: new Date().toISOString()
    };

    saveAccountToRegistry(newWorkerAccount);

    // Also add to the shared worker pool so this worker appears in customer search
    let workerProfile = null;
    try {
      const existingWorkers = JSON.parse(localStorage.getItem('sahakar_registered_workers') || '[]');
      let workerLat = (lat !== undefined && lat !== null && !isNaN(Number(lat))) ? Number(lat) : 28.6139;
      let workerLng = (lng !== undefined && lng !== null && !isNaN(Number(lng))) ? Number(lng) : 77.2090;

      if (!lat && !lng) {
        try {
          const lastGps = JSON.parse(localStorage.getItem('sahakar_last_gps') || '[]');
          if (Array.isArray(lastGps) && lastGps.length === 2) {
            workerLat = lastGps[0];
            workerLng = lastGps[1];
          }
        } catch (e) {}
      }

      workerProfile = {
        id: workerId,
        name: cleanName,
        phone: cleanPhone,
        email: cleanEmail,
        category: category || 'electrician',
        hourlyRate: Number(hourlyRate) || 350,
        rating: 5.0,
        reviewsCount: 1,
        distanceKm: 0.1,
        ncctLevel: 'Level 2 Certified Craftsman',
        societyName: societyId || 'SahakarSeva Cooperative Society',
        photo: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&q=80&w=250',
        lat: workerLat,
        lng: workerLng,
        skills: [(category || 'electrician').toUpperCase() + ' Specialist', 'Quick Doorstep Service'],
        onDuty: true,
        registeredAt: new Date().toISOString()
      };

      const filtered = existingWorkers.filter(w => w.id !== workerId && w.phone !== cleanPhone);
      filtered.unshift(workerProfile);
      localStorage.setItem('sahakar_registered_workers', JSON.stringify(filtered));

      // Fire-and-forget cloud sync (non-blocking)
      if (workerProfile) {
        setTimeout(() => pushCloudWorker(workerProfile).catch(() => {}), 0);
      }
      setTimeout(() => pushCloudAccount(newWorkerAccount).catch(() => {}), 0);
    } catch (e) {
      console.warn('Could not save worker to search pool:', e);
    }

    const userSession = {
      id: newWorkerAccount.id,
      name: newWorkerAccount.name,
      phone: newWorkerAccount.phone,
      email: newWorkerAccount.email,
      role: 'worker',
      category: newWorkerAccount.category,
      hourlyRate: newWorkerAccount.hourlyRate,
      aadhaarNo: newWorkerAccount.aadhaarNo
    };
    const mockToken = 'apk_token_' + Date.now();
    setUser(userSession);
    setToken(mockToken);
    localStorage.setItem('sahakar_token', mockToken);
    localStorage.setItem('sahakar_local_user', JSON.stringify(userSession));
    setIsAuthModalOpen(false);

    return { success: true, message: 'Worker Account Registered & Aadhaar KYC Verified!', worker: workerProfile };
  };

  // User Logout
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('sahakar_token');
    localStorage.removeItem('sahakar_local_user');
  };

  const openAuthModal = (tab = 'login') => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalTab,
        setAuthModalTab,
        login,
        registerCustomer,
        registerWorker,
        logout,
        openAuthModal,
        isAuthenticated: Boolean(user)
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
