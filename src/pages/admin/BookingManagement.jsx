import { useState, useEffect } from 'react';
import { Search, Filter, ChevronDown, MoreVertical, Eye, XCircle, DollarSign, Calendar } from 'lucide-react';
import AdminNavbar from '../../components/admin/AdminNavbar';
import './BookingManagement.css';
import api from '../../services/api'

const BookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [lotFilter, setLotFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [availableLots, setAvailableLots] = useState([]);

  /* Load bookings on mount */
  useEffect(() => {
    loadBookings();
    loadLots();
  }, []);

  /* Load parking lots for the filter dropdown */
  const loadLots = async () => {
    try {
      const response = await api.get('/parking-lots/');
      setAvailableLots(response.data);
    } catch (error) {
      console.error("Failed to load lots for filter:", error);
    }
  };

  /* Load all bookings */
  const loadBookings = async () => {
    setLoading(true);
    try {
      const response = await api.get('/bookings/');
      
      // Map the backend structure to the table's expected format
      const formattedBookings = response.data.map(booking => ({
        id: booking.id,
        user: booking.user_details ? booking.user_details.username : `User #${booking.user}`,
        lot: booking.slot_details?.lot_details?.name || 'Unknown Lot',
        slot: booking.slot_details?.slot_number || 'N/A',
        vehicle: booking.vehicle_number,
        duration: `${booking.duration_hours}h`,
        amount: booking.total_amount,
        payment: booking.status === 'active' || booking.status === 'completed' ? 'paid' : 'pending',
        status: booking.status
      }));
      
      setBookings(formattedBookings);
      setFilteredBookings(formattedBookings);
    } catch (error) {
      console.error("Failed to load bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  /* Handle search and filters */
  useEffect(() => {
    let filtered = [...bookings];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(booking =>
        booking.id.toString().includes(searchQuery) ||
        booking.vehicle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.slot.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(booking => booking.status === statusFilter);
    }

    // Lot filter
    if (lotFilter !== 'all') {
      filtered = filtered.filter(booking => booking.lot === lotFilter);
    }

    setFilteredBookings(filtered);
  }, [searchQuery, statusFilter, lotFilter, bookings]);

  /* Action handlers */
  const handleViewBooking = (booking) => {
    alert(`View booking: #${booking.id}\n\nBooking details modal coming soon!`);
  };

const handleCancelBooking = async (booking) => {
    if (window.confirm(`Are you sure you want to cancel booking #${booking.id}?`)) {
      try {
        // Send a PATCH request to cancel the booking in the database
        await api.patch(`/bookings/${booking.id}/`, { status: 'cancelled' });
        
        // Update the React state
        setBookings(prev =>
          prev.map(b => b.id === booking.id ? { ...b, status: 'cancelled' } : b)
        );
        alert(`Booking #${booking.id} cancelled successfully.`);
      } catch (error) {
        console.error("Failed to cancel booking:", error);
        alert("Failed to cancel booking.");
      }
    }
  };

  const handleIssueRefund = async (booking) => {
    if (window.confirm(`Issue refund of KES ${booking.amount} for booking #${booking.id}?`)) {
      try {
        // Assuming you have a custom action or payment endpoint for refunds
        // If not, we can just patch the booking status for now
        await api.patch(`/bookings/${booking.id}/`, { status: 'cancelled' }); 
        
        setBookings(prev =>
          prev.map(b => b.id === booking.id ? { ...b, payment: 'refunded', status: 'cancelled' } : b)
        );
        alert(`Refund of KES ${booking.amount} issued successfully.`);
      } catch (error) {
        console.error("Failed to issue refund:", error);
        alert("Failed to issue refund.");
      }
    }
  };

  /* Get status badge class */
  const getStatusBadgeClass = (status) => {
    const classes = {
      active: 'status-active',
      completed: 'status-completed',
      cancelled: 'status-cancelled'
    };
    return classes[status] || 'status-active';
  };

  /* Get payment status badge class */
  const getPaymentBadgeClass = (status) => {
    const classes = {
      paid: 'payment-paid',
      pending: 'payment-pending',
      refunded: 'payment-refunded'
    };
    return classes[status] || 'payment-pending';
  };

  if (loading) {
    return (
      <div className="booking-management-page">
        <AdminNavbar />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-management-page">
      <AdminNavbar />
      
      <div className="booking-management-container">
        {/* Page Header */}
        <div className="page-header">
          <div>
            <h1 className="page-title">Booking Management</h1>
            <p className="page-subtitle">View and manage all platform bookings</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="filters-section">
          {/* Search */}
          <div className="search-box">
            <Search size={20} className="search-icon" />
            <input
              type="text"
              placeholder="Search by booking ID, vehicle, or slot..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          {/* Status Filter */}
          <div className="filter-dropdown">
            <Filter size={18} className="filter-icon" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <ChevronDown size={18} className="dropdown-icon" />
          </div>

          {/* Lot Filter */}
          <div className="filter-dropdown">
            <select
              value={lotFilter}
              onChange={(e) => setLotFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Parking Lots</option>
              {availableLots.map(lot => (
                <option key={lot.id} value={lot.name}>
                  {lot.name}
                </option>
              ))}
            </select>
            <ChevronDown size={18} className="dropdown-icon" />
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bookings-table-card">
          <div className="table-header">
            <h3 className="table-title">All Bookings ({filteredBookings.length})</h3>
          </div>

          {filteredBookings.length > 0 ? (
            <div className="table-container">
              <table className="bookings-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>User</th>
                    <th>Parking Lot</th>
                    <th>Slot</th>
                    <th>Vehicle</th>
                    <th>Duration</th>
                    <th>Amount</th>
                    <th>Payment</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map((booking) => (
                    <tr key={booking.id}>
                      <td>
                        <span className="booking-id">#{booking.id}</span>
                      </td>
                      <td>
                        <span className="booking-user">{booking.user}</span>
                      </td>
                      <td>
                        <span className="booking-lot">{booking.lot}</span>
                      </td>
                      <td>
                        <span className="booking-slot">{booking.slot}</span>
                      </td>
                      <td>
                        <span className="booking-vehicle">{booking.vehicle}</span>
                      </td>
                      <td>
                        <span className="booking-duration">{booking.duration}</span>
                      </td>
                      <td>
                        <span className="booking-amount">KES {booking.amount}</span>
                      </td>
                      <td>
                        <span className={`payment-badge ${getPaymentBadgeClass(booking.payment)}`}>
                          {booking.payment}
                        </span>
                      </td>
                      <td>
                        <span className={`status-badge ${getStatusBadgeClass(booking.status)}`}>
                          {booking.status}
                        </span>
                      </td>
                      <td>
                        <div className="actions-cell">
                          <button
                            onClick={() => setOpenDropdown(openDropdown === booking.id ? null : booking.id)}
                            className="actions-btn"
                          >
                            <MoreVertical size={18} />
                          </button>
                          
                          {openDropdown === booking.id && (
                            <div className="actions-dropdown">
                              <button 
                                onClick={() => handleViewBooking(booking)}
                                className="action-item"
                              >
                                <Eye size={16} />
                                <span>View Details</span>
                              </button>
                              <button 
                                onClick={() => handleCancelBooking(booking)}
                                className="action-item action-warning"
                              >
                                <XCircle size={16} />
                                <span>Cancel Booking</span>
                              </button>
                              <button 
                                onClick={() => handleIssueRefund(booking)}
                                className="action-item"
                              >
                                <DollarSign size={16} />
                                <span>Issue Refund</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              <Calendar size={48} className="empty-icon" />
              <p className="empty-text">No bookings found</p>
              <p className="empty-subtext">
                {searchQuery || statusFilter !== 'all' || lotFilter !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Bookings will appear here once users start booking'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingManagement;