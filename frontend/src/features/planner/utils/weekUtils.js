const MEAL_TYPES = ['BREAKFAST', 'LUNCH', 'SNACK', 'DINNER']

const MEAL_TYPE_LABELS = {
  BREAKFAST: 'Desayuno',
  LUNCH: 'Comida',
  SNACK: 'Merienda',
  DINNER: 'Cena',
}

const DAY_LABELS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

// Devuelve el lunes de la semana que contiene "date"
function getMonday(date) {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  return new Date(d.setDate(diff))
}

function toISODate(date) {
  return date.toISOString().split('T')[0] // "2026-10-05"
}

function getWeekDates(referenceDate = new Date()) {
  const monday = getMonday(referenceDate)
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return d
  })
}

export { MEAL_TYPES, MEAL_TYPE_LABELS, DAY_LABELS, getWeekDates, toISODate, getMonday }