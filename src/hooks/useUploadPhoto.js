import { useState } from 'react';
import { mediaAPI } from '../api/media';
import { normalizeResponse, handleApiError } from '../utils/apiHelpers';

export function useUploadPhoto() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const uploadPhoto = async (formData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await mediaAPI.uploadPhoto(formData);
      return normalizeResponse(response);
    } catch (err) {
      const errorMessage = handleApiError(err, 'Failed to upload photo');
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { uploadPhoto, loading, error };
}
