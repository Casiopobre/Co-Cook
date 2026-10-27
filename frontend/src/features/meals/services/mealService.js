import axiosClient from '../../../api/axiosClient'
import { ENDPOINTS } from '../../../api/endpoints'
import { MOCK_MEALS } from '../mocks/mockMeals'

const MOCK = import.meta.env.VITE_MOCK_MEALS === 'true'

const fakeDelay = (data, ms = 300) =>
  new Promise((resolve) => setTimeout(() => resolve(data), ms))

// Simula los errores de Axios para probar los mensajes de los formularios
const fakeError = (status, message) =>
  Promise.reject({ response: { status, data: { message } } })

// Productos de catálogo de prueba: existen para todos, pero no están en tu colección
const MOCK_CATALOG = [
  { id: 2001, name: 'Leche entera (Hacendado)', kcalPer100g: 63, carbsPer100g: 4.7, proteinsPer100g: 3.1, fatsPer100g: 3.6 },
  { id: 2002, name: 'Leche semidesnatada (Pascual)', kcalPer100g: 46, carbsPer100g: 4.8, proteinsPer100g: 3.2, fatsPer100g: 1.6 },
  { id: 2003, name: 'Atún claro en aceite (Calvo)', kcalPer100g: 198, carbsPer100g: 0, proteinsPer100g: 26, fatsPer100g: 10 },
  { id: 2004, name: 'Pan integral', kcalPer100g: 247, carbsPer100g: 41, proteinsPer100g: 13, fatsPer100g: 3.4 },
  { id: 2005, name: 'Yogur natural (Danone)', kcalPer100g: 61, carbsPer100g: 4.7, proteinsPer100g: 3.5, fatsPer100g: 3.3 },
].map((m) => ({ ...m, fromCatalog: true }))

// Persistencia en memoria mientras dure la pestaña
let mockState = [...MOCK_MEALS, ...MOCK_CATALOG]
let mockSavedIds = new Set(MOCK_MEALS.slice(0, 3).map((m) => m.id)) // "mis comidas"
let nextMockId = 1000

const round1 = (n) => Math.round(n * 10) / 10

// Calcula los valores por 100 g de un plato a partir de sus ingredientes,
// igual que hace el backend. Los ingredientes deben estar en tu colección
function buildFromIngredients(ingredients) {
  let kcal = 0, carbs = 0, proteins = 0, fats = 0, totalGrams = 0

  for (const item of ingredients) {
    const found = mockState.find((m) => m.id === item.ingredientId)
    if (!found || !mockSavedIds.has(found.id)) return null

    const factor = item.quantityGrams / 100
    kcal += found.kcalPer100g * factor
    carbs += found.carbsPer100g * factor
    proteins += found.proteinsPer100g * factor
    fats += found.fatsPer100g * factor
    totalGrams += item.quantityGrams
  }

  const per100 = 100 / totalGrams
  return {
    kcalPer100g: round1(kcal * per100),
    carbsPer100g: round1(carbs * per100),
    proteinsPer100g: round1(proteins * per100),
    fatsPer100g: round1(fats * per100),
  }
}

export const mealService = {
  // Mi colección, filtrada por nombre
  getMine: (userId, q = '', limit = 50) => {
    if (MOCK) {
      const term = q.trim().toLowerCase()
      return fakeDelay(
        mockState
          .filter((m) => mockSavedIds.has(m.id) && m.name.toLowerCase().includes(term))
          .slice(0, limit)
      )
    }
    return axiosClient.get(ENDPOINTS.users.meals(userId), { params: { q, limit } })
  },

  // Catálogo público importado de Open Food Facts
  searchCatalog: (q, limit = 20, signal) => {
    if (MOCK) {
      const term = q.trim().toLowerCase()
      return fakeDelay(
        mockState.filter((m) => m.fromCatalog && m.name.toLowerCase().includes(term)).slice(0, limit),
        400
      )
    }
    return axiosClient.get(ENDPOINTS.meals.list, { params: { q, limit }, signal })
  },

  getById: (id) => {
    if (MOCK) {
      const meal = mockState.find((m) => m.id === id)
      return meal ? fakeDelay(meal) : fakeError(404, 'Comida no encontrada')
    }
    return axiosClient.get(ENDPOINTS.meals.byId(id))
  },

  // Cuerpo: { name, kcalPer100g, carbsPer100g, proteinsPer100g, fatsPer100g }
  //     o: { name, ingredients: [{ ingredientId, quantityGrams }] }
  // El backend la crea y la guarda automáticamente en tu colección
  create: (data) => {
    if (MOCK) {
      const name = data.name.trim()
      const duplicated = mockState.some(
        (m) => mockSavedIds.has(m.id) && m.name.toLowerCase() === name.toLowerCase()
      )
      if (duplicated) return fakeError(409, `Ya tienes una comida llamada "${name}"`)

      const isComposite = data.ingredients?.length > 0
      const macros = isComposite
        ? buildFromIngredients(data.ingredients)
        : {
            kcalPer100g: data.kcalPer100g,
            carbsPer100g: data.carbsPer100g,
            proteinsPer100g: data.proteinsPer100g,
            fatsPer100g: data.fatsPer100g,
          }
      if (!macros) return fakeError(400, 'Ingrediente no encontrado')

      const created = { id: nextMockId++, name, ...macros }
      mockState = [...mockState, created]
      mockSavedIds.add(created.id)
      return fakeDelay(created)
    }
    return axiosClient.post(ENDPOINTS.meals.create, data)
  },

  // Añadir a mi colección una comida del catálogo o una que veo en el calendario
  save: (userId, mealId) => {
    if (MOCK) {
      mockSavedIds.add(mealId)
      return fakeDelay(mockState.find((m) => m.id === mealId))
    }
    return axiosClient.put(ENDPOINTS.users.meal(userId, mealId))
  },

  // Quitarla de mi colección (no la borra: otros pueden tenerla)
  unsave: (userId, mealId) => {
    if (MOCK) {
      mockSavedIds.delete(mealId)
      return fakeDelay(null)
    }
    return axiosClient.delete(ENDPOINTS.users.meal(userId, mealId))
  },
}