import { forwardRef } from 'react';
import { TextControl } from './FormField';
import { digitsOnly, formatIndianNumber } from '../utils/format';

/**
 * Text input that displays ₹ amounts in the Indian digit system (10,50,000)
 * while handing the form a plain numeric string.
 *
 * inputMode="numeric" keeps the numeric keypad on mobile without the
 * scroll-wheel and spinner problems of <input type="number">.
 */
const CurrencyInput = forwardRef(function CurrencyInput(
  { value, onChange, ...props },
  ref,
) {
  const handleChange = (event) => {
    const digits = digitsOnly(event.target.value);
    onChange?.(digits);
  };

  return (
    <TextControl
      {...props}
      ref={ref}
      type="text"
      inputMode="numeric"
      autoComplete="off"
      prefix="₹"
      value={value === '' || value === undefined || value === null ? '' : formatIndianNumber(value)}
      onChange={handleChange}
      className="tabular-nums"
    />
  );
});

export default CurrencyInput;
