/**
 * Standardized API error handling utilities
 */

/**
 * Handle API errors consistently across the application
 * @param {Error} error - The error object from API call
 * @param {string} defaultMessage - Default error message if none available
 * @param {boolean} logError - Whether to log the error (only in development)
 * @returns {string} - User-friendly error message
 */
export const handleApiError = (error, defaultMessage = "Something went wrong", logError = true) => {
  if (logError && process.env.NODE_ENV === 'development') {
    console.error('API Error:', error);
  }

  // Handle different error response formats
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }

  if (error?.response?.data?.error) {
    return error.response.data.error;
  }

  if (error?.message) {
    return error.message;
  }

  return defaultMessage;
};

/**
 * Wrapper for API calls with consistent error handling
 * @param {Promise} apiCall - The API call promise
 * @param {Object} options - Options for error handling
 * @returns {Promise} - Resolves with data or rejects with standardized error
 */
export const safeApiCall = async (apiCall, options = {}) => {
  const {
    defaultErrorMessage = "Something went wrong",
    logError = true,
    showToast = false,
    toastFunction = null
  } = options;

  try {
    const response = await apiCall;

    // Check if response has expected structure
    if (response?.data?.ok === false) {
      const errorMessage = response.data.message || defaultErrorMessage;
      if (showToast && toastFunction) {
        toastFunction(errorMessage);
      }
      throw new Error(errorMessage);
    }

    return response;
  } catch (error) {
    const errorMessage = handleApiError(error, defaultErrorMessage, logError);

    if (showToast && toastFunction) {
      toastFunction(errorMessage);
    }

    throw new Error(errorMessage);
  }
};

/**
 * Create standardized error state setter
 * @param {Function} setError - Error state setter function
 * @param {Function} setLoading - Loading state setter function (optional)
 * @returns {Function} - Error handler function
 */
export const createErrorHandler = (setError, setLoading = null) => {
  return (error, defaultMessage = "Something went wrong") => {
    const errorMessage = handleApiError(error, defaultMessage);
    setError(errorMessage);
    if (setLoading) setLoading(false);
    return errorMessage;
  };
};

/**
 * Create standardized success handler
 * @param {Function} setSuccess - Success state setter function
 * @param {Function} setLoading - Loading state setter function (optional)
 * @returns {Function} - Success handler function
 */
export const createSuccessHandler = (setSuccess, setLoading = null) => {
  return (message = "Success") => {
    setSuccess(message);
    if (setLoading) setLoading(false);
    return message;
  };
};
