import { createContext, useContext, useState, useEffect } from 'react';
import api, { setAuthToken, clearAuth } from '../services/api';
import { STORAGE_KEYS, USER_ROLES, ERROR_MESSAGES, SUCCESS_MESSAGES } from '../utils/constants';
import { getFromStorage, saveToStorage, removeFromStorage } from '../utils/helpers';

/* ============================================================================
   CREATE CONTEXT
   ============================================================================ */

/*Create the Auth Context - holds authentication state and functions*/
const AuthContext = createContext(null);

/* ============================================================================
   AUTH PROVIDER COMPONENT
   ============================================================================ */

/*AuthProvider Component - wraps the entire app to provide authentication state to all components
 @param {ReactNode} children - Child components
 */
export const AuthProvider = ({ children }) => {
  
  /* ==========================================================================
     STATE MANAGEMENT
     ========================================================================== */
  
  /*Current user object - Contains: { id, username, email, is_admin, phone_number, vehicle_reg }*/
  const [user, setUser] = useState(null);
  
  /*Loading state during initial authentication check - prevents flash of login screen while checking if user is logged in*/
  const [loading, setLoading] = useState(true);
  
  /*Error message for authentication failures*/
  const [error, setError] = useState(null);

  /*Initialization - Check if user is already logged in*/
  
  useEffect(() => {
    const initializeAuth = () => {
      try {
        /*Get stored user data from localStorage*/
        const storedUser = getFromStorage(STORAGE_KEYS.USER);
        const storedToken = getFromStorage(STORAGE_KEYS.TOKEN);
        
        // If both user and token exist, restore the session
        if (storedUser && storedToken) {
          setUser(storedUser);
          setAuthToken(storedToken); // Set token in API headers
          
          // vERIFY TOKEN WITH BACKEND
          // verifyToken();
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        // If error, clear everything
        handleLogout();
      } finally {
        setLoading(false);
      }
    };
    
    initializeAuth();
  }, []); // Empty dependency array = run once on mount

  /*Authentication Functions*/

  /*LOGIN FUNCTION - Authenticates user with email and password
  @param {string} email - User's email
  @param {string} password - User's password
  @returns {Promise<object>} - { success: boolean, error?: string }
  */
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      // Call backend login endpoint
      const response = await api.post('/auth/login/', {
        email,
        password
      });
      
      // Extract token and user data from response
      const { token, user: userData } = response.data;
      
      // Store token and user data
      setAuthToken(token); // Set in API headers
      saveToStorage(STORAGE_KEYS.TOKEN, token); // Save to localStorage
      saveToStorage(STORAGE_KEYS.USER, userData); // Save user data
      
      // Update state
      setUser(userData);
      
      return { 
        success: true, 
        message: SUCCESS_MESSAGES.LOGIN_SUCCESS 
      };
      
    } catch (error) {
      console.error('Login error:', error);
      
      // Extract error message
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          ERROR_MESSAGES.LOGIN_FAILED;
      
      setError(errorMessage);
      
      return { 
        success: false, 
        error: errorMessage 
      };
      
    } finally {
      setLoading(false);
    }
  };

  /**
   * REGISTER FUNCTION
   * 
   * Creates a new user account
   * 
   * @param {object} userData - User registration data
   * @param {string} userData.username - Full name
   * @param {string} userData.email - Email address
   * @param {string} userData.password - Password
   * @param {string} [userData.phoneNumber] - Phone number (optional)
   * @param {string} [userData.vehicleReg] - Vehicle registration (optional)
   * @returns {Promise<object>} - { success: boolean, error?: string }
   * 
   * Usage:
   * const { success } = await register({ username, email, password });
   */
  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      // Call backend register endpoint
      const response = await api.post('/auth/register/', {
        username: userData.username,
        email: userData.email,
        password: userData.password,
        phone_number: userData.phoneNumber || null,
        vehicle_reg: userData.vehicleReg || null
      });
      
      // Extract token and user data from response
      const { token, user: newUser } = response.data;
      
      // Store token and user data (same as login)
      setAuthToken(token);
      saveToStorage(STORAGE_KEYS.TOKEN, token);
      saveToStorage(STORAGE_KEYS.USER, newUser);
      
      // Update state
      setUser(newUser);
      
      return { 
        success: true, 
        message: SUCCESS_MESSAGES.REGISTRATION_SUCCESS 
      };
      
    } catch (error) {
      console.error('Registration error:', error);
      
      // Extract error message
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          ERROR_MESSAGES.REGISTRATION_FAILED;
      
      setError(errorMessage);
      
      return { 
        success: false, 
        error: errorMessage 
      };
      
    } finally {
      setLoading(false);
    }
  };

  /**
   * LOGOUT FUNCTION
   * 
   * Logs out the current user and clears all authentication data
   * 
   * Usage:
   * logout(); // User is logged out
   */
  const logout = async () => {
    try {
      // Optional: Call backend logout endpoint
      // await api.post('/auth/logout/');
      
      // Clear authentication data
      clearAuth(); // Clears token from API headers
      removeFromStorage(STORAGE_KEYS.TOKEN);
      removeFromStorage(STORAGE_KEYS.USER);
      
      // Clear state
      setUser(null);
      setError(null);
      
    } catch (error) {
      console.error('Logout error:', error);
      // Even if backend call fails, still logout locally
      clearAuth();
      removeFromStorage(STORAGE_KEYS.TOKEN);
      removeFromStorage(STORAGE_KEYS.USER);
      setUser(null);
    }
  };

  /**
   * UPDATE USER FUNCTION
   * 
   * Updates the current user's information
   * 
   * @param {object} updatedData - Updated user data
   * @returns {Promise<object>} - { success: boolean, error?: string }
   * 
   * Usage:
   * await updateUser({ phone_number: '254712345678' });
   */
  const updateUser = async (updatedData) => {
    try {
      setLoading(true);
      
      // Call backend update endpoint
      const response = await api.put('/auth/profile/', updatedData);
      
      const updatedUser = response.data.user;
      
      // Update stored user data
      saveToStorage(STORAGE_KEYS.USER, updatedUser);
      setUser(updatedUser);
      
      return { success: true };
      
    } catch (error) {
      console.error('Update user error:', error);
      
      const errorMessage = error.response?.data?.message || 
                          'Failed to update profile';
      
      return { 
        success: false, 
        error: errorMessage 
      };
      
    } finally {
      setLoading(false);
    }
  };

  /**
   * VERIFY TOKEN FUNCTION (Optional)
   * 
   * Verifies that the stored token is still valid
   * Useful to check on app load or after period of inactivity
   * 
   * @returns {Promise<boolean>} - True if token is valid
   */
  const verifyToken = async () => {
    try {
      // Call backend verify endpoint
      const response = await api.get('/auth/verify/');
      
      // Token is valid
      return true;
      
    } catch (error) {
      console.error('Token verification failed:', error);
      
      // Token is invalid - logout user
      logout();
      return false;
    }
  };

  /* ==========================================================================
     COMPUTED VALUES (Derived from state)
     ========================================================================== */

  /**
   * Check if user is authenticated
   * @type {boolean}
   */
  const isAuthenticated = !!user; // Convert to boolean

  /**
   * Check if user is an admin
   * @type {boolean}
   */
  const isAdmin = user?.is_admin === true;

  /**
   * Check if user is a driver (regular user)
   * @type {boolean}
   */
  const isDriver = user?.is_admin === false;

  /**
   * Get user's role as string
   * @type {string}
   */
  const userRole = isAdmin ? USER_ROLES.ADMIN : USER_ROLES.DRIVER;

  /*Context Value - what you get when you use useAuth()*/

  const value = {
    // State - current user, loading state, error message
    user,
    loading,
    error,
    
    // Computed values
    isAuthenticated,
    isAdmin,
    isDriver,
    userRole,
    
    // Functions
    login,
    register,
    logout,
    updateUser,
    verifyToken,
    
    // Utility
    setError,          // Function to set error message
    clearError: () => setError(null) // Function to clear error
  };

  /* ==========================================================================
     RENDER PROVIDER
     ========================================================================== */

  /**
   * Render the provider with value
   * 
   * During initial loading, you might want to show a loading screen
   * to prevent flash of unauthenticated content
   */
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/* ============================================================================
   CUSTOM HOOK - useAuth()
   ============================================================================ */

/**
 * Custom hook to access Auth Context
 * 
 * This is the hook you'll use in components to access authentication state
 * 
 * @returns {object} - Auth context value
 * @throws {Error} - If used outside of AuthProvider
 * 
 * Usage in components:
 * 
 * const { user, isAuthenticated, login, logout } = useAuth();
 * 
 * if (isAuthenticated) {
 *   return <h1>Welcome {user.username}!</h1>
 * }
 */
export const useAuth = () => {
  // Get context value
  const context = useContext(AuthContext);
  
  // Error if used outside provider
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

/*EXPORT THE HOOK FOR CONVENIENCE - Default export is the hook for convenience*/

/*You can import either way:
import { useAuth } from '@/context/AuthContext';
or
import useAuth from '@/context/AuthContext';*/
export default useAuth;