import { useQuery } from '@tanstack/react-query'
import { mealService } from '../services/mealService'
import { useAuth } from '../../auth/hooks/useAuth'

export function useMyMeals(q = '') {
  const { user } = useAuth()
  return useQuery({
    // empieza por 'meals': crear una comida o guardar otra la refresca
    queryKey: ['meals', 'mine', user?.id, q],
    queryFn: () => mealService.getMine(user.id, q),
    enabled: !!user?.id,
  })
}