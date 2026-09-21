import { useEffect, useRef } from 'react';
import ProgressBar from '../components/ProgressBar';
import { useLoanStore } from '../store/useLoanStore';
import { getActiveSteps, getStepIndex } from './steps';

export default function Wizard() {
  const formData = useLoanStore((state) => state.formData);
  const currentStepId = useLoanStore((state) => state.currentStepId);
  const setFormData = useLoanStore((state) => state.setFormData);
  const markStepComplete = useLoanStore((state) => state.markStepComplete);
  const goToStep = useLoanStore((state) => state.goToStep);
  const touchSavedAt = useLoanStore((state) => state.touchSavedAt);

  const stepRef = useRef(null);
  const previousStepId = useRef(currentStepId);

  const steps = getActiveSteps(formData);
  let index = getStepIndex(steps, currentStepId);

  // A step can disappear underneath us: lowering the loan amount removes the
  // co-applicant step. Fall back to the nearest earlier step instead of
  // rendering nothing.
  if (index === -1) index = 0;
  const step = steps[index];

  // Keep the store honest if the fallback above kicked in.
  useEffect(() => {
    if (step && step.id !== currentStepId) goToStep(step.id);
  }, [step, currentStepId, goToStep]);

  // WCAG 2.4.3: on a step change, move focus to the first field of the new step.
  useEffect(() => {
    if (previousStepId.current === currentStepId) return;
    previousStepId.current = currentStepId;

    const container = stepRef.current;
    if (!container) return;
    const target =
      container.querySelector('[data-first-field]') ??
      container.querySelector('input, select, textarea, [href], button');
    target?.focus();
  }, [currentStepId]);

  const handleNext = (data) => {
    setFormData(data);
    touchSavedAt();
    markStepComplete(step.id);

    // Recompute visibility with the new data before choosing the next step.
    const nextSteps = getActiveSteps({ ...formData, ...data });
    const nextIndex = getStepIndex(nextSteps, step.id) + 1;
    if (nextIndex < nextSteps.length) goToStep(nextSteps[nextIndex].id);
  };

  const handleBack = () => {
    if (index > 0) goToStep(steps[index - 1].id);
  };

  const handleSaveDraft = (data) => {
    if (data) setFormData(data);
    touchSavedAt();
  };

  const StepComponent = step.component;

  return (
    <>
      <ProgressBar steps={steps} currentStepId={step.id} />

      <p className="sr-only" aria-live="polite">
        Step {index + 1} of {steps.length}: {step.title}
      </p>

      <section
        ref={stepRef}
        aria-labelledby="step-heading"
        className="rounded-2xl border border-line bg-white p-5 shadow-sm sm:p-8"
      >
        <StepComponent
          step={step}
          stepNumber={index + 1}
          totalSteps={steps.length}
          formData={formData}
          onNext={handleNext}
          onBack={handleBack}
          onSaveDraft={handleSaveDraft}
          canGoBack={index > 0}
          isLastStep={index === steps.length - 1}
        />
      </section>
    </>
  );
}
