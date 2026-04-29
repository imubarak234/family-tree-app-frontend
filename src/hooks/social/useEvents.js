import { useState, useEffect, useCallback, useMemo } from 'react';
import { eventsAPI } from '../../api/events';
import { normalizeResponse, handleApiError } from '../../utils/apiHelpers';
import { normalizeEventsQueryParams } from '../../utils/social/queryParams';

export function useEvents(filters = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const filtersKey = useMemo(() => JSON.stringify(normalizeEventsQueryParams(filters)), [filters]);

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await eventsAPI.list(JSON.parse(filtersKey));
      setData(normalizeResponse(response));
    } catch (err) {
      setError(handleApiError(err, 'Failed to fetch events'));
    } finally {
      setLoading(false);
    }
  }, [filtersKey]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchEvents();
  }, [fetchEvents]);

  return { data, loading, error, refetch: fetchEvents };
}

export function useEventDetail(id) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchById = useCallback(async () => {
    if (!id) {
      setLoading(false);
      setData(null);
      setError(null);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const response = await eventsAPI.getById(id);
      setData(normalizeResponse(response));
    } catch (err) {
      setError(handleApiError(err, 'Failed to fetch event detail'));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchById();
  }, [fetchById]);

  return { data, loading, error, refetch: fetchById };
}
