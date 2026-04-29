import { useState, useEffect, useCallback } from 'react';
import { mediaAPI } from '../api/media';
import { normalizeResponse, handleApiError } from '../utils/apiHelpers';

export function usePhotoTags(photoId) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTags = useCallback(async () => {
    if (!photoId) return;
    try {
      setLoading(true);
      setError(null);
      const response = await mediaAPI.getPhotoTags(photoId);
      const normalizedData = normalizeResponse(response);
      setData(Array.isArray(normalizedData) ? normalizedData : []);
    } catch (err) {
      const errorMessage = handleApiError(err, 'Failed to fetch photo tags');
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [photoId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchTags();
  }, [fetchTags]);

  return { data, loading, error, refetch: fetchTags };
}
