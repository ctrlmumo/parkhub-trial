import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Car, Shield, Mail, Lock, User, Phone, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { isValidEmail, isValidPhone } from '../../utils/helpers';
import './Auth.css';

const Register = () => {
  const navigate = useNavigate();
  const { register, getDashboardPath } = useAuth();

  // Form state
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phoneNumber: '',
    vehicleReg: '',
    password: '',
    confirmPassword: '',
    role: 'driver'
  });

  // UI state
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  /* Handle input changes */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error for this field when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  /* Handle role tab selection */
  const handleRoleChange = (role) => {
    setFormData(prev => ({ ...prev, role }));
  };

  /* Validate form */
  const validateForm = () => {
    const newErrors = {};

    // Username validation
    if (!formData.username) {
      newErrors.username = 'Full name is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Name must be at least 3 characters';
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    // Phone validation
    if (formData.phoneNumber && !isValidPhone(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid phone (254XXXXXXXXX)';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* Handle registration submission */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Attempt registration
      const { success, error } = await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        phoneNumber: formData.phoneNumber,
        vehicleReg: formData.vehicleReg,
        role: formData.role // Pass the role!
      });

      if (success) {
        // Success - redirect based on actual user account
        const dashboardPath = getDashboardPath();
        navigate(dashboardPath);
      } else {
        // Show error
        setErrors({ submit: error || 'Registration failed. Please try again.' });
      }
    } catch (error) {
      setErrors({ submit: 'An unexpected error occurred' });
    } finally {
      setLoading(false);
    }
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
          <p className="logo-subtitle">Parking Allocation System</p>
        </div>

        {/* Register Card */}
        <div className="auth-card">
          {/* Header */}
          <div className="auth-card-header">
            <h2>Create Account</h2>
            <p>Get started with ParkHub</p>
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
              className={`role-tab ${formData.role === 'manager' ? 'active' : ''}`}
              onClick={() => handleRoleChange('manager')}
            >
              <Shield size={18} />
              <span>Manager</span>
            </button>
            <button
              type="button"
              className={`role-tab ${formData.role === 'admin' ? 'active' : ''}`}
              onClick={() => handleRoleChange('admin')}
            >
              <Shield size={18} />
              <span>Admin</span>
            </button>
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="auth-error-banner">
              {errors.submit}
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="auth-form">
            {/* Full Name */}
            <Input
              label="Full Name"
              type="text"
              name="username"
              placeholder="John Doe"
              value={formData.username}
              onChange={handleChange}
              error={errors.username}
              icon={<User size={18} />}
              iconPosition="left"
              disabled={loading}
              required
            />

            {/* Email */}
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

            {/* Phone Number (Optional for drivers) */}
            {formData.role === 'driver' && (
              <Input
                label="Phone Number"
                type="tel"
                name="phoneNumber"
                placeholder="254712345678"
                value={formData.phoneNumber}
                onChange={handleChange}
                error={errors.phoneNumber}
                icon={<Phone size={18} />}
                iconPosition="left"
                hint="M-Pesa number for payments"
                disabled={loading}
              />
            )}

            {/* Vehicle Registration (Optional for drivers) */}
            {formData.role === 'driver' && (
              <Input
                label="Vehicle Registration"
                type="text"
                name="vehicleReg"
                placeholder="KAA 123A"
                value={formData.vehicleReg}
                onChange={handleChange}
                error={errors.vehicleReg}
                icon={<Car size={18} />}
                iconPosition="left"
                disabled={loading}
              />
            )}

            {/* Password */}
            <Input
              label="Password"
              type="password"
              name="password"
              placeholder="Min. 6 characters"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              icon={<Lock size={18} />}
              iconPosition="left"
              disabled={loading}
              required
            />

            {/* Confirm Password */}
            <Input
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              placeholder="Re-enter password"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              icon={<Lock size={18} />}
              iconPosition="left"
              disabled={loading}
              required
            />

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
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>

          {/* Sign In Link */}
          <div className="auth-footer">
            <p>
              Already have an account?{' '}
              <Link to="/login" className="auth-link-primary">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="auth-page-footer">
          <p>&copy; 2026 ParkHub. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Register;