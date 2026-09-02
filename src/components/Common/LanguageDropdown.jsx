import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Globe, ChevronDown, Check } from 'lucide-react';

export const LanguageDropdown = ({ darkHeader = false }) => {
  const { lang, setLang } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const languages = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'hi', label: 'Hindi', native: 'हिंदी' },
    { code: 'mr', label: 'Marathi', native: 'मराठी' },
    { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
    { code: 'bn', label: 'Bengali', native: 'বাংলা' },
  ];

  const currentLangObj = languages.find((l) => l.code === lang) || languages[0];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 shadow-sm focus:outline-none ${
          darkHeader
            ? 'bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-white'
            : 'bg-slate-100 hover:bg-slate-200/80 border border-slate-200/90 text-slate-800'
        }`}
      >
        <Globe className={`w-3.5 h-3.5 shrink-0 ${darkHeader ? 'text-teal-400' : 'text-teal-600'}`} />
        <span className="font-bold text-[11px]">{currentLangObj.code.toUpperCase()}</span>
        <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${darkHeader ? 'text-slate-400' : 'text-slate-500'} ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-44 rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 shadow-2xl z-50 py-1.5 animate-fadeIn overflow-hidden text-white">
          <div className="px-3 py-1.5 border-b border-slate-800 text-[9px] font-extrabold uppercase tracking-wider text-slate-400">
            Select Language
          </div>

          <div className="p-1 space-y-0.5">
            {languages.map((l) => {
              const isSelected = l.code === lang;
              return (
                <button
                  key={l.code}
                  onClick={() => {
                    setLang(l.code);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs transition-all ${
                    isSelected
                      ? 'bg-teal-500/20 text-teal-300 font-bold border border-teal-500/30'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white font-medium'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>{l.native}</span>
                    <span className="text-[9px] text-slate-400 uppercase font-mono">({l.code})</span>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-teal-400" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
