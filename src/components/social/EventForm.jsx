import { Controller, useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { eventCreateSchema } from '../../utils/validation';
import MemberMultiSelect from './MemberMultiSelect';

function toDateTimeLocal(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const tzOffset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - tzOffset).toISOString().slice(0, 16);
}

export default function EventForm({
  initialValues,
  onSubmit,
  loading,
  submitLabel = 'Save Event',
  error,
}) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(eventCreateSchema),
    defaultValues: {
      title: initialValues?.title || '',
      description: initialValues?.description || '',
      startsAt: toDateTimeLocal(initialValues?.startsAt),
      endsAt: toDateTimeLocal(initialValues?.endsAt),
      location: initialValues?.location || '',
      isVirtual: !!initialValues?.isVirtual,
      meetingUrl: initialValues?.meetingUrl || '',
      capacity: initialValues?.capacity || '',
      isPublished: !!initialValues?.isPublished,
      coverMediaId: initialValues?.coverMediaId || '',
      relatedMemberIds: initialValues?.relatedMemberIds || [],
    },
  });

  const isVirtual = useWatch({ control, name: 'isVirtual' });

  const submit = (values) => {
    onSubmit({
      ...values,
      startsAt: values.startsAt ? new Date(values.startsAt).toISOString() : null,
      endsAt: values.endsAt ? new Date(values.endsAt).toISOString() : null,
      location: values.location || null,
      meetingUrl: values.meetingUrl || null,
      capacity: values.capacity ? Number(values.capacity) : null,
      coverMediaId: values.coverMediaId || null,
      relatedMemberIds: values.relatedMemberIds?.length ? values.relatedMemberIds : undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Title</label>
        <input {...register('title')} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm" />
        {errors.title && <p className="text-xs text-red-600 mt-1">{errors.title.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
        <textarea {...register('description')} rows={6} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm" />
        {errors.description && <p className="text-xs text-red-600 mt-1">{errors.description.message}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Starts At</label>
          <input type="datetime-local" {...register('startsAt')} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm" />
          {errors.startsAt && <p className="text-xs text-red-600 mt-1">{errors.startsAt.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Ends At</label>
          <input type="datetime-local" {...register('endsAt')} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm" />
          {errors.endsAt && <p className="text-xs text-red-600 mt-1">{errors.endsAt.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Location</label>
          <input {...register('location')} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm" />
          {errors.location && <p className="text-xs text-red-600 mt-1">{errors.location.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Capacity</label>
          <input type="number" min="1" {...register('capacity')} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm" />
          {errors.capacity && <p className="text-xs text-red-600 mt-1">{errors.capacity.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="inline-flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" {...register('isVirtual')} />
          Virtual event
        </label>
        <label className="inline-flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" {...register('isPublished')} />
          Published
        </label>
      </div>

      {isVirtual && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Meeting URL</label>
          <input {...register('meetingUrl')} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm" placeholder="https://..." />
          {errors.meetingUrl && <p className="text-xs text-red-600 mt-1">{errors.meetingUrl.message}</p>}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Cover Media ID (optional)</label>
        <input {...register('coverMediaId')} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm" placeholder="UUID" />
        {errors.coverMediaId && <p className="text-xs text-red-600 mt-1">{errors.coverMediaId.message}</p>}
      </div>

      <Controller
        name="relatedMemberIds"
        control={control}
        render={({ field }) => (
          <MemberMultiSelect value={field.value || []} onChange={field.onChange} />
        )}
      />

      {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-60"
        >
          {loading ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  );
}
