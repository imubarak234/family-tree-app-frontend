import apiClient from './client';

export const adminAPI = {
  // Signup Requests
  getSignupRequests: (status) =>
    apiClient.get('/admin/signup-requests', { params: status ? { status } : {} }),
  approveSignupRequest: (id, data) =>
    apiClient.post(`/admin/signup-requests/${id}/approve`, data || {}),
  rejectSignupRequest: (id, reason) =>
    apiClient.post(`/admin/signup-requests/${id}/reject`, { reason }),

  // Users
  getUsers: () => apiClient.get('/admin/users'),
  getUserById: (id) => apiClient.get(`/admin/users/${id}`),
  createUser: (data) => apiClient.post('/admin/users', data),
  updateUser: (id, data) => apiClient.put(`/admin/users/${id}`, data),
  updateUserStatus: (id, status) => apiClient.patch(`/admin/users/${id}/status`, { status }),
  deleteUser: (id) => apiClient.delete(`/admin/users/${id}`),

  // User ↔ Family Member Linking
  linkMember: (userId, memberId, notes) =>
    apiClient.post(`/admin/users/${userId}/link-member/${memberId}`, notes ? { notes } : {}),
  unlinkMember: (userId) => apiClient.delete(`/admin/users/${userId}/link-member`),

  // Roles
  getRoles: () => apiClient.get('/admin/roles'),
  createRole: (data) => apiClient.post('/admin/roles', data),
  updateRole: (roleId, data) => apiClient.put(`/admin/roles/${roleId}`, data),
  deleteRole: (roleId) => apiClient.delete(`/admin/roles/${roleId}`),
  assignRole: (userId, roleId) => apiClient.post(`/admin/users/${userId}/roles`, { roleId }),
  removeRole: (userId, roleId) => apiClient.delete(`/admin/users/${userId}/roles/${roleId}`),
};
