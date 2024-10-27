import React from 'react';
import type { PaymentSchedule, LoanType } from '../types/mortgage';
import { useLanguage } from '../contexts/LanguageContext';
import { formatCurrency } from '../utils/formatCurrency';

interface ResultsSectionProps {
  schedule: PaymentSchedule[];
  loanAmount: number;
  loanType: LoanType;
}

const ResultsSection: React.FC<ResultsSectionProps> = ({ schedule, loanAmount, loanType }) => {
  const { t, language } = useLanguage();
  
  // Get the last payment record to get final cumulative totals
  const lastPayment = schedule[schedule.length - 1];
  
  // Calculate cumulative totals from the last payment
  const totalPayments = schedule
    .slice(0, lastPayment.month)
    .reduce((sum, payment) => sum + payment.payment + (payment.lumpSum || 0), 0);
  
  const totalInterest = schedule
    .slice(0, lastPayment.month)
    .reduce((sum, payment) => sum + payment.interest, 0);
    
  const initialMonthlyPayment = schedule[0]?.payment || 0;
  const currentMonthlyPayment = lastPayment?.payment || 0;

  return (
    <div className="bg-indigo-50 rounded-xl p-6 mb-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">{t.results.title}</h2>
      <div className={`grid grid-cols-1 ${loanType === 'equalPayment' ? 'md:grid-cols-4' : 'md:grid-cols-3'} gap-6`}>
        <div className="bg-white rounded-lg p-4 shadow">
          <p className="text-gray-600">{t.results.initialPayment}</p>
          <p className="text-2xl font-bold text-indigo-600">
            {formatCurrency(initialMonthlyPayment, language)}
          </p>
        </div>
        
        {loanType === 'equalPayment' && (
          <div className="bg-white rounded-lg p-4 shadow">
            <p className="text-gray-600">{t.results.currentPayment}</p>
            <p className="text-2xl font-bold text-green-600">
              {formatCurrency(currentMonthlyPayment, language)}
            </p>
          </div>
        )}

        <div className="bg-white rounded-lg p-4 shadow">
          <p className="text-gray-600">{t.results.totalPayment}</p>
          <p className="text-2xl font-bold text-indigo-600">
            {formatCurrency(totalPayments, language)}
          </p>
        </div>

        <div className="bg-white rounded-lg p-4 shadow">
          <p className="text-gray-600">{t.results.totalInterest}</p>
          <p className="text-2xl font-bold text-indigo-600">
            {formatCurrency(totalInterest, language)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResultsSection;