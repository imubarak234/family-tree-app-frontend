import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { billingAPI } from '../../api/billing';
import { isFamilyOwner, mapBillingError } from '../../utils/billing';

export default function BillingCheckoutReturnPage() {
  const [params] = useSearchParams();
  const { activeMembership, user } = useAuth();

  const canManage = useMemo(() => isFamilyOwner(activeMembership, user), [activeMembership, user]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const planCode = params.get('planCode') || '';
  const reference = params.get('reference') || '';

  const handleConfirm = async () => {
    if (!planCode || !reference) {
      setError('Missing plan code or payment reference.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');
      await billingAPI.confirmCheckout(planCode, reference);
      setSuccess('Payment confirmed and subscription updated.');
    } catch (err) {
      setError(mapBillingError(err, 'Unable to confirm payment.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Checkout Confirmation</h1>
          <p className="text-gray-600 mt-2">Confirm your payment to activate the selected plan.</p>
        </div>

        <section className="rounded-xl border border-gray-200 bg-white p-6 space-y-4">
          <div>
            <p className="text-sm text-gray-500">Plan Code</p>
            <p className="font-medium text-gray-900">{planCode || '—'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Reference</p>
            <p className="font-medium text-gray-900 break-all">{reference || '—'}</p>
          </div>

          {!canManage && (
            <p className="text-sm text-amber-700">Only family owners can manage billing actions.</p>
          )}

          {error && (
            <p className="text-sm text-red-700">{error}</p>
          )}

          {success && (
            <p className="text-sm text-green-700">{success}</p>
          )}

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleConfirm}
              disabled={!canManage || loading || !planCode || !reference}
              className="px-5 py-2.5 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed"
            >
              {loading ? 'Confirming payment...' : 'Confirm Payment'}
            </button>

            <Link
              to="/billing"
              className="px-5 py-2.5 rounded-lg text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Back to Billing
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
