import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../data/translations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  // Read saved language or default to 'en'
  const [lang, setLangState] = useState(() => {
    try {
      return localStorage.getItem('sahakar_lang') || 'en';
    } catch {
      return 'en';
    }
  });

  // Modal open if user hasn't explicitly chosen language yet, or if manually opened
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(() => {
    try {
      return !localStorage.getItem('sahakar_lang_chosen');
    } catch {
      return true;
    }
  });

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
    }
  }, [lang]);

  const t = (key, fallback) => {
    const val = translations[lang]?.[key];
    if (val !== undefined && val !== '') return val;
    const enVal = translations['en']?.[key];
    if (enVal !== undefined && enVal !== '') return enVal;
    return fallback !== undefined ? fallback : key;
  };

  const selectLanguage = (newLang) => {
    if (translations[newLang]) {
      setLangState(newLang);
      try {
        localStorage.setItem('sahakar_lang', newLang);
        localStorage.setItem('sahakar_lang_chosen', 'true');
      } catch (e) {
        console.warn('LocalStorage error:', e);
      }
      setIsLanguageModalOpen(false);
    }
  };

  const openLanguageModal = () => setIsLanguageModalOpen(true);
  const closeLanguageModal = () => setIsLanguageModalOpen(false);

  return (
    <LanguageContext.Provider value={{
      lang,
      setLang: selectLanguage,
      t,
      isLanguageModalOpen,
      openLanguageModal,
      closeLanguageModal
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);

