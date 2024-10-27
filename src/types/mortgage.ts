export interface PaymentSchedule {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  remainingBalance: number;
  lumpSum?: number;
}

export interface MortgageEvent {
  type: 'lumpSum' | 'rateChange' | 'termChange';
  month: number;
  value: number;
}

export type LoanType = 'equalPayment' | 'equalPrincipal';