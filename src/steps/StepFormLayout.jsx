import { useEffect, useRef } from 'react';
import StepNavigation from '../components/StepNavigation';

export default function StepFormLayout({ stepNumber, title, description, errors, onBack, onSaveDraft, canGoBack, isLastStep, isSubmitting, getValues, children, onSubmit }) {
  const errorSummaryRef = useRef(null);
  useEffect(() => { if (errors && Object.keys(errors).length) errorSummaryRef.current?.focus(); }, [errors]);
  return (
    <form className="space-y-6" noValidate onSubmit={onSubmit}>
      <header>
        <p className="text-sm font-semibold text-emerald-700">Step {stepNumber}</p>
        <h2 id="step-heading" className="mt-1 text-2xl font-bold tracking-tight text-slate-900">{title}</h2>
        {description && <p className="mt-1 text-slate-500">{description}</p>}
      </header>
      {errors && Object.keys(errors).length > 0 && (
        <div ref={errorSummaryRef} tabIndex={-1} role="alert" className="rounded-lg border border-red-200 bg-red-50 p-4">
          <h3 className="text-sm font-semibold text-red-700">Please fix the highlighted fields</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">{Object.entries(errors).map(([key, value]) => <li key={key}>{value?.message}</li>)}</ul>
        </div>
      )}
      <div>{children}</div>
      <StepNavigation onBack={onBack} onSaveDraft={() => onSaveDraft(getValues())} canGoBack={canGoBack} isLastStep={isLastStep} isSubmitting={isSubmitting} />
    </form>
  );
}
