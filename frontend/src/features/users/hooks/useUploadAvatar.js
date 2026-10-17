import { useMutation, useQueryClient } from '@tanstack/react-query'
import { userService } from '../services/userService'
import { useAuth } from '../../auth/hooks/useAuth'

export function useUploadAvatar() {
  const queryClient = useQueryClient()
  const { user, token, setSession } = useAuth()

  return useMutation({
    mutationFn: userService.uploadAvatar,
    onSuccess: (updatedUser) => {
      // Actualiza el usuario del contexto (y localStorage) con la nueva foto
      setSession({ token, user: { ...user, ...updatedUser } })
      queryClient.invalidateQueries({ queryKey: ['groupMembers'] })
    },
  })
}