import React from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { StarRating } from '../Common/StarRating';
import { ShieldCheck, MapPin, CheckCircle2, Award } from 'lucide-react';
import { translateNcctLevel, translateSkill, translateWorkerName } from '../../utils/translateHelpers';

export const WorkerList = () => {
  const { workers, selectedCategory, searchQuery, radiusKm, setSelectedWorker, setBookingModalOpen } = useApp();
  const { t, lang } = useLanguage();

  const filteredWorkers = workers.filter((w) => {
    const matchesCategory = selectedCategory === 'all' || w.category === selectedCategory;
    const matchesSearch =
      (w.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (w.skills || []).some((s) => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (w.societyName || '').toLowerCase().includes(searchQuery.toLowerCase());
    const workerDist = (w.distanceKm !== undefined && !isNaN(w.distanceKm)) ? w.distanceKm : 0;
    const matchesRadius = workerDist <= radiusKm;
    return matchesCategory && matchesSearch && matchesRadius;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
            {t('verifiedWorkersTitle')}
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            {t('showingWorkers')} ({filteredWorkers.length})
          </p>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
          ✓ {t('wageFloorAssured')}
        </span>
      </div>

      {filteredWorkers.length === 0 ? (
        <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
          <p className="text-sm font-bold text-slate-600">{t('noWorkersFound')}</p>
          <p className="text-xs text-slate-400 mt-1">{t('expandRadiusHint')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredWorkers.map((worker) => (
            <div
              key={worker.id}
              className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                {/* Header Profile Row */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    {worker.photo ? (
                      <img
                        src={worker.photo}
                        alt={worker.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-teal-500 shadow-sm"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-teal-100 text-teal-800 font-bold text-sm flex items-center justify-center border-2 border-teal-500 shadow-sm">
                        {worker.name ? worker.name.substring(0, 2).toUpperCase() : 'WK'}
                      </div>
                    )}
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                        <span>{translateWorkerName(worker.name, lang)}</span>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      </h4>
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal-700">
                        <Award className="w-3 h-3" /> {translateNcctLevel(worker.ncctLevel, lang)}
                      </span>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-bold shrink-0">
                    {worker.distanceKm ? worker.distanceKm.toFixed(1) : 0.8} km
                  </span>
                </div>

                {/* Society Affiliation Badge */}
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-2.5 mb-3 text-xs">
                  <span className="text-[10px] uppercase font-bold text-slate-400">{t('cooperativeSociety')}</span>
                  <p className="font-bold text-slate-800 line-clamp-1">{worker.societyName}</p>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                  <div className="bg-emerald-50/60 p-2 rounded-lg border border-emerald-100">
                    <span className="text-[10px] text-slate-500 font-medium">{t('baseHourlyRate')}</span>
                    <p className="font-extrabold text-emerald-800 text-sm">₹{worker.hourlyRate}/hr</p>
                  </div>

                  <div className="bg-amber-50/60 p-2 rounded-lg border border-amber-100">
                    <span className="text-[10px] text-slate-500 font-medium">{t('ratingAndJobs')}</span>
                    <StarRating rating={worker.rating} count={worker.reviewsCount} />
                  </div>
                </div>

                {/* Skills Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {(worker.skills || []).slice(0, 3).map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-medium"
                    >
                      {translateSkill(skill, lang)}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => {
                  setSelectedWorker(worker);
                  setBookingModalOpen(true);
                }}
                className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold text-xs shadow transition-colors flex items-center justify-center gap-1.5"
              >
                <span>{t('bookServiceNow')}</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
