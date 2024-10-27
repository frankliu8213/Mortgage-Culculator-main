import type { PaymentSchedule, MortgageEvent, LoanType } from '../types/mortgage';

export function calculateMonthlyPayment(
  principal: number,
  monthlyRate: number,
  numberOfPayments: number,
  loanType: LoanType = 'equalPayment'
): number {
  if (loanType === 'equalPrincipal') {
    const monthlyPrincipal = principal / numberOfPayments;
    const firstMonthInterest = principal * monthlyRate;
    return monthlyPrincipal + firstMonthInterest;
  }
  
  if (monthlyRate === 0) return principal / numberOfPayments;
  if (numberOfPayments <= 0) return principal;
  
  return (
    (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
    (Math.pow(1 + monthlyRate, numberOfPayments) - 1)
  );
}

export function calculateTotalInterest(
  principal: number,
  monthlyRate: number,
  numberOfPayments: number,
  loanType: LoanType = 'equalPayment'
): number {
  if (monthlyRate === 0) return 0;
  if (numberOfPayments <= 0) return 0;

  if (loanType === 'equalPrincipal') {
    let totalInterest = 0;
    let remainingPrincipal = principal;
    const monthlyPrincipal = principal / numberOfPayments;

    for (let i = 0; i < numberOfPayments; i++) {
      const monthlyInterest = remainingPrincipal * monthlyRate;
      totalInterest += monthlyInterest;
      remainingPrincipal -= monthlyPrincipal;
    }

    return totalInterest;
  } else {
    const monthlyPayment = calculateMonthlyPayment(principal, monthlyRate, numberOfPayments);
    const totalPayment = monthlyPayment * numberOfPayments;
    return totalPayment - principal;
  }
}

export function calculateMortgageSchedule(
  loanAmount: number,
  annualInterestRate: number,
  termMonths: number,
  events: MortgageEvent[],
  loanType: LoanType = 'equalPayment'
): PaymentSchedule[] {
  const schedule: PaymentSchedule[] = [];
  let currentBalance = loanAmount;
  let currentRate = annualInterestRate;
  let remainingMonths = termMonths;
  
  // Sort events by month
  const sortedEvents = [...events].sort((a, b) => a.month - b.month);
  
  // Calculate initial monthly payment
  let monthlyRate = currentRate / 100 / 12;
  let currentMonthlyPayment = calculateMonthlyPayment(currentBalance, monthlyRate, remainingMonths, loanType);
  let monthlyPrincipal = loanType === 'equalPrincipal' ? loanAmount / termMonths : 0;
  
  for (let month = 1; month <= termMonths; month++) {
    // Check for events at current month
    const monthEvents = sortedEvents.filter(event => event.month === month);

    // Apply rate changes (affects current month's payment)
    const rateChange = monthEvents.find(event => event.type === 'rateChange');
    if (rateChange) {
      currentRate = rateChange.value;
      monthlyRate = currentRate / 100 / 12;
    }

    // Apply term changes
    const termChange = monthEvents.find(event => event.type === 'termChange');
    if (termChange) {
      remainingMonths = termChange.value;
    }

    // Recalculate payment if rate or term changed
    if (rateChange || termChange) {
      if (loanType === 'equalPayment') {
        currentMonthlyPayment = calculateMonthlyPayment(
          currentBalance,
          monthlyRate,
          remainingMonths,
          loanType
        );
      } else {
        monthlyPrincipal = currentBalance / remainingMonths;
      }
    }

    // Calculate current month's interest and principal
    const interestPayment = currentBalance * monthlyRate;
    let principalPayment: number;

    if (loanType === 'equalPrincipal') {
      principalPayment = monthlyPrincipal;
      currentMonthlyPayment = principalPayment + interestPayment;
    } else {
      principalPayment = currentMonthlyPayment - interestPayment;
    }
    
    // Apply regular payment
    currentBalance = Math.max(0, currentBalance - principalPayment);

    // Get lump sum payment if any
    const lumpSumEvent = monthEvents.find(event => event.type === 'lumpSum');
    const lumpSumAmount = lumpSumEvent ? lumpSumEvent.value : 0;

    // Apply lump sum payment after regular payment
    if (lumpSumAmount > 0) {
      currentBalance = Math.max(0, currentBalance - lumpSumAmount);
    }

    // Store current month's payment info
    schedule.push({
      month,
      payment: currentMonthlyPayment,
      principal: principalPayment,
      interest: interestPayment,
      remainingBalance: currentBalance,
      lumpSum: lumpSumAmount || undefined
    });
    
    // If loan is paid off, stop calculations
    if (currentBalance === 0) {
      break;
    }

    // Update remaining months for next iteration
    remainingMonths--;

    // Recalculate payment if there was a lump sum payment
    if (lumpSumAmount > 0) {
      if (loanType === 'equalPayment') {
        currentMonthlyPayment = calculateMonthlyPayment(
          currentBalance,
          monthlyRate,
          remainingMonths,
          loanType
        );
      } else {
        monthlyPrincipal = currentBalance / remainingMonths;
      }
    }
  }
  
  return schedule;
}