import { useState, useEffect } from 'react';
import { familyAPI } from '../api/family';

export function useMembers(filters = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await familyAPI.getMembers(filters);
      setData(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch members');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [JSON.stringify(filters)]); // Re-fetch when filters change

  return { data, loading, error, refetch: fetchMembers };
}
