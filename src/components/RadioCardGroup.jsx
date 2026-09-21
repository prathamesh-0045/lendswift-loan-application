import { useId } from 'react';

/**
 * Radio group rendered as selectable cards.
 * Native radios inside a <fieldset>/<legend> keep arrow-key navigation,
 * screen reader grouping and the browser's own focus handling intact.
 */
export default function RadioCardGroup({
  legend,
  options,
  value,
  error,
  registration,
  firstInputRef,
}) {
  const groupId = useId();
  const errorId = error ? `${groupId}-error` : undefined;
  const { ref: registerRef, ...registerRest } = registration ?? {};

  return (
    <fieldset aria-describedby={errorId} aria-invalid={error ? 'true' : undefined}>
      <legend className="mb-3 text-sm font-semibold text-ink">
        {legend} <span className="font-normal text-ink-muted">(required)</span>
      </legend>

      <div className="grid gap-3 sm:grid-cols-3">
        {options.map((option, index) => {
          const checked = value === option.value;
          return (
            <label
              key={option.value}
              className={[
                'flex min-h-11 cursor-pointer gap-3 rounded-xl border p-4 transition-colors',
                'has-[:focus-visible]:outline has-[:focus-visible]:outline-2',
                'has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-brand',
                checked ? 'border-brand bg-brand-soft' : 'border-line bg-white hover:border-brand/50',
              ].join(' ')}
            >
              <input
                {...registerRest}
                ref={(node) => {
                  registerRef?.(node);
                  if (index === 0 && firstInputRef) firstInputRef.current = node;
                }}
                type="radio"
                value={option.value}
                data-first-field={index === 0 ? 'true' : undefined}
                checked={checked}
                className="mt-1 h-4 w-4 shrink-0 accent-[var(--color-brand)]"
              />
              <span>
                <span className="block font-semibold text-ink">{option.label}</span>
                {option.description ? (
                  <span className="mt-0.5 block text-xs text-ink-muted">{option.description}</span>
                ) : null}
              </span>
            </label>
          );
        })}
      </div>

      {error ? (
        <p
          id={errorId}
          role="alert"
          aria-live="polite"
          className="mt-2 flex items-start gap-1.5 text-sm font-medium text-danger"
        >
          <span aria-hidden="true">!</span>
          <span>{error}</span>
        </p>
      ) : null}
    </fieldset>
  );
}
