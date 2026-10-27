import axiosClient from '../../../api/axiosClient'
import { ENDPOINTS } from '../../../api/endpoints'
import { MOCK_MEMBERS_ALONE, MOCK_MEMBERS_SHARED } from '../mocks/mockMembers'
import { MOCK_INVITE_CODE } from '../mocks/mockInviteCode'

const MOCK_GROUPS = import.meta.env.VITE_MOCK_GROUPS === 'true'
const fakeDelay = (data, ms = 300) => new Promise((r) => setTimeout(() => r(data), ms))

// Empieza compartido para poder probar el botón "Salir del grupo"
let mockMembers = MOCK_MEMBERS_SHARED

export const groupService = {
  getMembers: (groupId) => {
    if (MOCK_GROUPS) return fakeDelay(mockMembers)
    return axiosClient.get(ENDPOINTS.groups.members(groupId))
  },

  getInviteCode: (groupId) => {
    if (MOCK_GROUPS) return fakeDelay({ inviteCode: MOCK_INVITE_CODE })
    return axiosClient.get(ENDPOINTS.groups.inviteCode(groupId))
  },

  join: (userId, { inviteCode }) => {
    if (MOCK_GROUPS) {
      if (inviteCode !== MOCK_INVITE_CODE) {
        return Promise.reject({ response: { status: 404, data: { message: 'Código no válido' } } })
      }
      mockMembers = MOCK_MEMBERS_SHARED
      return fakeDelay({ id: 2, name: 'Grupo de Ana' })
    }
    return axiosClient.put(ENDPOINTS.users.group(userId), { inviteCode })
  },

  // Opcional: requiere DELETE /users/{userId}/group en el backend
  leave: (userId) => {
    if (MOCK_GROUPS) {
      mockMembers = MOCK_MEMBERS_ALONE
      return fakeDelay({ id: 1, name: "Carlos's group" })
    }
    return axiosClient.delete(ENDPOINTS.users.group(userId))
  },
}