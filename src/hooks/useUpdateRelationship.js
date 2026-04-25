import { useState } from 'react';
import { familyAPI } from '../api/family';
import { normalizeResponse, handleApiError } from '../utils/apiHelpers';

export function useUpdateRelationship() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateRelationship = async (id, data) => {
    try {
      setLoading(true);
      setError(null);
      const response = await familyAPI.updateRelationship(id, data);
      const normalizedData = normalizeResponse(response);
      return normalizedData;
    } catch (err) {
      const errorMessage = handleApiError(err, 'Failed to update relationship');
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { updateRelationship, loading, error };
}
