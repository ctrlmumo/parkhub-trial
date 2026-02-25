import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ParkingCircle, 
  TrendingUp, 
  CircleDollarSign, 
  Users,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import api from '../../services/api';
import ManagerNavbar from '../../components/manager/ManagerNavbar';
import './ManagerDashboard.css';

const ManagerDashboard = () => {
  const navigate = useNavigate();
  
  // State
  const [stats, setStats] = useState({
    totalSlots: 0,
    occupancyRate: 0,
    todaysRevenue: 0,
    activeUsers: 0
  });
  
  const [revenueData, setRevenueData] = useState([]);
  const [occupancyData, setOccupancyData] = useState([]);
  const [slotDistribution, setSlotDistribution] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const bookingsPerPage = 5;

  /**
   * Load dashboard data
   */
  useEffect(() => {
    loadDashboardData();
  }, []);

  /**
   * Load all dashboard data
   * TODO: Replace with API calls
   */
  const loadDashboardData = async () => {
    try {
      const response = await api.get('/dashboard/manager/');
      const data = response.data;
      
      setStats(data.stats);
      setRevenueData(data.revenueData);
      setOccupancyData(data.occupancyData);
      setSlotDistribution(data.slotDistribution);
      setRecentBookings(data.recentBookings);
    } catch (error) {
      console.error("Failed to load dashboard data", error);
    }
  };

  /**
   * Get paginated bookings
   */
  const getPaginatedBookings = () => {
    const startIndex = (currentPage - 1) * bookingsPerPage;
    const endIndex = startIndex + bookingsPerPage;
    return recentBookings.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(recentBookings.length / bookingsPerPage);

  /**
   * Custom tooltip for charts
   */
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="chart-tooltip">
          <p className="tooltip-label">{label}</p>
          <p className="tooltip-value">
            {payload[0].name === 'revenue' ? 'KES ' : ''}
            {payload[0].value}
            {payload[0].name === 'rate' ? '%' : ''}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="manager-dashboard-page">
      <ManagerNavbar />
      
      <div className="dashboard-container">
        {/* Header Section */}
        <div className="dashboard-header">
          <div className="header-content">
            <h1 className="dashboard-title">Manager Dashboard</h1>
            <p className="dashboard-subtitle">Welcome back, Manager</p>
          </div>
          <div className="status-pill">
            <span className="status-dot"></span>
            <span className="status-text">System Online</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          {/* Total Slots */}
          <div className="stat-card">
            <div className="stat-content">
              <p className="stat-label">Total Slots</p>
              <p className="stat-value">{stats.totalSlots}</p>
            </div>
            <div className="stat-icon stat-icon-primary">
              <ParkingCircle size={24} />
            </div>
          </div>

          {/* Occupancy Rate */}
          <div className="stat-card">
            <div className="stat-content">
              <p className="stat-label">Occupancy Rate</p>
              <p className="stat-value">{stats.occupancyRate}%</p>
            </div>
            <div className="stat-icon stat-icon-amber">
              <TrendingUp size={24} />
            </div>
          </div>

          {/* Today's Revenue */}
          <div className="stat-card">
            <div className="stat-content">
              <p className="stat-label">Today's Revenue</p>
              <p className="stat-value">KES {stats.todaysRevenue.toLocaleString()}</p>
            </div>
            <div className="stat-icon stat-icon-green">
              <CircleDollarSign size={24} />
            </div>
          </div>

          {/* Active Users */}
          <div className="stat-card">
            <div className="stat-content">
              <p className="stat-label">Active Users</p>
              <p className="stat-value">{stats.activeUsers}</p>
            </div>
            <div className="stat-icon stat-icon-blue">
              <Users size={24} />
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="charts-row">
          {/* Revenue Chart */}
          <div className="chart-card">
            <div className="chart-header">
              <h3 className="chart-title">Revenue Today (M-Pesa)</h3>
              <p className="chart-subtitle">Hourly revenue breakdown</p>
            </div>
            {revenueData.length > 0 ? (
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={revenueData}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary-h) var(--primary-s) var(--primary-l))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--primary-h) var(--primary-s) var(--primary-l))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="time" 
                      stroke="hsl(var(--muted-foreground))"
                      style={{ fontSize: '12px' }}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))"
                      style={{ fontSize: '12px' }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="hsl(var(--primary-h) var(--primary-s) var(--primary-l))"
                      strokeWidth={2}
                      fill="url(#colorRevenue)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="chart-empty-state">
                <CircleDollarSign size={48} className="empty-icon" />
                <p className="empty-text">No revenue data yet</p>
                <p className="empty-subtext">Revenue will appear once bookings are made</p>
              </div>
            )}
          </div>

          {/* Occupancy Chart */}
          <div className="chart-card">
            <div className="chart-header">
              <h3 className="chart-title">Weekly Occupancy Rate</h3>
              <p className="chart-subtitle">Last 7 days performance</p>
            </div>
            {occupancyData.length > 0 ? (
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={occupancyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="day" 
                      stroke="hsl(var(--muted-foreground))"
                      style={{ fontSize: '12px' }}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))"
                      style={{ fontSize: '12px' }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar 
                      dataKey="rate" 
                      fill="hsl(var(--primary-h) var(--primary-s) var(--primary-l))"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="chart-empty-state">
                <TrendingUp size={48} className="empty-icon" />
                <p className="empty-text">No occupancy data yet</p>
                <p className="empty-subtext">Data will show once parking lots are active</p>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Row */}
        <div className="bottom-row">
          {/* Slot Status Distribution */}
          <div className="distribution-card">
            <div className="chart-header">
              <h3 className="chart-title">Slot Status Distribution</h3>
              <p className="chart-subtitle">Current allocation</p>
            </div>
            {slotDistribution.length > 0 ? (
              <>
                <div className="pie-chart-container">
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={slotDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {slotDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="legend-grid">
                  {slotDistribution.map((item, index) => (
                    <div key={index} className="legend-item">
                      <div 
                        className="legend-dot" 
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <span className="legend-label">{item.name}</span>
                      <span className="legend-value">{item.value}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="chart-empty-state">
                <ParkingCircle size={48} className="empty-icon" />
                <p className="empty-text">No slot data yet</p>
                <p className="empty-subtext">Create parking lots to see distribution</p>
              </div>
            )}
          </div>

          {/* Recent Bookings */}
          <div className="bookings-card">
            <div className="chart-header">
              <h3 className="chart-title">Recent Bookings</h3>
              <p className="chart-subtitle">Latest transactions</p>
            </div>
            {recentBookings.length > 0 ? (
              <>
                <div className="bookings-list">
                  {getPaginatedBookings().map((booking) => (
                    <div key={booking.id} className="booking-row">
                      <div className="booking-info">
                        <span className="booking-slot">{booking.slot}</span>
                        <div className="booking-details">
                          <span className="booking-vehicle">{booking.vehicle}</span>
                          <span className="booking-meta">
                            {booking.duration} • {booking.time}
                          </span>
                        </div>
                      </div>
                      <div className="booking-payment">
                        <span className="booking-amount">KES {booking.amount}</span>
                        <span className={`payment-status ${booking.status}`}>
                          {booking.status === 'paid' ? '✓ Paid' : '○ Pending'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="pagination">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="pagination-btn"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <span className="pagination-info">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="pagination-btn"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="chart-empty-state">
                <Users size={48} className="empty-icon" />
                <p className="empty-text">No bookings yet</p>
                <p className="empty-subtext">Recent bookings will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;