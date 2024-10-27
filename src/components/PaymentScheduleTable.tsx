import React, { useState, useEffect } from 'react';
import type { PaymentSchedule } from '../types/mortgage';
import { useLanguage } from '../contexts/LanguageContext';
import { formatCurrency } from '../utils/formatCurrency';

interface PaymentScheduleTableProps {
  schedule: PaymentSchedule[];
}

const PaymentScheduleTable: React.FC<PaymentScheduleTableProps> = ({ schedule }) => {
  const { t, language } = useLanguage();
  const [currentPage, setCurrentPage] = useState(1);
  const [isPrinting, setIsPrinting] = useState(false);
  const itemsPerPage = 12;

  useEffect(() => {
    const mediaQueryList = window.matchMedia('print');
    const handlePrintChange = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsPrinting(e.matches);
    };

    // Set initial value
    handlePrintChange(mediaQueryList);

    // Add listener for changes
    mediaQueryList.addEventListener('change', handlePrintChange);

    // Cleanup
    return () => {
      mediaQueryList.removeEventListener('change', handlePrintChange);
    };
  }, []);

  useEffect(() => {
    const beforePrint = () => setIsPrinting(true);
    const afterPrint = () => setIsPrinting(false);

    window.addEventListener('beforeprint', beforePrint);
    window.addEventListener('afterprint', afterPrint);

    return () => {
      window.removeEventListener('beforeprint', beforePrint);
      window.removeEventListener('afterprint', afterPrint);
    };
  }, []);

  const totalPages = Math.ceil(schedule.length / itemsPerPage);
  const startIndex = isPrinting ? 0 : (currentPage - 1) * itemsPerPage;
  const endIndex = isPrinting ? schedule.length : Math.min(startIndex + itemsPerPage, schedule.length);
  const displayedItems = isPrinting ? schedule : schedule.slice(startIndex, endIndex);

  const calculateCumulativeTotals = (month: number) => {
    const paymentsUpToMonth = schedule.slice(0, month);
    const totalPayments = paymentsUpToMonth.reduce((sum, item) => sum + item.payment + (item.lumpSum || 0), 0);
    const totalInterest = paymentsUpToMonth.reduce((sum, item) => sum + item.interest, 0);
    return { totalPayments, totalInterest };
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mt-8 payment-schedule">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">{t.schedule.title}</h2>
      
      <div className="overflow-x-auto print:overflow-visible">
        <table className="min-w-full divide-y divide-gray-200 print:divide-gray-400">
          <thead className="bg-gray-50 print:bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider print:text-black print:font-bold">
                {t.schedule.month}
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider print:text-black print:font-bold">
                {t.schedule.payment}
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider print:text-black print:font-bold">
                {t.schedule.principal}
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider print:text-black print:font-bold">
                {t.schedule.interest}
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider print:text-black print:font-bold">
                {t.schedule.lumpSum}
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider print:text-black print:font-bold">
                {t.schedule.remainingBalance}
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider print:text-black print:font-bold">
                {t.schedule.totalPayment}
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider print:text-black print:font-bold">
                {t.schedule.totalInterest}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 print:divide-gray-300">
            {displayedItems.map((item) => {
              const { totalPayments, totalInterest } = calculateCumulativeTotals(item.month);
              return (
                <tr key={item.month} className="hover:bg-gray-50 print:hover:bg-transparent">
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 print:py-2">
                    {item.month}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 print:py-2">
                    {formatCurrency(item.payment, language)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 print:py-2">
                    {formatCurrency(item.principal, language)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 print:py-2">
                    {formatCurrency(item.interest, language)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-green-600 print:text-black print:py-2">
                    {item.lumpSum ? formatCurrency(item.lumpSum, language) : '-'}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 print:py-2">
                    {formatCurrency(item.remainingBalance, language)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-indigo-600 print:text-black print:py-2">
                    {formatCurrency(totalPayments, language)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-rose-600 print:text-black print:py-2">
                    {formatCurrency(totalInterest, language)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between print:hidden">
        <div className="text-sm text-gray-700">
          {t.schedule.showing} {startIndex + 1} {t.schedule.to} {Math.min(endIndex, schedule.length)} {t.schedule.of} {schedule.length} {t.schedule.entries}
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t.schedule.prev}
          </button>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t.schedule.next}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentScheduleTable;