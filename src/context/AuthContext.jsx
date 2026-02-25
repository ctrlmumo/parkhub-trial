import { createContext, useContext, useState, useEffect } from 'react';
import api, { setAuthToken, getAuthToken, clearAuth } from '../services/api';
import { STORAGE_KEYS, USER_ROLES, ERROR_MESSAGES, SUCCESS_MESSAGES } from '../utils/constants';
import { getFromStorage, saveToStorage, removeFromStorage } from '../utils/helpers';

/* CREATE CONTEXT */

const AuthContext = createContext(null);

/* AUTH PROVIDER COMPONENT */

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* Initialize auth on mount */
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = getAuthToken();

        if (storedToken) {
          setAuthToken(storedToken);
          
          // Verify token and get fresh user data from backend
          const response = await api.get('/auth/me/');
          const userData = response.data;
          
          // Set helper flags
          userData.is_admin = userData.role === USER_ROLES.ADMIN;
          userData.is_manager = userData.role === USER_ROLES.MANAGER;
          userData.is_driver = userData.role === USER_ROLES.DRIVER;

          setUser(userData);
          saveToStorage(STORAGE_KEYS.USER, userData);
        } else {
          console.log('No existing session found');
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        // If token is invalid, clear everything
        clearAuth();
        removeFromStorage(STORAGE_KEYS.TOKEN);
        removeFromStorage(STORAGE_KEYS.USER);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  /* LOGIN FUNCTION - WITH MOCK FALLBACK */
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);

      console.log('Login attempt:', { email });

      // REAL API CALL
      const response = await api.post('/auth/login/', {
        email,
        password
      });
      
      const { token, user: userData } = response.data;

      // Map backend role to frontend boolean flags if needed, 
      // though your User model seems to have 'role' which matches USER_ROLES
      // Ensure userData has necessary flags for getDashboardPath
      userData.is_admin = userData.role === USER_ROLES.ADMIN;
      userData.is_manager = userData.role === USER_ROLES.MANAGER;
      userData.is_driver = userData.role === USER_ROLES.DRIVER;
      
      // Store token and user data
      setAuthToken(token);
      saveToStorage(STORAGE_KEYS.USER, userData);
      
      // Update state
      setUser(userData);
      
      console.log('Real API login successful:', userData);
      
      return { 
        success: true, 
        message: SUCCESS_MESSAGES.LOGIN_SUCCESS,
        user: userData
      };

    } catch (error) {
      console.error('Login error:', error);

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

  /* REGISTER FUNCTION - WITH MOCK FALLBACK */
  const register = async (registerData) => {
    try {
      setLoading(true);
      setError(null);

      console.log('Register attempt:', { email: registerData.email });

      // REAL API CALL
      const response = await api.post('/auth/register/', {
        username: registerData.username,
        email: registerData.email,
        password: registerData.password,
        role: registerData.role || USER_ROLES.DRIVER,
        phone_number: registerData.phoneNumber || null,
        vehicle_reg: registerData.vehicleReg || null
      });
      
      const { token, user: newUser } = response.data;

      newUser.is_admin = newUser.role === USER_ROLES.ADMIN;
      newUser.is_manager = newUser.role === USER_ROLES.MANAGER;
      newUser.is_driver = newUser.role === USER_ROLES.DRIVER;
      
      // Store token and user data
      setAuthToken(token);
      saveToStorage(STORAGE_KEYS.USER, newUser);
      
      // Update state
      setUser(newUser);
      
      return { 
        success: true, 
        message: SUCCESS_MESSAGES.REGISTRATION_SUCCESS,
        user: newUser
      };

    } catch (error) {
      console.error(' Registration error:', error);

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
   */
  const logout = async () => {
    try {
      console.log('Logging out user');

      // Clear authentication data
      clearAuth();
      removeFromStorage(STORAGE_KEYS.TOKEN);
      removeFromStorage(STORAGE_KEYS.USER);

      // Clear state
      setUser(null);
      setError(null);

      console.log('Logout successful');

    } catch (error) {
      console.error('Logout error:', error);
      // Even if error, still logout locally
      clearAuth();
      removeFromStorage(STORAGE_KEYS.TOKEN);
      removeFromStorage(STORAGE_KEYS.USER);
      setUser(null);
    }
  };

  /* UPDATE USER FUNCTION */
  const updateUser = async (updatedData) => {
    try {
      setLoading(true);

      const response = await api.patch('/auth/me/', updatedData);
      const userData = response.data;

      // Re-apply flags
      userData.is_admin = userData.role === USER_ROLES.ADMIN;
      userData.is_manager = userData.role === USER_ROLES.MANAGER;
      userData.is_driver = userData.role === USER_ROLES.DRIVER;

      saveToStorage(STORAGE_KEYS.USER, userData);
      setUser(userData);

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

  /* VERIFY TOKEN FUNCTION */
  const verifyToken = async () => {
    try {
      if (!getAuthToken()) return false;
      await api.get('/auth/me/');
      return true;
    } catch (error) {
      console.error('Token verification failed:', error);
      // Do not auto-logout here to avoid loops, just return false
      return false;
    }
  };

  /* COMPUTED VALUES */

  const isAuthenticated = !!user;
  const isAdmin = user?.is_admin === true || user?.role === USER_ROLES.ADMIN;
  const isManager = user?.is_manager === true || user?.role === USER_ROLES.MANAGER;
  const isDriver = !isAdmin && !isManager;

  const userRole = isAdmin ? USER_ROLES.ADMIN : (isManager ? USER_ROLES.MANAGER : USER_ROLES.DRIVER);

  /**
   * Helper to get dashboard path based on role
   */
  const getDashboardPath = (userData = user) => {
    if (!userData) return '/login';

    if (userData.is_admin || userData.role === USER_ROLES.ADMIN) return '/admin/dashboard';
    if (userData.is_manager || userData.role === USER_ROLES.MANAGER) return '/manager/dashboard';
    if (userData.is_driver || userData.role === USER_ROLES.DRIVER) return '/driver/dashboard';
    return '/login';
  };

  /* CONTEXT VALUE */

  const value = {
    // State
    user,
    loading,
    error,

    // Computed values
    isAuthenticated,
    isAdmin,
    isManager,
    isDriver,
    userRole,

    // Functions
    login,
    register,
    logout,
    updateUser,
    verifyToken,
    getDashboardPath,

    // Utility
    setError,
    clearError: () => setError(null)
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/* CUSTOM HOOK */

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};

export default useAuth;