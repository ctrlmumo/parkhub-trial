/* PLACEHOLDER */

import { useNavigate } from 'react-router-dom';
import { Grid3x3, TrendingUp, Users, DollarSign } from 'lucide-react';
import ManagerNavbar from '../../components/manager/ManagerNavbar';
import './ManagerDashboard.css';

const ManagerDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="manager-dashboard-page">
      <ManagerNavbar />
      
      <div className="manager-dashboard-container">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Dashboard</h1>
          <p className="dashboard-subtitle">Overview of your parking lots</p>
        </div>

        <div className="quick-actions">
          <button 
            onClick={() => navigate('/manager/slot-management')}
            className="quick-action-card"
          >
            <Grid3x3 size={24} />
            <span>Manage Slots</span>
          </button>
          
          <div className="quick-action-card disabled">
            <TrendingUp size={24} />
            <span>Analytics</span>
          </div>
          
          <div className="quick-action-card disabled">
            <Users size={24} />
            <span>Bookings</span>
          </div>
          
          <div className="quick-action-card disabled">
            <DollarSign size={24} />
            <span>Revenue</span>
          </div>
        </div>

        <div className="coming-soon">
          <p>Full dashboard coming soon...</p>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;