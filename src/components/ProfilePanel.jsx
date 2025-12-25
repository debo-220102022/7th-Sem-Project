import React from 'react'
import { calcBMI } from '../utils/calculations'

export default function ProfilePanel({ userdata, onUpdateBiometrics }){
  if(!userdata) return <div className="p-3 bg-white rounded">Please login to see profile.</div>
  return (
    <div className="p-3 bg-white rounded">
      <h3 className="font-semibold">Profile</h3>
      <p>Name: {userdata.name}</p>
      <p>Weight: {userdata.profile.weight} kg</p>
      <p>Height: {userdata.profile.height} cm</p>
      <p>BMI: {calcBMI(userdata.profile.weight, userdata.profile.height)}</p>
      <div className="mt-2 text-xs text-gray-500">Last updated: {userdata.lastBiometricsAt}</div>
      <div className="mt-2"><button className="px-2 py-1 border rounded" onClick={()=>{ const w=prompt('weight', userdata.profile.weight); const h=prompt('height', userdata.profile.height); if(w && h) onUpdateBiometrics({...userdata.profile, weight:Number(w), height:Number(h)}) }}>Update</button></div>
    </div>
  )
}