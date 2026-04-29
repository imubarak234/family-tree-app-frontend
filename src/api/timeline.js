import apiClient from './client.js';

export const timelineAPI = {
  list: (params) => apiClient.get('/timeline', { params }),
};
