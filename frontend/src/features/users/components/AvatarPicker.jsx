import { useRef, useState } from 'react'
import { useAuth } from '../../auth/hooks/useAuth'
import { MemberAvatar } from '../../../components/ui/MemberAvatar'
import { useUploadAvatar } from '../hooks/useUploadAvatar'
import './AvatarPicker.css'

const MAX_SIZE = 2 * 1024 * 1024 // 2 MB
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

function CameraIcon() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor"
         strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 8h3l1.5-2h7L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z" />
      <circle cx="12" cy="13" r="3.5" />
    </svg>
  )
}

export function AvatarPicker() {
  const { user } = useAuth()
  const inputRef = useRef(null)
  const [localError, setLocalError] = useState(null)
  const { mutate, isPending, error } = useUploadAvatar()

  const handleChange = (e) => {
    const file = e.target.files?.[0]
    e.target.value = '' // permite volver a elegir el mismo archivo
    if (!file) return

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setLocalError('Usa una imagen JPG, PNG o WebP.')
      return
    }
    if (file.size > MAX_SIZE) {
      setLocalError('La imagen no puede superar los 2 MB.')
      return
    }

    setLocalError(null)
    mutate(file)
  }

  const serverMessage =
    error?.response?.status === 413
      ? 'La imagen supera el tamaño máximo (2 MB).'
      : error?.response?.data?.message || (error && 'No se pudo subir la foto.')

  const shownError = localError || serverMessage

  return (
    <div className="avatar-picker">
      <button
        type="button"
        className="avatar-picker__button"
        onClick={() => inputRef.current?.click()}
        disabled={isPending}
        aria-label="Cambiar foto de perfil"
      >
        <MemberAvatar member={user} size="lg" />

        <span
          className={`avatar-picker__overlay ${isPending ? 'avatar-picker__overlay--busy' : ''}`}
          aria-hidden="true"
        >
          <CameraIcon />
          <span>{isPending ? 'Subiendo...' : 'Cambiar'}</span>
        </span>

        {/* En pantallas táctiles no hay hover: se muestra siempre una insignia */}
        <span className="avatar-picker__badge" aria-hidden="true">
          <CameraIcon />
        </span>
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleChange}
        hidden
      />

      {shownError && (
        <p role="alert" className="avatar-picker__error">
          {shownError}
        </p>
      )}
    </div>
  )
}