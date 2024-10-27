import React from 'react';
import type { PaymentSchedule } from '../types/mortgage';
import { useLanguage } from '../contexts/LanguageContext';

interface PrintPaymentChartProps {
  schedule: PaymentSchedule[];
  loanAmount: number;
}

const PrintPaymentChart: React.FC<PrintPaymentChartProps> = ({ schedule, loanAmount }) => {
  const { t } = useLanguage();
  const totalYears = Math.ceil(schedule.length / 12);
  const yearlyData = [
    { remainingBalance: loanAmount, interest: 0, paidPrincipal: 0 },
    ...Array.from({ length: totalYears }, (_, yearIndex) => {
      const monthIndex = (yearIndex + 1) * 12 - 1;
      const currentData = monthIndex >= schedule.length ? 
        schedule[schedule.length - 1] : 
        schedule[monthIndex];
      
      return {
        remainingBalance: currentData.remainingBalance,
        paidPrincipal: loanAmount - currentData.remainingBalance,
        interest: schedule
          .slice(0, monthIndex + 1)
          .reduce((sum, payment) => sum + payment.interest, 0)
      };
    })
  ];

  // Calculate maximum value for scaling
  const maxValue = Math.max(
    loanAmount,
    ...yearlyData.map(d => d.interest),
    ...yearlyData.map(d => d.paidPrincipal)
  );

  // Chart dimensions - optimized for A4 paper width (210mm)
  // Assuming 1mm = 3.78px at 96 DPI
  const width = 793; // 210mm * 3.78px
  const height = 340;
  const padding = { top: 60, right: 80, bottom: 50, left: 100 }; // Increased top padding
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Scale values to chart height
  const scaleY = (value: number) => {
    return chartHeight - (value / maxValue * chartHeight) + padding.top;
  };

  // Scale X positions
  const scaleX = (index: number) => {
    return (index * chartWidth / (totalYears)) + padding.left;
  };

  // Generate path commands
  const createPath = (data: number[]) => {
    return data.map((value, index) => {
      return `${index === 0 ? 'M' : 'L'} ${scaleX(index)} ${scaleY(value)}`;
    }).join(' ');
  };

  // Format currency for different scales
  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `¥${(value / 10000).toFixed(0)}万`;
    }
    return `¥${value.toLocaleString('zh-CN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })}`;
  };

  // Calculate year label intervals
  const yearInterval = Math.max(1, Math.ceil(totalYears / 15)); // Show max 15 labels
  const yearLabels = Array.from({ length: Math.ceil(totalYears / yearInterval) }, 
    (_, i) => i * yearInterval);

  return (
    <div className="w-full print:w-[210mm] mx-auto">
      <svg 
        width="100%" 
        height="100%" 
        viewBox={`0 0 ${width} ${height}`}
        className="print-chart"
        style={{ maxHeight: '340px' }}
      >
        {/* Title */}
        <text x={width/2} y={20} textAnchor="middle" className="font-bold text-[14px]">
          {t.chart.title}
        </text>

        {/* Legend - Moved down */}
        <g transform={`translate(${padding.left + 20}, 40)`}>
          {[
            { label: t.chart.remainingBalance, color: 'rgb(99, 102, 241)' },
            { label: t.chart.paidPrincipal, color: 'rgb(34, 197, 94)' },
            { label: t.chart.paidInterest, color: 'rgb(244, 63, 94)' }
          ].map((item, index) => (
            <g key={item.label} transform={`translate(${index * 120}, 0)`}>
              <line x1="0" y1="0" x2="20" y2="0" stroke={item.color} strokeWidth="1.5" />
              <text x="25" y="0" dominantBaseline="middle" className="text-[11px]">
                {item.label}
              </text>
            </g>
          ))}
        </g>

        {/* Y-axis */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
          const y = scaleY(maxValue * ratio);
          return (
            <g key={ratio}>
              <line
                x1={padding.left}
                y1={y}
                x2={width - padding.right}
                y2={y}
                stroke="#e5e7eb"
                strokeWidth="1"
              />
              <text
                x={padding.left - 8}
                y={y}
                textAnchor="end"
                dominantBaseline="middle"
                className="text-[11px]"
              >
                {formatCurrency(maxValue * ratio)}
              </text>
            </g>
          );
        })}

        {/* X-axis */}
        <line
          x1={padding.left}
          y1={height - padding.bottom}
          x2={width - padding.right}
          y2={height - padding.bottom}
          stroke="#e5e7eb"
          strokeWidth="1"
        />
        {yearLabels.map((year) => (
          <g key={year}>
            <line
              x1={scaleX(year)}
              y1={padding.top}
              x2={scaleX(year)}
              y2={height - padding.bottom}
              stroke="#e5e7eb"
              strokeWidth="1"
            />
            <text
              x={scaleX(year)}
              y={height - padding.bottom + 20}
              textAnchor="middle"
              className="text-[11px]"
            >
              {`${year}${t.chart.yearLabel}`}
            </text>
          </g>
        ))}

        {/* Data lines */}
        <path
          d={createPath(yearlyData.map(d => d.remainingBalance))}
          stroke="rgb(99, 102, 241)"
          strokeWidth="1.5"
          fill="none"
        />
        <path
          d={createPath(yearlyData.map(d => d.paidPrincipal))}
          stroke="rgb(34, 197, 94)"
          strokeWidth="1.5"
          fill="none"
        />
        <path
          d={createPath(yearlyData.map(d => d.interest))}
          stroke="rgb(244, 63, 94)"
          strokeWidth="1.5"
          fill="none"
        />

        {/* Axis labels */}
        <text
          x={padding.left - 60}
          y={height / 2}
          transform={`rotate(-90, ${padding.left - 60}, ${height / 2})`}
          textAnchor="middle"
          className="text-[11px]"
        >
          Amount
        </text>
        <text
          x={width / 2}
          y={height - 10}
          textAnchor="middle"
          className="text-[11px]"
        >
          {t.inputs.loanTerm}
        </text>
      </svg>
    </div>
  );
};

export default PrintPaymentChart;