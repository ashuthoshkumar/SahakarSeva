import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { 
  HardHat, ShieldCheck, HeartHandshake, DollarSign, Award, 
  ToggleLeft, ToggleRight, CheckCircle2, Clock, MapPin, 
  Phone, Camera, Upload, ImageIcon, AlertCircle, Wrench, 
  Star, ChevronRight, UserCheck, Sparkles, TrendingUp,
  Volume2, VolumeX, MessageSquare, Globe, ShieldAlert, Radio,
  PackagePlus, BookOpen, CreditCard, AlertOctagon, Users
} from 'lucide-react';
import { translateNcctLevel, translateCategory } from '../../utils/translateHelpers';
import { compressImage } from '../../utils/imageCompressor';
import { WelfarePassbookModal } from './WelfarePassbookModal';
import { NcctAcademyModal } from './NcctAcademyModal';
import { MaterialCreditModal } from './MaterialCreditModal';
import { SurakshaBandhuModal } from './SurakshaBandhuModal';
import { SahakarToolDepotModal } from './SahakarToolDepotModal';
import { SamuhikTendersModal } from './SamuhikTendersModal';
import { WorkerNavigationMap } from './WorkerNavigationMap';
import { CrossLanguageChatModal } from '../Common/CrossLanguageChatModal';
import { SahakariSabhaModal } from '../Common/SahakariSabhaModal';
import { NyayaPramaanModal } from '../Common/NyayaPramaanModal';
import { bhashiniSpeakText, bhashiniStopSpeaking } from '../../services/bhashiniService';

export const WorkerDashboard = () => {
  const { workerDutyStatus, toggleWorkerDuty, bookings, addNotification, acceptBooking, uploadCompletionPhoto, userCoords } = useApp();
  const { user } = useAuth();
  const { t, lang } = useLanguage();

  // Derive baseline stats synchronously to guarantee instant zero-flash render
  const getDerivedStats = () => {
    const myBookings = (bookings || []).filter(b => b.workerName === user?.name || b.workerId === user?.id);
    const paidBookings = myBookings.filter(b => b.status && b.status.includes('Paid'));
    const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0);
    const todayBookings = paidBookings.filter(b => b.paidAt && new Date(b.paidAt) >= todayStart);

    return {
      name: user?.name || 'Worker',
      category: user?.category || 'electrician',
      phone: user?.phone || '',
      societyName: user?.societyName || 'Delhi NCR Shramik Sahakari Samiti Ltd.',
      ncctLevel: user?.ncctLevel || 'Level 3 Master Craftsman',
      aadhaarNo: user?.aadhaarNo || '',
      photo: user?.photo || null,
      todayEarnings: todayBookings.reduce((sum, b) => sum + (b.baseWage || 0), 0),
      monthlyEarnings: paidBookings.reduce((sum, b) => sum + (b.baseWage || 0), 0),
      welfareFundBalance: 1250 + paidBookings.reduce((sum, b) => sum + (b.welfareContribution || 0), 0),
      rating: user?.rating || 4.9,
      jobsCompleted: Math.max(user?.jobsCompleted || 0, paidBookings.length),
      workerId: user?.id || 'wk_local'
    };
  };

  const [workerStats, setWorkerStats] = useState(getDerivedStats);
  const [isPassbookOpen, setIsPassbookOpen] = useState(false);
  const [isAcademyOpen, setIsAcademyOpen] = useState(false);
  const [isMaterialCreditOpen, setIsMaterialCreditOpen] = useState(false);
  const [isSosOpen, setIsSosOpen] = useState(false);
  const [isToolDepotOpen, setIsToolDepotOpen] = useState(false);
  const [isTendersOpen, setIsTendersOpen] = useState(false);
  const [selectedJobForSos, setSelectedJobForSos] = useState(null);
  const [activeSosData, setActiveSosData] = useState(null);
  const [chatBooking, setChatBooking] = useState(null);
  const [activeAudioBookingId, setActiveAudioBookingId] = useState(null);
  const [isSabhaOpen, setIsSabhaOpen] = useState(false);
  const [isNyayaOpen, setIsNyayaOpen] = useState(false);
  const fileInputRefs = useRef({});

  // Monitor active SOS status
  useEffect(() => {
    const checkSos = () => {
      try {
        const saved = localStorage.getItem('sahakar_active_sos');
        if (saved) {
          const parsed = JSON.parse(saved);
          setActiveSosData(parsed.active ? parsed : null);
        } else {
          setActiveSosData(null);
        }
      } catch (e) {}
    };
    checkSos();
    const timer = setInterval(checkSos, 2500);
    return () => clearInterval(timer);
  }, []);

  // Cleanup speech synthesis on unmount
  useEffect(() => {
    return () => {
      bhashiniStopSpeaking();
    };
  }, []);

  const handleSpeakJob = (booking, isOffer = false) => {
    if (activeAudioBookingId === booking.id) {
      bhashiniStopSpeaking();
      setActiveAudioBookingId(null);
      return;
    }

    const categoryName = translateCategory(booking.category, t);
    const customer = booking.customerName || (lang === 'hi' ? 'ग्राहक' : 'Customer');
    const address = booking.address || (lang === 'hi' ? 'स्थानीय पता' : 'Customer address');
    const wage = booking.baseWage || booking.totalAmount || 0;

    const speechText = lang === 'hi'
      ? (isOffer
          ? `नया काम: ${categoryName} सेवा। ग्राहक ${customer}। स्थान: ${address}। तय मजदूरी: ${wage} रुपये। काम स्वीकार करने के लिए नीचे हरा बटन दबाएं।`
          : `चालू काम: ग्राहक ${customer}। सेवा: ${categoryName}। पता: ${address}। तय मजदूरी: ${wage} रुपये। काम पूरा होने पर फोटो अपलोड करें।`)
      : (isOffer
          ? `New job request: ${booking.category} for ${customer} at ${address}. Guaranteed wage ${wage} rupees. Tap the green button below to accept dispatch.`
          : `Active job: Customer ${customer}. Service: ${booking.category}. Address: ${address}. Guaranteed wage ${wage} rupees. Upload completion photo when finished.`);

    setActiveAudioBookingId(booking.id);
    bhashiniSpeakText(speechText, lang || 'hi', () => {
      setActiveAudioBookingId(null);
    });
  };

  // Silently refresh worker stats in the background without unmounting or blocking the UI
  useEffect(() => {
    let isMounted = true;
    const refreshStats = async () => {
      // 1. Try server API
      try {
        const res = await fetch(`/api/worker/my-stats?userId=${user?.id || ''}`);
        if (res.ok) {
          const contentType = res.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const data = await res.json();
            if (data.success && isMounted) {
              setWorkerStats(prev => ({ ...prev, ...data }));
              return;
            }
          }
        }
      } catch (err) {
        try {
          const res = await fetch(`http://localhost:5050/api/worker/my-stats?userId=${user?.id || ''}`);
          if (res.ok) {
            const data = await res.json();
            if (data.success && isMounted) {
              setWorkerStats(prev => ({ ...prev, ...data }));
              return;
            }
          }
        } catch (e) {}
      }

      // 2. Fallback to derived stats from active bookings
      if (isMounted) {
        setWorkerStats(getDerivedStats());
      }
    };

    refreshStats();
    return () => { isMounted = false; };
  }, [user, bookings]);

  // Filter bookings for this worker:
  // Strictly show ONLY accepted bookings in the worker section active jobs list as requested
  const allMyBookings = bookings.filter(b => b.workerName === workerStats?.name || b.workerId === user?.id);
  const acceptedBookings = allMyBookings.filter(b => b.status === 'Accepted' || b.status?.includes('Work Completed') || b.status?.includes('Approved') || b.status?.includes('Paid') || b.status?.includes('Redo'));
  const pendingOffers = allMyBookings.filter(b => b.status === 'Pending');

  // Handle photo upload from camera
  const handlePhotoUpload = async (bookingId, event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      addNotification('Optimizing and uploading proof photo...', 'info');
      const compressedDataUrl = await compressImage(file, 1024, 1024, 0.75);
      uploadCompletionPhoto(bookingId, compressedDataUrl);
    } catch (err) {
      console.error('Failed to process photo:', err);
      addNotification('Failed to process photo. Please try again.', 'error');
    } finally {
      if (event.target) event.target.value = '';
    }
  };

  const getStatusBadge = (status) => {
    if (status?.includes('Paid')) return { bg: 'bg-emerald-100 text-emerald-800 border-emerald-300', label: '✓ Paid & Confirmed' };
    if (status?.includes('Approved')) return { bg: 'bg-blue-100 text-blue-800 border-blue-300', label: '✓ Approved by Customer' };
    if (status?.includes('Awaiting Approval')) return { bg: 'bg-purple-100 text-purple-800 border-purple-300', label: '📸 Photo Uploaded (Reviewing)' };
    if (status?.includes('Redo')) return { bg: 'bg-red-100 text-red-800 border-red-300', label: '🔄 Redo Requested' };
    if (status === 'Accepted') return { bg: 'bg-teal-100 text-teal-800 border-teal-300', label: '✓ Job Accepted' };
    return { bg: 'bg-amber-100 text-amber-800 border-amber-300', label: '⏳ Pending Confirmation' };
  };

  return (
    <div className="space-y-8 font-sans">
      
      {/* 1. TOP WORKER DESKTOP HERO & PROFILE BAR */}
      <div className="bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          {/* Worker Info */}
          <div className="flex items-center gap-4">
            <div className="relative shrink-0">
              {workerStats?.photo ? (
                <img
                  src={workerStats.photo}
                  alt={workerStats.name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-teal-400 shadow-lg"
                />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-teal-400 text-slate-950 font-black text-2xl flex items-center justify-center shadow-lg shadow-teal-500/30">
                  {workerStats?.name ? workerStats.name.substring(0, 2).toUpperCase() : 'WK'}
                </div>
              )}
              <span className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-slate-950 shadow ${workerDutyStatus ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`}></span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">{workerStats?.name}</h1>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Aadhaar KYC</span>
                </span>
              </div>
              <p className="text-xs sm:text-sm text-teal-300 font-medium capitalize">
                {workerStats?.category} Specialist • {translateNcctLevel(workerStats?.ncctLevel, lang)}
              </p>
              <p className="text-xs text-slate-400 font-medium">
                Affiliation: <span className="text-slate-200">{workerStats?.societyName}</span> • Phone: <span className="text-slate-200">{workerStats?.phone}</span>
              </p>
            </div>
          </div>

          {/* Action Hub: SOS Emergency, Tool Depot & Duty Toggle */}
          <div className="flex flex-wrap items-center gap-3 self-start md:self-auto">
            
            {/* Suraksha Bandhu SOS Button */}
            <button
              onClick={() => {
                setSelectedJobForSos(null);
                setIsSosOpen(true);
              }}
              className={`px-4 py-3 rounded-2xl font-black text-xs flex items-center gap-2.5 shadow-lg transition-all active:scale-95 cursor-pointer ${
                activeSosData?.active
                  ? 'bg-rose-600 text-white animate-pulse ring-4 ring-rose-500/40'
                  : 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-rose-900/30'
              }`}
            >
              <ShieldAlert className="w-5 h-5 text-white animate-bounce shrink-0" />
              <div className="text-left">
                <span className="block text-[9px] uppercase font-bold text-red-100 tracking-wider">SIH26089 Peer SOS</span>
                <span className="text-xs font-black tracking-tight">{activeSosData?.active ? '🚨 SOS ACTIVE' : '🚨 SURAKSHA BANDHU'}</span>
              </div>
            </button>

            {/* Sahakar Upkaran Bank (PACS Tool Depot) */}
            <button
              onClick={() => setIsToolDepotOpen(true)}
              className="px-4 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center gap-2.5 shadow-lg shadow-emerald-950/30 transition-all active:scale-95 cursor-pointer"
            >
              <Wrench className="w-5 h-5 text-emerald-200 shrink-0" />
              <div className="text-left">
                <span className="block text-[9px] uppercase font-bold text-emerald-100 tracking-wider">PACS Equipment</span>
                <span className="text-xs font-black tracking-tight">सहकार उपकरण बैंक</span>
              </div>
            </button>

            {/* Duty Status Toggle */}
            <div className="flex items-center gap-3 bg-slate-800/80 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-slate-700">
              <div>
                <span className="text-[9px] uppercase font-bold text-slate-400 block">Duty Status</span>
                <span className={`text-xs font-black ${workerDutyStatus ? 'text-emerald-400' : 'text-slate-400'}`}>
                  {workerDutyStatus ? '🟢 ON DUTY' : '⚪ OFF DUTY'}
                </span>
              </div>

              <button
                onClick={() => toggleWorkerDuty(workerStats?.workerId)}
                className={`p-1.5 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer ${
                  workerDutyStatus 
                    ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950' 
                    : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                }`}
                title="Toggle Online / Offline Status"
              >
                {workerDutyStatus ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
              </button>
            </div>

          </div>

        </div>
      </div>

      {/* 2. FOUR KPI FINANCIAL METRIC CARDS (DESKTOP GRID) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">{t('todaysPayout') || "Today's Payout"}</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">₹{workerStats?.todayEarnings || 0}</p>
          <p className="text-[11px] text-emerald-600 font-bold">100% Direct Payout (0% Cut)</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">{t('monthlyIncome') || 'Monthly Earnings'}</span>
            <div className="p-2 rounded-xl bg-teal-50 text-teal-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">₹{workerStats?.monthlyEarnings || 0}</p>
          <p className="text-[11px] text-slate-500 font-medium">Accumulated this month</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider truncate">{t('coopWelfareSavings') || 'Welfare Fund (PF)'}</span>
            <div className="p-2 rounded-xl bg-orange-50 text-orange-600">
              <HeartHandshake className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">₹{workerStats?.welfareFundBalance || 0}</p>
          <p className="text-[11px] text-orange-600 font-bold">Health & Pension Ledger</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Completed Jobs & Rating</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Star className="w-4 h-4 fill-amber-500" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">{workerStats?.jobsCompleted} Jobs</p>
          <p className="text-[11px] text-amber-700 font-bold">⭐ {workerStats?.rating || 5.0} Rating Average</p>
        </div>

      </div>

      {/* 3. MAIN WORKSPACE: JOB DISPATCHES & BOOKINGS */}
      <div className="w-full space-y-6">
          
          {/* Incoming Dispatch Offers (Pending Acceptance) */}
          {pendingOffers.length > 0 && (
            <div className="space-y-3">
              {pendingOffers.map((b) => (
                <div
                  key={b.id}
                  className="p-5 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-3xl shadow-sm space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500 text-slate-950 font-black text-xs shadow-sm">
                      ⚡ NEW JOB DISPATCH OFFER
                    </span>
                    <span className="text-base font-black text-emerald-800">₹{b.baseWage || b.totalAmount || 0}</span>
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm">
                      {b.customerName || 'Customer'} requested {translateCategory(b.category, t)}
                    </h4>
                    <p className="text-xs text-slate-600 flex items-center gap-1.5 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                      <span>{b.address || 'Doorstep Location'}</span>
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Scheduled: {b.scheduledTime || 'Immediate'}</p>
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => handleSpeakJob(b, true)}
                      className={`px-3.5 py-2.5 rounded-2xl font-black text-xs flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer ${
                        activeAudioBookingId === b.id
                          ? 'bg-rose-600 text-white shadow-rose-600/30 animate-pulse border border-rose-700'
                          : 'bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 shadow-amber-400/30 border border-amber-500'
                      }`}
                      title="Speakout job summary"
                    >
                      {activeAudioBookingId === b.id ? (
                        <VolumeX className="w-4 h-4 text-white" />
                      ) : (
                        <Volume2 className="w-4 h-4 text-slate-950" />
                      )}
                      <span>
                        {activeAudioBookingId === b.id
                          ? 'Stop'
                          : 'Speakout'}
                      </span>
                    </button>

                    <button
                      onClick={() => acceptBooking(b.id)}
                      className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Accept Dispatch & Open Map</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Active Accepted Job Orders */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-teal-600" />
                  <span>{t('incomingBookingRequests') || 'Accepted Jobs & Dispatches'}</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  View customer address on map, navigate via GPS, and upload verification photo upon completion.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-bold border border-teal-200">
                {acceptedBookings.length} {acceptedBookings.length === 1 ? 'Job' : 'Jobs'}
              </span>
            </div>

            {acceptedBookings.length === 0 ? (
              <div className="p-12 text-center bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <HardHat className="w-10 h-10 text-slate-400 mx-auto" />
                <h4 className="text-sm font-bold text-slate-700">No active accepted jobs right now</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Only accepted bookings and completed jobs appear here. Keep your duty status ON to receive incoming dispatches.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {acceptedBookings.map((b) => {
                  const statusBadge = getStatusBadge(b.status);
                  const canUploadPhoto = b.status === 'Accepted' || b.status === 'Redo Requested';
                  const hasPhoto = Boolean(b.completionPhoto);

                  return (
                    <div
                      key={b.id}
                      className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4 hover:border-teal-300 transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-sm text-slate-900">{b.customerName || 'Customer'}</span>
                            <span className="px-2 py-0.5 rounded-lg bg-teal-100 text-teal-800 text-xs font-bold">
                              {translateCategory(b.category, t)}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{b.address || 'Address provided upon booking'}</span>
                          </p>
                        </div>

                        <div className="text-right">
                          <span className="text-base font-black text-emerald-700">₹{b.baseWage || b.totalAmount || 0}</span>
                          <p className="text-[11px] text-slate-500">Scheduled: {b.scheduledTime || 'Immediate'}</p>
                        </div>
                      </div>

                      {/* Status & Actions Row */}
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className={`px-2.5 py-1 rounded-xl text-xs font-bold border ${statusBadge.bg}`}>
                          {statusBadge.label}
                        </span>

                        <div className="flex items-center gap-2">
                          {/* Speakout Button — Highlighted */}
                          <button
                            type="button"
                            onClick={() => handleSpeakJob(b, false)}
                            className={`inline-flex items-center gap-1.5 text-xs font-black px-3 py-1.5 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer ${
                              activeAudioBookingId === b.id
                                ? 'bg-rose-600 text-white shadow-rose-600/30 animate-pulse border border-rose-700'
                                : 'bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 shadow-amber-400/25 border border-amber-500'
                            }`}
                            title="Speakout job details"
                          >
                            {activeAudioBookingId === b.id ? (
                              <VolumeX className="w-3.5 h-3.5 text-white" />
                            ) : (
                              <Volume2 className="w-3.5 h-3.5 text-slate-950" />
                            )}
                            <span>{activeAudioBookingId === b.id ? 'Stop' : 'Speakout'}</span>
                          </button>

                          {/* Cross-Language Chat */}
                          <button
                            type="button"
                            onClick={() => setChatBooking(b)}
                            className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 shadow-sm transition-all"
                            title="Chat with Customer (Real-Time Translation)"
                          >
                            <MessageSquare className="w-3.5 h-3.5 text-purple-700" />
                            <span>💬 Chat</span>
                          </button>

                          {/* On-Site SOS Emergency Button */}
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedJobForSos(b);
                              setIsSosOpen(true);
                            }}
                            className="inline-flex items-center gap-1 text-[11px] font-black px-2.5 py-1 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 shadow-sm transition-all active:scale-95"
                            title="Trigger Suraksha Bandhu Emergency Alert for this site"
                          >
                            <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                            <span>🚨 Site SOS</span>
                          </button>

                          {b.customerPhone && (
                            <a
                              href={`tel:${b.customerPhone}`}
                              className="inline-flex items-center gap-1 text-[11px] font-bold text-teal-700 hover:text-teal-800 px-2 py-1"
                            >
                              <Phone className="w-3.5 h-3.5" />
                              <span>Call</span>
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Customer Address Location & Live Navigation Map for Accepted Jobs */}
                      {(b.status === 'Accepted' || b.status?.includes('Redo')) && (
                        <div className="mt-4 pt-4 border-t border-slate-200 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                              <MapPin className="w-4 h-4 text-teal-600" />
                              <span>Customer Job Address & Turn-by-Turn Navigation</span>
                            </span>
                            <span className="text-[10px] text-teal-700 font-bold bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                              GPS Navigation Ready
                            </span>
                          </div>
                          <WorkerNavigationMap
                            workerLat={b.workerLat || userCoords[0]}
                            workerLng={b.workerLng || userCoords[1]}
                            customerLat={b.customerLat || (userCoords[0] + 0.008)}
                            customerLng={b.customerLng || (userCoords[1] + 0.008)}
                            customerName={b.customerName}
                            customerAddress={b.address}
                            customerPhone={b.customerPhone}
                            height="260px"
                          />
                        </div>
                      )}

                      {/* Photo Preview if uploaded */}
                      {hasPhoto && (
                        <div className="rounded-2xl overflow-hidden border border-slate-300 relative">
                          <img
                            src={b.completionPhoto}
                            alt="Work Completion Proof"
                            className="w-full h-48 object-cover"
                          />
                          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950/80 to-transparent p-3 text-white text-xs font-bold flex items-center justify-between">
                            <span>📸 Work Completion Photo Verification</span>
                            <span className="text-emerald-400">Ready for Escrow Release</span>
                          </div>
                        </div>
                      )}

                      {/* Action Triggers */}
                      <div className="flex flex-wrap items-center gap-3 pt-1">
                        {canUploadPhoto && (
                          <button
                            onClick={() => fileInputRefs.current[b.id]?.click()}
                            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow transition-colors flex items-center gap-1.5 cursor-pointer"
                          >
                            <Camera className="w-4 h-4" />
                            <span>{hasPhoto ? 'Re-upload Proof Photo' : 'Upload Work Proof Photo'}</span>
                          </button>
                        )}

                        <input
                          ref={(el) => { if (el) fileInputRefs.current[b.id] = el; }}
                          type="file"
                          accept="image/*"
                          capture="environment"
                          className="hidden"
                          onChange={(e) => handlePhotoUpload(b.id, e)}
                        />
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
        </div>

      </div>

      {/* 4. COOPERATIVE WORKER EMPOWERMENT SUITE (8 CORE INNOVATIONS) */}
      <section className="mt-12 pt-8 border-t border-slate-200 space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-black border border-emerald-200 mb-2 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>सहकारी श्रमिक कल्याण एवं अधिकार मंच • ICA Cooperative Member Benefits</span>
            </div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
              Cooperative Empowerment & Member Welfare Hub
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
              Institutional security guaranteed by the Ministry of Cooperation & PACS: Zero commission fees, peer safety SOS, subsidized heavy tool rentals, interest-free credit, certified upskilling, and democratic voting.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-600 bg-slate-100 border border-slate-200 px-3.5 py-2 rounded-2xl shrink-0">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>8 Active Member Programs</span>
          </div>
        </div>

        {/* 8 Feature Cards Grid — 4 Columns on Large Screens */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Suraksha Bandhu Peer SOS */}
          <div className={`p-5 rounded-3xl border shadow-sm flex flex-col justify-between space-y-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${
            activeSosData?.active
              ? 'bg-rose-50 border-rose-400 ring-2 ring-rose-500/20'
              : 'bg-white border-slate-200 hover:border-rose-300'
          }`}>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200 flex items-center gap-1">
                  <Radio className="w-3 h-3 text-rose-600 animate-pulse" />
                  <span>Peer SOS Network</span>
                </span>
                <span className="text-[11px] font-bold text-slate-500">1.5 km Radius</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center shrink-0">
                  <ShieldAlert className="w-5 h-5 text-rose-600" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900 leading-tight">
                    {lang === 'hi' ? 'सुरक्षा बंधु आपातकालीन नेटवर्क' : 'Suraksha Bandhu Safety'}
                  </h4>
                  <span className="text-[11px] text-rose-600 font-bold">Live GPS Telemetry</span>
                </div>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Instant peer protection against on-site harassment, accidents, or distress. Dispatches live telemetry to the 3 nearest cooperative peers.
              </p>
            </div>
            <button
              onClick={() => {
                setSelectedJobForSos(null);
                setIsSosOpen(true);
              }}
              className={`w-full py-2.5 font-black text-xs rounded-xl shadow transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer ${
                activeSosData?.active
                  ? 'bg-rose-600 text-white animate-pulse'
                  : 'bg-rose-600 hover:bg-rose-700 text-white'
              }`}
            >
              <ShieldAlert className="w-4 h-4" />
              <span>{activeSosData?.active ? '🚨 Active SOS Alert' : '🚨 Open Suraksha Bandhu'}</span>
            </button>
          </div>

          {/* Card 2: Sahakar Upkaran Bank (PACS Tool Depot) */}
          <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4 hover:border-emerald-300 hover:-translate-y-1 hover:shadow-md transition-all duration-300">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  PACS Tool Depot
                </span>
                <span className="text-[11px] font-bold text-emerald-600">Save 90% vs Market</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                  <Wrench className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900 leading-tight">
                    {lang === 'hi' ? 'सहकार उपकरण बैंक (PACS)' : 'Sahakar Upkaran Bank'}
                  </h4>
                  <span className="text-[11px] text-emerald-700 font-bold">₹50/day • Zero Deposit</span>
                </div>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Rent heavy core drills, sewer jetters & thermal cameras backed by PACS cooperative societies with zero security deposit.
              </p>
            </div>
            <button
              onClick={() => setIsToolDepotOpen(true)}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
            >
              <Wrench className="w-4 h-4" />
              <span>Browse PACS Depot (₹50/d)</span>
            </button>
          </div>

          {/* Card 3: Samuhik Seva Tenders (Community Bulk Contracts) */}
          <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4 hover:border-cyan-400 hover:-translate-y-1 hover:shadow-md transition-all duration-300">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-cyan-800 bg-cyan-50 px-2.5 py-0.5 rounded-full border border-cyan-200">
                  Bulk RWA Contracts
                </span>
                <span className="text-[11px] font-bold text-cyan-600">0% Subcontractor Cut</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-cyan-50 border border-cyan-100 flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5 text-cyan-700" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900 leading-tight">
                    {lang === 'hi' ? 'सामूहिक सेवा टेंडर (RWA ठेके)' : 'Samuhik Seva Tenders'}
                  </h4>
                  <span className="text-[11px] text-cyan-700 font-bold">Cooperative Squad Bids</span>
                </div>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Form 3–5 artisan squads to bid directly on RWA apartment maintenance contracts with 90% direct fair wage escrow.
              </p>
            </div>
            <button
              onClick={() => setIsTendersOpen(true)}
              className="w-full py-2.5 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-bold text-xs rounded-xl shadow transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
            >
              <Users className="w-4 h-4" />
              <span>{lang === 'hi' ? 'सामूहिक टेंडर देखें' : 'Explore RWA Bulk Tenders'}</span>
            </button>
          </div>

          {/* Card 4: Material & Spare Parts Vault (0% Micro-Credit) */}
          <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4 hover:border-amber-300 hover:-translate-y-1 hover:shadow-md transition-all duration-300">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                  PACS Micro-Credit
                </span>
                <span className="text-[11px] font-bold text-amber-600">0% Interest e-RUPI</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0">
                  <CreditCard className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900 leading-tight">
                    Material Credit Vault
                  </h4>
                  <span className="text-[11px] text-amber-700 font-bold">₹500–₹5,000 Vouchers</span>
                </div>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Instant digital e-RUPI vouchers for hardware & spare parts at local merchant stores, auto-settled upon job completion.
              </p>
            </div>
            <button
              onClick={() => setIsMaterialCreditOpen(true)}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
            >
              <CreditCard className="w-4 h-4 text-amber-400" />
              <span>Request Spare Parts Credit</span>
            </button>
          </div>

          {/* Card 5: NCCT Skill Ladder & Academy */}
          <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4 hover:border-indigo-300 hover:-translate-y-1 hover:shadow-md transition-all duration-300">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
                  NCCT Academy
                </span>
                <span className="text-[11px] font-bold text-indigo-600">+48% Wage Boost</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
                  <BookOpen className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900 leading-tight">
                    NCCT Skill Academy
                  </h4>
                  <span className="text-[11px] text-indigo-700 font-bold">Govt-Certified Upgrades</span>
                </div>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Upskill from Level 2 to Solar PV, EV Charging & IoT Automation with National Cooperative institute diplomas.
              </p>
            </div>
            <button
              onClick={() => setIsAcademyOpen(true)}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>View NCCT Skill Ladder</span>
            </button>
          </div>

          {/* Card 6: Cooperative Welfare Passbook (Social Security) */}
          <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4 hover:border-teal-300 hover:-translate-y-1 hover:shadow-md transition-all duration-300">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                  Welfare Ledger
                </span>
                <span className="text-[11px] font-bold text-teal-600">Accrued: ₹{workerStats?.welfareFundBalance || 0}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center shrink-0">
                  <HeartHandshake className="w-5 h-5 text-teal-600" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900 leading-tight">
                    Welfare & PF Passbook
                  </h4>
                  <span className="text-[11px] text-teal-700 font-bold">Health & Pension Shield</span>
                </div>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Review your accumulated welfare savings, Ayushman Bharat healthcare escrow, and cooperative society dividend share.
              </p>
            </div>
            <button
              onClick={() => setIsPassbookOpen(true)}
              className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>View Welfare Passbook</span>
            </button>
          </div>

          {/* Card 7: Sahakari Sabha (Democratic Voting) */}
          <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4 hover:border-purple-300 hover:-translate-y-1 hover:shadow-md transition-all duration-300">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
                  ICA Principle #2
                </span>
                <span className="text-[11px] font-bold text-purple-600">1 Member, 1 Vote</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900 leading-tight">
                    {lang === 'hi' ? 'सहकारी सभा — लोकतांत्रिक मतदान' : 'Sahakari Sabha Voting'}
                  </h4>
                  <span className="text-[11px] text-purple-700 font-bold">Democratic Policy Control</span>
                </div>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Vote directly on cooperative policies, wage floor raises, and night shift safety protocols. Your vote shapes the platform.
              </p>
            </div>
            <button
              onClick={() => setIsSabhaOpen(true)}
              className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
            >
              <Users className="w-4 h-4" />
              <span>{lang === 'hi' ? 'सभा में मतदान करें' : 'Enter Sabha — Cast Vote'}</span>
            </button>
          </div>

          {/* Card 8: Nyaya Pramaan (Fair Wage Proof Chain) */}
          <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4 hover:border-sky-300 hover:-translate-y-1 hover:shadow-md transition-all duration-300">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200">
                  Transparency Ledger
                </span>
                <span className="text-[11px] font-bold text-sky-600">SHA-256 Verified</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5 text-sky-600" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900 leading-tight">
                    {lang === 'hi' ? 'न्याय प्रमाण — वेतन प्रमाण शृंखला' : 'Nyaya Pramaan Ledger'}
                  </h4>
                  <span className="text-[11px] text-sky-700 font-bold">Tamper-Proof Escrow</span>
                </div>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Every rupee you earn is cryptographically sealed in a public Merkle ledger to guarantee zero hidden cuts or skimming.
              </p>
            </div>
            <button
              onClick={() => setIsNyayaOpen(true)}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{lang === 'hi' ? 'वेतन प्रमाण शृंखला देखें' : 'View Wage Proof Chain'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Welfare Passbook, NCCT Academy, Material Credit, Suraksha Bandhu & Tool Depot Modals */}
      <WelfarePassbookModal isOpen={isPassbookOpen} onClose={() => setIsPassbookOpen(false)} />
      <NcctAcademyModal isOpen={isAcademyOpen} onClose={() => setIsAcademyOpen(false)} />
      <MaterialCreditModal isOpen={isMaterialCreditOpen} onClose={() => setIsMaterialCreditOpen(false)} />
      <SurakshaBandhuModal
        isOpen={isSosOpen}
        onClose={() => setIsSosOpen(false)}
        worker={workerStats}
        activeJob={selectedJobForSos || (bookings.find(b => b.status === 'Accepted') || null)}
      />
      <SahakarToolDepotModal
        isOpen={isToolDepotOpen}
        onClose={() => setIsToolDepotOpen(false)}
        worker={workerStats}
        onRentalConfirmed={(rental) => {
          addNotification(`PACS Tool Gate Pass created for ${rental.toolName}! Saved ₹${rental.savings}.`, 'success');
        }}
      />
      <SamuhikTendersModal
        isOpen={isTendersOpen}
        onClose={() => setIsTendersOpen(false)}
        workerProfile={workerStats}
      />
      <CrossLanguageChatModal isOpen={Boolean(chatBooking)} onClose={() => setChatBooking(null)} booking={chatBooking} />
      <SahakariSabhaModal isOpen={isSabhaOpen} onClose={() => setIsSabhaOpen(false)} />
      <NyayaPramaanModal isOpen={isNyayaOpen} onClose={() => setIsNyayaOpen(false)} />

    </div>
  );
};
