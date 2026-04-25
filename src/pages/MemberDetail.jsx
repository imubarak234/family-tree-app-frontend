import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Edit, Trash2, ArrowLeft, User, Calendar, MapPin, Briefcase, Mail, Phone } from 'lucide-react';
import { useMemberDetail } from '../hooks/useMemberDetail';
import { useDeleteMember } from '../hooks/useDeleteMember';
import { canEditMember, canDeleteMember, canManageRelationships } from '../utils/permissions';
import { useAuth } from '../hooks/useAuth';
import { formatDate, formatFullName, calculateAge } from '../utils/formatters';
import LoadingSpinner from '../components/common/LoadingSpinner';
import StatusBadge from '../components/common/StatusBadge';
import RelationshipsList from '../components/relationships/RelationshipsList';

export default function MemberDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { member, loading, error } = useMemberDetail(id);
  const { deleteMember, loading: deleting } = useDeleteMember();

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const canEdit = member && canEditMember(user, member);
  const canDelete = canDeleteMember(user);

  const handleDelete = async () => {
    try {
      await deleteMember(id);
      navigate('/family/members');
    } catch (err) {
      alert('Failed to delete member');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !member) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-md p-8 text-center max-w-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Member Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'This member could not be found'}</p>
          <Link
            to="/family/members"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Members
          </Link>
        </div>
      </div>
    );
  }

  const age = member.birthDate && member.vitalStatus === 'Living' ? calculateAge(member.birthDate) : null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          to="/family/members"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Members
        </Link>

        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-32"></div>
          <div className="px-8 pb-8">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between -mt-16 mb-6">
              {/* Photo */}
                <div className="flex items-end gap-6">
                <div className="w-32 h-32 rounded-full border-4 border-white bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center overflow-hidden shadow-lg">
                  {member.photo ? (
                    <img src={member.photo} alt={formatFullName(member)} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-16 h-16 text-gray-400" />
                  )}
                </div>
                <div className="">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {member.title ? `${member.title} ` : ''}{formatFullName(member)}
                  </h1>
                  {member.maidenName && (
                    <p className="text-gray-600 mt-1">(née {member.maidenName})</p>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-4 md:mt-0">
                {canEdit && (
                  <button
                    onClick={() => navigate(`/family/members/${id}/edit`)}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </button>
                )}
                {canDelete && (
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="inline-flex items-center px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </button>
                )}
              </div>
            </div>

            {/* Quick Info */}
            <div className="flex flex-wrap gap-4 mb-6">
              <StatusBadge status={member.vitalStatus} />
              {member.gender && (
                <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  {member.gender}
                </span>
              )}
              {age !== null && (
                <span className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                  {age} years old
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Personal Information</h2>
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {member.birthDate && (
                  <div>
                    <dt className="flex items-center text-sm font-medium text-gray-500 mb-1">
                      <Calendar className="w-4 h-4 mr-2" />
                      Birth Date
                    </dt>
                    <dd className="text-gray-900">{formatDate(member.birthDate)}</dd>
                  </div>
                )}
                {member.birthPlace && (
                  <div>
                    <dt className="flex items-center text-sm font-medium text-gray-500 mb-1">
                      <MapPin className="w-4 h-4 mr-2" />
                      Birth Place
                    </dt>
                    <dd className="text-gray-900">{member.birthPlace}</dd>
                  </div>
                )}
                {member.vitalStatus === 'Deceased' && member.deathDate && (
                  <div>
                    <dt className="flex items-center text-sm font-medium text-gray-500 mb-1">
                      <Calendar className="w-4 h-4 mr-2" />
                      Death Date
                    </dt>
                    <dd className="text-gray-900">{formatDate(member.deathDate)}</dd>
                  </div>
                )}
                {member.vitalStatus === 'Deceased' && member.deathPlace && (
                  <div>
                    <dt className="flex items-center text-sm font-medium text-gray-500 mb-1">
                      <MapPin className="w-4 h-4 mr-2" />
                      Death Place
                    </dt>
                    <dd className="text-gray-900">{member.deathPlace}</dd>
                  </div>
                )}
                {member.occupation && (
                  <div>
                    <dt className="flex items-center text-sm font-medium text-gray-500 mb-1">
                      <Briefcase className="w-4 h-4 mr-2" />
                      Occupation
                    </dt>
                    <dd className="text-gray-900">{member.occupation}</dd>
                  </div>
                )}
              </dl>
            </div>

            {/* Contact Information */}
            {member.vitalStatus === 'Living' && (member.email || member.phone) && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Contact Information</h2>
                <dl className="space-y-3">
                  {member.email && (
                    <div>
                      <dt className="flex items-center text-sm font-medium text-gray-500 mb-1">
                        <Mail className="w-4 h-4 mr-2" />
                        Email
                      </dt>
                      <dd>
                        <a href={`mailto:${member.email}`} className="text-blue-600 hover:underline">
                          {member.email}
                        </a>
                      </dd>
                    </div>
                  )}
                  {member.phone && (
                    <div>
                      <dt className="flex items-center text-sm font-medium text-gray-500 mb-1">
                        <Phone className="w-4 h-4 mr-2" />
                        Phone
                      </dt>
                      <dd>
                        <a href={`tel:${member.phone}`} className="text-blue-600 hover:underline">
                          {member.phone}
                        </a>
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            )}

            {/* Biography */}
            {member.bio && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Biography</h2>
                <p className="text-gray-700 whitespace-pre-wrap">{member.bio}</p>
              </div>
            )}
          </div>

          {/* Sidebar - Relationships */}
          <div className="space-y-6">
            <RelationshipsList
              memberId={id}
              canManage={canManageRelationships(user)}
            />
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Delete Member?</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete <strong>{formatFullName(member)}</strong>?
                This action cannot be undone and will also remove their relationships.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={deleting}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-400"
                >
                  {deleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
