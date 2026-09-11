export const CURRENCY_MAP = {
  USD: { symbol: '$', rate: 1.0, locale: 'en-US' },
  EUR: { symbol: '€', rate: 0.92, locale: 'de-DE' },
  GBP: { symbol: '£', rate: 0.79, locale: 'en-GB' },
  INR: { symbol: '₹', rate: 86.5, locale: 'en-IN' },
};

export function formatCurrency(amount, currency = 'USD', compact = false) {
  if (amount === undefined || amount === null || isNaN(amount)) return '$0';
  const curr = CURRENCY_MAP[currency] || CURRENCY_MAP.USD;
  const converted = amount * curr.rate;

  if (compact) {
    if (Math.abs(converted) >= 1000000) {
      return `${curr.symbol}${(converted / 1000000).toFixed(2)}M`;
    }
    if (Math.abs(converted) >= 1000) {
      return `${curr.symbol}${(converted / 1000).toFixed(1)}k`;
    }
    return `${curr.symbol}${converted.toLocaleString(curr.locale, { maximumFractionDigits: 0 })}`;
  }

  return `${curr.symbol}${converted.toLocaleString(curr.locale, { maximumFractionDigits: 0 })}`;
}

export function formatPercent(value, decimals = 1) {
  if (value === undefined || value === null || isNaN(value)) return '0%';
  const prefix = value > 0 ? '+' : '';
  return `${prefix}${value.toFixed(decimals)}%`;
}

export function formatNumber(val) {
  if (val === undefined || val === null || isNaN(val)) return '0';
  return Number(val).toLocaleString();
}

export function calculateRunwayMonths(cashInBank, monthlyNetBurn) {
  if (!monthlyNetBurn || monthlyNetBurn <= 0) return 999; // Profitable or break-even
  return Math.max(0, parseFloat((cashInBank / monthlyNetBurn).toFixed(1)));
}

export function calculateLTVtoCAC(ltv, cac) {
  if (!cac || cac === 0) return 0;
  return parseFloat((ltv / cac).toFixed(1));
}

export function calculateZeroCashDate(runwayMonths) {
  if (runwayMonths >= 900) return 'Cash-Flow Positive (Infinite Runway)';
  const date = new Date();
  date.setMonth(date.getMonth() + Math.floor(runwayMonths));
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}
