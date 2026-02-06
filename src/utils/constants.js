/* Constant values used throughout the application e.g. API endpoints, error messages*/

/* Parking slot status constants */
export const SLOT_STATUS = {
    AVAILABLE: 'available',
    OCCUPIED: 'occupied',
    RESERVED: 'reserved',
    MAINTENANCE: 'under_maintenance'
  };
  
  /*Color mapping for each slot status*/
  export const SLOT_COLORS = {
    available: 'hsl(142, 60%, 50%)',
    occupied: 'hsl(0, 65%, 55%)',
    reserved: 'hsl(38, 90%, 55%)',
    under_maintenance: 'hsl(215, 15%, 60%)'
  };
  
  /*labels for slot statuses*/
  export const SLOT_LABELS = {
    available: 'Available',
    occupied: 'Occupied',
    reserved: 'Reserved',
    under_maintenance: 'Under Maintenance'
  };
   
  /*User roles*/
  export const USER_ROLES = {
    DRIVER: 'driver',
    ADMIN: 'admin'
  };
  
  
  /*Reservation status*/
  export const BOOKING_STATUS = {
    ACTIVE: 'active',       // Booking is current and valid
    CANCELLED: 'cancelled', // Booking was cancelled by user
    COMPLETED: 'completed'  // Booking time has ended
  };
  
  /*Payment status*/
  export const PAYMENT_STATUS = {
    PENDING: 'pending',
    SUCCESS: 'success',
    FAILED: 'failed'
  };
  

  /*Hourly parking rate*/
  export const HOURLY_RATE = 50;
  
  /*Minimum and maximum booking duration in hours*/
  export const MIN_BOOKING_HOURS = 1;
  export const MAX_BOOKING_HOURS = 24;
  
  /*Dropdown options for booking duration in hours*/
  export const DURATION_OPTIONS = [
    { value: 1, label: '1 hour' },
    { value: 2, label: '2 hours' },
    { value: 3, label: '3 hours' },
    { value: 4, label: '4 hours' },
    { value: 6, label: '6 hours' },
    { value: 8, label: '8 hours' },
    { value: 12, label: '12 hours' },
    { value: 24, label: '24 hours' }
  ];
  
  /* ============================================================================
     API ENDPOINTS (Optional - can also be in services) - WILL EDIT LATER TO MATCH BACKEND
     ============================================================================ */
  
  /**
   * Base API endpoints
   * Note: Full URLs are constructed in services/api.js
   */
  export const API_ENDPOINTS = {
    // Authentication
    LOGIN: '/auth/login/',
    REGISTER: '/auth/register/',
    LOGOUT: '/auth/logout/',
    
    // Parking Lots
    PARKING_LOTS: '/parking-lots/',
    PARKING_LOT_DETAIL: (id) => `/parking-lots/${id}/`,
    PARKING_LOT_SLOTS: (id) => `/parking-lots/${id}/slots/`,
    
    // Parking Slots
    PARKING_SLOTS: '/parking-slots/',
    PARKING_SLOT_DETAIL: (id) => `/parking-slots/${id}/`,
    
    // Bookings/Reservations
    BOOKINGS: '/bookings/',
    BOOKING_DETAIL: (id) => `/bookings/${id}/`,
    MY_BOOKINGS: '/bookings/my-bookings/',
    CREATE_BOOKING: '/bookings/create/',
    CANCEL_BOOKING: (id) => `/bookings/${id}/cancel/`,
    
    // Driver
    DRIVER_STATS: '/driver/stats/',
    DRIVER_BOOKINGS: '/driver/bookings/recent/',
    
    // Admin
    ADMIN_STATS: '/admin/stats/',
    ADMIN_BOOKINGS: '/admin/bookings/recent/',
    ADMIN_ANALYTICS: '/admin/analytics/peak-hours/',
    
    // Payment
    PAYMENT_STATUS: (transactionId) => `/bookings/payment-status/${transactionId}/`
  };
  
 
  /*Breakpoints for responsive design in pixels*/
  export const BREAKPOINTS = {
    MOBILE: 480,
    TABLET: 768,
    DESKTOP: 1024,
    WIDE: 1280
  };
  
  /*Toast/Alert message durations in milliseconds*/
  export const TOAST_DURATION = {
    SHORT: 2000,
    MEDIUM: 3000,
    LONG: 5000
  };
  
  /*Real-time update intervals in milliseconds*/
  export const UPDATE_INTERVALS = {
    PARKING_SLOTS: 10000,
    DASHBOARD: 30000,
    BOOKING_TIMER: 1000
  };
  
  
  /*Validation constants for forms*/
  export const VALIDATION = {
    // Password
    PASSWORD_MIN_LENGTH: 6,
    PASSWORD_MAX_LENGTH: 255,
    
    // Email
    EMAIL_MAX_LENGTH: 150,
    
    // Username
    USERNAME_MIN_LENGTH: 3,
    USERNAME_MAX_LENGTH: 100,
    
    // Phone Number
    PHONE_MIN_LENGTH: 10,
    PHONE_MAX_LENGTH: 15,
    
    // Vehicle Registration
    VEHICLE_REG_MAX_LENGTH: 20
  };
  
  /*Regex patterns for validation*/
  export const REGEX_PATTERNS = {
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PHONE_KENYA: /^254[17]\d{8}$/,  // Kenyan phone format: 2547XXXXXXXX or 2541XXXXXXXX
    VEHICLE_REG: /^K[A-Z]{2}\s?\d{3}[A-Z]$/  // Kenyan format: KAA 123A
  };
  
  
  /*Error messages*/
  export const ERROR_MESSAGES = {
    // General
    NETWORK_ERROR: 'Network error. Please check your connection.',
    UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
    
    // Authentication
    LOGIN_FAILED: 'Invalid email or password.',
    REGISTRATION_FAILED: 'Registration failed. Please try again.',
    UNAUTHORIZED: 'You are not authorized to access this page.',
    SESSION_EXPIRED: 'Your session has expired. Please login again.',
    
    // Validation
    REQUIRED_FIELD: 'This field is required.',
    INVALID_EMAIL: 'Please enter a valid email address.',
    INVALID_PHONE: 'Please enter a valid phone number (254XXXXXXXXX).',
    INVALID_VEHICLE_REG: 'Please enter a valid vehicle registration (e.g., KAA 123A).',
    PASSWORD_TOO_SHORT: 'Password must be at least 6 characters.',
    PASSWORDS_DONT_MATCH: 'Passwords do not match.',
    
    // Booking
    BOOKING_FAILED: 'Failed to create booking. Please try again.',
    SLOT_UNAVAILABLE: 'This slot is no longer available.',
    PAYMENT_FAILED: 'Payment failed. Please try again.',
    INVALID_DURATION: 'Please select a valid duration.',
    INVALID_TIME: 'End time must be after start time.'
  };
  

  /*Success messages for user feedback*/
  export const SUCCESS_MESSAGES = {
    LOGIN_SUCCESS: 'Login successful! Welcome back.',
    REGISTRATION_SUCCESS: 'Registration successful! Welcome to ParkHub.',
    BOOKING_SUCCESS: 'Booking confirmed! Check your email for details.',
    BOOKING_CANCELLED: 'Booking cancelled successfully.',
    PAYMENT_SUCCESS: 'Payment successful!',
    PROFILE_UPDATED: 'Profile updated successfully.',
    SLOT_UPDATED: 'Slot status updated successfully.'
  };
  
  /* ============================================================================
     LOCAL STORAGE KEYS
     ============================================================================ */
  
  /**
   * Keys for localStorage
   * Prevents typos and makes it easy to change keys later
   */
  export const STORAGE_KEYS = {
    TOKEN: 'parkhub_token',
    USER: 'parkhub_user',
    THEME: 'parkhub_theme',
    REMEMBER_ME: 'parkhub_remember_me'
  };
  

  /*Application metadata*/
  export const APP_INFO = {
    NAME: 'ParkHub',
    VERSION: '1.0.0',
    DESCRIPTION: 'Smart Parking Management System',
    SUPPORT_EMAIL: 'support@parkhub.com',
    SUPPORT_PHONE: '+254 700 000 000'
  };