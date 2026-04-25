import { useState, useEffect } from 'react';
import { familyAPI } from '../api/family';
import { normalizeResponse, handleApiError } from '../utils/apiHelpers';

export function useBirthdaysToday() {
  const [birthdays, setBirthdays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBirthdays = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await familyAPI.getBirthdaysToday();
      const data = normalizeResponse(response);
      setBirthdays(data || []);
    } catch (err) {
      const errorMessage = handleApiError(err, 'Failed to fetch today\'s birthdays');
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBirthdays();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { birthdays, loading, error, refetch: fetchBirthdays };
}
