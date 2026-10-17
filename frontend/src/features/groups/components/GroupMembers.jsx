import { useState } from 'react'
import './GroupMembers.css'
import { useAuth } from '../../auth/hooks/useAuth'
import { useGroupId } from '../../auth/hooks/useGroupId'
import { useGroupMembers } from '../hooks/useGroupMembers'
import { Modal } from '../../../components/ui/Modal'
import { JoinGroupForm } from './JoinGroupForm'
import { InviteCodeDisplay } from './InviteCodeDisplay'
import { MemberAvatar } from '../../../components/ui/MemberAvatar'

const MAX_STACKED = 4

function describeGroup(count) {
  if (count <= 1) return 'De momento solo estás tú'
  return `Sois ${count} personas cocinando juntas`
}

export default function GroupMembers() {
  const { user } = useAuth()
  const groupId = useGroupId()
  const { data: members = [], isLoading, isError } = useGroupMembers(groupId)

  const [modalMode, setModalMode] = useState(null) // null | 'invite' | 'join'
  const closeModal = () => setModalMode(null)

  if (isLoading) return <p className="group-members__status">Cargando grupo...</p>
  if (isError) {
    return (
      <p className="group-members__status group-members__status--error">
        No se pudo cargar el grupo. Recarga la página para intentarlo de nuevo.
      </p>
    )
  }

  const hasCompanions = members.length > 1
  const stacked = members.slice(0, MAX_STACKED)
  const hiddenCount = members.length - stacked.length

  return (
    <section className="group-members" aria-labelledby="group-members-title">
      <header className="group-members__header">
        <div>
          <h2 id="group-members-title" className="group-members__title">
            {user?.group?.name}
          </h2>
          <p className="group-members__subtitle">{describeGroup(members.length)}</p>
        </div>

        <div className="group-members__stack" aria-hidden="true">
          {stacked.map((member) => (
            <span key={member.id} className="group-members__stack-item">
              <MemberAvatar member={member} size="sm" />
            </span>
          ))}
          {hiddenCount > 0 && (
            <span className="group-members__stack-more">+{hiddenCount}</span>
          )}
        </div>
      </header>

      <ul className="group-members__list">
        {members.map((member) => {
          const isMe = member.id === user?.id
          return (
            <li key={member.id} className="group-members__item">
              <MemberAvatar member={member} />
              <div className="group-members__info">
                <span className="group-members__name">{member.username}</span>
                <span className="group-members__email">{member.email}</span>
              </div>
              {isMe && <span className="group-members__badge">Tú</span>}
            </li>
          )
        })}

        <li>
          <button
            type="button"
            className="group-members__seat"
            onClick={() => setModalMode('invite')}
          >
            <span className="group-members__seat-circle" aria-hidden="true">+</span>
            <span className="group-members__seat-text">
              {hasCompanions ? 'Invitar a alguien más' : 'Invitar a alguien'}
            </span>
          </button>
        </li>
      </ul>

      <button
        type="button"
        className="group-members__join"
        onClick={() => setModalMode('join')}
      >
        Unirme a otro grupo
      </button>

      <Modal
        isOpen={modalMode === 'invite'}
        onClose={closeModal}
        title="Invitar a tu grupo"
      >
        <InviteCodeDisplay groupId={groupId} />
      </Modal>

      <Modal
        isOpen={modalMode === 'join'}
        onClose={closeModal}
        title="Unirte a otro grupo"
      >
        <JoinGroupForm hasCompanions={hasCompanions} onSuccess={closeModal} />
      </Modal>
    </section>
  )
}