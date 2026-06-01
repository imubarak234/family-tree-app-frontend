import { useMemo, useState } from 'react';
import { Plus, RefreshCw } from 'lucide-react';
import { adminBillingAPI } from '../../api/adminBilling';
import { useAdminBillingPlans } from '../../hooks/useAdminBillingPlans';
import { formatKoboToCurrency, mapBillingError } from '../../utils/billing';

const DEFAULT_FORM = {
  name: '',
  code: '',
  description: '',
  currency: 'NGN',
  amountKobo: 0,
  billingCycle: 'monthly',
  trialDays: 0,
  memberLimit: '',
  treeNodeLimit: '',
  treeDepthLimit: '',
  isActive: true,
  sortOrder: 0,
};

function toNullableNumber(value) {
  if (value === '' || value === null || value === undefined) return null;
  return Number(value);
}

export default function BillingPlansPage() {
  const { plans, loading, error, fetchPlans } = useAdminBillingPlans();
  const [form, setForm] = useState(DEFAULT_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');

  const sortedPlans = useMemo(() => [...plans].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)), [plans]);

  const payload = {
    name: form.name.trim(),
    code: form.code.trim(),
    description: form.description.trim() || null,
    currency: form.currency,
    amountKobo: Number(form.amountKobo || 0),
    billingCycle: form.billingCycle,
    trialDays: Number(form.trialDays || 0),
    memberLimit: toNullableNumber(form.memberLimit),
    treeNodeLimit: toNullableNumber(form.treeNodeLimit),
    treeDepthLimit: toNullableNumber(form.treeDepthLimit),
    isActive: Boolean(form.isActive),
    sortOrder: Number(form.sortOrder || 0),
    metadata: {},
  };

  const handleCreate = async () => {
    try {
      setSubmitting(true);
      setSubmitError('');
      setSubmitSuccess('');
      await adminBillingAPI.createPlan(payload);
      setForm(DEFAULT_FORM);
      setSubmitSuccess('Billing plan created.');
      fetchPlans();
    } catch (err) {
      setSubmitError(mapBillingError(err, 'Failed to create billing plan.'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async (plan) => {
    try {
      setSubmitError('');
      await adminBillingAPI.patchPlan(plan.id, { isActive: !plan.isActive });
      fetchPlans();
    } catch (err) {
      setSubmitError(mapBillingError(err, 'Failed to update plan.'));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Billing Plans</h1>
            <p className="text-gray-600 mt-1">Create and manage plan catalog entries.</p>
          </div>
          <button
            type="button"
            onClick={fetchPlans}
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-100"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        {(error || submitError) && (
          <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{submitError || error}</p>
        )}

        {submitSuccess && (
          <p className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">{submitSuccess}</p>
        )}

        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="flex items-center gap-2 mb-4">
            <Plus className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Create Plan</h2>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            <Input label="Name" value={form.name} onChange={(value) => setForm((p) => ({ ...p, name: value }))} />
            <Input label="Code" value={form.code} onChange={(value) => setForm((p) => ({ ...p, code: value }))} />
            <Input label="Amount (Kobo)" type="number" value={form.amountKobo} onChange={(value) => setForm((p) => ({ ...p, amountKobo: value }))} />
            <Input label="Trial Days" type="number" value={form.trialDays} onChange={(value) => setForm((p) => ({ ...p, trialDays: value }))} />
            <Input label="Member Limit" type="number" value={form.memberLimit} onChange={(value) => setForm((p) => ({ ...p, memberLimit: value }))} placeholder="Empty = unlimited" />
            <Input label="Tree Node Limit" type="number" value={form.treeNodeLimit} onChange={(value) => setForm((p) => ({ ...p, treeNodeLimit: value }))} placeholder="Empty = unlimited" />
            <Input label="Tree Depth Limit" type="number" value={form.treeDepthLimit} onChange={(value) => setForm((p) => ({ ...p, treeDepthLimit: value }))} placeholder="Empty = unlimited" />
            <Input label="Sort Order" type="number" value={form.sortOrder} onChange={(value) => setForm((p) => ({ ...p, sortOrder: value }))} />
            <div>
              <label className="block text-sm text-gray-700 mb-1">Billing Cycle</label>
              <select value={form.billingCycle} onChange={(e) => setForm((p) => ({ ...p, billingCycle: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                <option value="none">none</option>
                <option value="monthly">monthly</option>
                <option value="yearly">yearly</option>
              </select>
            </div>
          </div>
          <div className="mt-3">
            <label className="block text-sm text-gray-700 mb-1">Description</label>
            <textarea value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" rows={2} />
          </div>
          <label className="mt-3 inline-flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" checked={form.isActive} onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.checked }))} />
            Active
          </label>
          <div className="mt-4">
            <button type="button" onClick={handleCreate} disabled={submitting} className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-500">
              {submitting ? 'Creating...' : 'Create Plan'}
            </button>
          </div>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Plans</h2>
          </div>
          {loading ? (
            <p className="p-6 text-sm text-gray-600">Loading billing details...</p>
          ) : sortedPlans.length === 0 ? (
            <p className="p-6 text-sm text-gray-600">No plans found.</p>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cycle</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sortedPlans.map((plan) => (
                  <tr key={plan.id}>
                    <td className="px-4 py-3 text-sm text-gray-900">{plan.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{plan.code}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{formatKoboToCurrency(plan.amountKobo, plan.currency)}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{plan.billingCycle}</td>
                    <td className="px-4 py-3 text-sm">
                      <button
                        type="button"
                        onClick={() => handleToggleActive(plan)}
                        className={`px-2 py-1 rounded-full text-xs font-medium ${plan.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700'}`}
                      >
                        {plan.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
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

function Input({ label, value, onChange, type = 'text', placeholder = '' }) {
  return (
    <div>
      <label className="block text-sm text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
      />
    </div>
  );
}
