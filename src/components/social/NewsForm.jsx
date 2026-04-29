import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { newsCreateSchema } from '../../utils/validation';
import { NEWS_STATUS_OPTIONS } from '../../utils/constants';
import MemberMultiSelect from './MemberMultiSelect';

export default function NewsForm({
  initialValues,
  onSubmit,
  loading,
  submitLabel = 'Save News',
  error,
}) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(newsCreateSchema),
    defaultValues: {
      title: initialValues?.title || '',
      excerpt: initialValues?.excerpt || '',
      content: initialValues?.content || '',
      status: initialValues?.status || 'Draft',
      coverMediaId: initialValues?.coverMediaId || '',
      relatedMemberIds: initialValues?.relatedMemberIds || [],
    },
  });

  const submit = (values) => {
    onSubmit({
      ...values,
      excerpt: values.excerpt || null,
      coverMediaId: values.coverMediaId || null,
      relatedMemberIds: values.relatedMemberIds?.length ? values.relatedMemberIds : undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Title</label>
        <input
          {...register('title')}
          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="News title"
        />
        {errors.title && <p className="text-xs text-red-600 mt-1">{errors.title.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Excerpt</label>
        <textarea
          {...register('excerpt')}
          rows={2}
          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Short summary"
        />
        {errors.excerpt && <p className="text-xs text-red-600 mt-1">{errors.excerpt.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Content</label>
        <textarea
          {...register('content')}
          rows={8}
          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Write the full news content..."
        />
        {errors.content && <p className="text-xs text-red-600 mt-1">{errors.content.message}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
          <select
            {...register('status')}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {NEWS_STATUS_OPTIONS.map((status) => (
              <option key={status.value} value={status.value}>{status.label}</option>
            ))}
          </select>
          {errors.status && <p className="text-xs text-red-600 mt-1">{errors.status.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Cover Media ID (optional)</label>
          <input
            {...register('coverMediaId')}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="UUID"
          />
          {errors.coverMediaId && <p className="text-xs text-red-600 mt-1">{errors.coverMediaId.message}</p>}
        </div>
      </div>

      <Controller
        name="relatedMemberIds"
        control={control}
        render={({ field }) => (
          <MemberMultiSelect
            value={field.value || []}
            onChange={field.onChange}
            label="Related Family Members"
          />
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
