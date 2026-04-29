import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { RSVP_STATUS_OPTIONS } from '../../utils/constants';
import { rsvpSchema } from '../../utils/validation';
import {
  canCreateRsvp,
  canUpdateRsvp,
  canDeleteRsvp,
} from '../../utils/permissions';
import {
  useCreateRsvp,
  useUpdateRsvp,
  useDeleteRsvp,
} from '../../hooks/social/useEventActions';

function getActorId(entity) {
  return entity?.createdBy || entity?.userId || entity?.memberId || entity?.user?.id || null;
}

export default function RsvpPanel({ eventId, rsvps = [], currentUser, onChanged }) {
  const myRsvp = rsvps.find((r) => getActorId(r) === currentUser?.id) || null;

  const { createRsvp, loading: createLoading, error: createError } = useCreateRsvp();
  const { updateRsvp, loading: updateLoading, error: updateError } = useUpdateRsvp();
  const { deleteRsvp, loading: deleteLoading, error: deleteError } = useDeleteRsvp();

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(rsvpSchema),
    defaultValues: {
      status: myRsvp?.status || 'Maybe',
      guestCount: myRsvp?.guestCount || '',
      note: myRsvp?.note || '',
    },
  });

  const [successMessage, setSuccessMessage] = useState('');
  const loading = createLoading || updateLoading || deleteLoading;
  const error = createError || updateError || deleteError;

  const onSubmit = async (values) => {
    const payload = {
      status: values.status,
      guestCount: values.guestCount ? Number(values.guestCount) : undefined,
      note: values.note || null,
    };

    if (myRsvp) {
      if (!canUpdateRsvp(currentUser)) return;
      await updateRsvp(eventId, payload);
      setSuccessMessage('RSVP updated.');
    } else {
      if (!canCreateRsvp(currentUser)) return;
      await createRsvp(eventId, payload);
      setSuccessMessage('RSVP saved.');
    }
    onChanged?.();
  };

  const handleDelete = async () => {
    if (!myRsvp || !canDeleteRsvp(currentUser)) return;
    await deleteRsvp(eventId);
    setSuccessMessage('RSVP removed.');
    onChanged?.();
  };

  if (!canCreateRsvp(currentUser) && !canUpdateRsvp(currentUser) && !canDeleteRsvp(currentUser)) {
    return <p className="text-sm text-gray-400">RSVP actions are not available for your role.</p>;
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 space-y-3">
      <h3 className="text-sm font-semibold text-gray-700">Your RSVP</h3>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <select {...field} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                {RSVP_STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            )}
          />
          {errors.status && <p className="text-xs text-red-600 mt-1">{errors.status.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Guest Count</label>
          <input
            type="number"
            min="1"
            {...register('guestCount')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
          {errors.guestCount && <p className="text-xs text-red-600 mt-1">{errors.guestCount.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Note</label>
          <textarea
            rows={3}
            {...register('note')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
          {errors.note && <p className="text-xs text-red-600 mt-1">{errors.note.message}</p>}
        </div>

        {error && <p className="text-xs text-red-600">{error}</p>}
        {successMessage && <p className="text-xs text-green-700">{successMessage}</p>}

        <div className="flex gap-2 justify-end">
          {myRsvp && canDeleteRsvp(currentUser) && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={loading}
              className="px-3 py-2 text-xs bg-red-50 text-red-700 rounded-lg border border-red-200"
            >
              Remove RSVP
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 text-xs bg-blue-600 text-white rounded-lg"
          >
            {myRsvp ? 'Update RSVP' : 'Save RSVP'}
          </button>
        </div>
      </form>
    </div>
  );
}
