import { Users, Heart, UserX, Link2, HeartHandshake } from 'lucide-react';
import StatCard from './StatCard';
import { useStatistics } from '../../hooks/useStatistics';

export default function StatisticsGrid() {
  const { statistics, loading, error } = useStatistics();

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
        <p className="text-red-600 text-sm">{error}</p>
      </div>
    );
  }

  const stats = [
    {
      icon: Users,
      label: 'Total Members',
      value: statistics?.totalMembers,
      color: 'blue',
    },
    {
      icon: Heart,
      label: 'Living Members',
      value: statistics?.livingMembers,
      color: 'green',
    },
    {
      icon: UserX,
      label: 'Deceased Members',
      value: statistics?.deceasedMembers,
      color: 'gray',
    },
    {
      icon: Link2,
      label: 'Total Relationships',
      value: statistics?.totalRelationships,
      color: 'purple',
    },
    {
      icon: HeartHandshake,
      label: 'Marriages',
      value: statistics?.marriages,
      color: 'blue',
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {stats.map((stat, index) => (
        <StatCard
          key={index}
          icon={stat.icon}
          label={stat.label}
          value={stat.value}
          loading={loading}
          color={stat.color}
        />
      ))}
    </div>
  );
}
