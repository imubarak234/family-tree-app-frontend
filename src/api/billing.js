import apiClient from './client.js';

/**
 * @typedef {Object} BillingPlan
 * @property {string} id
 * @property {string} name
 * @property {string} code
 * @property {string | null} description
 * @property {string} currency
 * @property {number} amountKobo
 * @property {'none' | 'monthly' | 'yearly'} billingCycle
 * @property {number} trialDays
 * @property {number | null} memberLimit
 * @property {number | null} treeNodeLimit
 * @property {number | null} treeDepthLimit
 * @property {boolean} isActive
 * @property {number} sortOrder
 * @property {Record<string, unknown>} metadata
 */

/**
 * @typedef {Object} BillingSubscription
 * @property {string} id
 * @property {string} familyId
 * @property {string} planId
 * @property {'trialing' | 'active' | 'past_due' | 'canceled' | 'expired'} status
 * @property {string} currentPeriodStart
 * @property {string} currentPeriodEnd
 * @property {boolean} cancelAtPeriodEnd
 * @property {string | null} canceledAt
 * @property {string | null} trialStart
 * @property {string | null} trialEnd
 * @property {string | null} providerSubscriptionId
 * @property {string | null} providerCustomerId
 * @property {Record<string, unknown>} metadata
 */

/**
 * @typedef {Object} BillingEntitlement
 * @property {string} familyId
 * @property {string} planCode
 * @property {number | null} memberLimit
 * @property {number | null} treeNodeLimit
 * @property {number | null} treeDepthLimit
 * @property {boolean} isTrialing
 * @property {'trialing' | 'active' | 'past_due' | 'canceled' | 'expired' | null} subscriptionStatus
 * @property {string | null} validUntil
 * @property {string} updatedAt
 */

export const billingAPI = {
  getPlans: () => apiClient.get('/billing/plans'),
  getSubscription: () => apiClient.get('/billing/subscription'),
  getEntitlement: () => apiClient.get('/billing/entitlement'),
  startTrial: () => apiClient.post('/billing/trial/start', {}),
  initCheckout: (planCode) => apiClient.post('/billing/checkout/init', { planCode }),
  confirmCheckout: (planCode, reference) => apiClient.post('/billing/checkout/confirm', { planCode, reference }),
  cancelSubscription: (subscriptionId) => apiClient.post(`/billing/subscription/${subscriptionId}/cancel`),
  getInvoices: (params) => apiClient.get('/billing/invoices', { params }),
  getInvoiceById: (invoiceId) => apiClient.get(`/billing/invoices/${invoiceId}`),
};
