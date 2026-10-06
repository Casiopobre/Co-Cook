import { MOCK_MEALS } from '../../meals/mocks/mockMeals'
import { getWeekDates, toISODate } from '../utils/weekUtils'

// Construye MealPlan de prueba repartidos por la semana actual,
// con algunas celdas vacías a propósito para ver el estado "+"
function buildMockMealPlans() {
  const weekDates = getWeekDates(new Date())
  const [mon, tue, wed, thu, fri, sat, sun] = weekDates.map(toISODate)

  return [
    { id: 101, date: mon, mealType: 'BREAKFAST', meal: MOCK_MEALS[0] },
    { id: 102, date: mon, mealType: 'LUNCH', meal: MOCK_MEALS[2] },
    { id: 103, date: mon, mealType: 'DINNER', meal: MOCK_MEALS[4] },

    { id: 104, date: tue, mealType: 'BREAKFAST', meal: MOCK_MEALS[3] },
    { id: 105, date: tue, mealType: 'LUNCH', meal: MOCK_MEALS[5] },

    { id: 106, date: wed, mealType: 'BREAKFAST', meal: MOCK_MEALS[0] },
    { id: 107, date: wed, mealType: 'SNACK', meal: MOCK_MEALS[6] },
    { id: 108, date: wed, mealType: 'DINNER', meal: MOCK_MEALS[7] },

    { id: 109, date: thu, mealType: 'LUNCH', meal: MOCK_MEALS[1] },

    { id: 110, date: fri, mealType: 'BREAKFAST', meal: MOCK_MEALS[3] },
    { id: 111, date: fri, mealType: 'LUNCH', meal: MOCK_MEALS[2] },
    { id: 112, date: fri, mealType: 'SNACK', meal: MOCK_MEALS[6] },
    { id: 113, date: fri, mealType: 'DINNER', meal: MOCK_MEALS[4] },

    { id: 114, date: sat, mealType: 'LUNCH', meal: MOCK_MEALS[5] },

    // domingo queda totalmente vacío a propósito
  ]
}

export const MOCK_MEAL_PLANS = buildMockMealPlans()