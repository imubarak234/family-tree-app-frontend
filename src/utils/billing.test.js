import test from 'node:test';
import assert from 'node:assert/strict';
import {
  canDownloadInvoicePdf,
  getBillingStatusMeta,
  getUsageLabel,
  isFamilyOwner,
  mapBillingError,
} from './billing.js';
import { buildInvoicePdfHtml } from './invoicePdf.js';

test('owner gating enables billing actions only for family owners', () => {
  const ownerMembership = { id: 'family-1', role: 'Owner' };
  const adminMembership = { id: 'family-1', role: 'Admin' };
  const user = { id: 'u1' };

  assert.equal(isFamilyOwner(ownerMembership, user), true);
  assert.equal(isFamilyOwner(adminMembership, user), false);
});

test('entitlement usage labels support limited and unlimited states', () => {
  assert.equal(getUsageLabel(12, 50), '12 / 50');
  assert.equal(getUsageLabel(42, null), '42 / Unlimited');
});

test('billing error mapping returns product-approved copy', () => {
  assert.equal(
    mapBillingError({ response: { status: 402, data: { code: 'SubscriptionRequired' } } }),
    'A paid subscription is required for this action.',
  );

  assert.equal(
    mapBillingError({ response: { status: 402, data: { code: 'EntitlementExceeded' } } }),
    'You’ve reached your plan limit. Upgrade to continue.',
  );

  assert.equal(
    mapBillingError({ response: { status: 409, data: { code: 'TrialAlreadyUsed' } } }),
    'This family has already used its free trial.',
  );
});

test('invoice PDF availability and HTML generation work with complete invoice data', () => {
  const invoice = {
    id: 'inv-1',
    invoiceNumber: 'INV-001',
    status: 'paid',
    dueAt: new Date().toISOString(),
    paidAt: null,
    currency: 'NGN',
    subtotalKobo: 10000,
    totalKobo: 10000,
    items: [
      {
        id: 'line-1',
        description: 'Plan charge',
        quantity: 1,
        unitAmountKobo: 10000,
        totalKobo: 10000,
      },
    ],
  };

  assert.equal(canDownloadInvoicePdf(invoice), true);
  assert.equal(getBillingStatusMeta('active').label, 'Active');

  const html = buildInvoicePdfHtml(invoice);
  assert.match(html, /Invoice INV-001/);
  assert.match(html, /Plan charge/);
  assert.match(html, /NGN|₦/);
});

test('invoice PDF is disabled when required invoice fields are missing', () => {
  assert.equal(canDownloadInvoicePdf(null), false);
  assert.equal(canDownloadInvoicePdf({ id: 'x', invoiceNumber: 'INV-1', items: [] }), false);
});
