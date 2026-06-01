import { useNavigate } from 'react-router-dom';
import { Users, Calendar, GitBranch, Plus } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import StatisticsGrid from '../components/dashboard/StatisticsGrid';
import BirthdayWidget from '../components/dashboard/BirthdayWidget';
import PhotoGalleryWidget from '../components/dashboard/PhotoGalleryWidget';
import DocumentsWidget from '../components/dashboard/DocumentsWidget';
import NewsCarouselWidget from '../components/dashboard/NewsCarouselWidget';
import UpcomingEventsWidget from '../components/dashboard/UpcomingEventsWidget';
import ActivityFeedWidget from '../components/dashboard/ActivityFeedWidget';
import MilestoneSpotlightWidget from '../components/dashboard/MilestoneSpotlightWidget';
import { useBirthdaysToday } from '../hooks/useBirthdaysToday';
import { useUpcomingBirthdays } from '../hooks/useUpcomingBirthdays';
import FamilyContextSwitcher from '../components/common/FamilyContextSwitcher';

export default function Dashboard() {
  const navigate = useNavigate();
  const { contextStatus, activeFamilyId, activeFamilyName, isGlobalAdmin, globalModeEnabled, globalAccess } = useAuth();

  const showRecovery = contextStatus === 'missing-family-context' || (!activeFamilyId && !(isGlobalAdmin && globalModeEnabled && globalAccess));

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">
          {showRecovery
            ? 'Your account needs a family context before family pages can load.'
            : `Welcome back to ${activeFamilyName || 'your family tree management system'}`}
        </p>
      </div>

      {showRecovery && (
        <div className="mb-8 rounded-2xl border border-amber-200 bg-amber-50/80 p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold text-amber-900">Context recovery</p>
              <p className="text-sm text-amber-800 mt-1 max-w-2xl">
                Select a family context to continue. If you are a global admin, you can also switch into global mode.
              </p>
            </div>
            <FamilyContextSwitcher variant="panel" forceVisible />
          </div>
        </div>
      )}

      {!showRecovery && <DashboardContent navigate={navigate} />}
    </div>
  );
}

function DashboardContent({ navigate }) {
  const { birthdays: todayBirthdays, loading: todayLoading, error: todayError } = useBirthdaysToday();
  const { birthdays: upcomingBirthdays, loading: upcomingLoading, error: upcomingError } = useUpcomingBirthdays(30);

  return (
    <>
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
      <div className="grid gap-6 lg:grid-cols-3 mb-8">
        <div className="lg:col-span-2">
          <PhotoGalleryWidget />
        </div>
        <DocumentsWidget />
      </div>

      {/* News + Upcoming Events */}
      <div className="grid gap-6 lg:grid-cols-3 mb-8">
        <div className="lg:col-span-2">
          <NewsCarouselWidget />
        </div>
        <UpcomingEventsWidget />
      </div>

      {/* Timeline Teasers */}
      <div className="grid gap-6 lg:grid-cols-2 mb-8">
        <ActivityFeedWidget />
        <MilestoneSpotlightWidget />
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
    </>
  );
}
