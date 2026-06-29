import api from './api'

export const getAppReviews = () => api.get('/reviews')

export const createAppReview = (data) => api.post('/reviews', data)
