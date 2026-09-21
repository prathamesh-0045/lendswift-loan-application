import { describe, expect, it } from 'vitest';
import { getTenureOptions, needsCoApplicant } from './loanOptions';

describe('co-applicant rule', () => {
  it('never asks for a co-applicant at exactly ₹5,00,000 on a personal loan', () => {
    expect(needsCoApplicant({ loanType: 'personal', loanAmount: 500000 })).toBe(false);
    expect(needsCoApplicant({ loanType: 'personal', loanAmount: 500001 })).toBe(true);
  });

  it('always asks for one on a home loan', () => {
    expect(needsCoApplicant({ loanType: 'home', loanAmount: 100000 })).toBe(true);
  });

  it('uses the ₹20,00,000 threshold for business loans', () => {
    expect(needsCoApplicant({ loanType: 'business', loanAmount: 2000000 })).toBe(false);
    expect(needsCoApplicant({ loanType: 'business', loanAmount: 2000001 })).toBe(true);
  });
});

describe('tenure options', () => {
  it('stays inside each product range', () => {
    expect(getTenureOptions('personal')).toEqual([12, 24, 36, 48, 60]);
    expect(getTenureOptions('home').at(0)).toBe(60);
    expect(getTenureOptions('home').at(-1)).toBe(360);
    expect(getTenureOptions('business').at(-1)).toBe(120);
  });
});
