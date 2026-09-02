import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Globe, Check, Sparkles } from 'lucide-react';

export const LanguageSelectModal = () => {
  const { lang, setLang, isLanguageModalOpen, closeLanguageModal } = useLanguage();

  if (!isLanguageModalOpen) return null;

  const languages = [
    { code: 'en', label: 'English', native: 'English', region: 'Pan India / Default', flag: '🇮🇳' },
    { code: 'hi', label: 'Hindi', native: 'हिन्दी', region: 'उत्तर व मध्य भारत', flag: '🇮🇳' },
    { code: 'mr', label: 'Marathi', native: 'मराठी', region: 'महाराष्ट्र', flag: '🇮🇳' },
    { code: 'bn', label: 'Bengali', native: 'বাংলা', region: 'পশ্চিমবঙ্গ ও ত্রিপুরা', flag: '🇮🇳' },
    { code: 'ta', label: 'Tamil', native: 'தமிழ்', region: 'தமிழ்நாடு', flag: '🇮🇳' },
    { code: 'te', label: 'Telugu', native: 'తెలుగు', region: 'ఆంధ్రప్రదేశ్ & తెలంగాణ', flag: '🇮🇳' },
    { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ', region: 'ಕರ್ನಾಟಕ', flag: '🇮🇳' },
    { code: 'gu', label: 'Gujarati', native: 'ગુજરાતી', region: 'ગુજરાત', flag: '🇮🇳' },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Banner */}
        <div className="bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 p-6 text-white text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-36 h-36 bg-teal-500/10 rounded-full blur-2xl pointer-events-none"></div>

          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-400 via-emerald-500 to-teal-600 text-slate-950 font-black text-xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-teal-500/30">
            🤝
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold border border-teal-500/30 mb-2">
            <Globe className="w-3.5 h-3.5 text-teal-400" />
            <span>Select Your Language / भाषा चुनें</span>
          </div>

          <h2 className="text-xl font-black tracking-tight text-white">
            Welcome to SahakarSeva
          </h2>
          <p className="text-xs text-slate-300 mt-1 font-medium">
            आपली भाषा निवडा • உங்கள் மொழியைத் தேர்ந்தெடுக்கவும்
          </p>
        </div>

        {/* Language Grid */}
        <div className="p-4 overflow-y-auto max-h-[55vh] space-y-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {languages.map((item) => {
              const isSelected = item.code === lang;
              return (
                <button
                  key={item.code}
                  onClick={() => setLang(item.code)}
                  className={`p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all duration-150 active:scale-98 ${
                    isSelected
                      ? 'border-teal-500 bg-teal-50/90 text-teal-950 ring-2 ring-teal-500/30 shadow-md font-bold'
                      : 'border-slate-200/90 bg-white hover:border-teal-300 hover:bg-slate-50 text-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xl shrink-0">{item.flag}</span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-sm text-slate-900 leading-none">
                          {item.native}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">
                          ({item.label})
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 font-medium mt-1 truncate">
                        {item.region}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 ml-2">
                    {isSelected ? (
                      <div className="w-6 h-6 rounded-full bg-teal-600 text-white flex items-center justify-center shadow">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-slate-300"></div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Action Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <p className="text-[11px] text-slate-500 font-medium">
            You can also change language later in Account settings.
          </p>
          <button
            onClick={closeLanguageModal}
            className="px-5 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 active:scale-95 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all shrink-0"
          >
            Continue / आगे बढ़ें →
          </button>
        </div>
      </div>
    </div>
  );
};
