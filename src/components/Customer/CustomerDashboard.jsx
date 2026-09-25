import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { ServiceCatalog } from './ServiceCatalog';
import { WorkerList } from './WorkerList';
import { InteractiveMap } from '../Map/InteractiveMap';
import { AiSahayakModal } from '../AI/AiSahayakModal';
import { SurakshaKavachModal } from './SurakshaKavachModal';
import { 
  Search, MapPin, HeartHandshake, AlertTriangle, Navigation, 
  X, Sparkles, Mic, ShieldCheck, ArrowRight, CheckCircle2 
} from 'lucide-react';
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
    <div className="space-y-6 font-sans">
      
      {/* 1. TOP WEB SEARCH & FILTERS BANNER */}
      <div className="bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden border border-slate-800">
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        
        <div className="relative z-10 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold border border-teal-500/30 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                <span>{t('searchLocalServices')}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
                {t('heroTitle')}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mt-1 max-w-xl">
                {t('searchLocalDesc')}
              </p>
            </div>

            {/* Quick AI Sahayak Trigger in Header */}
            <button
              onClick={() => setIsAiModalOpen(true)}
              className="self-start md:self-auto px-4 py-3 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-black text-xs rounded-2xl shadow-lg shadow-teal-500/20 transition-all flex items-center gap-2 active:scale-95 shrink-0"
            >
              <Mic className="w-4 h-4" />
              <span>{t('aiSahayakDiagnose')}</span>
            </button>
          </div>

          {/* Search + Radius + GPS Controls Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-2">
            
            {/* Search Input (8 cols) */}
            <div className="md:col-span-8 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('searchPlaceholder')}
                className="w-full pl-11 pr-10 py-3.5 rounded-2xl bg-white text-slate-900 placeholder:text-slate-400 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-400 shadow-md"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Radius Selector (2 cols) */}
            <div className="md:col-span-2 flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-3 rounded-2xl border border-white/20 text-white text-xs">
              <MapPin className="w-4 h-4 text-teal-400 shrink-0" />
              <div className="min-w-0 flex-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">{t('radius')}</span>
                <select
                  value={radiusKm}
                  onChange={(e) => setRadiusKm(Number(e.target.value))}
                  className="bg-transparent focus:outline-none text-xs font-black text-teal-300 cursor-pointer w-full"
                >
                  <option value={2} className="text-slate-900">2 km</option>
                  <option value={5} className="text-slate-900">5 km</option>
                  <option value={10} className="text-slate-900">10 km</option>
                  <option value={20} className="text-slate-900">20 km</option>
                  <option value={50} className="text-slate-900">50 km</option>
                  <option value={100} className="text-slate-900">100 km</option>
                </select>
              </div>
            </div>

            {/* GPS Live Button (2 cols) */}
            <div className="md:col-span-2">
              <button
                onClick={detectUserLocation}
                disabled={isLocating}
                className={`w-full h-full py-3 px-3 rounded-2xl bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 font-extrabold text-xs border border-teal-500/40 flex items-center justify-center gap-2 transition-all active:scale-95 ${
                  isLocating ? 'animate-pulse text-amber-300 border-amber-500/50' : ''
                }`}
              >
                <Navigation className="w-4 h-4" />
                <span>{isLocating ? (t('locatingGps') || 'Locating...') : (t('liveLocationReady') || 'GPS Live')}</span>
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* 2. ACTIVE BOOKINGS BANNER (IF ANY) */}
      {bookings.length > 0 && (
        <div className="bg-white rounded-3xl border border-teal-200 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <HeartHandshake className="w-5 h-5 text-teal-600" />
              <span>{t('activeBookingsTitle') || 'Active Service Bookings'} ({bookings.length})</span>
            </h4>
            <span className="text-xs text-slate-500">Live Escrow Protected</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-slate-900 text-sm truncate">{translateCategory(booking.category, t)}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                      booking.status?.includes('Paid') ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {booking.status?.includes('Paid') ? t('statusPaid') || 'Paid' : t('statusPending') || 'Pending'}
                    </span>
                  </div>
                  <p className="text-slate-600 text-xs mt-1">
                    Worker: <strong>{translateWorkerName(booking.workerName, lang)}</strong>
                  </p>
                  <p className="text-slate-500 text-xs">
                    Total: <strong className="text-slate-900">₹{booking.totalAmount || 0}</strong>
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-end gap-2">
                  {booking.status?.includes('Paid') ? (
                    <button
                      onClick={() => {
                        setSelectedBooking(booking);
                        setInvoiceModalOpen(true);
                      }}
                      className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold text-xs shadow-sm transition-colors"
                    >
                      {t('viewInvoice') || 'View Receipt'}
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setSelectedBooking(booking);
                        setPaymentModalOpen(true);
                      }}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-sm transition-colors"
                    >
                      {t('payNow') || 'Release Payment'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. MAIN WEB WORKSPACE: 2-COLUMN SPLIT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Categories + Worker Directory (8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Service Categories Catalog */}
          <section className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm">
            <ServiceCatalog />
          </section>

          {/* Worker Cards Directory */}
          <section className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm">
            <WorkerList />
          </section>

        </div>

        {/* Right Column: Sticky Sidebar (4 cols) */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
          
          {/* Live Interactive Map Card */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-teal-600" />
                <span>{t('geoMapTitle') || 'Real-time GPS Worker Radar'}</span>
              </h3>
              <span className="text-[10px] font-bold bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full border border-teal-200">
                Live
              </span>
            </div>

            <InteractiveMap height="320px" />

            <p className="text-[11px] text-slate-500 leading-tight">
              Showing active on-duty cooperative workers within your current {radiusKm} km search radius.
            </p>
          </div>

          {/* Emergency SOS Rapid Dispatch Card */}
          <div className="bg-gradient-to-br from-rose-50 to-red-50 border border-red-200 rounded-3xl p-5 shadow-sm space-y-3">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-2xl bg-red-600 text-white shadow-md">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-red-950">{t('needUrgentFix') || 'Need an Urgent Fix?'}</h4>
                <p className="text-xs text-red-800 mt-0.5">{t('dispatchIn15Mins') || '15-Minute Emergency Rapid Dispatch'}</p>
              </div>
            </div>

            <p className="text-xs text-red-700 leading-relaxed font-medium">
              Burst pipes, electrical hazards, gas leaks, or emergency lockouts. Pre-vetted emergency technicians dispatched immediately.
            </p>

            <button
              onClick={() => setEmergencyModalOpen(true)}
              className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-2xl shadow-lg shadow-red-600/30 transition-all flex items-center justify-center gap-2 sos-pulse-btn active:scale-95"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>{t('emergencySOS') || 'Trigger Emergency SOS Dispatch'}</span>
            </button>
          </div>

          {/* Service Guarantee Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-teal-50 text-teal-600 border border-teal-200">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-slate-900">Verified Service Guarantee</h4>
                <p className="text-xs text-slate-500">Photo Proof & Escrow Release</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Your payment is held securely until you review and approve the worker's completion photo. Direct hourly rates with zero hidden charges.
            </p>
          </div>

        </div>

      </div>

      {/* AI Sahayak Modal Dialog */}
      <AiSahayakModal isOpen={isAiModalOpen} onClose={() => setIsAiModalOpen(false)} />

      {/* Suraksha Kavach Modal Dialog */}
      <SurakshaKavachModal isOpen={isSurakshaOpen} onClose={() => setIsSurakshaOpen(false)} />

    </div>
  );
};
