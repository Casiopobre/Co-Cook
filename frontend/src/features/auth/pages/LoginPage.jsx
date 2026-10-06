import { Link } from 'react-router-dom'
import { AuthLayout } from '../../../components/layout/AuthLayout'
import { LoginForm } from '../components/LoginForm'

export default function LoginPage() {
  return (
    <AuthLayout
      title="Bienvenido de nuevo"
      subtitle="Inicia sesión para ver tu planificador"
      footer={
        <>
          ¿No tienes cuenta?{' '}
          <Link to="/register">
            Regístrate
          </Link>
        </>
      }
    >
      <LoginForm />
    </AuthLayout>
  )
}