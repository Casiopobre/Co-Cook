import { useMemo } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { mealService } from '../services/mealService'
import { useAuth } from '../../auth/hooks/useAuth'
import { useMyMeals } from './useMyMeals'

export function useSavedMeals() {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const { data: myMeals = [] } = useMyMeals()

  const savedIds = useMemo(() => new Set(myMeals.map((m) => m.id)), [myMeals])

  const mutation = useMutation({
    mutationFn: ({ mealId, saved }) =>
      saved ? mealService.unsave(user.id, mealId) : mealService.save(user.id, mealId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['meals', 'mine'] }),
  })

  return {
    isSaved: (mealId) => savedIds.has(mealId),
    toggle: mutation.mutate,
    isPending: mutation.isPending,
  }
}