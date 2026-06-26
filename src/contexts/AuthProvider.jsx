import { useState, useMemo } from 'react'
import { AuthContext } from './authContext'
import { isTokenExpired } from '../utils/token'
import api from '../services/api'

export function AuthProvider({ children }) {
    const [token, setToken] = useState(() => {
        const stored = localStorage.getItem('token')
        if (isTokenExpired(stored)) {
            localStorage.removeItem('token')
            return null
        }
        return stored
    })
    const [user, setUser] = useState(null)

    const login = (newToken) => {
        localStorage.setItem('token', newToken)
        setToken(newToken)
    }

    const logout = async () => {
        try {
            await api.post('/auth/logout')
        } catch (error) {
            console.error('Logout failed:', error)
        } finally {
            localStorage.removeItem('token')
            setToken(null)
            setUser(null)
        }
    }

    const value = useMemo(() => {
        const decodeToken = (tkn) => {
            if (!tkn) return null
            try {
                return JSON.parse(atob(tkn.split('.')[1]))
            } catch {
                return null
            }
        }
        const d = decodeToken(token)
        return { token, user, activeRole: d?.activeRole || null, roles: d?.roles || [], login, logout, decoded: d, isTokenExpired }
    }, [token, user])

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}
