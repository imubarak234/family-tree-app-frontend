import { useState, useEffect } from 'react';
import { familyAPI } from '../api/family';
import { normalizeResponse, handleApiError } from '../utils/apiHelpers';

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
      const normalizedData = normalizeResponse(response);
      setMember(normalizedData);
    } catch (err) {
      const errorMessage = handleApiError(err, 'Failed to fetch member');
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMember();
  }, [id]);

  return { member, loading, error, refetch: fetchMember };
}
