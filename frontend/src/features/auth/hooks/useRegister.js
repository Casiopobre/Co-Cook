import { useMutation } from '@tanstack/react-query'
import { authService } from '../services/authService'
import { useAuth } from './useAuth'

export function useRegister() {
  const { setSession } = useAuth()
  return useMutation({
    mutationFn: ({ name, email, password }) =>
      authService.register({ name, email, password }),
    onSuccess: (data) => setSession(data),
  })
}