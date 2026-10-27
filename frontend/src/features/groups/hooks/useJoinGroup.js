import { useMutation, useQueryClient } from '@tanstack/react-query'
import { groupService } from '../services/groupService'
import { useAuth } from '../../auth/hooks/useAuth'

export function useJoinGroup() {
  const queryClient = useQueryClient()
  const { user, token, setSession } = useAuth()

  return useMutation({
    mutationFn: (data) => groupService.join(user.id, data),
    onSuccess: (newGroup) => {
      // Al cambiar user.group.id, el planificador y los miembros (que llevan el groupId
      // en su clave) se recargan solos. Mis comidas no depende del grupo
      setSession({ token, user: { ...user, group: newGroup } })
      queryClient.invalidateQueries({ queryKey: ['groupMembers'] })
      queryClient.invalidateQueries({ queryKey: ['inviteCode'] })
    },
  })
}