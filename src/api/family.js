import apiClient from './client';

export const familyAPI = {
  // Members
  getMembers: (params) => apiClient.get('/family/members', { params }),
  getMember: (id) => apiClient.get(`/family/members/${id}`),
  createMember: (data) => apiClient.post('/family/members', data),
  updateMember: (id, data) => apiClient.put(`/family/members/${id}`, data),
  deleteMember: (id) => apiClient.delete(`/family/members/${id}`),

  // Relationships
  createRelationship: (data) => apiClient.post('/family/relationships', data),
  createParentChild: (data) => apiClient.post('/family/relationships/parent-child', data),
  createSpouse: (data) => apiClient.post('/family/relationships/spouse', data),
  deleteRelationship: (id) => apiClient.delete(`/family/relationships/${id}`),

  // Tree queries
  getAncestors: (memberId, maxDepth) =>
    apiClient.get(`/family/tree/ancestors/${memberId}`, { params: { maxDepth } }),
  getDescendants: (memberId, maxDepth) =>
    apiClient.get(`/family/tree/descendants/${memberId}`, { params: { maxDepth } }),
  getSiblings: (memberId) => apiClient.get(`/family/tree/siblings/${memberId}`),
  getChildren: (memberId) => apiClient.get(`/family/tree/children/${memberId}`),
  getParents: (memberId) => apiClient.get(`/family/tree/parents/${memberId}`),

  // Birthdays
  getUpcomingBirthdays: (days = 30) =>
    apiClient.get('/family/queries/birthdays/upcoming', { params: { days } }),
  getBirthdaysToday: () => apiClient.get('/family/queries/birthdays/today'),
  getBirthdaysByMonth: (month) => apiClient.get(`/family/queries/birthdays/month/${month}`),

  // Statistics
  getStatistics: () => apiClient.get('/family/queries/statistics'),
};
