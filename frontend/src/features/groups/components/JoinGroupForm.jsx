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
    const message = hasCompanions
      ? 'Al unirte a otro grupo dejarás el actual. ¿Quieres continuar?'
      : 'Eres la única persona de tu grupo. Si te unes a otro, tu grupo se eliminará con su planificador, despensa y lista de la compra. Tus comidas se conservan. ¿Quieres continuar?'

    if (!window.confirm(message)) return
    mutate(data, { onSuccess })
  }

  const errorMessage =
    error?.response?.status === 404
      ? 'El código no es válido'
      : error?.response?.status === 409
        ? 'Ya perteneces a este grupo'
        : error && 'No se pudo completar la unión al grupo'

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form" noValidate>
      <p className="alert alert--warning">
        {hasCompanions
          ? 'Ya compartes grupo con otras personas. Unirte a uno nuevo te sacará del actual.'
          : 'Estás solo en tu grupo. Si te unes a otro, el tuyo se eliminará con todo lo que contiene, salvo tus comidas.'}
      </p>
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