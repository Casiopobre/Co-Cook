import { useState } from 'react'
import { WeekCalendar } from '../../planner/components/WeekCalendar'
import { DayMacrosSummary } from '../../planner/components/DayMacrosSummary'
import { useWeekPlan } from '../../planner/hooks/useWeekPlan'
import { toISODate } from '../../planner/utils/weekUtils'
import { plannerService } from '../../planner/services/plannerService'
import { useGroupId } from '../../auth/hooks/useGroupId'
import { useQueryClient } from '@tanstack/react-query'
import GroupMembers from '../../groups/components/GroupMembers'

function Home() {
  const [selectedDate, setSelectedDate] = useState(() => toISODate(new Date()))

  const { weekDates, weekPlan, isLoading } = useWeekPlan()
  const groupId = useGroupId()
  const queryClient = useQueryClient()

  const handleAddMeal = async (date, mealType) => {
    // pendiente: abrir selector de comidas real
  }

  const handleRemoveMeal = async (date, mealType) => {
    await plannerService.remove(groupId, date, mealType)
    queryClient.invalidateQueries({ queryKey: ['mealPlans'] })
  }

  if (isLoading) return <p>Cargando planificador...</p>

  return (
    <>
      <h1 style={{ marginBottom: '1.5rem' }}>Bienvenido a Co-Cook</h1>

      <GroupMembers />

      <h2 style={{ marginBottom: '1rem' }}>Planificación Semanal</h2>
      <WeekCalendar
        weekDates={weekDates}
        weekPlan={weekPlan}
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
        onAddMeal={handleAddMeal}
        onRemoveMeal={handleRemoveMeal}
      />

      <DayMacrosSummary
        selectedDate={selectedDate}
        dayPlan={weekPlan[selectedDate]}
      />
    </>
  )
}
export default Home;