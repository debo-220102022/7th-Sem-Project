export function calcBMI(weight, heightCm){ const h=heightCm/100; return +(weight/(h*h)).toFixed(1); }
export function calcCalories({age,gender,weight,height,activity}){
  let bmr; if (gender==='male') bmr=10*weight+6.25*height-5*age+5; else if (gender==='female') bmr=10*weight+6.25*height-5*age-161; else bmr=10*weight+6.25*height-5*age;
  const factor = activity==='low'?1.2:activity==='moderate'?1.45:1.7; return Math.round(bmr*factor);
}
export function recommendMacros(cal){ const carbs_kcal=cal*0.45, protein_kcal=cal*0.25, fat_kcal=cal*0.30; return {carbs_g: +(carbs_kcal/4).toFixed(1), protein_g: +(protein_kcal/4).toFixed(1), fat_g: +(fat_kcal/9).toFixed(1)} }