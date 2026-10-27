import { useState } from 'react'
import { ValuesMealForm } from './ValuesMealForm'
import { IngredientsMealForm } from './IngredientsMealForm'
import './CreateMealForm.css'

export function CreateMealForm({ onSuccess }) {
  const [mode, setMode] = useState('values') // 'values' | 'ingredients'

  return (
    <div className="create-meal">
      <div className="create-meal__modes" role="group" aria-label="Cómo crear la comida">
        <button
          type="button"
          className={`create-meal__mode ${mode === 'values' ? 'create-meal__mode--active' : ''}`}
          aria-pressed={mode === 'values'}
          onClick={() => setMode('values')}
        >
          Valores por 100 g
        </button>
        <button
          type="button"
          className={`create-meal__mode ${mode === 'ingredients' ? 'create-meal__mode--active' : ''}`}
          aria-pressed={mode === 'ingredients'}
          onClick={() => setMode('ingredients')}
        >
          Con ingredientes
        </button>
      </div>

      {mode === 'values' ? (
        <ValuesMealForm onSuccess={onSuccess} />
      ) : (
        <IngredientsMealForm onSuccess={onSuccess} />
      )}
    </div>
  )
}