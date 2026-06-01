const AUTH_SESSION_STORAGE_KEY = 'family-tree-auth-session:v1';
const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

const FAMILY_SCOPED_PATH_PATTERNS = [
  /^\/family(\/|$)/,
  /^\/events(\/|$)/,
  /^\/news(\/|$)/,
  /^\/media(\/|$)/,
  /^\/timeline(\/|$)/,
  /^\/comments(\/|$)/,
  /^\/reactions(\/|$)/,
];

export function decodeJwtClaims(token) {
  if (!token || typeof token !== 'string') return null;

  const parts = token.split('.');
  if (parts.length < 2) return null;

  try {
    const payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = payload.padEnd(Math.ceil(payload.length / 4) * 4, '=');
    const parsed = JSON.parse(atob(padded));
    return parsed && typeof parsed === 'object' ? parsed : null;
  } catch {
    return null;
  }
}

export function isFamilyScopedPath(pathname = '') {
  const normalizedPath = String(pathname || '').split('?')[0];
  return FAMILY_SCOPED_PATH_PATTERNS.some((pattern) => pattern.test(normalizedPath));
}

function readStoredAuthSessionFromStorage(storage) {
  try {
    const raw = storage.getItem(AUTH_SESSION_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : null;
  } catch {
    return null;
  }
}

export function readStoredAuthSession() {
  return readStoredAuthSessionFromStorage(window.sessionStorage) || readStoredAuthSessionFromStorage(window.localStorage);
}

export function writeStoredAuthSession(session) {
  const serialized = JSON.stringify(session);
  window.localStorage.setItem(AUTH_SESSION_STORAGE_KEY, serialized);
  window.sessionStorage.setItem(AUTH_SESSION_STORAGE_KEY, serialized);
}

export function clearStoredAuthSession() {
  window.localStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
  window.sessionStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  window.localStorage.removeItem(REFRESH_TOKEN_KEY);
  window.sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  window.sessionStorage.removeItem(REFRESH_TOKEN_KEY);
}

export function writeStoredTokens(tokens = {}) {
  if (tokens.accessToken) {
    window.localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
    window.sessionStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
  }

  if (tokens.refreshToken) {
    window.localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
    window.sessionStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
  }
}

export function readStoredTokens() {
  return {
    accessToken: window.sessionStorage.getItem(ACCESS_TOKEN_KEY) || window.localStorage.getItem(ACCESS_TOKEN_KEY),
    refreshToken: window.sessionStorage.getItem(REFRESH_TOKEN_KEY) || window.localStorage.getItem(REFRESH_TOKEN_KEY),
  };
}

export function buildAuthSession({
  user = null,
  memberships = [],
  accessToken = null,
  refreshToken = null,
  activeFamilyId = null,
  activeFamilyName = null,
  isGlobalAdmin = false,
  globalAccess = false,
  globalModeEnabled = false,
  contextStatus = 'ready',
} = {}) {
  const claims = decodeJwtClaims(accessToken);
  const claimFamilyId = claims?.familyId ?? null;
  const claimIsGlobalAdmin = Boolean(claims?.isGlobalAdmin);
  const claimGlobalAccess = Boolean(claims?.globalAccess);

  return {
    user,
    memberships,
    accessToken,
    refreshToken,
    activeFamilyId: activeFamilyId ?? claimFamilyId,
    activeFamilyName,
    isGlobalAdmin: Boolean(isGlobalAdmin || claimIsGlobalAdmin),
    globalAccess: Boolean(globalAccess || claimGlobalAccess),
    globalModeEnabled: Boolean(globalModeEnabled),
    contextStatus,
    claims,
  };
}

export function normalizeStoredAuthSession(session = {}) {
  return buildAuthSession({
    user: session.user ?? null,
    memberships: Array.isArray(session.memberships) ? session.memberships : [],
    accessToken: session.accessToken ?? null,
    refreshToken: session.refreshToken ?? null,
    activeFamilyId: session.activeFamilyId ?? null,
    activeFamilyName: session.activeFamilyName ?? null,
    isGlobalAdmin: session.isGlobalAdmin ?? false,
    globalAccess: session.globalAccess ?? false,
    globalModeEnabled: session.globalModeEnabled ?? false,
    contextStatus: session.contextStatus ?? 'ready',
  });
}

export function getApiErrorCode(error) {
  return (
    error?.response?.data?.code ||
    error?.response?.data?.error?.code ||
    error?.response?.data?.errorCode ||
    error?.code ||
    null
  );
}

export function isMissingFamilyContextError(error) {
  return error?.response?.status === 400 && getApiErrorCode(error) === 'MissingFamilyContext';
}

export function isInvalidTokenError(error) {
  const status = error?.response?.status;
  const code = getApiErrorCode(error);
  return status === 401 || code === 'InvalidToken' || code === 'Unauthorized';
}

export function isForbiddenError(error) {
  const status = error?.response?.status;
  const code = getApiErrorCode(error);
  return status === 403 || code === 'Forbidden';
}

export function getMissingContextRedirectState() {
  return { contextRecovery: true };
}
