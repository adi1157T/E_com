import React, { createContext, useState, useContext, useEffect } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token'))

  useEffect(() => {
    if (token) {
      setToken(token)
    }
  }, [token])

  const login = (tokenData, role) => {
  localStorage.setItem('token', tokenData)
  localStorage.setItem('role', role)
  setToken(tokenData)
}

const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('role')
  setToken(null)
}
const role = localStorage.getItem('role')
  return (
    <AuthContext.Provider value={{ user, token, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}