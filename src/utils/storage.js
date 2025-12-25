import { todayISO } from './helpers'

export function loadAccounts(){ try { return JSON.parse(localStorage.getItem('dp_accounts'))||{} } catch(e){ return {} } }
export function saveAccounts(acc){ localStorage.setItem('dp_accounts', JSON.stringify(acc)) }
export function saveActiveUser(active){ localStorage.setItem('dp_active_user', JSON.stringify(active)) }
export function loadActiveUser(){ try { return JSON.parse(localStorage.getItem('dp_active_user')) } catch(e){ return null } }

export function loadUserData(username){ try { return JSON.parse(localStorage.getItem(`dp_user_${username}`)) } catch(e){ return null } }
export function saveUserData(username, data){ localStorage.setItem(`dp_user_${username}`, JSON.stringify(data)) }

export function createEmptyUser(username, name){
  const now = todayISO();
  return { username, name, profile:{age:30,gender:'other',weight:70,height:170,activity:'moderate'}, lastBiometricsAt:now, calendar:{}, water:{goalMl:2000,drankMlByDate:{}}, history:[] }
}