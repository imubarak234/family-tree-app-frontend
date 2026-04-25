import { Handle, Position } from '@xyflow/react';
import { formatLifespan } from '../../utils/formatters';

export default function FamilyMemberNode({ data }) {
  const { member } = data;
  const displayPhoto = member.photo || '/default-avatar.png';
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
            e.target.src = '/default-avatar.png';
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
