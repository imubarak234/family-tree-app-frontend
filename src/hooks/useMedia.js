import { useState, useEffect, useCallback, useMemo } from 'react';
import { mediaAPI } from '../api/media';
import { normalizeResponse, handleApiError } from '../utils/apiHelpers';

export function useMedia(filters = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const filtersKey = useMemo(() => JSON.stringify(filters), [filters]);
  const parsedFilters = useMemo(() => JSON.parse(filtersKey), [filtersKey]);

  const fetchMedia = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await mediaAPI.listMedia(parsedFilters);
      const normalizedData = normalizeResponse(response);
      setData(normalizedData);
    } catch (err) {
      const errorMessage = handleApiError(err, 'Failed to fetch media');
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [parsedFilters]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchMedia();
  }, [fetchMedia]);

  return { data, loading, error, refetch: fetchMedia };
}
