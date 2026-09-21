# Architecture

How the wizard, the schemas and the store fit together, and where the remaining
steps plug in.

---

## 1. The step registry

`src/wizard/steps.js` is the only description of the flow.

```js
{
  id: 'coApplicant',
  title: 'Co-applicant',
  shortTitle: 'Co-applicant',
  component: StepPlaceholder,
  isActive: (formData) => needsCoApplicant(formData),
}
```

`getActiveSteps(formData)` filters the registry through each `isActive`
predicate. Everything downstream — the progress bar, the next/back buttons, the
"Step 2 of 8" label — is derived from that filtered array. No component holds a
step number.

This is what makes the QA stress-test scenario work: start a personal loan at
₹3,00,000 (7 steps), come back to Step 1, raise it to ₹8,00,000, continue — the
co-applicant step is now in the array and the wizard walks into it.

## 2. The Wizard

`src/wizard/Wizard.jsx` does four things and nothing else:

1. Resolves the active steps and the current index.
2. Renders the step component with a fixed prop contract (below).
3. On `onNext`, merges the step's data into the store, **recomputes visibility
   with the new data**, and moves to the next active step. Recomputing before
   navigating is what stops a just-activated step from being skipped.
4. Moves focus to the new step's first field, and announces the position in a
   live region (WCAG 2.4.3).

It also guards against a step vanishing underneath it: if the current step is no
longer active — the applicant lowered the amount — the index falls back rather
than rendering nothing.

### Step prop contract

Every step component receives exactly this:

| Prop | Meaning |
| --- | --- |
| `step` | Its own registry entry |
| `stepNumber`, `totalSteps` | Position among *active* steps |
| `formData` | Everything collected so far |
| `onNext(data)` | Merge, persist, advance |
| `onBack()` | Previous active step |
| `onSaveDraft(data\|null)` | Persist without advancing |
| `canGoBack`, `isLastStep` | Navigation state |

A step owns its own `<form>`, its own `useForm`, and its own schema. That keeps
validation per-step and lets each step be tested in isolation.

## 3. Schema factories

Steps do not import a fixed schema. They build one from accumulated state:

```js
const schema = useMemo(
  () => createStep1Schema({ dateOfBirth: formData.dateOfBirth }),
  [formData.dateOfBirth],
);
```

`createStep1Schema(context)` returns a Zod object whose `superRefine` applies
three layers:

1. **Field rules** — required, format, range.
2. **Intra-step rules** — the amount ceiling and tenure list of the *selected*
   product.
3. **Cross-step rules** — the tenure ceiling implied by the date of birth from
   Step 2 (`age + tenure ≤ 65`), applied only when that data exists.

Empty inputs are normalised to `undefined` before the number schema sees them,
so a blank field reports "Enter the loan amount" rather than tripping the
minimum-value rule at zero.

As steps land, each gets a `createStepNSchema(context)` in `src/schemas/`, and
the dependency table from the brief becomes a list of layer-3 refinements:

| From | To | Rule | Status |
| --- | --- | --- | --- |
| Step 2 DOB | Step 1 tenure | age + tenure ≤ 65 | wired, fires when Step 2 exists |
| Step 1 type + amount | Step 6 visibility | home always, personal > ₹5 L, business > ₹20 L | done |
| Step 1 type | Step 5 employment | business loan needs self-employed or business owner | pending |
| Step 5 employment | Step 7 documents | salaried → salary slips, else ITR | pending |
| Step 5 income | Step 8 EMI | EMI ≤ 50% of income | pending |

## 4. The store

`src/store/useLoanStore.js` is Zustand plus the `persist` middleware.

- `formData` accumulates across steps; `currentStepId` and `completedStepIds`
  track the journey; `lastSavedAt` drives the "Draft saved at" indicator.
- `partialize` writes only an **allowlist** of non-PII fields. Step 1 collects
  none, so a plain localStorage draft is safe today.
- When Step 2 lands, this adapter is replaced by the encrypted auto-save the
  brief specifies: serialise → AES-256-GCM through `window.crypto.subtle` →
  write under `lendswift_draft_[loanType]` with a `{ version, timestamp, step }`
  metadata object, a 72-hour TTL, and a resume / start-fresh modal on load. The
  allowlist exists so nothing sensitive can leak to disk before that swap.

## 5. Components

`FormField.jsx` holds one accessibility contract — id generation, `htmlFor`,
`aria-invalid`, and an `aria-describedby` assembled only from elements that
actually render. `Input` and `Select` are thin compound wrappers over it
(`Input.Label`, `Input.Field`, `Input.HelpText`, `Input.Error`), and the
controls use `forwardRef` so they work with `register()` and equally as
controlled inputs.

`CurrencyInput` is the one deliberate exception: it needs to display a formatted
value while storing digits, so Step 1 drives it through RHF's `Controller`.

## 6. Testing

- **Vitest + Testing Library** covers the logic and the interactions that are
  easy to break: digit grouping, the empty-vs-zero distinction, product
  ceilings, dependent-field clearing, and step insertion and removal.
- **Cypress** covers the journeys: validation recovery, the co-applicant
  threshold, draft restore across a reload, and the accessibility wiring.

Run `npm run verify` before every commit — lint, tests, build.
