import api from './api'

// Admin-only
export const generateVoucher = (data) => api.post('/admin/vouchers', data)
export const generatePromo = (data) => api.post('/admin/promos', data)
export const getAdminVouchers = () => api.get('/admin/vouchers')
export const getAdminPromos = () => api.get('/admin/promos')

// Public/read-only
export const getVouchers = () => api.get('/discounts/vouchers')
export const getVoucherDetail = (id) => api.get(`/discounts/vouchers/${id}`)
export const getPromos = () => api.get('/discounts/promos')
export const getPromoDetail = (id) => api.get(`/discounts/promos/${id}`)

// Buyer
export const validateDiscountCode = (code) => api.post('/buyer/discounts/validate', { code })