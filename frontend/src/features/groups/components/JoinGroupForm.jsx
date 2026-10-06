import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormField } from '../../../components/ui/FormField'
import { Button } from '../../../components/ui/Button'
import { joinGroupSchema } from '../schemas'
import { useJoinGroup } from '../hooks/useJoinGroup'

export function JoinGroupForm({ hasCompanions, onSuccess }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(joinGroupSchema) })

  const { mutate, isPending, error } = useJoinGroup()

  const onSubmit = (data) => {
    if (hasCompanions) {
      const confirmed = window.confirm(
        'Al unirte a otro grupo dejarás el tuyo actual. ¿Quieres continuar?'
      )
      if (!confirmed) return
    }
    mutate(data, { onSuccess })
  }

  const errorMessage =
    error?.response?.status === 404
      ? 'El código no es válido'
      : error && 'No se pudo completar la unión al grupo'

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form" noValidate>
      {hasCompanions && (
        <p className="alert alert--warning">
          Ya compartes grupo con otras personas. Unirte a uno nuevo te sacará del actual.
        </p>
      )}
      <FormField
        id="invite-code"
        label="Código de invitación"
        placeholder="Ej. AB12CD"
        error={errors.inviteCode?.message}
        {...register('inviteCode')}
      />
      {errorMessage && <p className="alert alert--error">{errorMessage}</p>}
      <Button type="submit" block disabled={isPending}>
        {isPending ? 'Uniéndote...' : 'Unirme al grupo'}
      </Button>
    </form>
  )
}