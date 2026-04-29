import { useState } from 'react';
import { mediaAPI } from '../api/media';
import { normalizeResponse, handleApiError } from '../utils/apiHelpers';

export function useUpdateMedia() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateMedia = async (id, data) => {
    try {
      setLoading(true);
      setError(null);
      const response = await mediaAPI.updateMedia(id, data);
      return normalizeResponse(response);
    } catch (err) {
      const errorMessage = handleApiError(err, 'Failed to update media item');
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { updateMedia, loading, error };
}
