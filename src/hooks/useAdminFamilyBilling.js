import { useCallback, useState } from 'react';
import { adminBillingAPI } from '../api/adminBilling';
import { normalizeResponse } from '../utils/apiHelpers';
import { mapBillingError } from '../utils/billing';

export function useAdminFamilyBilling() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchSummary = useCallback(async (familyId) => {
    if (!familyId) {
      setSummary(null);
      return null;
    }

    try {
      setLoading(true);
      setError('');
      const response = await adminBillingAPI.getFamilySummary(familyId);
      const payload = normalizeResponse(response);
      setSummary(payload);
      return payload;
    } catch (err) {
      setError(mapBillingError(err, 'Failed to load family billing summary.'));
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    summary,
    loading,
    error,
    fetchSummary,
  };
}
