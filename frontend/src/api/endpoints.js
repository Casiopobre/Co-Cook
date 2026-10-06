// src/api/endpoints.js
export const ENDPOINTS = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    me: '/auth/me',
    googleAuthorize: '/oauth2/authorization/google',
  },
  meals: {
    search: '/meals/search',
    list: '/meals',
    byId: (id) => `/meals/${id}`,
    create: '/meals',
  },
  groups: {
    members: (groupId) => `/groups/${groupId}/members`,
    inviteCode: (groupId) => `/groups/${groupId}/invite-code`,
    join: '/groups/join',
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