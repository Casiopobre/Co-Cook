import './MealSlot.css'

export function MealSlot({ meal, onAdd, onRemove }) {
  if (!meal) {
    return (
      <button type="button" className="meal-slot meal-slot--empty" onClick={onAdd}>
        <span className="meal-slot__plus">+</span>
      </button>
    )
  }

  return (
    <div className="meal-slot meal-slot--filled">
      <p className="meal-slot__name">{meal.name}</p>
      <p className="meal-slot__macros">{meal.kcalPerServing} kcal</p>
      <button
        type="button"
        className="meal-slot__remove"
        onClick={onRemove}
        aria-label="Quitar comida"
      >
        ×
      </button>
    </div>
  )
}