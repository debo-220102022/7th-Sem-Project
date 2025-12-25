export function uid() { return Math.random().toString(36).slice(2,9); }
export function todayISO(){ return new Date().toISOString().slice(0,10); }
export function daysBetween(aISO,bISO){ return Math.floor((new Date(bISO)-new Date(aISO))/(1000*60*60*24)); }

export async function hashPassword(password){
  const enc = new TextEncoder();
  const data = enc.encode(password);
  const hashBuf = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuf)).map(b=>b.toString(16).padStart(2,'0')).join('');
}