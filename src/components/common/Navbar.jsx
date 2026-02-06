/**
 * ParkHub - Navbar Component
 * 
 * Navigation bar for authenticated users
 * Shows different menu items based on user role (driver/admin)
 */

import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Car, Home, Calendar, User, Settings, LogOut, Menu, X, LayoutDashboard, ParkingSquare, Users } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, isAdmin, isDriver } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  /**
   * Handle logout
   */
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  /**
   * Check if route is active
   */
  const isActive = (path) => {
    return location.pathname === path;
  };

  /**
   * Driver Navigation Items
   */
  const driverNavItems = [
    { path: '/driver/dashboard', label: 'Dashboard', icon: <Home size={18} /> },
    { path: '/driver/find-parking', label: 'Find Parking', icon: <ParkingSquare size={18} /> },
    { path: '/driver/bookings', label: 'My Bookings', icon: <Calendar size={18} /> },
    { path: '/driver/profile', label: 'Profile', icon: <User size={18} /> },
  ];

  /**
   * Admin Navigation Items
   */
  const adminNavItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { path: '/admin/lots', label: 'Parking Lots', icon: <ParkingSquare size={18} /> },
    { path: '/admin/bookings', label: 'Bookings', icon: <Calendar size={18} /> },
    { path: '/admin/users', label: 'Users', icon: <Users size={18} /> },
  ];

  /**
   * Get navigation items based on role
   */
  const navItems = isAdmin ? adminNavItems : driverNavItems;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to={isAdmin ? '/admin/dashboard' : '/driver/dashboard'} className="navbar-logo">
          <div className="navbar-logo-icon">
            <Car size={24} strokeWidth={2.5} />
          </div>
          <span className="navbar-logo-text">ParkHub</span>
        </Link>

        {/* Desktop Navigation */}
        <ul className="navbar-menu">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`navbar-link ${isActive(item.path) ? 'active' : ''}`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>

        {/* User Menu */}
        <div className="navbar-user">
          {/* User Info */}
          <div className="navbar-user-info">
            <div className="navbar-user-avatar">
              {user?.username?.charAt(0).toUpperCase()}
            </div>
            <div className="navbar-user-details">
              <span className="navbar-user-name">{user?.username}</span>
              <span className="navbar-user-role">
                {isAdmin ? 'Admin' : 'Driver'}
              </span>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="navbar-logout"
            title="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="navbar-mobile-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="navbar-mobile-menu">
          <ul className="navbar-mobile-items">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`navbar-mobile-link ${isActive(item.path) ? 'active' : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
            
            {/* Mobile Logout */}
            <li>
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="navbar-mobile-logout"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;