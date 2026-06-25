import { useState, useMemo } from 'react'
import { AuthContext } from './authContext'
import api from '../services/api'

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

    const logout = async () => {
        try {
            await api.post('/auth/logout')
        } catch (error) {
            console.log(`Exception : ${error.message}`);
        } finally {
            localStorage.removeItem('token')
            setToken(null)
            setUser(null)
        }
    }

    const value = useMemo(
        () => ({ token, user, activeRole, roles, login, logout, decoded }),
        [token, user]
    )

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}