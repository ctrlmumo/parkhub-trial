/*Helper functions for the application*/

/**
 * ParkHub - Helper Functions
 * 
 * This file contains reusable utility functions used throughout the app.
 * These are pure functions that don't modify their inputs and always
 * return the same output for the same input.
 */

import { 
    SLOT_STATUS, 
    SLOT_COLORS, 
    SLOT_LABELS,
    HOURLY_RATE,
    VALIDATION,
    REGEX_PATTERNS 
  } from './constants';
  
  /* DATE & TIME FORMATTING */
  
  /**
   * Format a date string to readable format
   * 
   * @param {string|Date} dateString - ISO date string or Date object
   * @returns {string} - Formatted date (e.g., "Jan 15, 2024")
   * 
   * Example:
   * formatDate('2024-01-15T10:30:00') → "Jan 15, 2024"
   */
  export const formatDate = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  /**
   * Format a date and time string to readable format
   * 
   * @param {string|Date} dateString - ISO date string or Date object
   * @returns {string} - Formatted date and time (e.g., "Jan 15, 2024 at 10:30 AM")
   * 
   * Example:
   * formatDateTime('2024-01-15T10:30:00') → "Jan 15, 2024 at 10:30 AM"
   */
  export const formatDateTime = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };
  
  /**
   * Format time only
   * 
   * @param {string|Date} dateString - ISO date string or Date object
   * @returns {string} - Formatted time (e.g., "10:30 AM")
   * 
   * Example:
   * formatTime('2024-01-15T10:30:00') → "10:30 AM"
   */
  export const formatTime = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };
  
  /**
   * Get relative time (e.g., "2 hours ago", "in 3 days")
   * 
   * @param {string|Date} dateString - ISO date string or Date object
   * @returns {string} - Relative time string
   * 
   * Example:
   * getRelativeTime(twoHoursAgo) → "2 hours ago"
   */
  export const getRelativeTime = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    
    return formatDate(dateString);
  };
  
  /**
   * Calculate time remaining until a specific date
   * 
   * @param {string|Date} endDate - End date/time
   * @returns {string} - Time remaining (e.g., "2h 30m")
   * 
   * Example:
   * getTimeRemaining(futureDate) → "2h 30m"
   */
  export const getTimeRemaining = (endDate) => {
    if (!endDate) return 'N/A';
    
    const end = new Date(endDate);
    const now = new Date();
    const diff = end - now;
    
    if (diff <= 0) return 'Expired';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  };
  
  /**
   * Calculate duration between two dates in hours
   * 
   * @param {string|Date} startDate - Start date/time
   * @param {string|Date} endDate - End date/time
   * @returns {number} - Duration in hours
   * 
   * Example:
   * calculateDuration(start, end) → 3.5
   */
  export const calculateDuration = (startDate, endDate) => {
    if (!startDate || !endDate) return 0;
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffInMs = end - start;
    
    return Math.round((diffInMs / (1000 * 60 * 60)) * 10) / 10; // Round to 1 decimal
  };
  
  /* CURRENCY & PRICING */
  
  /**
   * Format amount as Kenyan Shillings
   * 
   * @param {number} amount - Amount to format
   * @returns {string} - Formatted price (e.g., "KES 1,200")
   * 
   * Example:
   * formatPrice(1200) → "KES 1,200"
   */
  export const formatPrice = (amount) => {
    if (amount === null || amount === undefined) return 'KES 0';
    
    return `KES ${Number(amount).toLocaleString()}`;
  };
  
  /**
   * Calculate booking cost based on duration
   * 
   * @param {number} hours - Duration in hours
   * @returns {number} - Total cost in KES
   * 
   * Example:
   * calculateBookingCost(3) → 300
   */
  export const calculateBookingCost = (hours) => {
    if (!hours || hours <= 0) return 0;
    
    return hours * HOURLY_RATE;
  };
  
  /* SLOT STATUS HELPERS */
  
  /**
   * Get color for a slot status
   * 
   * @param {string} status - Slot status (available, occupied, etc.)
   * @returns {string} - HSL color value
   * 
   * Example:
   * getSlotColor('available') → "hsl(142, 60%, 50%)"
   */
  export const getSlotColor = (status) => {
    return SLOT_COLORS[status] || SLOT_COLORS[SLOT_STATUS.MAINTENANCE];
  };
  
  /**
   * Get user-friendly label for slot status
   * 
   * @param {string} status - Slot status
   * @returns {string} - Formatted label
   * 
   * Example:
   * getSlotLabel('under_maintenance') → "Under Maintenance"
   */
  export const getSlotLabel = (status) => {
    return SLOT_LABELS[status] || status;
  };
  
  /**
   * Get CSS class name for slot status
   * 
   * @param {string} status - Slot status
   * @returns {string} - CSS class name
   * 
   * Example:
   * getSlotClassName('available') → "parking-slot-available"
   */
  export const getSlotClassName = (status) => {
    return `parking-slot-${status.replace('_', '-')}`;
  };
  
  /**
   * Check if a slot is bookable
   * 
   * @param {string} status - Slot status
   * @returns {boolean} - True if slot can be booked
   * 
   * Example:
   * isSlotBookable('available') → true
   * isSlotBookable('occupied') → false
   */
  export const isSlotBookable = (status) => {
    return status === SLOT_STATUS.AVAILABLE;
  };
  
  /* VALIDATION FUNCTIONS */
  
  /**
   * Validate email address
   * 
   * @param {string} email - Email to validate
   * @returns {boolean} - True if valid
   * 
   * Example:
   * isValidEmail('user@example.com') → true
   */
  export const isValidEmail = (email) => {
    if (!email) return false;
    return REGEX_PATTERNS.EMAIL.test(email);
  };
  
  /**
   * Validate Kenyan phone number
   * 
   * @param {string} phone - Phone number to validate
   * @returns {boolean} - True if valid
   * 
   * Example:
   * isValidPhone('254712345678') → true
   */
  export const isValidPhone = (phone) => {
    if (!phone) return false;
    return REGEX_PATTERNS.PHONE_KENYA.test(phone);
  };
  
  /**
   * Validate vehicle registration number
   * 
   * @param {string} reg - Registration to validate
   * @returns {boolean} - True if valid
   * 
   * Example:
   * isValidVehicleReg('KAA 123A') → true
   */
  export const isValidVehicleReg = (reg) => {
    if (!reg) return false;
    return REGEX_PATTERNS.VEHICLE_REG.test(reg);
  };
  
  /**
   * Validate password strength
   * 
   * @param {string} password - Password to validate
   * @returns {object} - Validation result with isValid and message
   * 
   * Example:
   * validatePassword('12345') → { isValid: false, message: '...' }
   */
  export const validatePassword = (password) => {
    if (!password) {
      return { isValid: false, message: 'Password is required' };
    }
    
    if (password.length < VALIDATION.PASSWORD_MIN_LENGTH) {
      return { 
        isValid: false, 
        message: `Password must be at least ${VALIDATION.PASSWORD_MIN_LENGTH} characters` 
      };
    }
    
    return { isValid: true, message: '' };
  };
  
  /* STRING UTILITIES */
  
  /**
   * Capitalize first letter of string
   * 
   * @param {string} str - String to capitalize
   * @returns {string} - Capitalized string
   * 
   * Example:
   * capitalize('hello world') → "Hello world"
   */
  export const capitalize = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  };
  
  /**
   * Truncate string to specified length
   * 
   * @param {string} str - String to truncate
   * @param {number} length - Maximum length
   * @returns {string} - Truncated string with ellipsis
   * 
   * Example:
   * truncate('This is a long text', 10) → "This is a..."
   */
  export const truncate = (str, length = 50) => {
    if (!str) return '';
    if (str.length <= length) return str;
    return str.substring(0, length) + '...';
  };
  
  /**
   * Convert string to URL-friendly slug
   * 
   * @param {string} str - String to convert
   * @returns {string} - URL slug
   * 
   * Example:
   * slugify('Hello World!') → "hello-world"
   */
  export const slugify = (str) => {
    if (!str) return '';
    return str
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };
  
  /* ARRAY UTILITIES */
  
  /**
   * Group array of objects by a key
   * 
   * @param {Array} array - Array to group
   * @param {string} key - Key to group by
   * @returns {object} - Grouped object
   * 
   * Example:
   * groupBy(slots, 'status') → { available: [...], occupied: [...] }
   */
  export const groupBy = (array, key) => {
    if (!array || !Array.isArray(array)) return {};
    
    return array.reduce((result, item) => {
      const groupKey = item[key];
      if (!result[groupKey]) {
        result[groupKey] = [];
      }
      result[groupKey].push(item);
      return result;
    }, {});
  };
  
  /**
   * Sort array of objects by key
   * 
   * @param {Array} array - Array to sort
   * @param {string} key - Key to sort by
   * @param {string} order - 'asc' or 'desc'
   * @returns {Array} - Sorted array
   * 
   * Example:
   * sortBy(bookings, 'created_at', 'desc')
   */
  export const sortBy = (array, key, order = 'asc') => {
    if (!array || !Array.isArray(array)) return [];
    
    return [...array].sort((a, b) => {
      const aVal = a[key];
      const bVal = b[key];
      
      if (order === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });
  };
  
  /* LOCAL STORAGE HELPERS */
  
  /**
   * Safely get item from localStorage
   * 
   * @param {string} key - Storage key
   * @returns {any} - Parsed value or null
   * 
   * Example:
   * getFromStorage('user') → { id: 1, name: 'John' }
   */
  export const getFromStorage = (key) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error reading from localStorage (${key}):`, error);
      return null;
    }
  };
  
  /**
   * Safely set item in localStorage
   * 
   * @param {string} key - Storage key
   * @param {any} value - Value to store
   * @returns {boolean} - Success status
   * 
   * Example:
   * saveToStorage('user', userData)
   */
  export const saveToStorage = (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error saving to localStorage (${key}):`, error);
      return false;
    }
  };
  
  /**
   * Remove item from localStorage
   * 
   * @param {string} key - Storage key
   * @returns {boolean} - Success status
   */
  export const removeFromStorage = (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing from localStorage (${key}):`, error);
      return false;
    }
  };
  
  /* DEBOUNCE & THROTTLE */
  
  /**
   * Debounce function - delays execution until after wait time
   * Useful for search inputs to avoid excessive API calls
   * 
   * @param {Function} func - Function to debounce
   * @param {number} wait - Wait time in milliseconds
   * @returns {Function} - Debounced function
   * 
   * Example:
   * const debouncedSearch = debounce(searchFunction, 500);
   */
  export const debounce = (func, wait = 300) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };
  
  /* MISC UTILITIES */
  
  /**
   * Generate a unique ID
   * 
   * @returns {string} - Unique ID
   * 
   * Example:
   * generateId() → "1705324800000_abc123"
   */
  export const generateId = () => {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };
  
  /**
   * Deep clone an object
   * 
   * @param {any} obj - Object to clone
   * @returns {any} - Cloned object
   * 
   * Example:
   * const copy = deepClone(originalObject)
   */
  export const deepClone = (obj) => {
    return JSON.parse(JSON.stringify(obj));
  };
  
  /**
   * Check if value is empty (null, undefined, empty string, empty array)
   * 
   * @param {any} value - Value to check
   * @returns {boolean} - True if empty
   * 
   * Example:
   * isEmpty('') → true
   * isEmpty([]) → true
   */
  export const isEmpty = (value) => {
    if (value === null || value === undefined) return true;
    if (typeof value === 'string' && value.trim() === '') return true;
    if (Array.isArray(value) && value.length === 0) return true;
    if (typeof value === 'object' && Object.keys(value).length === 0) return true;
    return false;
  };