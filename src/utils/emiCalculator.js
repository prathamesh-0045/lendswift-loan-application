export function calculateEMI(principal, annualRate, months){const P=Number(principal),n=Number(months),r=Number(annualRate)/12/100;if(!P||!n)return 0;return r===0?P/n:P*r*Math.pow(1+r,n)/(Math.pow(1+r,n)-1)}
export const processingFee=(amount)=>Math.min(25000,Math.max(2000,Number(amount||0)*0.01));
export const formatINRValue=(value)=>new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(value||0);
