import { useState } from 'react';
import { familyAPI } from '../api/family';
import { normalizeResponse, handleApiError } from '../utils/apiHelpers';

export function useDeleteMemberPhoto() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteMemberPhoto = async (id) => {
    try {
      setLoading(true);
      setError(null);
      const response = await familyAPI.deleteMemberPhoto(id);
      return normalizeResponse(response);
    } catch (err) {
      const errorMessage = handleApiError(err, 'Failed to delete profile photo');
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { deleteMemberPhoto, loading, error };
}
