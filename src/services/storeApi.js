import api from './api'

export const createStore = (data) => api.post('/seller/store', data)
export const updateStore = (data) => api.put('/seller/store', data)
export const getMyStore = () => api.get('/seller/store')
export const getAllStores = () => api.get('/stores')
export const getStoreById = (id) => api.get(`/stores/${id}`)