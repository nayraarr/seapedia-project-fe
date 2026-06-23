import api from './api'

export const getAddresses = () => api.get('/buyer/addresses')
export const createAddress = (data) => api.post('/buyer/addresses', data)
export const updateAddress = (id, data) => api.put(`/buyer/addresses/${id}`, data)
export const deleteAddress = (id) => api.delete(`/buyer/addresses/${id}`)
export const setDefaultAddress = (id) => api.patch(`/buyer/addresses/${id}/default`)
