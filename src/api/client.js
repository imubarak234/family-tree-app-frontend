import axios from 'axios';
import {
  clearStoredAuthSession,
  isFamilyScopedPath,
  isMissingFamilyContextError,
  readStoredAuthSession,
  writeStoredTokens,
} from '../utils/authSession.js';
import { clearFamilyScopedCaches } from '../utils/cacheRegistry.js';

const apiClient = axios.create({
  baseURL: import.meta.env?.VITE_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Add auth token
apiClient.interceptors.request.use(
  (config) => {
    const session = readStoredAuthSession();
    const token = session?.accessToken || window.localStorage.getItem('accessToken');

    if (config.url && isFamilyScopedPath(config.url)) {
      const activeFamilyId = session?.activeFamilyId ?? null;
      const canUseGlobalMode = Boolean(session?.isGlobalAdmin && session?.globalModeEnabled && session?.globalAccess);

      if (!activeFamilyId && !canUseGlobalMode) {
        const missingContextError = new Error('Missing family context');
        missingContextError.code = 'MissingFamilyContext';
        missingContextError.isFamilyContextError = true;
        window.dispatchEvent(new CustomEvent('family-context:missing', {
          detail: { code: 'MissingFamilyContext', path: config.url },
        }));
        return Promise.reject(missingContextError);
      }
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Handle 401, refresh token
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const errorCode = error?.response?.data?.code || error?.response?.data?.error?.code || error?.response?.data?.errorCode;

    if (isMissingFamilyContextError(error)) {
      window.dispatchEvent(new CustomEvent('family-context:missing', {
        detail: { code: 'MissingFamilyContext', path: originalRequest?.url },
      }));
      return Promise.reject(error);
    }

    if (errorCode === 'InvalidToken' || errorCode === 'Unauthorized') {
      clearStoredAuthSession();
      clearFamilyScopedCaches();
      window.dispatchEvent(new CustomEvent('auth:invalid-token', { detail: { path: originalRequest?.url } }));
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = readStoredAuthSession()?.refreshToken || window.localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const { data } = await axios.post(
            `${import.meta.env?.VITE_API_BASE_URL || '/api'}/auth/refresh-token`,
            { refreshToken }
          );

          writeStoredTokens({
            accessToken: data.data.accessToken,
            refreshToken: data.data.refreshToken || refreshToken,
          });
          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`;
          return apiClient(originalRequest);
        } catch (refreshError) {
          // Refresh failed, logout user
          clearStoredAuthSession();
          clearFamilyScopedCaches();
          window.dispatchEvent(new CustomEvent('auth:invalid-token', { detail: { path: originalRequest?.url } }));
          return Promise.reject(refreshError);
        }
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
