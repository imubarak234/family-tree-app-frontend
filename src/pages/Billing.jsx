import { useAuth } from '../hooks/useAuth';
import BillingWorkspace from '../components/billing/BillingWorkspace';

export default function BillingPage() {
  const { contextStatus } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Billing</h1>
          <p className="text-gray-600 mt-2">Manage plans, subscription status, and invoices.</p>
        </div>

        {contextStatus === 'missing-family-context' && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
            Please switch to a family context to manage billing.
          </div>
        )}

        <BillingWorkspace />
      </div>
    </div>
  );
}
