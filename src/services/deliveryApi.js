import api from './api'

export const getAvailableJobs = () => api.get('/driver/jobs')
export const getJobDetail = (jobId) => api.get(`/driver/jobs/${jobId}`)
export const takeJob = (jobId) => api.patch(`/driver/jobs/${jobId}/take`)
export const getActiveJobs = () => api.get('/driver/jobs/active')
export const getJobHistory = () => api.get('/driver/jobs/history')
export const getDriverReport = () => api.get('/driver/jobs/report')