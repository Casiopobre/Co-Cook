import './Button.css'

export function Button({ children, variant = 'primary', block = false, ...props }) {
  const classes = ['btn', `btn--${variant}`, block && 'btn--block']
    .filter(Boolean)
    .join(' ')

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  )
}