import { createContext, forwardRef, useContext, useId } from 'react';

/**
 * One accessibility contract for every control in the form:
 * a real <label htmlFor>, aria-invalid on error, and aria-describedby that
 * points only at elements that actually exist.
 */
const FieldContext = createContext(null);

const useField = () => {
  const context = useContext(FieldContext);
  if (!context) {
    throw new Error('Field sub-components must be rendered inside <Input> or <Select>.');
  }
  return context;
};

export function FormField({
  id: providedId,
  hint,
  error,
  required = false,
  className = '',
  children,
}) {
  const generatedId = useId();
  const id = providedId ?? generatedId;
  const hintId = hint ? `${id}-hint` : null;
  const errorId = error ? `${id}-error` : null;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;

  const value = { id, hint, error, required, hintId, errorId, describedBy };

  return (
    <FieldContext.Provider value={value}>
      <div className={`space-y-1.5 ${className}`}>{children}</div>
    </FieldContext.Provider>
  );
}

export function FieldLabel({ children, className = '' }) {
  const { id, required } = useField();
  return (
    <label htmlFor={id} className={`block text-sm font-semibold text-ink ${className}`}>
      {children}{' '}
      <span className="font-normal text-ink-muted">{required ? '(required)' : '(optional)'}</span>
    </label>
  );
}

export function FieldHelpText({ children }) {
  const { hintId, hint } = useField();
  const content = children ?? hint;
  if (!content) return null;
  return (
    <p id={hintId ?? undefined} className="text-xs text-ink-muted">
      {content}
    </p>
  );
}

export function FieldError({ children }) {
  const { errorId, error } = useField();
  const message = children ?? error;
  if (!message) return null;
  return (
    <p
      id={errorId ?? undefined}
      role="alert"
      aria-live="polite"
      className="flex items-start gap-1.5 text-sm font-medium text-danger"
    >
      <span aria-hidden="true">!</span>
      <span>{message}</span>
    </p>
  );
}

const controlClasses = (error) =>
  [
    'block w-full min-h-11 rounded-lg border bg-white px-3 py-2 text-ink',
    'placeholder:text-slate-400',
    error ? 'border-danger' : 'border-line',
  ].join(' ');

export const TextControl = forwardRef(function TextControl(
  { className = '', prefix, ...props },
  ref,
) {
  const { id, error, describedBy } = useField();
  const input = (
    <input
      {...props}
      id={id}
      ref={ref}
      aria-invalid={error ? 'true' : undefined}
      aria-describedby={describedBy}
      className={`${controlClasses(error)} ${prefix ? 'pl-8' : ''} ${className}`}
    />
  );

  if (!prefix) return input;
  return (
    <div className="relative">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted"
      >
        {prefix}
      </span>
      {input}
    </div>
  );
});

export const SelectControl = forwardRef(function SelectControl(
  { className = '', children, ...props },
  ref,
) {
  const { id, error, describedBy } = useField();
  return (
    <select
      {...props}
      id={id}
      ref={ref}
      aria-invalid={error ? 'true' : undefined}
      aria-describedby={describedBy}
      className={`${controlClasses(error)} ${className}`}
    >
      {children}
    </select>
  );
});
