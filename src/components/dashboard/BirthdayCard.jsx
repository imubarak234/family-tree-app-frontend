import { useNavigate } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import { formatDate } from '../../utils/formatters';

export default function BirthdayCard({ member, daysUntil, showDeceased = true }) {
  const navigate = useNavigate();

  const isDeceased = member.isDeceased || member.deathDate;
  const displayPhoto = member.photo || '/default-avatar.png';

  return (
    <div
      onClick={() => navigate(`/family/members/${member.id}`)}
      className="flex items-center gap-4 p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
    >
      <img
        src={displayPhoto}
        alt={`${member.firstName} ${member.lastName}`}
        className="w-12 h-12 rounded-full object-cover"
        onError={(e) => {
          e.target.src = '/default-avatar.png';
        }}
      />

      <div className="flex-1">
        <div className="flex items-center gap-2">
          <p className="font-medium text-gray-900">
            {member.firstName} {member.lastName}
          </p>
          {isDeceased && showDeceased && (
            <span className="px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded">
              Deceased
            </span>
          )}
        </div>

        <p className="text-sm text-gray-600 flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          {formatDate(member.birthDate, 'MMM dd, yyyy')}
        </p>
      </div>

      {daysUntil !== undefined && (
        <div className="text-right">
          <p className="text-sm font-medium text-blue-600">
            {daysUntil === 0 ? 'Today!' : `In ${daysUntil} day${daysUntil === 1 ? '' : 's'}`}
          </p>
        </div>
      )}
    </div>
  );
}
