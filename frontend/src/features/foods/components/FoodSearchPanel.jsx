import { useState } from 'react'
import { FormField } from '../../../components/ui/FormField'
import { Button } from '../../../components/ui/Button'
import { useDebounce } from '../../../hooks/useDebounce'
import { useSavedMeals } from '../../meals/hooks/useSavedMeals'
import { useFoodSearch, MIN_FOOD_QUERY } from '../hooks/useFoodSearch'
import { roundInt, round1 } from '../../../utils/macroCalculator'
import './FoodSearchPanel.css'

// onImported(meal): se llama con la comida, ya guardada en tu colección
export function FoodSearchPanel({ onImported }) {
  const [input, setInput] = useState('')
  const [addedIds, setAddedIds] = useState(() => new Set())
  const [addError, setAddError] = useState(null)

  const query = useDebounce(input, 400)
  const active = query.trim().length >= MIN_FOOD_QUERY
  const { data: meals = [], isLoading, isError, refetch } = useFoodSearch(query)
  const { isSaved, toggle, isPending } = useSavedMeals()

  const handleAdd = (meal) => {
    setAddError(null)
    toggle(
      { mealId: meal.id, saved: false },
      {
        onSuccess: () => {
          setAddedIds((prev) => new Set(prev).add(meal.id))
          onImported?.(meal)
        },
        onError: () => setAddError('No se pudo añadir la comida.'),
      }
    )
  }

  return (
    <div className="food-search">
      <FormField
        id="food-search"
        label="Buscar en el catálogo"
        placeholder="Ej. leche entera, atún..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        // Enter dentro de un formulario lo envía: aquí solo debe buscar
        onKeyDown={(e) => {
          if (e.key === 'Enter') e.preventDefault()
        }}
        autoComplete="off"
      />

      {!active && (
        <p className="food-search__status">Escribe al menos {MIN_FOOD_QUERY} letras para buscar.</p>
      )}
      {active && isLoading && <p className="food-search__status">Buscando...</p>}
      {active && isError && (
        <div role="alert" className="food-search__status food-search__status--error">
          <p>No se pudo buscar. Inténtalo de nuevo.</p>
          <button type="button" className="food-search__retry" onClick={() => refetch()}>
            Reintentar
          </button>
        </div>
      )}
      {active && !isLoading && !isError && meals.length === 0 && (
        <p className="food-search__status">No hay resultados. Prueba con otro nombre.</p>
      )}
      {addError && <p role="alert" className="alert alert--error">{addError}</p>}

      {active && meals.length > 0 && (
        <ul className="food-search__list">
          {meals.map((meal) => {
            const done = isSaved(meal.id) || addedIds.has(meal.id)
            return (
              <li key={meal.id} className="food-search__item">
                <div className="food-search__info">
                  <span className="food-search__name">{meal.name}</span>
                  <span className="food-search__macros">
                    {roundInt(meal.kcalPer100g)} kcal · C {round1(meal.carbsPer100g)} g · P{' '}
                    {round1(meal.proteinsPer100g)} g · G {round1(meal.fatsPer100g)} g por 100 g
                  </span>
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => handleAdd(meal)}
                  disabled={done || isPending}
                >
                  {done ? 'Añadida ✓' : 'Añadir'}
                </Button>
              </li>
            )
          })}
        </ul>
      )}

      <p className="food-search__credit">
        Productos de España de{' '}
        <a href="https://world.openfoodfacts.org" target="_blank" rel="noreferrer" className="link">
          Open Food Facts
        </a>{' '}
        (licencia ODbL). Los aportan sus colaboradores y pueden contener errores o estar desactualizados.
      </p>
    </div>
  )
}