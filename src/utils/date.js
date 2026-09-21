/** Completed years between a date of birth and `on` (default: today). */
export const calculateAge = (dateOfBirth, on = new Date()) => {
  if (!dateOfBirth) return null;
  const dob = dateOfBirth instanceof Date ? dateOfBirth : new Date(dateOfBirth);
  if (Number.isNaN(dob.getTime())) return null;

  let age = on.getFullYear() - dob.getFullYear();
  const monthDelta = on.getMonth() - dob.getMonth();
  if (monthDelta < 0 || (monthDelta === 0 && on.getDate() < dob.getDate())) age -= 1;
  return age;
};

export const RETIREMENT_AGE = 65;

/**
 * Cross-step rule (Section B3): age at maturity must not exceed 65,
 * so the tenure ceiling shrinks as the applicant gets older.
 * Returns null when the date of birth is not known yet.
 */
export const maxTenureForAge = (dateOfBirth) => {
  const age = calculateAge(dateOfBirth);
  if (age === null) return null;
  return Math.max(0, (RETIREMENT_AGE - age) * 12);
};
