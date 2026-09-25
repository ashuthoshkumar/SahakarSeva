import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { 
  HardHat, ShieldCheck, HeartHandshake, DollarSign, Award, 
  ToggleLeft, ToggleRight, CheckCircle2, Clock, MapPin, 
  Phone, Camera, Upload, ImageIcon, AlertCircle, Wrench, 
  Star, ChevronRight, UserCheck, Sparkles, TrendingUp
} from 'lucide-react';
import { translateNcctLevel, translateCategory } from '../../utils/translateHelpers';
import { compressImage } from '../../utils/imageCompressor';
import { WelfarePassbookModal } from './WelfarePassbookModal';
import { NcctAcademyModal } from './NcctAcademyModal';
import { MaterialCreditModal } from './MaterialCreditModal';
import { WorkerNavigationMap } from './WorkerNavigationMap';

export const WorkerDashboard = () => {
  const { workerDutyStatus, toggleWorkerDuty, bookings, addNotification, acceptBooking, uploadCompletionPhoto, userCoords } = useApp();
  const { user } = useAuth();
  const { t, lang } = useLanguage();

  const [loadingStats, setLoadingStats] = useState(true);
  const [workerStats, setWorkerStats] = useState(null);
  const [isPassbookOpen, setIsPassbookOpen] = useState(false);
  const [isAcademyOpen, setIsAcademyOpen] = useState(false);
  const [isMaterialCreditOpen, setIsMaterialCreditOpen] = useState(false);
  const fileInputRefs = useRef({});

  // Build worker stats from real data (localStorage + user profile)
  useEffect(() => {
    const buildStats = async () => {
      setLoadingStats(true);

      // Try API first
      try {
        let res = await fetch(`/api/worker/my-stats?userId=${user?.id || ''}`);
        if (!res.ok) throw new Error('API failed');
        const contentType = res.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) throw new Error('Non-JSON');
        const data = await res.json();
        if (data.success) {
          setWorkerStats(data);
          setLoadingStats(false);
          return;
        }
      } catch (err) {
        try {
          let res = await fetch(`http://localhost:5050/api/worker/my-stats?userId=${user?.id || ''}`);
          const data = await res.json();
          if (data.success) {
            setWorkerStats(data);
            setLoadingStats(false);
            return;
          }
        } catch (e) { /* both failed */ }
      }

      // Build from real local data
      const myBookings = bookings.filter(b => b.workerName === user?.name || b.workerId === user?.id);
      const paidBookings = myBookings.filter(b => b.status && b.status.includes('Paid'));
      const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0);
      const todayBookings = paidBookings.filter(b => b.paidAt && new Date(b.paidAt) >= todayStart);

      const stats = {
        name: user?.name || 'Worker',
        category: user?.category || 'electrician',
        phone: user?.phone || '',
        societyName: 'SahakarSeva Cooperative Society',
        ncctLevel: 'Level 2 Certified Technician',
        aadhaarNo: user?.aadhaarNo || '',
        photo: null,
        todayEarnings: todayBookings.reduce((sum, b) => sum + (b.baseWage || 0), 0),
        monthlyEarnings: paidBookings.reduce((sum, b) => sum + (b.baseWage || 0), 0),
        welfareFundBalance: paidBookings.reduce((sum, b) => sum + (b.welfareContribution || 0), 0),
        rating: 5.0,
        jobsCompleted: paidBookings.length,
        workerId: user?.id || 'wk_local'
      };
      setWorkerStats(stats);
      setLoadingStats(false);
    };

    buildStats();
  }, [user, bookings]);

  if (loadingStats) {
    return (
      <div className="flex items-center justify-center p-16">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-bold text-slate-500">Loading worker workstation...</p>
        </div>
      </div>
    );
  }

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

          {/* Duty Status Toggle & Stats Pill */}
          <div className="flex items-center gap-4 self-start md:self-auto bg-slate-800/80 backdrop-blur-md px-5 py-3 rounded-2xl border border-slate-700">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Duty Status</span>
              <span className={`text-xs font-black ${workerDutyStatus ? 'text-emerald-400' : 'text-slate-400'}`}>
                {workerDutyStatus ? '🟢 ON DUTY (Receiving Jobs)' : '⚪ OFF DUTY'}
              </span>
            </div>

            <button
              onClick={() => toggleWorkerDuty(workerStats?.workerId)}
              className={`p-2 rounded-xl transition-all shadow-md active:scale-95 ${
                workerDutyStatus 
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950' 
                  : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
              }`}
              title="Toggle Online / Offline Status"
            >
              {workerDutyStatus ? <ToggleRight className="w-7 h-7" /> : <ToggleLeft className="w-7 h-7" />}
            </button>
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

      {/* 3. MAIN WORKSPACE: 2-COLUMN SPLIT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Job Dispatches & Bookings Management (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          
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
                  <button
                    onClick={() => acceptBooking(b.id)}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Accept Dispatch & Open Navigation Map</span>
                  </button>
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

                      {/* Status Row */}
                      <div className="flex items-center justify-between">
                        <span className={`px-2.5 py-1 rounded-xl text-xs font-bold border ${statusBadge.bg}`}>
                          {statusBadge.label}
                        </span>
                        {b.customerPhone && (
                          <a
                            href={`tel:${b.customerPhone}`}
                            className="inline-flex items-center gap-1 text-xs font-bold text-teal-700 hover:text-teal-800"
                          >
                            <Phone className="w-3.5 h-3.5" />
                            <span>Call Customer</span>
                          </a>
                        )}
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

        {/* Right Column: Worker Welfare & Innovations Suite (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Social Security & Welfare Passbook */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                Welfare Ledger
              </span>
              <span className="text-xs text-slate-500 font-bold">Automatic Contributions</span>
            </div>

            <div>
              <h4 className="text-sm font-bold text-slate-900">
                Welfare & Social Security Passbook
              </h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Review your accumulated welfare savings, insurance deductions, and provident fund balance.
              </p>
            </div>

            <button
              onClick={() => setIsPassbookOpen(true)}
              className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow transition-all flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>View Welfare Passbook</span>
            </button>
          </div>

          {/* Job Completion Guide */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <h4 className="text-sm font-bold text-slate-900">Service Guidelines</h4>
            <ul className="text-xs text-slate-600 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-teal-600 font-bold">•</span>
                <span>Accept jobs promptly to maintain a high customer response score.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal-600 font-bold">•</span>
                <span>Upload a clear completion photo after finishing the work so the customer can approve payment.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal-600 font-bold">•</span>
                <span>Direct UPI payouts are credited immediately upon customer confirmation.</span>
              </li>
            </ul>
          </div>

        </div>

      </div>

      {/* Welfare Passbook, NCCT Academy & Material Credit Modals */}
      <WelfarePassbookModal isOpen={isPassbookOpen} onClose={() => setIsPassbookOpen(false)} />
      <NcctAcademyModal isOpen={isAcademyOpen} onClose={() => setIsAcademyOpen(false)} />
      <MaterialCreditModal isOpen={isMaterialCreditOpen} onClose={() => setIsMaterialCreditOpen(false)} />

    </div>
  );
};
