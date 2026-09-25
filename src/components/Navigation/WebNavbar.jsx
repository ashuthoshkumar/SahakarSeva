import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Home, User, ShieldCheck, Globe, Menu, X, LogOut, AlertTriangle, Lock 
} from 'lucide-react';
import { translateRole } from '../../utils/translateHelpers';
import { SahakarLogo } from '../Common/SahakarLogo';

export const WebNavbar = ({ activeTab, setActiveTab }) => {
  const { setEmergencyModalOpen } = useApp();
  const { isAuthenticated, user, openAuthModal, logout } = useAuth();
  const { t, lang, openLanguageModal } = useLanguage();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full font-sans shadow-md">

      {/* Main Desktop Navbar */}
      <div className="bg-slate-900/95 backdrop-blur-xl border-b border-slate-800 text-white px-4 sm:px-6 lg:px-8 py-3 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Brand Logo & Title */}
          <button
            onClick={() => handleTabClick('home')}
            className="flex items-center gap-3 text-left group focus:outline-none"
          >
            <SahakarLogo className="w-10 h-10 group-hover:scale-105 transition-transform shrink-0" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight text-white leading-none">
                  Sahakar<span className="text-teal-400">Seva</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium tracking-wide">
                {t('appSubtitle')}
              </p>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-2">
            <button
              onClick={() => handleTabClick('home')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'home'
                  ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>
                {isAuthenticated && user?.role
                  ? `${user.role.replace('_', ' ').toUpperCase()} WORKSPACE`
                  : (t('home') || 'Services & Workers')}
              </span>
            </button>

            {isAuthenticated && user?.role && (
              <span className="px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-teal-300 text-[11px] font-bold flex items-center gap-1.5 shadow-sm">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                <span>{translateRole(user.role, t)}</span>
              </span>
            )}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2.5">
            
            {/* Quick Language Switcher */}
            <button
              onClick={openLanguageModal}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700/80 text-teal-300 font-bold text-xs shadow-sm transition-all"
              title="Change Language / भाषा बदलें"
            >
              <Globe className="w-3.5 h-3.5 text-teal-400" />
              <span className="uppercase font-mono text-xs">{lang}</span>
            </button>

            {/* Emergency SOS Dispatch 15M (Visible for customers only, never workers) */}
            {(!isAuthenticated || user?.role === 'customer') && (
              <button
                onClick={() => setEmergencyModalOpen(true)}
                className="px-3 sm:px-4 py-2 bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-500 hover:to-rose-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-red-600/30 transition-all flex items-center gap-1.5 shrink-0 sos-pulse-btn active:scale-95"
                title={t('emergencySOSTitle')}
              >
                <AlertTriangle className="w-4 h-4" />
                <span className="hidden sm:inline">{t('emergencySOS')}</span>
                <span className="sm:hidden">SOS</span>
              </button>
            )}

            {/* User Profile / Auth Button */}
            {!isAuthenticated ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openAuthModal('login')}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 transition-all flex items-center gap-1.5"
                >
                  <Lock className="w-3.5 h-3.5 text-slate-300" />
                  <span>{t('signIn')}</span>
                </button>
                <button
                  onClick={() => openAuthModal('register_customer')}
                  className="hidden md:flex px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow-md shadow-teal-500/20 transition-all items-center gap-1.5"
                >
                  <span>{t('getStarted')}</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleTabClick('account')}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-teal-500/15 border border-teal-500/40 text-teal-300 font-extrabold text-xs shadow-sm hover:bg-teal-500/25 transition-all"
                  title="View Account & Profile"
                >
                  <div className="w-6 h-6 rounded-lg bg-teal-400 text-slate-950 font-black text-xs flex items-center justify-center">
                    {user?.name ? user.name[0].toUpperCase() : 'U'}
                  </div>
                  <div className="text-left hidden sm:block">
                    <p className="text-xs font-bold text-white leading-tight truncate max-w-[100px]">{user?.name}</p>
                    <p className="text-[10px] text-teal-400 font-semibold">{translateRole(user?.role, t)}</p>
                  </div>
                </button>

                <button
                  onClick={logout}
                  className="p-2 rounded-xl bg-slate-800/80 hover:bg-red-500/20 hover:text-red-400 text-slate-400 transition-colors border border-slate-700"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Mobile Hamburger Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white border border-slate-700"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>

        </div>
      </div>

      {/* Mobile / Tablet Collapsible Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-950/98 backdrop-blur-2xl border-b border-slate-800 px-4 py-4 space-y-4 animate-fadeIn">
          <div className="space-y-1">
            <button
              onClick={() => handleTabClick('home')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-left transition-colors ${
                activeTab === 'home'
                  ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                  : 'text-slate-300 hover:bg-slate-900'
              }`}
            >
              <Home className="w-4 h-4 text-teal-400" />
              <span>
                {isAuthenticated && user?.role
                  ? `${user.role.replace('_', ' ').toUpperCase()} WORKSPACE`
                  : (t('home') || 'Services & Workers')}
              </span>
            </button>

            {isAuthenticated && (
              <button
                onClick={() => handleTabClick('account')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-left transition-colors ${
                  activeTab === 'account'
                    ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                    : 'text-slate-300 hover:bg-slate-900'
                }`}
              >
                <User className="w-4 h-4 text-teal-400" />
                <span>{t('accountTab') || 'Account & Settings'}</span>
              </button>
            )}
          </div>

          <div className="pt-2 flex items-center justify-between text-xs text-slate-400">
            <button
              onClick={openLanguageModal}
              className="flex items-center gap-1.5 text-teal-400 font-bold"
            >
              <Globe className="w-4 h-4" />
              <span>{t('changeLanguage')} ({lang.toUpperCase()})</span>
            </button>
          </div>
        </div>
      )}

    </header>
  );
};
