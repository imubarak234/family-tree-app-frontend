import apiClient from './client.js';

export const newsAPI = {
  list: (params) => apiClient.get('/news', { params }),
  getById: (id) => apiClient.get(`/news/${id}`),
  create: (data) => apiClient.post('/news', data),
  update: (id, data) => apiClient.put(`/news/${id}`, data),
  delete: (id) => apiClient.delete(`/news/${id}`),
  publish: (id) => apiClient.post(`/news/${id}/publish`),
  unpublish: (id) => apiClient.post(`/news/${id}/unpublish`),
  pin: (id) => apiClient.post(`/news/${id}/pin`),
  unpin: (id) => apiClient.post(`/news/${id}/unpin`),
};
