import apiClient from './client';

export const settingsAPI = {
  getSettings: () => apiClient.get('/settings'),
  updateSettings: (payload) => apiClient.put('/settings', payload),
};
