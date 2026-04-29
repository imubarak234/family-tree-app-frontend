import apiClient from './client.js';

export const eventsAPI = {
  list: (params) => apiClient.get('/events', { params }),
  getById: (id) => apiClient.get(`/events/${id}`),
  create: (data) => apiClient.post('/events', data),
  update: (id, data) => apiClient.put(`/events/${id}`, data),
  delete: (id) => apiClient.delete(`/events/${id}`),

  getRsvps: (id) => apiClient.get(`/events/${id}/rsvps`),
  createRsvp: (id, data) => apiClient.post(`/events/${id}/rsvp`, data),
  updateRsvp: (id, data) => apiClient.put(`/events/${id}/rsvp`, data),
  deleteRsvp: (id) => apiClient.delete(`/events/${id}/rsvp`),
};
