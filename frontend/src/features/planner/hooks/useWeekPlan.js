import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getWeekDates, toISODate } from '../utils/weekUtils'
import { plannerService } from '../services/plannerService'
import { useGroupId } from '../../auth/hooks/useGroupId'

export function useWeekPlan(referenceDate = new Date()) {
  const groupId = useGroupId()
  const weekDates = useMemo(() => getWeekDates(referenceDate), [referenceDate])
  const from = toISODate(weekDates[0])
  const to = toISODate(weekDates[6])

  const { data: mealPlans = [], isLoading } = useQuery({
    queryKey: ['mealPlans', groupId, from, to],
    queryFn: () => plannerService.getByRange(groupId, from, to),
    enabled: !!groupId,
  })

  // Transforma la lista plana del backend en el objeto { fecha: { mealType: meal } }
  const weekPlan = useMemo(() => {
    const plan = {}
    weekDates.forEach((d) => {
      plan[toISODate(d)] = { BREAKFAST: null, LUNCH: null, SNACK: null, DINNER: null }
    })
    mealPlans.forEach((mp) => {
      if (plan[mp.date]) plan[mp.date][mp.mealType] = mp.meal
    })
    return plan
  }, [mealPlans, weekDates])

  return { weekDates, weekPlan, isLoading }
}