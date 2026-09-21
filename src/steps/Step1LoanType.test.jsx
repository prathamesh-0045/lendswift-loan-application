import { describe, expect, it } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Wizard from '../wizard/Wizard';

const setup = () => ({ user: userEvent.setup(), ...render(<Wizard />) });

// The position is announced twice: visibly in the progress bar and in the
// screen-reader live region, so both are expected to match.
const expectPosition = async (position, total) => {
  const matches = await screen.findAllByText(new RegExp(`step ${position} of ${total}`, 'i'));
  expect(matches.length).toBeGreaterThan(0);
};

const fillValidStep1 = async (user, { amount = '500000' } = {}) => {
  await user.type(screen.getByLabelText(/loan amount/i), amount);
  await user.selectOptions(screen.getByLabelText(/repayment tenure/i), '36');
  await user.selectOptions(screen.getByLabelText(/loan purpose/i), 'Education');
};

describe('Step 1', () => {
  it('formats the amount in the Indian digit system while typing', async () => {
    const { user } = setup();
    const amount = screen.getByLabelText(/loan amount/i);
    await user.type(amount, '1050000');
    expect(amount).toHaveValue('10,50,000');
  });

  it('reports every missing field once, in an error summary', async () => {
    const { user } = setup();
    await user.click(screen.getByRole('button', { name: /save and continue/i }));

    expect(await screen.findByText(/fix 3 fields to continue/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/loan amount/i)).toHaveAttribute('aria-invalid', 'true');
  });

  it('clears a field error as soon as it is corrected', async () => {
    const { user } = setup();
    await user.click(screen.getByRole('button', { name: /save and continue/i }));
    // The message appears twice on purpose: once in the summary, once beside the field.
    expect(await screen.findAllByText(/select a loan purpose/i)).toHaveLength(2);

    await user.selectOptions(screen.getByLabelText(/loan purpose/i), 'Education');
    await waitFor(() => expect(screen.queryAllByText(/select a loan purpose/i)).toHaveLength(0));
  });

  it('drops tenure and purpose when the product changes, so no stale value survives', async () => {
    const { user } = setup();
    await fillValidStep1(user);

    await user.click(screen.getByRole('radio', { name: /home loan/i }));

    await waitFor(() => expect(screen.getByLabelText(/repayment tenure/i)).toHaveValue(''));
    expect(screen.getByLabelText(/loan purpose/i)).toHaveValue('');
    expect(screen.getByRole('option', { name: /balance transfer/i })).toBeInTheDocument();
    expect(screen.queryByRole('option', { name: /^36 months/ })).not.toBeInTheDocument();
  });

  it('advances to step 2 and keeps the entered data', async () => {
    const { user } = setup();
    await fillValidStep1(user);
    await user.click(screen.getByRole('button', { name: /save and continue/i }));

    expect(await screen.findByRole('heading', { name: /personal information/i })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /back/i }));
    expect(await screen.findByLabelText(/loan amount/i)).toHaveValue('5,00,000');
  });
});

describe('Conditional co-applicant step', () => {
  it('warns live, and skips the step, at exactly ₹5,00,000', async () => {
    const { user } = setup();
    await fillValidStep1(user, { amount: '500000' });
    expect(screen.getByText(/no co-applicant is needed/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /save and continue/i }));
    await expectPosition(2, 7);
  });

  it('inserts the step once the personal loan exceeds ₹5,00,000', async () => {
    const { user } = setup();
    await fillValidStep1(user, { amount: '500001' });
    expect(screen.getByText(/needs a co-applicant/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /save and continue/i }));
    await expectPosition(2, 8);
  });

  it('removes the step again when the applicant lowers the amount', async () => {
    const { user } = setup();
    await fillValidStep1(user, { amount: '800000' });
    await user.click(screen.getByRole('button', { name: /save and continue/i }));
    await expectPosition(2, 8);

    await user.click(screen.getByRole('button', { name: /back/i }));
    const amount = await screen.findByLabelText(/loan amount/i);
    await user.clear(amount);
    await user.type(amount, '300000');
    await user.click(screen.getByRole('button', { name: /save and continue/i }));

    await expectPosition(2, 7);
  });

  it('always includes the step for a home loan', async () => {
    const { user } = setup();
    await user.click(screen.getByRole('radio', { name: /home loan/i }));
    await user.type(screen.getByLabelText(/loan amount/i), '3000000');
    await user.selectOptions(screen.getByLabelText(/repayment tenure/i), '120');
    await user.selectOptions(screen.getByLabelText(/loan purpose/i), 'Balance transfer');
    await user.click(screen.getByRole('button', { name: /save and continue/i }));

    await expectPosition(2, 8);
  });
});
