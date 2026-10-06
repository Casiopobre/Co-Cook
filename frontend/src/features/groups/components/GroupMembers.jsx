import { useState } from 'react'
import './GroupMembers.css'
import { useAuth } from '../../auth/hooks/useAuth'
import { useGroupId } from '../../auth/hooks/useGroupId'
import { useGroupMembers } from '../hooks/useGroupMembers'
import { Modal } from '../../../components/ui/Modal'
import { Button } from '../../../components/ui/Button'
import { JoinGroupForm } from './JoinGroupForm'
import { InviteCodeDisplay } from './InviteCodeDisplay'

export default function GroupMembers() {
  const { user } = useAuth()
  const groupId = useGroupId()
  const { data: members = [], isLoading } = useGroupMembers(groupId)

  const [modalMode, setModalMode] = useState(null) // null | 'invite' | 'join'
  const closeModal = () => setModalMode(null)

  if (isLoading) return <p className="group-members__loading">Cargando grupo...</p>

  return (
    <div className="group-members">
      <p className="group-members__title">{user?.group?.name}</p>

      <ul className="group-members__list">
        {members.map((member) => (
          <li key={member.id}>
            <figure className="group-members__avatar">
              <img src={member.imageRoute} alt={member.username} />
              <figcaption>{member.username}</figcaption>
            </figure>
          </li>
        ))}
      </ul>

      <div className="group-members__actions">
        <Button variant="secondary" onClick={() => setModalMode('invite')}>
          Invitar a alguien
        </Button>
        <Button variant="secondary" onClick={() => setModalMode('join')}>
          Unirme a otro grupo
        </Button>
      </div>

      <Modal isOpen={modalMode === 'invite'} onClose={closeModal} title="Invitar a tu grupo">
        <InviteCodeDisplay groupId={groupId} />
      </Modal>

      <Modal isOpen={modalMode === 'join'} onClose={closeModal} title="Unirte a otro grupo">
        <JoinGroupForm onSuccess={closeModal} />
      </Modal>
    </div>
  )
}