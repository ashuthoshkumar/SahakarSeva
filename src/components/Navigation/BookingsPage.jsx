import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Calendar, Clock, CheckCircle2, AlertCircle, ShieldCheck, HeartHandshake, MapPin, DollarSign, FileText, ArrowRight, UserCheck, Camera, ThumbsUp, RotateCcw, Eye } from 'lucide-react';
import { translateCategory, translateWorkerName } from '../../utils/translateHelpers';

export const BookingsPage = () => {
  const { bookings, setSelectedBooking, setPaymentModalOpen, setInvoiceModalOpen, approveWork, requestRedo } = useApp();
  const { user } = useAuth();
  const { t, lang } = useLanguage();
  const [filter, setFilter] = useState('all');
  const [previewPhoto, setPreviewPhoto] = useState(null);

  // Filter bookings based on role & active tab filter
  const myBookings = user?.role === 'worker' 
    ? bookings.filter(b => b.workerName === user.name || b.workerId === user.id)
    : bookings;

  const filteredBookings = myBookings.filter(b => {
    if (filter === 'active') return !b.status?.includes('Paid');
    if (filter === 'completed') return b.status?.includes('Paid');
    if (filter === 'approval') return b.status?.includes('Awaiting Approval');
    return true;
  });

  // Get status badge style
  const getStatusBadge = (status) => {
    if (status?.includes('Paid')) return { bg: 'bg-emerald-100 text-emerald-800', label: `✓ ${t('statusPaid') || 'Paid & Confirmed'}` };
    if (status?.includes('Approved')) return { bg: 'bg-blue-100 text-blue-800', label: `✓ ${t('payNow') || 'Approved - Pay Now'}` };
    if (status?.includes('Awaiting Approval')) return { bg: 'bg-purple-100 text-purple-800', label: `📸 ${t('approvalFilter') || 'Review Work Photo'}` };
    if (status?.includes('Redo')) return { bg: 'bg-red-100 text-red-800', label: `🔄 ${t('requestRedo') || 'Redo Requested'}` };
    if (status === 'Accepted') return { bg: 'bg-teal-100 text-teal-800', label: t('awaitingWorker') || 'Worker Accepted' };
    return { bg: 'bg-amber-100 text-amber-800', label: t('pendingFilter') || 'Pending' };
  };

  const awaitingCount = myBookings.filter(b => b.status?.includes('Awaiting Approval')).length;

  return (
    <div className="space-y-4 pb-8 font-sans">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white rounded-2xl p-4 shadow-xl relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 text-[10px] font-bold border border-teal-500/30">
              <Calendar className="w-3 h-3 text-teal-400" />
              <span>{t('bookingsTab') || 'Service Bookings'}</span>
            </div>
            <h1 className="text-xl font-extrabold tracking-tight mt-1">
              {t('myBookingsTitle') || 'My Bookings History'}
            </h1>
            <p className="text-[11px] text-slate-300">
              {t('myBookingsSubtitle') || 'Track active jobs, completed services & invoices'}
            </p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-teal-500/20 border border-teal-500/30 text-teal-300 font-black text-base flex items-center justify-center shrink-0">
            {myBookings.length}
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-slate-800/80 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setFilter('all')}
            className={`px-2.5 py-1 rounded-xl text-[10px] font-bold transition-all whitespace-nowrap ${
              filter === 'all'
                ? 'bg-teal-500 text-slate-950 shadow'
                : 'bg-white/10 text-slate-300 hover:bg-white/20'
            }`}
          >
            {t('allBookings') || 'All'} ({myBookings.length})
          </button>
          {awaitingCount > 0 && (
            <button
              onClick={() => setFilter('approval')}
              className={`px-2.5 py-1 rounded-xl text-[10px] font-bold transition-all whitespace-nowrap ${
                filter === 'approval'
                  ? 'bg-purple-500 text-white shadow'
                  : 'bg-white/10 text-slate-300 hover:bg-white/20'
              }`}
            >
              📸 {t('approvalFilter') || 'Approval'} ({awaitingCount})
            </button>
          )}
          <button
            onClick={() => setFilter('active')}
            className={`px-2.5 py-1 rounded-xl text-[10px] font-bold transition-all whitespace-nowrap ${
              filter === 'active'
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'bg-white/10 text-slate-300 hover:bg-white/20'
            }`}
          >
            {t('pendingFilter') || 'Pending'} ({myBookings.filter(b => !b.status?.includes('Paid')).length})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-2.5 py-1 rounded-xl text-[10px] font-bold transition-all whitespace-nowrap ${
              filter === 'completed'
                ? 'bg-emerald-500 text-slate-950 shadow'
                : 'bg-white/10 text-slate-300 hover:bg-white/20'
            }`}
          >
            {t('completedFilter') || 'Completed'} ({myBookings.filter(b => b.status?.includes('Paid')).length})
          </button>
        </div>
      </div>

        {/* Photo Preview Modal */}
        {previewPhoto && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setPreviewPhoto(null)}>
            <div className="relative max-w-sm w-full">
              <img src={previewPhoto} alt="Work Completion" className="w-full rounded-2xl shadow-2xl" />
              <button
                onClick={() => setPreviewPhoto(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 text-slate-900 flex items-center justify-center font-bold text-sm"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3 shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Calendar className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">{t('noWorkersFound') || 'No bookings found'}</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">{t('noBookingsDesc') || "You haven't placed any service bookings yet."}</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredBookings.map((booking) => {
              const statusBadge = getStatusBadge(booking.status);
              const isPaid = booking.status?.includes('Paid');
              const isAwaitingApproval = booking.status?.includes('Awaiting Approval');
              const isApproved = booking.status?.includes('Approved');
              const hasPhoto = Boolean(booking.completionPhoto);

              return (
                <div
                  key={booking.id}
                  className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="px-2 py-0.5 rounded bg-teal-50 text-teal-800 text-[10px] font-bold border border-teal-200 uppercase">
                        {translateCategory(booking.category, t)}
                      </span>
                      <h3 className="font-extrabold text-sm text-slate-900 mt-1">
                        {translateWorkerName(booking.workerName, lang)}
                      </h3>
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold shrink-0 ${statusBadge.bg}`}>
                      {statusBadge.label}
                    </span>
                  </div>

                  <div className="space-y-1 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-1.5 text-slate-700">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{booking.address}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{booking.scheduledTime}</span>
                    </div>
                  </div>

                  {/* Work Completion Photo — shown when worker uploads */}
                  {hasPhoto && (isAwaitingApproval || isApproved || isPaid) && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-purple-800">
                        <Camera className="w-3.5 h-3.5" />
                        <span>{t('workPhotoUploaded') || 'Work Completion Photo by Worker'}</span>
                      </div>
                      <div
                        className="relative rounded-xl overflow-hidden border border-slate-200 cursor-pointer group"
                        onClick={() => setPreviewPhoto(booking.completionPhoto)}
                      >
                        <img
                          src={booking.completionPhoto}
                          alt="Work Completion Proof"
                          className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                          <Eye className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                          <span className="text-[10px] text-white font-bold">{t('tapToViewPhoto') || 'Tap to view full photo'}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Approval Buttons — only for customer when awaiting approval */}
                  {isAwaitingApproval && user?.role !== 'worker' && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => approveWork(booking.id)}
                        className="flex-1 px-3 py-2.5 bg-emerald-600 active:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition-all flex items-center justify-center gap-1.5"
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span>{t('approveWork') || 'Approve Work'}</span>
                      </button>
                      <button
                        onClick={() => requestRedo(booking.id)}
                        className="flex-1 px-3 py-2.5 bg-red-100 active:bg-red-200 text-red-800 font-bold text-xs rounded-xl border border-red-200 transition-all flex items-center justify-center gap-1.5"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>{t('requestRedo') || 'Request Redo'}</span>
                      </button>
                    </div>
                  )}

                  {/* Price Breakdown Row */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">{t('totalAmount') || 'Total Amount'}</span>
                      <p className="text-base font-black text-slate-900">₹{booking.totalAmount}</p>
                    </div>

                    {isPaid ? (
                      <button
                        onClick={() => {
                          setSelectedBooking(booking);
                          setInvoiceModalOpen(true);
                        }}
                        className="px-3.5 py-2 bg-teal-600 active:bg-teal-700 text-white font-bold text-xs rounded-xl shadow transition-all flex items-center gap-1.5"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>{t('viewInvoice') || 'View Invoice'}</span>
                      </button>
                    ) : isApproved ? (
                      <button
                        onClick={() => {
                          setSelectedBooking(booking);
                          setPaymentModalOpen(true);
                        }}
                        className="px-3.5 py-2 bg-emerald-600 active:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition-all flex items-center gap-1.5 animate-pulse"
                      >
                        <DollarSign className="w-3.5 h-3.5" />
                        <span>{t('payNow') || 'Pay Now'} (₹{booking.totalAmount})</span>
                      </button>
                    ) : (
                      <span className="px-3 py-2 bg-slate-100 text-slate-500 font-bold text-[10px] rounded-xl border border-slate-200">
                        {booking.status?.includes('Awaiting') ? (t('reviewAndApproveFirst') || 'Review & Approve First') : (t('awaitingWorker') || 'Awaiting Worker')}
                      </span>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        )}

    </div>
  );
};
