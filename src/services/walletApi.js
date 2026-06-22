import api from './api'

export const getWallet = () => api.get('/buyer/wallet')
export const topUp = (amount) => api.post('/buyer/wallet/topup', { amount })
export const getTransactions = () => api.get('/buyer/wallet/transactions')