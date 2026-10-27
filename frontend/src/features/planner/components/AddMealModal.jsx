import { useState } from 'react'
import { Modal } from '../../../components/ui/Modal'
import { FormField } from '../../../components/ui/FormField'
import { Button } from '../../../components/ui/Button'
import { useDebounce } from '../../../hooks/useDebounce'
import { useMyMeals } from '../../meals/hooks/useMyMeals'
import { FoodSearchPanel } from '../../foods/components/FoodSearchPanel'
import { useAssignMeal } from '../hooks/useAssignMeal'
import { scaleMacros, roundInt, round1 } from '../../../utils/macroCalculator'
import { MEAL_TYPE_LABELS } from '../utils/weekUtils'
import './AddMealModal.css'

const MAX_GRAMS = 5000

function formatDate(isoDate) {
  const text = new Date(`${isoDate}T00:00:00`).toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
  return text.charAt(0).toUpperCase() + text.slice(1)
}

export function AddMealModal({ date, mealType, onClose }) {
  const [tab, setTab] = useState('mine') // 'mine' | 'off'
  const [input, setInput] = useState('')
  const [selected, setSelected] = useState(null)
  const [grams, setGrams] = useState('100')

  const query = useDebounce(input)
  const { data: meals = [], isLoading, isError } = useMyMeals(query)
  const { mutate, isPending, error } = useAssignMeal()

  const quantity = Number(grams)
  const validQuantity = Number.isInteger(quantity) && quantity > 0 && quantity <= MAX_GRAMS
  const preview = selected && validQuantity ? scaleMacros(selected, quantity) : null

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!selected || !validQuantity) return
    mutate(
      { date, mealType, meal: selected, quantityGrams: quantity },
      { onSuccess: onClose }
    )
  }

  const serverMessage =
    error?.response?.status === 409
      ? 'Ya hay una comida en esta franja.'
      : error && 'No se pudo añadir la comida.'

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={`Añadir ${MEAL_TYPE_LABELS[mealType].toLowerCase()}`}
    >
      <form onSubmit={handleSubmit} className="add-meal">
        <p className="add-meal__date">{formatDate(date)}</p>

        <div className="add-meal__tabs" role="group" aria-label="Dónde buscar">
          <button
            type="button"
            className={`add-meal__tab ${tab === 'mine' ? 'add-meal__tab--active' : ''}`}
            aria-pressed={tab === 'mine'}
            onClick={() => setTab('mine')}
          >
            Mis comidas
          </button>
          <button
            type="button"
            className={`add-meal__tab ${tab === 'off' ? 'add-meal__tab--active' : ''}`}
            aria-pressed={tab === 'off'}
            onClick={() => setTab('off')}
          >
            Open Food Facts
          </button>
        </div>

        {tab === 'off' ? (
          <FoodSearchPanel
            onImported={(meal) => {
              setSelected(meal) // la comida recién creada queda elegida
              setTab('mine')
            }}
          />
        ) : (
          <>
            <FormField
              id="meal-search"
              label="Buscar en mis comidas"
              placeholder="Ej. tortilla"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              autoComplete="off"
              autoFocus
            />

            <div className="add-meal__results">
              {isLoading && <p className="add-meal__status">Buscando...</p>}
              {isError && (
                <p className="add-meal__status add-meal__status--error">
                  No se pudieron cargar las comidas.
                </p>
              )}
              {!isLoading && !isError && meals.length === 0 && (
                <p className="add-meal__status">
                  {query.trim()
                    ? 'Ninguna de tus comidas coincide. '
                    : 'Todavía no tienes comidas. '}
                  <button type="button" className="add-meal__link" onClick={() => setTab('off')}>
                    Búscala en Open Food Facts
                  </button>
                </p>
              )}

              <ul className="add-meal__list">
                {meals.map((meal) => {
                  const isSelected = selected?.id === meal.id
                  return (
                    <li key={meal.id}>
                      <button
                        type="button"
                        className={`add-meal__item ${isSelected ? 'add-meal__item--selected' : ''}`}
                        onClick={() => setSelected(meal)}
                        aria-pressed={isSelected}
                      >
                        <span className="add-meal__item-name">{meal.name}</span>
                        <span className="add-meal__item-kcal">
                          {roundInt(meal.kcalPer100g)} kcal / 100 g
                        </span>
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
          </>
        )}

        {selected && (
          <div className="add-meal__quantity">
            <FormField
              id="meal-grams"
              label={`Cantidad de ${selected.name} (g)`}
              type="number"
              min="1"
              max={MAX_GRAMS}
              inputMode="numeric"
              value={grams}
              onChange={(e) => setGrams(e.target.value)}
              error={!validQuantity ? `Indica un número entero entre 1 y ${MAX_GRAMS}` : undefined}
            />

            {preview && (
              <p className="add-meal__preview">
                {roundInt(preview.kcal)} kcal · C {round1(preview.carbs)} g · P{' '}
                {round1(preview.proteins)} g · G {round1(preview.fats)} g
              </p>
            )}
          </div>
        )}

        {serverMessage && <p role="alert" className="alert alert--error">{serverMessage}</p>}

        <Button type="submit" block disabled={!selected || !validQuantity || isPending}>
          {isPending ? 'Añadiendo...' : 'Añadir al calendario'}
        </Button>
      </form>
    </Modal>
  )
}