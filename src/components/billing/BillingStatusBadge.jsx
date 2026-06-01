import { getBillingStatusMeta } from '../../utils/billing';

export default function BillingStatusBadge({ status }) {
  const meta = getBillingStatusMeta(status);

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${meta.className}`}>
      {meta.label}
    </span>
  );
}
