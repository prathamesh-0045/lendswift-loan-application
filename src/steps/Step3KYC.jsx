import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import Input from '../components/Input';
import StepFormLayout from './StepFormLayout';
import { validateAadhaar, validatePan } from '../utils/validators';

const DEMO_PAN = 'ABCPP1234D';
const DEMO_AADHAAR = '100000000004';

const emptyStatus = {
  loading: false,
  valid: false,
  message: '',
};

export default function Step3KYC({
  stepNumber,
  step,
  formData,
  onNext,
  onBack,
  onSaveDraft,
  canGoBack,
  isLastStep,
}) {
  const [panStatus, setPanStatus] = useState(emptyStatus);
  const [aadhaarStatus, setAadhaarStatus] = useState(emptyStatus);
  const [submitError, setSubmitError] = useState('');
  const timers = useRef({ pan: null, aadhaar: null });

  const {
    register,
    handleSubmit,
    getValues,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: 'onBlur',
    defaultValues: {
      ...formData,
      panNumber: formData.panNumber ?? '',
      aadhaarNumber: formData.aadhaarNumber ?? '',
      aadhaarConsent: Boolean(formData.aadhaarConsent),
      voterId: formData.voterId ?? '',
      passport: formData.passport ?? '',
    },
  });

  const pan = watch('panNumber');
  const aadhaar = watch('aadhaarNumber');
  const consent = watch('aadhaarConsent');
  const loanType = formData.loanType || 'personal';
  const passportRequired = loanType === 'home' && Number(formData.loanAmount) > 5000000;

  const verify = (type, value) => {
    const normalized = String(value ?? '').trim();
    const result = type === 'pan'
      ? validatePan(normalized, loanType)
      : validateAadhaar(normalized);
    const setter = type === 'pan' ? setPanStatus : setAadhaarStatus;

    if (timers.current[type]) {
      window.clearTimeout(timers.current[type]);
      timers.current[type] = null;
    }

    if (!result.valid) {
      setter({ loading: false, valid: false, message: result.message });
      return false;
    }

    setter({ loading: true, valid: false, message: 'Verifying…' });
    timers.current[type] = window.setTimeout(() => {
      setter({ loading: false, valid: true, message: 'Verified' });
      timers.current[type] = null;
    }, 1500);
    return true;
  };

  useEffect(() => () => {
    Object.values(timers.current).forEach((timer) => timer && window.clearTimeout(timer));
  }, []);

  useEffect(() => {
    const value = String(pan ?? '').toUpperCase().replace(/\s/g, '');
    if (value.length === 10) {
      verify('pan', value);
    } else {
      if (timers.current.pan) window.clearTimeout(timers.current.pan);
      setPanStatus(emptyStatus);
    }
  }, [pan, loanType]);

  useEffect(() => {
    const value = String(aadhaar ?? '').replace(/\D/g, '');
    if (value.length === 12) {
      verify('aadhaar', value);
    } else {
      if (timers.current.aadhaar) window.clearTimeout(timers.current.aadhaar);
      setAadhaarStatus(emptyStatus);
    }
  }, [aadhaar]);

  const fillDemoData = () => {
    setSubmitError('');
    setValue('panNumber', DEMO_PAN, { shouldDirty: true, shouldValidate: true });
    setValue('aadhaarNumber', DEMO_AADHAAR, { shouldDirty: true, shouldValidate: true });
    setValue('aadhaarConsent', true, { shouldDirty: true, shouldValidate: true });
  };

  const submit = (data) => {
    if (!panStatus.valid || !aadhaarStatus.valid) {
      setSubmitError('Complete PAN and Aadhaar verification before continuing.');
      return;
    }
    if (!consent) {
      setSubmitError('Please provide Aadhaar consent before continuing.');
      return;
    }
    if (passportRequired && !data.passport) {
      setSubmitError('Passport is required for this Home Loan amount.');
      return;
    }

    setSubmitError('');
    onNext({
      ...data,
      panNumber: String(data.panNumber ?? '').toUpperCase(),
      panVerified: true,
      aadhaarVerified: true,
    });
  };

  return (
    <StepFormLayout
      stepNumber={stepNumber}
      title={step.title}
      description="Verify your PAN and Aadhaar using the assessment simulation."
      errors={errors}
      onBack={onBack}
      onSaveDraft={onSaveDraft}
      canGoBack={canGoBack}
      isLastStep={isLastStep}
      isSubmitting={isSubmitting}
      getValues={getValues}
      onSubmit={handleSubmit(submit)}
    >
      <div className="space-y-6">
        <div className="flex flex-col gap-3 rounded-lg border border-brand bg-brand-soft p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-ink">Assessment demo data</p>
            <p className="mt-1 text-xs text-ink-muted">
              Use the demo values below. Never enter real PAN or Aadhaar details.
            </p>
          </div>
          <button
            type="button"
            onClick={fillDemoData}
            className="min-h-11 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark"
          >
            Fill demo values
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Input
            id="panNumber"
            required
            error={!panStatus.valid && panStatus.message ? panStatus.message : errors.panNumber?.message}
            hint="Format: AAAAA9999A. Demo: ABCPP1234D. Verification takes 1.5 seconds."
          >
            <Input.Label>PAN Number</Input.Label>
            <Input.Field
              {...register('panNumber', {
                required: 'PAN is required',
                setValueAs: (value) => String(value ?? '').toUpperCase().replace(/\s/g, ''),
              })}
              maxLength={10}
              autoComplete="off"
              spellCheck="false"
            />
            <Input.HelpText />
            <Input.Error />
          </Input>

          <Input
            id="aadhaarNumber"
            required
            error={!aadhaarStatus.valid && aadhaarStatus.message ? aadhaarStatus.message : errors.aadhaarNumber?.message}
            hint="12 digits with Verhoeff checksum. Demo: 100000000004. Do not enter real Aadhaar details."
          >
            <Input.Label>Aadhaar Number</Input.Label>
            <Input.Field
              {...register('aadhaarNumber', {
                required: 'Aadhaar is required',
                setValueAs: (value) => String(value ?? '').replace(/\D/g, ''),
              })}
              inputMode="numeric"
              maxLength={12}
              autoComplete="off"
            />
            <Input.HelpText />
            <Input.Error />
          </Input>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <Status status={panStatus} label="PAN verification" />
          <Status status={aadhaarStatus} label="Aadhaar verification" />
        </div>

        <label className="flex gap-3 rounded-lg border border-line p-4">
          <input
            type="checkbox"
            {...register('aadhaarConsent', { required: 'Aadhaar consent is required' })}
            className="mt-1 h-4 w-4"
          />
          <span className="text-sm">
            I consent to LendSwift using my Aadhaar details for this assessment verification simulation.
          </span>
        </label>
        {errors.aadhaarConsent?.message ? (
          <p role="alert" className="text-sm font-medium text-danger">{errors.aadhaarConsent.message}</p>
        ) : null}

        <div className="grid gap-6 md:grid-cols-2">
          <Input
            id="voterId"
            error={errors.voterId?.message}
            hint="Optional: 3 letters + 7 digits"
          >
            <Input.Label>Voter ID</Input.Label>
            <Input.Field
              {...register('voterId', {
                setValueAs: (value) => String(value ?? '').toUpperCase().replace(/\s/g, ''),
                pattern: {
                  value: /^[A-Z]{3}\d{7}$/,
                  message: 'Use 3 letters followed by 7 digits',
                },
              })}
              maxLength={10}
              autoComplete="off"
            />
            <Input.HelpText />
            <Input.Error />
          </Input>

          <Input
            id="passport"
            required={passportRequired}
            error={errors.passport?.message}
            hint={passportRequired ? 'Required for Home Loan amounts above ₹50 L.' : 'Optional: 1 letter + 7 digits'}
          >
            <Input.Label>Passport</Input.Label>
            <Input.Field
              {...register('passport', {
                required: passportRequired ? 'Passport is required for this Home Loan amount' : false,
                setValueAs: (value) => String(value ?? '').toUpperCase().replace(/\s/g, ''),
                pattern: {
                  value: /^[A-Z]\d{7}$/,
                  message: 'Use 1 letter followed by 7 digits',
                },
              })}
              maxLength={8}
              autoComplete="off"
            />
            <Input.HelpText />
            <Input.Error />
          </Input>
        </div>

        {submitError ? (
          <div role="alert" className="rounded-lg border border-danger bg-danger-soft p-4 text-sm font-medium text-danger">
            {submitError}
          </div>
        ) : null}
      </div>
    </StepFormLayout>
  );
}

function Status({ status, label }) {
  return (
    <div aria-live="polite" className="rounded-lg bg-brand-soft p-3 text-sm">
      <span className="font-semibold">{label}: </span>
      {status.loading ? 'Verifying…' : status.valid ? '✓ Verified' : status.message || 'Enter a valid value to start verification.'}
    </div>
  );
}
