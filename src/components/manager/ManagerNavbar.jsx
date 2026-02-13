
import { NavLink } from 'react-router-dom';
import { Home, Grid3x3, LogOut, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './ManagerNavbar.css';

const ManagerNavbar = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="manager-navbar">
      <div className="manager-nav-container">
        {/* Logo */}
        <div className="manager-nav-logo">
          <div className="logo-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="7" cy="17" r="2" stroke="currentColor" strokeWidth="2"/>
              <circle cx="17" cy="17" r="2" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </div>
          <span className="logo-text">ParkHub</span>
        </div>

        {/* Navigation Links */}
        <div className="manager-nav-links">
          <NavLink 
            to="/manager/dashboard" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <Home size={20} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink 
            to="/manager/slot-management" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <Grid3x3 size={20} />
            <span>Slot Management</span>
          </NavLink>
        </div>

        {/* User Menu */}
        <div className="manager-nav-user">
          <div className="user-info">
            <User size={20} className="user-icon" />
            <span className="user-name">{user?.username || 'Manager'}</span>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default ManagerNavbar;