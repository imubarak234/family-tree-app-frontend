import { useCallback, useEffect, useState } from 'react';
import { adminBillingAPI } from '../api/adminBilling';
import { normalizeResponse } from '../utils/apiHelpers';
import { mapBillingError } from '../utils/billing';

export function useAdminBillingPlans() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPlans = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const response = await adminBillingAPI.getPlans();
      const payload = normalizeResponse(response);
      setPlans(Array.isArray(payload?.plans) ? payload.plans : []);
    } catch (err) {
      setError(mapBillingError(err, 'Failed to load billing plans.'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      fetchPlans();
    });
  }, [fetchPlans]);

  return {
    plans,
    loading,
    error,
    fetchPlans,
  };
}
