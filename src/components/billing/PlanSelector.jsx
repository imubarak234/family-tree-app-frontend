import { CheckCircle2 } from 'lucide-react';
import { formatKoboToCurrency } from '../../utils/billing';

export default function PlanSelector({
  plans,
  currentPlanCode,
  loading,
  canManage,
  onCheckout,
}) {
  const activePlans = plans.filter((plan) => plan.isActive);

  if (!loading && activePlans.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 text-sm text-gray-500">
        No billing plans are currently available.
      </div>
    );
  }

  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold text-gray-900">Plan Selector</h2>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {activePlans.map((plan) => {
          const isCurrent = currentPlanCode === plan.code;
          const isFree = plan.amountKobo === 0;

          return (
            <article key={plan.id} className={`rounded-xl border p-5 ${isCurrent ? 'border-blue-300 bg-blue-50/40' : 'border-gray-200 bg-white'}`}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-base font-semibold text-gray-900">{plan.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{plan.description || 'Family plan'}</p>
                </div>
                {isCurrent && <CheckCircle2 className="w-5 h-5 text-blue-600" />}
              </div>

              <p className="mt-4 text-2xl font-bold text-gray-900">
                {isFree ? 'Free' : formatKoboToCurrency(plan.amountKobo, plan.currency)}
              </p>
              <p className="text-xs text-gray-500 mt-1 uppercase tracking-wide">{plan.billingCycle}</p>

              <ul className="mt-4 space-y-1 text-sm text-gray-600">
                <li>Member limit: {plan.memberLimit ?? 'Unlimited'}</li>
                <li>Tree node limit: {plan.treeNodeLimit ?? 'Unlimited'}</li>
                <li>Tree depth limit: {plan.treeDepthLimit ?? 'Unlimited'}</li>
              </ul>

              <button
                type="button"
                disabled={!canManage || isCurrent || isFree || loading}
                onClick={() => onCheckout(plan.code)}
                className="mt-5 w-full px-4 py-2.5 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing checkout...' : isCurrent ? 'Current Plan' : 'Upgrade / Checkout'}
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
}
