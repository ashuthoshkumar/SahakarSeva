import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { 
  ShieldCheck, HeartHandshake, Zap, ArrowRight, 
  UserCheck, Lock, Sparkles, Wrench, Hammer, 
  ChefHat, Tv, Camera, CheckCircle2 
} from 'lucide-react';
import { translateCategory } from '../../utils/translateHelpers';

export const LandingPage = () => {
  const { openAuthModal } = useAuth();
  const { t, lang } = useLanguage();

  const serviceCategories = [
    { id: 'electrician', icon: Zap, bg: 'bg-amber-50 text-amber-600 border-amber-200' },
    { id: 'plumber', icon: Wrench, bg: 'bg-blue-50 text-blue-600 border-blue-200' },
    { id: 'carpenter', icon: Hammer, bg: 'bg-orange-50 text-orange-600 border-orange-200' },
    { id: 'caregiver', icon: HeartHandshake, bg: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
    { id: 'domestic_helper', icon: ChefHat, bg: 'bg-purple-50 text-purple-600 border-purple-200' },
    { id: 'technician', icon: Tv, bg: 'bg-teal-50 text-teal-600 border-teal-200' },
  ];

  const highlights = [
    {
      icon: ShieldCheck,
      title: t('aadhaarVerifiedTitle') || 'Aadhaar & NCCT Verified',
      desc: t('aadhaarVerifiedDesc') || '100% background-checked skilled workers from certified cooperatives.',
      color: 'text-teal-600 bg-teal-50 border-teal-200'
    },
    {
      icon: HeartHandshake,
      title: t('fairWagesTitle') || 'Fair Wages, No Exploitation',
      desc: t('fairWagesDesc') || '100% direct payouts to workers with pension and welfare fund support.',
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200'
    },
    {
      icon: Camera,
      title: t('realPhotoProofTitle') || 'Real Photo Proof & Escrow',
      desc: t('realPhotoProofDesc') || 'Inspect completed work photos before payment release via UPI QR.',
      color: 'text-blue-600 bg-blue-50 border-blue-200'
    }
  ];

  return (
    <div className="space-y-6 font-sans text-slate-800 pb-6">
      
      {/* 1. CLEAN, SPACIOUS HERO BANNER */}
      <section className="relative bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl overflow-hidden border border-slate-800/80">
        <div className="absolute top-0 right-0 w-56 h-56 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 space-y-4">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold border border-teal-500/30">
            <Sparkles className="w-3.5 h-3.5 text-teal-400 shrink-0" />
            <span>{t('cooperativeGigWorkforce') || 'Cooperative Workforce'}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight">
            {t('trustedServicesTitle') || 'Trusted Home & Community Services'}
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed max-w-sm">
            {t('trustedServicesDesc') || 'Book certified local electricians, plumbers, caregivers, and technicians with transparent rates and live GPS dispatch.'}
          </p>

          {/* PRIMARY ACTION BUTTONS */}
          <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
            <button
              onClick={() => openAuthModal('register_customer')}
              className="w-full py-3.5 px-5 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 active:scale-95 text-slate-950 font-black text-xs rounded-2xl shadow-lg shadow-teal-500/20 transition-all flex items-center justify-center gap-2"
            >
              <span>{t('bookServiceBtn') || 'Book a Service'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => openAuthModal('register_worker')}
              className="w-full py-3.5 px-4 bg-slate-900/90 hover:bg-slate-800 active:scale-95 text-white font-bold text-xs rounded-2xl border border-slate-700 transition-all flex items-center justify-center gap-2"
            >
              <UserCheck className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{t('registerAsWorkerBtn') || 'Register as Worker'}</span>
            </button>
          </div>

        </div>
      </section>

      {/* 2. POPULAR SERVICES - CLEAN 2-COLUMN GRID */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
            {t('popularServices') || 'Popular Services'}
          </h2>
          <button
            onClick={() => openAuthModal('register_customer')}
            className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1"
          >
            <span>{t('viewAll') || 'View All'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {serviceCategories.map((cat) => {
            const Icon = cat.icon;
            const catName = translateCategory(cat.id, t);
            return (
              <button
                key={cat.id}
                onClick={() => openAuthModal('register_customer')}
                className="p-3.5 bg-white rounded-2xl border border-slate-200/90 hover:border-teal-400 shadow-sm hover:shadow-md transition-all text-left flex items-center gap-3 group active:scale-95"
              >
                <div className={`p-2.5 rounded-xl border ${cat.bg} shrink-0 transition-transform group-hover:scale-105`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-xs text-slate-900 leading-snug group-hover:text-teal-700 transition-colors truncate">
                    {catName}
                  </h3>
                  <p className="text-[10px] text-slate-400 font-medium">{t('onDemand') || 'On-demand'}</p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. WHY SAHAKARSEVA - 3 SIMPLE HIGHLIGHTS */}
      <section className="space-y-3">
        <h2 className="text-base font-extrabold text-slate-900 tracking-tight px-1">
          {t('whySahakarSeva') || 'Why SahakarSeva?'}
        </h2>

        <div className="space-y-2.5">
          {highlights.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-start gap-3"
              >
                <div className={`p-2.5 rounded-xl border ${item.color} shrink-0 mt-0.5`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="space-y-0.5 min-w-0">
                  <h3 className="font-bold text-xs text-slate-900">{item.title}</h3>
                  <p className="text-[11px] text-slate-500 leading-snug font-medium">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. CLEAN SIGN IN BAR AT BOTTOM */}
      <section className="bg-slate-100 rounded-2xl p-4 border border-slate-200 flex items-center justify-between gap-3">
        <div>
          <p className="font-bold text-xs text-slate-900">{t('alreadyMember') || 'Already a Member?'}</p>
          <p className="text-[11px] text-slate-500 font-medium">{t('alreadyMemberDesc') || 'Sign in to your customer or worker dashboard'}</p>
        </div>
        <button
          onClick={() => openAuthModal('login')}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 active:scale-95 text-white font-extrabold text-xs rounded-xl shadow transition-all flex items-center gap-1.5 shrink-0"
        >
          <Lock className="w-3.5 h-3.5 text-teal-400" />
          <span>{t('signIn') || 'Sign In'}</span>
        </button>
      </section>

    </div>
  );
};

