import { useState, useEffect } from 'react';
import { familyAPI } from '../api/family';
import { normalizeResponse, handleApiError } from '../utils/apiHelpers';

export function useRelationships(memberId) {
  const [relationships, setRelationships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRelationships = async () => {
    if (!memberId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await familyAPI.getRelationships(memberId);
      const normalizedData = normalizeResponse(response);
      setRelationships(normalizedData || []);
    } catch (err) {
      const errorMessage = handleApiError(err, 'Failed to fetch relationships');
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRelationships();
  }, [memberId]);

  return { relationships, loading, error, refetch: fetchRelationships };
}
