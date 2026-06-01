import { cloneElement } from 'react';
import { useAuth } from '../../hooks/useAuth';

export default function FamilyScopeBoundary({ children }) {
  const { activeFamilyId, globalModeEnabled, contextStatus } = useAuth();
  const scopeKey = `${activeFamilyId || 'none'}:${globalModeEnabled ? 'global' : 'family'}:${contextStatus}`;

  if (!children) return null;

  return cloneElement(children, { key: scopeKey });
}