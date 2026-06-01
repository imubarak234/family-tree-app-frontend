import { handleApiError } from './apiHelpers.js';
import { formatCurrencyFromKobo } from './formatters.js';

export const BILLING_STATUS_META = {
  trialing: { label: 'Trialing', className: 'bg-blue-100 text-blue-800' },
  active: { label: 'Active', className: 'bg-green-100 text-green-800' },
  past_due: { label: 'Past Due', className: 'bg-amber-100 text-amber-800' },
  canceled: { label: 'Canceled', className: 'bg-gray-200 text-gray-800' },
  expired: { label: 'Expired', className: 'bg-red-100 text-red-800' },
};

export const INVOICE_STATUS_META = {
  draft: { label: 'Draft', className: 'bg-gray-100 text-gray-700' },
  open: { label: 'Open', className: 'bg-blue-100 text-blue-700' },
  paid: { label: 'Paid', className: 'bg-green-100 text-green-700' },
  void: { label: 'Void', className: 'bg-gray-200 text-gray-700' },
  uncollectible: { label: 'Uncollectible', className: 'bg-red-100 text-red-700' },
};

export function formatKoboToCurrency(amountKobo, currency = 'NGN') {
  return formatCurrencyFromKobo(amountKobo, currency);
}

export function getBillingStatusMeta(status) {
  return BILLING_STATUS_META[status] || { label: 'Unknown', className: 'bg-gray-100 text-gray-700' };
}

export function getInvoiceStatusMeta(status) {
  return INVOICE_STATUS_META[status] || { label: 'Unknown', className: 'bg-gray-100 text-gray-700' };
}

function normalizeRoleName(role) {
  if (!role) return '';
  if (typeof role === 'string') return role.toLowerCase();
  if (typeof role?.name === 'string') return role.name.toLowerCase();
  if (typeof role?.code === 'string') return role.code.toLowerCase();
  return '';
}

export function isFamilyOwner(activeMembership, user) {
  if (!activeMembership) return false;

  if (activeMembership.isOwner === true || activeMembership.owner === true) return true;

  const directRole = normalizeRoleName(activeMembership.role);
  if (directRole.includes('owner')) return true;

  if (Array.isArray(activeMembership.roles)) {
    if (activeMembership.roles.some((role) => normalizeRoleName(role).includes('owner'))) {
      return true;
    }
  }

  const userId = user?.id;
  if (userId && activeMembership.ownerUserId && String(activeMembership.ownerUserId) === String(userId)) {
    return true;
  }

  return false;
}

export function getLimitLabel(limit) {
  return limit === null || limit === undefined ? 'Unlimited' : String(limit);
}

export function getUsageLabel(used, limit) {
  if (limit === null || limit === undefined) {
    return `${used} / Unlimited`;
  }

  return `${used} / ${limit}`;
}

export function mapBillingError(error, fallback = 'Unable to complete billing action.') {
  const code = error?.response?.data?.code
    || error?.response?.data?.error?.code
    || error?.response?.data?.errorCode;

  if (error?.response?.status === 402 && code === 'SubscriptionRequired') {
    return 'A paid subscription is required for this action.';
  }

  if (error?.response?.status === 402 && code === 'EntitlementExceeded') {
    return 'You’ve reached your plan limit. Upgrade to continue.';
  }

  if (error?.response?.status === 409 && code === 'TrialAlreadyUsed') {
    return 'This family has already used its free trial.';
  }

  if (error?.response?.status === 402 && code === 'PaymentVerificationFailed') {
    return 'Payment verification failed. Please try again.';
  }

  if ((error?.response?.status === 400 && code === 'MissingFamilyContext') || code === 'MissingFamilyContext') {
    return 'Please switch to a family context to manage billing.';
  }

  if (error?.response?.status === 401 || error?.response?.status === 403 || code === 'Forbidden') {
    return 'You do not have permission to perform this action.';
  }

  return handleApiError(error, fallback);
}

export function canDownloadInvoicePdf(invoice) {
  if (!invoice) return false;
  if (!invoice.invoiceNumber || !invoice.id) return false;
  if (!Array.isArray(invoice.items) || invoice.items.length === 0) return false;
  return true;
}
