import axiosClient from '../../../api/axiosClient'
import { ENDPOINTS } from '../../../api/endpoints'

const MOCK_AVATAR = import.meta.env.VITE_MOCK_AVATAR === 'true'
const fakeDelay = (data, ms = 600) => new Promise((r) => setTimeout(() => r(data), ms))

export const userService = {
  uploadAvatar: (file) => {
    if (MOCK_AVATAR) {
      // Devuelve solo lo que cambia; el hook lo mezcla con el usuario actual
      return fakeDelay({ imageRoute: URL.createObjectURL(file) })
    }

    const formData = new FormData()
    formData.append('file', file)
    return axiosClient.post(ENDPOINTS.users.avatar, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
}