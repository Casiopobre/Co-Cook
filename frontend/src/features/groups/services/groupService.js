import axiosClient from '../../../api/axiosClient'
import { ENDPOINTS } from '../../../api/endpoints'
import { MOCK_MEMBERS_ALONE } from '../mocks/mockMembers'
import { MOCK_INVITE_CODE } from '../mocks/mockInviteCode'

const MOCK_GROUPS = import.meta.env.VITE_MOCK_GROUPS === 'true'
const fakeDelay = (data, ms = 300) => new Promise((r) => setTimeout(() => r(data), ms))

export const groupService = {
  getMembers: (groupId) => {
    if (MOCK_GROUPS) return fakeDelay(MOCK_MEMBERS_ALONE)
    return axiosClient.get(ENDPOINTS.groups.members(groupId))
  },

  getInviteCode: (groupId) => {
    if (MOCK_GROUPS) return fakeDelay({ inviteCode: MOCK_INVITE_CODE })
    return axiosClient.get(ENDPOINTS.groups.inviteCode(groupId))
  },

  join: ({ inviteCode }) => {
    if (MOCK_GROUPS) {
      // simula error si el código no es el de prueba, para poder ver ambos estados
      if (inviteCode !== MOCK_INVITE_CODE) {
        return Promise.reject({ response: { status: 404, data: { message: 'Código no válido' } } })
      }
      return fakeDelay({ id: 2, name: 'Grupo de Ana' })
    }
    return axiosClient.post(ENDPOINTS.groups.join, { inviteCode })
  },
}