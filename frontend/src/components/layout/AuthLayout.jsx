import './AuthLayout.css'

export function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="auth">
      <div className="auth__card">
        <div className="auth__header">
          <p className="auth__logo">🗿​</p>
          <h1 className="auth__title">{title}</h1>
          {subtitle && <p className="auth__subtitle">{subtitle}</p>}
        </div>
        {children}
        {footer && <div className="auth__footer">{footer}</div>}
      </div>
    </div>
  )
}