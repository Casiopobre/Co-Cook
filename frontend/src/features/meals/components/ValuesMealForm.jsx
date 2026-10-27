import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormField } from '../../../components/ui/FormField'
import { Button } from '../../../components/ui/Button'
import { createMealSchema, toNumber } from '../schemas'
import { useCreateMeal } from '../hooks/useCreateMeal'
import './CreateMealForm.css'

export function ValuesMealForm({ onSuccess }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(createMealSchema) })

  const { mutate, isPending, error } = useCreateMeal()

  const onSubmit = (data) =>
    mutate(
      {
        name: data.name.trim(),
        kcalPer100g: toNumber(data.kcalPer100g),
        carbsPer100g: toNumber(data.carbsPer100g),
        proteinsPer100g: toNumber(data.proteinsPer100g),
        fatsPer100g: toNumber(data.fatsPer100g),
      },
      { onSuccess }
    )

  const serverMessage =
    error?.response?.status === 409
      ? 'Ya tienes una comida con ese nombre.'
      : error?.response?.data?.message || (error && 'No se pudo crear la comida.')

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="meal-form" noValidate>
      <FormField
        id="meal-name"
        label="Nombre"
        placeholder="Ej. Tortilla de patata"
        error={errors.name?.message}
        {...register('name')}
      />

      <p className="meal-form__hint">Valores nutricionales por cada 100 g:</p>

      <div className="meal-form__grid">
        <FormField
          id="meal-kcal"
          label="Calorías (kcal)"
          inputMode="decimal"
          error={errors.kcalPer100g?.message}
          {...register('kcalPer100g')}
        />
        <FormField
          id="meal-carbs"
          label="Carbohidratos (g)"
          inputMode="decimal"
          error={errors.carbsPer100g?.message}
          {...register('carbsPer100g')}
        />
        <FormField
          id="meal-proteins"
          label="Proteínas (g)"
          inputMode="decimal"
          error={errors.proteinsPer100g?.message}
          {...register('proteinsPer100g')}
        />
        <FormField
          id="meal-fats"
          label="Grasas (g)"
          inputMode="decimal"
          error={errors.fatsPer100g?.message}
          {...register('fatsPer100g')}
        />
      </div>

      {serverMessage && <p role="alert" className="alert alert--error">{serverMessage}</p>}

      <Button type="submit" block disabled={isPending}>
        {isPending ? 'Guardando...' : 'Crear comida'}
      </Button>
    </form>
  )
}