import { useState } from 'react'
import { Modal } from '../../../components/ui/Modal'
import { Button } from '../../../components/ui/Button'
import { FormField } from '../../../components/ui/FormField'
import { useDebounce } from '../../../hooks/useDebounce'
import { FoodSearchPanel } from '../../foods/components/FoodSearchPanel'
import { CreateMealForm } from '../components/CreateMealForm'
import { useMyMeals } from '../hooks/useMyMeals'
import { useSavedMeals } from '../hooks/useSavedMeals'
import { roundInt, round1 } from '../../../utils/macroCalculator'
import './MyMealsPage.css'

export default function MyMealsPage() {
  const [input, setInput] = useState('')
  const [modal, setModal] = useState(null) // null | 'create' | 'search'
  const closeModal = () => setModal(null)

  const query = useDebounce(input)
  const { data: meals = [], isLoading, isError } = useMyMeals(query)
  const { toggle, isPending } = useSavedMeals()

  const searching = query.trim() !== ''

  return (
    <section className="my-meals" aria-labelledby="my-meals-title">
      <header className="my-meals__header">
        <h1 id="my-meals-title" className="my-meals__title">Mis comidas</h1>
        <div className="my-meals__actions">
          <Button variant="secondary" onClick={() => setModal('search')}>
            Buscar en Open Food Facts
          </Button>
          <Button onClick={() => setModal('create')}>Nueva comida</Button>
        </div>
      </header>

      <div className="my-meals__search">
        <FormField
          id="my-meals-search"
          label="Buscar en mis comidas"
          placeholder="Ej. tortilla"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          autoComplete="off"
        />
      </div>

      {isLoading && <p className="my-meals__status">Cargando tus comidas...</p>}
      {isError && (
        <p role="alert" className="my-meals__status my-meals__status--error">
          No se pudieron cargar tus comidas.
        </p>
      )}

      {!isLoading && !isError && meals.length === 0 && (
        <p className="my-meals__status">
          {searching
            ? 'Ninguna de tus comidas coincide con la búsqueda.'
            : 'Todavía no tienes comidas. Crea una o búscala en Open Food Facts.'}
        </p>
      )}

      {meals.length > 0 && (
        <ul className="my-meals__list">
          {meals.map((meal) => (
            <li key={meal.id} className="my-meals__item">
              <div className="my-meals__info">
                <span className="my-meals__name">{meal.name}</span>
                <span className="my-meals__macros">
                  {roundInt(meal.kcalPer100g)} kcal · C {round1(meal.carbsPer100g)} g · P{' '}
                  {round1(meal.proteinsPer100g)} g · G {round1(meal.fatsPer100g)} g por 100 g
                </span>
              </div>
              <button
                type="button"
                className="my-meals__remove"
                onClick={() => toggle({ mealId: meal.id, saved: true })}
                disabled={isPending}
                aria-label={`Quitar ${meal.name} de mis comidas`}
              >
                Quitar
              </button>
            </li>
          ))}
        </ul>
      )}

      <Modal isOpen={modal === 'create'} onClose={closeModal} title="Nueva comida">
        <CreateMealForm onSuccess={closeModal} />
      </Modal>

      <Modal isOpen={modal === 'search'} onClose={closeModal} title="Añadir desde Open Food Facts">
        <FoodSearchPanel />
      </Modal>
    </section>
  )
}