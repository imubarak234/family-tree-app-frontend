import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useRelationships } from '../../hooks/useRelationships';
import { useDeleteRelationship } from '../../hooks/useDeleteRelationship';
import { groupRelationships, getRelationshipLabel } from '../../utils/relationshipHelpers';
import RelationshipCard from './RelationshipCard';
import LoadingSpinner from '../common/LoadingSpinner';
import AddRelationshipDialog from './AddRelationshipDialog';
import EditRelationshipDialog from './EditRelationshipDialog';

export default function RelationshipsList({ memberId, canManage }) {
  const { relationships, loading, error, refetch } = useRelationships(memberId);
  const { deleteRelationship, loading: deleting } = useDeleteRelationship();

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedRelationship, setSelectedRelationship] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [relationshipToDelete, setRelationshipToDelete] = useState(null);

  const handleEdit = (relationship) => {
    setSelectedRelationship(relationship);
    setShowEditDialog(true);
  };

  const handleDelete = (relationship) => {
    setRelationshipToDelete(relationship);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!relationshipToDelete) return;

    try {
      await deleteRelationship(relationshipToDelete.id);
      setShowDeleteConfirm(false);
      setRelationshipToDelete(null);
      refetch();
    } catch (err) {
      alert('Failed to delete relationship: ' + err.message);
    }
  };


  const handleSuccess = () => {
    refetch();
    setShowAddDialog(false);
    setShowEditDialog(false);
    setSelectedRelationship(null);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex justify-center items-center py-8">
          <LoadingSpinner size="md" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      </div>
    );
  }

  console.log('Grouped Relationships', relationships);
  //const groupedRelationships = groupRelationships(relationships);
  const groupedRelationships = groupRelationships(relationships);
  const isEmpty = relationships.length === 0;

  console.log('RelationshipsList - relationships:', relationships);
  console.log('RelationshipsList - groupedRelationships:', groupedRelationships);
  // Order of groups to display
  const groupOrder = ['Parent', 'Child', 'Spouse', 'Partner', 'Sibling'];

  return (
    <>
      <div className="bg-white rounded-xl shadow-md p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Relationships</h2>
          {canManage && (
            <button
              onClick={() => setShowAddDialog(true)}
              className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add
            </button>
          )}
        </div>

        {/* Content */}
        {isEmpty ? (
          <div className="text-center py-8">
            <p className="text-gray-600 text-sm">No relationships yet</p>
            {canManage && (
              <button
                onClick={() => setShowAddDialog(true)}
                className="mt-3 text-sm text-blue-600 hover:underline"
              >
                Add the first relationship
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {groupOrder.map((type) => {
              const group = groupedRelationships[type];
              if (!group || group.length === 0) return null;

              console.log(`Rendering group: ${type} with ${group.length} relationships`, group);

              return (
                <div key={type}>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">
                    {getRelationshipLabel(type, 'from', group.length)} ({group.length})
                  </h3>
                  <div className="space-y-2">
                    {group.map((relationship) => (
                      <RelationshipCard
                        key={relationship.id}
                        relationship={relationship}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        canManage={canManage}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Relationship Dialog */}
      {showAddDialog && (
        <AddRelationshipDialog
          isOpen={showAddDialog}
          onClose={() => setShowAddDialog(false)}
          currentMemberId={memberId}
          onSuccess={handleSuccess}
        />
      )}

      {/* Edit Relationship Dialog */}
      {showEditDialog && selectedRelationship && (
        <EditRelationshipDialog
          isOpen={showEditDialog}
          onClose={() => {
            setShowEditDialog(false);
            setSelectedRelationship(null);
          }}
          relationship={selectedRelationship}
          onSuccess={handleSuccess}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && relationshipToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Delete Relationship?</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this relationship with{' '}
              <strong>
                {relationshipToDelete.relatedMember
                  ? `${relationshipToDelete.relatedMember.firstName} ${relationshipToDelete.relatedMember.lastName}`
                  : 'this person'}
              </strong>
              ? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setRelationshipToDelete(null);
                }}
                disabled={deleting}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-400"
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
