import { getUsageLabel, getLimitLabel } from '../../utils/billing';

export default function UsageCard({ label, used, limit }) {
  const ratio = limit ? Math.min(100, Math.round((used / limit) * 100)) : null;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-semibold text-gray-900 mt-1">{getUsageLabel(used, limit)}</p>
      <p className="text-xs text-gray-500 mt-1">Limit: {getLimitLabel(limit)}</p>
      {ratio !== null && (
        <div className="mt-3 h-2 rounded-full bg-gray-100 overflow-hidden">
          <div className={`h-2 ${ratio >= 90 ? 'bg-red-500' : ratio >= 70 ? 'bg-amber-500' : 'bg-green-500'}`} style={{ width: `${ratio}%` }} />
        </div>
      )}
    </div>
  );
}
