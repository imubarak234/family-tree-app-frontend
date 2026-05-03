import apiClient from './client';

export const utilitiesAPI = {
  contact: (payload) => apiClient.post('/utilities/contact', payload),
};
