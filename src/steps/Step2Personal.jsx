import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Input from '../components/Input';
import Select from '../components/Select';
import StepFormLayout from './StepFormLayout';
import { calculateAge } from '../utils/date';

const name = z.string().trim().min(2, 'Enter at least 2 characters').max(100, 'Use 100 characters or fewer').regex(/^[A-Za-z .]+$/, 'Use letters, spaces and periods only');
const schema = z.object({
  fullName: name,
  dateOfBirth: z.string().min(1, 'Select your date of birth').refine((v) => { const a = calculateAge(v); return a >= 21 && a <= 65; }, 'Applicant age must be between 21 and 65 years'),
  gender: z.enum(['Male','Female','Other'], { error: 'Select gender' }),
  maritalStatus: z.enum(['Single','Married','Divorced','Widowed'], { error: 'Select marital status' }),
  fatherName: name,
  motherName: name,
  email: z.string().trim().email('Enter a valid email address'),
  mobile: z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit mobile number starting with 6–9'),
  alternateMobile: z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid alternate mobile number').optional().or(z.literal('')),
}).superRefine((d, ctx) => { if (d.alternateMobile && d.alternateMobile === d.mobile) ctx.addIssue({ code:'custom', path:['alternateMobile'], message:'Alternate mobile must differ from primary mobile' }); });

export default function Step2Personal({ stepNumber, step, formData, onNext, onBack, onSaveDraft, canGoBack, isLastStep }) {
  const { register, handleSubmit, getValues, formState:{ errors, isSubmitting } } = useForm({ resolver:zodResolver(schema), mode:'onBlur', defaultValues:{...formData} });
  return <StepFormLayout stepNumber={stepNumber} title={step.title} description="Enter your personal details exactly as they appear on your identity documents." errors={errors} onBack={onBack} onSaveDraft={onSaveDraft} canGoBack={canGoBack} isLastStep={isLastStep} isSubmitting={isSubmitting} getValues={getValues} onSubmit={handleSubmit((data)=>onNext(data))}>
    <div className="grid gap-6 md:grid-cols-2">
      <Input id="fullName" required error={errors.fullName?.message}><Input.Label>Full Name (as per PAN)</Input.Label><Input.Field {...register('fullName')} data-first-field autoComplete="name"/><Input.Error/></Input>
      <Input id="dateOfBirth" required error={errors.dateOfBirth?.message}><Input.Label>Date of Birth</Input.Label><Input.Field {...register('dateOfBirth')} type="date"/><Input.Error/></Input>
      <Select id="gender" required error={errors.gender?.message}><Select.Label>Gender</Select.Label><Select.Field {...register('gender')}><option value="">Select gender</option><option>Male</option><option>Female</option><option>Other</option></Select.Field><Select.Error/></Select>
      <Select id="maritalStatus" required error={errors.maritalStatus?.message}><Select.Label>Marital Status</Select.Label><Select.Field {...register('maritalStatus')}><option value="">Select status</option><option>Single</option><option>Married</option><option>Divorced</option><option>Widowed</option></Select.Field><Select.Error/></Select>
      <Input id="fatherName" required error={errors.fatherName?.message}><Input.Label>Father’s Name</Input.Label><Input.Field {...register('fatherName')}/><Input.Error/></Input>
      <Input id="motherName" required error={errors.motherName?.message}><Input.Label>Mother’s Name</Input.Label><Input.Field {...register('motherName')}/><Input.Error/></Input>
      <Input id="email" required error={errors.email?.message} hint="Verification is simulated in this assessment."><Input.Label>Email</Input.Label><Input.Field {...register('email')} type="email" autoComplete="email"/><Input.HelpText/><Input.Error/></Input>
      <Input id="mobile" required error={errors.mobile?.message} hint="OTP verification is simulated."><Input.Label>Mobile Number</Input.Label><Input.Field {...register('mobile')} inputMode="numeric" maxLength={10}/><Input.HelpText/><Input.Error/></Input>
      <Input id="alternateMobile" error={errors.alternateMobile?.message}><Input.Label>Alternate Mobile <span className="font-normal text-ink-muted">(optional)</span></Input.Label><Input.Field {...register('alternateMobile')} inputMode="numeric" maxLength={10}/><Input.Error/></Input>
    </div>
    <button type="button" onClick={handleSubmit((data)=>onNext(data))} className="hidden">Continue</button>
  </StepFormLayout>;
}
