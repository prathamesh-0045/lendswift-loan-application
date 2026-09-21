const inrGroup = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 });

/** 1050000 -> "10,50,000" (Indian digit grouping, no symbol). */
export const formatIndianNumber = (value) => {
  const number = Number(value);
  if (!Number.isFinite(number)) return '';
  return inrGroup.format(Math.trunc(number));
};

/** 1050000 -> "₹10,50,000". */
export const formatINR = (value) => {
  const formatted = formatIndianNumber(value);
  return formatted === '' ? '' : `₹${formatted}`;
};

/** Short Indian scale used in helper text: 1000000 -> "₹10 L", 10000000 -> "₹1 Cr". */
export const formatINRShort = (value) => {
  const number = Number(value);
  if (!Number.isFinite(number)) return '';
  if (number >= 10000000) return `₹${formatIndianNumber(number / 10000000)} Cr`;
  if (number >= 100000) return `₹${formatIndianNumber(number / 100000)} L`;
  return formatINR(number);
};

/** Strips grouping/symbols so "₹5,00,000" becomes "500000". */
export const digitsOnly = (value) => String(value ?? '').replace(/[^\d]/g, '');

/** 36 -> "36 months (3 years)", 66 -> "66 months (5 yr 6 mo)". */
export const formatTenure = (months) => {
  const years = Math.floor(months / 12);
  const rest = months % 12;
  if (rest === 0) return `${months} months (${years} ${years === 1 ? 'year' : 'years'})`;
  return `${months} months (${years} yr ${rest} mo)`;
};
