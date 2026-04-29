import { useState } from 'react';
import { mediaAPI } from '../api/media';
import { normalizeResponse, handleApiError } from '../utils/apiHelpers';

export function useUploadDocument() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const uploadDocument = async (formData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await mediaAPI.uploadDocument(formData);
      return normalizeResponse(response);
    } catch (err) {
      const errorMessage = handleApiError(err, 'Failed to upload document');
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { uploadDocument, loading, error };
}
