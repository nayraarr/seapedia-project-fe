import api from './api'

export const previewCheckout = (data) => api.post('/buyer/checkout/preview', data)
export const createOrder = (data) => api.post('/buyer/checkout', data)
export const getBuyerOrders = () => api.get('/buyer/orders')
export const getBuyerOrderDetail = (orderId) => api.get(`/buyer/orders/${orderId}`)
export const getSellerIncomingOrders = () => api.get('/seller/orders/incoming')
export const getSellerOrderDetail = (orderId) => api.get(`/seller/orders/${orderId}`)
export const processSellerOrder = (orderId) => api.patch(`/seller/orders/${orderId}/process`)
export const getBuyerSpendingReport = () => api.get('/buyer/orders/report')
export const getSellerIncomeReport = () => api.get('/seller/orders/report')