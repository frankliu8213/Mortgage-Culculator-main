import { Language } from '../locales/translations';

const currencyFormats: Record<Language, { symbol: string, position: 'before' | 'after' }> = {
  en: { symbol: '$', position: 'before' },
  es: { symbol: '€', position: 'before' },
  fr: { symbol: '€', position: 'before' },
  ja: { symbol: '¥', position: 'before' },
  ko: { symbol: '₩', position: 'before' },
  zh: { symbol: '¥', position: 'before' }
};

export function formatCurrency(amount: number, language: Language): string {
  const format = currencyFormats[language];
  const formattedNumber = amount.toLocaleString(language, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  return format.position === 'before' 
    ? `${format.symbol}${formattedNumber}`
    : `${formattedNumber}${format.symbol}`;
}

export function formatCompactCurrency(amount: number, language: Language): string {
  const format = currencyFormats[language];
  
  if (amount >= 1000000) {
    const value = (amount / 1000000).toLocaleString(language, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 1
    });
    
    switch (language) {
      case 'ja':
        return `${format.symbol}${value}百万`;
      case 'ko':
        return `${format.symbol}${value}백만`;
      case 'zh':
        return `${format.symbol}${value}百万`;
      default:
        return `${format.symbol}${value}M`;
    }
  }

  if (amount >= 1000) {
    const value = (amount / 1000).toLocaleString(language, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 1
    });
    
    switch (language) {
      case 'ja':
        return `${format.symbol}${value}万`;
      case 'ko':
        return `${format.symbol}${value}만`;
      case 'zh':
        return `${format.symbol}${value}万`;
      default:
        return `${format.symbol}${value}K`;
    }
  }

  return formatCurrency(amount, language);
}