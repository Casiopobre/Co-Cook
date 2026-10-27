import { useMemo, useState } from 'react'
import { FormField } from '../../../components/ui/FormField'
import { Button } from '../../../components/ui/Button'
import { IngredientPicker } from './IngredientPicker'
import { useCreateMeal } from '../hooks/useCreateMeal'
import { scaleMacros, sumMacros, roundInt, round1 } from '../../../utils/macroCalculator'
import './IngredientsMealForm.css'

const MAX_GRAMS = 5000
const DEFAULT_GRAMS = '100'

const isValidGrams = (value) => {
    const n = Number(value)
    return Number.isInteger(n) && n > 0 && n <= MAX_GRAMS
}

// Con los ingredientes de gramos válidos, calcula lo que va a guardar el backend
function computeResult(items) {
    const valid = items.filter((item) => isValidGrams(item.grams))
    if (valid.length === 0) return null

    const totals = sumMacros(valid.map((item) => scaleMacros(item.meal, Number(item.grams))))
    const totalGrams = valid.reduce((sum, item) => sum + Number(item.grams), 0)
    const per100 = 100 / totalGrams

    return {
        totalGrams,
        totalKcal: totals.kcal,
        per100: {
            kcal: totals.kcal * per100,
            carbs: totals.carbs * per100,
            proteins: totals.proteins * per100,
            fats: totals.fats * per100,
        },
    }
}

export function IngredientsMealForm({ onSuccess }) {
    const [name, setName] = useState('')
    const [items, setItems] = useState([]) // [{ meal, grams }]
    const [picking, setPicking] = useState(false)
    const [submitted, setSubmitted] = useState(false)

    const { mutate, isPending, error } = useCreateMeal()

    const excludeIds = useMemo(() => new Set(items.map((item) => item.meal.id)), [items])
    const result = useMemo(() => computeResult(items), [items])

    const trimmedName = name.trim()
    const nameError =
        trimmedName.length < 2 ? 'Mínimo 2 caracteres' : trimmedName.length > 150 ? 'Máximo 150 caracteres' : null
    const itemsError = items.length === 0 ? 'Añade al menos un ingrediente' : null
    const hasInvalidGrams = items.some((item) => !isValidGrams(item.grams))

    const addItem = (meal) => {
        setItems((prev) =>
            prev.some((item) => item.meal.id === meal.id)
                ? prev
                : [...prev, { meal, grams: DEFAULT_GRAMS }]
        )
        setPicking(false)
    }

    const updateGrams = (mealId, grams) =>
        setItems((prev) => prev.map((item) => (item.meal.id === mealId ? { ...item, grams } : item)))

    const removeItem = (mealId) =>
        setItems((prev) => prev.filter((item) => item.meal.id !== mealId))

    const handleSubmit = (e) => {
        e.preventDefault()
        setSubmitted(true)
        if (nameError || itemsError || hasInvalidGrams) return

        mutate(
            {
                name: trimmedName,
                ingredients: items.map((item) => ({
                    ingredientId: item.meal.id,
                    quantityGrams: Number(item.grams),
                })),
            },
            { onSuccess }
        )
    }

    const serverMessage =
        error?.response?.status === 409
            ? 'Ya tienes una comida con ese nombre.'
            : error?.response?.data?.message || (error && 'No se pudo crear la comida.')

    return (
        <form onSubmit={handleSubmit} className="ing-form" noValidate>
            <FormField
                id="composite-meal-name"
                label="Nombre"
                placeholder="Ej. Pollo con arroz"
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={submitted ? nameError : undefined}
            />

            <ul className="ing-list">
                {items.map(({ meal, grams }) => {
                    const valid = isValidGrams(grams)
                    const kcal = valid ? roundInt(scaleMacros(meal, Number(grams)).kcal) : null

                    return (
                        <li key={meal.id} className="ing-row">
                            <span className="ing-row__name">{meal.name}</span>

                            <div className="ing-row__qty">
                                <input
                                    type="number"
                                    min="1"
                                    max={MAX_GRAMS}
                                    inputMode="numeric"
                                    className={`field__input ing-row__grams ${valid ? '' : 'field__input--error'}`}
                                    value={grams}
                                    onChange={(e) => updateGrams(meal.id, e.target.value)}
                                    aria-label={`Gramos de ${meal.name}`}
                                    aria-invalid={!valid}
                                />
                                <span>g</span>
                            </div>

                            <span className="ing-row__kcal">{kcal !== null ? `${kcal} kcal` : '—'}</span>

                            <button
                                type="button"
                                className="ing-row__remove"
                                onClick={() => removeItem(meal.id)}
                                aria-label={`Quitar ${meal.name}`}
                            >
                                ×
                            </button>
                        </li>
                    )
                })}
            </ul>

            {hasInvalidGrams && (
                <p className="field__error">Los gramos deben ser un número entero entre 1 y {MAX_GRAMS}.</p>
            )}

            {picking ? (
                <IngredientPicker
                    excludeIds={excludeIds}
                    onPick={addItem}
                    onCancel={() => setPicking(false)}
                />
            ) : (
                <button type="button" className="ing-form__add" onClick={() => setPicking(true)}>
                    <span className="ing-form__add-circle" aria-hidden="true">+</span>
                    {items.length === 0 ? 'Añadir ingrediente' : 'Añadir otro ingrediente'}
                </button>
            )}

            {submitted && itemsError && <p className="field__error">{itemsError}</p>}

            {result && (
                <div className="ing-result">
                    <p className="ing-result__total">
                        Plato completo: {roundInt(result.totalKcal)} kcal · {result.totalGrams} g
                    </p>
                    <p className="ing-result__per100">
                        Por 100 g: {roundInt(result.per100.kcal)} kcal · C {round1(result.per100.carbs)} g · P{' '}
                        {round1(result.per100.proteins)} g · G {round1(result.per100.fats)} g
                    </p>
                    <p className="ing-result__hint">Así se guardará la comida.</p>
                </div>
            )}

            {serverMessage && <p role="alert" className="alert alert--error">{serverMessage}</p>}

            <Button type="submit" block disabled={isPending}>
                {isPending ? 'Guardando...' : 'Crear comida'}
            </Button>
        </form>
    )
}