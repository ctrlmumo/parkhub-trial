import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Car, Shield, Mail, Lock, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { isValidEmail } from '../../utils/helpers';
import './Auth.css';

const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, isAdmin } = useAuth();
  
  // Form state
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'driver' // 'driver' or 'manager'
  });
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  /**
   * Handle input changes
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  /**
   * Handle role tab selection
   */
  const handleRoleChange = (role) => {
    setFormData(prev => ({ ...prev, role }));
  };

  /**
   * Validate form
   */
  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('Login form submitted');
    
    // Validate
    if (!validateForm()) {
      console.log('Validation failed');
      return;
    }

    setLoading(true);
    setErrors({}); // Clear any previous errors

    try {
      console.log('Attempting login...');
      
      // Attempt login
      const { success, error } = await login(formData.email, formData.password);

      console.log('Login response:', { success, error });

      if (success) {
        console.log('Login successful! Redirecting...');
        
        // Small delay to ensure state is updated
        setTimeout(() => {
          // Redirect based on selected role tab
          // (In production, use the actual user role from backend)
          if (formData.role === 'admin') {
            console.log('Redirecting to admin dashboard');
            navigate('/admin/dashboard', { replace: true });
          } else {
            console.log('Redirecting to driver dashboard');
            navigate('/driver/dashboard', { replace: true });
          }
        }, 100);
        
      } else {
        // Show error
        console.log('Login failed:', error);
        setErrors({ submit: error || 'Login failed. Please try again.' });
      }
    } catch (error) {
      console.error('Unexpected login error:', error);
      setErrors({ submit: 'An unexpected error occurred' });
    } finally {
      setLoading(false);
    }
  };

  // Auto-fill demo credentials helper
  const fillDemoCredentials = (role) => {
    const email = role === 'admin' ? 'admin@demo.com' : 'driver@demo.com';
    setFormData(prev => ({
      ...prev,
      email,
      password: 'password123',
      role
    }));
  };

  return (
    <div className="auth-page">
      {/* Background gradient */}
      <div className="auth-background"></div>

      <div className="auth-container">
        {/* Logo Section */}
        <div className="auth-logo">
          <div className="logo-icon">
            <Car size={32} strokeWidth={2.5} />
          </div>
          <h1 className="logo-text">ParkHub</h1>
          <p className="logo-subtitle">Smart Parking Management</p>
        </div>

        {/* Login Card */}
        <div className="auth-card">
          {/* Header */}
          <div className="auth-card-header">
            <h2>Welcome Back</h2>
            <p>Sign in to access your account</p>
          </div>

          {/* Role Selector Tabs */}
          <div className="role-tabs">
            <button
              type="button"
              className={`role-tab ${formData.role === 'driver' ? 'active' : ''}`}
              onClick={() => handleRoleChange('driver')}
            >
              <Car size={18} />
              <span>Driver</span>
            </button>
            <button
              type="button"
              className={`role-tab ${formData.role === 'admin' ? 'active' : ''}`}
              onClick={() => handleRoleChange('admin')}
            >
              <Shield size={18} />
              <span>Manager</span>
            </button>
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="auth-error-banner">
              {errors.submit}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="auth-form">
            {/* Email Input */}
            <Input
              label="Email Address"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              icon={<Mail size={18} />}
              iconPosition="left"
              disabled={loading}
              required
            />

            {/* Password Input */}
            <Input
              label="Password"
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              icon={<Lock size={18} />}
              iconPosition="left"
              disabled={loading}
              required
            />

            {/* Forgot Password Link */}
            <div className="auth-link-row">
              <Link to="/forgot-password" className="auth-link">
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="sm"
              fullWidth
              loading={loading}
              icon={loading ? <Loader2 className="spin" /> : null}
              className="auth-submit-btn"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          {/* Sign Up Link */}
          <div className="auth-footer">
            <p>
              Don't have an account?{' '}
              <Link to="/register" className="auth-link-primary">
                Sign up
              </Link>
            </p>
          </div>

          {/* Demo Credentials (Development Only) */}
          {import.meta.env.DEV && (
            <div className="demo-credentials">
              <p className="demo-title">Quick Login (Demo):</p>
              <div className="demo-items">
                <button
                  type="button"
                  onClick={() => fillDemoCredentials('driver')}
                  className="demo-button"
                >
                  <strong>Driver:</strong>
                  <span>driver@demo.com / password123</span>
                </button>
                <button
                  type="button"
                  onClick={() => fillDemoCredentials('admin')}
                  className="demo-button"
                >
                  <strong>Admin:</strong>
                  <span>admin@demo.com / password123</span>
                </button>
              </div>
              <p style={{ fontSize: '11px', color: 'var(--muted-foreground)', marginTop: '8px', textAlign: 'center' }}>
                ℹ️ Click to auto-fill credentials
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="auth-page-footer">
          <p>&copy; 2026 ParkHub. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;