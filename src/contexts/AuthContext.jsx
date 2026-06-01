import { createContext, useEffect, useMemo, useState } from 'react';
import { authAPI } from '../api/auth';
import { handleApiError } from '../utils/apiHelpers';
import {
  buildAuthSession,
  clearStoredAuthSession,
  decodeJwtClaims,
  normalizeStoredAuthSession,
  readStoredAuthSession,
  writeStoredAuthSession,
  writeStoredTokens,
} from '../utils/authSession';
import { clearFamilyScopedCaches } from '../utils/cacheRegistry';

export const AuthContext = createContext(null);

function normalizeMembershipList(value) {
  return Array.isArray(value) ? value : [];
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [memberships, setMemberships] = useState([]);
  const [activeFamilyId, setActiveFamilyId] = useState(null);
  const [activeFamilyName, setActiveFamilyName] = useState(null);
  const [isGlobalAdmin, setIsGlobalAdmin] = useState(false);
  const [globalAccess, setGlobalAccess] = useState(false);
  const [globalModeEnabled, setGlobalModeEnabled] = useState(false);
  const [contextStatus, setContextStatus] = useState('ready');

  const syncSession = (nextSession) => {
    const normalized = normalizeStoredAuthSession(nextSession);

    setUser(normalized.user);
    setMemberships(normalized.memberships);
    setActiveFamilyId(normalized.activeFamilyId);
    setActiveFamilyName(normalized.activeFamilyName);
    setIsGlobalAdmin(normalized.isGlobalAdmin);
    setGlobalAccess(normalized.globalAccess);
    setGlobalModeEnabled(normalized.globalModeEnabled);
    setContextStatus(normalized.contextStatus);
    setIsAuthenticated(Boolean(normalized.accessToken));

    if (normalized.accessToken || normalized.refreshToken) {
      writeStoredTokens({ accessToken: normalized.accessToken, refreshToken: normalized.refreshToken });
    }

    writeStoredAuthSession(normalized);
    return normalized;
  };

  const loadProfileAndMemberships = async () => {
    const [profileResult, membershipsResult] = await Promise.allSettled([
      authAPI.getProfile(),
      authAPI.getMemberships(),
    ]);

    const profile = profileResult.status === 'fulfilled' ? profileResult.value.data?.data : null;
    const membershipList = membershipsResult.status === 'fulfilled' ? membershipsResult.value.data?.data : [];

    return {
      profile,
      memberships: normalizeMembershipList(membershipList),
    };
  };

  const hydrateSession = async ({ accessToken, refreshToken, fallbackSession = null, contextStatus: nextStatus = 'ready' }) => {
    const claims = decodeJwtClaims(accessToken) || fallbackSession?.claims || null;
    const bootstrapSession = buildAuthSession({
      user: fallbackSession?.user ?? null,
      memberships: fallbackSession?.memberships ?? [],
      accessToken,
      refreshToken,
      activeFamilyId: fallbackSession?.activeFamilyId ?? claims?.familyId ?? null,
      activeFamilyName: fallbackSession?.activeFamilyName ?? null,
      isGlobalAdmin: fallbackSession?.isGlobalAdmin ?? Boolean(claims?.isGlobalAdmin),
      globalAccess: fallbackSession?.globalAccess ?? Boolean(claims?.globalAccess),
      globalModeEnabled: fallbackSession?.globalModeEnabled ?? false,
      contextStatus: nextStatus,
    });

    syncSession(bootstrapSession);

    try {
      const { profile, memberships: membershipList } = await loadProfileAndMemberships();
      const nextFamilyId = profile?.activeFamilyId ?? profile?.familyId ?? bootstrapSession.activeFamilyId;
      const nextFamilyName = profile?.activeFamilyName ?? profile?.familyName ?? bootstrapSession.activeFamilyName ?? null;
      const nextGlobalMode = Boolean(profile?.globalModeEnabled ?? bootstrapSession.globalModeEnabled);

      syncSession({
        ...bootstrapSession,
        user: profile || bootstrapSession.user,
        memberships: membershipList.length > 0 ? membershipList : bootstrapSession.memberships,
        activeFamilyId: nextFamilyId,
        activeFamilyName: nextFamilyName,
        globalModeEnabled: nextGlobalMode,
        contextStatus: nextFamilyId || nextGlobalMode || bootstrapSession.globalAccess ? 'ready' : 'missing-family-context',
      });
    } catch (error) {
      const message = handleApiError(error, 'Failed to restore session');

      if (message === 'Your session has expired. Please log in again.') {
        clearStoredAuthSession();
        clearFamilyScopedCaches();
        setUser(null);
        setMemberships([]);
        setActiveFamilyId(null);
        setActiveFamilyName(null);
        setIsGlobalAdmin(false);
        setGlobalAccess(false);
        setGlobalModeEnabled(false);
        setContextStatus('invalid-token');
        setIsAuthenticated(false);
        return;
      }

      syncSession({
        ...bootstrapSession,
        contextStatus: 'missing-family-context',
      });
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const session = readStoredAuthSession();
    const accessToken = session?.accessToken || window.localStorage.getItem('accessToken');
    const refreshToken = session?.refreshToken || window.localStorage.getItem('refreshToken');

    if (!accessToken) {
      queueMicrotask(() => setLoading(false));
      return undefined;
    }

    hydrateSession({ accessToken, refreshToken, fallbackSession: session })
      .finally(() => queueMicrotask(() => setLoading(false)));

    const handleMissingFamilyContext = () => {
      setContextStatus('missing-family-context');
      clearFamilyScopedCaches();
    };

    const handleInvalidToken = () => {
      clearStoredAuthSession();
      clearFamilyScopedCaches();
      setUser(null);
      setMemberships([]);
      setActiveFamilyId(null);
      setActiveFamilyName(null);
      setIsGlobalAdmin(false);
      setGlobalAccess(false);
      setGlobalModeEnabled(false);
      setContextStatus('invalid-token');
      setIsAuthenticated(false);
    };

    window.addEventListener('family-context:missing', handleMissingFamilyContext);
    window.addEventListener('auth:invalid-token', handleInvalidToken);

    return () => {
      window.removeEventListener('family-context:missing', handleMissingFamilyContext);
      window.removeEventListener('auth:invalid-token', handleInvalidToken);
    };
  }, []);

  useEffect(() => {
    if (loading) return;

    const currentSession = normalizeStoredAuthSession({
      user,
      memberships,
      accessToken: window.localStorage.getItem('accessToken'),
      refreshToken: window.localStorage.getItem('refreshToken'),
      activeFamilyId,
      activeFamilyName,
      isGlobalAdmin,
      globalAccess,
      globalModeEnabled,
      contextStatus,
    });

    writeStoredAuthSession(currentSession);
  }, [user, memberships, activeFamilyId, activeFamilyName, isGlobalAdmin, globalAccess, globalModeEnabled, contextStatus, loading]);

  const applyAuthResponse = async (response, { requireMemberships = true } = {}) => {
    const payload = response.data?.data || response.data || {};
    const userData = payload.user || user;
    const tokens = payload.tokens || {};

    if (tokens.accessToken || tokens.refreshToken) {
      writeStoredTokens(tokens);
    }

    const nextSession = buildAuthSession({
      user: userData,
      memberships: Array.isArray(payload.memberships) ? payload.memberships : memberships,
      accessToken: tokens.accessToken || window.localStorage.getItem('accessToken'),
      refreshToken: tokens.refreshToken || window.localStorage.getItem('refreshToken'),
      activeFamilyId: payload.activeFamilyId ?? activeFamilyId,
      activeFamilyName: payload.activeFamilyName ?? activeFamilyName,
      isGlobalAdmin: payload.isGlobalAdmin ?? isGlobalAdmin,
      globalAccess: payload.globalAccess ?? globalAccess,
      globalModeEnabled: payload.globalModeEnabled ?? globalModeEnabled,
      contextStatus: payload.activeFamilyId || payload.globalModeEnabled || payload.globalAccess ? 'ready' : contextStatus,
    });

    syncSession(nextSession);

    if (requireMemberships && !Array.isArray(payload.memberships)) {
      try {
        const membershipsResponse = await authAPI.getMemberships();
        const membershipList = membershipsResponse.data?.data || membershipsResponse.data || [];
        syncSession(normalizeStoredAuthSession({
          ...nextSession,
          memberships: normalizeMembershipList(membershipList),
        }));
      } catch {
        // Memberships are optional for bootstrap if the backend does not expose them immediately.
      }
    }

    return nextSession;
  };

  const login = async (credentials) => {
    const response = await authAPI.login(credentials);

    if (response.data.require2FA) {
      return { require2FA: true };
    }

    await applyAuthResponse(response);
    return { require2FA: false };
  };

  const confirm2FA = async (data) => {
    const response = await authAPI.confirm2FA(data);
    await applyAuthResponse(response);
  };

  const switchFamily = async (familyId) => {
    const response = await authAPI.switchFamily(familyId);
    clearFamilyScopedCaches();
    return applyAuthResponse(response, { requireMemberships: false });
  };

  const switchGlobalMode = async () => {
    const response = await authAPI.switchGlobalMode();
    clearFamilyScopedCaches();
    return applyAuthResponse(response, { requireMemberships: false });
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearStoredAuthSession();
      clearFamilyScopedCaches();
      setUser(null);
      setMemberships([]);
      setActiveFamilyId(null);
      setActiveFamilyName(null);
      setIsGlobalAdmin(false);
      setGlobalAccess(false);
      setGlobalModeEnabled(false);
      setContextStatus('ready');
      setIsAuthenticated(false);
    }
  };

  const updateUser = (userData) => {
    setUser((prev) => ({ ...prev, ...userData }));
  };

  const activeMembership = useMemo(
    () => memberships.find((membership) => membership.id === activeFamilyId || membership.familyId === activeFamilyId) || null,
    [memberships, activeFamilyId],
  );

  const value = {
    user,
    isAuthenticated,
    loading,
    memberships,
    activeMembership,
    activeFamilyId,
    activeFamilyName,
    isGlobalAdmin,
    globalAccess,
    globalModeEnabled,
    contextStatus,
    login,
    confirm2FA,
    switchFamily,
    switchGlobalMode,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}