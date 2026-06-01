import { Link } from 'react-router-dom';
import BillingWorkspace from './BillingWorkspace';

export default function SettingsBillingSection() {
  return (
    <section id="billing" className="bg-white border border-gray-100 shadow-sm rounded-xl p-6 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Billing</h2>
          <p className="text-sm text-gray-600 mt-1">Manage your family subscription and entitlement limits.</p>
        </div>
        <Link
          to="/billing"
          className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Open Full Billing Page
        </Link>
      </div>

      <BillingWorkspace compact />
    </section>
  );
}
