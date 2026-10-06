import { forwardRef } from 'react'
import './FormField.css'

export const FormField = forwardRef(function FormField(
  { label, error, id, ...props },
  ref
) {
  return (
    <div className="field">
      <label htmlFor={id} className="field__label">
        {label}
      </label>
      <input
        id={id}
        ref={ref}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`field__input ${error ? 'field__input--error' : ''}`}
        {...props}
      />
      {error && (
        <p id={`${id}-error`} className="field__error">
          {error}
        </p>
      )}
    </div>
  )
})