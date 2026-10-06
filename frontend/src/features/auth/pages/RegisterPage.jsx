import { Link } from 'react-router-dom'
import { AuthLayout } from '../../../components/layout/AuthLayout'
import { RegisterForm } from '../components/RegisterForm'

export default function RegisterPage() {
  return (
    <AuthLayout
      title="Crea tu cuenta"
      subtitle="Planifica tus comidas y controla tus macros"
      footer={
        <>
          ¿Ya tienes cuenta?{' '}
          <Link to="/login">
            Inicia sesión
          </Link>
        </>
      }
    >
      <RegisterForm />
    </AuthLayout>
  )
}