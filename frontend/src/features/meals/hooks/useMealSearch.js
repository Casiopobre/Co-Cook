import { useQuery } from '@tanstack/react-query'
import { mealService } from '../services/mealService'
import { useGroupId } from '../../auth/hooks/useGroupId'

export function useMealSearch(query) {
  const groupId = useGroupId()
  return useQuery({
    queryKey: ['meals', 'search', groupId, query],
    queryFn: () => mealService.search(query),
    enabled: !!groupId,
    staleTime: 1000 * 60,
  })
}