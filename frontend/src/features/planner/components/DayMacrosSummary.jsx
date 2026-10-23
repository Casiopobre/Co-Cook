import { MEAL_TYPES, MEAL_TYPE_LABELS } from '../utils/weekUtils'
import { scaleMacros, sumMacros, roundInt, round1 } from '../../../utils/macroCalculator'
import './DayMacrosSummary.css'

function sumDayMacros(dayPlan) {
  const scaled = MEAL_TYPES
    .map((mealType) => dayPlan?.[mealType])
    .filter(Boolean)
    .map((entry) => scaleMacros(entry.meal, entry.quantityGrams))
  return sumMacros(scaled)
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
              <span className="day-summary__value">{roundInt(totals.kcal)}</span>
              <span className="day-summary__label">kcal</span>
            </div>
            <div className="day-summary__stat">
              <span className="day-summary__value">{roundInt(totals.carbs)}g</span>
              <span className="day-summary__label">Carbohidratos</span>
            </div>
            <div className="day-summary__stat">
              <span className="day-summary__value">{roundInt(totals.proteins)}g</span>
              <span className="day-summary__label">Proteínas</span>
            </div>
            <div className="day-summary__stat">
              <span className="day-summary__value">{roundInt(totals.fats)}g</span>
              <span className="day-summary__label">Grasas</span>
            </div>
          </div>

          <ul className="day-summary__meals">
            {MEAL_TYPES.filter((mealType) => dayPlan?.[mealType]).map((mealType) => {
              const entry = dayPlan[mealType]
              const kcal = roundInt(scaleMacros(entry.meal, entry.quantityGrams).kcal)
              return (
                <li key={mealType} className="day-summary__meal-item">
                  <span className="day-summary__meal-type">{MEAL_TYPE_LABELS[mealType]}</span>
                  <span className="day-summary__meal-name">
                    {entry.meal.name} <small>({entry.quantityGrams} g)</small>
                  </span>
                  <span className="day-summary__meal-kcal">{kcal} kcal</span>
                </li>
              )
            })}
          </ul>
        </>
      )}
    </section>
  )
}