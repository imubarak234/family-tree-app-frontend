import { useNavigate } from 'react-router-dom';
import { User, Calendar, Edit, Trash2, FileText } from 'lucide-react';
import { formatFullName } from '../../utils/formatters';
import { formatRelationshipDates, getRelationshipLabel } from '../../utils/relationshipHelpers';

export default function RelationshipCard({ relationship, onEdit, onDelete, canManage }) {
  const navigate = useNavigate();

  console.log('Rendering RelationshipCard for relationship:', relationship);

  const relatedMember = relationship.toMember || {};
  const dateRange = formatRelationshipDates(relationship.startDate, relationship.endDate);

  const handleCardClick = () => {
    if (relatedMember.id) {
      navigate(`/family/members/${relatedMember.id}`);
    }
  };

  return (
    <div
      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center overflow-hidden">
            {relatedMember.photo ? (
              <img
                src={relatedMember.photo}
                alt={formatFullName(relatedMember)}
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-6 h-6 text-gray-400" />
            )}
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-gray-900 truncate">
            {formatFullName(relatedMember) || 'Unknown'}
          </h4>
          {relatedMember.maidenName && (
            <p className="text-xs text-gray-500">(née {relatedMember.maidenName})</p>
          )}
          <p className="text-xs text-gray-600 mt-1">
            {getRelationshipLabel(relationship.relationshipType, 'from')}
          </p>

          {dateRange && (
            <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
              <Calendar className="w-3 h-3" />
              <span>{dateRange}</span>
            </div>
          )}

          {relationship.notes && (
            <div className="flex items-start gap-1 mt-2 text-xs text-gray-600">
              <FileText className="w-3 h-3 mt-0.5 flex-shrink-0" />
              <p className="line-clamp-2">{relationship.notes}</p>
            </div>
          )}
        </div>

        {/* Actions */}
        {canManage && (
          <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => onEdit(relationship)}
              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
              title="Edit relationship"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(relationship)}
              className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
              title="Delete relationship"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
