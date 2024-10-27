export interface Translation {
  title: string;
  subtitle: string;
  help: {
    title: string;
    description: string;
    features: string[];
    close: string;
  };
  inputs: {
    loanAmount: string;
    interestRate: string;
    loanTerm: string;
    years: string;
    loanType: string;
    equalPayment: string;
    equalPrincipal: string;
  };
  events: {
    title: string;
    lumpSum: string;
    rateChange: string;
    termChange: string;
    noEvents: string;
    month: string;
    value: string;
    lumpSumLabel: string;
    rateChangeLabel: string;
    termChangeLabel: string;
    interestChange: string;
    decrease: string;
    increase: string;
  };
  results: {
    title: string;
    initialPayment: string;
    currentPayment: string;
    totalPayment: string;
    totalInterest: string;
  };
  chart: {
    title: string;
    yearLabel: string;
    remainingBalance: string;
    paidPrincipal: string;
    paidInterest: string;
  };
  schedule: {
    title: string;
    month: string;
    payment: string;
    principal: string;
    interest: string;
    lumpSum: string;
    remainingBalance: string;
    totalPayment: string;
    totalInterest: string;
    showing: string;
    of: string;
    entries: string;
    prev: string;
    next: string;
    to: string;
  };
  languages: {
    en: string;
    es: string;
    fr: string;
    ja: string;
    ko: string;
    zh: string;
  };
  actions: {
    generatePDF: string;
    printReport: string;
    help: string;
    close: string;
  };
  report: {
    id: string;
    generated: string;
    property: string;
    disclaimer: string;
  };
}