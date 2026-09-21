/**
 * Single source of truth for the three LendSwift products.
 * Amount ceilings, tenure ranges, rates and co-applicant thresholds all come
 * from Part B of the brief, so schemas and UI can never drift apart.
 */

export const MIN_LOAN_AMOUNT = 50000;

export const LOAN_TYPES = {
  personal: {
    label: 'Personal loan',
    blurb: 'Unsecured, for planned personal expenses.',
    minAmount: MIN_LOAN_AMOUNT,
    maxAmount: 1000000, // ₹10 L
    minTenure: 12,
    maxTenure: 60,
    tenureStep: 12,
    annualRate: 10.5,
    // Step 6 (co-applicant) activates above this amount. null = never by amount.
    coApplicantAbove: 500000,
    alwaysNeedsCoApplicant: false,
    purposes: [
      'Medical expenses',
      'Education',
      'Wedding',
      'Travel',
      'Debt consolidation',
      'Home improvement',
      'Other',
    ],
  },
  home: {
    label: 'Home loan',
    blurb: 'Secured against the property being financed.',
    minAmount: MIN_LOAN_AMOUNT,
    maxAmount: 10000000, // ₹1 Cr
    minTenure: 60,
    maxTenure: 360,
    tenureStep: 12,
    annualRate: 8.5,
    coApplicantAbove: null,
    alwaysNeedsCoApplicant: true, // home loans always collect a co-applicant
    purposes: [
      'Purchase of new home',
      'Purchase of resale home',
      'Plot purchase and construction',
      'Home renovation',
      'Balance transfer',
    ],
  },
  business: {
    label: 'Business loan',
    blurb: 'For registered businesses and self-employed applicants.',
    minAmount: MIN_LOAN_AMOUNT,
    maxAmount: 5000000, // ₹50 L
    minTenure: 12,
    maxTenure: 120,
    tenureStep: 12,
    annualRate: 14,
    coApplicantAbove: 2000000,
    alwaysNeedsCoApplicant: false,
    purposes: [
      'Working capital',
      'Equipment purchase',
      'Business expansion',
      'Inventory purchase',
      'Commercial property',
    ],
  },
};

export const LOAN_TYPE_VALUES = Object.keys(LOAN_TYPES);

export const isLoanType = (value) => Object.hasOwn(LOAN_TYPES, String(value));

export const getLoanConfig = (type) =>
  (isLoanType(type) ? LOAN_TYPES[type] : LOAN_TYPES.personal);

/** Tenure choices for a product, e.g. personal -> [12, 24, 36, 48, 60]. */
export const getTenureOptions = (type) => {
  const { minTenure, maxTenure, tenureStep } = getLoanConfig(type);
  const options = [];
  for (let months = minTenure; months <= maxTenure; months += tenureStep) {
    options.push(months);
  }
  return options;
};

/**
 * Step 6 visibility rule (brief, Section B2 + B3):
 * home loans always; personal above ₹5,00,000; business above ₹20,00,000.
 * "Exceeds" is strict — exactly ₹5,00,000 must NOT trigger the step.
 */
export const needsCoApplicant = ({ loanType, loanAmount } = {}) => {
  const config = getLoanConfig(loanType);
  if (config.alwaysNeedsCoApplicant) return true;
  if (config.coApplicantAbove === null) return false;
  return Number(loanAmount) > config.coApplicantAbove;
};
