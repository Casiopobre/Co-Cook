import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { authService } from '../services/authService'

export default function OAuthCallbackPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { setSession } = useAuth()
  const [error, setError] = useState(null)
  const ran = useRef(false) // evita doble ejecución en StrictMode

  useEffect(() => {
    if (ran.current) return
    ran.current = true

    const token = searchParams.get('token')
    const oauthError = searchParams.get('error')

    if (oauthError) {
      setError('No se pudo iniciar sesión con Google')
      return
    }
    if (!token) {
      setError('Token no recibido')
      return
    }

    // Guardamos el token primero para que la petición de abajo vaya autenticada
    localStorage.setItem('token', token)

    authService
      .me() // GET /auth/me → devuelve el usuario a partir del token
      .then((user) => {
        setSession({ token, user })
        navigate('/', { replace: true })
      })
      .catch(() => {
        localStorage.removeItem('token')
        setError('No se pudo completar el inicio de sesión')
      })
  }, [searchParams, setSession, navigate])

  if (error) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p>{error}</p>
        <button onClick={() => navigate('/login', { replace: true })}>
          Volver al login
        </button>
      </div>
    )
  }

  return <div style={{ padding: '2rem', textAlign: 'center' }}>Iniciando sesión...</div>
}