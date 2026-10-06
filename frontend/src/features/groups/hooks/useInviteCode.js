import { useQuery } from '@tanstack/react-query'
import { groupService } from '../services/groupService'

export function useInviteCode(groupId) {
  return useQuery({
    queryKey: ['inviteCode', groupId],
    queryFn: () => groupService.getInviteCode(groupId),
    enabled: !!groupId,
    staleTime: Infinity, // el código no cambia solo; no hace falta refrescarlo
  })
}