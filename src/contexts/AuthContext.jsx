import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [token, setToken] = useState(localStorage.getItem('token'))
    const [user, setUser] = useState(null)

    // decode JWT untuk ambil activeRole, roles, username
    const decodeToken = (tkn) => {
        if (!tkn) return null
        try {
            const payload = JSON.parse(atob(tkn.split('.')[1]))
            return payload
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

    return (
        <AuthContext.Provider value={{ token, user, activeRole, roles, login, logout, decoded }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)