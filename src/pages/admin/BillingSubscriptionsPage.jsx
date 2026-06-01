import { useMemo } from 'react';
import { RefreshCw } from 'lucide-react';
import BillingStatusBadge from '../../components/billing/BillingStatusBadge';
import { useAdminBillingSubscriptions } from '../../hooks/useAdminBillingSubscriptions';

const STATUS_OPTIONS = ['', 'trialing', 'active', 'past_due', 'canceled', 'expired'];

export default function BillingSubscriptionsPage() {
  const {
    items,
    pagination,
    filters,
    loading,
    error,
    fetchSubscriptions,
    updateFilters,
  } = useAdminBillingSubscriptions();

  const rows = useMemo(() => items, [items]);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Billing Subscriptions</h1>
            <p className="text-gray-600 mt-1">Monitor subscriptions across families.</p>
          </div>
          <button
            type="button"
            onClick={() => fetchSubscriptions(filters)}
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-100"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        <section className="rounded-xl border border-gray-200 bg-white p-4">
          <div className="grid gap-3 md:grid-cols-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1">Family ID</label>
              <input
                value={filters.familyId || ''}
                onChange={(e) => updateFilters({ familyId: e.target.value, page: 1 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                placeholder="Optional family UUID"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Status</label>
              <select
                value={filters.status || ''}
                onChange={(e) => updateFilters({ status: e.target.value, page: 1 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="">All</option>
                {STATUS_OPTIONS.filter(Boolean).map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Page</label>
              <input
                type="number"
                min={1}
                value={filters.page || 1}
                onChange={(e) => updateFilters({ page: Number(e.target.value || 1) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Limit</label>
              <input
                type="number"
                min={1}
                max={100}
                value={filters.limit || 20}
                onChange={(e) => updateFilters({ limit: Number(e.target.value || 20), page: 1 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
          </div>
        </section>

        {error && (
          <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>
        )}

        <section className="rounded-xl border border-gray-200 bg-white overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Subscriptions</h2>
            <p className="text-xs text-gray-500">{pagination.total || 0} total</p>
          </div>
          {loading ? (
            <p className="p-6 text-sm text-gray-600">Loading billing details...</p>
          ) : rows.length === 0 ? (
            <p className="p-6 text-sm text-gray-600">No subscriptions found.</p>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subscription ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Family ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Period End</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rows.map((item) => (
                  <tr key={item.id}>
                    <td className="px-4 py-3 text-sm text-gray-900">{item.id}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{item.familyId}</td>
                    <td className="px-4 py-3 text-sm"><BillingStatusBadge status={item.status} /></td>
                    <td className="px-4 py-3 text-sm text-gray-600">{item.currentPeriodEnd ? new Date(item.currentPeriodEnd).toLocaleDateString() : '—'}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{item.plan?.name || item.plan?.code || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </div>
    </div>
  );
}
