import { useState, useEffect, useCallback } from 'react';
import { mediaAPI } from '../api/media';
import { normalizeResponse, handleApiError } from '../utils/apiHelpers';

export function useMediaItem(id) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMediaItem = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);
      const response = await mediaAPI.getMedia(id);
      const normalizedData = normalizeResponse(response);
      setData(normalizedData);
    } catch (err) {
      const errorMessage = handleApiError(err, 'Failed to fetch media item');
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchMediaItem();
  }, [fetchMediaItem]);

  return { data, loading, error, refetch: fetchMediaItem };
}
