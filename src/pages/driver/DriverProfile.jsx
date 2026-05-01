import { useState, useEffect } from 'react';
import { User, Phone, Car, Lock, CheckCircle, AlertCircle, Edit2, Save, X, Calendar, ParkingCircle, Clock } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/common/Navbar';
import Button from '../../components/common/Button';
import './DriverProfile.css';

const DriverProfile = () => {
  const { user, updateUser } = useAuth();

  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    phone_number: '',
    vehicle_reg: '',
  });

  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });

  const [stats, setStats] = useState({
    totalBookings: 0,
    activeBookings: 0,
    hoursParked: 0,
  });

  const [editingProfile, setEditingProfile] = useState(false);
  const [editingPassword, setEditingPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [banner, setBanner] = useState(null); // { type: 'success'|'error', message }

  useEffect(() => {
    if (user) {
      setProfileData({
        username: user.username || '',
        email: user.email || '',
        phone_number: user.phone_number || '',
        vehicle_reg: user.vehicle_reg || '',
      });
      loadStats();
    }
  }, [user]);

  const loadStats = async () => {
    try {
      const response = await api.get('/bookings/');
      const bookings = response.data;
      const active = bookings.filter(b => b.status === 'active').length;
      const totalHours = bookings
        .filter(b => b.status === 'completed')
        .reduce((sum, b) => sum + (b.duration_hours || 0), 0);

      setStats({
        totalBookings: bookings.length,
        activeBookings: active,
        hoursParked: totalHours,
      });
    } catch (err) {
      console.error('Failed to load stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const showBanner = (type, message) => {
    setBanner({ type, message });
    setTimeout(() => setBanner(null), 4000);
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    try {
      const result = await updateUser({
        username: profileData.username,
        phone_number: profileData.phone_number,
        vehicle_reg: profileData.vehicle_reg,
      });

      if (result.success) {
        setEditingProfile(false);
        showBanner('success', 'Profile updated successfully!');
      } else {
        showBanner('error', result.error || 'Failed to update profile.');
      }
    } catch (err) {
      showBanner('error', 'An unexpected error occurred.');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSavePassword = async () => {
    if (passwordData.new_password !== passwordData.confirm_password) {
      showBanner('error', 'New passwords do not match.');
      return;
    }
    if (passwordData.new_password.length < 6) {
      showBanner('error', 'Password must be at least 6 characters.');
      return;
    }

    setSavingPassword(true);
    try {
      await api.patch('/auth/me/', {
        current_password: passwordData.current_password,
        password: passwordData.new_password,
      });
      setPasswordData({ current_password: '', new_password: '', confirm_password: '' });
      setEditingPassword(false);
      showBanner('success', 'Password updated successfully!');
    } catch (err) {
      showBanner('error', err.response?.data?.error || 'Failed to update password.');
    } finally {
      setSavingPassword(false);
    }
  };

  const cancelProfile = () => {
    setProfileData({
      username: user.username || '',
      email: user.email || '',
      phone_number: user.phone_number || '',
      vehicle_reg: user.vehicle_reg || '',
    });
    setEditingProfile(false);
  };

  const cancelPassword = () => {
    setPasswordData({ current_password: '', new_password: '', confirm_password: '' });
    setEditingPassword(false);
  };

  const initials = profileData.username
    ? profileData.username.charAt(0).toUpperCase()
    : '?';

  if (loading) {
    return (
      <div className="profile-page">
        <Navbar />
        <div className="profile-loading">
          <div className="loading-spinner" />
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <Navbar />
      <div className="profile-container">

        {/* Banner */}
        {banner && (
          <div className={`profile-banner profile-banner-${banner.type}`}>
            {banner.type === 'success'
              ? <CheckCircle size={18} />
              : <AlertCircle size={18} />}
            {banner.message}
          </div>
        )}

        {/* Hero */}
        <div className="profile-hero">
          <div className="profile-avatar">{initials}</div>
          <div className="profile-hero-info">
            <h1 className="profile-hero-name">{profileData.username || 'Driver'}</h1>
            <p className="profile-hero-email">{profileData.email}</p>
            <span className="profile-hero-badge">
              <Car size={14} />
              Driver Account
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="profile-section-card">
          <div className="profile-section-header">
            <h2 className="profile-section-title">
              <ParkingCircle size={20} />
              Parking Activity
            </h2>
          </div>
          <div className="profile-section-body">
            <div className="profile-stats-grid">
              <div className="profile-stat-item">
                <div className="profile-stat-icon">
                  <Calendar size={22} />
                </div>
                <span className="profile-stat-value">{stats.totalBookings}</span>
                <span className="profile-stat-label">Total Bookings</span>
              </div>
              <div className="profile-stat-item">
                <div className="profile-stat-icon">
                  <ParkingCircle size={22} />
                </div>
                <span className="profile-stat-value">{stats.activeBookings}</span>
                <span className="profile-stat-label">Active Now</span>
              </div>
              <div className="profile-stat-item">
                <div className="profile-stat-icon">
                  <Clock size={22} />
                </div>
                <span className="profile-stat-value">{stats.hoursParked}h</span>
                <span className="profile-stat-label">Hours Parked</span>
              </div>
            </div>
          </div>
        </div>

        {/* Personal Info */}
        <div className="profile-section-card">
          <div className="profile-section-header">
            <h2 className="profile-section-title">
              <User size={20} />
              Personal Information
            </h2>
            {!editingProfile && (
              <Button variant="outline" size="sm" onClick={() => setEditingProfile(true)} icon={<Edit2 size={15} />}>
                Edit
              </Button>
            )}
          </div>
          <div className="profile-section-body">
            <div className="profile-form-grid">
              <div className="profile-field">
                <label className="profile-field-label">Full Name</label>
                {editingProfile ? (
                  <input
                    className="profile-field-input"
                    name="username"
                    value={profileData.username}
                    onChange={handleProfileChange}
                    placeholder="Your full name"
                  />
                ) : (
                  <div className="profile-field-value">{profileData.username || '—'}</div>
                )}
              </div>

              <div className="profile-field">
                <label className="profile-field-label">Email Address</label>
                <div className="profile-field-value">{profileData.email || '—'}</div>
              </div>

              <div className="profile-field">
                <label className="profile-field-label">
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Phone size={13} /> Phone Number
                  </span>
                </label>
                {editingProfile ? (
                  <input
                    className="profile-field-input"
                    name="phone_number"
                    value={profileData.phone_number}
                    onChange={handleProfileChange}
                    placeholder="254712345678"
                  />
                ) : (
                  <div className="profile-field-value">{profileData.phone_number || '—'}</div>
                )}
              </div>

              <div className="profile-field">
                <label className="profile-field-label">
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Car size={13} /> Vehicle Registration
                  </span>
                </label>
                {editingProfile ? (
                  <input
                    className="profile-field-input"
                    name="vehicle_reg"
                    value={profileData.vehicle_reg}
                    onChange={handleProfileChange}
                    placeholder="KAA 123A"
                  />
                ) : (
                  <div className="profile-field-value">{profileData.vehicle_reg || '—'}</div>
                )}
              </div>
            </div>

            {editingProfile && (
              <div className="profile-actions">
                <Button variant="outline" onClick={cancelProfile} icon={<X size={16} />}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={handleSaveProfile} loading={savingProfile} icon={<Save size={16} />}>
                  Save Changes
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Password */}
        <div className="profile-section-card">
          <div className="profile-section-header">
            <h2 className="profile-section-title">
              <Lock size={20} />
              Security
            </h2>
            {!editingPassword && (
              <Button variant="outline" size="sm" onClick={() => setEditingPassword(true)} icon={<Edit2 size={15} />}>
                Change Password
              </Button>
            )}
          </div>
          <div className="profile-section-body">
            {!editingPassword ? (
              <div className="password-notice">
                <Lock size={16} />
                Your password is set. Click "Change Password" to update it.
              </div>
            ) : (
              <>
                <div className="profile-form-grid">
                  <div className="profile-field profile-form-full">
                    <label className="profile-field-label">Current Password</label>
                    <input
                      className="profile-field-input"
                      type="password"
                      name="current_password"
                      value={passwordData.current_password}
                      onChange={handlePasswordChange}
                      placeholder="Enter current password"
                    />
                  </div>
                  <div className="profile-field">
                    <label className="profile-field-label">New Password</label>
                    <input
                      className="profile-field-input"
                      type="password"
                      name="new_password"
                      value={passwordData.new_password}
                      onChange={handlePasswordChange}
                      placeholder="Min. 6 characters"
                    />
                  </div>
                  <div className="profile-field">
                    <label className="profile-field-label">Confirm New Password</label>
                    <input
                      className="profile-field-input"
                      type="password"
                      name="confirm_password"
                      value={passwordData.confirm_password}
                      onChange={handlePasswordChange}
                      placeholder="Re-enter new password"
                    />
                  </div>
                </div>
                <div className="profile-actions">
                  <Button variant="outline" onClick={cancelPassword} icon={<X size={16} />}>
                    Cancel
                  </Button>
                  <Button variant="primary" onClick={handleSavePassword} loading={savingPassword} icon={<Save size={16} />}>
                    Update Password
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default DriverProfile;