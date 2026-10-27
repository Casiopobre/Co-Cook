import { Button } from '../../../components/ui/Button'
import { useLeaveGroup } from '../hooks/useLeaveGroup'
import './LeaveGroupConfirm.css'

export function LeaveGroupConfirm({ groupName, onCancel, onSuccess }) {
  const { mutate, isPending, error } = useLeaveGroup()

  const message =
    error?.response?.status === 409
      ? 'Ya estás solo en este grupo.'
      : error && 'No se pudo salir del grupo.'

  return (
    <div className="leave-group">
      <p>
        Vas a salir de <strong>{groupName}</strong>. Te crearemos un grupo nuevo solo para
        ti, con el planificador, la despensa y la lista de la compra vacíos.
      </p>
      <p className="leave-group__note">
        Tus comidas se conservan. Para volver a {groupName} necesitarás su código de invitación.
      </p>

      {message && <p role="alert" className="alert alert--error">{message}</p>}

      <div className="leave-group__actions">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isPending}>
          Cancelar
        </Button>
        <Button
          type="button"
          variant="danger"
          onClick={() => mutate(undefined, { onSuccess })}
          disabled={isPending}
        >
          {isPending ? 'Saliendo...' : 'Salir del grupo'}
        </Button>
      </div>
    </div>
  )
}