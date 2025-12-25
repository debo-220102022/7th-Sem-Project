import React, { useEffect, useState } from 'react'
import { uid, todayISO } from '../utils/helpers'
import { FOOD_DATABASE } from '../utils/foodDB'

function generateOptionsForMealLocal(mealCal){
  const opts = [];
  for(let i=0;i<4;i++){
    const pick=[];
    let kcalSum=0;
    while(kcalSum < mealCal*0.7 && pick.length<3){
      const f = FOOD_DATABASE[Math.floor(Math.random()*FOOD_DATABASE.length)];
      pick.push(f);
      kcalSum+=f.kcal;
    }
    const multiplier = Math.max(0.5, (mealCal / Math.max(1,kcalSum)));
    opts.push({ id: uid(), items: pick, multiplier: +multiplier.toFixed(2) });
  }
  return opts;
}

export default function DailyPlanComposer({ userdata, onCreate }){
  const [date, setDate] = useState(todayISO());
  const [calculatedPlan, setCalculatedPlan] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState({});

  useEffect(()=>{
    if(userdata){
      const cal = Math.round((10*userdata.profile.weight + 6.25*userdata.profile.height - 5*userdata.profile.age + (userdata.profile.gender==='male'?5: userdata.profile.gender==='female'?-161:0)) * (userdata.profile.activity==='low'?1.2: userdata.profile.activity==='moderate'?1.45:1.7));
      const bp = {
        calories: cal,
        meals: [
          {name:'Breakfast', share:0.25},
          {name:'Snack', share:0.08},
          {name:'Lunch', share:0.33},
          {name:'Evening Snack', share:0.07},
          {name:'Dinner', share:0.27}
        ].map(m=>({
          ...m,
          kcal: Math.round(cal * m.share),
          options: generateOptionsForMealLocal(Math.round(cal*m.share))
        }))
      };
      setCalculatedPlan(bp);
    } else {
      setCalculatedPlan(null);
    }
  }, [userdata]);

  function chooseOption(mealName, option){ setSelectedOptions(s=>({...s, [mealName]: option})) }
  function handleCreate(){
    if(!calculatedPlan) return;
    const meals = (calculatedPlan.meals||[]).map(m=>({ name: m.name, option: selectedOptions[m.name]||m.options[0] }));
    onCreate(date,{meals, notes:''});
    alert('Saved');
  }

  if(!calculatedPlan) return <div className="text-sm text-gray-500">Login to compose a plan.</div>
  return (
    <div className="mt-2 p-2 border rounded">
      <div className="flex gap-2 items-center">
        <label className="text-sm">Date:</label>
        <input type="date" value={date} onChange={e=>setDate(e.target.value)} className="p-1 border rounded" />
        <button onClick={handleCreate} className="px-3 py-1 bg-emerald-600 text-white rounded">Save Daily Plan</button>
      </div>

      <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2">
        {calculatedPlan.meals.map((m,idx)=> (
          <div key={idx} className="p-2 border rounded">
            <div className="flex justify-between">
              <div className="font-semibold">{m.name}</div>
              <div className="text-sm">{m.kcal} kcal</div>
            </div>
            <div className="text-xs text-gray-600 mt-1">Choose an option (portions scaled to reach meal kcal)</div>
            <div className="mt-2 space-y-2">
              {m.options.map(opt=> (
                <div key={opt.id} className={`p-1 border rounded ${selectedOptions[m.name] && selectedOptions[m.name].id===opt.id ? 'bg-emerald-50' : ''}`}>
                  <div className="flex justify-between items-center">
                    <div className="text-sm font-medium">Option: {opt.items.map(i=>i.name).join(' + ')}</div>
                    <div className="text-xs">x{opt.multiplier}</div>
                  </div>
                  <div className="text-xs text-gray-600">Portions:</div>
                  <ul className="text-xs ml-3">
                    {opt.items.map((it,i)=> (
                      <li key={i}>{it.name} — approx {(opt.multiplier).toFixed(2)} serving(s) — {Math.round(it.kcal*opt.multiplier)} kcal</li>
                    ))}
                  </ul>
                  <div className="mt-1">
                    <button onClick={()=>chooseOption(m.name,opt)} className="px-2 py-0.5 border rounded text-xs">Select</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
