import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Modal } from '../Common/Modal';
import { ShieldCheck, Calendar, Clock, MapPin, HeartHandshake, CheckCircle } from 'lucide-react';
import { translateNcctLevel, translateWorkerName } from '../../utils/translateHelpers';

export const BookingModal = () => {
  const { bookingModalOpen, setBookingModalOpen, selectedWorker, createBooking } = useApp();
  const { user } = useAuth();
  const { t, lang } = useLanguage();
  const [hours, setHours] = useState(2);
  const [address, setAddress] = useState('');

  if (!selectedWorker) return null;

  const baseWage = selectedWorker.hourlyRate * hours;
  const welfareContribution = Math.round(baseWage * 0.05);
  const healthInsurance = Math.round(baseWage * 0.02);
  const platformFee = Math.round(baseWage * 0.03);
  const totalAmount = baseWage + welfareContribution + healthInsurance + platformFee;

  const handleSubmit = (e) => {
    e.preventDefault();
    createBooking({
      worker: selectedWorker,
      category: selectedWorker.category,
      hours,
      address,
      isEmergency: false,
      customerName: user?.name || 'Customer',
      customerPhone: user?.phone || ''
    });
  };

  return (
    <Modal
      isOpen={bookingModalOpen}
      onClose={() => setBookingModalOpen(false)}
      title={t('bookServiceNow')}
    >
      <form onSubmit={handleSubmit} className="space-y-6 font-sans">
        
        {/* Worker Card Summary */}
        <div className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-200 rounded-xl">
          {selectedWorker.photo ? (
            <img
              src={selectedWorker.photo}
              alt={selectedWorker.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-teal-500 shadow-sm"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-teal-100 text-teal-800 font-bold text-lg flex items-center justify-center border-2 border-teal-500 shadow-sm shrink-0">
              {selectedWorker.name ? selectedWorker.name.substring(0, 2).toUpperCase() : 'WK'}
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-slate-900 text-base">{translateWorkerName(selectedWorker.name, lang)}</h4>
              <span className="px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 text-[10px] font-bold">
                ⭐ {selectedWorker.rating}
              </span>
            </div>
            <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600" /> {translateNcctLevel(selectedWorker.ncctLevel, lang)}
            </p>
            <p className="text-xs text-slate-600 font-medium mt-1">
              {t('cooperativeSociety')}: <span className="text-slate-800 font-semibold">{selectedWorker.societyName}</span>
            </p>
          </div>
        </div>

        {/* Input Parameters */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              {t('serviceHoursRequired') || 'Service Hours Required'}
            </label>
            <div className="flex items-center gap-3">
              {[1, 2, 3, 4, 6].map((h) => (
                <button
                  key={h}
                  type="button"
                  onClick={() => setHours(h)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                    hours === h
                      ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {h} {h === 1 ? (t('hourSingular') || 'Hour') : (t('hourPlural') || 'Hours')}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              {t('deliveryAddress') || 'Delivery Address'}
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                placeholder={t('enterFullAddress') || 'Enter full address / flat no / society name'}
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 text-xs font-medium"
              />
            </div>
          </div>
        </div>

        {/* Transparent Wage Summary */}
        <div className="p-4 bg-teal-50/60 border border-teal-200 rounded-xl space-y-2 text-xs">
          <div className="flex justify-between text-slate-600">
            <span>{t('workerNetTakehome') || 'Base Wage'} ({hours} hrs x ₹{selectedWorker.hourlyRate}):</span>
            <span className="font-semibold text-slate-900">₹{baseWage}.00</span>
          </div>
          <div className="flex justify-between text-teal-800">
            <span>{t('workerWelfareFund') || 'Coop Welfare & Pension Fund'} (5%):</span>
            <span className="font-semibold">+ ₹{welfareContribution}.00</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>{t('healthAccidentCover') || 'Ayushman Bharat & Insurance'} (2%):</span>
            <span className="font-semibold">+ ₹{healthInsurance}.00</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>{t('coopPlatformFee') || 'Platform Operations'} (3%):</span>
            <span className="font-semibold">+ ₹{platformFee}.00</span>
          </div>
          <div className="pt-2 border-t border-teal-200 flex justify-between items-center text-sm font-extrabold text-slate-900">
            <span>{t('totalEscrowDeposit') || 'Total Escrow Deposit'}:</span>
            <span className="text-lg text-teal-800">₹{totalAmount}.00</span>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-2"
        >
          <CheckCircle className="w-4 h-4" />
          <span>{t('confirmBookingBtn') || 'Confirm Booking & Lock Escrow'}</span>
        </button>
      </form>
    </Modal>
  );
};
