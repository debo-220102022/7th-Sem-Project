import React from 'react'
export default function MealOption({opt}){
  return (
    <div className="p-1 border rounded">
      <div className="font-medium">{opt.items.map(i=>i.name).join(' + ')}</div>
      <div className="text-xs">x{opt.multiplier}</div>
    </div>
  )
}