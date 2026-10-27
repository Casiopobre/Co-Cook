import { z } from 'zod'

// Se aceptan comas decimales ("12,5"), por eso los campos son texto y se convierten al enviar
export const toNumber = (v) => Number(String(v).trim().replace(',', '.'))

const macro = (max) =>
  z
    .string()
    .trim()
    .min(1, 'Obligatorio')
    .refine((v) => {
      const n = toNumber(v)
      return Number.isFinite(n) && n >= 0 && n <= max
    }, `Un número entre 0 y ${max}`)

export const createMealSchema = z
  .object({
    name: z.string().trim().min(2, 'Mínimo 2 caracteres').max(150, 'Máximo 150 caracteres'),
    kcalPer100g: macro(900),
    carbsPer100g: macro(100),
    proteinsPer100g: macro(100),
    fatsPer100g: macro(100),
  })
  .refine(
    (d) =>
      toNumber(d.carbsPer100g) + toNumber(d.proteinsPer100g) + toNumber(d.fatsPer100g) <= 100,
    { message: 'Entre los tres no pueden pasar de 100 g', path: ['fatsPer100g'] }
  )