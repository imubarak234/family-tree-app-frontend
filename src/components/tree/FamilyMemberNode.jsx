import { Handle, Position } from '@xyflow/react';
import { formatLifespan } from '../../utils/formatters';
import defaultAvatar from '../../assets/default-avatar.png';

function getBackendOrigin() {
  const baseUrl = import.meta.env?.VITE_API_BASE_URL || 'http://localhost:3000/api';
  return baseUrl.replace(/\/api\/?$/, '');
}

function getProfilePhotoUrl(profilePhoto) {
  if (!profilePhoto) return defaultAvatar;
  if (profilePhoto.startsWith('http://') || profilePhoto.startsWith('https://')) {
    return profilePhoto;
  }

  return `${getBackendOrigin()}/${profilePhoto.replace(/^\/+/, '')}`;
}

export default function FamilyMemberNode({ data }) {
  const { member } = data;
  const displayPhoto = getProfilePhotoUrl(member.profilePhoto || member.photo);
  const isDeceased = member.isDeceased || member.deathDate;
  const lifespan = formatLifespan(member.birthDate, member.deathDate, isDeceased);

  return (
    <div className="bg-white rounded-lg shadow-lg border-2 border-gray-200 p-3 min-w-[180px]">
      <Handle type="target" position={Position.Top} className="w-2 h-2 bg-blue-500" />

      <div className="flex flex-col items-center gap-2">
        <img
          src={displayPhoto}
          alt={`${member.firstName} ${member.lastName}`}
          className="w-16 h-16 rounded-full object-cover border-2 border-gray-300"
          onError={(e) => {
            e.target.src = defaultAvatar;
          }}
        />

        <div className="text-center">
          <p className="font-semibold text-sm text-gray-900">
            {member.title && `${member.title} `}{member.firstName} {member.lastName}
          </p>
          {lifespan && <p className="text-xs text-gray-600">{lifespan}</p>}
        </div>

        {isDeceased && (
          <span className="px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded">
            Deceased
          </span>
        )}
      </div>

      <Handle type="source" position={Position.Bottom} className="w-2 h-2 bg-blue-500" />
    </div>
  );
}
