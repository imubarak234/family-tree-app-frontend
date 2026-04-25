import { useState, useEffect } from 'react';
import { familyAPI } from '../api/family';
import { normalizeResponse, handleApiError } from '../utils/apiHelpers';

export function useBirthdaysByMonth(month) {
  const [birthdays, setBirthdays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBirthdays = async () => {
    if (!month) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await familyAPI.getBirthdaysByMonth(month);
      const data = normalizeResponse(response);
      setBirthdays(data || []);
    } catch (err) {
      const errorMessage = handleApiError(err, 'Failed to fetch birthdays for this month');
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBirthdays();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [month]);

  return { birthdays, loading, error, refetch: fetchBirthdays };
}
