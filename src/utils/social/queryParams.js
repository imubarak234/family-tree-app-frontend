function trimString(value) {
  if (typeof value !== 'string') return value;
  const trimmed = value.trim();
  return trimmed.length ? trimmed : undefined;
}

function normalizeBoolean(value) {
  if (value === undefined || value === null || value === '') return undefined;
  if (typeof value === 'boolean') return value;
  if (value === 'true') return true;
  if (value === 'false') return false;
  return undefined;
}

function normalizeInt(value, fallback) {
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed) || parsed <= 0) return fallback;
  return parsed;
}

function normalizeIsoDate(value) {
  const v = trimString(value);
  if (!v) return undefined;
  const date = new Date(v);
  if (Number.isNaN(date.getTime())) return undefined;
  return date.toISOString();
}

export function normalizeNewsQueryParams(params = {}) {
  return {
    search: trimString(params.search),
    status: trimString(params.status),
    pinnedOnly: normalizeBoolean(params.pinnedOnly),
    page: normalizeInt(params.page, 1),
    limit: normalizeInt(params.limit, 20),
  };
}

export function normalizeEventsQueryParams(params = {}) {
  return {
    search: trimString(params.search),
    upcoming: normalizeBoolean(params.upcoming),
    past: normalizeBoolean(params.past),
    page: normalizeInt(params.page, 1),
    limit: normalizeInt(params.limit, 20),
  };
}

export function normalizeTimelineQueryParams(params = {}) {
  return {
    sourceType: trimString(params.sourceType),
    memberId: trimString(params.memberId),
    from: normalizeIsoDate(params.from),
    to: normalizeIsoDate(params.to),
    page: normalizeInt(params.page, 1),
    limit: normalizeInt(params.limit, 20),
  };
}
