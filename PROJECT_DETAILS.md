# LendSwift – Implemented Screen Details

The supplied screenshots are used as visual reference only and are intentionally **not stored in the project**.
The corresponding screen details/options are implemented as real form UI.

## Implemented details

### Step 1 – Loan type and amount
- Personal / Home / Business loan cards
- Loan amount limits and INR formatting
- Product-specific tenure options
- Product-specific loan purpose options
- Optional referral code
- Co-applicant threshold notice

### Step 2 – Personal information
- Full Name (as per PAN)
- Date of Birth
- Age 21–65 validation
- Gender
- Marital Status
- Father's Name
- Mother's Name
- Email
- Mobile Number
- Alternate Mobile

### Step 3 – Identity verification
- PAN masked-input flow
- PAN format and entity-type validation
- Aadhaar 12-digit validation with Verhoeff checksum
- 1.5-second verification simulation
- Aadhaar consent
- Optional Voter ID
- Optional Passport for qualifying Home Loans
- Verified status indicators

### Step 4 – Address
- Current Address Line 1/2
- 6-digit PIN code lookup simulation
- City auto-fill
- State auto-fill/editable
- Post Office auto-fill
- Residence Type: Owned / Rented / Company / Family
- Monthly rent when Rented
- Years at current address
- Previous address when under one year
- Same as permanent address
- Conditional permanent-address section

### Step 5 – Employment and income
- Salaried / Self-Employed / Business Owner
- Salaried: Company, Designation, Monthly Net Salary
- Self-Employed: Business Name, Business Type, Turnover, Years in Business, Monthly Income
- Business Owner: Business Name, Business Type, Turnover, Years in Business, GST Number, Business Address
- Years of Experience
- Business-loan employment restriction

### Step 6 – Co-applicant
- Conditional step based on loan type and amount
- Co-applicant Name
- Relationship
- Co-applicant PAN
- Co-applicant Income
- Co-applicant Consent
- Spouse is the default relationship for married applicants

### Step 7 – Documents and signature
- Loan-type-dependent document checklist
- PAN copy becomes optional when PAN is verified
- Address proof
- Income proof
- Home Loan property documents
- Business registration and ITR for Business Loans
- PDF/JPG/PNG validation
- 5 MB per-file limit
- Up to 3 files per document type
- File status display
- Responsive canvas e-signature
- Clear signature action

### Step 8 – Review and submit
- Pre-approval summary
- Loan amount
- Tenure
- Indicative interest rate
- Estimated EMI
- Total cost of borrowing
- Processing fee
- EMI-to-income warning above 50%
- Applicant/application details
- Four separate consent checkboxes
- Submit button gated by consent
- Client-side application reference

## Reference UI pattern

The screenshots supplied by the candidate show the intended visual structure: LendSwift header, progress indicator, eight numbered stages, centered form card, Back/Save Draft/Save and Continue actions, and a review/submit stage. Those screenshots are not copied into the repository; the behavior and details are represented by the actual React screens.
