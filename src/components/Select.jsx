import {
  FormField,
  FieldLabel,
  FieldHelpText,
  FieldError,
  SelectControl,
} from './FormField';

/** Compound select sharing the accessibility wiring of <Input>. */
function Select(props) {
  return <FormField {...props} />;
}

Select.Label = FieldLabel;
Select.Field = SelectControl;
Select.HelpText = FieldHelpText;
Select.Error = FieldError;

export default Select;
