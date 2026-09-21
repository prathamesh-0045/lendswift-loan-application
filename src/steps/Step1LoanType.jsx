import { useEffect, useMemo, useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createStep1Schema, STEP1_DEFAULTS } from '../schemas/step1Schema';
import { LOAN_TYPES, MIN_LOAN_AMOUNT, getLoanConfig, getTenureOptions } from '../data/loanOptions';
import { formatINR, formatINRShort, formatTenure } from '../utils/format';
import Input from '../components/Input';
import Select from '../components/Select';
import CurrencyInput from '../components/CurrencyInput';
import StepNavigation from '../components/StepNavigation';
import { useLoanStore } from '../store/useLoanStore';

const demo = {
  loanType: 'personal', loanAmount: '500000', loanTenure: '36', loanPurpose: 'Education', referralCode: 'LSWIFT24',
  fullName: 'Priya Sharma', dateOfBirth: '1996-07-18', gender: 'Female', maritalStatus: 'Single', fatherName: 'Rajesh Sharma', motherName: 'Sunita Sharma', email: 'priya.sharma.demo@example.com', mobile: '9876543210', alternateMobile: '',
  panNumber: 'ABCPE1234F', aadhaarNumber: '100000000004', aadhaarConsent: true, panVerified: true, aadhaarVerified: true, voterId: 'ABC1234567',
  currentAddress1: 'Flat 302, Palm Grove Apartments, 100 Feet Road', currentAddress2: 'Koramangala 4th Block', currentPin: '560001', currentCity: 'Bengaluru', currentState: 'Karnataka', postOffice: 'Bengaluru GPO', residenceType: 'Rented', rentAmount: '25000', yearsAtAddress: '3', samePermanent: true,
  employmentType: 'Salaried', companyName: 'TechCorp Solutions Pvt. Ltd.', designation: 'Senior Software Engineer', monthlyNetSalary: '85000', yearsExperience: '5',
};

const loanTypeOptions = Object.entries(LOAN_TYPES).map(([value, config]) => ({ value, label: config.label, description: `Up to ${formatINRShort(config.maxAmount)}` }));

export default function Step1LoanType({ step, stepNumber, formData, onNext, onBack, onSaveDraft, canGoBack, isLastStep }) {
  const firstFieldRef = useRef(null);
  const schema = useMemo(() => createStep1Schema({ dateOfBirth: formData.dateOfBirth }), [formData.dateOfBirth]);
  const setFormData = useLoanStore((state) => state.setFormData);
  const touchSavedAt = useLoanStore((state) => state.touchSavedAt);
  const { register, control, handleSubmit, watch, setValue, reset, getValues, clearErrors, trigger, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(schema), mode: 'onBlur', reValidateMode: 'onChange', defaultValues: { ...STEP1_DEFAULTS, ...formData } });
  const loanType = watch('loanType');
  const config = getLoanConfig(loanType);
  const tenureOptions = getTenureOptions(loanType);
  const previousLoanType = useRef(loanType);

  useEffect(() => {
    if (previousLoanType.current === loanType) return;
    previousLoanType.current = loanType;
    setValue('loanTenure', '', { shouldDirty: true }); setValue('loanPurpose', '', { shouldDirty: true }); clearErrors(['loanTenure','loanPurpose']);
    if (getValues('loanAmount')) trigger('loanAmount');
  }, [loanType, setValue, clearErrors, getValues, trigger]);

  const loadDemo = () => { const all = { ...STEP1_DEFAULTS, ...demo }; reset(all); setFormData(all); touchSavedAt(); };
  return (
    <form onSubmit={handleSubmit(onNext)} noValidate className="space-y-7">
      <div className="flex items-start justify-between gap-4">
        <div><p className="text-sm font-semibold text-emerald-700">Step {stepNumber}</p><h2 id="step-heading" className="mt-1 text-2xl font-bold">Loan Type &amp; Basic Information</h2><p className="mt-1 text-slate-500">Select your loan type and enter the basic details.</p></div>
        <button type="button" onClick={loadDemo} className="shrink-0 rounded-lg border-2 border-emerald-400 bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700 shadow-sm">⚡ Load Demo Data</button>
      </div>
      <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-slate-700"><span className="h-2 w-2 rounded-full bg-emerald-500" /> <strong>Demo Mode</strong> — All information shown is fictional and for demonstration only.</div>
      <fieldset><legend className="mb-2 text-sm font-semibold">Loan Type <span className="text-red-600">*</span></legend><div className="grid gap-3 md:grid-cols-3">{loanTypeOptions.map((o,i)=><label key={o.value} className={`flex min-h-14 cursor-pointer items-center justify-center rounded-lg border-2 p-3 text-center transition ${loanType===o.value?'border-emerald-500 bg-emerald-50 font-bold text-emerald-700':'border-slate-200 bg-white hover:border-slate-300'}`}><input className="sr-only" type="radio" value={o.value} {...register('loanType')} ref={i===0?firstFieldRef:undefined}/><span>{o.label}</span></label>)}</div>{errors.loanType&&<p className="mt-1 text-sm text-red-600">{errors.loanType.message}</p>}</fieldset>
      <Input id="loanAmount" required error={errors.loanAmount?.message} hint={`Allowed range: ${formatINR(MIN_LOAN_AMOUNT)} – ${formatINR(config.maxAmount)}`}><Input.Label>Loan Amount</Input.Label><Controller name="loanAmount" control={control} render={({field})=><CurrencyInput name={field.name} ref={field.ref} value={field.value} onChange={field.onChange} onBlur={field.onBlur} placeholder="5,00,000" maxLength={11}/>} /><Input.HelpText/><Input.Error/></Input>
      <Select id="loanTenure" required error={errors.loanTenure?.message}><Select.Label>Loan Tenure</Select.Label><Select.Field {...register('loanTenure')}><option value="">Select tenure</option>{tenureOptions.map(m=><option key={m} value={m}>{formatTenure(m)}</option>)}</Select.Field><Select.Error/></Select>
      <Select id="loanPurpose" required error={errors.loanPurpose?.message}><Select.Label>Loan Purpose</Select.Label><Select.Field {...register('loanPurpose')}><option value="">Select purpose</option>{config.purposes.map(p=><option key={p}>{p}</option>)}</Select.Field><Select.Error/></Select>
      <Input id="referralCode" error={errors.referralCode?.message} hint="Optional partner or agent referral code."><Input.Label>Referral Code <span className="font-normal text-slate-400">(optional)</span></Input.Label><Input.Field {...register('referralCode')} placeholder="LSWIFT24" maxLength={10}/><Input.HelpText/><Input.Error/></Input>
      <StepNavigation onBack={onBack} onSaveDraft={()=>onSaveDraft(getValues())} canGoBack={canGoBack} isLastStep={isLastStep} isSubmitting={isSubmitting}/>
    </form>
  );
}
