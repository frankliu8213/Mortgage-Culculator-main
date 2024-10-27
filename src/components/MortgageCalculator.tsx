import React, { useState, useMemo } from 'react';
import { Home, HelpCircle, Printer, FileDown, Menu } from 'lucide-react';
import html2pdf from 'html2pdf.js';
import InputSection from './InputSection';
import EventsSection from './EventsSection';
import PaymentScheduleTable from './PaymentScheduleTable';
import PaymentChart from './PaymentChart';
import ResultsSection from './ResultsSection';
import LanguageSelector from './LanguageSelector';
import HelpDialog from './HelpDialog';
import PrintLayout from './PrintLayout';
import { useLanguage } from '../contexts/LanguageContext';
import { calculateMortgageSchedule } from '../utils/mortgageCalculations';
import type { MortgageEvent } from '../types/mortgage';

export const MortgageCalculator: React.FC = () => {
  const { t } = useLanguage();
  const [loanAmount, setLoanAmount] = useState<number>(1000000);
  const [interestRate, setInterestRate] = useState<number>(4.5);
  const [loanTerm, setLoanTerm] = useState<number>(360);
  const [loanType, setLoanType] = useState<'equalPayment' | 'equalPrincipal'>('equalPayment');
  const [events, setEvents] = useState<MortgageEvent[]>([]);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const schedule = useMemo(() => {
    return calculateMortgageSchedule(loanAmount, interestRate, loanTerm, events, loanType);
  }, [loanAmount, interestRate, loanTerm, events, loanType]);

  const initialMonthlyPayment = useMemo(() => {
    if (schedule.length > 0) {
      return schedule[0].payment;
    }
    return 0;
  }, [schedule]);

  const currentMonthlyPayment = useMemo(() => {
    if (schedule.length > 0) {
      return schedule[schedule.length - 1].payment;
    }
    return 0;
  }, [schedule]);

  const totalPayment = useMemo(() => {
    return schedule.reduce((sum, item) => sum + item.payment + (item.lumpSum || 0), 0);
  }, [schedule]);

  const totalInterest = useMemo(() => {
    return schedule.reduce((sum, item) => sum + item.interest, 0);
  }, [schedule]);

  const handlePrint = () => {
    window.print();
  };

  const handleGeneratePDF = async () => {
    if (isGeneratingPDF) return;

    try {
      setIsGeneratingPDF(true);
      setIsMenuOpen(false);

      const report = document.querySelector('.mortgage-report') as HTMLElement;
      if (!report) return;

      report.style.display = 'block';

      await new Promise(resolve => {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setTimeout(resolve, 500);
          });
        });
      });

      document.body.style.overflow = 'hidden';
      window.scrollTo(0, 0);

      const isMobile = window.innerWidth < 768;
      
      const reportId = 'MR-' + Array.from({ length: 8 }, () => 
        '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 36)]
      ).join('');

      const opt = {
        margin: isMobile ? 5 : 10,
        filename: `${t.title}-${reportId}.pdf`,
        image: { type: 'jpeg', quality: 0.95 },
        html2canvas: {
          scale: isMobile ? 1 : 2,
          logging: false,
          removeContainer: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          onclone: (clonedDoc: Document) => {
            const clonedReport = clonedDoc.querySelector('.mortgage-report') as HTMLElement;
            if (clonedReport) {
              clonedReport.style.display = 'block';
              clonedReport.style.backgroundColor = '#ffffff';
              clonedReport.style.margin = '0';
              clonedReport.style.padding = isMobile ? '5mm' : '10mm';
              clonedReport.style.width = isMobile ? '100%' : '210mm';
              clonedReport.style.maxWidth = '100%';
              clonedReport.style.boxSizing = 'border-box';
              clonedReport.style.position = 'relative';
              clonedReport.style.overflow = 'visible';

              if (isMobile) {
                const elements = clonedReport.getElementsByTagName('*');
                Array.from(elements).forEach(el => {
                  if (el instanceof HTMLElement) {
                    const fontSize = parseFloat(window.getComputedStyle(el).fontSize);
                    if (fontSize > 8) {
                      el.style.fontSize = `${Math.max(8, fontSize * 0.8)}px`;
                    }
                    el.style.wordBreak = 'break-word';
                    el.style.whiteSpace = 'normal';
                  }
                });

                const tables = clonedReport.getElementsByTagName('table');
                Array.from(tables).forEach(table => {
                  table.style.width = '100%';
                  table.style.fontSize = '8px';
                  table.style.borderCollapse = 'collapse';
                  
                  const cells = table.getElementsByTagName('td');
                  Array.from(cells).forEach(cell => {
                    cell.style.padding = '2px';
                  });
                });

                const charts = clonedReport.getElementsByClassName('print-chart');
                Array.from(charts).forEach(chart => {
                  if (chart instanceof HTMLElement) {
                    chart.style.width = '100%';
                    chart.style.height = 'auto';
                    chart.style.maxHeight = '200px';
                  }
                });
              }
            }
          }
        },
        jsPDF: {
          unit: 'mm',
          format: 'a4',
          orientation: 'portrait',
          compress: true
        }
      };

      await html2pdf().set(opt).from(report).save();

      document.body.style.overflow = '';
      report.style.display = 'none';
      window.scrollTo(0, 0);
    } catch (error) {
      console.error('PDF generation failed:', error);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
        <div className="flex items-center gap-3">
          <Home className="w-8 h-8 text-indigo-600" />
          <h1 className="text-3xl font-bold text-gray-900">{t.title}</h1>
        </div>

        <div className="hidden sm:flex items-center gap-4 print:hidden">
          <button
            onClick={handleGeneratePDF}
            disabled={isGeneratingPDF}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FileDown className="w-4 h-4" />
            {t.actions.generatePDF}
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Printer className="w-4 h-4" />
            {t.actions.printReport}
          </button>
          <button
            onClick={() => setIsHelpOpen(true)}
            className="p-2 text-gray-600 hover:text-indigo-600 transition-colors"
            aria-label={t.actions.help}
          >
            <HelpCircle className="w-6 h-6" />
          </button>
          <LanguageSelector />
        </div>

        <div className="sm:hidden flex justify-end print:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 text-gray-600 hover:text-indigo-600 transition-colors"
            aria-label="Menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {isMenuOpen && (
          <div className="sm:hidden fixed inset-0 z-50 bg-black bg-opacity-50 print:hidden">
            <div className="absolute right-0 top-0 h-full w-64 bg-white shadow-lg">
              <div className="p-4 space-y-4">
                <button
                  onClick={handleGeneratePDF}
                  disabled={isGeneratingPDF}
                  className="w-full flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FileDown className="w-4 h-4" />
                  {t.actions.generatePDF}
                </button>
                <button
                  onClick={() => {
                    handlePrint();
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <Printer className="w-4 h-4" />
                  {t.actions.printReport}
                </button>
                <button
                  onClick={() => {
                    setIsHelpOpen(true);
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <HelpCircle className="w-4 h-4" />
                  {t.actions.help}
                </button>
                <div className="px-4">
                  <LanguageSelector />
                </div>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  {t.actions.close}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <p className="text-sm text-gray-500 mb-8">{t.subtitle}</p>

      <div className="space-y-8">
        <InputSection
          loanAmount={loanAmount}
          interestRate={interestRate}
          loanTerm={loanTerm}
          loanType={loanType}
          onLoanAmountChange={setLoanAmount}
          onInterestRateChange={setInterestRate}
          onLoanTermChange={setLoanTerm}
          onLoanTypeChange={setLoanType}
        />

        <EventsSection
          events={events}
          onEventsChange={setEvents}
          totalMonths={loanTerm}
          initialMonthlyPayment={initialMonthlyPayment}
          loanAmount={loanAmount}
          interestRate={interestRate}
        />

        <ResultsSection
          schedule={schedule}
          loanAmount={loanAmount}
          loanType={loanType}
        />

        <PaymentChart
          schedule={schedule}
          loanAmount={loanAmount}
        />

        <PaymentScheduleTable schedule={schedule} />
      </div>

      <div className="hidden print:block">
        <PrintLayout
          loanAmount={loanAmount}
          interestRate={interestRate}
          loanTerm={loanTerm}
          schedule={schedule}
          events={events}
          initialPayment={initialMonthlyPayment}
          currentPayment={currentMonthlyPayment}
          totalPayment={totalPayment}
          totalInterest={totalInterest}
          loanType={loanType}
        />
      </div>

      <HelpDialog isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </div>
  );
};

export default MortgageCalculator;