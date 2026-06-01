import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { adminBillingAPI } from '../../api/adminBilling';
import { mapBillingError } from '../../utils/billing';

export default function BillingActionsPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleExpireOverdue = async () => {
    try {
      setLoading(true);
      setError('');
      setMessage('');
      const response = await adminBillingAPI.expireOverdueSubscriptions();
      const payload = response.data?.data || response.data;
      setMessage(payload?.message || 'Overdue subscriptions processed');
    } catch (err) {
      setError(mapBillingError(err, 'Failed to process overdue subscriptions.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Billing Actions</h1>
          <p className="text-gray-600 mt-1">Run maintenance actions for billing operations.</p>
        </div>

        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Expire overdue subscriptions</h2>
              <p className="text-sm text-gray-600 mt-1">
                Triggers backend processing for overdue subscriptions and expires any that qualify.
              </p>
              <button
                type="button"
                onClick={handleExpireOverdue}
                disabled={loading}
                className="mt-4 px-4 py-2 rounded-lg text-sm font-medium bg-amber-600 text-white hover:bg-amber-700 disabled:bg-gray-200 disabled:text-gray-500"
              >
                {loading ? 'Processing...' : 'Run expire-overdue'}
              </button>
            </div>
          </div>

          {error && <p className="mt-3 text-sm text-red-700">{error}</p>}
          {message && <p className="mt-3 text-sm text-green-700">{message}</p>}
        </section>
      </div>
    </div>
  );
}
