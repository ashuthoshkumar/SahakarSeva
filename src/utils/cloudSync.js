// ─── SahakarSeva Multi-Device Cloud & Peer Synchronization Hub ───
// Enables instant real-time worker and account sharing across multiple phones,
// even when running standalone APKs on different cellular/Wi-Fi networks.

const CLOUD_API_BASE = 'https://api.restful-api.dev/objects';
export const CLOUD_WORKERS_ID = 'ff808181a067127101a0763bde2c2728';
export const CLOUD_ACCOUNTS_ID = 'ff808181a067127101a0763bded52729';

// Default candidate backend URLs
export const DEFAULT_LAN_IP = '192.168.7.8';

// ─── Production Render backend URL — all devices use this when VITE_API_URL is not set ───
const RENDER_BACKEND = 'https://sahakar-seva-api-h1zm.onrender.com/api';

export const getSavedBackendUrl = () => {
  // 1. Highest priority: explicitly configured env var (Vercel / production deployment)
  if (import.meta.env && import.meta.env.VITE_API_URL) {
    const envUrl = import.meta.env.VITE_API_URL.trim();
    return envUrl.endsWith('/api') ? envUrl : `${envUrl.replace(/\/+$/, '')}/api`;
  }

  // 2. User-configured custom backend stored in localStorage (for LAN/APK use)
  try {
    const custom = localStorage.getItem('sahakar_custom_backend');
    if (custom && custom.trim()) return custom.trim();
  } catch (e) {}

  // 3. If running from a non-localhost domain (deployed on Vercel etc.), try same origin first,
  //    but ALSO return the known Render production backend so apiFetch can try it.
  if (typeof window !== 'undefined' && window.location) {
    const host = window.location.hostname;
    if (host && host !== 'localhost' && host !== '127.0.0.1') {
      // On a LAN IP (e.g. tablet on same WiFi) try the device's own IP:5050
      if (/^\d+\.\d+\.\d+\.\d+$/.test(host)) {
        return `http://${host}:5050/api`;
      }
      // On a cloud deployment (Vercel), use the known Render backend URL
      return RENDER_BACKEND;
    }
  }

  // 4. Local development fallback
  return `http://${DEFAULT_LAN_IP}:5050/api`;
};

export const setSavedBackendUrl = (url) => {
  try {
    if (url) {
      localStorage.setItem('sahakar_custom_backend', url.trim());
    } else {
      localStorage.removeItem('sahakar_custom_backend');
    }
  } catch (e) {}
};

// ─── Fetch Workers from Public Cloud Hub (Disabled synthetic / mock data) ───
export const fetchCloudWorkers = async () => {
  return [];
};

// ─── Push a New Registered Worker to Cloud Hub ───
export const pushCloudWorker = async (worker) => {
  if (!worker || !worker.id) return false;
  try {
    const existing = await fetchCloudWorkers();
    const cleanP = (worker.phone || '').replace(/\D/g, '').slice(-10);
    const filtered = existing.filter(w => {
      const wCleanP = (w.phone || '').replace(/\D/g, '').slice(-10);
      return w.id !== worker.id && (!cleanP || wCleanP !== cleanP);
    });

    const payload = [worker, ...filtered].slice(0, 100); // keep up to 100 latest

    await fetch(`${CLOUD_API_BASE}/${CLOUD_WORKERS_ID}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'SahakarSeva_Shared_Workers_Registry',
        data: { workers: payload, updatedAt: new Date().toISOString() }
      })
    });
    return true;
  } catch (err) {
    console.warn('Cloud worker publish notice:', err.message);
    return false;
  }
};

// ─── Fetch Accounts from Public Cloud Hub ───
export const fetchCloudAccounts = async () => {
  try {
    const res = await fetch(`${CLOUD_API_BASE}/${CLOUD_ACCOUNTS_ID}`, {
      cache: 'no-store'
    });
    if (!res.ok) return [];
    const json = await res.json();
    return Array.isArray(json?.data?.accounts) ? json.data.accounts : [];
  } catch (err) {
    return [];
  }
};

// ─── Push a New Registered Account to Cloud Hub ───
export const pushCloudAccount = async (account) => {
  if (!account || !account.phone) return false;
  try {
    const existing = await fetchCloudAccounts();
    const cleanP = (account.phone || '').replace(/\D/g, '').slice(-10);
    const filtered = existing.filter(a => {
      const aCleanP = (a.phone || '').replace(/\D/g, '').slice(-10);
      return (!cleanP || aCleanP !== cleanP) && (account.email ? a.email !== account.email : true);
    });

    const payload = [account, ...filtered].slice(0, 100);

    await fetch(`${CLOUD_API_BASE}/${CLOUD_ACCOUNTS_ID}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'SahakarSeva_Shared_Accounts_Registry',
        data: { accounts: payload, updatedAt: new Date().toISOString() }
      })
    });
    return true;
  } catch (err) {
    return false;
  }
};
