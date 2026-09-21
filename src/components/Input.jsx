import {
  FormField,
  FieldLabel,
  FieldHelpText,
  FieldError,
  TextControl,
} from './FormField';

/**
 * Compound text input:
 *   <Input id="x" error={...} hint="..." required>
 *     <Input.Label>Label</Input.Label>
 *     <Input.Field {...register('x')} />
 *     <Input.HelpText />
 *     <Input.Error />
 *   </Input>
 *
 * Input.Field forwards its ref, so it works with React Hook Form's register()
 * and equally as a controlled input with value/onChange.
 */
function Input(props) {
  return <FormField {...props} />;
}

Input.Label = FieldLabel;
Input.Field = TextControl;
Input.HelpText = FieldHelpText;
Input.Error = FieldError;

export default Input;
