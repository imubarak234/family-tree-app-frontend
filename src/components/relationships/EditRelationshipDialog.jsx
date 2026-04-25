import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { X, Save } from 'lucide-react';
import { useUpdateRelationship } from '../../hooks/useUpdateRelationship';
import { relationshipSchema } from '../../utils/validation';
import { formatFullName } from '../../utils/formatters';
import { getRelationshipLabel } from '../../utils/relationshipHelpers';
import LoadingSpinner from '../common/LoadingSpinner';

export default function EditRelationshipDialog({ isOpen, onClose, relationship, onSuccess }) {
  const [error, setError] = useState('');
  const { updateRelationship, loading } = useUpdateRelationship();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(
      relationshipSchema.pick(['startDate', 'endDate', 'notes'])
    ),
    defaultValues: {
      startDate: '',
      endDate: '',
      notes: '',
    },
  });

  useEffect(() => {
    if (relationship) {
      reset({
        startDate: relationship.startDate
          ? relationship.startDate.split('T')[0]
          : '',
        endDate: relationship.endDate
          ? relationship.endDate.split('T')[0]
          : '',
        notes: relationship.notes || '',
      });
    }
  }, [relationship, reset]);

  const onSubmit = async (data) => {
    try {
      setError('');

      await updateRelationship(relationship.id, {
        startDate: data.startDate || null,
        endDate: data.endDate || null,
        notes: data.notes || null,
      });

      onSuccess();
    } catch (err) {
      setError(err.message || 'Failed to update relationship');
    }
  };

  if (!isOpen) return null;

  const relatedMember = relationship?.relatedMember || {};

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Edit Relationship</h2>
          <button
            onClick={onClose}
            disabled={loading}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Relationship Info (Read-only) */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Relationship</p>
            <p className="text-lg font-semibold text-gray-900">
              {formatFullName(relatedMember)} -{' '}
              {getRelationshipLabel(relationship?.relationshipType)}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              (Member and relationship type cannot be changed)
            </p>
          </div>

          {/* Edit Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date
                </label>
                <Controller
                  name="startDate"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="date"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.startDate ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                  )}
                />
                {errors.startDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.startDate.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                <Controller
                  name="endDate"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="date"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.endDate ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                  )}
                />
                {errors.endDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.endDate.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
              <Controller
                name="notes"
                control={control}
                render={({ field }) => (
                  <textarea
                    {...field}
                    rows="4"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.notes ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Optional notes about this relationship..."
                  />
                )}
              />
              {errors.notes && (
                <p className="mt-1 text-sm text-red-600">{errors.notes.message}</p>
              )}
            </div>

            <div className="flex gap-3 justify-end pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5 mr-2" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
