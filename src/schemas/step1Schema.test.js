import { describe, expect, it } from 'vitest';
import { createStep1Schema } from './step1Schema';

const base = {
  loanType: 'personal',
  loanAmount: '500000',
  loanTenure: '36',
  loanPurpose: 'Education',
  referralCode: '',
};

const messagesFor = (result, field) =>
  result.error.issues.filter((issue) => issue.path[0] === field).map((issue) => issue.message);

describe('step 1 schema', () => {
  it('accepts a valid application and coerces strings to numbers', () => {
    const result = createStep1Schema().safeParse(base);
    expect(result.success).toBe(true);
    expect(result.data.loanAmount).toBe(500000);
    expect(result.data.loanTenure).toBe(36);
  });

  it('treats an empty amount as missing rather than as zero', () => {
    const result = createStep1Schema().safeParse({ ...base, loanAmount: '' });
    expect(messagesFor(result, 'loanAmount')).toEqual(['Enter the loan amount you need']);
  });

  it('applies the ceiling of the selected product', () => {
    const personal = createStep1Schema().safeParse({ ...base, loanAmount: '2000000' });
    expect(messagesFor(personal, 'loanAmount')[0]).toContain('₹10,00,000');

    const home = createStep1Schema().safeParse({
      ...base,
      loanType: 'home',
      loanAmount: '2000000',
      loanTenure: '120',
      loanPurpose: 'Balance transfer',
    });
    expect(home.success).toBe(true);
  });

  it('rejects a tenure that belongs to a different product', () => {
    const result = createStep1Schema().safeParse({
      ...base,
      loanType: 'home',
      loanPurpose: 'Balance transfer',
      loanTenure: '36',
    });
    expect(messagesFor(result, 'loanTenure')[0]).toBe('Choose a tenure between 60 and 360 months');
  });

  it('caps tenure using the date of birth carried over from step 2', () => {
    const fiftyYearsAgo = new Date();
    fiftyYearsAgo.setFullYear(fiftyYearsAgo.getFullYear() - 50);

    const schema = createStep1Schema({ dateOfBirth: fiftyYearsAgo.toISOString() });
    const result = schema.safeParse({
      ...base,
      loanType: 'home',
      loanPurpose: 'Balance transfer',
      loanTenure: '360',
    });

    expect(messagesFor(result, 'loanTenure')[0]).toContain('180 months');
  });

  it('validates the referral code only when one is given', () => {
    expect(createStep1Schema().safeParse({ ...base, referralCode: '' }).success).toBe(true);
    expect(createStep1Schema().safeParse({ ...base, referralCode: 'LSWIFT24' }).success).toBe(true);
    expect(createStep1Schema().safeParse({ ...base, referralCode: 'abc' }).success).toBe(false);
  });
});
