import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { ServiceCatalog } from './ServiceCatalog';
import { WorkerList } from './WorkerList';
import { InteractiveMap } from '../Map/InteractiveMap';
import { AiSahayakModal } from '../AI/AiSahayakModal';
import { SurakshaKavachModal } from './SurakshaKavachModal';
import { Search, MapPin, ShieldCheck, HeartHandshake, AlertTriangle, Navigation, X, Sparkles, Mic, ShieldAlert } from 'lucide-react';
import { translateCategory, translateWorkerName } from '../../utils/translateHelpers';

export const CustomerDashboard = () => {
  const {
    detectUserLocation,
    isLocating,
    searchQuery,
    setSearchQuery,
    radiusKm,
    setRadiusKm,
    setEmergencyModalOpen,
    bookings,
    setSelectedBooking,
    setInvoiceModalOpen,
    setPaymentModalOpen
  } = useApp();

  const { t, lang } = useLanguage();
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isSurakshaOpen, setIsSurakshaOpen] = useState(false);

  return (
    <div className="space-y-4">
      
      {/* Hero Welcome Banner - Compact for mobile */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white rounded-2xl p-4 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        
        <div className="relative z-10 space-y-2.5">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsSurakshaOpen(true)}
              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-[10px] font-bold border border-emerald-500/30 transition-all cursor-pointer active:scale-95"
            >
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>₹25,000 Suraksha Kavach Active →</span>
            </button>

            <span className="text-[10px] font-black text-amber-300 bg-amber-500/20 border border-amber-400/30 px-2 py-0.5 rounded-full">
              SIH26089 Active
            </span>
          </div>

          <h1 className="text-xl font-extrabold tracking-tight leading-tight">
            {t('heroTitle')}
          </h1>
          <p className="text-[11px] text-slate-300 font-normal leading-snug">
            {t('heroDesc')}
          </p>

          {/* Quick Search & AI Voice Controls */}
          <div className="pt-1 space-y-2">
            
            {/* Sahakar AI Sahayak Voice Trigger Button */}
            <button
              onClick={() => setIsAiModalOpen(true)}
              className="w-full px-3 py-2 rounded-xl bg-gradient-to-r from-teal-500/30 via-emerald-500/20 to-teal-500/30 hover:from-teal-500/40 hover:to-teal-500/40 border border-teal-400/40 text-white flex items-center justify-between shadow-lg transition-all group active:scale-[0.98]"
            >
              <div className="flex items-center gap-2">
                <span className="p-1 rounded-lg bg-teal-400 text-slate-950">
                  <Sparkles className="w-3.5 h-3.5" />
                </span>
                <div className="text-left">
                  <p className="text-[11px] font-black text-teal-200 group-hover:text-white leading-tight">
                    Sahakar AI Sahayak (Voice & Text)
                  </p>
                  <p className="text-[9px] text-slate-300 font-medium leading-none">
                    Instant Problem Diagnosis • Transparent Fair-Cost Matrix
                  </p>
                </div>
              </div>

              <div className="p-1 rounded-full bg-white/10 group-hover:bg-white/20 text-teal-300">
                <Mic className="w-3.5 h-3.5" />
              </div>
            </button>

            {/* Standard Search Input with Auto-Filter & Clear */}
            <div className="relative w-full">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('searchPlaceholder')}
                className="w-full pl-9 pr-9 py-2.5 rounded-xl bg-white text-slate-900 placeholder:text-slate-400 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-teal-400 shadow-md"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 p-0.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors"
                  title="Clear search"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Radius Selector & GPS Locate Button */}
            <div className="flex items-center justify-between gap-2 bg-white/10 backdrop-blur-md px-3 py-2 rounded-xl border border-white/20 text-xs text-white">
              <div className="flex items-center gap-1.5 min-w-0">
                <MapPin className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                <span className="font-semibold text-slate-200 text-[11px] shrink-0">{t('radiusLabel')}</span>
                <select
                  value={radiusKm}
                  onChange={(e) => setRadiusKm(Number(e.target.value))}
                  className="bg-transparent focus:outline-none text-xs font-bold text-teal-300 cursor-pointer ml-1"
                >
                  <option value={2} className="text-slate-900">2 km</option>
                  <option value={5} className="text-slate-900">5 km</option>
                  <option value={10} className="text-slate-900">10 km</option>
                  <option value={20} className="text-slate-900">20 km</option>
                  <option value={50} className="text-slate-900">50 km</option>
                  <option value={100} className="text-slate-900">100 km</option>
                </select>
              </div>

              <button
                onClick={detectUserLocation}
                disabled={isLocating}
                className={`px-2.5 py-1 rounded-lg bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 font-bold text-[10px] border border-teal-500/40 flex items-center gap-1 transition-all shrink-0 active:scale-95 ${
                  isLocating ? 'animate-pulse text-amber-300 border-amber-500/50' : ''
                }`}
              >
                <Navigation className="w-3 h-3" />
                <span>{isLocating ? 'Locating...' : 'GPS Live'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* AI Sahayak Modal Dialog */}
      <AiSahayakModal isOpen={isAiModalOpen} onClose={() => setIsAiModalOpen(false)} />

      {/* Suraksha Kavach Modal Dialog */}
      <SurakshaKavachModal isOpen={isSurakshaOpen} onClose={() => setIsSurakshaOpen(false)} />

      {/* Active Bookings Status */}
      {bookings.length > 0 && (
        <div className="bg-white rounded-2xl border border-teal-200 p-3.5 shadow-sm space-y-2.5">
          <h4 className="font-extrabold text-xs text-slate-900 flex items-center gap-2">
            <HeartHandshake className="w-4 h-4 text-teal-600" />
            <span>{t('activeBookingsTitle')} ({bookings.length})</span>
          </h4>

          <div className="space-y-2">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 truncate">{translateCategory(booking.category, t)}</span>
                    <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold shrink-0 ${
                      booking.status?.includes('Paid') ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {booking.status?.includes('Paid') ? t('statusPaid') : t('statusPending')}
                    </span>
                  </div>
                  <p className="text-slate-500 text-[10px] mt-0.5 truncate">
                    {translateWorkerName(booking.workerName, lang)} • ₹{booking.totalAmount || 0}
                  </p>
                </div>

                {booking.status?.includes('Paid') ? (
                  <button
                    onClick={() => {
                      setSelectedBooking(booking);
                      setInvoiceModalOpen(true);
                    }}
                    className="px-2.5 py-1.5 bg-teal-600 text-white rounded-lg font-bold text-[10px] active:bg-teal-700 transition-colors shrink-0 ml-2"
                  >
                    {t('viewInvoice')}
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setSelectedBooking(booking);
                      setPaymentModalOpen(true);
                    }}
                    className="px-2.5 py-1.5 bg-emerald-600 text-white rounded-lg font-bold text-[10px] active:bg-emerald-700 transition-colors shrink-0 ml-2"
                  >
                    {t('payNow')}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Service Categories */}
      <ServiceCatalog />

      {/* Worker Cards */}
      <WorkerList />

      {/* Map */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-teal-600" />
            <span>{t('geoMapTitle')}</span>
          </h3>
          <span className="text-[9px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full">
            {t('postgisReady')}
          </span>
        </div>

        <InteractiveMap height="280px" />

        {/* Emergency Quick Trigger Banner */}
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center justify-between">
          <div className="min-w-0 flex-1">
            <h4 className="font-bold text-[11px] text-red-900">{t('needUrgentFix')}</h4>
            <p className="text-[10px] text-red-700">{t('dispatchIn15Mins')}</p>
          </div>
          <button
            onClick={() => setEmergencyModalOpen(true)}
            className="px-3 py-2 bg-red-600 active:bg-red-700 text-white font-bold text-[10px] rounded-xl shadow transition-colors shrink-0 ml-2 flex items-center gap-1"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{t('emergencySOS')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
