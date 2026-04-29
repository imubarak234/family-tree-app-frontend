import { useState } from 'react';
import { mediaAPI } from '../api/media';
import { normalizeResponse, handleApiError } from '../utils/apiHelpers';

export function useAddPhotoTag() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addPhotoTag = async (photoId, familyMemberId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await mediaAPI.addPhotoTag(photoId, familyMemberId);
      return normalizeResponse(response);
    } catch (err) {
      // Preserve the original API error message for duplicate-tag 400 response
      const errorMessage = handleApiError(err, 'Failed to add tag');
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { addPhotoTag, loading, error };
}
