import { useState } from 'react';
import { Clock4 } from 'lucide-react';
import { useDebounce } from '../../hooks/useDebounce';
import { useTimeline } from '../../hooks/social/useTimeline';
import { useAuth } from '../../hooks/useAuth';
import { canViewTimeline } from '../../utils/permissions';
import { TIMELINE_SOURCE_TYPES } from '../../utils/constants';
import { useMembers } from '../../hooks/useMembers';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatDate } from '../../utils/formatters';

const PAGE_SIZE = 20;

export default function TimelinePage() {
  const { user } = useAuth();
  const [sourceType, setSourceType] = useState('');
  const [memberId, setMemberId] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [page, setPage] = useState(1);
  const [memberSearch, setMemberSearch] = useState('');

  const debouncedMemberSearch = useDebounce(memberSearch, 300);
  const { data: membersData } = useMembers({ name: debouncedMemberSearch, limit: 20 });

  const { data, loading, error } = useTimeline({
    sourceType: sourceType || undefined,
    memberId: memberId || undefined,
    from: from || undefined,
    to: to || undefined,
    page,
    limit: PAGE_SIZE,
  });

  if (!canViewTimeline(user)) {
    return <div className="p-8 text-center text-gray-500">You do not have permission to view timeline.</div>;
  }

  const items = data?.items || [];
  const total = data?.total || 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 inline-flex items-center gap-2">
            <Clock4 className="w-7 h-7 text-blue-600" />
            Timeline
          </h1>
          <p className="text-sm text-gray-500 mt-1">Chronological activity feed ({total} items)</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-6 grid grid-cols-1 md:grid-cols-5 gap-3">
          <select
            value={sourceType}
            onChange={(e) => {
              setSourceType(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="">All sources</option>
            {TIMELINE_SOURCE_TYPES.map((type) => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>

          <div className="md:col-span-2 space-y-2">
            <input
              value={memberSearch}
              onChange={(e) => setMemberSearch(e.target.value)}
              placeholder="Search member by name"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
            <select
              value={memberId}
              onChange={(e) => {
                setMemberId(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="">All members</option>
              {(membersData?.members || []).map((member) => (
                <option key={member.id} value={member.id}>{member.firstName} {member.lastName}</option>
              ))}
            </select>
          </div>

          <input
            type="date"
            value={from}
            onChange={(e) => {
              setFrom(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
          <input
            type="date"
            value={to}
            onChange={(e) => {
              setTo(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
        </div>

        {loading ? (
          <div className="py-16 flex justify-center"><LoadingSpinner /></div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">{error}</div>
        ) : items.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-10 text-center text-sm text-gray-500">No timeline items found.</div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <article key={item.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{item.title || item.sourceType || 'Timeline item'}</p>
                    <p className="text-xs text-gray-500">{item.description || item.summary || 'No details provided.'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400">{item.sourceType || 'Unknown'}</p>
                    <p className="text-xs text-gray-400">{formatDate(item.occurredAt || item.createdAt)}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-3">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">Page {page} of {totalPages}</span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
