import { useState, useEffect } from 'react';
import { familyAPI } from '../api/family';
import { normalizeResponse, handleApiError } from '../utils/apiHelpers';

export function useStatistics() {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await familyAPI.getStatistics();
      const data = normalizeResponse(response);
      setStatistics(data);
    } catch (err) {
      const errorMessage = handleApiError(err, 'Failed to fetch statistics');
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatistics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { statistics, loading, error, refetch: fetchStatistics };
}
