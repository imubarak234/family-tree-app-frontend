import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, HeartPulse, Sparkles, UserRoundCheck } from 'lucide-react';
import { useTimeline } from '../../hooks/social/useTimeline';
import { formatDate } from '../../utils/formatters';
import LoadingSpinner from '../common/LoadingSpinner';

function toTimestamp(item) {
  const date = item?.occurredAt || item?.createdAt;
  const ts = date ? new Date(date).getTime() : 0;
  return Number.isNaN(ts) ? 0 : ts;
}

export default function MilestoneSpotlightWidget() {
  const navigate = useNavigate();
  const birthsQuery = useTimeline({ sourceType: 'Birth', page: 1, limit: 2 });
  const deathsQuery = useTimeline({ sourceType: 'Death', page: 1, limit: 2 });

  const items = useMemo(() => {
    const births = birthsQuery.data?.items || [];
    const deaths = deathsQuery.data?.items || [];
    return [...births, ...deaths]
      .sort((a, b) => toTimestamp(b) - toTimestamp(a))
      .slice(0, 4);
  }, [birthsQuery.data, deathsQuery.data]);

  const loading = birthsQuery.loading || deathsQuery.loading;
  const error = birthsQuery.error || deathsQuery.error;

  return (
    <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 sm:p-6 h-full">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-base sm:text-lg font-semibold tracking-tight text-gray-900 inline-flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-600" />
          Milestone Spotlight
        </h3>
        <button
          onClick={() => navigate('/timeline')}
          className="text-xs sm:text-sm font-medium text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
        >
          View Timeline
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {loading ? (
        <div className="py-8 flex justify-center">
          <LoadingSpinner size="md" />
        </div>
      ) : error ? (
        <p className="text-sm text-red-600">{error}</p>
      ) : items.length === 0 ? (
        <div className="py-8 text-center text-sm text-gray-500">No milestone entries available.</div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {items.map((item) => {
            const isBirth = item.sourceType === 'Birth';
            return (
              <article
                key={item.id}
                className={`rounded-lg border p-4 transition-all hover:-translate-y-0.5 hover:shadow-sm ${
                  isBirth ? 'border-green-100 bg-green-50/40' : 'border-gray-200 bg-gray-50/60'
                }`}
              >
                <div className="flex items-center justify-between gap-3 mb-2">
                  <span
                    className={`inline-flex items-center gap-1.5 text-xs px-2 py-1 rounded-full ${
                      isBirth ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {isBirth ? <HeartPulse className="w-3 h-3" /> : <UserRoundCheck className="w-3 h-3" />}
                    {isBirth ? 'Birth' : 'Death'}
                  </span>
                  <span className="text-xs text-gray-500">{formatDate(item.occurredAt || item.createdAt)}</span>
                </div>
                <p className="text-sm font-semibold text-gray-900">
                  {item.title || 'Family milestone'}
                </p>
                <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                  {item.description || item.summary || 'No additional details provided.'}
                </p>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
