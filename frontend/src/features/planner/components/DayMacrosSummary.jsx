import { MEAL_TYPES, MEAL_TYPE_LABELS } from '../utils/weekUtils'
import './DayMacrosSummary.css'

function sumDayMacros(dayPlan) {
  return MEAL_TYPES.reduce(
    (totals, mealType) => {
      const meal = dayPlan?.[mealType]
      if (!meal) return totals
      return {
        kcal: totals.kcal + meal.kcalPerServing,
        carbs: totals.carbs + meal.carbs,
        proteins: totals.proteins + meal.proteins,
        fats: totals.fats + meal.fats,
      }
    },
    { kcal: 0, carbs: 0, proteins: 0, fats: 0 }
  )
}

export function DayMacrosSummary({ selectedDate, dayPlan }) {
  const totals = sumDayMacros(dayPlan)
  const hasAnyMeal = MEAL_TYPES.some((mealType) => dayPlan?.[mealType])

  const formattedDate = new Date(selectedDate + 'T00:00:00').toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })

  return (
    <section className="day-summary">
      <h2 className="day-summary__title">
        {formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1)}
      </h2>

      {!hasAnyMeal ? (
        <p className="day-summary__empty">Todavía no has planificado comidas este día.</p>
      ) : (
        <>
          <div className="day-summary__totals">
            <div className="day-summary__stat day-summary__stat--kcal">
              <span className="day-summary__value">{totals.kcal}</span>
              <span className="day-summary__label">kcal</span>
            </div>
            <div className="day-summary__stat">
              <span className="day-summary__value">{totals.carbs}g</span>
              <span className="day-summary__label">Carbohidratos</span>
            </div>
            <div className="day-summary__stat">
              <span className="day-summary__value">{totals.proteins}g</span>
              <span className="day-summary__label">Proteínas</span>
            </div>
            <div className="day-summary__stat">
              <span className="day-summary__value">{totals.fats}g</span>
              <span className="day-summary__label">Grasas</span>
            </div>
          </div>

          <ul className="day-summary__meals">
            {MEAL_TYPES.filter((mealType) => dayPlan?.[mealType]).map((mealType) => (
              <li key={mealType} className="day-summary__meal-item">
                <span className="day-summary__meal-type">{MEAL_TYPE_LABELS[mealType]}</span>
                <span className="day-summary__meal-name">{dayPlan[mealType].name}</span>
                <span className="day-summary__meal-kcal">{dayPlan[mealType].kcalPerServing} kcal</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  )
}