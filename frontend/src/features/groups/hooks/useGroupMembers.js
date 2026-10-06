import { useQuery } from '@tanstack/react-query'
import { groupService } from '../services/groupService'

export function useGroupMembers(groupId) {
  return useQuery({
    queryKey: ['groupMembers', groupId],
    queryFn: () => groupService.getMembers(groupId),
    enabled: !!groupId,
  })
}