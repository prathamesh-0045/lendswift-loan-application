import Step1LoanType from '../steps/Step1LoanType';
import Step2Personal from '../steps/Step2Personal';
import Step3KYC from '../steps/Step3KYC';
import Step4Address from '../steps/Step4Address';
import Step5Employment from '../steps/Step5Employment';
import Step7Documents from '../steps/Step7Documents';
import Step8Review from '../steps/Step8Review';

// Seven-screen presentation matching the supplied LendSwift reference video.
// The conditional co-applicant flow is rendered inside Documents when required.
export const STEPS = [
  { id: 'loanType', title: 'Loan Details', shortTitle: 'Loan Details', component: Step1LoanType },
  { id: 'personal', title: 'Personal Info', shortTitle: 'Personal Info', component: Step2Personal },
  { id: 'kyc', title: 'Identity Verification', shortTitle: 'Identity Verification', component: Step3KYC },
  { id: 'address', title: 'Address Information', shortTitle: 'Address Information', component: Step4Address },
  { id: 'employment', title: 'Employment & Income', shortTitle: 'Employment & Income', component: Step5Employment },
  { id: 'documents', title: 'Document Upload', shortTitle: 'Document Upload', component: Step7Documents },
  { id: 'review', title: 'Review & Confirm', shortTitle: 'Review & Confirm', component: Step8Review },
];

export const getActiveSteps = () => STEPS;
export const getStepIndex = (steps, stepId) => steps.findIndex((step) => step.id === stepId);
