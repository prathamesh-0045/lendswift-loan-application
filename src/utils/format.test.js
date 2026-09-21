import { describe, expect, it } from 'vitest';
import { digitsOnly, formatINR, formatIndianNumber, formatINRShort, formatTenure } from './format';

describe('Indian number formatting', () => {
  it('groups in the Indian digit system, not thousands', () => {
    expect(formatIndianNumber(1050000)).toBe('10,50,000');
    expect(formatIndianNumber(500000)).toBe('5,00,000');
    expect(formatINR(10000000)).toBe('₹1,00,00,000');
  });

  it('falls back to an empty string for non-numeric input', () => {
    expect(formatIndianNumber('abc')).toBe('');
    expect(formatINR(undefined)).toBe('');
  });

  it('abbreviates to lakh and crore for helper text', () => {
    expect(formatINRShort(1000000)).toBe('₹10 L');
    expect(formatINRShort(10000000)).toBe('₹1 Cr');
  });

  it('strips grouping and symbols back to digits', () => {
    expect(digitsOnly('₹10,50,000')).toBe('1050000');
  });

  it('spells tenures in months and years', () => {
    expect(formatTenure(36)).toBe('36 months (3 years)');
    expect(formatTenure(12)).toBe('12 months (1 year)');
    expect(formatTenure(66)).toBe('66 months (5 yr 6 mo)');
  });
});
