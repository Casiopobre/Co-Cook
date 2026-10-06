import { useMutation, useQueryClient } from '@tanstack/react-query'
import { groupService } from '../services/groupService'
import { useAuth } from '../../auth/hooks/useAuth'

export function useJoinGroup() {
  const queryClient = useQueryClient()
  const { user, setSession } = useAuth()
  const token = localStorage.getItem('token')

  return useMutation({
    mutationFn: groupService.join,
    onSuccess: (newGroup) => {
      // Actualiza el usuario en memoria con su nuevo grupo, sin esperar a /auth/me
      const updatedUser = { ...user, group: newGroup }
      setSession({ token, user: updatedUser })
      queryClient.invalidateQueries({ queryKey: ['groupMembers'] })
      queryClient.invalidateQueries({ queryKey: ['inviteCode'] })
    },
  })
}