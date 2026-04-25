import { useNavigate } from 'react-router-dom';
import { Calendar, ChevronRight } from 'lucide-react';
import LoadingSpinner from '../common/LoadingSpinner';
import BirthdayCard from './BirthdayCard';

export default function BirthdayWidget({
  birthdays,
  loading,
  error,
  title = 'Upcoming Birthdays',
  showViewAll = true,
}) {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-600" />
          {title}
        </h3>
        <LoadingSpinner size="md" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-600" />
          {title}
        </h3>
        <p className="text-sm text-red-600">{error}</p>
      </div>
    );
  }

  const displayBirthdays = birthdays.slice(0, 5);

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-600" />
          {title}
        </h3>
        {showViewAll && (
          <button
            onClick={() => navigate('/family/birthdays')}
            className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            View All
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {displayBirthdays.length === 0 ? (
        <p className="text-gray-500 text-sm text-center py-4">No birthdays in this period</p>
      ) : (
        <div className="space-y-3">
          {displayBirthdays.map((item) => (
            <BirthdayCard
              key={item.member.id}
              member={item.member}
              daysUntil={item.daysUntil}
              showDeceased={true}
            />
          ))}
        </div>
      )}
    </div>
  );
}
