import { useState, useEffect, useMemo, useCallback } from 'react';
import { familyAPI } from '../api/family';
import { normalizeResponse, handleApiError } from '../utils/apiHelpers';
import { registerFamilyScopedCacheClearer } from '../utils/cacheRegistry';

const membersCache = new Map();

registerFamilyScopedCacheClearer(() => membersCache.clear());

function buildCacheKey(filters = {}) {
  return JSON.stringify(
    Object.entries(filters)
      .filter(([, value]) => value !== '' && value !== null && value !== undefined)
      .sort(([a], [b]) => a.localeCompare(b)),
  );
}

export function useMembers(filters = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const filterKey = useMemo(() => buildCacheKey(filters), [filters]);

  const fetchMembers = useCallback(async () => {
    const cached = membersCache.get(filterKey);

    if (cached) {
      setData(cached);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await familyAPI.getMembersAdvanced(filters);

      const normalizedData = normalizeResponse(response);
      setData(normalizedData);
      membersCache.set(filterKey, normalizedData);
    } catch (err) {
      const errorMessage = handleApiError(err, 'Failed to fetch members');
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [filterKey, filters]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchMembers();
  }, [fetchMembers]);

  return { data, loading, error, refetch: fetchMembers };
}
