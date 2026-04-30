import { useNavigate } from 'react-router-dom';
import { CalendarDays, ChevronRight, MapPin } from 'lucide-react';
import { useEvents } from '../../hooks/social/useEvents';
import { formatDate } from '../../utils/formatters';
import LoadingSpinner from '../common/LoadingSpinner';

function getDateBadgeTone(startsAt) {
  if (!startsAt) return 'bg-blue-50 text-blue-700';
  const eventDate = new Date(startsAt);
  const now = new Date();
  const daysDiff = Math.ceil((eventDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  return daysDiff <= 7 ? 'bg-amber-50 text-amber-700' : 'bg-blue-50 text-blue-700';
}

export default function UpcomingEventsWidget() {
  const navigate = useNavigate();
  const { data, loading, error } = useEvents({ upcoming: true, past: false, limit: 3, page: 1 });
  const items = data?.items || [];

  return (
    <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 sm:p-6 h-full">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-base sm:text-lg font-semibold tracking-tight text-gray-900 inline-flex items-center gap-2">
          <CalendarDays className="w-5 h-5 text-purple-600" />
          Upcoming Events
        </h3>
        <button
          onClick={() => navigate('/events')}
          className="text-xs sm:text-sm font-medium text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
        >
          View All
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
        <div className="py-8 text-center text-sm text-gray-500">
          <p className="mb-1">No upcoming events.</p>
          <p className="text-xs text-gray-400">Create one to keep the family in sync.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.slice(0, 3).map((event) => {
            const tone = getDateBadgeTone(event.startsAt);
            return (
              <button
                key={event.id}
                onClick={() => navigate('/events')}
                className="w-full text-left p-3 rounded-lg border border-gray-100 transition-all hover:-translate-y-0.5 hover:shadow-sm hover:bg-gray-50"
              >
                <div className="flex items-start gap-3">
                  <div className={`rounded-lg px-2 py-1 text-center ${tone}`}>
                    <p className="text-[10px] uppercase leading-3">{formatDate(event.startsAt, 'MMM')}</p>
                    <p className="text-sm font-bold leading-4">{formatDate(event.startsAt, 'dd')}</p>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{event.title}</p>
                    <p className="text-xs text-gray-500">{formatDate(event.startsAt, 'MMM dd, yyyy')}</p>
                    {event.location && (
                      <p className="mt-1 inline-flex items-center gap-1 text-xs text-gray-500">
                        <MapPin className="w-3 h-3" />
                        {event.location}
                      </p>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}
