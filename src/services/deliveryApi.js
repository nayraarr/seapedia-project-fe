import api from './api'

export const getAvailableJobs = () => api.get('/driver/jobs')
export const getJobDetail = (jobId) => api.get(`/driver/jobs/${jobId}`)