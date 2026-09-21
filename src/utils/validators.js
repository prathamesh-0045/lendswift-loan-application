const PAN_TYPES = { P:'Individual', C:'Company', H:'HUF', A:'AOP', B:'BOI', G:'Government', J:'Artificial Juridical Person', L:'Local Authority', F:'Firm', T:'Trust' };
export function validatePan(value, loanType='personal') {
  const pan = String(value||'').toUpperCase().replace(/\s/g,'');
  if (!/^[A-Z]{5}\d{4}[A-Z]$/.test(pan)) return { valid:false, message:'PAN must follow AAAAA9999A format' };
  const allowed = loanType === 'business' ? ['P','C','F'] : ['P'];
  if (!allowed.includes(pan[3])) return { valid:false, message:`PAN 4th character must indicate an allowed entity type (${allowed.join(', ')})` };
  return { valid:true, message:`Valid ${PAN_TYPES[pan[3]]} PAN format` };
}
const d=[[0,1,2,3,4,5,6,7,8,9],[1,2,3,4,0,6,7,8,9,5],[2,3,4,0,1,7,8,9,5,6],[3,4,0,1,2,8,9,5,6,7],[4,0,1,2,3,9,5,6,7,8],[5,9,8,7,6,0,4,3,2,1],[6,5,9,8,7,1,0,4,3,2],[7,6,5,9,8,2,1,0,4,3],[8,7,6,5,9,3,2,1,0,4],[9,8,7,6,5,4,3,2,1,0]];
const p=[[0,1,2,3,4,5,6,7,8,9],[1,5,7,6,2,8,3,0,9,4],[5,8,0,3,7,9,6,1,4,2],[8,9,1,6,0,4,3,5,2,7],[9,4,5,3,1,2,6,8,7,0],[4,2,8,6,5,7,3,9,0,1],[2,7,9,5,8,1,0,4,6,3],[7,0,4,9,1,3,5,2,8,6]];
const inv=[0,4,3,2,1,5,6,7,8,9];
export function validateAadhaar(value){ const s=String(value||'').replace(/\D/g,''); if(!/^\d{12}$/.test(s)) return {valid:false,message:'Aadhaar must contain exactly 12 digits'}; let c=0; const rev=s.split('').reverse().map(Number); rev.forEach((num,i)=>{ c=d[c][p[i%8][num]]; }); return c===0?{valid:true,message:'Aadhaar checksum is valid'}:{valid:false,message:'Aadhaar checksum is invalid'}; }
export const maskAadhaar=(v)=>{const s=String(v||'').replace(/\D/g,''); return s.length===12?`XXXX-XXXX-${s.slice(-4)}`:s;};
export const maskPan=(v)=>{const s=String(v||'').toUpperCase(); return s.length===10?`${s.slice(0,2)}******${s.slice(-2)}`:s;};
