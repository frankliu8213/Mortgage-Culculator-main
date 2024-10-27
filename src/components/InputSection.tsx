import React, { useState } from 'react';
import { DollarSign, Clock, Percent, CreditCard } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface InputSectionProps {
  loanAmount: number;
  interestRate: number;
  loanTerm: number;
  loanType: 'equalPayment' | 'equalPrincipal';
  onLoanAmountChange: (value: number) => void;
  onInterestRateChange: (value: number) => void;
  onLoanTermChange: (value: number) => void;
  onLoanTypeChange: (type: 'equalPayment' | 'equalPrincipal') => void;
}

const InputSection: React.FC<InputSectionProps> = ({
  loanAmount,
  interestRate,
  loanTerm,
  loanType,
  onLoanAmountChange,
  onInterestRateChange,
  onLoanTermChange,
  onLoanTypeChange,
}) => {
  const { t } = useLanguage();
  
  const [inputs, setInputs] = useState({
    loanAmount: loanAmount.toString(),
    interestRate: interestRate.toString(),
  });
  
  const [errors, setErrors] = useState<{
    loanAmount?: string;
    interestRate?: string;
  }>({});
  
  const loanTermYears = Math.floor(loanTerm / 12);

  const handleLoanAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputs(prev => ({ ...prev, loanAmount: value }));
    
    if (value === '' || value === '.') {
      onLoanAmountChange(0);
      setErrors(prev => ({ ...prev, loanAmount: undefined }));
      return;
    }
    
    // Allow numbers with up to 2 decimal places
    if (!/^\d*\.?\d{0,2}$/.test(value)) {
      setErrors(prev => ({ ...prev, loanAmount: 'Please enter a valid number with up to 2 decimal places' }));
      return;
    }
    
    const numValue = Number(value);
    if (isNaN(numValue)) {
      setErrors(prev => ({ ...prev, loanAmount: 'Please enter a valid number' }));
      return;
    }
    
    setErrors(prev => ({ ...prev, loanAmount: undefined }));
    onLoanAmountChange(numValue);
  };

  const handleInterestRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputs(prev => ({ ...prev, interestRate: value }));
    
    if (value === '' || value === '.') {
      onInterestRateChange(0);
      setErrors(prev => ({ ...prev, interestRate: undefined }));
      return;
    }
    
    // Allow numbers with up to 4 decimal places for interest rate
    if (!/^\d*\.?\d{0,4}$/.test(value)) {
      setErrors(prev => ({ ...prev, interestRate: 'Please enter a valid number with up to 4 decimal places' }));
      return;
    }
    
    const numValue = Number(value);
    if (isNaN(numValue)) {
      setErrors(prev => ({ ...prev, interestRate: 'Please enter a valid number' }));
      return;
    }
    
    setErrors(prev => ({ ...prev, interestRate: undefined }));
    onInterestRateChange(numValue);
  };

  const termOptions = [1, 2, 3, 4, 5, 10, 15, 20, 25, 30].map(years => ({
    value: years * 12,
    label: `${years} ${t.inputs.years}`
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
      <div className="space-y-2">
        <label className="block">
          <span className="flex items-center text-gray-700 mb-2">
            <DollarSign className="w-4 h-4 mr-2" />
            {t.inputs.loanAmount}
          </span>
          <input
            type="text"
            value={inputs.loanAmount}
            onChange={handleLoanAmountChange}
            className={`w-full px-4 py-2 rounded-lg border ${
              errors.loanAmount ? 'border-red-500' : 'border-gray-300'
            } focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
            placeholder={t.inputs.loanAmount}
          />
        </label>
        {errors.loanAmount && (
          <p className="text-red-500 text-sm">{errors.loanAmount}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="block">
          <span className="flex items-center text-gray-700 mb-2">
            <Percent className="w-4 h-4 mr-2" />
            {t.inputs.interestRate}
          </span>
          <input
            type="text"
            value={inputs.interestRate}
            onChange={handleInterestRateChange}
            className={`w-full px-4 py-2 rounded-lg border ${
              errors.interestRate ? 'border-red-500' : 'border-gray-300'
            } focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
            placeholder={t.inputs.interestRate}
          />
        </label>
        {errors.interestRate && (
          <p className="text-red-500 text-sm">{errors.interestRate}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="block">
          <span className="flex items-center text-gray-700 mb-2">
            <Clock className="w-4 h-4 mr-2" />
            {t.inputs.loanTerm}
          </span>
          <select
            value={loanTermYears * 12}
            onChange={(e) => onLoanTermChange(Number(e.target.value))}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            {termOptions.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="space-y-2">
        <label className="block">
          <span className="flex items-center text-gray-700 mb-2">
            <CreditCard className="w-4 h-4 mr-2" />
            {t.inputs.loanType}
          </span>
          <select
            value={loanType}
            onChange={(e) => onLoanTypeChange(e.target.value as 'equalPayment' | 'equalPrincipal')}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="equalPayment">{t.inputs.equalPayment}</option>
            <option value="equalPrincipal">{t.inputs.equalPrincipal}</option>
          </select>
        </label>
      </div>
    </div>
  );
};

export default InputSection;