import { useState, useEffect, useCallback, useMemo } from 'react';
import { timelineAPI } from '../../api/timeline';
import { normalizeResponse, handleApiError } from '../../utils/apiHelpers';
import { normalizeTimelineQueryParams } from '../../utils/social/queryParams';

export function useTimeline(filters = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const filtersKey = useMemo(() => JSON.stringify(normalizeTimelineQueryParams(filters)), [filters]);

  const fetchTimeline = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await timelineAPI.list(JSON.parse(filtersKey));
      setData(normalizeResponse(response));
    } catch (err) {
      setError(handleApiError(err, 'Failed to fetch timeline'));
    } finally {
      setLoading(false);
    }
  }, [filtersKey]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchTimeline();
  }, [fetchTimeline]);

  return { data, loading, error, refetch: fetchTimeline };
}
