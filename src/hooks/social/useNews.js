import { useState, useEffect, useCallback, useMemo } from 'react';
import { newsAPI } from '../../api/news';
import { normalizeResponse, handleApiError } from '../../utils/apiHelpers';
import { normalizeNewsQueryParams } from '../../utils/social/queryParams';

export function useNews(filters = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const filtersKey = useMemo(() => JSON.stringify(normalizeNewsQueryParams(filters)), [filters]);

  const fetchNews = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await newsAPI.list(JSON.parse(filtersKey));
      setData(normalizeResponse(response));
    } catch (err) {
      setError(handleApiError(err, 'Failed to fetch news'));
    } finally {
      setLoading(false);
    }
  }, [filtersKey]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchNews();
  }, [fetchNews]);

  return { data, loading, error, refetch: fetchNews };
}

export function useNewsDetail(id) {
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
      const response = await newsAPI.getById(id);
      setData(normalizeResponse(response));
    } catch (err) {
      setError(handleApiError(err, 'Failed to fetch news detail'));
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
