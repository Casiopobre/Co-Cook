import { useMutation } from '@tanstack/react-query'
import { groupService } from '../services/groupService'
import { useAuth } from '../../auth/hooks/useAuth'

export function useLeaveGroup() {
  const { user, token, setSession } = useAuth()

  return useMutation({
    mutationFn: () => groupService.leave(user.id),
    onSuccess: (newGroup) => setSession({ token, user: { ...user, group: newGroup } }),
  })
}