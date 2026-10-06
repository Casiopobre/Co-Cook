import { ENDPOINTS } from '../../../api/endpoints'
import './GoogleLoginButton.css'

const API_BASE = import.meta.env.VITE_API_URL

export function GoogleLoginButton() {
  const handleClick = () => {
    // Navegación completa del navegador, no un fetch:
    // Spring necesita manejar cookies/redirecciones de Google directamente
    window.location.href = `${API_BASE}${ENDPOINTS.auth.googleAuthorize}`
  }

  return (
    <button type="button" className="google-btn" onClick={handleClick}>
      <svg className="google-btn__icon" viewBox="0 0 48 48" aria-hidden="true">
        <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l6-6C34.5 5.1 29.6 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21 21-9.4 21-21c0-1.4-.1-2.8-.4-4.5z" />
        <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.8 1.1 8 3l6-6C34.5 5.1 29.6 3 24 3c-7.5 0-13.9 4.3-17.1 10.7z" />
        <path fill="#4CAF50" d="M24 45c5.5 0 10.4-1.9 14.2-5.1l-6.6-5.4C29.6 36 26.9 37 24 37c-5.2 0-9.6-3.4-11.2-8l-6.6 5.1C9.9 40.5 16.4 45 24 45z" />
        <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.2-4.1 5.5l6.6 5.4C41.3 36.6 44 31 44 24c0-1.4-.1-2.8-.4-4.5z" />
      </svg>
      Continuar con Google
    </button>
  )
}