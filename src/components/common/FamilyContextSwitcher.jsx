import { useMemo, useState } from 'react';
import { ChevronDown, Globe2, Users, RefreshCw } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

function getMembershipId(membership) {
  return membership?.id || membership?.familyId || membership?.family?.id || '';
}

function getMembershipLabel(membership) {
  return membership?.familyName || membership?.name || membership?.family?.name || membership?.family?.title || 'Family';
}

export default function FamilyContextSwitcher({ variant = 'compact', forceVisible = false, onChanged }) {
  const {
    memberships,
    activeFamilyId,
    activeFamilyName,
    isGlobalAdmin,
    globalModeEnabled,
    globalAccess,
    contextStatus,
    switchFamily,
    switchGlobalMode,
  } = useAuth();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const visibleMemberships = useMemo(
    () => memberships.filter((membership) => getMembershipId(membership)),
    [memberships],
  );

  const hasMultipleMemberships = visibleMemberships.length > 1;
  const shouldRender = forceVisible || hasMultipleMemberships || (isGlobalAdmin && globalAccess);

  if (!shouldRender) return null;

  const activeMembership = visibleMemberships.find((membership) => getMembershipId(membership) === activeFamilyId) || null;
  const label = activeMembership ? getMembershipLabel(activeMembership) : activeFamilyName || (globalModeEnabled ? 'Global mode' : 'No family selected');

  const handleFamilySelect = async (membershipId) => {
    if (!membershipId || membershipId === activeFamilyId) {
      setOpen(false);
      return;
    }

    try {
      setError('');
      setLoading(true);
      await switchFamily(membershipId);
      setOpen(false);
      onChanged?.();
    } catch (switchError) {
      setError(switchError.response?.data?.message || 'Unable to switch family right now.');
    } finally {
      setLoading(false);
    }
  };

  const handleGlobalModeToggle = async () => {
    if (!isGlobalAdmin || !globalAccess) return;

    try {
      setError('');
      setLoading(true);
      if (globalModeEnabled) {
        const firstMembership = visibleMemberships[0];
        if (!firstMembership) return;
        await switchFamily(getMembershipId(firstMembership));
      } else {
        await switchGlobalMode();
      }
      setOpen(false);
      onChanged?.();
    } catch (switchError) {
      setError(switchError.response?.data?.message || 'Unable to update context mode.');
    } finally {
      setLoading(false);
    }
  };

  const compactTrigger = (
    <button
      type="button"
      onClick={() => setOpen((prev) => !prev)}
      className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-700 hover:bg-gray-50 transition-colors"
    >
      <Users className="w-4 h-4 text-blue-600" />
      <span className="max-w-40 truncate">{label}</span>
      <ChevronDown className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} />
    </button>
  );

  const panelTrigger = (
    <button
      type="button"
      onClick={() => setOpen((prev) => !prev)}
      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
    >
      <Users className="w-4 h-4 text-blue-600" />
      <span className="max-w-56 truncate">{label}</span>
      <ChevronDown className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} />
    </button>
  );

  return (
    <div className="relative">
      {variant === 'panel' ? panelTrigger : compactTrigger}

      {open && (
        <div className={`absolute ${variant === 'panel' ? 'left-0 mt-3 w-[360px]' : 'right-0 mt-2 w-80'} z-50 rounded-2xl border border-gray-100 bg-white shadow-xl p-4`}>
          <div className="flex items-center justify-between gap-3 mb-3">
            <div>
              <p className="text-sm font-semibold text-gray-900">Active context</p>
              <p className="text-xs text-gray-500">Switch families or change mode</p>
            </div>
            {contextStatus === 'missing-family-context' && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700">
                <RefreshCw className="w-3 h-3" />
                Recovery needed
              </span>
            )}
          </div>

          {isGlobalAdmin && globalAccess && (
            <button
              type="button"
              onClick={handleGlobalModeToggle}
              disabled={loading}
              className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl mb-3 border transition-colors ${globalModeEnabled ? 'border-blue-200 bg-blue-50 text-blue-700' : 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100'}`}
            >
              <span className="inline-flex items-center gap-2 text-sm font-medium">
                <Globe2 className="w-4 h-4" />
                {globalModeEnabled ? 'Global mode' : 'Family mode'}
              </span>
              <span className="text-xs font-medium uppercase tracking-wide">
                {globalModeEnabled ? 'Active' : 'Switch'}
              </span>
            </button>
          )}

          <div className="space-y-1 max-h-64 overflow-auto pr-1">
            {visibleMemberships.map((membership) => {
              const membershipId = getMembershipId(membership);
              const membershipLabel = getMembershipLabel(membership);
              const isActive = membershipId === activeFamilyId;

              return (
                <button
                  key={membershipId}
                  type="button"
                  onClick={() => handleFamilySelect(membershipId)}
                  disabled={loading}
                  className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-left transition-colors ${isActive ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50 text-gray-700'}`}
                >
                  <span className="min-w-0">
                    <span className="block text-sm font-medium truncate">{membershipLabel}</span>
                    {membership?.role && (
                      <span className="block text-xs text-gray-500 truncate">{membership.role}</span>
                    )}
                  </span>
                  {isActive && <span className="text-xs font-semibold uppercase tracking-wide">Active</span>}
                </button>
              );
            })}
          </div>

          {error && <p className="mt-3 text-xs text-red-600">{error}</p>}

          {loading && (
            <p className="mt-3 text-xs text-gray-500 flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              Updating context...
            </p>
          )}
        </div>
      )}
    </div>
  );
}