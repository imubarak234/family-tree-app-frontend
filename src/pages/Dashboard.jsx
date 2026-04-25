import { useNavigate } from 'react-router-dom';
import { Users, Calendar, GitBranch, Plus } from 'lucide-react';
import StatisticsGrid from '../components/dashboard/StatisticsGrid';
import BirthdayWidget from '../components/dashboard/BirthdayWidget';
import { useBirthdaysToday } from '../hooks/useBirthdaysToday';
import { useUpcomingBirthdays } from '../hooks/useUpcomingBirthdays';

export default function Dashboard() {
  const navigate = useNavigate();

  const { birthdays: todayBirthdays, loading: todayLoading, error: todayError } = useBirthdaysToday();
  const { birthdays: upcomingBirthdays, loading: upcomingLoading, error: upcomingError } = useUpcomingBirthdays(30);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome to your family tree management system</p>
      </div>

      {/* Statistics */}
      <div className="mb-8">
        <StatisticsGrid />
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <button
            onClick={() => navigate('/family/members/new')}
            className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow text-left"
          >
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
              <Plus className="w-6 h-6" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">Add New Member</p>
              <p className="text-sm text-gray-600">Add a family member</p>
            </div>
          </button>

          <button
            onClick={() => navigate('/family/members')}
            className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow text-left"
          >
            <div className="p-3 bg-green-50 text-green-600 rounded-lg">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">View All Members</p>
              <p className="text-sm text-gray-600">Browse family members</p>
            </div>
          </button>

          <button
            onClick={() => navigate('/family/tree')}
            className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow text-left"
          >
            <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
              <GitBranch className="w-6 h-6" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">Family Tree</p>
              <p className="text-sm text-gray-600">Visualize relationships</p>
            </div>
          </button>
        </div>
      </div>

      {/* Birthdays */}
      <div className="grid gap-6 lg:grid-cols-2">
        <BirthdayWidget
          birthdays={todayBirthdays}
          loading={todayLoading}
          error={todayError}
          title="Today's Birthdays"
          showViewAll={true}
        />

        <BirthdayWidget
          birthdays={upcomingBirthdays}
          loading={upcomingLoading}
          error={upcomingError}
          title="Upcoming Birthdays (30 days)"
          showViewAll={true}
        />
      </div>
    </div>
  );
}
