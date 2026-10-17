const API_URL = import.meta.env.VITE_API_URL
const DEFAULT_AVATAR_MARKER = 'default-avatar'

export function getAvatarUrl(imageRoute) {
  if (!imageRoute || imageRoute.includes(DEFAULT_AVATAR_MARKER)) return null
  // blob: lo usa la vista previa antes de subir; http(s) por si algún día hay CDN
  if (/^(https?:|blob:|data:)/.test(imageRoute)) return imageRoute
  return `${API_URL}${imageRoute}`
}