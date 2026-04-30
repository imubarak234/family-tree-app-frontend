import { useNavigate } from 'react-router-dom';
import { CalendarDays, ChevronRight, Clock4, HeartPulse, Newspaper, UserRoundCheck } from 'lucide-react';
import { useTimeline } from '../../hooks/social/useTimeline';
import { formatDate } from '../../utils/formatters';
import LoadingSpinner from '../common/LoadingSpinner';

const SOURCE_STYLES = {
  NewsPost: {
    label: 'News',
    tone: 'text-blue-700 bg-blue-50',
    icon: Newspaper,
  },
  Event: {
    label: 'Event',
    tone: 'text-purple-700 bg-purple-50',
    icon: CalendarDays,
  },
  Birth: {
    label: 'Birth',
    tone: 'text-green-700 bg-green-50',
    icon: HeartPulse,
  },
  Death: {
    label: 'Death',
    tone: 'text-gray-700 bg-gray-100',
    icon: UserRoundCheck,
  },
  default: {
    label: 'Activity',
    tone: 'text-slate-700 bg-slate-100',
    icon: Clock4,
  },
};

function getStyle(sourceType) {
  return SOURCE_STYLES[sourceType] || SOURCE_STYLES.default;
}

export default function ActivityFeedWidget() {
  const navigate = useNavigate();
  const { data, loading, error } = useTimeline({ page: 1, limit: 5 });
  const items = data?.items || [];

  return (
    <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 sm:p-6 h-full">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-base sm:text-lg font-semibold tracking-tight text-gray-900 inline-flex items-center gap-2">
          <Clock4 className="w-5 h-5 text-indigo-600" />
          Recent Activity
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
        <div className="py-8 text-center text-sm text-gray-500">No recent activity.</div>
      ) : (
        <div className="space-y-3">
          {items.slice(0, 5).map((item) => {
            const style = getStyle(item.sourceType);
            const Icon = style.icon;
            return (
              <article className="rounded-lg border border-gray-100 p-3 transition-all hover:-translate-y-0.5 hover:shadow-sm" key={item.id}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2 min-w-0">
                    <span className={`mt-0.5 p-1.5 rounded-md ${style.tone}`}>
                      <Icon className="w-3.5 h-3.5" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {item.title || item.sourceType || 'Timeline item'}
                      </p>
                      <p className="text-xs text-gray-500 line-clamp-2">
                        {item.description || item.summary || 'No details provided.'}
                      </p>
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-[11px] text-gray-400">{style.label}</p>
                    <p className="text-[11px] text-gray-400">
                      {formatDate(item.occurredAt || item.createdAt, 'MMM dd')}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
