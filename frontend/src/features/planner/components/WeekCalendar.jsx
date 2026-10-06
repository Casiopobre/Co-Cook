import { Fragment } from 'react'
import { MEAL_TYPES, MEAL_TYPE_LABELS, DAY_LABELS, toISODate } from '../utils/weekUtils'
import { MealSlot } from './MealSlot'
import './WeekCalendar.css'

export function WeekCalendar({
  weekDates,
  weekPlan,
  selectedDate,
  onSelectDate,
  onAddMeal,
  onRemoveMeal,
}) {
  return (
    <div className="week-calendar">
      <div className="week-calendar__scroll">
        <div className="week-calendar__grid">
          <div className="week-calendar__corner" />

          {weekDates.map((date, i) => {
            const iso = toISODate(date)
            const isSelected = iso === selectedDate

            return (
              <button
                key={iso}
                type="button"
                className={`week-calendar__day-header ${isSelected ? 'week-calendar__day-header--selected' : ''}`}
                onClick={() => onSelectDate(iso)}
                aria-pressed={isSelected}
              >
                <span className="week-calendar__day-label">{DAY_LABELS[i]}</span>
                <span className="week-calendar__day-number">{date.getDate()}</span>
              </button>
            )
          })}

          {MEAL_TYPES.map((mealType) => (
            <Fragment key={mealType}>
              <div className="week-calendar__row-label">
                {MEAL_TYPE_LABELS[mealType]}
              </div>

              {weekDates.map((date) => {
                const iso = toISODate(date)
                const meal = weekPlan[iso]?.[mealType] ?? null
                const isSelected = iso === selectedDate

                return (
                  <div
                    key={`${iso}-${mealType}`}
                    className={`week-calendar__cell ${isSelected ? 'week-calendar__cell--selected' : ''}`}
                  >
                    <MealSlot
                      meal={meal}
                      onAdd={() => onAddMeal(iso, mealType)}
                      onRemove={() => onRemoveMeal(iso, mealType)}
                    />
                  </div>
                )
              })}
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  )
}