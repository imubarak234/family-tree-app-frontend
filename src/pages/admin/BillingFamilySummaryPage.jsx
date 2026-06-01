import { useState } from 'react';
import { Search } from 'lucide-react';
import BillingStatusBadge from '../../components/billing/BillingStatusBadge';
import { formatKoboToCurrency } from '../../utils/billing';
import { useAdminFamilyBilling } from '../../hooks/useAdminFamilyBilling';

export default function BillingFamilySummaryPage() {
  const [familyId, setFamilyId] = useState('');
  const { summary, loading, error, fetchSummary } = useAdminFamilyBilling();

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Family Billing Summary</h1>
          <p className="text-gray-600 mt-1">Inspect billing profile and account-level metrics for a family.</p>
        </div>

        <section className="rounded-xl border border-gray-200 bg-white p-4">
          <div className="flex flex-wrap items-end gap-3">
            <div className="flex-1 min-w-[280px]">
              <label className="block text-sm text-gray-700 mb-1">Family ID</label>
              <input
                value={familyId}
                onChange={(e) => setFamilyId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                placeholder="Enter family UUID"
              />
            </div>
            <button
              type="button"
              onClick={() => fetchSummary(familyId)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
            >
              <Search className="w-4 h-4" />
              Load Summary
            </button>
          </div>
        </section>

        {error && (
          <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>
        )}

        {loading ? (
          <p className="text-sm text-gray-600">Loading billing details...</p>
        ) : !summary ? (
          <p className="text-sm text-gray-600">Search for a family to view summary.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            <section className="rounded-xl border border-gray-200 bg-white p-5">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Profile</h2>
              <dl className="space-y-2 text-sm">
                <div>
                  <dt className="text-gray-500">Billing name</dt>
                  <dd className="text-gray-900">{summary.profile?.billingName || '—'}</dd>
                </div>
                <div>
                  <dt className="text-gray-500">Billing email</dt>
                  <dd className="text-gray-900">{summary.profile?.billingEmail || '—'}</dd>
                </div>
                <div>
                  <dt className="text-gray-500">Trial eligible</dt>
                  <dd className="text-gray-900">{summary.profile?.trialEligible ? 'Yes' : 'No'}</dd>
                </div>
              </dl>
            </section>

            <section className="rounded-xl border border-gray-200 bg-white p-5">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Latest Subscription</h2>
              {summary.latestSubscription ? (
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2"><BillingStatusBadge status={summary.latestSubscription.status} /></div>
                  <p className="text-gray-900">Plan: {summary.latestSubscription.plan?.name || summary.latestSubscription.plan?.code || '—'}</p>
                  <p className="text-gray-600">Period end: {summary.latestSubscription.currentPeriodEnd ? new Date(summary.latestSubscription.currentPeriodEnd).toLocaleDateString() : '—'}</p>
                </div>
              ) : (
                <p className="text-sm text-gray-600">No subscription found.</p>
              )}
            </section>

            <section className="rounded-xl border border-gray-200 bg-white p-5 md:col-span-2">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Stats</h2>
              <div className="grid gap-3 md:grid-cols-3 text-sm">
                <div>
                  <p className="text-gray-500">Invoices count</p>
                  <p className="text-gray-900 font-semibold">{summary.stats?.invoicesCount || 0}</p>
                </div>
                <div>
                  <p className="text-gray-500">Successful payments</p>
                  <p className="text-gray-900 font-semibold">{summary.stats?.successfulPaymentsCount || 0}</p>
                </div>
                <div>
                  <p className="text-gray-500">Amount paid</p>
                  <p className="text-gray-900 font-semibold">{formatKoboToCurrency(summary.stats?.amountPaidKobo || 0, 'NGN')}</p>
                </div>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
