import { useCallback, useEffect, useMemo, useState } from 'react';
import { billingAPI } from '../api/billing';
import { familyAPI } from '../api/family';
import { normalizeResponse } from '../utils/apiHelpers';
import { isFamilyOwner, mapBillingError } from '../utils/billing';
import { useAuth } from './useAuth';

export function useBillingOverview() {
  const { activeMembership, user } = useAuth();

  const [plans, setPlans] = useState([]);
  const [subscription, setSubscription] = useState(null);
  const [entitlement, setEntitlement] = useState(null);
  const [usageStats, setUsageStats] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');
  const [actionLoading, setActionLoading] = useState('');

  const canManage = useMemo(() => isFamilyOwner(activeMembership, user), [activeMembership, user]);

  const fetchOverview = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const [plansResult, subscriptionResult, entitlementResult, statsResult] = await Promise.allSettled([
        billingAPI.getPlans(),
        billingAPI.getSubscription(),
        billingAPI.getEntitlement(),
        familyAPI.getStatistics(),
      ]);

      if (plansResult.status === 'fulfilled') {
        const plansData = normalizeResponse(plansResult.value);
        setPlans(Array.isArray(plansData?.plans) ? plansData.plans : []);
      } else {
        throw plansResult.reason;
      }

      if (subscriptionResult.status === 'fulfilled') {
        const subscriptionData = normalizeResponse(subscriptionResult.value);
        setSubscription(subscriptionData?.subscription || null);

        if (!entitlementResult || entitlementResult.status !== 'fulfilled') {
          setEntitlement(subscriptionData?.entitlement || null);
        }
      } else {
        setSubscription(null);
      }

      if (entitlementResult.status === 'fulfilled') {
        const entitlementData = normalizeResponse(entitlementResult.value);
        setEntitlement(entitlementData?.entitlement || null);
      }

      if (statsResult.status === 'fulfilled') {
        const stats = normalizeResponse(statsResult.value);
        setUsageStats(stats);
      } else {
        setUsageStats(null);
      }
    } catch (err) {
      setError(mapBillingError(err, 'Failed to load billing details.'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      fetchOverview();
    });
  }, [fetchOverview]);

  const performAction = useCallback(async (name, action) => {
    try {
      setActionLoading(name);
      setActionError('');
      const result = await action();
      await fetchOverview();
      return { ok: true, data: result };
    } catch (err) {
      setActionError(mapBillingError(err, 'Unable to complete billing action.'));
      return { ok: false, error: err };
    } finally {
      setActionLoading('');
    }
  }, [fetchOverview]);

  const startTrial = useCallback(() => performAction('trial', () => billingAPI.startTrial()), [performAction]);

  const initCheckout = useCallback((planCode) => (
    performAction('checkout', () => billingAPI.initCheckout(planCode))
  ), [performAction]);

  const confirmCheckout = useCallback((planCode, reference) => (
    performAction('confirm', () => billingAPI.confirmCheckout(planCode, reference))
  ), [performAction]);

  const cancelSubscription = useCallback((subscriptionId) => (
    performAction('cancel', () => billingAPI.cancelSubscription(subscriptionId))
  ), [performAction]);

  return {
    plans,
    subscription,
    entitlement,
    usageStats,
    loading,
    error,
    actionError,
    actionLoading,
    canManage,
    fetchOverview,
    startTrial,
    initCheckout,
    confirmCheckout,
    cancelSubscription,
  };
}
