/**
 * Reusable step helpers. Later specs (steps 2-8) build on these instead of
 * repeating field-by-field typing.
 */
Cypress.Commands.add('startFresh', () => {
  cy.clearLocalStorage();
  cy.visit('/');
});

Cypress.Commands.add('fillStep1', (data = {}) => {
  const values = {
    loanType: 'personal',
    loanAmount: '500000',
    loanTenure: '36',
    loanPurpose: 'Education',
    ...data,
  };

  cy.get(`input[name="loanType"][value="${values.loanType}"]`).check();
  cy.get('#loanAmount').clear().type(values.loanAmount);
  cy.get('#loanTenure').select(values.loanTenure);
  cy.get('#loanPurpose').select(values.loanPurpose);
  if (values.referralCode) cy.get('#referralCode').clear().type(values.referralCode);
});

Cypress.Commands.add('continueStep', () => {
  cy.contains('button', 'Save and continue').click();
});
