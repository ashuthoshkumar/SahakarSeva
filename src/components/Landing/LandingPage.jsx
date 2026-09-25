import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import { 
  ShieldCheck, Zap, ArrowRight, UserCheck, Wrench, 
  Hammer, HeartHandshake, ChefHat, Tv, AlertTriangle, 
  CheckCircle2, Clock, Search, MapPin
} from 'lucide-react';
import { translateCategory } from '../../utils/translateHelpers';
import { SERVICE_CATEGORIES } from '../../data/mockData';

export const LandingPage = ({ setActiveTab }) => {
  const { openAuthModal } = useAuth();
  const { t } = useLanguage();
  const { setSelectedCategory, setEmergencyModalOpen, workers } = useApp();

  const iconMap = {
    electrician: Zap,
    plumber: Wrench,
    carpenter: Hammer,
    caregiver: HeartHandshake,
    domestic_helper: ChefHat,
    technician: Tv,
  };

  const handleCategorySelect = (catId) => {
    setSelectedCategory(catId);
    openAuthModal('register_customer');
  };

  return (
    <div className="space-y-12 font-sans text-slate-800 pb-12">
      
      {/* 1. CLEAN HERO SECTION */}
      <section className="relative bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 text-white rounded-3xl p-6 sm:p-10 lg:p-12 shadow-xl overflow-hidden border border-slate-800">
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Heading & CTAs */}
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold border border-teal-500/40">
              <span>{t('onDemandLocalServices')}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
              {t('heroMainHeading')} <span className="text-teal-400">{t('heroMainHighlight')}</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
              {t('heroMainDesc')}
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                onClick={() => openAuthModal('register_customer')}
                className="py-3.5 px-6 bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-sm rounded-2xl shadow-lg shadow-teal-500/20 transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <span>{t('findServicesAndBook')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => openAuthModal('register_worker')}
                className="py-3.5 px-5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm rounded-2xl border border-slate-700 transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <UserCheck className="w-4 h-4 text-teal-400" />
                <span>{t('registerAsWorker')}</span>
              </button>

              <button
                onClick={() => setEmergencyModalOpen(true)}
                className="py-3.5 px-5 bg-red-600 hover:bg-red-500 text-white font-bold text-sm rounded-2xl transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <AlertTriangle className="w-4 h-4" />
                <span>{t('emergencyRequest')}</span>
              </button>
            </div>
          </div>

          {/* Right Column: Clean Search & Quick Category Picker */}
          <div className="lg:col-span-5">
            <div className="bg-slate-800/90 backdrop-blur-xl border border-slate-700 rounded-3xl p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-700/80 pb-3">
                <span className="text-xs font-bold text-slate-300">{t('quickServiceSelection')}</span>
                <span className="text-xs text-teal-400 font-bold">{workers.length} {t('workersAvailable')}</span>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {SERVICE_CATEGORIES.slice(0, 6).map((cat) => {
                  const Icon = iconMap[cat.id] || Wrench;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => handleCategorySelect(cat.id)}
                      className="p-3 rounded-2xl bg-slate-900/90 hover:bg-slate-700/80 border border-slate-700/70 text-left transition-all group flex items-center gap-2.5"
                    >
                      <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400 group-hover:bg-teal-500 group-hover:text-slate-950 transition-colors shrink-0">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold text-slate-200 group-hover:text-white truncate">
                        {translateCategory(cat.id, t)}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="pt-2 text-center">
                <button
                  onClick={() => openAuthModal('register_customer')}
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-700 text-teal-300 text-xs font-bold rounded-xl border border-slate-700 transition-colors flex items-center justify-center gap-1.5"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>{t('browseAllCategories')}</span>
                </button>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. REAL SERVICE CATEGORIES */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">{t('serviceCategories')}</span>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
              {t('popularHomeServices')}
            </h2>
          </div>
          <button
            onClick={() => openAuthModal('register_customer')}
            className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1"
          >
            <span>{t('viewAllCategories')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SERVICE_CATEGORIES.slice(0, 6).map((cat) => {
            const Icon = iconMap[cat.id] || Wrench;
            const categoryDesc = t(`cat_${cat.id}_desc`) !== `cat_${cat.id}_desc` ? t(`cat_${cat.id}_desc`) : cat.desc;
            return (
              <div
                key={cat.id}
                onClick={() => handleCategorySelect(cat.id)}
                className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="p-3 rounded-2xl bg-teal-50 text-teal-700 w-fit mb-3 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-extrabold text-base text-slate-900 group-hover:text-teal-700 transition-colors">
                    {translateCategory(cat.id, t)}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {categoryDesc}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400">{t('directBooking')}</span>
                  <button className="px-3 py-1.5 bg-slate-100 group-hover:bg-teal-600 group-hover:text-white text-slate-700 font-bold text-xs rounded-xl transition-colors flex items-center gap-1">
                    <span>{t('select')}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. HOW IT WORKS (AUTHENTIC 3-STEP FLOW) */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">{t('simpleProcess')}</span>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            {t('howSahakarSevaWorks')}
          </h2>
          <p className="text-xs text-slate-500">
            {t('howItWorksDesc')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
            <span className="w-8 h-8 rounded-xl bg-teal-100 text-teal-800 font-black text-xs flex items-center justify-center">
              1
            </span>
            <h3 className="font-bold text-sm text-slate-900">{t('step1Title')}</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              {t('step1Desc')}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
            <span className="w-8 h-8 rounded-xl bg-teal-100 text-teal-800 font-black text-xs flex items-center justify-center">
              2
            </span>
            <h3 className="font-bold text-sm text-slate-900">{t('step2Title')}</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              {t('step2Desc')}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
            <span className="w-8 h-8 rounded-xl bg-teal-100 text-teal-800 font-black text-xs flex items-center justify-center">
              3
            </span>
            <h3 className="font-bold text-sm text-slate-900">{t('step3Title')}</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              {t('step3Desc')}
            </p>
          </div>
        </div>
      </section>

      {/* 4. WORKER CALL TO ACTION */}
      <section className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-800">
        <div className="space-y-2 text-center md:text-left">
          <h2 className="text-2xl font-black tracking-tight text-white">
            {t('areYouTradesperson')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-lg">
            {t('tradespersonDesc')}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => openAuthModal('register_worker')}
            className="px-6 py-3.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs rounded-2xl shadow transition-transform active:scale-95"
          >
            {t('registerAsWorker')}
          </button>
          <button
            onClick={() => openAuthModal('login')}
            className="px-5 py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-2xl border border-slate-700 transition-colors"
          >
            {t('signIn')}
          </button>
        </div>
      </section>

    </div>
  );
};
