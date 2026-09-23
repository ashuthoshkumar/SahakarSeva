import React from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { SERVICE_CATEGORIES } from '../../data/mockData';
import {
  Zap, Wrench, Hammer, Paintbrush, ChefHat, HeartHandshake,
  Car, Flower2, Sparkles, Tv, Grid, Search, X, CheckCircle2,
  ArrowDown, Users, ShieldCheck
} from 'lucide-react';

const iconMap = {
  Zap, Wrench, Hammer, Paintbrush, ChefHat, HeartHandshake, Car, Flower2, Sparkles, Tv
};

export const ServiceCatalog = () => {
  const {
    selectedCategory,
    setSelectedCategory,
    categoryCounts,
    searchQuery,
    setSearchQuery,
    workers,
    radiusKm
  } = useApp();
  const { t } = useLanguage();

  const trimmedQuery = (searchQuery || '').trim().toLowerCase();

  // Dynamically auto-filter categories based on search input
  const filteredCategories = SERVICE_CATEGORIES.filter((cat) => {
    if (!trimmedQuery) return true;

    const translatedName = (t(`cat_${cat.id}`) !== `cat_${cat.id}` ? t(`cat_${cat.id}`) : cat.name).toLowerCase();
    const translatedDesc = (t(`cat_${cat.id}_desc`) !== `cat_${cat.id}_desc` ? t(`cat_${cat.id}_desc`) : cat.desc).toLowerCase();
    const rawName = (cat.name || '').toLowerCase();
    const rawDesc = (cat.desc || '').toLowerCase();
    const rawId = (cat.id || '').toLowerCase();

    // Direct match against category id, title or description
    if (
      rawId.includes(trimmedQuery) ||
      rawName.includes(trimmedQuery) ||
      translatedName.includes(trimmedQuery) ||
      rawDesc.includes(trimmedQuery) ||
      translatedDesc.includes(trimmedQuery)
    ) {
      return true;
    }

    // Match if any worker in this category has matching skills, name, or society
    const categoryWorkers = workers.filter((w) => w.category === cat.id);
    const hasMatchingWorker = categoryWorkers.some(
      (w) =>
        (w.name || '').toLowerCase().includes(trimmedQuery) ||
        (w.societyName || '').toLowerCase().includes(trimmedQuery) ||
        (w.skills || []).some((s) => s.toLowerCase().includes(trimmedQuery))
    );

    return hasMatchingWorker;
  });

  const handleCategoryClick = (catId) => {
    const newCategory = selectedCategory === catId ? 'all' : catId;
    setSelectedCategory(newCategory);

    // Smoothly scroll down to the workers section so the user instantly sees available workers
    if (newCategory !== 'all') {
      setTimeout(() => {
        const el = document.getElementById('workers-section');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 120);
    }
  };

  const selectedCatObj = SERVICE_CATEGORIES.find((c) => c.id === selectedCategory);
  const selectedCatIcon = selectedCatObj ? (iconMap[selectedCatObj.icon] || Zap) : Zap;
  const selectedCatWorkers = selectedCategory === 'all'
    ? workers
    : workers.filter((w) => {
        const dist = (w.distanceKm !== undefined && !isNaN(w.distanceKm)) ? w.distanceKm : 0;
        return w.category === selectedCategory && dist <= radiusKm;
      });

  return (
    <div className="space-y-3.5">
      {/* Header with Title & Filter Controls */}
      <div className="flex items-center justify-between">
        <h3 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <Grid className="w-4 h-4 text-teal-600" />
          <span>{t('categoriesTitle')}</span>
          {trimmedQuery && (
            <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
              {filteredCategories.length} {filteredCategories.length === 1 ? 'match' : 'matches'}
            </span>
          )}
        </h3>

        {selectedCategory !== 'all' && (
          <button
            onClick={() => setSelectedCategory('all')}
            className="text-xs text-teal-700 font-extrabold hover:underline flex items-center gap-1 bg-teal-50 px-2 py-1 rounded-lg border border-teal-200"
          >
            <X className="w-3.5 h-3.5" />
            <span>{t('resetFilter')}</span>
          </button>
        )}
      </div>

      {/* Active Search Filter Badge */}
      {trimmedQuery && (
        <div className="flex items-center justify-between bg-teal-50/90 border border-teal-200/80 px-3 py-2 rounded-xl text-xs">
          <div className="flex items-center gap-1.5 min-w-0">
            <Search className="w-3.5 h-3.5 text-teal-600 shrink-0" />
            <span className="text-slate-600 truncate">
              Auto-filtering categories for: <strong className="text-teal-900">"{searchQuery}"</strong>
            </span>
          </div>
          <button
            onClick={() => setSearchQuery('')}
            className="text-teal-700 hover:text-teal-900 font-bold shrink-0 text-[11px] flex items-center gap-0.5 ml-2"
          >
            <X className="w-3 h-3" />
            <span>Clear</span>
          </button>
        </div>
      )}

      {/* Active Category Spotlight Banner */}
      {selectedCategory !== 'all' && selectedCatObj && (
        <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 text-white rounded-2xl p-4 shadow-lg border border-teal-700/40 relative overflow-hidden animate-fadeIn">
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-teal-500/20 border border-teal-400/30 text-teal-300 shadow-inner">
                {React.createElement(selectedCatIcon, { className: 'w-6 h-6' })}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase tracking-wider text-teal-300 bg-teal-500/20 px-2 py-0.5 rounded-full border border-teal-400/30">
                    Selected Category
                  </span>
                  <span className="text-xs font-bold text-slate-300">
                    ₹300/hr Wage Floor
                  </span>
                </div>
                <h4 className="text-base font-extrabold text-white mt-0.5">
                  {t(`cat_${selectedCatObj.id}`) !== `cat_${selectedCatObj.id}` ? t(`cat_${selectedCatObj.id}`) : selectedCatObj.name}
                </h4>
                <p className="text-[11px] text-teal-100/80 line-clamp-1">
                  {t(`cat_${selectedCatObj.id}_desc`) !== `cat_${selectedCatObj.id}_desc` ? t(`cat_${selectedCatObj.id}_desc`) : selectedCatObj.desc}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1 sm:pt-0">
              <button
                onClick={() => {
                  const el = document.getElementById('workers-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className="flex-1 sm:flex-initial px-3 py-1.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold text-xs rounded-xl shadow flex items-center justify-center gap-1.5 transition-all active:scale-95"
              >
                <Users className="w-3.5 h-3.5" />
                <span>See {selectedCatWorkers.length} Available Workers</span>
                <ArrowDown className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setSelectedCategory('all')}
                className="px-2.5 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold border border-white/20 transition-all"
                title="Show all categories"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Categories Grid or Empty Search State */}
      {filteredCategories.length === 0 ? (
        <div className="p-6 text-center bg-white rounded-2xl border border-slate-200 shadow-sm space-y-2.5">
          <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center mx-auto">
            <Search className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-slate-800">
            No service categories match "{searchQuery}"
          </h4>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            Try searching for terms like "electrician", "plumber", "cleaner", or worker names.
          </p>
          <button
            onClick={() => setSearchQuery('')}
            className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow transition-colors"
          >
            Clear Search & View All Services
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
          {filteredCategories.map((cat) => {
            const IconComponent = iconMap[cat.icon] || Zap;
            const isSelected = selectedCategory === cat.id;
            const liveCount = categoryCounts[cat.id] || 0;

            const translatedName = t(`cat_${cat.id}`) !== `cat_${cat.id}` ? t(`cat_${cat.id}`) : cat.name;
            const translatedDesc = t(`cat_${cat.id}_desc`) !== `cat_${cat.id}_desc` ? t(`cat_${cat.id}_desc`) : cat.desc;

            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all duration-200 card-hover relative group ${
                  isSelected
                    ? 'border-teal-600 bg-teal-50/90 shadow-md ring-2 ring-teal-500/30'
                    : 'border-slate-200 bg-white hover:border-teal-300 hover:shadow-sm'
                }`}
              >
                {/* Active Selection Indicator */}
                {isSelected && (
                  <div className="absolute top-2 right-2 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                  </div>
                )}

                <div className="flex items-center justify-between mb-2">
                  <div
                    className={`p-2 rounded-xl transition-colors ${
                      isSelected
                        ? 'bg-teal-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-700 group-hover:bg-teal-100 group-hover:text-teal-800'
                    }`}
                  >
                    <IconComponent className="w-4.5 h-4.5" />
                  </div>

                  {!isSelected && (
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600`}>
                      {liveCount} {t('workersCount')}
                    </span>
                  )}
                </div>

                <div>
                  <h4 className="font-extrabold text-xs text-slate-900 leading-snug">
                    {translatedName}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                    {translatedDesc}
                  </p>

                  <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
                    <span className={isSelected ? 'text-teal-700' : 'text-slate-400 group-hover:text-teal-600'}>
                      {isSelected ? '✓ Showing Workers' : 'View Workers →'}
                    </span>
                    {isSelected && (
                      <span className="text-xs font-black text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                        {liveCount} Active
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
