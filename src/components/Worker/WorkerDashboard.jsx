import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { HardHat, ShieldCheck, HeartHandshake, DollarSign, Award, ToggleLeft, ToggleRight, CheckCircle2, Clock, MapPin, Phone, Camera, Upload, ImageIcon, AlertCircle, Wrench } from 'lucide-react';
import { translateNcctLevel, translateCategory } from '../../utils/translateHelpers';
import { compressImage } from '../../utils/imageCompressor';
import { WelfarePassbookModal } from './WelfarePassbookModal';
import { NcctAcademyModal } from './NcctAcademyModal';
import { MaterialCreditModal } from './MaterialCreditModal';

export const WorkerDashboard = () => {
  const { workerDutyStatus, toggleWorkerDuty, bookings, addNotification, acceptBooking, uploadCompletionPhoto } = useApp();
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
      <div className="flex items-center justify-center p-12">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs font-bold text-slate-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Filter bookings for this worker only
  const myBookings = bookings.filter(b => b.workerName === workerStats?.name || b.workerId === user?.id);

  // Handle photo upload from camera
  const handlePhotoUpload = async (bookingId, event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      addNotification('Optimizing and uploading proof photo...', 'info');
      // Compress camera image to lightweight high-quality JPEG (~80KB)
      const compressedDataUrl = await compressImage(file, 1024, 1024, 0.75);
      uploadCompletionPhoto(bookingId, compressedDataUrl);
    } catch (err) {
      console.error('Failed to process photo:', err);
      addNotification('Failed to process photo. Please try again.', 'error');
    } finally {
      // Clear input so selecting the same file again triggers change
      if (event.target) event.target.value = '';
    }
  };

  // Get status badge style
  const getStatusBadge = (status) => {
    if (status?.includes('Paid')) return { bg: 'bg-emerald-100 text-emerald-800', label: '✓ Paid' };
    if (status?.includes('Approved')) return { bg: 'bg-blue-100 text-blue-800', label: '✓ Approved' };
    if (status?.includes('Awaiting Approval')) return { bg: 'bg-purple-100 text-purple-800', label: '📸 Awaiting Review' };
    if (status?.includes('Redo')) return { bg: 'bg-red-100 text-red-800', label: '🔄 Redo Requested' };
    if (status === 'Accepted') return { bg: 'bg-teal-100 text-teal-800', label: '✓ Accepted' };
    return { bg: 'bg-amber-100 text-amber-800', label: '⏳ Pending' };
  };

  return (
    <div className="space-y-4 font-sans">
      
      {/* Worker Header Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3">
        <div className="flex items-center gap-3">
          <div className="relative shrink-0">
            {workerStats?.photo ? (
              <img
                src={workerStats.photo}
                alt={workerStats.name}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-teal-500 shadow"
              />
            ) : (
              <div className="w-14 h-14 rounded-2xl bg-teal-100 text-teal-800 font-bold text-lg flex items-center justify-center border-2 border-teal-500 shadow">
                {workerStats?.name ? workerStats.name.substring(0, 2).toUpperCase() : 'WK'}
              </div>
            )}
            <span className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-white ${workerDutyStatus ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
          </div>

          <div className="min-w-0 flex-1">
            <h2 className="text-base font-bold text-slate-900 truncate">{workerStats?.name}</h2>
            <p className="text-[10px] text-slate-500 font-medium capitalize truncate">{workerStats?.category} • {workerStats?.phone}</p>
            <div className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[9px] font-bold border border-emerald-200">
              <CheckCircle2 className="w-3 h-3" />
              <span>{t('ncctVerified')}</span>
            </div>
          </div>

          {/* Compact Duty Toggle */}
          <button
            onClick={() => toggleWorkerDuty(workerStats?.workerId)}
            className={`p-2 rounded-xl transition-colors shrink-0 ${workerDutyStatus ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'}`}
          >
            {workerDutyStatus ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
          </button>
        </div>

        {/* Society & NCCT Badge */}
        <div className="coop-badge-gradient text-white rounded-xl p-3 flex items-center gap-3 shadow-sm">
          <div className="p-2 bg-white/10 rounded-lg backdrop-blur-md shrink-0">
            <Award className="w-5 h-5 text-amber-300" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[9px] font-bold uppercase tracking-wider text-teal-100">{t('officialCertification')}</p>
            <p className="font-extrabold text-xs truncate">{translateNcctLevel(workerStats?.ncctLevel, lang)}</p>
            <p className="text-[10px] text-teal-100 truncate">{workerStats?.societyName}</p>
          </div>
          <span className="px-2 py-1 bg-white/15 rounded-lg text-[9px] font-bold border border-white/25 shrink-0">
            {workerStats?.jobsCompleted} {t('workersCount') || 'Jobs'}
          </span>
        </div>
      </div>

      {/* Financial Stats Grid - 2x2 */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[9px] font-bold uppercase">{t('todaysPayout')}</span>
            <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <p className="text-xl font-black text-slate-900 mt-1">₹{workerStats?.todayEarnings || 0}</p>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[9px] font-bold uppercase">{t('monthlyIncome')}</span>
            <HardHat className="w-3.5 h-3.5 text-teal-600" />
          </div>
          <p className="text-xl font-black text-slate-900 mt-1">₹{workerStats?.monthlyEarnings || 0}</p>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[9px] font-bold uppercase truncate">{t('coopWelfareSavings')}</span>
            <HeartHandshake className="w-3.5 h-3.5 text-orange-600" />
          </div>
          <p className="text-xl font-black text-slate-900 mt-1">₹{workerStats?.welfareFundBalance || 0}</p>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[9px] font-bold uppercase">{t('healthAccidentCover')}</span>
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
          </div>
          <p className="text-lg font-extrabold text-slate-900 mt-1">⭐ {workerStats?.rating || 5.0}</p>
        </div>
      </div>

      {/* SIH26089 INNOVATION SUITE FOR WORKERS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        
        {/* Innovation 2 Trigger: Social Security & Dividend Passbook */}
        <div className="bg-gradient-to-br from-emerald-950 via-teal-900 to-slate-900 text-white p-4 rounded-2xl border border-emerald-600/40 shadow-md relative overflow-hidden flex flex-col justify-between space-y-2.5">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-black uppercase tracking-wider text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-400/30">
                Social Security
              </span>
              <span className="text-[10px] text-emerald-300 font-bold">100% Protected</span>
            </div>
            <h4 className="text-xs font-black text-white mt-1">
              Cooperative Welfare & Dividend Passbook
            </h4>
            <p className="text-[10px] text-slate-300 mt-0.5 leading-snug">
              Ayushman Bharat health escrow, PMSBY insurance & annual profit-sharing dividends.
            </p>
          </div>

          <button
            onClick={() => setIsPassbookOpen(true)}
            className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] text-slate-950 font-black text-xs rounded-xl shadow transition-all flex items-center justify-center gap-1.5"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Open Social Security Passbook →</span>
          </button>
        </div>

        {/* Innovation 3 Trigger: AI Skill Ladder & NCCT Upskilling Academy */}
        <div className="bg-gradient-to-br from-blue-950 via-teal-950 to-slate-900 text-white p-4 rounded-2xl border border-blue-600/40 shadow-md relative overflow-hidden flex flex-col justify-between space-y-2.5">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-black uppercase tracking-wider text-blue-300 bg-blue-500/20 px-2 py-0.5 rounded-full border border-blue-400/30">
                NCCT Mandate
              </span>
              <span className="text-[10px] text-amber-300 font-bold">+48% Earning Boost</span>
            </div>
            <h4 className="text-xs font-black text-white mt-1">
              AI Skill Ladder & Upskilling Academy
            </h4>
            <p className="text-[10px] text-slate-300 mt-0.5 leading-snug">
              Level 2 → Level 3 certification courses (Solar PV & EV Charger) with free institute enrollment.
            </p>
          </div>

          <button
            onClick={() => setIsAcademyOpen(true)}
            className="w-full py-2 bg-blue-500 hover:bg-blue-400 active:scale-[0.98] text-slate-950 font-black text-xs rounded-xl shadow transition-all flex items-center justify-center gap-1.5"
          >
            <Award className="w-3.5 h-3.5" />
            <span>View NCCT Skill Ladder →</span>
          </button>
        </div>

        {/* Innovation 4 Trigger: Material & Spare Parts Micro-Credit Vault */}
        <div className="sm:col-span-2 bg-gradient-to-r from-amber-950 via-slate-900 to-teal-950 text-white p-4 rounded-2xl border border-amber-500/40 shadow-md relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="space-y-0.5 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-black uppercase tracking-wider text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-400/30">
                PACS Working Capital
              </span>
              <span className="text-[10px] text-emerald-300 font-bold">0% Free Credit Line</span>
            </div>
            <h4 className="text-xs font-black text-white mt-1">
              Material & Tool Micro-Credit Vault (Powered by PACS)
            </h4>
            <p className="text-[10px] text-slate-300 leading-snug">
              Need replacement MCBs, pipes or hardware? Issue zero-interest e-RUPI vouchers directly to local merchants.
            </p>
          </div>

          <button
            onClick={() => setIsMaterialCreditOpen(true)}
            className="w-full sm:w-auto px-4 py-2 bg-amber-500 hover:bg-amber-400 active:scale-[0.98] text-slate-950 font-black text-xs rounded-xl shadow transition-all flex items-center justify-center gap-1.5 shrink-0"
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>Issue Material Voucher →</span>
          </button>
        </div>

      </div>

      {/* Welfare Passbook, NCCT Academy & Material Credit Modals */}
      <WelfarePassbookModal isOpen={isPassbookOpen} onClose={() => setIsPassbookOpen(false)} />
      <NcctAcademyModal isOpen={isAcademyOpen} onClose={() => setIsAcademyOpen(false)} />
      <MaterialCreditModal isOpen={isMaterialCreditOpen} onClose={() => setIsMaterialCreditOpen(false)} />

      {/* Incoming Job Requests */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3">
        <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
          <Clock className="w-4 h-4 text-teal-600" />
          <span>{t('incomingBookingRequests')} ({myBookings.length})</span>
        </h3>

        {myBookings.length === 0 ? (
          <div className="p-6 text-center bg-slate-50 rounded-xl border border-slate-200">
            <p className="text-xs font-bold text-slate-600">No booking requests yet</p>
            <p className="text-[10px] text-slate-400 mt-1">New jobs will appear here when customers book.</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {myBookings.map((b) => {
              const statusBadge = getStatusBadge(b.status);
              const canUploadPhoto = b.status === 'Accepted' || b.status === 'Redo Requested';
              const hasPhoto = Boolean(b.completionPhoto);

              return (
                <div
                  key={b.id}
                  className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-xs">{b.customerName}</span>
                      <span className="px-1.5 py-0.5 rounded bg-teal-100 text-teal-800 text-[9px] font-bold">
                        {translateCategory(b.category, t)}
                      </span>
                    </div>
                    <span className="text-sm font-black text-emerald-700">₹{b.baseWage || b.totalAmount || 0}</span>
                  </div>

                  <p className="text-[10px] text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" /> {b.address}
                  </p>

                  {/* Status Badge */}
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${statusBadge.bg}`}>
                      {statusBadge.label}
                    </span>
                    <span className="text-[10px] text-slate-400">{b.scheduledTime}</span>
                  </div>

                  {/* Show uploaded completion photo if exists */}
                  {hasPhoto && (
                    <div className="relative rounded-lg overflow-hidden border border-slate-200">
                      <img
                        src={b.completionPhoto}
                        alt="Work Completion"
                        className="w-full h-32 object-cover"
                      />
                      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                        <span className="text-[10px] text-white font-bold">📸 Work Completion Photo Uploaded</span>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 pt-1 border-t border-slate-200">
                    {b.status === 'Pending' && (
                      <button
                        onClick={() => acceptBooking(b.id)}
                        className="flex-1 px-3 py-1.5 bg-emerald-600 active:bg-emerald-700 text-white font-bold text-[10px] rounded-lg shadow transition-colors flex items-center justify-center gap-1"
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        {t('acceptJob')}
                      </button>
                    )}

                    {canUploadPhoto && (
                      <button
                        onClick={() => fileInputRefs.current[b.id]?.click()}
                        className="flex-1 px-3 py-1.5 bg-blue-600 active:bg-blue-700 text-white font-bold text-[10px] rounded-lg shadow transition-colors flex items-center justify-center gap-1"
                      >
                        <Camera className="w-3 h-3" />
                        {hasPhoto ? 'Re-upload Photo' : 'Upload Work Photo'}
                      </button>
                    )}

                    {/* Hidden file input for camera capture */}
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
  );
};
