import axiosClient from '../../../api/axiosClient'
import { ENDPOINTS } from '../../../api/endpoints'
import { MOCK_MEAL_PLANS } from '../mocks/mockMealPlans'

const MOCK_PLANNER = import.meta.env.VITE_MOCK_PLANNER === 'true'

const fakeDelay = (data, ms = 300) =>
  new Promise((resolve) => setTimeout(() => resolve(data), ms))

// Simula persistencia en memoria durante la sesión del navegador,
// para que añadir/quitar comidas se refleje mientras desarrollas
let mockState = [...MOCK_MEAL_PLANS]
let nextMockId = 1000

export const plannerService = {
  getByRange: (groupId, from, to) => {
    if (MOCK_PLANNER) {
      const filtered = mockState.filter((mp) => mp.date >= from && mp.date <= to)
      return fakeDelay(filtered)
    }
    return axiosClient.get(ENDPOINTS.mealPlans.byGroupAndRange(groupId, from, to))
  },

  assign: (groupId, { date, mealType, mealId, meal }) => {
    if (MOCK_PLANNER) {
      mockState = mockState.filter((mp) => !(mp.date === date && mp.mealType === mealType))
      const newEntry = { id: nextMockId++, date, mealType, meal }
      mockState.push(newEntry)
      return fakeDelay(newEntry)
    }
    return axiosClient.post(ENDPOINTS.mealPlans.create(groupId), { date, mealType, mealId })
  },

  remove: (groupId, date, mealType) => {
    if (MOCK_PLANNER) {
      const entry = mockState.find((mp) => mp.date === date && mp.mealType === mealType)
      mockState = mockState.filter((mp) => !(mp.date === date && mp.mealType === mealType))
      return fakeDelay(entry ?? null)
    }
    return axiosClient.delete(ENDPOINTS.mealPlans.delete(groupId, mealTypeToId(date, mealType)))
  },
}