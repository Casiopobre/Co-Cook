import { useEffect, useRef, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../../features/auth/hooks/useAuth'
import { MemberAvatar } from '../ui/MemberAvatar'
import { AvatarPicker } from '../../features/users/components/AvatarPicker'
import './NavBar.css'

export default function NavBar() {
    const { user, logout } = useAuth()
    const queryClient = useQueryClient()

    const [menuOpen, setMenuOpen] = useState(false)
    const menuRef = useRef(null)
    const triggerRef = useRef(null)

    // Cierra el menú al hacer clic fuera o pulsar Escape
    useEffect(() => {
        if (!menuOpen) return

        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMenuOpen(false)
            }
        }
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                setMenuOpen(false)
                triggerRef.current?.focus() // devuelve el foco al botón
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        document.addEventListener('keydown', handleKeyDown)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
            document.removeEventListener('keydown', handleKeyDown)
        }
    }, [menuOpen])

    const handleLogout = () => {
        setMenuOpen(false)
        queryClient.clear() // evita que el siguiente usuario vea datos en caché del anterior
        logout() // ProtectedRoute te redirige a /login al quedar sin sesión
    }

    return (
        <header className="navbar">
            <nav className="navbar__inner" aria-label="Principal">
                <div className="navbar__left">
                    <NavLink to="/" className="navbar__brand">
                        <span className="navbar__logo" aria-hidden="true">🥗</span>
                        CoCook
                    </NavLink>

                    <ul className="navbar__links">
                        <li>
                            <NavLink
                                to="/"
                                end
                                className={({ isActive }) =>
                                    `navbar__link ${isActive ? 'navbar__link--active' : ''}`
                                }
                            >
                                Planificador
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/meals"
                                className={({ isActive }) =>
                                    `navbar__link ${isActive ? 'navbar__link--active' : ''}`
                                }
                            >
                                Mis comidas
                            </NavLink>
                        </li>
                    </ul>
                </div>

                <div className="navbar__user" ref={menuRef}>
                    <button
                        ref={triggerRef}
                        type="button"
                        className="navbar__trigger"
                        onClick={() => setMenuOpen((open) => !open)}
                        aria-expanded={menuOpen}
                        aria-controls="user-menu"
                    >
                        <MemberAvatar member={user} size="sm" />
                        <span className="navbar__username">{user?.username}</span>
                        <span
                            className={`navbar__chevron ${menuOpen ? 'navbar__chevron--open' : ''}`}
                            aria-hidden="true"
                        />
                    </button>

                    {menuOpen && (
                        <div id="user-menu" className="navbar__menu">
                            <div className="navbar__menu-header">
                                <AvatarPicker />
                                <div className="navbar__menu-info">
                                    <span className="navbar__menu-name">{user?.username}</span>
                                    <span className="navbar__menu-email">{user?.email}</span>
                                </div>
                            </div>

                            {user?.group?.name && (
                                <p className="navbar__menu-group">Grupo: {user.group.name}</p>
                            )}

                            <button type="button" className="navbar__logout" onClick={handleLogout}>
                                Cerrar sesión
                            </button>
                        </div>
                    )}
                </div>
            </nav>
        </header>
    )
}