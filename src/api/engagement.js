import apiClient from './client.js';

function ensureResource(resource) {
  if (resource !== 'news' && resource !== 'events') {
    throw new Error('Invalid resource. Expected "news" or "events".');
  }
}

export const engagementAPI = {
  getComments: (resource, targetId) => {
    ensureResource(resource);
    return apiClient.get(`/${resource}/${targetId}/comments`);
  },
  createComment: (resource, targetId, data) => {
    ensureResource(resource);
    return apiClient.post(`/${resource}/${targetId}/comments`, data);
  },
  updateComment: (commentId, data) => apiClient.put(`/comments/${commentId}`, data),
  deleteComment: (commentId) => apiClient.delete(`/comments/${commentId}`),

  getReactions: (resource, targetId) => {
    ensureResource(resource);
    return apiClient.get(`/${resource}/${targetId}/reactions`);
  },
  createReaction: (resource, targetId, data) => {
    ensureResource(resource);
    return apiClient.post(`/${resource}/${targetId}/reactions`, data);
  },
  deleteReaction: (reactionId) => apiClient.delete(`/reactions/${reactionId}`),
};
