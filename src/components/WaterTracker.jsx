import React from 'react'
import { todayISO } from '../utils/helpers'

export default function WaterTracker({ userdata, onAdd, onSetGoal }){
  if(!userdata) return <div className="p-3 bg-white rounded">Log in to track water.</div>
  const today = todayISO();
  const drank = (userdata.water.drankMlByDate && userdata.water.drankMlByDate[today])||0;
  return (
    <div className="p-3 bg-white rounded">
      <h3 className="font-semibold">Water</h3>
      <div>Goal: {userdata.water.goalMl} ml</div>
      <div className="mt-2 flex gap-2"><button onClick={()=>onAdd(250)} className="px-2 py-1 bg-emerald-600 text-white rounded">+250</button><button onClick={()=>onAdd(500)} className="px-2 py-1 bg-emerald-600 text-white rounded">+500</button></div>
      <div className="mt-2">Today: {drank} ml</div>
      <div className="mt-2"><input defaultValue={userdata.water.goalMl} onBlur={e=>onSetGoal(Number(e.target.value)||2000)} className="p-1 border rounded w-full" /></div>
    </div>
  )
}