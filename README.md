# LendSwift — multi-step loan application

Front-end implementation of the Zetheta Algorithms assessment: an eight-step
loan application form for a fictional Indian digital lender, built with React,
React Hook Form and Zod.

**This is a simulation.** Never enter a real PAN, Aadhaar, bank or income
detail into this build.

---

## Status

| Milestone | Scope | State |
| --- | --- | --- |
| 1 | Project setup, wizard skeleton, reusable form components, Step 1 | Done |
| 2 | Steps 2–4: personal info, KYC verification, address + PIN lookup | Next |
| 3 | Steps 5–8: employment, co-applicant, documents, review | Planned |
| 4 | Encrypted auto-save, resume modal, full Cypress suite, WCAG audit | Planned |

Steps 2–8 render a placeholder today, so the wizard is walkable end to end and
navigation, conditional step visibility and draft persistence can all be tested
before those forms exist.

---

## Run it

```bash
npm install
npm run dev          # http://localhost:5173
```

| Script | What it does |
| --- | --- |
| `npm run lint` | ESLint 9 flat config (react, react-hooks, jsx-a11y) |
| `npm test` | Vitest unit + component tests |
| `npm run build` | Production build |
| `npm run verify` | lint → test → build, in one go |
| `npm run test:e2e` | Cypress headless (start `npm run dev` first) |
| `npm run test:e2e:open` | Cypress interactive runner |

Current numbers: 24 tests passing, zero lint errors, 115 KB gzipped main chunk
against the brief's 300 KB budget.

---

## What Step 1 does

- Three products — personal, home, business — each with its own amount ceiling
  (₹10 L / ₹1 Cr / ₹50 L), tenure range, interest rate and purpose list.
- Amounts display in the Indian digit system while typing: `10,50,000`.
- Validation runs on blur and clears on correction, per the Nielsen Norman
  form-design guidance in the brief. Errors appear beside the field and in a
  summary at the top of the step.
- Changing the product clears the tenure and purpose, so no value survives that
  its dropdown can no longer show.
- The co-applicant step is inserted or removed as the amount changes: home loans
  always, personal above ₹5,00,000, business above ₹20,00,000. Exactly
  ₹5,00,000 does **not** trigger it — "exceeds" is read strictly, as the QA
  stress test expects.
- The draft survives a reload, and the header says when it was last saved.

---

## Decisions worth knowing

**React Hook Form over Formik.** The finished form carries 50+ fields. RHF keeps
inputs uncontrolled internally and re-renders per field rather than per
keystroke across the whole form, which matters on the mid-range handsets this
product targets.

**Zod over Yup.** `createStep1Schema(context)` is a factory: it takes the data
accumulated from other steps and returns the schema for this one. The
date-of-birth rule (age at maturity must not exceed 65) is already wired and
starts applying the moment Step 2 supplies a date of birth — no schema rewrite
needed.

**Wizard with a step registry.** `src/wizard/steps.js` holds the order, titles,
components and `isActive` predicates. The Wizard only orchestrates. Adding or
hiding a step is a data change.

**Progress counts active steps, not all defined steps.** A small personal loan
reads "Step 1 of 7"; crossing the co-applicant threshold makes it 8. Showing a
fixed 8 would be a nicer round number and a less truthful progress bar.

**Draft storage is allowlisted.** Only the five non-PII Step 1 fields reach
localStorage today. The brief requires AES-256-GCM via the Web Crypto API for
the real draft; that lands with the auto-save milestone and replaces this
storage adapter. Until then the allowlist makes it impossible for PAN, Aadhaar,
income or address to reach disk by accident.

**ESLint config is not `eslint-config-airbnb`.** That package still ships only
the legacy `.eslintrc` format and has no ESLint 9 flat-config build. The rules
that matter — React, Rules of Hooks, jsx-a11y, plus a few Airbnb-style rules —
are applied directly in `eslint.config.js`, which documents the substitution.

**Error red is `#C0392B`, not the brief's `#E74C3C`.** The original fails the
4.5:1 contrast ratio on white that the same brief requires under WCAG 1.4.3.

---

## Accessibility

Every control has a real `<label htmlFor>`; errors set `aria-invalid` and are
referenced by `aria-describedby` (which only ever points at elements that
exist); errors are announced through `role="alert"` with `aria-live="polite"`;
focus moves to the first field of each new step; progress is exposed through
`role="progressbar"` with `aria-valuetext`; there is a skip link, a visible
focus ring on everything focusable, 44px minimum touch targets, and
`prefers-reduced-motion` is respected. The layout works from 320px up.

---

## Layout

```
src/
  components/    Input, Select, CurrencyInput, RadioCardGroup,
                 ProgressBar, StepNavigation, FormField (shared a11y shell)
  data/          loanOptions.js — products, tenure ranges, co-applicant rule
  schemas/       step1Schema.js — Zod schema factory
  steps/         Step1LoanType.jsx, StepPlaceholder.jsx
  store/         useLoanStore.js — Zustand + allowlisted draft persistence
  utils/         format.js (Indian numbers), date.js (age rules)
  wizard/        Wizard.jsx, steps.js (step registry)
cypress/e2e/     step1.cy.js
```

See `ARCHITECTURE.md` for how the pieces fit together.

## Step 3 KYC demo values

For the assessment simulation, use the built-in **Fill demo values** button. The demo values are:

- PAN: `ABCPP1234D` (individual PAN format; the fourth character is `P`)
- Aadhaar: `100000000004` (passes the implemented Verhoeff checksum)
- Aadhaar consent: checked automatically by the demo button

The UI intentionally does not accept or require real identity data.


## 🎥 Project Demo

A screen recording demonstrating the LendSwift multi-step loan application flow is included in the repository:

**[▶ Watch / Open LendSwift Demo Video](docs/demo/LendSwift-Demo.mp4)**

The recording demonstrates the UI flow and demo-data mode. It uses fictional assessment data; do not enter real PAN, Aadhaar, banking, or income details.
