
// Utility functions for API handling

/**
 * Returns the appropriate backend URL based on the current environment
 * This helps fix CORS issues in production vs development environments
 */
export const getBackendUrl = () => {
  if (typeof window === 'undefined') return 'http://localhost:5000';
  
  // Check if we're in production (lovable preview) or development
  const isProduction = import.meta.env.PROD;
  if (isProduction) {
    // Use a relative URL when in production to avoid CORS issues
    return '/api';
  } else {
    return 'http://localhost:5000';
  }
};

/**
 * Create an AbortController with timeout for API calls
 * @param timeoutMs Timeout in milliseconds
 * @returns Controller and a cleanup function to clear the timeout
 */
export const createTimeoutController = (timeoutMs: number = 30000) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  
  return {
    controller,
    clearTimeout: () => clearTimeout(timeoutId),
    signal: controller.signal
  };
};
