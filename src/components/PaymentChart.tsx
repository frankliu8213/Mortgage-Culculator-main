import React, { useEffect, useState, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import type { PaymentSchedule } from '../types/mortgage';
import { useLanguage } from '../contexts/LanguageContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface PaymentChartProps {
  schedule: PaymentSchedule[];
  loanAmount: number;
}

const PaymentChart: React.FC<PaymentChartProps> = ({ schedule, loanAmount }) => {
  const { t } = useLanguage();
  const [isPrinting, setIsPrinting] = useState(false);
  const totalYears = Math.ceil(schedule.length / 12);
  const isMobile = window.innerWidth < 768;
  const chartRef = useRef<HTMLDivElement>(null);

  // Calculate optimal year interval for x-axis labels
  const yearInterval = Math.max(1, Math.ceil(totalYears / (isMobile ? 6 : 12)));

  useEffect(() => {
    const mediaQueryList = window.matchMedia('print');
    const handlePrintChange = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsPrinting(e.matches);
    };

    handlePrintChange(mediaQueryList);
    mediaQueryList.addEventListener('change', handlePrintChange);

    // Add click handler for mobile tooltip
    const handleClickOutside = (event: MouseEvent) => {
      if (chartRef.current && !chartRef.current.contains(event.target as Node)) {
        const chart = ChartJS.getChart(chartRef.current.querySelector('canvas'));
        if (chart) {
          chart.tooltip?.setActiveElements([], { x: 0, y: 0 });
          chart.update();
        }
      }
    };

    if (isMobile) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      mediaQueryList.removeEventListener('change', handlePrintChange);
      if (isMobile) {
        document.removeEventListener('click', handleClickOutside);
      }
    };
  }, [isMobile]);
  
  const yearlyData = [
    { remainingBalance: loanAmount, interest: 0 },
    ...Array.from({ length: totalYears }, (_, yearIndex) => {
      const monthIndex = (yearIndex + 1) * 12 - 1;
      if (monthIndex >= schedule.length) {
        return schedule[schedule.length - 1];
      }
      return schedule[monthIndex];
    })
  ];

  const cumulativeInterest = [0];
  for (let year = 1; year <= totalYears; year++) {
    const paymentsUpToYear = schedule.slice(0, Math.min(year * 12, schedule.length));
    const totalInterest = paymentsUpToYear.reduce((sum, payment) => sum + payment.interest, 0);
    cumulativeInterest.push(totalInterest);
  }

  const chartData = {
    labels: Array.from({ length: totalYears + 1 }, (_, i) => 
      i % yearInterval === 0 ? `${i}${t.chart.yearLabel}` : ''
    ),
    datasets: [
      {
        label: t.chart.remainingBalance,
        data: yearlyData.map(s => s.remainingBalance),
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        fill: true,
        tension: 0.4,
        borderWidth: isPrinting ? 1 : 2,
      },
      {
        label: t.chart.paidPrincipal,
        data: yearlyData.map(s => loanAmount - s.remainingBalance),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        fill: true,
        tension: 0.4,
        borderWidth: isPrinting ? 1 : 2,
      },
      {
        label: t.chart.paidInterest,
        data: cumulativeInterest,
        borderColor: 'rgb(244, 63, 94)',
        backgroundColor: 'rgba(244, 63, 94, 0.1)',
        fill: true,
        tension: 0.4,
        borderWidth: isPrinting ? 1 : 2,
      }
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: 'index' as const,
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          boxWidth: isPrinting ? 20 : (isMobile ? 8 : 40),
          padding: isPrinting ? 10 : (isMobile ? 8 : 10),
          font: {
            size: isPrinting ? 10 : (isMobile ? 10 : 12),
          },
        },
      },
      title: {
        display: true,
        text: t.chart.title,
        font: {
          size: isPrinting ? 12 : (isMobile ? 14 : 16),
          weight: 'bold' as const,
        },
        padding: isPrinting ? 15 : (isMobile ? 10 : 20),
      },
      tooltip: {
        enabled: !isPrinting,
        titleFont: {
          size: isMobile ? 10 : 12,
        },
        bodyFont: {
          size: isMobile ? 10 : 12,
        },
        callbacks: {
          label: (context: any) => {
            const value = context.raw;
            return `${context.dataset.label}: ¥${value.toLocaleString('zh-CN', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: !isPrinting,
          drawBorder: !isPrinting,
        },
        border: {
          display: isPrinting,
          width: 1,
        },
        ticks: {
          font: {
            size: isPrinting ? 10 : (isMobile ? 10 : 12),
          },
          maxRotation: 0,
          minRotation: 0,
          autoSkip: false,
          callback: (value: any, index: number) => {
            if (index % yearInterval === 0) {
              return `${index}${t.chart.yearLabel}`;
            }
            return '';
          }
        },
      },
      y: {
        grid: {
          display: !isPrinting,
          drawBorder: !isPrinting,
        },
        border: {
          display: isPrinting,
          width: 1,
        },
        ticks: {
          font: {
            size: isPrinting ? 10 : (isMobile ? 10 : 12),
          },
          callback: (value: number) => {
            if (!isPrinting && isMobile && value > 1000000) {
              return `¥${(value / 10000).toFixed(0)}万`;
            }
            return `¥${value.toLocaleString('zh-CN', {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })}`;
          },
        },
      },
    },
  };

  return (
    <div 
      ref={chartRef}
      className={`bg-white rounded-xl shadow-lg p-4 md:p-6 payment-chart ${
        isPrinting ? 'print:!w-[100%] print:!max-w-none print:!mx-0 print:!px-0' : ''
      }`}
    >
      <div className={`h-[300px] md:h-[400px] ${isPrinting ? 'print:!h-[500px]' : ''}`}>
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default PaymentChart;