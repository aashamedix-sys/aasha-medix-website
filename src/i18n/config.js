import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslations from './locales/en.json';
import teTranslations from './locales/te.json';
import hiTranslations from './locales/hi.json';

const resources = {
  en: { translation: enTranslations },
  te: { translation: teTranslations },
  hi: { translation: hiTranslations }
};

// Safely get language from localStorage
const getInitialLanguage = () => {
  try {
    return localStorage.getItem('language') || 'en';
  } catch (e) {
    return 'en';
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: getInitialLanguage(),
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    },
    react: {
      useSuspense: false
    }
  });

export default i18n;
