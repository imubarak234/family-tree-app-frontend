import { formatDate } from '../../utils/formatters';
import BillingStatusBadge from './BillingStatusBadge';

export default function SubscriptionManagementCard({
  subscription,
  canManage,
  actionLoading,
  onStartTrial,
  onCancelSubscription,
}) {
  if (!subscription) {
    return (
      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-gray-900">Subscription Management</h2>
        <p className="text-sm text-gray-600 mt-2">No subscription found for this family.</p>
        <button
          type="button"
          onClick={onStartTrial}
          disabled={!canManage || actionLoading === 'trial'}
          className="mt-4 px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed"
        >
          {actionLoading === 'trial' ? 'Processing...' : 'Start Trial'}
        </button>
      </section>
    );
  }

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-gray-900">Subscription Management</h2>
        <BillingStatusBadge status={subscription.status} />
      </div>

      <dl className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
        <div>
          <dt className="text-gray-500">Current period start</dt>
          <dd className="text-gray-900">{formatDate(subscription.currentPeriodStart)}</dd>
        </div>
        <div>
          <dt className="text-gray-500">Current period end</dt>
          <dd className="text-gray-900">{formatDate(subscription.currentPeriodEnd)}</dd>
        </div>
        <div>
          <dt className="text-gray-500">Trial end</dt>
          <dd className="text-gray-900">{subscription.trialEnd ? formatDate(subscription.trialEnd) : '—'}</dd>
        </div>
        <div>
          <dt className="text-gray-500">Cancel at period end</dt>
          <dd className="text-gray-900">{subscription.cancelAtPeriodEnd ? 'Yes' : 'No'}</dd>
        </div>
      </dl>

      <button
        type="button"
        disabled={!canManage || subscription.cancelAtPeriodEnd || actionLoading === 'cancel'}
        onClick={() => onCancelSubscription(subscription.id)}
        className="mt-5 px-4 py-2 rounded-lg text-sm font-medium border border-red-300 text-red-700 hover:bg-red-50 disabled:border-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed"
      >
        {actionLoading === 'cancel' ? 'Cancelling...' : 'Cancel Subscription'}
      </button>
    </section>
  );
}
