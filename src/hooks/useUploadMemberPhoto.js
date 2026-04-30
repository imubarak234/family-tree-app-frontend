import { useState } from 'react';
import { familyAPI } from '../api/family';
import { normalizeResponse, handleApiError } from '../utils/apiHelpers';

export function useUploadMemberPhoto() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const uploadMemberPhoto = async (id, file) => {
    try {
      setLoading(true);
      setError(null);

      const formData = new FormData();
      formData.append('photo', file);

      const response = await familyAPI.uploadMemberPhoto(id, formData);
      return normalizeResponse(response);
    } catch (err) {
      const errorMessage = handleApiError(err, 'Failed to upload profile photo');
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { uploadMemberPhoto, loading, error };
}
