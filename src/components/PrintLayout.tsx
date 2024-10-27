import React from 'react';
import type { PaymentSchedule, MortgageEvent } from '../types/mortgage';
import PrintPaymentChart from './PrintPaymentChart';
import { useLanguage } from '../contexts/LanguageContext';
import { formatCurrency } from '../utils/formatCurrency';

interface PrintLayoutProps {
  loanAmount: number;
  interestRate: number;
  loanTerm: number;
  schedule: PaymentSchedule[];
  events: MortgageEvent[];
  initialPayment: number;
  currentPayment: number;
  totalPayment: number;
  totalInterest: number;
  loanType: 'equalPayment' | 'equalPrincipal';
}

const PrintLayout: React.FC<PrintLayoutProps> = ({
  loanAmount,
  interestRate,
  loanTerm,
  schedule,
  events,
  initialPayment,
  currentPayment,
  totalPayment,
  totalInterest,
  loanType,
}) => {
  const { t, language } = useLanguage();

  const reportId = React.useMemo(() => {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return 'MR-' + Array.from({ length: 8 }, () => 
      chars[Math.floor(Math.random() * chars.length)]
    ).join('');
  }, []);

  const printTime = React.useMemo(() => {
    const now = new Date();
    return new Intl.DateTimeFormat(language, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).format(now);
  }, [language]);

  return (
    <div className="mortgage-report hidden">
      <div className="flex justify-between items-start mb-8">
        <div className="space-y-6">
          <h1 className="text-2xl font-bold text-gray-900">{t.title}</h1>
          <div className="space-y-2">
            <p className="text-sm text-gray-600">{t.report.property}</p>
            <div className="w-80 h-8 border-b border-gray-400"></div>
          </div>
        </div>
        <div className="text-sm text-gray-600 text-right">
          <p className="mb-1">{t.report.id}: {reportId}</p>
          <p>{t.report.generated}: {printTime}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
        <div>
          <p><strong>{t.inputs.loanAmount}:</strong> {formatCurrency(loanAmount, language)}</p>
          <p><strong>{t.inputs.interestRate}:</strong> {interestRate}%</p>
          <p><strong>{t.inputs.loanTerm}:</strong> {Math.floor(loanTerm / 12)} {t.inputs.years}</p>
          <p><strong>{t.inputs.loanType}:</strong> {loanType === 'equalPayment' ? t.inputs.equalPayment : t.inputs.equalPrincipal}</p>
        </div>
        <div>
          <p><strong>{t.results.initialPayment}:</strong> {formatCurrency(initialPayment, language)}</p>
          <p><strong>{t.results.totalPayment}:</strong> {formatCurrency(totalPayment, language)}</p>
          <p><strong>{t.results.totalInterest}:</strong> {formatCurrency(totalInterest, language)}</p>
        </div>
      </div>

      {events.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-2">{t.events.title}</h2>
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="text-left py-1">{t.events.month}</th>
                <th className="text-left py-1">{t.schedule.payment}</th>
                <th className="text-left py-1">{t.events.value}</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event, index) => (
                <tr key={index}>
                  <td className="py-1">{event.month}</td>
                  <td className="py-1">
                    {event.type === 'lumpSum' && t.events.lumpSum}
                    {event.type === 'rateChange' && t.events.rateChange}
                    {event.type === 'termChange' && t.events.termChange}
                  </td>
                  <td className="py-1">
                    {event.type === 'lumpSum' && formatCurrency(event.value, language)}
                    {event.type === 'rateChange' && `${event.value}%`}
                    {event.type === 'termChange' && `${event.value}${t.schedule.month}`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mb-6">
        <PrintPaymentChart 
          schedule={schedule} 
          loanAmount={loanAmount}
        />
      </div>

      <div className="print-schedule">
        <h2 className="text-lg font-bold mb-2">{t.schedule.title}</h2>
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr>
              <th className="text-left py-1 px-2 bg-gray-50">{t.schedule.month}</th>
              <th className="text-left py-1 px-2 bg-gray-50">{t.schedule.payment}</th>
              <th className="text-left py-1 px-2 bg-gray-50">{t.schedule.principal}</th>
              <th className="text-left py-1 px-2 bg-gray-50">{t.schedule.interest}</th>
              <th className="text-left py-1 px-2 bg-gray-50">{t.schedule.lumpSum}</th>
              <th className="text-left py-1 px-2 bg-gray-50">{t.schedule.remainingBalance}</th>
              <th className="text-left py-1 px-2 bg-gray-50">{t.schedule.totalPayment}</th>
              <th className="text-left py-1 px-2 bg-gray-50">{t.schedule.totalInterest}</th>
            </tr>
          </thead>
          <tbody>
            {schedule.map((item) => {
              const totalPayments = schedule
                .slice(0, item.month)
                .reduce((sum, payment) => sum + payment.payment + (payment.lumpSum || 0), 0);
              const totalInterest = schedule
                .slice(0, item.month)
                .reduce((sum, payment) => sum + payment.interest, 0);

              return (
                <tr key={item.month} className="border-b border-gray-200">
                  <td className="py-1 px-2">{item.month}</td>
                  <td className="py-1 px-2">{formatCurrency(item.payment, language)}</td>
                  <td className="py-1 px-2">{formatCurrency(item.principal, language)}</td>
                  <td className="py-1 px-2">{formatCurrency(item.interest, language)}</td>
                  <td className="py-1 px-2">{item.lumpSum ? formatCurrency(item.lumpSum, language) : '-'}</td>
                  <td className="py-1 px-2">{formatCurrency(item.remainingBalance, language)}</td>
                  <td className="py-1 px-2">{formatCurrency(totalPayments, language)}</td>
                  <td className="py-1 px-2">{formatCurrency(totalInterest, language)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-8 pt-4 border-t border-gray-300 text-sm text-gray-500 text-center">
        <p>{t.report.disclaimer}</p>
      </div>
    </div>
  );
};

export default PrintLayout;