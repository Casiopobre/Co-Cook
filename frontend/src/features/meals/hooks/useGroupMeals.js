import { useQuery } from '@tanstack/react-query'
import { mealService } from '../services/mealService'
import { useGroupId } from '../../auth/hooks/useGroupId'

export function useGroupMeals() {
  const groupId = useGroupId()
  return useQuery({
    // el groupId en la clave evita mezclar cachés si el usuario cambia de grupo
    queryKey: ['meals', 'group', groupId],
    queryFn: mealService.getByGroup,
    enabled: !!groupId,
  })
}