import React from 'react'
import { todayISO } from '../utils/helpers'

export default function CalendarView({ userdata, calendarDates, onQuickAdd }){
  return (
    <div>
      <div className="grid grid-cols-7 gap-1 text-xs mt-2">{['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d=> <div key={d} className="font-semibold text-center">{d}</div>)}</div>
      <div className="grid grid-cols-7 gap-1 mt-1 text-sm">
        {calendarDates.map((dt, idx)=> (
          <div key={idx} className={`min-h-[64px] p-1 border rounded ${dt===todayISO() ? 'bg-emerald-50': 'bg-white'}`}>
            {dt? (
              <div>
                <div className="flex justify-between items-center"><div className="text-xs font-semibold">{dt.slice(8)}</div><div><button className="text-xs px-1 py-0.5 border rounded" onClick={()=>onQuickAdd(dt)}>+Meal</button></div></div>
                <div className="mt-1 text-xs">
                  {(userdata && userdata.calendar && userdata.calendar[dt])?.slice(0,3).map(m=> (
                    <div key={m.id} className="p-1 rounded border mt-1 bg-white flex justify-between items-center">
                      <div><div className="font-semibold">{m.mealName}</div><div className="text-xs text-gray-500">{m.option? m.option.items.map(i=>i.name).join(' • '): 'custom'}</div></div>
                      <div className="flex flex-col items-end"><button className={`px-2 py-0.5 rounded ${m.eaten ? 'bg-green-400 text-white' : 'border'}`}>{m.eaten? 'Eaten' : 'Mark'}</button></div>
                    </div>
                  ))}
                </div>
              </div>
            ): null}
          </div>
        ))}
      </div>
    </div>
  )
}