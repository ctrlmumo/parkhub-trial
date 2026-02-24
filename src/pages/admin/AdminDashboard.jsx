import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Building2, 
  Calendar,
  CircleDollarSign,
  TrendingUp,
  Plus,
  UserPlus,
  FileText,
  Activity
} from 'lucide-react';
import AdminNavbar from '../../components/admin/AdminNavbar';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  
  // State
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalLots: 0,
    totalBookings: 0,
    platformRevenue: 0,
    occupancyRate: 0
  });
  
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  /* Load dashboard data */
  useEffect(() => {
    loadDashboardData();
  }, []);

  /**
   * Load all dashboard data
   * TODO: Replace with API calls
   */
  const loadDashboardData = () => {
    setTimeout(() => {
      // TODO: Replace with real API calls
      // const response = await api.get('/admin/dashboard/stats');
      // setStats(response.data);
      
      // All stats remain at 0 (empty state)
      // Recent activity remains empty
      
      setLoading(false);
    }, 500);
  };

  /* Quick action handlers */
  const handleAddUser = () => {
    navigate('/admin/users?action=create');
  };

  const handleCreateLot = () => {
    navigate('/admin/lots?action=create');
  };

  const handleViewBookings = () => {
    navigate('/admin/bookings');
  };

  const handleGenerateReport = () => {
    navigate('/admin/analytics');
  };

  if (loading) {
    return (
      <div className="admin-dashboard-page">
        <AdminNavbar />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-page">
      <AdminNavbar />
      
      <div className="admin-dashboard-container">
        {/* Header Section */}
        <div className="dashboard-header">
          <div className="header-content">
            <h1 className="dashboard-title">Admin Dashboard</h1>
            <p className="dashboard-subtitle">Platform overview and management</p>
          </div>
          <div className="status-pill">
            <span className="status-dot"></span>
            <span className="status-text">System Online</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          {/* Total Users */}
          <div className="stat-card">
            <div className="stat-content">
              <p className="stat-label">Total Users</p>
              <p className="stat-value">{stats.totalUsers}</p>
              <p className="stat-sublabel">Drivers + Managers</p>
            </div>
            <div className="stat-icon stat-icon-blue">
              <Users size={24} />
            </div>
          </div>

          {/* Total Parking Lots */}
          <div className="stat-card">
            <div className="stat-content">
              <p className="stat-label">Total Parking Lots</p>
              <p className="stat-value">{stats.totalLots}</p>
              <p className="stat-sublabel">Across all managers</p>
            </div>
            <div className="stat-icon stat-icon-primary">
              <Building2 size={24} />
            </div>
          </div>

          {/* Total Bookings */}
          <div className="stat-card">
            <div className="stat-content">
              <p className="stat-label">Total Bookings</p>
              <p className="stat-value">{stats.totalBookings}</p>
              <p className="stat-sublabel">All time</p>
            </div>
            <div className="stat-icon stat-icon-amber">
              <Calendar size={24} />
            </div>
          </div>

          {/* Platform Revenue */}
          <div className="stat-card">
            <div className="stat-content">
              <p className="stat-label">Platform Revenue</p>
              <p className="stat-value">KES {stats.platformRevenue.toLocaleString()}</p>
              <p className="stat-sublabel">Total earnings</p>
            </div>
            <div className="stat-icon stat-icon-green">
              <CircleDollarSign size={24} />
            </div>
          </div>

          {/* Occupancy Rate */}
          <div className="stat-card">
            <div className="stat-content">
              <p className="stat-label">Occupancy Rate</p>
              <p className="stat-value">{stats.occupancyRate}%</p>
              <p className="stat-sublabel">Platform average</p>
            </div>
            <div className="stat-icon stat-icon-purple">
              <TrendingUp size={24} />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions-section">
          <h2 className="section-title">Quick Actions</h2>
          <div className="quick-actions-grid">
            <button 
              onClick={handleAddUser}
              className="quick-action-btn"
            >
              <UserPlus size={20} />
              <span>Add New User</span>
            </button>

            <button 
              onClick={handleCreateLot}
              className="quick-action-btn"
            >
              <Plus size={20} />
              <span>Create Parking Lot</span>
            </button>

            <button 
              onClick={handleViewBookings}
              className="quick-action-btn"
            >
              <Calendar size={20} />
              <span>View All Bookings</span>
            </button>

            <button 
              onClick={handleGenerateReport}
              className="quick-action-btn"
            >
              <FileText size={20} />
              <span>Generate Report</span>
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="recent-activity-section">
          <div className="section-header">
            <div className="section-header-content">
              <h2 className="section-title">Recent Activity</h2>
              <p className="section-subtitle">Latest platform actions</p>
            </div>
          </div>

          <div className="activity-card">
            {recentActivity.length > 0 ? (
              <div className="activity-table-container">
                <table className="activity-table">
                  <thead>
                    <tr>
                      <th>Time</th>
                      <th>User</th>
                      <th>Action</th>
                      <th>Entity</th>
                      <th>Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentActivity.map((activity) => (
                      <tr key={activity.id}>
                        <td>{activity.time}</td>
                        <td>{activity.user}</td>
                        <td>
                          <span className={`action-badge action-${activity.actionType}`}>
                            {activity.action}
                          </span>
                        </td>
                        <td>{activity.entity}</td>
                        <td className="activity-details">{activity.details}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-state">
                <Activity size={48} className="empty-icon" />
                <p className="empty-text">No recent activity</p>
                <p className="empty-subtext">Platform activity will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;