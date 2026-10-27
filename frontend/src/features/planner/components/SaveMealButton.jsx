import { useSavedMeals } from '../../meals/hooks/useSavedMeals'
import './SaveMealButton.css'

function BookmarkIcon({ filled }) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"
         fill={filled ? 'currentColor' : 'none'} stroke="currentColor"
         strokeWidth="1.8" strokeLinejoin="round">
      <path d="M6 4h12v17l-6-4-6 4z" />
    </svg>
  )
}

export function SaveMealButton({ meal }) {
  const { isSaved, toggle, isPending } = useSavedMeals()
  const saved = isSaved(meal.id)
  const label = saved ? 'Quitar de mis comidas' : 'Añadir a mis comidas'

  return (
    <button
      type="button"
      className={`save-meal ${saved ? 'save-meal--on' : ''}`}
      onClick={() => toggle({ mealId: meal.id, saved })}
      disabled={isPending}
      aria-pressed={saved}
      aria-label={label}
      title={label}
    >
      <BookmarkIcon filled={saved} />
    </button>
  )
}