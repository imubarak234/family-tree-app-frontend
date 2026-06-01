import apiClient from './client';

export const authAPI = {
  signup: (data) => apiClient.post('/auth/signup', data),
  verifySignup: (email, code) => apiClient.post('/auth/signup/verify', { email, code }),
  login: (credentials) => apiClient.post('/auth/login', credentials),
  confirmEmail: (token) => apiClient.post('/auth/confirm-email', { token }),
  resendConfirmation: (email) => apiClient.post(`/auth/resend-confirmation/${email}`),
  forgotPassword: (email) => apiClient.post('/auth/forgot-password', { email }),
  resetPassword: (data) => apiClient.post('/auth/reset-password', data),
  confirm2FA: (data) => apiClient.post('/auth/confirm-2fa', data),
  getProfile: () => apiClient.get('/auth/profile'),
  getMemberships: () => apiClient.get('/auth/memberships'),
  switchFamily: (familyId) => apiClient.post('/auth/switch-family', { familyId }),
  switchGlobalMode: () => apiClient.post('/auth/switch-global-mode'),
  updateProfile: (data) => apiClient.put('/auth/profile', data),
  changePassword: (data) => apiClient.put('/auth/profile/password', data),
  logout: () => apiClient.post('/auth/logout'),
};
