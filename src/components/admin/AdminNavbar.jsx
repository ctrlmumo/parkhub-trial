import { NavLink } from 'react-router-dom';
import { Home, Users, Building2, Calendar, BarChart3, LogOut, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './AdminNavbar.css';

const AdminNavbar = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="admin-navbar">
      <div className="admin-nav-container">
        {/* Logo */}
        <div className="admin-nav-logo">
          <div className="logo-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="7" cy="17" r="2" stroke="currentColor" strokeWidth="2"/>
              <circle cx="17" cy="17" r="2" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </div>
          <span className="logo-text">ParkHub</span>
          <span className="admin-badge">Admin</span>
        </div>

        {/* Navigation Links */}
        <div className="admin-nav-links">
          <NavLink 
            to="/admin/dashboard" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <Home size={20} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink 
            to="/admin/users" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <Users size={20} />
            <span>Users</span>
          </NavLink>

          <NavLink 
            to="/admin/lots" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <Building2 size={20} />
            <span>Parking Lots</span>
          </NavLink>

          <NavLink 
            to="/admin/bookings" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <Calendar size={20} />
            <span>Bookings</span>
          </NavLink>

          <NavLink 
            to="/admin/analytics" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <BarChart3 size={20} />
            <span>Analytics</span>
          </NavLink>
        </div>

        {/* User Menu */}
        <div className="admin-nav-user">
          <div className="user-info">
            <User size={20} className="user-icon" />
            <span className="user-name">{user?.username || 'Admin'}</span>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;