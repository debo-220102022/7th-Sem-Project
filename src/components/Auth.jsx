import React, {useState} from 'react'
import { loadAccounts, saveAccounts, saveActiveUser } from '../utils/storage'
import { hashPassword } from '../utils/helpers'

export default function Auth({ onLogin }){
  const [view, setView] = useState('login');
  const [username,setUsername] = useState('');
  const [password,setPassword] = useState('');
  const [displayName,setDisplayName] = useState('');

  async function handleSignup(e){ e.preventDefault(); if(!username||!password) return alert('enter username & password'); const accounts = loadAccounts(); if(accounts[username]) return alert('exists'); const hash = await hashPassword(password); accounts[username]={passwordHash:hash,displayName:displayName||username,createdAt:new Date().toISOString()}; saveAccounts(accounts); alert('created'); setView('login'); }

  async function handleLogin(e){ e.preventDefault(); const accounts = loadAccounts(); const acc = accounts[username]; if(!acc) return alert('not found'); const hash = await hashPassword(password); if(hash!==acc.passwordHash) return alert('wrong password'); const active = { username, displayName: acc.displayName }; saveActiveUser(active); onLogin(active); }

  return (
    <div className="p-6 max-w-md mx-auto">
      {view==='login'? (
        <form onSubmit={handleLogin} className="space-y-2">
          <h2 className="text-xl font-bold">Login</h2>
          <input className="w-full p-2 border rounded" placeholder="username" value={username} onChange={e=>setUsername(e.target.value)} />
          <input type="password" className="w-full p-2 border rounded" placeholder="password" value={password} onChange={e=>setPassword(e.target.value)} />
          <div className="flex gap-2"><button className="px-3 py-1 bg-emerald-600 text-white rounded">Login</button><button type="button" className="px-3 py-1 border rounded" onClick={()=>setView('signup')}>Create account</button></div>
        </form>
      ): (
        <form onSubmit={handleSignup} className="space-y-2">
          <h2 className="text-xl font-bold">Sign up</h2>
          <input className="w-full p-2 border rounded" placeholder="username" value={username} onChange={e=>setUsername(e.target.value)} />
          <input className="w-full p-2 border rounded" placeholder="display name" value={displayName} onChange={e=>setDisplayName(e.target.value)} />
          <input type="password" className="w-full p-2 border rounded" placeholder="password" value={password} onChange={e=>setPassword(e.target.value)} />
          <div className="flex gap-2"><button className="px-3 py-1 bg-emerald-600 text-white rounded">Create</button><button type="button" className="px-3 py-1 border rounded" onClick={()=>setView('login')}>Back</button></div>
        </form>
      )}
    </div>
  )
}