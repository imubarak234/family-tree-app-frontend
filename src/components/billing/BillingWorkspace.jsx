import { Link } from 'react-router-dom';
import { useBillingOverview } from '../../hooks/useBillingOverview';
import { useBillingInvoices } from '../../hooks/useBillingInvoices';
import {
  formatKoboToCurrency,
  getLimitLabel,
  getUsageLabel,
} from '../../utils/billing';
import BillingStatusBadge from './BillingStatusBadge';
import UsageCard from './UsageCard';
import PlanSelector from './PlanSelector';
import SubscriptionManagementCard from './SubscriptionManagementCard';
import InvoiceList from './InvoiceList';
import InvoiceDetailCard from './InvoiceDetailCard';

export default function BillingWorkspace({ compact = false }) {
  const {
    plans,
    subscription,
    entitlement,
    usageStats,
    loading,
    error,
    actionError,
    actionLoading,
    canManage,
    startTrial,
    initCheckout,
    cancelSubscription,
  } = useBillingOverview();

  const {
    items,
    pagination,
    selectedInvoice,
    loading: invoicesLoading,
    loadingInvoice,
    error: invoicesError,
    invoiceError,
    fetchInvoices,
    fetchInvoice,
  } = useBillingInvoices();

  const currentPlan = plans.find((plan) => plan.code === entitlement?.planCode) || null;

  const usageCards = [
    {
      label: 'Members used',
      used: Number(usageStats?.totalMembers || 0),
      limit: entitlement?.memberLimit,
    },
    {
      label: 'Tree nodes used',
      used: Number(usageStats?.totalRelationships || 0),
      limit: entitlement?.treeNodeLimit,
    },
    {
      label: 'Tree depth used',
      used: Number(usageStats?.maxGenerationDepth || 0),
      limit: entitlement?.treeDepthLimit,
    },
  ];

  const handleCheckout = async (planCode) => {
    const result = await initCheckout(planCode);

    if (!result.ok) return;

    const payload = result.data?.data?.data || result.data?.data || result.data;
    const checkoutUrl = payload?.checkoutUrl;

    if (checkoutUrl) {
      window.location.assign(checkoutUrl);
    }
  };

  return (
    <div className="space-y-6">
      {!canManage && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
          Only family owners can manage billing actions.
        </div>
      )}

      {(error || actionError) && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          {actionError || error}
        </div>
      )}

      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Billing Overview</h2>
            <p className="text-sm text-gray-600 mt-1">Plan, subscription status, and entitlement summary.</p>
          </div>
          <div className="flex items-center gap-2">
            <BillingStatusBadge status={subscription?.status || entitlement?.subscriptionStatus} />
            {!compact && (
              <Link
                to="/billing/checkout/return"
                className="px-3 py-1.5 text-xs border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Confirm Payment
              </Link>
            )}
          </div>
        </div>

        {loading ? (
          <p className="text-sm text-gray-600 mt-4">Loading billing details...</p>
        ) : (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
            <div className="rounded-lg border border-gray-100 p-3">
              <p className="text-gray-500">Current plan</p>
              <p className="font-semibold text-gray-900 mt-1">{currentPlan?.name || entitlement?.planCode || 'Unknown'}</p>
              <p className="text-xs text-gray-500 mt-1">
                {currentPlan ? formatKoboToCurrency(currentPlan.amountKobo, currentPlan.currency) : '—'}
              </p>
            </div>
            <div className="rounded-lg border border-gray-100 p-3">
              <p className="text-gray-500">Members entitlement</p>
              <p className="font-semibold text-gray-900 mt-1">{getUsageLabel(usageCards[0].used, usageCards[0].limit)}</p>
              <p className="text-xs text-gray-500 mt-1">Limit: {getLimitLabel(entitlement?.memberLimit)}</p>
            </div>
            <div className="rounded-lg border border-gray-100 p-3">
              <p className="text-gray-500">Valid until</p>
              <p className="font-semibold text-gray-900 mt-1">{entitlement?.validUntil ? new Date(entitlement.validUntil).toLocaleDateString() : 'No expiry'}</p>
            </div>
          </div>
        )}
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Usage</h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {usageCards.map((card) => (
            <UsageCard key={card.label} label={card.label} used={card.used} limit={card.limit} />
          ))}
        </div>
      </section>

      <PlanSelector
        plans={plans}
        currentPlanCode={entitlement?.planCode}
        loading={actionLoading === 'checkout'}
        canManage={canManage}
        onCheckout={handleCheckout}
      />

      <SubscriptionManagementCard
        subscription={subscription}
        canManage={canManage}
        actionLoading={actionLoading}
        onStartTrial={startTrial}
        onCancelSubscription={cancelSubscription}
      />

      {!compact && (
        <div className="grid gap-6 xl:grid-cols-2">
          <InvoiceList
            invoices={items}
            pagination={pagination}
            loading={invoicesLoading}
            error={invoicesError}
            selectedInvoiceId={selectedInvoice?.id}
            onSelectInvoice={fetchInvoice}
            onPageChange={(page) => fetchInvoices(page, pagination.limit)}
          />

          <InvoiceDetailCard
            invoice={selectedInvoice}
            loading={loadingInvoice}
            error={invoiceError}
          />
        </div>
      )}
    </div>
  );
}
