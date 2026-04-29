import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search } from 'lucide-react';
import { useDebounce } from '../../hooks/useDebounce';
import { useAuth } from '../../hooks/useAuth';
import { useEvents } from '../../hooks/social/useEvents';
import { useDeleteEvent } from '../../hooks/social/useEventActions';
import EventCard from '../../components/social/EventCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import {
  canViewEvents,
  canCreateEvent,
  canDeleteEvent,
  canUpdateEvent,
} from '../../utils/permissions';

const PAGE_SIZE = 20;

export default function EventsListPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [search, setSearch] = useState('');
  const [upcoming, setUpcoming] = useState(true);
  const [past, setPast] = useState(false);
  const [page, setPage] = useState(1);

  const debounced = useDebounce(search, 300);
  const { data, loading, error, refetch } = useEvents({
    search: debounced,
    upcoming,
    past,
    page,
    limit: PAGE_SIZE,
  });

  const { deleteEvent } = useDeleteEvent();

  if (!canViewEvents(user)) {
    return <div className="p-8 text-center text-gray-500">You do not have permission to view events.</div>;
  }

  const items = data?.items || [];
  const total = data?.total || 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Events</h1>
            <p className="text-gray-500 text-sm mt-1">{total} events</p>
          </div>
          {canCreateEvent(user) && (
            <button
              onClick={() => navigate('/events/new')}
              className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-sm font-medium"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Event
            </button>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6 grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="md:col-span-2 relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm"
              placeholder="Search events..."
            />
          </div>
          <label className="inline-flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={upcoming}
              onChange={(e) => {
                setUpcoming(e.target.checked);
                setPage(1);
              }}
            />
            Upcoming
          </label>
          <label className="inline-flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={past}
              onChange={(e) => {
                setPast(e.target.checked);
                setPage(1);
              }}
            />
            Past
          </label>
        </div>

        {loading ? (
          <div className="py-16 flex justify-center"><LoadingSpinner /></div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">{error}</div>
        ) : items.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-10 text-center text-sm text-gray-500">No events found.</div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <EventCard
                key={item.id}
                item={item}
                onOpen={(event) => navigate(`/events/${event.id}`)}
                onEdit={(event) => navigate(`/events/${event.id}/edit`)}
                onDelete={async (event) => {
                  if (!canDeleteEvent(user)) return;
                  if (!window.confirm('Delete this event?')) return;
                  await deleteEvent(event.id);
                  refetch();
                }}
                canEdit={canUpdateEvent(user)}
                canDelete={canDeleteEvent(user)}
              />
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
