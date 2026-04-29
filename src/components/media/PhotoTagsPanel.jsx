import { useState } from 'react';
import { X, Tag, User, Loader2 } from 'lucide-react';
import { usePhotoTags } from '../../hooks/usePhotoTags';
import { useAddPhotoTag } from '../../hooks/useAddPhotoTag';
import { useRemovePhotoTag } from '../../hooks/useRemovePhotoTag';
import MemberSearchDropdown from '../relationships/MemberSearchDropdown';
import { formatFullName } from '../../utils/formatters';

export default function PhotoTagsPanel({ photoId, canTag }) {
  const { data: tags, loading, refetch } = usePhotoTags(photoId);
  const { addPhotoTag, loading: addLoading } = useAddPhotoTag();
  const { removePhotoTag } = useRemovePhotoTag();

  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [addError, setAddError] = useState(null);

  const handleAdd = async () => {
    if (!selectedMemberId) return;
    setAddError(null);
    try {
      await addPhotoTag(photoId, selectedMemberId);
      setSelectedMemberId('');
      refetch();
    } catch (err) {
      setAddError(err.message);
    }
  };

  const handleRemove = async (tagId) => {
    try {
      await removePhotoTag(photoId, tagId);
      refetch();
    } catch {
      // silent — tag stays visible until refetch confirms
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Tag className="w-4 h-4 text-gray-500" />
        <h3 className="text-sm font-semibold text-gray-700">People in this photo</h3>
      </div>

      {/* Tag chips */}
      {loading ? (
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Loading tags…</span>
        </div>
      ) : tags.length === 0 ? (
        <p className="text-sm text-gray-400 italic">No one tagged yet.</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => {
            const member = tag.familyMember;
            const name = member ? formatFullName(member) : 'Unknown';
            return (
              <span
                key={tag.id}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-800 text-sm rounded-full border border-blue-100"
              >
                <div className="w-5 h-5 rounded-full bg-blue-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {member?.profilePhoto ? (
                    <img
                      src={member.profilePhoto}
                      alt={name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-3 h-3 text-blue-600" />
                  )}
                </div>
                {name}
                {canTag && (
                  <button
                    type="button"
                    onClick={() => handleRemove(tag.id)}
                    className="ml-0.5 hover:text-blue-600 transition-colors"
                    aria-label={`Remove tag for ${name}`}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </span>
            );
          })}
        </div>
      )}

      {/* Add tag section */}
      {canTag && (
        <div className="space-y-2 pt-1">
          <MemberSearchDropdown
            value={selectedMemberId}
            onChange={setSelectedMemberId}
            label="Tag a person"
            placeholder="Search family members…"
          />
          {addError && (
            <p className="text-xs text-red-600">{addError}</p>
          )}
          <button
            type="button"
            disabled={!selectedMemberId || addLoading}
            onClick={handleAdd}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {addLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Tag className="w-4 h-4" />
            )}
            Add Tag
          </button>
        </div>
      )}
    </div>
  );
}
