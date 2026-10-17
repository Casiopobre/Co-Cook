import { useMutation } from '@tanstack/react-query'
import { authService } from '../services/authService'
import { useAuth } from './useAuth'

export function useRegister() {
  const { setSession } = useAuth()
  return useMutation({
    mutationFn: ({ username, email, password }) =>
      authService.register({ username, email, password }),
    onSuccess: (data) => setSession(data),
  })
}