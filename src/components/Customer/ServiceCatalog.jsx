import React from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { SERVICE_CATEGORIES } from '../../data/mockData';
import { Zap, Wrench, Hammer, Paintbrush, ChefHat, HeartHandshake, Car, Flower2, Sparkles, Tv, Grid } from 'lucide-react';

const iconMap = {
  Zap, Wrench, Hammer, Paintbrush, ChefHat, HeartHandshake, Car, Flower2, Sparkles, Tv
};

export const ServiceCatalog = () => {
  const { selectedCategory, setSelectedCategory, categoryCounts } = useApp();
  const { t } = useLanguage();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <Grid className="w-4 h-4 text-teal-600" />
          <span>{t('categoriesTitle')}</span>
        </h3>
        {selectedCategory !== 'all' && (
          <button
            onClick={() => setSelectedCategory('all')}
            className="text-xs text-teal-600 font-bold hover:underline"
          >
            {t('resetFilter')}
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {SERVICE_CATEGORIES.map((cat) => {
          const IconComponent = iconMap[cat.icon] || Zap;
          const isSelected = selectedCategory === cat.id;
          const liveCount = categoryCounts[cat.id] || 0;

          const translatedName = t(`cat_${cat.id}`) !== `cat_${cat.id}` ? t(`cat_${cat.id}`) : cat.name;
          const translatedDesc = t(`cat_${cat.id}_desc`) !== `cat_${cat.id}_desc` ? t(`cat_${cat.id}_desc`) : cat.desc;

          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(isSelected ? 'all' : cat.id)}
              className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all duration-200 card-hover ${
                isSelected
                  ? 'border-teal-600 bg-teal-50/80 shadow-md ring-2 ring-teal-500/20'
                  : 'border-slate-200 bg-white hover:border-teal-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2.5 rounded-xl ${isSelected ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-700'}`}>
                  <IconComponent className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                  {liveCount} {t('workersCount')}
                </span>
              </div>

              <div>
                <h4 className="font-bold text-xs text-slate-900 leading-snug">{translatedName}</h4>
                <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{translatedDesc}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
