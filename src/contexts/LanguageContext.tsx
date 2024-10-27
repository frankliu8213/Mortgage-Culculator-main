import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, type Translation } from '../locales/translations';

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: Translation;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

interface LanguageProviderProps {
  children: React.ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  // Get user's browser language or default to English
  const getBrowserLanguage = (): string => {
    const browserLang = navigator.language.split('-')[0];
    return Object.keys(translations).includes(browserLang) ? browserLang : 'en';
  };

  const [language, setLanguage] = useState(getBrowserLanguage());
  const [t, setT] = useState<Translation>(translations[language as keyof typeof translations]);

  useEffect(() => {
    setT(translations[language as keyof typeof translations]);
  }, [language]);

  const value = {
    language,
    setLanguage,
    t
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}