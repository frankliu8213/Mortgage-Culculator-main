import React, { useState } from 'react';
import { Plus, Trash2, ArrowDown } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import type { MortgageEvent } from '../types/mortgage';
import { calculateTotalInterest } from '../utils/mortgageCalculations';

interface EventsSectionProps {
  events: MortgageEvent[];
  onEventsChange: (events: MortgageEvent[]) => void;
  totalMonths: number;
  initialMonthlyPayment: number;
  loanAmount: number;
  interestRate: number;
}

interface EventInput {
  month: string;
  value: string;
}

interface EventError {
  month?: string;
  value?: string;
}

const EventsSection: React.FC<EventsSectionProps> = ({ 
  events, 
  onEventsChange, 
  totalMonths,
  initialMonthlyPayment,
  loanAmount,
  interestRate
}) => {
  const { t, language } = useLanguage();
  const [inputs, setInputs] = useState<{ [key: number]: EventInput }>({});
  const [errors, setErrors] = useState<{ [key: number]: EventError }>({});

  const addEvent = (type: 'lumpSum' | 'rateChange' | 'termChange') => {
    const newEvent: MortgageEvent = {
      type,
      month: 1,
      value: type === 'lumpSum' ? 10000 : type === 'rateChange' ? interestRate : totalMonths - 12,
    };
    const newEvents = [...events, newEvent];
    onEventsChange(newEvents);
    
    setInputs(prev => ({
      ...prev,
      [newEvents.length - 1]: {
        month: '1',
        value: newEvent.value.toString()
      }
    }));
  };

  const validateAndUpdateEvent = (
    index: number,
    field: 'month' | 'value',
    inputValue: string,
    eventType: 'lumpSum' | 'rateChange' | 'termChange'
  ) => {
    setInputs(prev => ({
      ...prev,
      [index]: {
        ...prev[index] || {},
        [field]: inputValue
      }
    }));

    if (inputValue === '' || inputValue === '.') {
      setErrors(prev => ({
        ...prev,
        [index]: {
          ...prev[index],
          [field]: undefined
        }
      }));
      return;
    }

    let isValid = false;
    if (field === 'month') {
      isValid = /^\d+$/.test(inputValue);
      const monthValue = Number(inputValue);
      if (!isValid || monthValue < 1 || monthValue > totalMonths) {
        setErrors(prev => ({
          ...prev,
          [index]: {
            ...prev[index],
            [field]: `期数必须在1到${totalMonths}之间`
          }
        }));
        return;
      }
    } else {
      if (eventType === 'rateChange') {
        isValid = /^\d*\.?\d{0,4}$/.test(inputValue);
        const rateValue = Number(inputValue);
        if (!isValid || rateValue < 0 || rateValue > 100) {
          setErrors(prev => ({
            ...prev,
            [index]: {
              ...prev[index],
              [field]: '利率必须在0到100之间'
            }
          }));
          return;
        }
      } else if (eventType === 'termChange') {
        isValid = /^\d+$/.test(inputValue);
        const termValue = Number(inputValue);
        if (!isValid || termValue < 1 || termValue > totalMonths) {
          setErrors(prev => ({
            ...prev,
            [index]: {
              ...prev[index],
              [field]: `期数必须在1到${totalMonths}之间`
            }
          }));
          return;
        }
      } else {
        isValid = /^\d*\.?\d{0,2}$/.test(inputValue);
        if (!isValid) {
          setErrors(prev => ({
            ...prev,
            [index]: {
              ...prev[index],
              [field]: '请输入有效的金额（最多两位小数）'
            }
          }));
          return;
        }
      }
    }

    setErrors(prev => ({
      ...prev,
      [index]: {
        ...prev[index],
        [field]: undefined
      }
    }));

    const numValue = Number(inputValue);
    if (!isNaN(numValue)) {
      const newEvents = [...events];
      newEvents[index] = { ...newEvents[index], [field]: numValue };
      onEventsChange(newEvents);
    }
  };

  const removeEvent = (index: number) => {
    const newEvents = events.filter((_, i) => i !== index);
    onEventsChange(newEvents);
    
    const newInputs = { ...inputs };
    const newErrors = { ...errors };
    delete newInputs[index];
    delete newErrors[index];
    setInputs(newInputs);
    setErrors(newErrors);
  };

  const calculateRemainingBalance = (month: number) => {
    const monthlyRate = interestRate / 100 / 12;
    let balance = loanAmount;
    
    for (let i = 1; i < month; i++) {
      const interestPayment = balance * monthlyRate;
      const principalPayment = initialMonthlyPayment - interestPayment;
      balance -= principalPayment;
    }
    
    return Math.max(0, balance);
  };

  const calculateInterestChange = (event: MortgageEvent): number => {
    const remainingBalance = calculateRemainingBalance(event.month);
    const remainingMonths = totalMonths - event.month + 1;
    const monthlyRate = interestRate / 100 / 12;
    
    // Calculate original total interest for the remaining period
    const originalTotalInterest = calculateTotalInterest(
      remainingBalance,
      monthlyRate,
      remainingMonths
    );

    let newTotalInterest = 0;

    if (event.type === 'lumpSum') {
      const newBalance = remainingBalance - event.value;
      newTotalInterest = calculateTotalInterest(
        newBalance,
        monthlyRate,
        remainingMonths
      );
    } else if (event.type === 'rateChange') {
      const newMonthlyRate = event.value / 100 / 12;
      newTotalInterest = calculateTotalInterest(
        remainingBalance,
        newMonthlyRate,
        remainingMonths
      );
    } else if (event.type === 'termChange') {
      newTotalInterest = calculateTotalInterest(
        remainingBalance,
        monthlyRate,
        event.value
      );
    }

    return newTotalInterest - originalTotalInterest;
  };

  return (
    <div className="mb-8">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">{t.events.title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => addEvent('lumpSum')}
            className="px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            {t.events.lumpSum}
          </button>
          <button
            onClick={() => addEvent('rateChange')}
            className="px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            {t.events.rateChange}
          </button>
          <button
            onClick={() => addEvent('termChange')}
            className="px-4 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors flex items-center justify-center"
          >
            <ArrowDown className="w-4 h-4 mr-2" />
            {t.events.termChange}
          </button>
        </div>
      </div>

      {events.length > 0 ? (
        <div className="space-y-6">
          {events.map((event, index) => {
            const interestChange = calculateInterestChange(event);
            const currentInputs = inputs[index] || {
              month: event.month.toString(),
              value: event.value.toString()
            };
            const currentErrors = errors[index] || {};

            return (
              <div key={index} className="bg-gray-50 p-6 rounded-lg event-item">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700">
                      {t.events.month}
                      <input
                        type="text"
                        value={currentInputs.month}
                        onChange={(e) => validateAndUpdateEvent(index, 'month', e.target.value, event.type)}
                        className={`mt-1 block w-full rounded-md ${
                          currentErrors.month ? 'border-red-300' : 'border-gray-300'
                        } shadow-sm focus:border-indigo-500 focus:ring-indigo-500`}
                      />
                      {currentErrors.month && (
                        <p className="mt-1 text-sm text-red-600">{currentErrors.month}</p>
                      )}
                    </label>
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700">
                      {event.type === 'lumpSum' 
                        ? t.events.lumpSumLabel
                        : event.type === 'rateChange'
                          ? t.events.rateChangeLabel
                          : t.events.termChangeLabel}
                      <input
                        type="text"
                        value={currentInputs.value}
                        onChange={(e) => validateAndUpdateEvent(index, 'value', e.target.value, event.type)}
                        className={`mt-1 block w-full rounded-md ${
                          currentErrors.value ? 'border-red-300' : 'border-gray-300'
                        } shadow-sm focus:border-indigo-500 focus:ring-indigo-500`}
                      />
                      {currentErrors.value && (
                        <p className="mt-1 text-sm text-red-600">{currentErrors.value}</p>
                      )}
                    </label>
                  </div>
                  <button
                    onClick={() => removeEvent(index)}
                    className="p-2 text-red-600 hover:text-red-800 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                <div className="mt-2 text-sm">
                  <span className={`font-medium ${interestChange < 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {t.events.interestChange} {interestChange < 0 ? t.events.decrease : t.events.increase}
                    {' '}¥{Math.abs(interestChange).toLocaleString('zh-CN', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-gray-500 text-center py-4">{t.events.noEvents}</p>
      )}
    </div>
  );
};

export default EventsSection;