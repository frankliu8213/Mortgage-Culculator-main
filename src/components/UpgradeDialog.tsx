import React from 'react';
import { X, Check } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface UpgradeDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const UpgradeDialog: React.FC<UpgradeDialogProps> = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  
  return (
    <div 
      className={`fixed inset-0 z-50 overflow-y-auto ${isOpen ? 'block' : 'hidden'}`}
      aria-modal="true"
      role="dialog"
    >
      <div className="flex min-h-full items-center justify-center p-4 text-center">
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" 
          onClick={onClose}
        />
        
        <div className="relative w-full max-w-2xl transform overflow-hidden bg-white rounded-lg p-6 text-left shadow-xl transition-all">
          <div className="absolute right-4 top-4">
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {t.upgrade.title}
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">
                {t.upgrade.features}
              </h3>
              {Object.entries(t.upgrade.featureList).map(([key, text]) => (
                <div key={key} className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>{text}</span>
                </div>
              ))}
            </div>

            <div className="space-y-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-indigo-600">
                  {t.upgrade.pricing.amount}
                  <span className="text-lg text-gray-500">
                    {t.upgrade.pricing.period}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  {t.upgrade.pricing.cancelAnytime}
                </p>
              </div>
              
              <button
                onClick={() => window.open('https://example.com/upgrade', '_blank')}
                className="w-full py-3 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                {t.upgrade.ctaButton}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpgradeDialog; 