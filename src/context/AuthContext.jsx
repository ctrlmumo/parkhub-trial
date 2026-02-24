import { createContext, useContext, useState, useEffect } from 'react';
import api, { setAuthToken, clearAuth } from '../services/api';
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
    const initializeAuth = () => {
      try {
        const storedUser = getFromStorage(STORAGE_KEYS.USER);
        const storedToken = getFromStorage(STORAGE_KEYS.TOKEN);
        
        if (storedUser && storedToken) {
          console.log('Restored user session:', storedUser);
          setUser(storedUser);
          setAuthToken(storedToken);
        } else {
          console.log('No existing session found');
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        handleLogout();
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
      
      // MOCK AUTHENTICATION (Remove when backend is ready)
      // Check for demo credentials
      const isDemoDriver = email === 'driver@demo.com' && password === 'password123';
      const isDemoManager = email === 'manager@demo.com' && password === 'password123';
      
      if (isDemoDriver || isDemoManager) {
        console.log('Using MOCK authentication');
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Create mock user data
        const mockUser = {
          id: isDemoDriver ? 1 : 2,
          username: isDemoDriver ? 'Demo Driver' : 'Demo Manager',
          email: email,
          is_manager: isDemoManager,
          phone_number: isDemoDriver ? '254712345678' : null,
          vehicle_reg: isDemoDriver ? 'KCA 456B' : null
        };
        
        const mockToken = `mock_token_${Date.now()}`;
        
        // Store authentication data
        setAuthToken(mockToken);
        saveToStorage(STORAGE_KEYS.TOKEN, mockToken);
        saveToStorage(STORAGE_KEYS.USER, mockUser);
        
        // Update state
        setUser(mockUser);
        
        console.log('Mock login successful:', mockUser);
        
        return { 
          success: true, 
          message: SUCCESS_MESSAGES.LOGIN_SUCCESS 
        };
      }
      
      // REAL API CALL (Uncomment when backend is ready)
      
      /*
      const response = await api.post('/auth/login/', {
        email,
        password
      });
      
      const { token, user: userData } = response.data;
      
      // Store token and user data
      setAuthToken(token);
      saveToStorage(STORAGE_KEYS.TOKEN, token);
      saveToStorage(STORAGE_KEYS.USER, userData);
      
      // Update state
      setUser(userData);
      
      console.log('Real API login successful:', userData);
      
      return { 
        success: true, 
        message: SUCCESS_MESSAGES.LOGIN_SUCCESS 
      };
      */
      
      // If not demo credentials and backend not ready
      const errorMessage = 'Invalid credentials. Try: driver@demo.com / password123';
      setError(errorMessage);
      
      return { 
        success: false, 
        error: errorMessage 
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
  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('📝 Register attempt:', { email: userData.email });
      
      // MOCK REGISTRATION (Remove when backend is ready)
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Create mock user
      const mockUser = {
        id: Date.now(),
        username: userData.username,
        email: userData.email,
        is_manager: false,
        phone_number: userData.phoneNumber || null,
        vehicle_reg: userData.vehicleReg || null
      };
      
      const mockToken = `mock_token_${Date.now()}`;
      
      // Store authentication data
      setAuthToken(mockToken);
      saveToStorage(STORAGE_KEYS.TOKEN, mockToken);
      saveToStorage(STORAGE_KEYS.USER, mockUser);
      
      // Update state
      setUser(mockUser);
      
      console.log('Mock registration successful:', mockUser);
      
      return { 
        success: true, 
        message: SUCCESS_MESSAGES.REGISTRATION_SUCCESS 
      };
      
      // ============================================================
      // REAL API CALL (Uncomment when backend is ready)
      // ============================================================
      
      /*
      const response = await api.post('/auth/register/', {
        username: userData.username,
        email: userData.email,
        password: userData.password,
        phone_number: userData.phoneNumber || null,
        vehicle_reg: userData.vehicleReg || null
      });
      
      const { token, user: newUser } = response.data;
      
      // Store token and user data
      setAuthToken(token);
      saveToStorage(STORAGE_KEYS.TOKEN, token);
      saveToStorage(STORAGE_KEYS.USER, newUser);
      
      // Update state
      setUser(newUser);
      
      return { 
        success: true, 
        message: SUCCESS_MESSAGES.REGISTRATION_SUCCESS 
      };
      */
      
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
      console.log('👋 Logging out user');
      
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
      
      // For mock: just update local storage
      const updatedUser = { ...user, ...updatedData };
      saveToStorage(STORAGE_KEYS.USER, updatedUser);
      setUser(updatedUser);
      
      console.log('User updated:', updatedUser);
      
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
      // For mock: just check if token exists
      const token = getFromStorage(STORAGE_KEYS.TOKEN);
      return !!token;
      
    } catch (error) {
      console.error('Token verification failed:', error);
      logout();
      return false;
    }
  };

  /* COMPUTED VALUES */

  const isAuthenticated = !!user;
  const isManager = user?.is_manager === true;
  const isDriver = user?.is_manager === false;
  const userRole = isManager ? USER_ROLES.MANAGER : USER_ROLES.DRIVER;

  /* CONTEXT VALUE */

  const value = {
    // State
    user,
    loading,
    error,
    
    // Computed values
    isAuthenticated,
    isManager,
    isDriver,
    userRole,
    
    // Functions
    login,
    register,
    logout,
    updateUser,
    verifyToken,
    
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