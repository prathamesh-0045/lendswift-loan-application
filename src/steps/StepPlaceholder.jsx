import StepNavigation from '../components/StepNavigation';

/**
 * Stands in for steps 2-8 while they are built. It keeps the wizard walkable
 * end to end, so navigation, step visibility and persistence can be tested
 * before the remaining forms exist.
 */
export default function StepPlaceholder({
  step,
  stepNumber,
  onNext,
  onBack,
  onSaveDraft,
  canGoBack,
  isLastStep,
}) {
  const handleSubmit = (event) => {
    event.preventDefault();
    onNext({});
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <header>
        <p className="text-sm font-semibold text-brand">Step {stepNumber}</p>
        <h2
          id="step-heading"
          data-first-field
          tabIndex={-1}
          className="mt-1 text-2xl font-bold tracking-tight text-ink"
        >
          {step.title}
        </h2>
      </header>

      <p className="rounded-lg border border-dashed border-line bg-canvas p-4 text-ink-muted">
        This step is part of the next milestone. Everything you have entered so far is kept,
        and you can move back and forward freely.
      </p>

      <StepNavigation
        onBack={onBack}
        onSaveDraft={() => onSaveDraft(null)}
        canGoBack={canGoBack}
        isLastStep={isLastStep}
        isSubmitting={false}
      />
    </form>
  );
}
