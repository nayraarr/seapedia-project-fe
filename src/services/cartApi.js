import api from './api'

export const getCart = () => api.get('/buyer/cart')

export const addToCart = (productId, quantity = 1) =>
    api.post('/buyer/cart/items', { productId, quantity })

export const updateCartItem = (cartItemId, quantity) =>
    api.patch(`/buyer/cart/items/${cartItemId}`, { quantity })

export const removeCartItem = (cartItemId) =>
    api.delete(`/buyer/cart/items/${cartItemId}`)

export const clearCart = () => api.delete('/buyer/cart')
