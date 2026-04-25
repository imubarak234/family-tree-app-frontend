import { useState } from 'react';
import { familyAPI } from '../api/family';
import { normalizeResponse, handleApiError } from '../utils/apiHelpers';

export function useCreateRelationship() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createRelationship = async (type, data) => {
    try {
      setLoading(true);
      setError(null);

      let response;
      if (type === 'parent-child') {
        response = await familyAPI.createParentChild(data);
      } else if (type === 'spouse') {
        response = await familyAPI.createSpouse(data);
      } else {
        response = await familyAPI.createRelationship(data);
      }

      const normalizedData = normalizeResponse(response);
      return normalizedData;
    } catch (err) {
      const errorMessage = handleApiError(err, 'Failed to create relationship');
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { createRelationship, loading, error };
}
