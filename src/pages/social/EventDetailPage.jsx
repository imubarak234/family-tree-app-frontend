import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Edit2, Trash2, CalendarDays, MapPin } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useEventDetail } from '../../hooks/social/useEvents';
import { useDeleteEvent, useEventRsvps } from '../../hooks/social/useEventActions';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatDate } from '../../utils/formatters';
import {
  canViewEvents,
  canUpdateEvent,
  canDeleteEvent,
} from '../../utils/permissions';
import { useComments, useReactions } from '../../hooks/social/useEngagement';
import CommentsThread from '../../components/social/CommentsThread';
import ReactionsBar from '../../components/social/ReactionsBar';
import RsvpPanel from '../../components/social/RsvpPanel';

export default function EventDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: item, loading, error } = useEventDetail(id);
  const { deleteEvent, loading: deleting } = useDeleteEvent();
  const { data: rsvpsData, refetch: refetchRsvps } = useEventRsvps(id);
  const rsvps = Array.isArray(rsvpsData) ? rsvpsData : rsvpsData?.items || [];

  const { data: comments, refetch: refetchComments } = useComments('events', id);
  const { data: reactions, refetch: refetchReactions } = useReactions('events', id);

  if (!canViewEvents(user)) {
    return <div className="p-8 text-center text-gray-500">You do not have permission to view this event.</div>;
  }

  if (loading) {
    return <div className="py-16 flex justify-center"><LoadingSpinner /></div>;
  }

  if (error || !item) {
    return <div className="p-8 text-center text-red-600">{error || 'Event not found.'}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <button
          type="button"
          onClick={() => navigate('/events')}
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Events
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          <article className="lg:col-span-3 bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{item.title}</h1>
                <div className="mt-2 flex flex-wrap gap-3 text-xs text-gray-500">
                  <span className="inline-flex items-center gap-1"><CalendarDays className="w-3.5 h-3.5" />{formatDate(item.startsAt)}</span>
                  {item.location && <span className="inline-flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{item.location}</span>}
                </div>
              </div>

              <div className="flex items-center gap-1">
                {canUpdateEvent(user) && (
                  <button type="button" onClick={() => navigate(`/events/${item.id}/edit`)} className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg" title="Edit">
                    <Edit2 className="w-4 h-4" />
                  </button>
                )}
                {canDeleteEvent(user) && (
                  <button
                    type="button"
                    disabled={deleting}
                    onClick={async () => {
                      if (!window.confirm('Delete this event?')) return;
                      await deleteEvent(item.id);
                      navigate('/events');
                    }}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            <p className="text-gray-700 whitespace-pre-wrap">{item.description}</p>
          </article>

          <div className="lg:col-span-2 space-y-4">
            <RsvpPanel eventId={id} rsvps={rsvps} currentUser={user} onChanged={refetchRsvps} />

            {canUpdateEvent(user) && (
              <div className="bg-white rounded-xl border border-gray-100 p-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">RSVP List</h3>
                {rsvps.length === 0 ? (
                  <p className="text-sm text-gray-400">No RSVPs yet.</p>
                ) : (
                  <ul className="space-y-2">
                    {rsvps.map((rsvp) => (
                      <li key={rsvp.id || `${rsvp.status}-${rsvp.memberId}`} className="text-sm text-gray-600 flex justify-between">
                        <span>{rsvp.memberName || rsvp.user?.name || rsvp.memberId || 'Member'}</span>
                        <span className="font-medium">{rsvp.status}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 space-y-4">
          <ReactionsBar
            resource="events"
            targetId={id}
            reactions={reactions}
            currentUser={user}
            onChanged={refetchReactions}
          />
          <CommentsThread
            resource="events"
            targetId={id}
            comments={comments}
            currentUser={user}
            onChanged={refetchComments}
          />
        </div>
      </div>
    </div>
  );
}
