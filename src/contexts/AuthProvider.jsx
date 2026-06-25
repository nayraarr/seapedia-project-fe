import { useState, useMemo } from 'react'
import { AuthContext } from './authContext'
import api from '../services/api'

const isTokenExpired = (tkn) => {
    if (!tkn) return true
    try {
        const payload = JSON.parse(atob(tkn.split('.')[1]))
        return payload.exp * 1000 < Date.now()
    } catch {
        return true
    }
}

const isTokenExpiringSoon = (tkn, thresholdMinutes = 2) => {
    if (!tkn) return true
    try {
        const payload = JSON.parse(atob(tkn.split('.')[1]))
        const expiresAt = payload.exp * 1000
        const threshold = thresholdMinutes * 60 * 1000
        return expiresAt - Date.now() < threshold
    } catch {
        return true
    }
}

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
            console.error('Logout failed:', error)
        } finally {
            localStorage.removeItem('token')
            setToken(null)
            setUser(null)
        }
    }

    const refreshToken = async () => {
        try {
            const res = await api.post('/auth/refresh')
            const newToken = res.data.data.token
            localStorage.setItem('token', newToken)
            setToken(newToken)
            return newToken
        } catch (error) {
            console.error('Refresh failed:', error)
            localStorage.removeItem('token')
            setToken(null)
            setUser(null)
            return null
        }
    }

    const value = useMemo(
        () => ({ token, user, activeRole, roles, login, logout, decoded, isTokenExpired }),
        [token, user]
    )

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}