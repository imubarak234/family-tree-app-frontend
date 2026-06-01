/**
 * API Helper Utilities
 * Centralized response normalization and error handling for consistent API integration
 */

/**
 * Unwrap API response envelope consistently
 * Handles both response.data and response.data.data patterns
 * @param {Object} response - Axios response object
 * @returns {*} Normalized data
 */
export function normalizeResponse(response) {
  // Handle both response.data and response.data.data patterns
  const data = response.data?.data ?? response.data;
  return data;
}

/**
 * Centralized error message extraction and user-friendly error handling
 * @param {Error} error - Error object from API call
 * @param {string} defaultMessage - Fallback message if no specific error found
 * @returns {string} User-friendly error message
 */
export function handleApiError(error, defaultMessage) {
  if (error.response) {
    const message = error.response.data?.message;
    const code = error.response.data?.code || error.response.data?.error?.code || error.response.data?.errorCode;
    const validationErrors = error.response.data?.errors;

    const firstValidationMessage = Array.isArray(validationErrors)
      ? validationErrors[0]?.message
      : validationErrors && typeof validationErrors === 'object'
        ? Object.values(validationErrors)[0]
        : null;

    if (error.response.status === 400 && code === 'MissingFamilyContext') {
      return message || 'Please switch to a family context to manage billing.';
    }

    if (error.response.status === 402 && code === 'SubscriptionRequired') {
      return message || 'A paid subscription is required for this action.';
    }

    if (error.response.status === 402 && code === 'EntitlementExceeded') {
      return message || 'You’ve reached your plan limit. Upgrade to continue.';
    }

    if (error.response.status === 409 && code === 'TrialAlreadyUsed') {
      return message || 'This family has already used its free trial.';
    }

    if (error.response.status === 402 && code === 'PaymentVerificationFailed') {
      return message || 'Payment verification failed. Please try again.';
    }

    if (error.response.status === 401 || code === 'InvalidToken' || code === 'Unauthorized') {
      return message || 'Your session has expired. Please log in again.';
    }

    if (error.response.status === 403 || code === 'Forbidden') {
      return message || 'You do not have permission to perform this action.';
    }

    // Map status codes to user-friendly messages
    switch (error.response.status) {
      case 400:
        return firstValidationMessage || message || 'Invalid request. Please check your input.';
      case 401:
        return 'Your session has expired. Please log in again.';
      case 403:
        return 'You do not have permission to perform this action.';
      case 404:
        return message || 'The requested resource was not found.';
      case 429:
        return 'Too many requests right now. Please wait a moment and try again.';
      case 500:
        return 'Server error. Please try again later.';
      default:
        return message || defaultMessage;
    }
  }

  if (error.request) {
    return 'Network error. Please check your connection.';
  }

  return defaultMessage;
}

/**
 * Convert snake_case object keys to camelCase
 * Useful for future backend changes or inconsistent API responses
 * @param {*} obj - Object, array, or primitive to convert
 * @returns {*} Converted object with camelCase keys
 */
export function toCamelCase(obj) {
  if (!obj || typeof obj !== 'object') return obj;

  if (Array.isArray(obj)) {
    return obj.map(toCamelCase);
  }

  return Object.keys(obj).reduce((acc, key) => {
    const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    acc[camelKey] = toCamelCase(obj[key]);
    return acc;
  }, {});
}
