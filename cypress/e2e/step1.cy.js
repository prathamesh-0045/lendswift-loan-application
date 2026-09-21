describe('Step 1 - loan type and amount', () => {
  beforeEach(() => cy.startFresh());

  it('offers the three loan products', () => {
    cy.contains('Personal loan').should('be.visible');
    cy.contains('Home loan').should('be.visible');
    cy.contains('Business loan').should('be.visible');
  });

  it('names every missing field when the step is submitted empty', () => {
    cy.continueStep();
    cy.contains('Enter the loan amount you need').should('be.visible');
    cy.contains('Select a loan tenure').should('be.visible');
    cy.contains('Select a loan purpose').should('be.visible');
    cy.contains('Fix 3 fields to continue').should('be.visible');
    cy.contains('Step 1 of 8').should('exist');
  });

  it('clears an error as soon as the applicant fixes the field', () => {
    cy.continueStep();
    cy.contains('Select a loan purpose').should('be.visible');
    cy.get('#loanPurpose').select('Education');
    cy.contains('Select a loan purpose').should('not.exist');
  });

  it('formats the amount in the Indian digit system', () => {
    cy.get('#loanAmount').type('1050000');
    cy.get('#loanAmount').should('have.value', '10,50,000');
  });

  it('enforces the product ceiling', () => {
    cy.get('#loanAmount').type('2000000').blur();
    cy.contains('Personal loan is capped at ₹10,00,000').should('be.visible');
  });

  it('rejects an amount below the floor', () => {
    cy.get('#loanAmount').type('10000').blur();
    cy.contains('Minimum loan amount is ₹50,000').should('be.visible');
  });

  it('swaps tenure and purpose options when the product changes', () => {
    cy.get('#loanTenure').select('36');
    cy.get('#loanPurpose').select('Education');

    cy.get('input[name="loanType"][value="home"]').check();

    // Stale selections from the previous product must not survive.
    cy.get('#loanTenure').should('have.value', '');
    cy.get('#loanPurpose').should('have.value', '');
    cy.get('#loanTenure option').should('not.contain', '36 months');
    cy.get('#loanPurpose').select('Balance transfer');
  });

  it('validates the optional referral code only when it is filled in', () => {
    cy.fillStep1();
    cy.get('#referralCode').type('abc').blur();
    cy.contains('Referral code must be 6–10 letters or digits').should('be.visible');
    cy.get('#referralCode').clear();
    cy.contains('Referral code must be 6–10 letters or digits').should('not.exist');
  });

  it('moves to step 2 with valid data', () => {
    cy.fillStep1();
    cy.continueStep();
    cy.contains('Personal information').should('be.visible');
    cy.contains('Step 2 of 8').should('exist');
  });
});

describe('Wizard - conditional co-applicant step', () => {
  beforeEach(() => cy.startFresh());

  it('keeps the flow at 8 steps for a personal loan of exactly ₹5,00,000', () => {
    cy.fillStep1({ loanAmount: '500000' });
    cy.contains('No co-applicant is needed').should('be.visible');
    cy.contains('Step 1 of 8').should('exist');
  });

  it('inserts the co-applicant step above the threshold', () => {
    cy.fillStep1({ loanAmount: '500001' });
    cy.contains('needs a co-applicant').should('be.visible');
    cy.contains('Step 1 of 9').should('exist');
  });

  it('removes the co-applicant step again when the amount drops', () => {
    cy.fillStep1({ loanAmount: '800000' });
    cy.contains('Step 1 of 9').should('exist');
    cy.get('#loanAmount').clear().type('300000');
    cy.contains('Step 1 of 8').should('exist');
  });
});

describe('Draft persistence', () => {
  it('restores the draft after a reload and can be cleared', () => {
    cy.startFresh();
    cy.fillStep1({ loanAmount: '750000', loanPurpose: 'Wedding' });
    cy.continueStep();

    cy.reload();
    cy.contains('We picked up where you left off.').should('be.visible');
    cy.contains('Draft saved at').should('be.visible');

    cy.contains('button', 'Back').click();
    cy.get('#loanAmount').should('have.value', '7,50,000');
    cy.get('#loanPurpose').should('have.value', 'Wedding');

    cy.contains('button', 'Start a new application').click();
    cy.get('#loanAmount').should('have.value', '');
  });
});

describe('Accessibility basics', () => {
  beforeEach(() => cy.startFresh());

  it('labels every control and announces errors', () => {
    cy.get('#loanAmount').should('have.attr', 'aria-invalid').should('not.exist');
    cy.continueStep();
    cy.get('#loanAmount').should('have.attr', 'aria-invalid', 'true');
    cy.get('#loanAmount')
      .invoke('attr', 'aria-describedby')
      .then((ids) => {
        ids.split(' ').forEach((id) => cy.get(`#${id}`).should('exist'));
      });
    cy.get('[role="alert"]').should('exist');
  });

  it('can be completed with the keyboard alone', () => {
    cy.get('input[name="loanType"][value="personal"]').focus().type('{downArrow}');
    cy.get('input[name="loanType"][value="home"]').should('be.checked');
  });

  it('exposes progress to assistive technology', () => {
    cy.get('[role="progressbar"]')
      .should('have.attr', 'aria-valuenow', '1')
      .and('have.attr', 'aria-valuemax', '8');
  });
});
