import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function ProtectedRoute({ children, requireFamilyContext = false }) {
  const location = useLocation();
  const { isAuthenticated, loading, activeFamilyId, isGlobalAdmin, globalModeEnabled, globalAccess, contextStatus } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const canUseGlobalMode = Boolean(isGlobalAdmin && globalModeEnabled && globalAccess);
  const missingFamilyContext = requireFamilyContext && !activeFamilyId && !canUseGlobalMode;

  if (missingFamilyContext || contextStatus === 'missing-family-context') {
    if (location.pathname !== '/dashboard') {
      return <Navigate to="/dashboard" replace state={{ contextRecovery: true, from: location.pathname }} />;
    }
  }

  return children;
}
