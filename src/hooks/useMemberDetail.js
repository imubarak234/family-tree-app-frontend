import { useState, useEffect } from 'react';
import { familyAPI } from '../api/family';

export function useMemberDetail(id) {
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMember = async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);
      const response = await familyAPI.getMember(id);
      setMember(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch member');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMember();
  }, [id]);

  return { member, loading, error, refetch: fetchMember };
}
