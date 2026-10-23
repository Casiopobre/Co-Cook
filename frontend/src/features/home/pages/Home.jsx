import { useState } from 'react'
import { WeekCalendar } from '../../planner/components/WeekCalendar'
import { DayMacrosSummary } from '../../planner/components/DayMacrosSummary'
import { useWeekPlan } from '../../planner/hooks/useWeekPlan'
import { toISODate } from '../../planner/utils/weekUtils'
import { plannerService } from '../../planner/services/plannerService'
import { useGroupId } from '../../auth/hooks/useGroupId'
import { useQueryClient } from '@tanstack/react-query'
import GroupMembers from '../../groups/components/GroupMembers'
import { MOCK_MEALS } from '../../meals/mocks/mockMeals'

function Home() {
  const [selectedDate, setSelectedDate] = useState(() => toISODate(new Date()))

  const { weekDates, weekPlan, isLoading } = useWeekPlan()
  const groupId = useGroupId()
  const queryClient = useQueryClient()

  const handleAddMeal = async (date, mealType) => {
    // PROVISIONAL: hasta tener el selector real, pone una comida mock cualquiera
    const meal = MOCK_MEALS[Math.floor(Math.random() * MOCK_MEALS.length)]

    await plannerService.assign(groupId, {
      date,
      mealType,
      meal,
      quantityGrams: 100,
    })
    queryClient.invalidateQueries({ queryKey: ['mealPlans'] })
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

      <h2 style={{ marginTop: '1rem', marginBottom: '1rem' }}>Planificación Semanal</h2>
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