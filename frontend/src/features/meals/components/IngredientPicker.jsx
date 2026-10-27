import { useState } from 'react'
import { FormField } from '../../../components/ui/FormField'
import { Button } from '../../../components/ui/Button'
import { SegmentedControl } from '../../../components/ui/SegmentedControl'
import { useDebounce } from '../../../hooks/useDebounce'
import { FoodSearchPanel } from '../../foods/components/FoodSearchPanel'
import { useMyMeals } from '../hooks/useMyMeals'
import { roundInt } from '../../../utils/macroCalculator'
import './IngredientPicker.css'

const SOURCES = [
  { value: 'mine', label: 'Mis comidas' },
  { value: 'off', label: 'Open Food Facts' },
]

export function IngredientPicker({ excludeIds, onPick, onCancel }) {
  const [source, setSource] = useState('mine') // 'mine' | 'off'
  const [input, setInput] = useState('')
  const query = useDebounce(input)
  const { data: meals = [], isLoading, isError } = useMyMeals(query)

  const available = meals.filter((meal) => !excludeIds.has(meal.id))

  let emptyMessage = null
  if (!isLoading && !isError && available.length === 0) {
    if (meals.length > 0) {
      emptyMessage = 'Ya has añadido todas las comidas que coinciden.'
    } else {
      emptyMessage = (
        <>
          {query.trim()
            ? 'Ninguna de tus comidas coincide. '
            : 'Todavía no tienes comidas que usar como ingrediente. '}
          <button type="button" className="ing-picker__link" onClick={() => setSource('off')}>
            Búscala en Open Food Facts
          </button>
        </>
      )
    }
  }

  return (
    <div className="ing-picker">
      <SegmentedControl
        label="Dónde buscar el ingrediente"
        options={SOURCES}
        value={source}
        onChange={setSource}
      />

      {source === 'off' ? (
        // Al añadir un alimento se crea en Mis comidas y pasa directo a la receta
        <FoodSearchPanel onImported={onPick} />
      ) : (
        <>
          <FormField
            id="ingredient-search"
            label="Buscar en mis comidas"
            placeholder="Ej. arroz"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            // Enter dentro de un formulario lo envía: aquí solo debe buscar
            onKeyDown={(e) => {
              if (e.key === 'Enter') e.preventDefault()
            }}
            autoComplete="off"
            autoFocus
          />

          {isLoading && <p className="ing-picker__status">Buscando...</p>}
          {isError && (
            <p className="ing-picker__status ing-picker__status--error">
              No se pudieron cargar tus comidas.
            </p>
          )}
          {emptyMessage && <p className="ing-picker__status">{emptyMessage}</p>}

          <ul className="ing-picker__list">
            {available.map((meal) => (
              <li key={meal.id}>
                <button type="button" className="ing-picker__item" onClick={() => onPick(meal)}>
                  <span className="ing-picker__name">{meal.name}</span>
                  <span className="ing-picker__kcal">{roundInt(meal.kcalPer100g)} kcal / 100 g</span>
                </button>
              </li>
            ))}
          </ul>
        </>
      )}

      <Button type="button" variant="secondary" onClick={onCancel}>
        Cancelar
      </Button>
    </div>
  )
}