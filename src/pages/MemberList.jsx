import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Plus, Grid, List, Search, X, RefreshCw, Filter } from 'lucide-react';
import { useMembers } from '../hooks/useMembers';
import { useDebounce } from '../hooks/useDebounce';
import { canCreateMember } from '../utils/permissions';
import { useAuth } from '../hooks/useAuth';
import MemberCard from '../components/common/MemberCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import MemberSearchDropdown from '../components/relationships/MemberSearchDropdown';
import {
  GENDER_OPTIONS,
  RELATIONSHIP_TYPE_OPTIONS,
  VITAL_STATUS_OPTIONS,
} from '../utils/constants';

const DEFAULT_FILTERS = {
  q: '',
  name: '',
  gender: '',
  vitalStatus: '',
  birthYear: '',
  city: '',
  country: '',
  occupation: '',
  birthPlace: '',
  deathPlace: '',
  hasBio: '',
  relatedToMemberId: '',
  relationshipType: '',
  relationDirection: 'either',
  page: '1',
  limit: '20',
};

const RELATION_DIRECTIONS = [
  { value: 'either', label: 'Either direction' },
  { value: 'from', label: 'From selected member' },
  { value: 'to', label: 'To selected member' },
];

const HAS_BIO_OPTIONS = [
  { value: '', label: 'Any bio status' },
  { value: 'true', label: 'Has bio' },
  { value: 'false', label: 'No bio' },
];

const PAGE_LIMIT_OPTIONS = ['10', '20', '50', '100'];

function parseFiltersFromSearchParams(searchParams) {
  const parsed = { ...DEFAULT_FILTERS };

  Object.keys(DEFAULT_FILTERS).forEach((key) => {
    const value = searchParams.get(key);
    if (value !== null) {
      parsed[key] = value;
    }
  });

  return parsed;
}

function cleanParams(params) {
  return Object.entries(params).reduce((acc, [key, value]) => {
    if (value === '' || value === null || value === undefined) {
      return acc;
    }
    acc[key] = value;
    return acc;
  }, {});
}

function normalizeMembersResponse(data) {
  const members = data?.members || data?.items || data?.results || [];
  const total =
    data?.total ||
    data?.count ||
    data?.pagination?.total ||
    data?.meta?.total ||
    members.length;
  const page = Number(data?.page || data?.pagination?.page || data?.meta?.page || 1);
  const limit = Number(data?.limit || data?.pagination?.limit || data?.meta?.limit || 20);

  return {
    members,
    total,
    page,
    limit,
  };
}

export default function MemberList() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const canAdd = canCreateMember(user);

  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [draftFilters, setDraftFilters] = useState(() => parseFiltersFromSearchParams(searchParams));
  const [appliedFilters, setAppliedFilters] = useState(() => parseFiltersFromSearchParams(searchParams));

  const debouncedQ = useDebounce(draftFilters.q, 400);
  const debouncedName = useDebounce(draftFilters.name, 400);
  const debouncedCity = useDebounce(draftFilters.city, 400);
  const debouncedCountry = useDebounce(draftFilters.country, 400);
  const debouncedOccupation = useDebounce(draftFilters.occupation, 400);
  const debouncedBirthPlace = useDebounce(draftFilters.birthPlace, 400);
  const debouncedDeathPlace = useDebounce(draftFilters.deathPlace, 400);

  const queryFilters = useMemo(
    () => ({
      ...appliedFilters,
      q: debouncedQ,
      name: debouncedName,
      city: debouncedCity,
      country: debouncedCountry,
      occupation: debouncedOccupation,
      birthPlace: debouncedBirthPlace,
      deathPlace: debouncedDeathPlace,
    }),
    [
      appliedFilters,
      debouncedQ,
      debouncedName,
      debouncedCity,
      debouncedCountry,
      debouncedOccupation,
      debouncedBirthPlace,
      debouncedDeathPlace,
    ],
  );

  useEffect(() => {
    const cleaned = cleanParams(queryFilters);
    setSearchParams(cleaned, { replace: true });
  }, [queryFilters, setSearchParams]);

  const { data, loading, error } = useMembers(queryFilters);

  const normalized = normalizeMembersResponse(data);
  const members = normalized.members;
  const totalPages = Math.max(1, Math.ceil((normalized.total || 0) / Number(queryFilters.limit || 20)));

  const activeFilterEntries = Object.entries(queryFilters).filter(([key, value]) => {
    if (key === 'page' || key === 'limit') {
      return false;
    }
    return value !== '' && value !== null && value !== undefined;
  });

  const updateDraft = (key, value) => {
    setDraftFilters((prev) => ({ ...prev, [key]: value }));
  };

  const updateApplied = (key, value) => {
    setDraftFilters((prev) => ({ ...prev, [key]: value }));
    setAppliedFilters((prev) => ({ ...prev, [key]: value }));
  };

  const applyStructuredFilters = () => {
    setAppliedFilters((prev) => ({
      ...prev,
      gender: draftFilters.gender,
      vitalStatus: draftFilters.vitalStatus,
      birthYear: draftFilters.birthYear,
      hasBio: draftFilters.hasBio,
      relatedToMemberId: draftFilters.relatedToMemberId,
      relationshipType: draftFilters.relationshipType,
      relationDirection: draftFilters.relationDirection,
      page: draftFilters.page,
      limit: draftFilters.limit,
    }));
  };

  const resetFilters = () => {
    setDraftFilters(DEFAULT_FILTERS);
    setAppliedFilters(DEFAULT_FILTERS);
  };

  const clearFilterChip = (key) => {
    setDraftFilters((prev) => ({ ...prev, [key]: '' }));
    setAppliedFilters((prev) => ({ ...prev, [key]: '', page: '1' }));
  };

  const goToPage = (nextPage) => {
    const safePage = String(Math.min(Math.max(nextPage, 1), totalPages));
    updateApplied('page', safePage);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Family Members</h1>
            <p className="mt-2 text-gray-600">
              {normalized.total || 0} members in the family tree
            </p>
          </div>

          {canAdd && (
            <button
              onClick={() => navigate('/family/members/new')}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg font-medium"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Member
            </button>
          )}
        </div>

        {/* Filters & Search */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm font-semibold text-gray-900">Advanced Search</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
            <div className="md:col-span-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Global search (q)..."
                  value={draftFilters.q}
                  onChange={(e) => updateDraft('q', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="md:col-span-3">
              <input
                type="text"
                placeholder="Name"
                value={draftFilters.name}
                onChange={(e) => updateDraft('name', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="md:col-span-3">
              <input
                type="number"
                placeholder="Birth year"
                value={draftFilters.birthYear}
                onChange={(e) => updateDraft('birthYear', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="md:col-span-3">
              <input
                type="text"
                placeholder="City"
                value={draftFilters.city}
                onChange={(e) => updateDraft('city', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="md:col-span-3">
              <input
                type="text"
                placeholder="Country"
                value={draftFilters.country}
                onChange={(e) => updateDraft('country', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="md:col-span-3">
              <input
                type="text"
                placeholder="Occupation"
                value={draftFilters.occupation}
                onChange={(e) => updateDraft('occupation', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="md:col-span-3">
              <select
                value={draftFilters.gender}
                onChange={(e) => updateDraft('gender', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All genders</option>
                {GENDER_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-3">
              <select
                value={draftFilters.vitalStatus}
                onChange={(e) => updateDraft('vitalStatus', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All status</option>
                {VITAL_STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-3">
              <select
                value={draftFilters.relationshipType}
                onChange={(e) => updateDraft('relationshipType', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Any relationship type</option>
                {RELATIONSHIP_TYPE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-3">
              <select
                value={draftFilters.relationDirection}
                onChange={(e) => updateDraft('relationDirection', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {RELATION_DIRECTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-3">
              <select
                value={draftFilters.hasBio}
                onChange={(e) => updateDraft('hasBio', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {HAS_BIO_OPTIONS.map((option) => (
                  <option key={option.value || 'any'} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-3">
              <input
                type="text"
                placeholder="Birth place"
                value={draftFilters.birthPlace}
                onChange={(e) => updateDraft('birthPlace', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="md:col-span-3">
              <input
                type="text"
                placeholder="Death place"
                value={draftFilters.deathPlace}
                onChange={(e) => updateDraft('deathPlace', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="md:col-span-6">
              <MemberSearchDropdown
                value={draftFilters.relatedToMemberId}
                onChange={(memberId) => updateDraft('relatedToMemberId', memberId ? String(memberId) : '')}
                excludeMemberId={null}
                label="Related to member"
                required={false}
                showLabel={false}
                placeholder="Related to member (autocomplete)"
              />
            </div>

            <div className="md:col-span-3">
              <select
                value={draftFilters.limit}
                onChange={(e) => updateDraft('limit', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {PAGE_LIMIT_OPTIONS.map((limit) => (
                  <option key={limit} value={limit}>
                    {limit} per page
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-3">
              <input
                type="number"
                min="1"
                max={totalPages}
                value={draftFilters.page}
                onChange={(e) => updateDraft('page', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Page"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mb-4">
            <button
              onClick={applyStructuredFilters}
              className="inline-flex items-center px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              <Filter className="w-4 h-4 mr-2" />
              Apply
            </button>
            <button
              onClick={resetFilters}
              className="inline-flex items-center px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Reset
            </button>
          </div>

          {activeFilterEntries.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {activeFilterEntries.map(([key, value]) => (
                <span
                  key={key}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
                >
                  {key}: {String(value)}
                  <button
                    onClick={() => clearFilterChip(key)}
                    className="hover:text-blue-900"
                    aria-label={`Remove filter ${key}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* View Mode Toggle */}
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              {members.length} member{members.length !== 1 ? 's' : ''} on this page
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-blue-100 text-blue-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title="Grid view"
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list'
                    ? 'bg-blue-100 text-blue-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title="List view"
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <LoadingSpinner size="lg" />
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-800">{error}</p>
          </div>
        ) : members.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No members found
            </h3>
            <p className="text-gray-600 mb-6">
              {activeFilterEntries.length > 0
                ? 'Try adjusting your search or filters'
                : 'Start building your family tree by adding the first member'}
            </p>
            {canAdd && activeFilterEntries.length === 0 && (
              <button
                onClick={() => navigate('/family/members/new')}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add First Member
              </button>
            )}
          </div>
        ) : (
          <div
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                : 'space-y-4'
            }
          >
            {members.map((member) => (
              <MemberCard key={member.id} member={member} />
            ))}
          </div>
        )}

        {!loading && !error && normalized.total > 0 && (
          <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-100 px-4 py-3 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-gray-600">
              Page {Number(queryFilters.page)} of {totalPages} • {normalized.total} total results
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => goToPage(Number(queryFilters.page) - 1)}
                disabled={Number(queryFilters.page) <= 1}
                className="px-3 py-2 text-sm rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              <button
                onClick={() => goToPage(Number(queryFilters.page) + 1)}
                disabled={Number(queryFilters.page) >= totalPages}
                className="px-3 py-2 text-sm rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
