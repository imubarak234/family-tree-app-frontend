import { useState, useEffect, useRef } from 'react';
import { Search, User, X } from 'lucide-react';
import { useMembers } from '../../hooks/useMembers';
import { useDebounce } from '../../hooks/useDebounce';
import { formatDate } from '../../utils/formatters';
import LoadingSpinner from '../common/LoadingSpinner';

export default function MemberSearchDropdown({
  value,
  onChange,
  excludeMemberId,
  error,
  label = 'Select Member',
  placeholder = 'Search for a family member...',
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const dropdownRef = useRef(null);

  const debouncedSearch = useDebounce(searchTerm, 300);

  const { data, loading } = useMembers({
    name: debouncedSearch,
  });

  console.log('Fetched members data:', data); // Debug log to check API response structure

  const members = (data?.members || []).filter(
    (member) => member.id !== excludeMemberId
  );

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectMember = (member) => {
    setSelectedMember(member);
    onChange(member.id);
    setSearchTerm('');
    setShowDropdown(false);
  };

  const handleClear = () => {
    setSelectedMember(null);
    onChange('');
    setSearchTerm('');
  };

  const handleInputFocus = () => {
    setShowDropdown(true);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} <span className="text-red-500">*</span>
      </label>

      {/* Selected Member Display or Search Input */}
      {selectedMember ? (
        <div
          className={`w-full px-4 py-3 border rounded-lg flex items-center justify-between ${
            error ? 'border-red-300' : 'border-gray-300'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center overflow-hidden flex-shrink-0">
              {selectedMember.photo ? (
                <img
                  src={selectedMember.photo}
                  alt={`${selectedMember.firstName} ${selectedMember.lastName}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-4 h-4 text-gray-400" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                {selectedMember.firstName} {selectedMember?.middleName ? `${selectedMember?.middleName} ` : ''}{selectedMember.lastName}
              </p>
              {selectedMember.birthDate && (
                <p className="text-xs text-gray-500">
                  Born {formatDate(selectedMember.birthDate, 'yyyy')}
                </p>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={handleClear}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      ) : (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={handleInputFocus}
            placeholder={placeholder}
            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              error ? 'border-red-300' : 'border-gray-300'
            }`}
          />
        </div>
      )}

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}

      {/* Dropdown */}
      {showDropdown && !selectedMember && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white shadow-lg rounded-lg max-h-60 overflow-y-auto z-10 border border-gray-200">
          {loading ? (
            <div className="p-4 flex justify-center">
              <LoadingSpinner size="sm" />
            </div>
          ) : members.length === 0 ? (
            <div className="p-4 text-center text-sm text-gray-500">
              {debouncedSearch ? 'No members found' : 'Start typing to search'}
            </div>
          ) : (
            <div>
              {members.map((member) => (
                <button
                  key={member.id}
                  type="button"
                  onClick={() => handleSelectMember(member)}
                  className="w-full p-3 hover:bg-gray-50 transition-colors text-left flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                    {member.photo ? (
                      <img
                        src={member.photo}
                        alt={`${member.firstName} ${member?.middleName ? `${member?.middleName} ` : ''}${member.lastName}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {member.firstName} {member?.middleName ? `${member?.middleName} ` : ''}{member.lastName}
                    </p>
                    {member.birthDate && (
                      <p className="text-xs text-gray-500">
                        Born {formatDate(member.birthDate, 'yyyy')}
                      </p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
