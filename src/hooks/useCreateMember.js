import { useState } from 'react';
import { familyAPI } from '../api/family';

export function useCreateMember() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createMember = async (data) => {
    try {
      setLoading(true);
      setError(null);
      const response = await familyAPI.createMember(data);
      return response.data.data; // Return created member
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to create member';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { createMember, loading, error };
}
