import { useMutation, useQueryClient } from '@tanstack/react-query'
import { plannerService } from '../services/plannerService'
import { useGroupId } from '../../auth/hooks/useGroupId'

export function useAssignMeal() {
  const queryClient = useQueryClient()
  const groupId = useGroupId()

  return useMutation({
    mutationFn: (data) => plannerService.assign(groupId, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['mealPlans'] }),
  })
}