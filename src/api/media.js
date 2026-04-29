import apiClient from './client';

export const mediaAPI = {
  // Photos
  uploadPhoto: (formData) =>
    apiClient.post('/media/photos', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  // Documents
  uploadDocument: (formData) =>
    apiClient.post('/media/documents', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  // Media CRUD
  listMedia: (params) => apiClient.get('/media', { params }),
  getMedia: (id) => apiClient.get(`/media/${id}`),
  updateMedia: (id, data) => apiClient.put(`/media/${id}`, data),
  deleteMedia: (id) => apiClient.delete(`/media/${id}`),

  // Photo Tags
  getPhotoTags: (photoId) => apiClient.get(`/media/photos/${photoId}/tags`),
  addPhotoTag: (photoId, familyMemberId) =>
    apiClient.post(`/media/photos/${photoId}/tags`, { familyMemberId }),
  removePhotoTag: (photoId, tagId) =>
    apiClient.delete(`/media/photos/${photoId}/tags/${tagId}`),
};
