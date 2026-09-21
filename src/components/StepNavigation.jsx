export default function StepNavigation({ onBack, onSaveDraft, canGoBack, isLastStep, isSubmitting }) {
  return (
    <div className="mt-8 flex items-center justify-between border-t border-slate-200 pt-5">
      <button type="button" onClick={onBack} disabled={!canGoBack} className="min-h-11 rounded-lg border border-slate-200 bg-white px-5 py-2 font-semibold text-slate-700 disabled:invisible">
        ← Previous
      </button>
      <div className="flex gap-3">
        <button type="button" onClick={onSaveDraft} className="min-h-11 rounded-lg border border-slate-200 bg-white px-5 py-2 font-semibold text-slate-700">
          Save Draft
        </button>
        <button type="submit" disabled={isSubmitting} className="min-h-11 rounded-lg bg-emerald-600 px-6 py-2 font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:opacity-60">
          {isLastStep ? 'Submit Application' : 'Next →'}
        </button>
      </div>
    </div>
  );
}
