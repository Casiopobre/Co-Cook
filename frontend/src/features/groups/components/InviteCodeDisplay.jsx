import { useState } from 'react'
import { useInviteCode } from '../hooks/useInviteCode'
import { Button } from '../../../components/ui/Button'
import './InviteCodeDisplay.css'

export function InviteCodeDisplay({ groupId }) {
  const { data, isLoading, isError } = useInviteCode(groupId)
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    if (!data?.inviteCode) return
    await navigator.clipboard.writeText(data.inviteCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (isLoading) return <p>Generando código...</p>
  if (isError) return <p className="alert alert--error">No se pudo obtener el código</p>

  return (
    <div className="invite-code">
      <p className="invite-code__hint">
        Comparte este código con quien quieras invitar a tu grupo.
      </p>
      <div className="invite-code__box">
        <span className="invite-code__value">{data.inviteCode}</span>
        <Button variant="secondary" onClick={handleCopy}>
          {copied ? 'Copiado ✓' : 'Copiar'}
        </Button>
      </div>
    </div>
  )
}