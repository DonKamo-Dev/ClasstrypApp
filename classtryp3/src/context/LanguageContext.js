import { createContext, useContext, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { translations } from '../i18n/translations';

const LanguageContext = createContext({});

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('en');

  async function changeLanguage(lang) {
    setLanguage(lang);
    await AsyncStorage.setItem('app_language', lang);
  }

  function t(path) {
    const keys = path.split('.');
    let value = translations[language];
    for (const key of keys) {
      value = value?.[key];
    }
    return value ?? path;
  }

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
