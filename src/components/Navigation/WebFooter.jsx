import React from 'react';
import { Globe, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { SahakarLogo } from '../Common/SahakarLogo';

export const WebFooter = ({ setActiveTab }) => {
  const { t, openLanguageModal, lang } = useLanguage();
  const { setEmergencyModalOpen } = useApp();
  const { user, isAuthenticated } = useAuth();

  const isCustomer = !isAuthenticated || user?.role === 'customer';

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 text-xs font-sans mt-auto">
      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <SahakarLogo className="w-8 h-8 shrink-0" />
              <span className="text-lg font-black text-white tracking-tight">
                Sahakar<span className="text-teal-400">Seva</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              {t('footerDesc')}
            </p>
          </div>

          {/* Quick Navigation */}
          <div className="space-y-2">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">{t('navigation')}</h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button onClick={() => setActiveTab && setActiveTab('home')} className="hover:text-teal-400 transition-colors">
                  {t('findServicesWorkers')}
                </button>
              </li>
              {isCustomer && (
                <>
                  <li>
                    <button onClick={() => setActiveTab && setActiveTab('bookings')} className="hover:text-teal-400 transition-colors">
                      {t('myBookings')}
                    </button>
                  </li>
                  <li>
                    <button onClick={() => setEmergencyModalOpen(true)} className="text-red-400 hover:text-red-300 transition-colors font-medium">
                      {t('emergencyRequest')}
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Language & Settings */}
          <div className="space-y-2">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">{t('preferences')}</h4>
            <button
              onClick={openLanguageModal}
              className="px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs text-teal-400 flex items-center gap-2 font-bold transition-colors"
            >
              <Globe className="w-4 h-4" />
              <span>{t('changeLanguage')} ({lang.toUpperCase()})</span>
            </button>
          </div>

        </div>
      </div>

      {/* Bottom Legal / Copyright */}
      <div className="border-t border-slate-900 bg-slate-950 px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500">
          <p>© 2026 {t('appName')}. {t('allRightsReserved')}</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-400 cursor-pointer">{t('termsOfService')}</span>
            <span>•</span>
            <span className="hover:text-slate-400 cursor-pointer">{t('privacyPolicy')}</span>
            <span>•</span>
            <span className="hover:text-slate-400 cursor-pointer">{t('helpFaq')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
