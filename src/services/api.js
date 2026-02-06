/*API configuration with Axios for making HTTP requests to the Django backend - WILL EDIT LATER TO MATCH BACKEND*/


import axios from 'axios';
import { STORAGE_KEYS } from '../utils/constants';

/**
 * Get the API base URL from environment variables
 * Falls back to localhost if not set
 */
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

/**
 * Create an Axios instance with default configuration
 * This instance will be used for all API calls throughout the app
 */
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

/* ============================================================================
   REQUEST INTERCEPTOR
   ============================================================================ */

/**
 * Request Interceptor
 * 
 * This runs BEFORE every API request is sent
 * Purpose: Automatically attach the authentication token to requests
 * 
 * How it works:
 * 1. Check if a token exists in localStorage
 * 2. If found, add it to the Authorization header
 * 3. Django will validate this token for protected endpoints
 */
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    
    // If token exists, add it to the request headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log request in development (helpful for debugging)
    if (import.meta.env.DEV) {
      console.log(`🚀 API Request: ${config.method.toUpperCase()} ${config.url}`);
    }
    
    return config;
  },
  (error) => {
    // Handle request setup errors
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

/* ============================================================================
   RESPONSE INTERCEPTOR
   ============================================================================ */

/**
 * Response Interceptor
 * 
 * This runs AFTER every API response is received
 * Purpose: Handle common error scenarios globally
 * 
 * How it works:
 * 1. If response is successful (2xx), just return the data
 * 2. If error occurs, check the status code:
 *    - 401 (Unauthorized): Token expired, logout user
 *    - 403 (Forbidden): User lacks permissions
 *    - 404 (Not Found): Resource doesn't exist
 *    - 500 (Server Error): Backend issue
 */
api.interceptors.response.use(
  (response) => {
    // Success response - log in development
    if (import.meta.env.DEV) {
      console.log(`✅ API Response: ${response.config.url}`, response.data);
    }
    return response;
  },
  (error) => {
    // Extract useful error information
    const status = error.response?.status;
    const message = error.response?.data?.message || error.message;
    const url = error.config?.url;
    
    // Log error in development
    if (import.meta.env.DEV) {
      console.error(`❌ API Error [${status}]: ${url}`, message);
    }
    
    // Handle specific error codes
    switch (status) {
      case 401:
        // Unauthorized - Token is invalid or expired
        console.warn('🔒 Unauthorized: Logging out user');
        handleUnauthorized();
        break;
        
      case 403:
        // Forbidden - User doesn't have permission
        console.warn('🚫 Forbidden: Insufficient permissions');
        break;
        
      case 404:
        // Not Found - Resource doesn't exist
        console.warn('🔍 Not Found:', url);
        break;
        
      case 500:
      case 502:
      case 503:
        // Server Error
        console.error('🔥 Server Error:', status);
        break;
        
      default:
        // Network error or other issue
        if (!error.response) {
          console.error('📡 Network Error: Unable to reach server');
        }
    }
    
    // Return the error so components can handle it
    return Promise.reject(error);
  }
);

/* ============================================================================
   HELPER FUNCTIONS
   ============================================================================ */

/**
 * Handle 401 Unauthorized errors
 * 
 * When a token expires or becomes invalid:
 * 1. Clear all user data from localStorage
 * 2. Redirect to login page
 * 
 * This prevents users from staying "logged in" with invalid tokens
 */
const handleUnauthorized = () => {
  // Clear authentication data
  localStorage.removeItem(STORAGE_KEYS.TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER);
  
  // Only redirect if not already on login page
  if (!window.location.pathname.includes('/login')) {
    window.location.href = '/login';
  }
};

/**
 * Set the authentication token
 * 
 * @param {string} token - JWT token from backend
 * 
 * Usage: After successful login
 * setAuthToken(response.data.token);
 */
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
  } else {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
  }
};

/**
 * Get the current authentication token
 * 
 * @returns {string|null} - Current token or null
 */
export const getAuthToken = () => {
  return localStorage.getItem(STORAGE_KEYS.TOKEN);
};

/**
 * Check if user is authenticated
 * 
 * @returns {boolean} - True if token exists
 */
export const isAuthenticated = () => {
  return !!getAuthToken();
};

/**
 * Clear all authentication data
 * 
 * Usage: On logout
 */
export const clearAuth = () => {
  localStorage.removeItem(STORAGE_KEYS.TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER);
};

/* ============================================================================
   CUSTOM ERROR HANDLER
   ============================================================================ */

/**
 * Extract user-friendly error message from API error
 * 
 * @param {Error} error - Axios error object
 * @returns {string} - User-friendly error message
 * 
 * Usage in components:
 * try {
 *   await api.get('/endpoint');
 * } catch (error) {
 *   const message = getErrorMessage(error);
 *   setError(message);
 * }
 */
export const getErrorMessage = (error) => {
  // Check for response from server
  if (error.response) {
    // Server responded with error
    return error.response.data?.message || 
           error.response.data?.error || 
           error.response.data?.detail ||
           'An error occurred. Please try again.';
  } else if (error.request) {
    // Request made but no response
    return 'No response from server. Please check your internet connection.';
  } else {
    // Something else happened
    return error.message || 'An unexpected error occurred.';
  }
};

/* ============================================================================
   EXPORT
   ============================================================================ */

/**
 * Default export: The configured Axios instance
 * 
 * Usage in other files:
 * import api from '@/services/api';
 * 
 * const response = await api.get('/parking-lots/');
 * const data = await api.post('/bookings/', bookingData);
 */
export default api;