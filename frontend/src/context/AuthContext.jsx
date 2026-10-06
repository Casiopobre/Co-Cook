import { createContext, useState, useCallback, useMemo } from 'react'

export const AuthContext = createContext(null)

function readStoredUser() {
  try {
    return JSON.parse(localStorage.getItem('user'))
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser)
  const [token, setToken] = useState(() => localStorage.getItem('token'))

  const setSession = useCallback(({ token, user }) => {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
    setToken(token)
    setUser(user)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
  }, [])

  //"user" será un obxeto cos datos do usuario que nos pasará o backend (co grupo ao que pertence, etc)
  const value = useMemo(
    () => ({ user, token, isAuthenticated: !!token, setSession, logout }),
    [user, token, setSession, logout]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}