import { useMutation, useQueryClient } from '@tanstack/react-query'
import { mealService } from '../services/mealService'

export function useCreateMeal() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: mealService.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['meals'] }),
  })
}