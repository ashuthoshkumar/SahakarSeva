import React, { useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { 
  User, LogOut, MapPin, Phone, Mail, ShieldCheck, 
  HardHat, Building2, Star, Heart, ChevronRight,
  Settings, Bell, Globe, Lock, Info, Smartphone,
  RefreshCw, Wifi, Eye, Server, Check
} from 'lucide-react';

export const AccountPage = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { 
    userCoords, 
    detectUserLocation, 
    isLocating, 
    addNotification, 
    bookings, 
    syncNow, 
    getSavedBackendUrl, 
    setSavedBackendUrl, 
    currentRole, 
    setCurrentRole 
  } = useApp();
  const { t, lang, openLanguageModal } = useLanguage();

  const [isSyncing, setIsSyncing] = useState(false);
  const [showServerConfig, setShowServerConfig] = useState(false);
  const [serverUrlInput, setServerUrlInput] = useState(() => getSavedBackendUrl ? getSavedBackendUrl() : 'http://192.168.7.8:5050/api');

  if (!isAuthenticated || !user) return null;

  const langNames = {
    en: 'English',
    hi: 'हिन्दी (Hindi)',
    mr: 'मराठी (Marathi)',
    bn: 'বাংলা (Bengali)',
    ta: 'தமிழ் (Tamil)',
    te: 'తెలుగు (Telugu)',
    kn: 'ಕನ್ನಡ (Kannada)',
    gu: 'ગુજરાતી (Gujarati)'
  };

  // Compute real worker stats from actual bookings
  const workerStats = useMemo(() => {
    if (user.role !== 'worker') return null;
    const myBookings = bookings.filter(
      (b) => b.workerName === user.name || b.workerId === user.id
    );
    const paidBookings = myBookings.filter((b) => b.status?.includes('Paid'));
    const totalEarned = paidBookings.reduce((s, b) => s + (b.baseWage || 0), 0);
    const avgRating = paidBookings.length > 0
      ? (paidBookings.reduce((s, b) => s + (b.workerRating || 5), 0) / paidBookings.length).toFixed(1)
      : '5.0';
    return {
      rating: avgRating,
      jobsDone: paidBookings.length,
      totalEarned
    };
  }, [bookings, user]);

  const menuItems = [
    { icon: Globe, label: t('languageSetting') || 'Language / भाषा', value: langNames[lang] || 'English', action: openLanguageModal, actionLabel: t('change') || 'Change', chevron: true },
    { icon: MapPin, label: t('myLocation') || 'My Location', value: `${userCoords[0].toFixed(4)}, ${userCoords[1].toFixed(4)}`, action: detectUserLocation, actionLabel: isLocating ? (t('locating') || 'Locating...') : (t('updateGPS') || 'Update GPS') },
    { icon: Bell, label: t('notifications') || 'Notifications', value: t('enabled') || 'Enabled', chevron: true },
    { icon: Lock, label: t('privacySecurity') || 'Privacy & Security', value: '', chevron: true },
    { icon: Info, label: t('aboutApp') || 'About SahakarSeva', value: 'v1.0.0 (Cooperative)', chevron: true },
  ];

  const getRoleDisplay = (role) => {
    const map = {
      customer: { label: t('roleCustomer') || 'Customer', color: 'bg-emerald-100 text-emerald-800', icon: User },
      worker: { label: t('roleWorker') || 'Verified Worker', color: 'bg-amber-100 text-amber-800', icon: HardHat },
      society_admin: { label: t('roleSocietyAdmin') || 'Society Admin', color: 'bg-blue-100 text-blue-800', icon: Building2 },
      federation_admin: { label: t('roleFederationAdmin') || 'Federation Admin', color: 'bg-indigo-100 text-indigo-800', icon: Building2 },
      super_admin: { label: t('roleSuperAdmin') || 'Super Admin', color: 'bg-purple-100 text-purple-800', icon: ShieldCheck },
    };
    return map[role] || map.customer;
  };

  const roleInfo = getRoleDisplay(user.role);
  const RoleIcon = roleInfo.icon;

  return (
    <div className="space-y-4 pb-8">
      
      {/* Profile Card */}
      <div className="bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 rounded-3xl p-5 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-teal-500/15 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-teal-400 to-emerald-400 flex items-center justify-center text-slate-950 font-black text-2xl shadow-lg shadow-teal-500/30 shrink-0">
            {user.name ? user.name[0].toUpperCase() : 'U'}
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-black tracking-tight truncate">{user.name || 'User'}</h2>
            <p className="text-xs text-slate-300 truncate">{user.email || user.phone || ''}</p>
            <div className="mt-1.5 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/15 text-teal-200 text-[10px] font-bold border border-white/20">
              <RoleIcon className="w-3 h-3" />
              <span>{roleInfo.label}</span>
            </div>
          </div>
        </div>

        {/* Quick Stats Row - Real Data for Workers */}
        {user.role === 'worker' && (
          <div className="mt-4 grid grid-cols-3 gap-2">
            <div className="bg-white/10 rounded-xl p-2.5 text-center backdrop-blur-sm">
              <p className="text-base font-black">⭐ {workerStats?.rating ?? '5.0'}</p>
              <p className="text-[9px] text-teal-200 font-semibold">Rating</p>
            </div>
            <div className="bg-white/10 rounded-xl p-2.5 text-center backdrop-blur-sm">
              <p className="text-base font-black">{workerStats?.jobsDone ?? 0}</p>
              <p className="text-[9px] text-teal-200 font-semibold">Jobs Done</p>
            </div>
            <div className="bg-white/10 rounded-xl p-2.5 text-center backdrop-blur-sm">
              <p className="text-base font-black">₹{workerStats?.totalEarned ? (workerStats.totalEarned >= 1000 ? (workerStats.totalEarned / 1000).toFixed(1) + 'K' : workerStats.totalEarned) : '0'}</p>
              <p className="text-[9px] text-teal-200 font-semibold">Earned</p>
            </div>
          </div>
        )}
      </div>

      {/* Contact Info */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm divide-y divide-slate-100">
        {user.phone && (
          <div className="flex items-center gap-3 px-4 py-3.5">
            <div className="p-2 rounded-xl bg-teal-50 text-teal-600 shrink-0">
              <Phone className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Phone</p>
              <p className="text-sm font-bold text-slate-900 truncate">{user.phone}</p>
            </div>
          </div>
        )}
        {user.email && (
          <div className="flex items-center gap-3 px-4 py-3.5">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600 shrink-0">
              <Mail className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Email</p>
              <p className="text-sm font-bold text-slate-900 truncate">{user.email}</p>
            </div>
          </div>
        )}
        {user.aadhaarNo && (
          <div className="flex items-center gap-3 px-4 py-3.5">
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600 shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Aadhaar KYC</p>
              <p className="text-sm font-bold text-slate-900">{user.aadhaarNo}</p>
              <p className="text-[10px] text-emerald-600 font-bold">{user.kycStatus || 'Verified'}</p>
            </div>
          </div>
        )}
      </div>

      {/* Authorization & Access Level Summary */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-2">
        <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-teal-600" />
          <span>Active Role & Authorization Level</span>
        </h4>
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1">
          <p className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${roleInfo.color}`}>
              {roleInfo.label}
            </span>
            <span>Access Granted</span>
          </p>
          <p className="text-[11px] text-slate-600 font-normal leading-snug">
            {user.role === 'customer' && "Book doorstep verified service workers, inspect work proof photos, release escrow payments & write reviews."}
            {user.role === 'worker' && "Accept incoming job requests, upload work completion photos, earn minimum wage floor payouts, and manage duty status."}
            {user.role === 'society_admin' && "Manage cooperative society members, verify worker KYC, monitor welfare fund balance & set minimum wage floor."}
            {user.role === 'federation_admin' && "Oversee state-wide cooperative societies, allocate welfare grants, audit NCCT compliance & review analytics."}
            {user.role === 'super_admin' && "Full administrative access across national cooperative network, user management & system configuration."}
          </p>
        </div>

        {/* Quick Role Preview Switcher for Workers */}
        {user.role === 'worker' && (
          <div className="pt-1">
            <button
              onClick={() => {
                const nextRole = currentRole === 'customer' ? 'worker' : 'customer';
                setCurrentRole(nextRole);
                addNotification(nextRole === 'customer' ? 'Switched to Customer Marketplace Preview!' : 'Returned to Worker Dashboard!', 'info');
              }}
              className="w-full py-2 px-3 bg-teal-50 hover:bg-teal-100 border border-teal-200 text-teal-800 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <Eye className="w-3.5 h-3.5 text-teal-600" />
              <span>
                {currentRole === 'customer'
                  ? 'Return to Worker Dashboard'
                  : 'Preview Marketplace as Customer (View Worker Card)'}
              </span>
            </button>
          </div>
        )}
      </div>

      {/* MULTI-DEVICE CLOUD & NETWORK SYNC CARD */}
      <div className="bg-white rounded-2xl border border-teal-200 p-4 shadow-sm space-y-3 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-teal-100 text-teal-700">
              <Wifi className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-extrabold text-xs text-slate-900 leading-tight">Multi-Device Sync Hub</h4>
              <p className="text-[10px] text-slate-500">Live sync across all phones & APKs</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[9px] font-extrabold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Cloud Online
          </span>
        </div>

        <p className="text-[11px] text-slate-600 leading-relaxed">
          Workers registered on any phone automatically sync to your device within seconds via the public Cloud Registry or local Wi-Fi backend.
        </p>

        {/* Sync Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={async () => {
              setIsSyncing(true);
              try {
                if (syncNow) await syncNow();
              } finally {
                setIsSyncing(false);
              }
            }}
            disabled={isSyncing}
            className="py-2.5 px-3 bg-gradient-to-r from-teal-600 to-emerald-600 active:from-teal-700 active:to-emerald-700 text-white rounded-xl text-xs font-black shadow flex items-center justify-center gap-1.5 transition-all active:scale-95 disabled:opacity-60"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
          </button>

          <button
            onClick={() => setShowServerConfig(!showServerConfig)}
            className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold border border-slate-200 flex items-center justify-center gap-1.5 transition-all active:scale-95"
          >
            <Server className="w-3.5 h-3.5 text-slate-600" />
            <span>{showServerConfig ? 'Close' : 'Server IP'}</span>
          </button>
        </div>

        {/* Expandable Server / LAN IP Configuration */}
        {showServerConfig && (
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2 mt-2 text-xs animate-fadeIn">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Backend API Endpoint</span>
              <button
                onClick={() => {
                  const defaultUrl = 'http://192.168.7.8:5050/api';
                  setServerUrlInput(defaultUrl);
                  setSavedBackendUrl(defaultUrl);
                  addNotification('Reset to Wi-Fi host IP: ' + defaultUrl, 'info');
                }}
                className="text-[10px] font-bold text-teal-600 hover:underline"
              >
                Reset Default
              </button>
            </div>
            <input
              type="text"
              value={serverUrlInput}
              onChange={(e) => setServerUrlInput(e.target.value)}
              placeholder="http://192.168.7.8:5050/api"
              className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono text-slate-800 focus:outline-none focus:border-teal-500"
            />
            <button
              onClick={() => {
                if (serverUrlInput) {
                  setSavedBackendUrl(serverUrlInput.trim());
                  addNotification('Backend URL updated! Syncing...', 'success');
                  if (syncNow) syncNow();
                }
              }}
              className="w-full py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-colors"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save & Reconnect</span>
            </button>
          </div>
        )}
      </div>

      {/* Menu Items */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm divide-y divide-slate-100">
        {menuItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <button
              key={idx}
              onClick={item.action || (() => addNotification('Coming soon!', 'info'))}
              className="w-full flex items-center gap-3 px-4 py-3.5 text-left active:bg-slate-50 transition-colors"
            >
              <div className="p-2 rounded-xl bg-slate-100 text-slate-600 shrink-0">
                <Icon className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-slate-900">{item.label}</p>
                {item.value && <p className="text-[10px] text-slate-500 font-medium truncate">{item.value}</p>}
              </div>
              {item.actionLabel && (
                <span className="px-3 py-1 bg-teal-50 text-teal-700 rounded-lg text-[10px] font-bold border border-teal-200 shrink-0">
                  {item.actionLabel}
                </span>
              )}
              {item.chevron && <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />}
            </button>
          );
        })}
      </div>

      {/* LOGOUT BUTTON - BIG AND VISIBLE */}
      <button
        onClick={() => {
          logout();
          addNotification('Logged out successfully!', 'success');
        }}
        className="w-full flex items-center justify-center gap-2.5 px-4 py-4 bg-red-50 hover:bg-red-100 border-2 border-red-200 text-red-700 font-black text-sm rounded-2xl shadow-sm transition-all active:scale-95"
      >
        <LogOut className="w-5 h-5" />
        <span>Log Out</span>
      </button>

      {/* App Version Footer */}
      <div className="text-center pt-2 pb-4">
        <p className="text-[10px] text-slate-400 font-medium">SahakarSeva v1.0.0 • Ministry of Cooperation</p>
        <p className="text-[10px] text-slate-300 mt-0.5">Made with ❤️ for India's Cooperative Workforce</p>
      </div>
    </div>
  );
};
