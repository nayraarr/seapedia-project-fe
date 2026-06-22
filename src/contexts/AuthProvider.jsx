import { useState, useMemo } from 'react'
import { AuthContext } from './authContext'

export function AuthProvider({ children }) {
    const [token, setToken] = useState(localStorage.getItem('token'))
    const [user, setUser] = useState(null)

    const decodeToken = (tkn) => {
        if (!tkn) return null
        try {
            return JSON.parse(atob(tkn.split('.')[1]))
        } catch {
            return null
        }
    }

    const decoded = decodeToken(token)
    const activeRole = decoded?.activeRole || null
    const roles = decoded?.roles || []

    const login = (newToken) => {
        localStorage.setItem('token', newToken)
        setToken(newToken)
    }

    const logout = () => {
        localStorage.removeItem('token')
        setToken(null)
        setUser(null)
    }

    const value = useMemo(
        () => ({ token, user, activeRole, roles, login, logout, decoded }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [token, user]
    )

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}