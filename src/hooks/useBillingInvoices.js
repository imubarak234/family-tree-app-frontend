import { useCallback, useEffect, useState } from 'react';
import { billingAPI } from '../api/billing';
import { normalizeResponse } from '../utils/apiHelpers';
import { mapBillingError } from '../utils/billing';

export function useBillingInvoices(initialLimit = 20) {
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: initialLimit, total: 0, pages: 0 });
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const [loading, setLoading] = useState(true);
  const [loadingInvoice, setLoadingInvoice] = useState(false);
  const [error, setError] = useState('');
  const [invoiceError, setInvoiceError] = useState('');

  const fetchInvoices = useCallback(async (nextPage = 1, nextLimit = initialLimit) => {
    try {
      setLoading(true);
      setError('');
      const response = await billingAPI.getInvoices({ page: nextPage, limit: nextLimit });
      const payload = normalizeResponse(response);

      setItems(Array.isArray(payload?.items) ? payload.items : []);
      setPagination(payload?.pagination || { page: nextPage, limit: nextLimit, total: 0, pages: 0 });
    } catch (err) {
      setError(mapBillingError(err, 'Failed to load invoices.'));
    } finally {
      setLoading(false);
    }
  }, [initialLimit]);

  useEffect(() => {
    queueMicrotask(() => {
      fetchInvoices();
    });
  }, [fetchInvoices]);

  const fetchInvoice = useCallback(async (invoiceId) => {
    if (!invoiceId) return null;

    try {
      setLoadingInvoice(true);
      setInvoiceError('');
      const response = await billingAPI.getInvoiceById(invoiceId);
      const payload = normalizeResponse(response);
      const invoice = payload?.invoice || null;
      setSelectedInvoice(invoice);
      return invoice;
    } catch (err) {
      setInvoiceError(mapBillingError(err, 'Failed to load invoice details.'));
      return null;
    } finally {
      setLoadingInvoice(false);
    }
  }, []);

  return {
    items,
    pagination,
    selectedInvoice,
    loading,
    loadingInvoice,
    error,
    invoiceError,
    fetchInvoices,
    fetchInvoice,
    setSelectedInvoice,
  };
}
