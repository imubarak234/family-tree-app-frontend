import { useState } from 'react';
import { Calendar } from 'lucide-react';
import { useBirthdaysToday } from '../hooks/useBirthdaysToday';
import { useUpcomingBirthdays } from '../hooks/useUpcomingBirthdays';
import { useBirthdaysByMonth } from '../hooks/useBirthdaysByMonth';
import LoadingSpinner from '../components/common/LoadingSpinner';
import BirthdayCard from '../components/dashboard/BirthdayCard';

export default function BirthdayPage() {
  const [activeTab, setActiveTab] = useState('today'); // today | upcoming | month
  const [upcomingDays, setUpcomingDays] = useState(30);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

  const { birthdays: todayBirthdays, loading: todayLoading, error: todayError } = useBirthdaysToday();
  const { birthdays: upcomingBirthdays, loading: upcomingLoading, error: upcomingError } = useUpcomingBirthdays(upcomingDays);
  const { birthdays: monthBirthdays, loading: monthLoading, error: monthError } = useBirthdaysByMonth(selectedMonth);

  const tabs = [
    { id: 'today', label: 'Today', count: todayBirthdays.length },
    { id: 'upcoming', label: 'Upcoming', count: upcomingBirthdays.length },
    { id: 'month', label: 'By Month', count: monthBirthdays.length },
  ];

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'today':
        return (
          <div>
            {todayLoading && <LoadingSpinner size="lg" className="py-12" />}
            {todayError && <p className="text-red-600 text-center py-12">{todayError}</p>}
            {!todayLoading && !todayError && todayBirthdays.length === 0 && (
              <p className="text-gray-500 text-center py-12">No birthdays today</p>
            )}
            {!todayLoading && !todayError && todayBirthdays.length > 0 && (
              <div className="grid gap-4 md:grid-cols-2">
                {todayBirthdays.map((item) => (
                  <BirthdayCard key={item.member.id} member={item.member} daysUntil={0} />
                ))}
              </div>
            )}
          </div>
        );

      case 'upcoming':
        return (
          <div>
            <div className="mb-6 flex items-center gap-4">
              <label className="text-sm font-medium text-gray-700">Show birthdays in the next</label>
              <select
                value={upcomingDays}
                onChange={(e) => setUpcomingDays(Number(e.target.value))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value={7}>7 days</option>
                <option value={14}>14 days</option>
                <option value={30}>30 days</option>
                <option value={60}>60 days</option>
                <option value={90}>90 days</option>
              </select>
            </div>

            {upcomingLoading && <LoadingSpinner size="lg" className="py-12" />}
            {upcomingError && <p className="text-red-600 text-center py-12">{upcomingError}</p>}
            {!upcomingLoading && !upcomingError && upcomingBirthdays.length === 0 && (
              <p className="text-gray-500 text-center py-12">
                No upcoming birthdays in the next {upcomingDays} days
              </p>
            )}
            {!upcomingLoading && !upcomingError && upcomingBirthdays.length > 0 && (
              <div className="grid gap-4 md:grid-cols-2">
                {upcomingBirthdays.map((item) => (
                  <BirthdayCard key={item.member.id} member={item.member} daysUntil={item.daysUntil} />
                ))}
              </div>
            )}
          </div>
        );

      case 'month':
        return (
          <div>
            <div className="mb-6 flex items-center gap-4">
              <label className="text-sm font-medium text-gray-700">Select month</label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {months.map((month, index) => (
                  <option key={index} value={index + 1}>
                    {month}
                  </option>
                ))}
              </select>
            </div>

            {monthLoading && <LoadingSpinner size="lg" className="py-12" />}
            {monthError && <p className="text-red-600 text-center py-12">{monthError}</p>}
            {!monthLoading && !monthError && monthBirthdays.length === 0 && (
              <p className="text-gray-500 text-center py-12">No birthdays in {months[selectedMonth - 1]}</p>
            )}
            {!monthLoading && !monthError && monthBirthdays.length > 0 && (
              <div className="grid gap-4 md:grid-cols-2">
                {monthBirthdays.map((item) => (
                  <BirthdayCard key={item.member.id} member={item.member} daysUntil={item.daysUntil} />
                ))}
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <Calendar className="w-8 h-8 text-blue-600" />
          Family Birthdays
        </h1>
        <p className="text-gray-600">View birthdays of all family members, including those who have passed</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 font-medium transition-colors relative ${
              activeTab === tab.id
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
            {tab.count > 0 && (
              <span className="ml-2 px-2 py-0.5 text-xs bg-blue-100 text-blue-600 rounded-full">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {renderContent()}
    </div>
  );
}
