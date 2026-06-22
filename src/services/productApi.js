import api from './api';

export const getMyProducts = () => api.get('/seller/products');
export const createProduct = (data) => api.post('/seller/products', data);
export const updateProduct = (id, data) => api.put(`/seller/products/${id}`, data);
export const deleteProduct = (id) => api.delete(`/seller/products/${id}`);