import React from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import type { Language } from '../locales/translations';

const LanguageSelector: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const languages: Language[] = ['en', 'zh', 'es', 'fr', 'ja', 'ko'];

  return (
    <div className="relative inline-block w-full sm:w-auto">
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value as Language)}
        className="w-full appearance-none bg-white pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent cursor-pointer"
      >
        {languages.map((lang) => (
          <option key={lang} value={lang}>
            {t.languages[lang]}
          </option>
        ))}
      </select>
      <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
    </div>
  );
};

export default LanguageSelector;