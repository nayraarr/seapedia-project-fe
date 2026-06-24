import api from './api'

export const getAdminDashboard = () => api.get('/admin/dashboard')
export const getAdminUsers = () => api.get('/admin/users')
export const getAdminOrders = () => api.get('/admin/orders')
export const getAdminOrderDetail = (orderId) => api.get(`/admin/orders/${orderId}`)
export const getAdminUserWallet = (userId) => api.get(`/admin/users/${userId}/wallet`)
export const getAdminUserFinancialSummary = (userId) => api.get(`/admin/users/${userId}/financial-summary`)
export const getAdminDeliveryJobs = () => api.get('/admin/delivery-jobs')

export const getSimulationStatus = () => api.get('/admin/simulate/status')
export const advanceSimulation = (minutes) => api.post(`/admin/simulate/advance?minutes=${minutes}`)
export const resetSimulation = () => api.post('/admin/simulate/reset')