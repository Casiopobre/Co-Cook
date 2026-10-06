import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, useLocation } from 'react-router-dom'
import { FormField } from '../../../components/ui/FormField'
import { Button } from '../../../components/ui/Button'
import { loginSchema } from '../schemas'
import { useLogin } from '../hooks/useLogin'
import { GoogleLoginButton } from './GoogleLoginButton'
import './AuthForm.css'

export function LoginForm() {
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/dashboard'

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema) })

  const { mutate, isPending, error } = useLogin()

  const onSubmit = (data) =>
    mutate(data, { onSuccess: () => navigate(from, { replace: true }) })

  const serverMessage =
    error?.response?.status === 401
      ? 'Email o contraseña incorrectos'
      : error?.response?.data?.message || (error && 'No se pudo iniciar sesión')

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form" noValidate>
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
        autoComplete="current-password"
        error={errors.password?.message}
        {...register('password')}
      />

      {serverMessage && (
        <p role="alert" className="alert alert--error">
          {serverMessage}
        </p>
      )}

      <Button type="submit" block disabled={isPending}>
        {isPending ? 'Entrando...' : 'Iniciar sesión'}
      </Button>

      <div className="auth-divider">o</div>

      <GoogleLoginButton />
    </form>
  )
}