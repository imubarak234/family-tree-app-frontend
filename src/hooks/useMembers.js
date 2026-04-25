import { useState, useEffect } from 'react';
import { familyAPI } from '../api/family';
import { normalizeResponse, handleApiError } from '../utils/apiHelpers';

export function useMembers(filters = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await familyAPI.getMembers(filters);

      const normalizedData = normalizeResponse(response);
      setData(normalizedData);
    } catch (err) {
      const errorMessage = handleApiError(err, 'Failed to fetch members');
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [JSON.stringify(filters)]); // Re-fetch when filters change

  return { data, loading, error, refetch: fetchMembers };
}
