import apiClient from './client.js';

export const adminBillingAPI = {
  getPlans: () => apiClient.get('/admin/billing/plans'),
  createPlan: (data) => apiClient.post('/admin/billing/plans', data),
  patchPlan: (planId, data) => apiClient.patch(`/admin/billing/plans/${planId}`, data),

  getSubscriptions: (params) => apiClient.get('/admin/billing/subscriptions', { params }),
  getFamilySummary: (familyId) => apiClient.get(`/admin/billing/families/${familyId}`),
  expireOverdueSubscriptions: () => apiClient.post('/admin/billing/subscriptions/expire-overdue'),
};
