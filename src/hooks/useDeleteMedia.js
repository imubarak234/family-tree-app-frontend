import { useState } from 'react';
import { mediaAPI } from '../api/media';
import { handleApiError } from '../utils/apiHelpers';

export function useDeleteMedia() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteMedia = async (id) => {
    try {
      setLoading(true);
      setError(null);
      await mediaAPI.deleteMedia(id);
      return true;
    } catch (err) {
      const errorMessage = handleApiError(err, 'Failed to delete media item');
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { deleteMedia, loading, error };
}
