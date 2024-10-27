import type { Translation } from '../types/translations';

const en: Translation = {
  title: "Advanced Mortgage Calculator",
  subtitle: "Your Mortgage Management Assistant",
  help: {
    title: "Help",
    description: "This calculator helps you understand your mortgage payments and explore different scenarios.",
    features: [
      "Calculate monthly payments",
      "Add lump sum payments",
      "Change interest rates",
      "Modify loan terms",
      "Visualize payment schedule"
    ],
    close: "Close"
  },
  inputs: {
    loanAmount: "Loan Amount",
    interestRate: "Interest Rate (%)",
    loanTerm: "Loan Term",
    years: "years",
    loanType: "Loan Type",
    equalPayment: "Equal Payment (Principal + Interest)",
    equalPrincipal: "Equal Principal"
  },
  events: {
    title: "Payment Events",
    lumpSum: "Add Lump Sum",
    rateChange: "Change Rate",
    termChange: "Change Term",
    noEvents: "No payment events",
    month: "Month",
    value: "Value",
    lumpSumLabel: "Payment Amount",
    rateChangeLabel: "New Rate (%)",
    termChangeLabel: "New Term (months)",
    interestChange: "Total interest will",
    decrease: "decrease",
    increase: "increase"
  },
  results: {
    title: "Results",
    initialPayment: "Initial Payment",
    currentPayment: "Current Payment",
    totalPayment: "Total Payment",
    totalInterest: "Total Interest"
  },
  chart: {
    title: "Payment Progress",
    yearLabel: "Year",
    remainingBalance: "Remaining Balance",
    paidPrincipal: "Paid Principal",
    paidInterest: "Paid Interest"
  },
  schedule: {
    title: "Monthly Payment Schedule",
    month: "Month",
    payment: "Payment",
    principal: "Principal",
    interest: "Interest",
    lumpSum: "Lump Sum",
    remainingBalance: "Remaining Balance",
    totalPayment: "Total Payment",
    totalInterest: "Total Interest",
    showing: "Showing",
    of: "of",
    entries: "entries",
    prev: "Previous",
    next: "Next",
    to: "to"
  },
  languages: {
    en: "English",
    es: "Español",
    fr: "Français",
    ja: "日本語",
    ko: "한국어",
    zh: "中文"
  },
  actions: {
    generatePDF: "Generate PDF",
    printReport: "Print Report",
    help: "Help",
    close: "Close"
  },
  report: {
    id: "Report ID",
    generated: "Generated",
    property: "Property",
    disclaimer: "This report is for reference only. Please refer to the bank's actual approval for specific repayment information."
  }
};

const es: Translation = {
  title: "Calculadora Hipotecaria Avanzada",
  subtitle: "Su Asistente de Gestión Hipotecaria",
  help: {
    title: "Ayuda",
    description: "Esta calculadora le ayuda a entender sus pagos hipotecarios y explorar diferentes escenarios.",
    features: [
      "Calcular pagos mensuales",
      "Agregar pagos únicos",
      "Cambiar tasas de interés",
      "Modificar plazos del préstamo",
      "Visualizar calendario de pagos"
    ],
    close: "Cerrar"
  },
  inputs: {
    loanAmount: "Monto del Préstamo",
    interestRate: "Tasa de Interés (%)",
    loanTerm: "Plazo del Préstamo",
    years: "años",
    loanType: "Tipo de Préstamo",
    equalPayment: "Pago Igual (Capital + Interés)",
    equalPrincipal: "Capital Igual"
  },
  events: {
    title: "Eventos de Pago",
    lumpSum: "Agregar Pago Único",
    rateChange: "Cambiar Tasa",
    termChange: "Cambiar Plazo",
    noEvents: "Sin eventos de pago",
    month: "Mes",
    value: "Valor",
    lumpSumLabel: "Monto del Pago",
    rateChangeLabel: "Nueva Tasa (%)",
    termChangeLabel: "Nuevo Plazo (meses)",
    interestChange: "El interés total",
    decrease: "disminuirá",
    increase: "aumentará"
  },
  results: {
    title: "Resultados",
    initialPayment: "Pago Inicial",
    currentPayment: "Pago Actual",
    totalPayment: "Pago Total",
    totalInterest: "Interés Total"
  },
  chart: {
    title: "Progreso de Pagos",
    yearLabel: "Año",
    remainingBalance: "Saldo Restante",
    paidPrincipal: "Capital Pagado",
    paidInterest: "Interés Pagado"
  },
  schedule: {
    title: "Calendario de Pagos Mensuales",
    month: "Mes",
    payment: "Pago",
    principal: "Capital",
    interest: "Interés",
    lumpSum: "Pago Único",
    remainingBalance: "Saldo Restante",
    totalPayment: "Pago Total",
    totalInterest: "Interés Total",
    showing: "Mostrando",
    of: "de",
    entries: "entradas",
    prev: "Anterior",
    next: "Siguiente",
    to: "a"
  },
  languages: {
    en: "English",
    es: "Español",
    fr: "Français",
    ja: "日本語",
    ko: "한국어",
    zh: "中文"
  },
  actions: {
    generatePDF: "Generar PDF",
    printReport: "Imprimir Informe",
    help: "Ayuda",
    close: "Cerrar"
  },
  report: {
    id: "ID del Informe",
    generated: "Generado",
    property: "Propiedad",
    disclaimer: "Este informe es solo para referencia. Consulte la aprobación real del banco para obtener información específica sobre el reembolso."
  }
};

const fr: Translation = {
  title: "Calculateur Hypothécaire Avancé",
  subtitle: "Votre Assistant de Gestion Hypothécaire",
  help: {
    title: "Aide",
    description: "Ce calculateur vous aide à comprendre vos paiements hypothécaires et à explorer différents scénarios.",
    features: [
      "Calculer les paiements mensuels",
      "Ajouter des paiements forfaitaires",
      "Modifier les taux d'intérêt",
      "Modifier les durées de prêt",
      "Visualiser l'échéancier des paiements"
    ],
    close: "Fermer"
  },
  inputs: {
    loanAmount: "Montant du Prêt",
    interestRate: "Taux d'Intérêt (%)",
    loanTerm: "Durée du Prêt",
    years: "ans",
    loanType: "Type de Prêt",
    equalPayment: "Paiement Égal (Capital + Intérêts)",
    equalPrincipal: "Capital Égal"
  },
  events: {
    title: "Événements de Paiement",
    lumpSum: "Ajouter un Paiement Forfaitaire",
    rateChange: "Modifier le Taux",
    termChange: "Modifier la Durée",
    noEvents: "Aucun événement de paiement",
    month: "Mois",
    value: "Valeur",
    lumpSumLabel: "Montant du Paiement",
    rateChangeLabel: "Nouveau Taux (%)",
    termChangeLabel: "Nouvelle Durée (mois)",
    interestChange: "L'intérêt total va",
    decrease: "diminuer",
    increase: "augmenter"
  },
  results: {
    title: "Résultats",
    initialPayment: "Paiement Initial",
    currentPayment: "Paiement Actuel",
    totalPayment: "Paiement Total",
    totalInterest: "Intérêt Total"
  },
  chart: {
    title: "Progression des Paiements",
    yearLabel: "Année",
    remainingBalance: "Solde Restant",
    paidPrincipal: "Capital Payé",
    paidInterest: "Intérêts Payés"
  },
  schedule: {
    title: "Échéancier des Paiements Mensuels",
    month: "Mois",
    payment: "Paiement",
    principal: "Capital",
    interest: "Intérêt",
    lumpSum: "Paiement Forfaitaire",
    remainingBalance: "Solde Restant",
    totalPayment: "Paiement Total",
    totalInterest: "Intérêt Total",
    showing: "Affichage",
    of: "sur",
    entries: "entrées",
    prev: "Précédent",
    next: "Suivant",
    to: "à"
  },
  languages: {
    en: "English",
    es: "Español",
    fr: "Français",
    ja: "日本語",
    ko: "한국어",
    zh: "中文"
  },
  actions: {
    generatePDF: "Générer PDF",
    printReport: "Imprimer Rapport",
    help: "Aide",
    close: "Fermer"
  },
  report: {
    id: "ID du Rapport",
    generated: "Généré",
    property: "Propriété",
    disclaimer: "Ce rapport est fourni à titre indicatif uniquement. Veuillez vous référer à l'approbation réelle de la banque pour les informations spécifiques de remboursement."
  }
};

const ja: Translation = {
  title: "高度住宅ローン計算機",
  subtitle: "住宅ローン管理アシスタント",
  help: {
    title: "ヘルプ",
    description: "この計算機は住宅ローンの支払いを理解し、様々なシナリオを検討するのに役立ちます。",
    features: [
      "月々の支払額を計算",
      "一括返済を追加",
      "金利を変更",
      "返済期間を変更",
      "返済スケジュールを視覚化"
    ],
    close: "閉じる"
  },
  inputs: {
    loanAmount: "借入額",
    interestRate: "金利 (%)",
    loanTerm: "返済期間",
    years: "年",
    loanType: "返済方式",
    equalPayment: "元利均等返済",
    equalPrincipal: "元金均等返済"
  },
  events: {
    title: "返済イベント",
    lumpSum: "一括返済を追加",
    rateChange: "金利変更",
    termChange: "期間変更",
    noEvents: "返済イベントなし",
    month: "月",
    value: "金額",
    lumpSumLabel: "返済額",
    rateChangeLabel: "新金利 (%)",
    termChangeLabel: "新期間 (月)",
    interestChange: "総利息は",
    decrease: "減少",
    increase: "増加"
  },
  results: {
    title: "計算結果",
    initialPayment: "初回支払額",
    currentPayment: "現在の支払額",
    totalPayment: "総支払額",
    totalInterest: "総利息"
  },
  chart: {
    title: "返済進捗",
    yearLabel: "年",
    remainingBalance: "残債",
    paidPrincipal: "返済済元金",
    paidInterest: "支払済利息"
  },
  schedule: {
    title: "月別返済予定表",
    month: "月",
    payment: "支払額",
    principal: "元金",
    interest: "利息",
    lumpSum: "一括返済",
    remainingBalance: "残債",
    totalPayment: "総支払額",
    totalInterest: "総利息",
    showing: "表示中",
    of: "/",
    entries: "件",
    prev: "前へ",
    next: "次へ",
    to: "～"
  },
  languages: {
    en: "English",
    es: "Español",
    fr: "Français",
    ja: "日本語",
    ko: "한국어",
    zh: "中文"
  },
  actions: {
    generatePDF: "PDF生成",
    printReport: "帳票印刷",
    help: "ヘルプ",
    close: "閉じる"
  },
  report: {
    id: "レポートID",
    generated: "作成日時",
    property: "物件",
    disclaimer: "このレポートは参考用です。具体的な返済情報については、銀行の実際の承認内容をご確認ください。"
  }
};

const ko: Translation = {
  title: "고급 주택담보대출 계산기",
  subtitle: "주택담보대출 관리 도우미",
  help: {
    title: "도움말",
    description: "이 계산기는 주택담보대출 상환금을 이해하고 다양한 시나리오를 탐색하는 데 도움을 줍니다.",
    features: [
      "월 상환금 계산",
      "일시금 상환 추가",
      "이자율 변경",
      "대출 기간 수정",
      "상환 일정 시각화"
    ],
    close: "닫기"
  },
  inputs: {
    loanAmount: "대출 금액",
    interestRate: "이자율 (%)",
    loanTerm: "대출 기간",
    years: "년",
    loanType: "상환 방식",
    equalPayment: "원리금균등상환",
    equalPrincipal: "원금균등상환"
  },
  events: {
    title: "상환 이벤트",
    lumpSum: "일시금 상환 추가",
    rateChange: "이자율 변경",
    termChange: "기간 변경",
    noEvents: "상환 이벤트 없음",
    month: "월",
    value: "금액",
    lumpSumLabel: "상환 금액",
    rateChangeLabel: "새 이자율 (%)",
    termChangeLabel: "새 기간 (월)",
    interestChange: "총 이자가",
    decrease: "감소",
    increase: "증가"
  },
  results: {
    title: "계산 결과",
    initialPayment: "초기 상환금",
    currentPayment: "현재 상환금",
    totalPayment: "총 상환금",
    totalInterest: "총 이자"
  },
  chart: {
    title: "상환 진행",
    yearLabel: "년",
    remainingBalance: "잔액",
    paidPrincipal: "상환 원금",
    paidInterest: "지불 이자"
  },
  schedule: {
    title: "월별 상환 일정",
    month: "월",
    payment: "상환금",
    principal: "원금",
    interest: "이자",
    lumpSum: "일시금 상환",
    remainingBalance: "잔액",
    totalPayment: "총 상환금",
    totalInterest: "총 이자",
    showing: "표시",
    of: "/",
    entries: "항목",
    prev: "이전",
    next: "다음",
    to: "~"
  },
  languages: {
    en: "English",
    es: "Español",
    fr: "Français",
    ja: "日本語",
    ko: "한국어",
    zh: "中文"
  },
  actions: {
    generatePDF: "PDF 생성",
    printReport: "보고서 인쇄",
    help: "도움말",
    close: "닫기"
  },
  report: {
    id: "보고서 ID",
    generated: "생성일시",
    property: "물건",
    disclaimer: "이 보고서는 참고용입니다. 구체적인 상환 정보는 은행의 실제 승인 내용을 확인하시기 바랍니다."
  }
};

const zh: Translation = {
  title: "高级房贷计算器",
  subtitle: "您的房贷管理助手",
  help: {
    title: "帮助",
    description: "此计算器帮助您了解房贷还款并探索不同方案。",
    features: [
      "计算月供",
      "添加大额还款",
      "更改利率",
      "修改贷款期限",
      "可视化还款计划"
    ],
    close: "关闭"
  },
  inputs: {
    loanAmount: "贷款金额",
    interestRate: "利率 (%)",
    loanTerm: "贷款期限",
    years: "年",
    loanType: "还款方式",
    equalPayment: "等额本息",
    equalPrincipal: "等额本金"
  },
  events: {
    title: "还款事件",
    lumpSum: "添加大额还款",
    rateChange: "更改利率",
    termChange: "更改期限",
    noEvents: "暂无还款事件",
    month: "月",
    value: "金额",
    lumpSumLabel: "还款金额",
    rateChangeLabel: "新利率 (%)",
    termChangeLabel: "新期限 (月)",
    interestChange: "总利息将",
    decrease: "减少",
    increase: "增加"
  },
  results: {
    title: "计算结果",
    initialPayment: "初始月供",
    currentPayment: "当前月供",
    totalPayment: "总还款额",
    totalInterest: "总利息"
  },
  chart: {
    title: "还款进度",
    yearLabel: "年",
    remainingBalance: "剩余本金",
    paidPrincipal: "已还本金",
    paidInterest: "已付利息"
  },
  schedule: {
    title: "月度还款计划表",
    month: "月",
    payment: "月供",
    principal: "本金",
    interest: "利息",
    lumpSum: "大额还款",
    remainingBalance: "剩余本金",
    totalPayment: "总还款额",
    totalInterest: "总利息",
    showing: "显示",
    of: "/",
    entries: "条",
    prev: "上一页",
    next: "下一页",
    to: "至"
  },
  languages: {
    en: "English",
    es: "Español",
    fr: "Français",
    ja: "日本語",
    ko: "한국어",
    zh: "中文"
  },
  actions: {
    generatePDF: "生成PDF",
    printReport: "打印报告",
    help: "帮助",
    close: "关闭"
  },
  report: {
    id: "报告编号",
    generated: "生成时间",
    property: "物业",
    disclaimer: "本报告仅供参考。具体还款信息请以银行实际批复为准。"
  }
};

export const translations = {
  en,
  es,
  fr,
  ja,
  ko,
  zh
};

export type Language = keyof typeof translations;