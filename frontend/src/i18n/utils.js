import { LOCALES } from './locales';

// Helper function to get browser locale
export const getBrowserLocale = () => {
  const browserLocale = navigator.language || navigator.userLanguage;

  // Check if browser locale matches our supported locales
  if (browserLocale.startsWith('hi')) {
    return LOCALES.HINDI;
  }

  // Default to English for any other locale
  return LOCALES.ENGLISH;
};

// Helper function to validate locale
export const isValidLocale = locale => {
  return Object.values(LOCALES).includes(locale);
};

// Helper function to get locale from localStorage with fallback
export const getStoredLocale = () => {
  try {
    const storedLocale = localStorage.getItem('app-locale');
    if (storedLocale && isValidLocale(storedLocale)) {
      return storedLocale;
    }
  } catch (error) {
    console.warn('Could not access localStorage:', error);
  }

  return getBrowserLocale();
};

// Helper function to store locale in localStorage
export const storeLocale = locale => {
  try {
    if (isValidLocale(locale)) {
      localStorage.setItem('app-locale', locale);
    }
  } catch (error) {
    console.warn('Could not store locale in localStorage:', error);
  }
};
