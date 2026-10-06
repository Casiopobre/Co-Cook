import { useAuth } from './useAuth'

// Básicamente é solo para non repetir o mesmo código de user?.group?.id en todos os sitios onde necesitamos o id do grupo do usuario
export function useGroupId() {
  const { user } = useAuth()
  return user?.group?.id ?? null
}