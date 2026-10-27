import { useQuery } from '@tanstack/react-query'
import { mealService } from '../../meals/services/mealService'

export const MIN_FOOD_QUERY = 3

export function useFoodSearch(query) {
  const q = query.trim().toLowerCase()
  return useQuery({
    // no empieza por 'meals': crear o guardar una comida no obliga a recargar el catálogo
    queryKey: ['catalog', q],
    queryFn: ({ signal }) => mealService.searchCatalog(q, 20, signal),
    enabled: q.length >= MIN_FOOD_QUERY,
    staleTime: 1000 * 60 * 5,
  })
}