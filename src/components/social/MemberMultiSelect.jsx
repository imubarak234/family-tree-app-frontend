import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { useMembers } from '../../hooks/useMembers';
import { useDebounce } from '../../hooks/useDebounce';
import { formatFullName } from '../../utils/formatters';

export default function MemberMultiSelect({ value = [], onChange, label = 'Related Members' }) {
  const [search, setSearch] = useState('');
  const debounced = useDebounce(search, 250);

  const { data } = useMembers({ name: debounced, limit: 20 });
  const members = data?.members || [];

  const addMember = (id) => {
    if (!id || value.includes(id)) return;
    onChange([...value, id]);
  };

  const removeMember = (id) => {
    onChange(value.filter((v) => v !== id));
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="relative">
        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search family members..."
          className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {search && (
        <div className="max-h-44 overflow-y-auto border border-gray-200 rounded-lg bg-white">
          {members.length === 0 ? (
            <p className="p-3 text-sm text-gray-400">No members found.</p>
          ) : (
            members.map((member) => (
              <button
                key={member.id}
                type="button"
                onClick={() => addMember(member.id)}
                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
              >
                {formatFullName(member)}
              </button>
            ))
          )}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {value.map((id) => (
          <span key={id} className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 border border-blue-100 rounded-full text-xs">
            {id.slice(0, 8)}...
            <button type="button" onClick={() => removeMember(id)} aria-label="Remove member">
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}
