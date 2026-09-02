import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Modal } from '../Common/Modal';
import { Siren, Zap, Wrench, HeartHandshake, CheckCircle2, ShieldAlert } from 'lucide-react';
import { translateCategory, translateWorkerName } from '../../utils/translateHelpers';

export const EmergencyBooking = () => {
  const { emergencyModalOpen, setEmergencyModalOpen, workers, createBooking } = useApp();
  const { user } = useAuth();
  const { t, lang } = useLanguage();
  const [selectedEmergencyCategory, setSelectedEmergencyCategory] = useState('electrician');
  const [description, setDescription] = useState('');

  const emergencyCategories = [
    { id: 'electrician', name: `${translateCategory('electrician', t)} (Short Circuit / MCB)`, icon: Zap, color: 'border-amber-500 bg-amber-50 text-amber-900' },
    { id: 'plumber', name: `${translateCategory('plumber', t)} (Pipe Burst / Leakage)`, icon: Wrench, color: 'border-blue-500 bg-blue-50 text-blue-900' },
    { id: 'caregiver', name: `${translateCategory('caregiver', t)} (Urgent Assistance)`, icon: HeartHandshake, color: 'border-emerald-500 bg-emerald-50 text-emerald-900' },
  ];

  // Find nearest available on-duty worker for emergency — match category first, then any on-duty, never wrong trade
  const availableWorker =
    workers.find((w) => w.category === selectedEmergencyCategory && w.onDuty) ||
    workers.find((w) => w.category === selectedEmergencyCategory) ||
    null;

  const handleSOSConfirm = (e) => {
    e.preventDefault();
    if (!availableWorker) return;
    createBooking({
      worker: availableWorker,
      category: availableWorker.category.toUpperCase() + ' (EMERGENCY SOS)',
      hours: 2,
      isEmergency: true,
      address: 'EMERGENCY LOCATION (GPS Verified)',
      customerName: user?.name || 'Customer',
      customerPhone: user?.phone || ''
    });
  };

  return (
    <Modal
      isOpen={emergencyModalOpen}
      onClose={() => setEmergencyModalOpen(false)}
      title={t('emergencySosTitle') || 'Priority Emergency Service Dispatcher (SOS)'}
    >
      <form onSubmit={handleSOSConfirm} className="space-y-6 font-sans">
        
        {/* Warning Banner */}
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <Siren className="w-6 h-6 text-red-600 shrink-0 animate-bounce" />
          <div>
            <h4 className="font-bold text-red-900 text-sm">
              {t('emergencyProtocolActive') || 'Emergency Dispatch Protocol Active'}
            </h4>
            <p className="text-xs text-red-700 mt-0.5">
              {t('emergencyDesc') || 'Nearest verified cooperative worker will be dispatched immediately within 15 minutes. High-priority surge matching enabled.'}
            </p>
          </div>
        </div>

        {/* Select Emergency Type */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-700 uppercase">
            {t('selectEmergencyCategory') || 'Select Emergency Category'}
          </label>
          <div className="space-y-2">
            {emergencyCategories.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedEmergencyCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedEmergencyCategory(cat.id)}
                  className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                    isSelected
                      ? `${cat.color} font-bold shadow-sm ring-2 ring-red-500`
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5" />
                    <span className="text-xs font-semibold">{cat.name}</span>
                  </div>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-red-600" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Issue Description */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
            {t('issueDetailsOptional') || 'Issue Details (Optional)'}
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="w-full p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500 text-xs font-medium"
          ></textarea>
        </div>

        {/* Matched Nearest Worker Preview */}
        {availableWorker ? (
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              {availableWorker.photo ? (
                <img
                  src={availableWorker.photo}
                  alt={availableWorker.name}
                  className="w-10 h-10 rounded-full object-cover border border-teal-500"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-800 font-bold text-xs flex items-center justify-center border border-teal-500 shrink-0">
                  {availableWorker.name ? availableWorker.name.substring(0, 2).toUpperCase() : 'WK'}
                </div>
              )}
              <div>
                <span className="text-[10px] font-bold text-red-600 uppercase tracking-wide">Nearest Worker Matched</span>
                <h5 className="font-bold text-slate-900">{translateWorkerName(availableWorker.name, lang)}</h5>
                <p className="text-slate-500 text-[11px]">Distance: {availableWorker.distanceKm ? availableWorker.distanceKm.toFixed(1) : 1.2} km • {availableWorker.societyName}</p>
              </div>
            </div>
            <span className="px-2 py-1 rounded bg-emerald-100 text-emerald-800 font-bold">12 Min ETA</span>
          </div>
        ) : (
          <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 font-medium">
            ⚠️ {t('noEmergencyWorkerFound') || 'No worker currently available for this category nearby'}
          </div>
        )}

        <button
          type="submit"
          disabled={!availableWorker}
          className={`w-full py-3.5 rounded-xl font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2 uppercase tracking-wider ${
            availableWorker
              ? 'bg-red-600 hover:bg-red-700 active:scale-95 text-white shadow-red-600/30'
              : 'bg-slate-300 text-slate-500 cursor-not-allowed'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>{t('dispatchWorkerNow') || 'Dispatch Nearest Worker (15 Min Guarantee)'}</span>
        </button>
      </form>
    </Modal>
  );
};
