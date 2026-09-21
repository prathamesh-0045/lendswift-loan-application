import { useEffect, useState } from 'react';
import Wizard from './wizard/Wizard';
import { useLoanStore } from './store/useLoanStore';

const formatSavedTime = (iso) => new Date(iso).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

export default function App() {
  const lastSavedAt = useLoanStore((state) => state.lastSavedAt);
  const reset = useLoanStore((state) => state.reset);
  const [restoredDraft, setRestoredDraft] = useState(false);

  useEffect(() => {
    if (useLoanStore.getState().lastSavedAt) setRestoredDraft(true);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <a href="#application" className="skip-link">Skip to the application form</a>
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-5 py-5">
          <div>
            <div className="text-2xl font-extrabold tracking-tight text-emerald-700">LendSwift</div>
            <p className="text-xs text-slate-500">Digital Lending Made Simple</p>
          </div>
          <p aria-live="polite" className="text-xs text-slate-500">{lastSavedAt ? `Draft saved at ${formatSavedTime(lastSavedAt)}` : ''}</p>
        </div>
      </header>

      <main id="application" className="mx-auto max-w-3xl px-4 py-7 sm:px-6 sm:py-10">
        <h1 className="sr-only">LendSwift loan application</h1>
        {restoredDraft && (
          <div className="mb-5 flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm">
            <span>We picked up where you left off.</span>
            <button type="button" onClick={() => { reset(); setRestoredDraft(false); }} className="rounded-lg border border-slate-200 bg-white px-3 py-2 font-semibold">Start Fresh</button>
          </div>
        )}
        <Wizard />
        <p className="mt-6 text-center text-xs text-slate-500">Assessment simulation. Do not enter real PAN, Aadhaar, bank or income details.</p>
      </main>
    </div>
  );
}
