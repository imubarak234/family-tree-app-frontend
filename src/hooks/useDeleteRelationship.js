import { useState } from 'react';
import { familyAPI } from '../api/family';
import { handleApiError } from '../utils/apiHelpers';

export function useDeleteRelationship() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteRelationship = async (id) => {
    try {
      setLoading(true);
      setError(null);
      await familyAPI.deleteRelationship(id);
      return true;
    } catch (err) {
      const errorMessage = handleApiError(err, 'Failed to delete relationship');
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { deleteRelationship, loading, error };
}
