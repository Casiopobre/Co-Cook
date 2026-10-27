export const ENDPOINTS = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    me: '/auth/me',
  },
  users: {
    avatar: (userId) => `/users/${userId}/avatar`,
    group: (userId) => `/users/${userId}/group`,
    meals: (userId) => `/users/${userId}/meals`,
    meal: (userId, mealId) => `/users/${userId}/meals/${mealId}`,
  },
  groups: {
    members: (groupId) => `/groups/${groupId}/members`,
    inviteCode: (groupId) => `/groups/${groupId}/invite-code`,
  },
  meals: {
    list: '/meals',
    byId: (id) => `/meals/${id}`,
    create: '/meals',
  },
  mealPlans: {
    byGroupAndRange: (groupId, from, to) =>
      `/groups/${groupId}/meal-plans?from=${from}&to=${to}`,
    create: (groupId) => `/groups/${groupId}/meal-plans`,
    delete: (groupId, id) => `/groups/${groupId}/meal-plans/${id}`,
  },
  stash: {
    byGroup: (groupId) => `/groups/${groupId}/stash`,
    upsert: (groupId) => `/groups/${groupId}/stash`,
  },
  shoppingList: {
    byGroup: (groupId) => `/groups/${groupId}/shopping-list`,
    upsert: (groupId) => `/groups/${groupId}/shopping-list`,
  },
}