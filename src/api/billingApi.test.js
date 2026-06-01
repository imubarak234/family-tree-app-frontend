import test from 'node:test';
import assert from 'node:assert/strict';
import apiClient from './client.js';
import { billingAPI } from './billing.js';
import { adminBillingAPI } from './adminBilling.js';

function withMockedApiClient(mock, fn) {
  const originals = {};
  Object.keys(mock).forEach((key) => {
    originals[key] = apiClient[key];
    apiClient[key] = mock[key];
  });

  try {
    fn();
  } finally {
    Object.keys(mock).forEach((key) => {
      apiClient[key] = originals[key];
    });
  }
}

test('billing API uses expected endpoints', () => {
  const calls = [];
  withMockedApiClient(
    {
      get: (url, options) => calls.push(['get', url, options]),
      post: (url, payload) => calls.push(['post', url, payload]),
    },
    () => {
      billingAPI.getPlans();
      billingAPI.getSubscription();
      billingAPI.getEntitlement();
      billingAPI.startTrial();
      billingAPI.initCheckout('pro_monthly');
      billingAPI.confirmCheckout('pro_monthly', 'ref_1');
      billingAPI.cancelSubscription('sub_1');
      billingAPI.getInvoices({ page: 2, limit: 10 });
      billingAPI.getInvoiceById('inv_1');
    },
  );

  assert.deepEqual(calls[0], ['get', '/billing/plans', undefined]);
  assert.deepEqual(calls[3], ['post', '/billing/trial/start', {}]);
  assert.deepEqual(calls[4], ['post', '/billing/checkout/init', { planCode: 'pro_monthly' }]);
  assert.deepEqual(calls[5], ['post', '/billing/checkout/confirm', { planCode: 'pro_monthly', reference: 'ref_1' }]);
  assert.deepEqual(calls[6], ['post', '/billing/subscription/sub_1/cancel', undefined]);
  assert.deepEqual(calls[7], ['get', '/billing/invoices', { params: { page: 2, limit: 10 } }]);
  assert.deepEqual(calls[8], ['get', '/billing/invoices/inv_1', undefined]);
});

test('admin billing API uses expected endpoints', () => {
  const calls = [];
  withMockedApiClient(
    {
      get: (url, options) => calls.push(['get', url, options]),
      post: (url, payload) => calls.push(['post', url, payload]),
      patch: (url, payload) => calls.push(['patch', url, payload]),
    },
    () => {
      adminBillingAPI.getPlans();
      adminBillingAPI.createPlan({ name: 'Pro' });
      adminBillingAPI.patchPlan('plan_1', { isActive: false });
      adminBillingAPI.getSubscriptions({ page: 1, limit: 20, status: 'active' });
      adminBillingAPI.getFamilySummary('fam_1');
      adminBillingAPI.expireOverdueSubscriptions();
    },
  );

  assert.deepEqual(calls[0], ['get', '/admin/billing/plans', undefined]);
  assert.deepEqual(calls[1], ['post', '/admin/billing/plans', { name: 'Pro' }]);
  assert.deepEqual(calls[2], ['patch', '/admin/billing/plans/plan_1', { isActive: false }]);
  assert.deepEqual(calls[3], ['get', '/admin/billing/subscriptions', { params: { page: 1, limit: 20, status: 'active' } }]);
  assert.deepEqual(calls[4], ['get', '/admin/billing/families/fam_1', undefined]);
  assert.deepEqual(calls[5], ['post', '/admin/billing/subscriptions/expire-overdue', undefined]);
});
