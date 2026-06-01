import { useCallback, useEffect, useState } from 'react';
import { adminBillingAPI } from '../api/adminBilling';
import { normalizeResponse } from '../utils/apiHelpers';
import { mapBillingError } from '../utils/billing';

export function useAdminBillingSubscriptions(initialFilters = {}) {
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 0 });
  const [filters, setFilters] = useState({ page: 1, limit: 20, ...initialFilters });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchSubscriptions = useCallback(async (nextFilters = null) => {
    try {
      const params = nextFilters || filters;
      setLoading(true);
      setError('');
      const response = await adminBillingAPI.getSubscriptions(params);
      const payload = normalizeResponse(response);
      setItems(Array.isArray(payload?.items) ? payload.items : []);
      setPagination(payload?.pagination || { page: params.page || 1, limit: params.limit || 20, total: 0, pages: 0 });
    } catch (err) {
      setError(mapBillingError(err, 'Failed to load subscriptions.'));
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const updateFilters = useCallback((patch) => {
    setFilters((prev) => ({ ...prev, ...patch }));
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      fetchSubscriptions(filters);
    });
  }, [filters, fetchSubscriptions]);

  return {
    items,
    pagination,
    filters,
    loading,
    error,
    fetchSubscriptions,
    updateFilters,
  };
}
