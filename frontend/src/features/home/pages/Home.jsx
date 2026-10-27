import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { WeekCalendar } from '../../planner/components/WeekCalendar'
import { DayMacrosSummary } from '../../planner/components/DayMacrosSummary'
import { AddMealModal } from '../../planner/components/AddMealModal'
import { useWeekPlan } from '../../planner/hooks/useWeekPlan'
import { plannerService } from '../../planner/services/plannerService'
import { toISODate } from '../../planner/utils/weekUtils'
import { useGroupId } from '../../auth/hooks/useGroupId'
import GroupMembers from '../../groups/components/GroupMembers'
import './Home.css'


export default function Home() {
  const [selectedDate, setSelectedDate] = useState(() => toISODate(new Date()))
  const [slotToFill, setSlotToFill] = useState(null) // null | { date, mealType }

  const { weekDates, weekPlan, isLoading } = useWeekPlan()
  const groupId = useGroupId()
  const queryClient = useQueryClient()

  const handleAddMeal = (date, mealType) => setSlotToFill({ date, mealType })

  const handleRemoveMeal = async (date, mealType) => {
    await plannerService.remove(groupId, date, mealType)
    queryClient.invalidateQueries({ queryKey: ['mealPlans'] })
  }

  if (isLoading) return <p>Cargando planificador...</p>

  return (
    <div>
      <WeekCalendar
        weekDates={weekDates}
        weekPlan={weekPlan}
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
        onAddMeal={handleAddMeal}
        onRemoveMeal={handleRemoveMeal}
      />

      <div className="home__bottom">
        <DayMacrosSummary selectedDate={selectedDate} dayPlan={weekPlan[selectedDate]} />
        <GroupMembers />
      </div>

      {slotToFill && (
        <AddMealModal
          date={slotToFill.date}
          mealType={slotToFill.mealType}
          onClose={() => setSlotToFill(null)}
        />
      )}
    </div>
  )
}