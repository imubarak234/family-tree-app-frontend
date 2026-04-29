import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useEventDetail } from '../../hooks/social/useEvents';
import { useCreateEvent, useUpdateEvent } from '../../hooks/social/useEventActions';
import EventForm from '../../components/social/EventForm';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { canCreateEvent, canUpdateEvent } from '../../utils/permissions';

export default function EventFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;
  const { user } = useAuth();

  const { data, loading: detailLoading, error: detailError } = useEventDetail(id);
  const { createEvent, loading: createLoading, error: createError } = useCreateEvent();
  const { updateEvent, loading: updateLoading, error: updateError } = useUpdateEvent();

  if (!isEdit && !canCreateEvent(user)) {
    return <div className="p-8 text-center text-gray-500">You do not have permission to create events.</div>;
  }

  if (isEdit && !canUpdateEvent(user)) {
    return <div className="p-8 text-center text-gray-500">You do not have permission to edit events.</div>;
  }

  if (isEdit && detailLoading) {
    return <div className="py-16 flex justify-center"><LoadingSpinner /></div>;
  }

  if (isEdit && detailError) {
    return <div className="p-8 text-center text-red-600">{detailError}</div>;
  }

  const onSubmit = async (values) => {
    if (isEdit) {
      await updateEvent(id, values);
      navigate(`/events/${id}`);
      return;
    }

    const created = await createEvent(values);
    navigate(`/events/${created?.id || ''}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <button
          type="button"
          onClick={() => navigate(isEdit ? `/events/${id}` : '/events')}
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {isEdit ? 'Edit Event' : 'Create Event'}
          </h1>
          <EventForm
            initialValues={isEdit ? data : null}
            onSubmit={onSubmit}
            loading={createLoading || updateLoading}
            error={createError || updateError}
            submitLabel={isEdit ? 'Update Event' : 'Create Event'}
          />
        </div>
      </div>
    </div>
  );
}
