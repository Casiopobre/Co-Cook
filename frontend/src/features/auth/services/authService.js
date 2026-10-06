/* Antigüo código
import axiosClient from '../../../api/axiosClient'
import { ENDPOINTS } from '../../../api/endpoints'

export const authService = {
  login: (credentials) => axiosClient.post(ENDPOINTS.auth.login, credentials),
  register: (data) => axiosClient.post(ENDPOINTS.auth.register, data),
  me: () => axiosClient.get(ENDPOINTS.auth.me),
}*/

// Bypaseasear un usuario falso con mock
import axiosClient from '../../../api/axiosClient'
import { ENDPOINTS } from '../../../api/endpoints'
import { MOCK_USER, MOCK_TOKEN } from '../mocks/mockUser'

const MOCK_AUTH = import.meta.env.VITE_MOCK_AUTH === 'true'

// Simula latencia de red para que el loading/spinner también se vea realista
const fakeDelay = (data, ms = 400) =>
  new Promise((resolve) => setTimeout(() => resolve(data), ms))

export const authService = {
  login: (credentials) => {
    if (MOCK_AUTH) {
      return fakeDelay({ token: MOCK_TOKEN, user: MOCK_USER })
    }
    return axiosClient.post(ENDPOINTS.auth.login, credentials)
  },

  register: (data) => {
    if (MOCK_AUTH) {
      return fakeDelay({
        token: MOCK_TOKEN,
        user: { ...MOCK_USER, username: data.username, email: data.email },
      })
    }
    return axiosClient.post(ENDPOINTS.auth.register, data)
  },

  me: () => {
    if (MOCK_AUTH) {
      return fakeDelay(MOCK_USER)
    }
    return axiosClient.get(ENDPOINTS.auth.me)
  },
}