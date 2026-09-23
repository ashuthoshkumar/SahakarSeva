import React from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Home, Calendar, AlertTriangle, User, Lock, ShieldCheck, Globe } from 'lucide-react';
import { translateRole } from '../../utils/translateHelpers';

export const MobileHeader = ({ setActiveTab }) => {
  const { isAuthenticated, user, openAuthModal } = useAuth();
  const { t, lang, openLanguageModal } = useLanguage();

  return (
    <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-xl border-b border-slate-800/80 text-white px-4 pt-8 pb-3 shadow-lg">
      <div className="flex items-center justify-between gap-2 max-w-md mx-auto">
        
        {/* BRAND LOGO & TITLE */}
        <button
          onClick={() => setActiveTab && setActiveTab('home')}
          className="flex items-center gap-2.5 min-w-0 text-left active:scale-95 transition-transform"
        >
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-teal-400 via-emerald-500 to-teal-600 flex items-center justify-center text-slate-950 font-black text-base shadow-md shadow-teal-500/20 shrink-0">
            🤝
          </div>
          <div className="min-w-0">
            <h1 className="text-base font-black tracking-tight text-white leading-none">SahakarSeva</h1>
            <p className="text-[10px] text-teal-400 font-bold mt-1 tracking-wide uppercase">
              {t('cooperativeGigWorkforce') || 'Cooperative Workforce'}
            </p>
          </div>
        </button>

        {/* RIGHT CONTROLS */}
        <div className="flex items-center gap-1.5 shrink-0">
          
          {/* Quick Language Switcher Button */}
          <button
            onClick={openLanguageModal}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-teal-300 font-bold text-xs shadow-sm active:scale-95 transition-all"
            title="Change Language / भाषा बदलें"
          >
            <Globe className="w-3.5 h-3.5 text-teal-400" />
            <span className="uppercase font-mono text-[11px] font-extrabold">{lang}</span>
          </button>

          {/* User Account Avatar / Active Role Badge Button */}
          {!isAuthenticated ? (
            <button
              onClick={() => openAuthModal('login')}
              className="px-3 py-1.5 bg-gradient-to-r from-teal-500 to-emerald-500 active:from-teal-600 active:to-emerald-600 text-slate-950 font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 shrink-0 active:scale-95"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{t('signIn') || 'Sign In'}</span>
            </button>
          ) : (
            <button
              onClick={() => setActiveTab && setActiveTab('account')}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-teal-500/20 border border-teal-500/40 text-teal-300 font-extrabold text-xs shadow-sm hover:bg-teal-500/30 active:scale-95 transition-all shrink-0"
              title="View Account & Settings"
            >
              <div className="w-5 h-5 rounded-lg bg-teal-400 text-slate-950 font-black text-[10px] flex items-center justify-center">
                {user?.name ? user.name[0].toUpperCase() : 'U'}
              </div>
              <span className="text-[11px] truncate max-w-[85px]">{translateRole(user?.role, t)}</span>
            </button>
          )}

        </div>

      </div>
    </header>
  );
};

export const MobileBottomNav = ({ activeTab, setActiveTab }) => {
  const { setEmergencyModalOpen, bookings } = useApp();
  const { isAuthenticated, openAuthModal, user } = useAuth();
  const { t } = useLanguage();

  const isWorker = user?.role === 'worker';
  const pendingBookingsCount = bookings.filter(b => b.status !== 'Confirmed & Paid').length;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-slate-950 border-t border-slate-800/90 shadow-2xl safe-area-bottom">
      <div className={`max-w-md mx-auto grid ${isWorker ? 'grid-cols-3' : 'grid-cols-4'} items-center text-center px-2 py-1.5`}>
        
        {/* TAB 1: HOME */}
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all ${
            activeTab === 'home'
              ? 'text-teal-400 font-black'
              : 'text-slate-400 active:text-slate-200 font-medium'
          }`}
        >
          <div className={`p-1.5 rounded-xl ${activeTab === 'home' ? 'bg-teal-500/20 text-teal-400' : ''}`}>
            <Home className="w-5 h-5" />
          </div>
          <span className="text-[9px] mt-0.5">{t('home') || 'Home'}</span>
        </button>

        {/* TAB 2: BOOKINGS / HISTORY */}
        <button
          onClick={() => {
            if (!isAuthenticated) {
              openAuthModal('login');
            } else {
              setActiveTab('bookings');
            }
          }}
          className={`relative flex flex-col items-center justify-center py-1 rounded-xl transition-all ${
            activeTab === 'bookings'
              ? 'text-teal-400 font-black'
              : 'text-slate-400 active:text-slate-200 font-medium'
          }`}
        >
          <div className={`p-1.5 rounded-xl ${activeTab === 'bookings' ? 'bg-teal-500/20 text-teal-400' : ''}`}>
            <Calendar className="w-5 h-5" />
          </div>
          <span className="text-[9px] mt-0.5">{t('bookingsTab') || 'Bookings'}</span>
          {pendingBookingsCount > 0 && (
            <span className="absolute top-0.5 right-3 w-4 h-4 rounded-full bg-red-500 text-white font-black text-[8px] flex items-center justify-center shadow">
              {pendingBookingsCount}
            </span>
          )}
        </button>

        {/* TAB 3: EMERGENCY SOS (CUSTOMERS ONLY - EXCLUDED FOR WORKERS) */}
        {!isWorker && (
          <button
            onClick={() => setEmergencyModalOpen(true)}
            className="flex flex-col items-center justify-center py-1 text-rose-400 font-black transition-all"
            title="Emergency SOS Dispatch"
          >
            <div className="p-2 rounded-2xl bg-gradient-to-tr from-rose-600 to-red-500 text-white shadow-lg shadow-rose-600/40 sos-pulse-btn">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <span className="text-[9px] mt-0.5 text-rose-400 font-black">{t('sosEmergency') || 'SOS 15M'}</span>
          </button>
        )}

        {/* TAB 4: ACCOUNT / LOGIN */}
        <button
          onClick={() => {
            if (!isAuthenticated) {
              openAuthModal('login');
            } else {
              setActiveTab('account');
            }
          }}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all ${
            activeTab === 'account'
              ? 'text-teal-400 font-black'
              : 'text-slate-400 active:text-slate-200 font-medium'
          }`}
        >
          <div className={`p-1.5 rounded-xl ${activeTab === 'account' ? 'bg-teal-500/20 text-teal-400' : ''}`}>
            <User className="w-5 h-5" />
          </div>
          <span className="text-[9px] mt-0.5">{isAuthenticated ? (t('accountTab') || 'Account') : (t('signIn') || 'Sign In')}</span>
        </button>

      </div>
    </nav>
  );
};

