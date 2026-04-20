import { useNavigate } from 'react-router-dom';
import { User, Edit, Eye } from 'lucide-react';
import { formatDate, formatLifespan } from '../../utils/formatters';
import { canEditMember } from '../../utils/permissions';
import { useAuth } from '../../hooks/useAuth';

export default function MemberCard({ member, onEdit }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const showEditButton = canEditMember(user, member);

  const handleClick = () => {
    navigate(`/family/members/${member.id}`);
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden group">
      {/* Photo Section */}
      <div className="aspect-square bg-gradient-to-br from-blue-100 to-purple-100 relative overflow-hidden">
        {member.photo ? (
          <img
            src={member.photo}
            alt={`${member.firstName} ${member.lastName}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <User className="w-24 h-24 text-gray-400" />
          </div>
        )}

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all" />
      </div>

      {/* Info Section */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">
          {member.firstName} {member.middleName && `${member.middleName} `}{member.lastName}
        </h3>

        {member.maidenName && (
          <p className="text-sm text-gray-500 mb-2">
            (née {member.maidenName})
          </p>
        )}

        <p className="text-sm text-gray-600 mb-3">
          {formatLifespan(member.birthDate, member.deathDate, member.vitalStatus)}
        </p>

        {/* Status Badge */}
        <div className="mb-4">
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
              member.vitalStatus === 'Living'
                ? 'bg-green-100 text-green-800'
                : member.vitalStatus === 'Deceased'
                ? 'bg-gray-100 text-gray-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}
          >
            {member.vitalStatus || 'Unknown'}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleClick}
            className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            <Eye className="w-4 h-4 mr-2" />
            View
          </button>

          {showEditButton && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/family/members/${member.id}/edit`);
              }}
              className="inline-flex items-center justify-center px-4 py-2 border border-blue-300 rounded-lg text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors"
            >
              <Edit className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
