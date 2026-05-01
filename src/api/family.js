import apiClient from './client';

function cleanParams(params = {}) {
  return Object.entries(params).reduce((acc, [key, value]) => {
    if (value === '' || value === null || value === undefined) {
      return acc;
    }

    if (typeof value === 'string') {
      const trimmed = value.trim();
      if (!trimmed) {
        return acc;
      }
      acc[key] = trimmed;
      return acc;
    }

    acc[key] = value;
    return acc;
  }, {});
}

export const familyAPI = {
  // Members
  getMembers: (params) => apiClient.get('/family/members', { params }),
  getMembersAdvanced: (params) => apiClient.get('/family/members', { params: cleanParams(params) }),
  getMember: (id) => apiClient.get(`/family/members/${id}`),
  createMember: (data) => apiClient.post('/family/members', data),
  updateMember: (id, data) => apiClient.put(`/family/members/${id}`, data),
  deleteMember: (id) => apiClient.delete(`/family/members/${id}`),
  uploadMemberPhoto: (id, formData) =>
    apiClient.post(`/family/members/${id}/photo`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  deleteMemberPhoto: (id) => apiClient.delete(`/family/members/${id}/photo`),

  // Relationships
  getRelationships: (memberId) => apiClient.get(`/family/relationships/member/${memberId}`),
  createRelationship: (data) => apiClient.post('/family/relationships', data),
  createParentChild: (data) => apiClient.post('/family/relationships/parent-child', data),
  createSpouse: (data) => apiClient.post('/family/relationships/spouse', data),
  updateRelationship: (id, data) => apiClient.put(`/family/relationships/${id}`, data),
  deleteRelationship: (id) => apiClient.delete(`/family/relationships/${id}`),
  relationshipSummary: (memberId) => apiClient.get(`/family/relationships/member/${memberId}/summary`),

  // Tree queries
  getAncestors: (memberId, maxDepth) =>
    apiClient.get(`/family/ancestors/${memberId}`, { params: { maxDepth } }),
  getDescendants: (memberId, maxDepth) =>
    apiClient.get(`/family/descendants/${memberId}`, { params: { maxDepth } }),
  getSiblings: (memberId) => apiClient.get(`/family/siblings/${memberId}`),
  getSpouses: (memberId) => apiClient.get(`/family/spouses/${memberId}`),
  getChildren: (memberId) => apiClient.get(`/family/children/${memberId}`),
  getParents: (memberId) => apiClient.get(`/family/parents/${memberId}`),
  getFamilyTree: (memberId, maxDepth) =>
    apiClient.get(`/family/tree/${memberId}`, { params: { maxDepth } }),

  // Birthdays
  getUpcomingBirthdays: (days = 30) =>
    apiClient.get('/family/queries/birthdays/upcoming', { params: { days } }),
  getBirthdaysToday: () => apiClient.get('/family/queries/birthdays/today'),
  getBirthdaysByMonth: (month) => apiClient.get(`/family/queries/birthdays/month/${month}`),

  // Statistics
  getStatistics: () => apiClient.get('/family/queries/statistics'),
};
