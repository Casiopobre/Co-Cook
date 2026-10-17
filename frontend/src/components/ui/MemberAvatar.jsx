import { useState } from 'react'
import { getAvatarUrl } from '../../utils/imageURL'
import './MemberAvatar.css'

const PALETTE = [
  { bg: '#d1fae5', fg: '#065f46' },
  { bg: '#fde68a', fg: '#92400e' },
  { bg: '#fecdd3', fg: '#9f1239' },
  { bg: '#bfdbfe', fg: '#1e40af' },
  { bg: '#ddd6fe', fg: '#5b21b6' },
  { bg: '#fed7aa', fg: '#9a3412' },
]

function getInitials(name = '') {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[1][0]).toUpperCase()
}

export function MemberAvatar({ member, size = 'md' }) {
  const [failedUrl, setFailedUrl] = useState(null)
  const color = PALETTE[Math.abs(member.id ?? 0) % PALETTE.length]

  const url = getAvatarUrl(member.imageRoute)
  const showImage = url && failedUrl !== url

  return (
    <span
      className={`avatar avatar--${size}`}
      style={{ backgroundColor: color.bg, color: color.fg }}
      aria-hidden="true"
    >
      {showImage ? (
        <img
          className="avatar__img"
          src={url}
          alt=""
          onError={() => setFailedUrl(url)}
        />
      ) : (
        getInitials(member.username)
      )}
    </span>
  )
}