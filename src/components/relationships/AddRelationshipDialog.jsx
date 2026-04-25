import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { X, Save } from 'lucide-react';
import { useCreateRelationship } from '../../hooks/useCreateRelationship';
import { relationshipSchema, parentChildSchema, spouseSchema } from '../../utils/validation';
import { RELATIONSHIP_TYPE_OPTIONS } from '../../utils/constants';
import { validateRelationshipMembers } from '../../utils/relationshipHelpers';
import MemberSearchDropdown from './MemberSearchDropdown';
import LoadingSpinner from '../common/LoadingSpinner';

export default function AddRelationshipDialog({ isOpen, onClose, currentMemberId, onSuccess }) {
  const [activeTab, setActiveTab] = useState('generic'); // 'generic' | 'parent-child' | 'spouse'
  const [error, setError] = useState('');
  const { createRelationship, loading } = useCreateRelationship();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Add Relationship</h2>
          <button
            onClick={onClose}
            disabled={loading}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Tabs */}
        <div className="px-6 pt-4 flex gap-2 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('generic')}
            className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${
              activeTab === 'generic'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Generic
          </button>
          <button
            onClick={() => setActiveTab('parent-child')}
            className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${
              activeTab === 'parent-child'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Parent-Child
          </button>
          <button
            onClick={() => setActiveTab('spouse')}
            className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${
              activeTab === 'spouse'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Spouse
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {activeTab === 'generic' && (
            <GenericRelationshipForm
              currentMemberId={currentMemberId}
              createRelationship={createRelationship}
              loading={loading}
              setError={setError}
              onSuccess={onSuccess}
              onClose={onClose}
            />
          )}

          {activeTab === 'parent-child' && (
            <ParentChildForm
              currentMemberId={currentMemberId}
              createRelationship={createRelationship}
              loading={loading}
              setError={setError}
              onSuccess={onSuccess}
              onClose={onClose}
            />
          )}

          {activeTab === 'spouse' && (
            <SpouseForm
              currentMemberId={currentMemberId}
              createRelationship={createRelationship}
              loading={loading}
              setError={setError}
              onSuccess={onSuccess}
              onClose={onClose}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// Generic Relationship Form
function GenericRelationshipForm({
  currentMemberId,
  createRelationship,
  loading,
  setError,
  onSuccess,
  onClose,
}) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(relationshipSchema),
    defaultValues: {
      toMemberId: '',
      relationshipType: '',
      startDate: '',
      endDate: '',
      notes: '',
    },
  });

  const onSubmit = async (data) => {
    try {
      setError('');

      // Validate members
      const validation = validateRelationshipMembers(currentMemberId, data.toMemberId);
      if (!validation.valid) {
        setError(validation.error);
        return;
      }

      await createRelationship('generic', {
        fromMemberId: currentMemberId,
        toMemberId: data.toMemberId,
        relationshipType: data.relationshipType,
        startDate: data.startDate || null,
        endDate: data.endDate || null,
        notes: data.notes || null,
      });

      onSuccess();
    } catch (err) {
      setError(err.message || 'Failed to create relationship');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Controller
        name="toMemberId"
        control={control}
        render={({ field }) => (
          <MemberSearchDropdown
            value={field.value}
            onChange={field.onChange}
            excludeMemberId={currentMemberId}
            error={errors.toMemberId?.message}
            label="Family Member"
          />
        )}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Relationship Type <span className="text-red-500">*</span>
        </label>
        <Controller
          name="relationshipType"
          control={control}
          render={({ field }) => (
            <select
              {...field}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.relationshipType ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              <option value="">Select type...</option>
              {RELATIONSHIP_TYPE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          )}
        />
        {errors.relationshipType && (
          <p className="mt-1 text-sm text-red-600">{errors.relationshipType.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
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
          {errors.endDate && <p className="mt-1 text-sm text-red-600">{errors.endDate.message}</p>}
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
              rows="3"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.notes ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Optional notes about this relationship..."
            />
          )}
        />
        {errors.notes && <p className="mt-1 text-sm text-red-600">{errors.notes.message}</p>}
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
              Creating...
            </>
          ) : (
            <>
              <Save className="w-5 h-5 mr-2" />
              Add Relationship
            </>
          )}
        </button>
      </div>
    </form>
  );
}

// Parent-Child Form
function ParentChildForm({
  currentMemberId,
  createRelationship,
  loading,
  setError,
  onSuccess,
  onClose,
}) {
  const [role, setRole] = useState('parent'); // 'parent' or 'child'

  // Use simpler validation - just validate the member we're selecting
  const simpleSchema = yup.object({
    otherMemberId: yup.string().required('Please select a family member'),
    notes: yup.string().max(500, 'Notes must be less than 500 characters'),
  });


  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(simpleSchema),
    defaultValues: {
      otherMemberId: '',
      notes: '',
    },
  });

  const onSubmit = async (data) => {
    try {
      setError('');
      console.log(currentMemberId)

      const parentId = role === 'parent' ? currentMemberId : data.otherMemberId;
      const childId = role === 'child' ? currentMemberId : data.otherMemberId;

      // Validate members
      const validation = validateRelationshipMembers(parentId, childId);
      if (!validation.valid) {
        setError(validation.error);
        return;
      }

      await createRelationship('parent-child', {
        parentId,
        childId,
        notes: data.notes || null,
      });

      onSuccess();
    } catch (err) {
      setError(err.message || 'Failed to create relationship');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">I am</label>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => setRole('parent')}
            className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
              role === 'parent'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Parent
          </button>
          <button
            type="button"
            onClick={() => setRole('child')}
            className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
              role === 'child'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Child
          </button>
        </div>
      </div>

      <Controller
        name="otherMemberId"
        control={control}
        render={({ field }) => (
          <MemberSearchDropdown
            value={field.value}
            onChange={field.onChange}
            excludeMemberId={currentMemberId}
            error={errors.otherMemberId?.message}
            label={role === 'parent' ? 'Child' : 'Parent'}
          />
        )}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
        <Controller
          name="notes"
          control={control}
          render={({ field }) => (
            <textarea
              {...field}
              rows="3"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Optional notes..."
            />
          )}
        />
        {errors.notes && <p className="mt-1 text-sm text-red-600">{errors.notes.message}</p>}
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
              Creating...
            </>
          ) : (
            <>
              <Save className="w-5 h-5 mr-2" />
              Add Relationship
            </>
          )}
        </button>
      </div>
    </form>
  );
}

// Spouse Form
function SpouseForm({
  currentMemberId,
  createRelationship,
  loading,
  setError,
  onSuccess,
  onClose,
}) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(spouseSchema),
    defaultValues: {
      spouseId: '',
      marriageDate: '',
      divorceDate: '',
      notes: '',
    },
  });

  const onSubmit = async (data) => {
    try {
      setError('');

      // Validate members
      const validation = validateRelationshipMembers(currentMemberId, data.spouseId);
      if (!validation.valid) {
        setError(validation.error);
        return;
      }

      await createRelationship('spouse', {
        spouseId1: currentMemberId,
        spouseId2: data.spouseId,
        marriageDate: data.marriageDate || null,
        divorceDate: data.divorceDate || null,
        notes: data.notes || null,
      });

      onSuccess();
    } catch (err) {
      setError(err.message || 'Failed to create relationship');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Controller
        name="spouseId"
        control={control}
        render={({ field }) => (
          <MemberSearchDropdown
            value={field.value}
            onChange={field.onChange}
            excludeMemberId={currentMemberId}
            error={errors.spouseId?.message}
            label="Spouse"
          />
        )}
      />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Marriage Date</label>
          <Controller
            name="marriageDate"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="date"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.marriageDate ? 'border-red-300' : 'border-gray-300'
                }`}
              />
            )}
          />
          {errors.marriageDate && (
            <p className="mt-1 text-sm text-red-600">{errors.marriageDate.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Divorce Date</label>
          <Controller
            name="divorceDate"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="date"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.divorceDate ? 'border-red-300' : 'border-gray-300'
                }`}
              />
            )}
          />
          {errors.divorceDate && <p className="mt-1 text-sm text-red-600">{errors.divorceDate.message}</p>}
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
              rows="3"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.notes ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Optional notes..."
            />
          )}
        />
        {errors.notes && <p className="mt-1 text-sm text-red-600">{errors.notes.message}</p>}
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
              Creating...
            </>
          ) : (
            <>
              <Save className="w-5 h-5 mr-2" />
              Add Relationship
            </>
          )}
        </button>
      </div>
    </form>
  );
}
