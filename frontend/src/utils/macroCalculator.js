
// meal: cualquier objeto con los campos "...Per100g" (un MealDTO)
export function scaleMacros(meal, grams) {
  const factor = grams / 100
  return {
    kcal: meal.kcalPer100g * factor,
    carbs: meal.carbsPer100g * factor,
    proteins: meal.proteinsPer100g * factor,
    fats: meal.fatsPer100g * factor,
  }
}

export function sumMacros(items) {
  return items.reduce(
    (acc, i) => ({
      kcal: acc.kcal + i.kcal,
      carbs: acc.carbs + i.carbs,
      proteins: acc.proteins + i.proteins,
      fats: acc.fats + i.fats,
    }),
    { kcal: 0, carbs: 0, proteins: 0, fats: 0 }
  )
}

export const roundInt = (n) => Math.round(n)
export const round1 = (n) => Math.round(n * 10) / 10