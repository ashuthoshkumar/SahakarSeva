import React from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { StarRating } from '../Common/StarRating';
import { SERVICE_CATEGORIES } from '../../data/mockData';
import {
  ShieldCheck, MapPin, CheckCircle2, Award, Zap,
  X, Search, SlidersHorizontal, ArrowRight, UserCheck
} from 'lucide-react';
import {
  translateNcctLevel,
  translateSkill,
  translateWorkerName,
  translateCategory
} from '../../utils/translateHelpers';

export const WorkerList = () => {
  const {
    workers,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    radiusKm,
    setRadiusKm,
    setSelectedWorker,
    setBookingModalOpen
  } = useApp();
  const { t, lang } = useLanguage();

  const selectedCatObj = SERVICE_CATEGORIES.find((c) => c.id === selectedCategory);
  const selectedCatName = selectedCatObj
    ? (t(`cat_${selectedCatObj.id}`) !== `cat_${selectedCatObj.id}` ? t(`cat_${selectedCatObj.id}`) : selectedCatObj.name)
    : null;

  const filteredWorkers = workers.filter((w) => {
    const matchesCategory = selectedCategory === 'all' || w.category === selectedCategory;
    const matchesSearch =
      (w.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (w.skills || []).some((s) => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (w.societyName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (w.category || '').toLowerCase().includes(searchQuery.toLowerCase());
    const workerDist = (w.distanceKm !== undefined && !isNaN(w.distanceKm)) ? w.distanceKm : 0;
    const matchesRadius = workerDist <= radiusKm;
    return matchesCategory && matchesSearch && matchesRadius;
  });

  return (
    <div id="workers-section" className="space-y-4 scroll-mt-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              {selectedCatName ? (
                <>
                  <span className="p-1 rounded-lg bg-teal-100 text-teal-800 text-xs">
                    <UserCheck className="w-3.5 h-3.5" />
                  </span>
                  <span>Available {selectedCatName} Workers</span>
                </>
              ) : (
                <>
                  <span>{t('verifiedWorkersTitle')}</span>
                </>
              )}
            </h3>

            <span className="text-[11px] font-black bg-teal-50 text-teal-800 px-2 py-0.5 rounded-full border border-teal-200">
              {filteredWorkers.length} {filteredWorkers.length === 1 ? 'Worker' : 'Workers'}
            </span>
          </div>

          <p className="text-xs text-slate-500 font-medium mt-0.5">
            {selectedCatName
              ? `Showing verified craftsmen specialized in ${selectedCatName} within ${radiusKm} km`
              : `${t('showingWorkers')} (${filteredWorkers.length})`}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {selectedCategory !== 'all' && (
            <button
              onClick={() => setSelectedCategory('all')}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              <span>Show All Categories</span>
            </button>
          )}

          <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 shrink-0">
            ✓ {t('wageFloorAssured')}
          </span>
        </div>
      </div>

      {/* Zero Workers Match Empty State */}
      {filteredWorkers.length === 0 ? (
        <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-full bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto">
            <SlidersHorizontal className="w-6 h-6" />
          </div>

          <div>
            <h4 className="text-sm font-extrabold text-slate-900">
              {selectedCatName
                ? `No ${selectedCatName} workers available within ${radiusKm} km`
                : t('noWorkersFound')}
            </h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              {t('expandRadiusHint')}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            {radiusKm < 50 && (
              <button
                onClick={() => setRadiusKm(50)}
                className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow transition-colors"
              >
                Expand Radius to 50 km
              </button>
            )}

            {selectedCategory !== 'all' && (
              <button
                onClick={() => setSelectedCategory('all')}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
              >
                View All Categories
              </button>
            )}

            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
              >
                Clear Search
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Workers Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredWorkers.map((worker) => (
            <div
              key={worker.id}
              className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between relative group"
            >
              <div>
                {/* Header Profile Row */}
                <div className="flex items-start justify-between gap-3 mb-2.5">
                  <div className="flex items-center gap-3">
                    <div className="relative">
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
                      {/* Live Online Badge */}
                      <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white shadow-sm" title="On Duty & Ready"></span>
                    </div>

                    <div>
                      <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5 leading-snug">
                        <span>{translateWorkerName(worker.name, lang)}</span>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      </h4>
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal-700">
                        <Award className="w-3 h-3" /> {translateNcctLevel(worker.ncctLevel, lang)}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-bold">
                      {(worker.distanceKm != null && !isNaN(worker.distanceKm)) ? worker.distanceKm.toFixed(1) : '0.5'} km
                    </span>
                    <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                      ● Ready Now
                    </span>
                  </div>
                </div>

                {/* Category Chip & Society Affiliation */}
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-2.5 mb-2.5 text-xs flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <span className="text-[9px] uppercase font-bold text-slate-400 block">{t('cooperativeSociety')}</span>
                    <p className="font-bold text-slate-800 truncate text-[11px]">{worker.societyName}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-lg bg-teal-100/70 text-teal-800 text-[10px] font-extrabold shrink-0 border border-teal-200/50">
                    {translateCategory(worker.category, t)}
                  </span>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                  <div className="bg-emerald-50/70 p-2 rounded-xl border border-emerald-100">
                    <span className="text-[10px] text-slate-500 font-medium">{t('baseHourlyRate')}</span>
                    <p className="font-extrabold text-emerald-800 text-sm">₹{worker.hourlyRate}/hr</p>
                  </div>

                  <div className="bg-amber-50/70 p-2 rounded-xl border border-amber-100">
                    <span className="text-[10px] text-slate-500 font-medium">{t('ratingAndJobs')}</span>
                    <StarRating rating={worker.rating} count={worker.reviewsCount} />
                  </div>
                </div>

                {/* Skills Tags */}
                <div className="flex flex-wrap gap-1 mb-3.5">
                  {(worker.skills || []).slice(0, 3).map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-medium"
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
                className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white rounded-xl font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 group-hover:bg-teal-700"
              >
                <span>{t('bookServiceNow')}</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
