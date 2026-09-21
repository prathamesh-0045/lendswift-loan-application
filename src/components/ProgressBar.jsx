export default function ProgressBar({ steps, currentStepId }) {
  const position = steps.findIndex((step) => step.id === currentStepId) + 1;
  const total = steps.length;
  const percent = Math.round((position / total) * 100);

  return (
    <div className="mb-7 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start gap-1 overflow-x-auto pb-2" aria-hidden="true">
        {steps.map((step, index) => {
          const done = index + 1 < position;
          const active = index + 1 === position;
          return (
            <div key={step.id} className="relative min-w-[88px] flex-1 text-center">
              <div className="flex items-center">
                {index > 0 && <div className={`h-1 flex-1 ${done ? 'bg-emerald-500' : 'bg-slate-200'}`} />}
                <div className={`mx-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold ${
                  done ? 'border-emerald-500 bg-emerald-500 text-white' : active ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-slate-100 text-slate-500'
                }`}>
                  {done ? '✓' : index + 1}
                </div>
                {index < total - 1 && <div className={`h-1 flex-1 ${done ? 'bg-emerald-500' : 'bg-slate-200'}`} />}
              </div>
              <p className={`mt-2 text-[11px] leading-tight ${active ? 'font-bold text-emerald-700' : done ? 'font-semibold text-slate-600' : 'text-slate-500'}`}>{step.shortTitle}</p>
            </div>
          );
        })}
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-200">
        <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${percent}%` }} />
      </div>
      <p className="sr-only" aria-live="polite">Step {position} of {total}: {steps[position - 1]?.title}</p>
    </div>
  );
}
