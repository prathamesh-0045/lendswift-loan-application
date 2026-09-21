import { z } from 'zod';
import {
  LOAN_TYPE_VALUES,
  MIN_LOAN_AMOUNT,
  getLoanConfig,
  getTenureOptions,
} from '../data/loanOptions';
import { formatINR, formatIndianNumber } from '../utils/format';
import { maxTenureForAge } from '../utils/date';

/**
 * Inputs hand us strings. An empty input must read as "missing", not as 0 —
 * otherwise a blank amount fails with "minimum is ₹50,000", which tells the
 * applicant the wrong thing about what they did wrong.
 */
const toNumber = (raw) => {
  if (typeof raw === 'number') return raw;
  const cleaned = String(raw ?? '').replace(/[^\d.-]/g, '');
  if (cleaned === '') return undefined;
  const parsed = Number(cleaned);
  return Number.isNaN(parsed) ? raw : parsed;
};

/** Applies the normalisation above in front of a number schema. */
const numericInput = (schema) => z.preprocess(toNumber, schema);

/**
 * Schema factory. Everything the step needs to validate is derived from the
 * form state passed in, so cross-step dependencies (Step 2's date of birth
 * capping tenure) plug in without rewriting the schema.
 *
 * @param {{ dateOfBirth?: string }} context accumulated data from other steps
 */
export const createStep1Schema = (context = {}) =>
  z
    .object({
      loanType: z.enum(LOAN_TYPE_VALUES, { error: 'Select a loan type' }),

      loanAmount: numericInput(
        z
          .number({ error: 'Enter the loan amount you need' })
          .int('Enter the amount in whole rupees')
          .min(MIN_LOAN_AMOUNT, `Minimum loan amount is ${formatINR(MIN_LOAN_AMOUNT)}`),
      ),

      loanTenure: numericInput(
        z.number({ error: 'Select a loan tenure' }).int('Select a loan tenure').positive('Select a loan tenure'),
      ),

      loanPurpose: z.string().trim().min(1, 'Select a loan purpose'),

      referralCode: z
        .string()
        .trim()
        .regex(/^[A-Za-z0-9]{6,10}$/, 'Referral code must be 6–10 letters or digits')
        .optional()
        .or(z.literal('')),
    })
    .superRefine((data, ctx) => {
      const config = getLoanConfig(data.loanType);

      if (data.loanAmount > config.maxAmount) {
        ctx.addIssue({
          code: 'custom',
          path: ['loanAmount'],
          message: `${config.label} is capped at ₹${formatIndianNumber(config.maxAmount)}`,
        });
      }

      const tenureOptions = getTenureOptions(data.loanType);
      if (!tenureOptions.includes(data.loanTenure)) {
        ctx.addIssue({
          code: 'custom',
          path: ['loanTenure'],
          message: `Choose a tenure between ${config.minTenure} and ${config.maxTenure} months`,
        });
        return;
      }

      // Cross-step: Step 2 date of birth -> tenure ceiling (age at maturity ≤ 65).
      const ageCap = maxTenureForAge(context.dateOfBirth);
      if (ageCap !== null && data.loanTenure > ageCap) {
        ctx.addIssue({
          code: 'custom',
          path: ['loanTenure'],
          message: `Based on your date of birth the longest tenure available is ${ageCap} months`,
        });
      }
    });

export const step1Schema = createStep1Schema();

export const STEP1_DEFAULTS = {
  loanType: 'personal',
  loanAmount: '',
  loanTenure: '',
  loanPurpose: '',
  referralCode: '',
};
