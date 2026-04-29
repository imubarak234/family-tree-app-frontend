import { useState } from 'react';
import { mediaAPI } from '../api/media';
import { handleApiError } from '../utils/apiHelpers';

export function useRemovePhotoTag() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const removePhotoTag = async (photoId, tagId) => {
    try {
      setLoading(true);
      setError(null);
      await mediaAPI.removePhotoTag(photoId, tagId);
      return true;
    } catch (err) {
      const errorMessage = handleApiError(err, 'Failed to remove tag');
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { removePhotoTag, loading, error };
}
