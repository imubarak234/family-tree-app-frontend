import { useState } from 'react';
import { familyAPI } from '../api/family';

export function useUpdateMember() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateMember = async (id, data) => {
    try {
      setLoading(true);
      setError(null);
      const response = await familyAPI.updateMember(id, data);
      return response.data.data; // Return updated member
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to update member';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { updateMember, loading, error };
}
