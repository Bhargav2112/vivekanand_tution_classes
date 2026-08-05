import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files directly to avoid http backend for now (simpler setup)
import translationGU from './locales/gu/translation.json';
import translationEN from './locales/en/translation.json';

const resources = {
  en: {
    translation: translationEN
  },
  gu: {
    translation: translationGU
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'gu',
    debug: false,
    interpolation: {
      escapeValue: false, 
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    }
  });

export default i18n;
