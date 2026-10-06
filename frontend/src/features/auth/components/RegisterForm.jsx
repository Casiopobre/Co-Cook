import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { FormField } from '../../../components/ui/FormField'
import { Button } from '../../../components/ui/Button'
import { registerSchema } from '../schemas'
import { useRegister } from '../hooks/useRegister'
import { GoogleLoginButton } from './GoogleLoginButton'
import './AuthForm.css'

export function RegisterForm() {
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({ resolver: zodResolver(registerSchema) })

  const { mutate, isPending, error } = useRegister()

  const onSubmit = (data) =>
    mutate(data, {
      onSuccess: () => navigate('/dashboard', { replace: true }),
      onError: (err) => {
        if (err.response?.status === 409) {
          setError('email', { message: 'Este email ya está registrado' })
        }
      },
    })

  const serverMessage =
    error && error.response?.status !== 409
      ? error.response?.data?.message || 'No se pudo crear la cuenta'
      : null

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form" noValidate>
      <FormField
        id="name"
        label="Nombre"
        autoComplete="name"
        error={errors.name?.message}
        {...register('name')}
      />
      <FormField
        id="email"
        label="Email"
        type="email"
        autoComplete="email"
        error={errors.email?.message}
        {...register('email')}
      />
      <FormField
        id="password"
        label="Contraseña"
        type="password"
        autoComplete="new-password"
        error={errors.password?.message}
        {...register('password')}
      />
      <FormField
        id="confirmPassword"
        label="Repite la contraseña"
        type="password"
        autoComplete="new-password"
        error={errors.confirmPassword?.message}
        {...register('confirmPassword')}
      />

      {serverMessage && (
        <p role="alert" className="alert alert--error">
          {serverMessage}
        </p>
      )}

      <Button type="submit" block disabled={isPending}>
        {isPending ? 'Creando cuenta...' : 'Crear cuenta'}
      </Button>

      <div className="auth-divider">o</div>

      <GoogleLoginButton />
    </form>
  )
}