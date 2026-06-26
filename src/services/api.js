import axios from 'axios'
import { isTokenExpiringSoon } from '../utils/token'

let isRefreshing = false
let refreshSubscribers = []

const onRefreshed = (newToken) => {
    refreshSubscribers.forEach(cb => cb(newToken))
    refreshSubscribers = []
}

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
})

api.interceptors.request.use(async (config) => {
    const token = localStorage.getItem('token')

    const isAuthEndpoint = config.url?.includes('/auth/')

    if (token && !isAuthEndpoint && isTokenExpiringSoon(token, 2)) {
        if (!isRefreshing) {
            isRefreshing = true
            try {
                const res = await api.post('/auth/refresh')
                const newToken = res.data.data.token
                localStorage.setItem('token', newToken)
                onRefreshed(newToken)
            } catch (error) {
                console.error(error)
                refreshSubscribers = []
            } finally {
                isRefreshing = false
            }
        } else {
            await new Promise(resolve => refreshSubscribers.push(resolve))
        }
    }

    const currentToken = localStorage.getItem('token')
    if (currentToken) {
        config.headers.Authorization = `Bearer ${currentToken}`
    }

    return config
})

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token')
            window.location.href = '/login'
        }
        return Promise.reject(error)
    }
)

export default api