import { scaleMacros, roundInt } from '../../../utils/macroCalculator'
import { SaveMealButton } from './SaveMealButton'
import './MealSlot.css'

export function MealSlot({ entry, onAdd, onRemove }) {
  if (!entry) {
    return (
      <button type="button" className="meal-slot meal-slot--empty" onClick={onAdd}>
        <span className="meal-slot__plus">+</span>
      </button>
    )
  }

  const { meal, quantityGrams } = entry
  const kcal = roundInt(scaleMacros(meal, quantityGrams).kcal)

  return (
    <div className="meal-slot meal-slot--filled">
      <p className="meal-slot__name">{meal.name}</p>
      <p className="meal-slot__macros">{quantityGrams} g · {kcal} kcal</p>
      <button
        type="button"
        className="meal-slot__remove"
        onClick={onRemove}
        aria-label="Quitar comida"
      >
        ×
      </button>
      <SaveMealButton meal={meal} />
    </div>
  )
}