import { useState } from 'react';
import { familyAPI } from '../api/family';

export function useDeleteMember() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteMember = async (id) => {
    try {
      setLoading(true);
      setError(null);
      await familyAPI.deleteMember(id);
      return true;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to delete member';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { deleteMember, loading, error };
}
