import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Home, Calendar, AlertTriangle, User, Lock, ShieldCheck, 
  Globe, Sparkles, MapPin, HardHat, Building2, ChevronDown, 
  Menu, X, LogOut, CheckCircle2, PhoneCall, Award
} from 'lucide-react';
import { translateRole } from '../../utils/translateHelpers';

export const WebNavbar = ({ activeTab, setActiveTab }) => {
  const { 
    bookings, 
    setEmergencyModalOpen, 
    currentRole, 
    setCurrentRole 
  } = useApp();
  const { isAuthenticated, user, openAuthModal, logout } = useAuth();
  const { t, lang, openLanguageModal } = useLanguage();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const pendingBookingsCount = bookings.filter(b => b.status !== 'Confirmed & Paid').length;

  const rolesList = [
    { id: 'customer', label: t('roleCustomer') || 'Customer Portal', icon: User, color: 'text-emerald-500' },
    { id: 'worker', label: t('roleWorker') || 'Worker Portal', icon: HardHat, color: 'text-amber-500' },
    { id: 'society_admin', label: t('roleSocietyAdmin') || 'Society Admin', icon: Building2, color: 'text-blue-500' },
    { id: 'federation_admin', label: t('roleFederationAdmin') || 'Federation Admin', icon: Building2, color: 'text-indigo-500' },
    { id: 'super_admin', label: t('roleSuperAdmin') || 'Super Admin', icon: ShieldCheck, color: 'text-purple-500' }
  ];

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  const handleRoleSelect = (roleId) => {
    setCurrentRole(roleId);
    setRoleDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  const activeRole = user?.role || currentRole;

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
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-teal-400 via-emerald-500 to-teal-600 flex items-center justify-center text-slate-950 font-black text-xl shadow-lg shadow-teal-500/25 group-hover:scale-105 transition-transform shrink-0">
              🤝
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight text-white leading-none">
                  Sahakar<span className="text-teal-400">Seva</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium tracking-wide">
                Home Services & Local Craftsmen
              </p>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            
            <button
              onClick={() => handleTabClick('home')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'home'
                  ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>{t('home') || 'Services & Workers'}</span>
            </button>

            <button
              onClick={() => {
                if (!isAuthenticated) {
                  openAuthModal('login');
                } else {
                  handleTabClick('bookings');
                }
              }}
              className={`relative px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'bookings'
                  ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>{t('bookingsTab') || 'Bookings'}</span>
              {pendingBookingsCount > 0 && (
                <span className="ml-1 px-1.5 py-0.5 rounded-full bg-red-500 text-white font-black text-[10px] shadow">
                  {pendingBookingsCount}
                </span>
              )}
            </button>

            {/* Role Portal Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="px-3 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800/60 transition-all flex items-center gap-1.5"
              >
                <span>View Portals</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {roleDropdownOpen && (
                <div className="absolute left-0 mt-2 w-56 bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-2 z-50 animate-fadeIn">
                  <div className="text-[10px] font-black uppercase text-slate-400 px-3 py-1.5 tracking-wider">
                    Select Role Dashboard
                  </div>
                  {rolesList.map((r) => {
                    const Icon = r.icon;
                    const isActive = activeRole === r.id;
                    return (
                      <button
                        key={r.id}
                        onClick={() => handleRoleSelect(r.id)}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-left transition-colors ${
                          isActive
                            ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${r.color}`} />
                        <span className="flex-1">{r.label}</span>
                        {isActive && <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

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

            {/* Emergency SOS Dispatch 15M */}
            <button
              onClick={() => setEmergencyModalOpen(true)}
              className="px-3 sm:px-4 py-2 bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-500 hover:to-rose-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-red-600/30 transition-all flex items-center gap-1.5 shrink-0 sos-pulse-btn active:scale-95"
              title="15-Minute Emergency SOS Dispatch"
            >
              <AlertTriangle className="w-4 h-4" />
              <span className="hidden sm:inline">Emergency SOS</span>
              <span className="sm:hidden">SOS</span>
            </button>

            {/* User Profile / Auth Button */}
            {!isAuthenticated ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openAuthModal('login')}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 transition-all flex items-center gap-1.5"
                >
                  <Lock className="w-3.5 h-3.5 text-slate-300" />
                  <span>{t('signIn') || 'Sign In'}</span>
                </button>
                <button
                  onClick={() => openAuthModal('register_customer')}
                  className="hidden md:flex px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow-md shadow-teal-500/20 transition-all items-center gap-1.5"
                >
                  <span>{t('getStarted') || 'Register'}</span>
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
              <span>{t('home') || 'Services & Workers'}</span>
            </button>

            <button
              onClick={() => {
                if (!isAuthenticated) {
                  openAuthModal('login');
                } else {
                  handleTabClick('bookings');
                }
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-left transition-colors ${
                activeTab === 'bookings'
                  ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                  : 'text-slate-300 hover:bg-slate-900'
              }`}
            >
              <Calendar className="w-4 h-4 text-teal-400" />
              <span className="flex-1">{t('bookingsTab') || 'Bookings'}</span>
              {pendingBookingsCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-red-500 text-white font-black text-[10px]">
                  {pendingBookingsCount}
                </span>
              )}
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

          {/* Role Dashboards in Mobile Drawer */}
          <div className="pt-3 border-t border-slate-800">
            <p className="text-[11px] font-black uppercase text-slate-400 px-1 mb-2 tracking-wider">
              Role Portals
            </p>
            <div className="grid grid-cols-2 gap-2">
              {rolesList.map((r) => {
                const Icon = r.icon;
                const isActive = activeRole === r.id;
                return (
                  <button
                    key={r.id}
                    onClick={() => handleRoleSelect(r.id)}
                    className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-bold transition-all text-left ${
                      isActive
                        ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                        : 'bg-slate-900 text-slate-300 border border-slate-800'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${r.color} shrink-0`} />
                    <span className="truncate">{r.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between text-xs text-slate-400">
            <button
              onClick={openLanguageModal}
              className="flex items-center gap-1.5 text-teal-400 font-bold"
            >
              <Globe className="w-4 h-4" />
              <span>Change Language ({lang.toUpperCase()})</span>
            </button>
          </div>
        </div>
      )}

    </header>
  );
};
