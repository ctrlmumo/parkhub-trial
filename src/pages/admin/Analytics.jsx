import { useState, useEffect } from 'react';
import api from '../../services/api';
import { 
  CircleDollarSign, 
  TrendingUp,
  Users,
  Building2,
  Calendar,
  Download,
  FileText
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import AdminNavbar from '../../components/admin/AdminNavbar';
import './Analytics.css';

const Analytics = () => {
  const [revenueData, setRevenueData] = useState([]);
  const [bookingData, setBookingData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [lotData, setLotData] = useState([]);
  const [paymentMethodData, setPaymentMethodData] = useState([]);
  const [peakHoursData, setPeakHoursData] = useState([]);
  const [userActivityData, setUserActivityData] = useState([]);
  const [occupancyData, setOccupancyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  // Colors for Pie Charts
  const PIE_COLORS = ['hsl(var(--primary-h) var(--primary-s) var(--primary-l))', 'hsl(142, 70%, 50%)', 'hsl(38, 95%, 50%)', 'hsl(0, 70%, 50%)'];

  /* Load analytics data */
  useEffect(() => {
    loadAnalyticsData();
  }, []);

  /**
   * Load all analytics data
   */
  const loadAnalyticsData = async () => {
    setLoading(true);
    try {
      const [
        revenueRes, bookingRes, userRes, lotRes,
        paymentMethodRes, peakHoursRes, userActivityRes, occupancyRes
      ] = await Promise.all([
        api.get('/admin/analytics/revenue-over-time/'),
        api.get('/admin/analytics/booking-trends/'),
        api.get('/admin/analytics/user-growth/'),
        api.get('/admin/analytics/top-lots/'),
        api.get('/admin/analytics/revenue-by-payment-method/'),
        api.get('/admin/analytics/peak-hours/'),
        api.get('/admin/analytics/user-activity/'),
        api.get('/admin/analytics/occupancy-overview/')
      ]).catch(err => {
          console.error("An API call for analytics failed:", err);
          // Return an array of empty objects to avoid destructuring errors
          return Array(8).fill({});
      });

      setRevenueData(revenueRes.data || []);
      setBookingData(bookingRes.data || []);
      setUserData(userRes.data || []);
      setLotData(lotRes.data || []);
      setPaymentMethodData(paymentMethodRes.data || []);
      setPeakHoursData(peakHoursRes.data || []);
      setUserActivityData(userActivityRes.data || []);
      setOccupancyData(occupancyRes.data || []);

    } catch (error) {
      console.error("Failed to load analytics data:", error);
    } finally {
      setLoading(false);
    }
  };

  const downloadFile = (data, filename) => {
    const url = window.URL.createObjectURL(new Blob([data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  /* Export handlers */
  const handleExport = async (format) => {
    if (isExporting) return;
    setIsExporting(true);
    const fileExtension = format === 'pdf' ? 'pdf' : 'xlsx';
    try {
      const response = await api.get(`/admin/export-analytics/?format=${fileExtension}`, {
        responseType: 'blob',
      });
      const filename = `parkhub_analytics_${new Date().toISOString().slice(0,10)}.${fileExtension}`;
      downloadFile(response.data, filename);
    } catch (error) {
      console.error(`Error exporting to ${format.toUpperCase()}:`, error);
      alert(`Failed to generate ${format.toUpperCase()} report. Please try again.`);
    } finally {
      setIsExporting(false);
    }
  };

  /* Custom tooltip */
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="chart-tooltip">
          <p className="tooltip-label">{label}</p>
          <p className="tooltip-value">
            {payload[0].name === 'revenue' || payload[0].name === 'amount' ? 'KES ' : ''}
            {payload[0].value}
            {payload[0].name === 'rate' ? '%' : ''}
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="analytics-page">
        <AdminNavbar />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="analytics-page">
      <AdminNavbar />
      
      <div className="analytics-container">
        {/* Page Header */}
        <div className="page-header">
          <div>
            <h1 className="page-title">Analytics & Reports</h1>
            <p className="page-subtitle">Platform-wide insights and data</p>
          </div>
          <div className="export-buttons">
            <button onClick={() => handleExport('pdf')} className="export-btn" disabled={isExporting}>
              <FileText size={18} />
              <span>{isExporting ? 'Exporting...' : 'Export PDF'}</span>
            </button>
            <button onClick={() => handleExport('excel')} className="export-btn" disabled={isExporting}>
              <Download size={18} />
              <span>{isExporting ? 'Exporting...' : 'Export Excel'}</span>
            </button>
          </div>
        </div>

        {/* Revenue Analytics Section */}
        <div className="analytics-section">
          <div className="section-header">
            <div className="section-header-content">
              <CircleDollarSign size={24} className="section-icon" />
              <div>
                <h2 className="section-title">Revenue Analytics</h2>
                <p className="section-subtitle">Platform earnings and trends</p>
              </div>
            </div>
          </div>

          <div className="charts-grid-2">
            {/* Total Revenue Chart */}
            <div className="chart-card">
              <div className="chart-header">
                <h3 className="chart-title">Total Revenue (Last 30 Days)</h3>
                <p className="chart-subtitle">Daily revenue breakdown</p>
              </div>
              {revenueData.length > 0 ? (
                <div className="chart-container">
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={revenueData}>
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(142, 70%, 50%)" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="hsl(142, 70%, 50%)" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" style={{ fontSize: '12px' }} />
                      <YAxis stroke="hsl(var(--muted-foreground))" style={{ fontSize: '12px' }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Area type="monotone" dataKey="revenue" stroke="hsl(142, 70%, 50%)" strokeWidth={2} fill="url(#colorRevenue)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="chart-empty-state">
                  <CircleDollarSign size={48} className="empty-icon" />
                  <p className="empty-text">No revenue data</p>
                  <p className="empty-subtext">Revenue data will appear once bookings are completed</p>
                </div>
              )}
            </div>

            {/* Revenue by Payment Method */}
            <div className="chart-card">
              <div className="chart-header">
                <h3 className="chart-title">Revenue by Payment Method</h3>
                <p className="chart-subtitle">Payment distribution</p>
              </div>
              {paymentMethodData.length > 0 ? (
                <div className="chart-container">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={paymentMethodData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {paymentMethodData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `KES ${value.toLocaleString()}`} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="chart-empty-state">
                  <CircleDollarSign size={48} className="empty-icon" />
                  <p className="empty-text">No payment data</p>
                  <p className="empty-subtext">Payment method breakdown will appear here</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Usage Analytics Section */}
        <div className="analytics-section">
          <div className="section-header">
            <div className="section-header-content">
              <Calendar size={24} className="section-icon" />
              <div>
                <h2 className="section-title">Usage Analytics</h2>
                <p className="section-subtitle">Booking patterns and trends</p>
              </div>
            </div>
          </div>

          <div className="charts-grid-2">
            {/* Bookings Trend */}
            <div className="chart-card">
              <div className="chart-header">
                <h3 className="chart-title">Booking Trends</h3>
                <p className="chart-subtitle">Bookings over time</p>
              </div>
              {bookingData.length > 0 ? (
                <div className="chart-container">
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={bookingData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" style={{ fontSize: '12px' }} />
                      <YAxis stroke="hsl(var(--muted-foreground))" style={{ fontSize: '12px' }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Line type="monotone" dataKey="bookings" stroke="hsl(var(--primary-h) var(--primary-s) var(--primary-l))" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="chart-empty-state">
                  <Calendar size={48} className="empty-icon" />
                  <p className="empty-text">No booking data</p>
                  <p className="empty-subtext">Booking trends will appear once users start booking</p>
                </div>
              )}
            </div>

            {/* Peak Hours */}
            <div className="chart-card">
              <div className="chart-header">
                <h3 className="chart-title">Peak Hours Analysis</h3>
                <p className="chart-subtitle">Busiest booking times</p>
              </div>
              {peakHoursData.length > 0 ? (
                <div className="chart-container">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={peakHoursData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="hour" stroke="hsl(var(--muted-foreground))" style={{ fontSize: '12px' }} />
                      <YAxis stroke="hsl(var(--muted-foreground))" style={{ fontSize: '12px' }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="bookings" fill="hsl(38, 95%, 50%)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="chart-empty-state">
                  <TrendingUp size={48} className="empty-icon" />
                  <p className="empty-text">No usage data</p>
                  <p className="empty-subtext">Peak hours analysis will appear here</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* User Analytics Section */}
        <div className="analytics-section">
          <div className="section-header">
            <div className="section-header-content">
              <Users size={24} className="section-icon" />
              <div>
                <h2 className="section-title">User Analytics</h2>
                <p className="section-subtitle">User growth and activity</p>
              </div>
            </div>
          </div>

          <div className="charts-grid-2">
            {/* User Growth */}
            <div className="chart-card">
              <div className="chart-header">
                <h3 className="chart-title">User Growth</h3>
                <p className="chart-subtitle">New user sign-ups</p>
              </div>
              {userData.length > 0 ? (
                <div className="chart-container">
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={userData}>
                      <defs>
                        <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" style={{ fontSize: '12px' }} />
                      <YAxis stroke="hsl(var(--muted-foreground))" style={{ fontSize: '12px' }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Area type="monotone" dataKey="users" stroke="hsl(217, 91%, 60%)" strokeWidth={2} fill="url(#colorUsers)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="chart-empty-state">
                  <Users size={48} className="empty-icon" />
                  <p className="empty-text">No user data</p>
                  <p className="empty-subtext">User growth trends will appear here</p>
                </div>
              )}
            </div>

            {/* Active vs Inactive */}
            <div className="chart-card">
              <div className="chart-header">
                <h3 className="chart-title">User Activity</h3>
                <p className="chart-subtitle">Active vs inactive users</p>
              </div>
              {userActivityData.length > 0 ? (
                <div className="chart-container">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={userActivityData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {userActivityData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="chart-empty-state">
                  <Users size={48} className="empty-icon" />
                  <p className="empty-text">No activity data</p>
                  <p className="empty-subtext">User activity data will appear here</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Parking Lot Analytics Section */}
        <div className="analytics-section">
          <div className="section-header">
            <div className="section-header-content">
              <Building2 size={24} className="section-icon" />
              <div>
                <h2 className="section-title">Parking Lot Analytics</h2>
                <p className="section-subtitle">Lot performance and utilization</p>
              </div>
            </div>
          </div>

          <div className="charts-grid-2">
            {/* Top Performing Lots */}
            <div className="chart-card">
              <div className="chart-header">
                <h3 className="chart-title">Top Performing Lots</h3>
                <p className="chart-subtitle">By revenue</p>
              </div>
              {lotData.length > 0 ? (
                <div className="chart-container">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={lotData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis type="number" stroke="hsl(var(--muted-foreground))" style={{ fontSize: '12px' }} />
                      <YAxis dataKey="name" type="category" stroke="hsl(var(--muted-foreground))" style={{ fontSize: '12px' }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="revenue" fill="hsl(var(--primary-h) var(--primary-s) var(--primary-l))" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="chart-empty-state">
                  <Building2 size={48} className="empty-icon" />
                  <p className="empty-text">No lot data</p>
                  <p className="empty-subtext">Top performing lots will appear here</p>
                </div>
              )}
            </div>

            {/* Average Occupancy */}
            <div className="chart-card">
              <div className="chart-header">
                <h3 className="chart-title">Current Slot Occupancy</h3>
                <p className="chart-subtitle">Across all lots</p>
              </div>
              {occupancyData.length > 0 ? (
                <div className="chart-container">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={occupancyData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {occupancyData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.name === 'Occupied' ? PIE_COLORS[3] : PIE_COLORS[1]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="chart-empty-state">
                  <TrendingUp size={48} className="empty-icon" />
                  <p className="empty-text">No occupancy data</p>
                  <p className="empty-subtext">Occupancy trends will appear here</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;