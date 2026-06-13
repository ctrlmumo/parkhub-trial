import { useState, useEffect } from 'react';
import { Search, ChevronDown, MoreVertical, Edit2, Trash2, Eye, Building2, ParkingCircle, MapPin, CheckCircle, XCircle, Plus, User } from 'lucide-react';
import api from '../../services/api';
import AdminNavbar from '../../components/admin/AdminNavbar';
import Button from '../../components/common/Button';
import EditLotModal from '../../components/manager/EditLotModal';
import './LotManagement.css';

const LotManagement = () => {
  const [lots, setLots] = useState([]);
  const [filteredLots, setFilteredLots] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [editingLot, setEditingLot] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    totalCapacity: 0,
  });

  useEffect(() => {
    loadLots();
  }, []);

  const loadLots = async () => {
    setLoading(true);
    try {
      const response = await api.get('/parking-lots/');
      const data = response.data;
      setLots(data);
      setFilteredLots(data);
      computeStats(data);
    } catch (error) {
      console.error('Failed to load parking lots:', error);
    } finally {
      setLoading(false);
    }
  };

  const computeStats = (data) => {
    setStats({
      total: data.length,
      active: data.filter(l => l.is_active).length,
      inactive: data.filter(l => !l.is_active).length,
      totalCapacity: data.reduce((sum, l) => sum + (l.total_capacity || 0), 0),
    });
  };

  // Filter logic
  useEffect(() => {
    let filtered = [...lots];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        l =>
          l.name.toLowerCase().includes(q) ||
          l.location.toLowerCase().includes(q) ||
          (l.manager_name || '').toLowerCase().includes(q)
      );
    }
    if (statusFilter !== 'all') {
      filtered = filtered.filter(l =>
        statusFilter === 'active' ? l.is_active : !l.is_active
      );
    }
    setFilteredLots(filtered);
  }, [searchQuery, statusFilter, lots]);

  const handleToggleStatus = async (lot) => {
    try {
      const response = await api.patch(`/parking-lots/${lot.id}/`, {
        is_active: !lot.is_active,
      });
      const updated = lots.map(l => (l.id === lot.id ? response.data : l));
      setLots(updated);
      computeStats(updated);
    } catch (error) {
      console.error('Failed to toggle lot status:', error);
      alert('Failed to update lot status.');
    }
    setOpenDropdown(null);
  };

  const handleDelete = async (lot) => {
    if (
      !window.confirm(
        `Delete "${lot.name}"?\n\nThis will permanently remove the lot and all its slots.`
      )
    )
      return;

    try {
      await api.delete(`/parking-lots/${lot.id}/`);
      const updated = lots.filter(l => l.id !== lot.id);
      setLots(updated);
      computeStats(updated);
    } catch (error) {
      console.error('Failed to delete lot:', error);
      alert('Failed to delete parking lot.');
    }
    setOpenDropdown(null);
  };

  const handleEdit = (lot) => {
    setEditingLot(lot);
    setOpenDropdown(null);
  };

  const handleLotUpdated = (updatedLot) => {
    const updated = lots.map(l => (l.id === updatedLot.id ? updatedLot : l));
    setLots(updated);
    computeStats(updated);
    setEditingLot(null);
  };

  const handleViewSlots = (lot) => {
    // Navigate to slot management filtered to this lot
    window.location.href = `/manager/slot-management?lot=${lot.id}`;
    setOpenDropdown(null);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = () => setOpenDropdown(null);
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  if (loading) {
    return (
      <div className="lot-management-page">
        <AdminNavbar />
        <div className="loading-container">
          <div className="loading-spinner" />
          <p>Loading parking lots...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="lot-management-page">
      <AdminNavbar />

      <div className="lot-management-container">

        {/* Header */}
        <div className="page-header">
          <div className="page-header-text">
            <h1 className="page-title">Lot Management</h1>
            <p className="page-subtitle">View and manage all parking lots across the platform</p>
          </div>
        </div>

        {/* Stats */}
        <div className="lot-stats-row">
          <div className="lot-stat-card">
            <div className="lot-stat-icon lot-stat-icon-blue">
              <Building2 size={22} />
            </div>
            <div className="lot-stat-info">
              <span className="lot-stat-value">{stats.total}</span>
              <span className="lot-stat-label">Total Lots</span>
            </div>
          </div>

          <div className="lot-stat-card">
            <div className="lot-stat-icon lot-stat-icon-green">
              <CheckCircle size={22} />
            </div>
            <div className="lot-stat-info">
              <span className="lot-stat-value">{stats.active}</span>
              <span className="lot-stat-label">Active</span>
            </div>
          </div>

          <div className="lot-stat-card">
            <div className="lot-stat-icon lot-stat-icon-red">
              <XCircle size={22} />
            </div>
            <div className="lot-stat-info">
              <span className="lot-stat-value">{stats.inactive}</span>
              <span className="lot-stat-label">Inactive</span>
            </div>
          </div>

          <div className="lot-stat-card">
            <div className="lot-stat-icon lot-stat-icon-amber">
              <ParkingCircle size={22} />
            </div>
            <div className="lot-stat-info">
              <span className="lot-stat-value">{stats.totalCapacity}</span>
              <span className="lot-stat-label">Total Capacity</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="filters-section">
          <div className="search-box">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search by name, location, or manager..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="filter-dropdown">
            <select
              className="filter-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <ChevronDown size={16} className="dropdown-icon" />
          </div>
        </div>

        {/* Table */}
        <div className="lots-table-card">
          <div className="table-header-row">
            <h3 className="table-title">All Parking Lots ({filteredLots.length})</h3>
          </div>

          {filteredLots.length > 0 ? (
            <div className="table-container">
              <table className="lots-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Location</th>
                    <th>Manager</th>
                    <th>Capacity</th>
                    <th>Rate / hr</th>
                    <th>Hours</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLots.map((lot) => (
                    <tr key={lot.id}>
                      <td>
                        <span className="lot-name-cell">{lot.name}</span>
                      </td>
                      <td>
                        <div className="lot-location-cell">
                          <MapPin size={13} />
                          {lot.location}
                        </div>
                      </td>
                      <td>
                        <div className="lot-manager-cell">
                          <div className="manager-avatar">
                            {lot.manager_name
                              ? lot.manager_name.charAt(0).toUpperCase()
                              : <User size={12} />}
                          </div>
                          {lot.manager_name || `ID: ${lot.manager}`}
                        </div>
                      </td>
                      <td>
                        <span className="capacity-cell">{lot.total_capacity} slots</span>
                      </td>
                      <td>
                        <span className="rate-cell">KES {lot.hourly_rate}</span>
                      </td>
                      <td>
                        {lot.is_24_7
                          ? '24 / 7'
                          : lot.open_time && lot.close_time
                          ? `${lot.open_time} – ${lot.close_time}`
                          : '—'}
                      </td>
                      <td>
                        <span className={`status-badge status-badge-${lot.is_active ? 'active' : 'inactive'}`}>
                          <span className="status-dot" />
                          {lot.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        <div className="actions-cell">
                          <button
                            className="actions-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenDropdown(openDropdown === lot.id ? null : lot.id);
                            }}
                          >
                            <MoreVertical size={17} />
                          </button>

                          {openDropdown === lot.id && (
                            <div
                              className="actions-dropdown-menu"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button
                                className="action-item"
                                onClick={() => handleViewSlots(lot)}
                              >
                                <Eye size={15} />
                                View Slots
                              </button>
                              <button
                                className="action-item"
                                onClick={() => handleEdit(lot)}
                              >
                                <Edit2 size={15} />
                                Edit Lot
                              </button>
                              <button
                                className="action-item"
                                onClick={() => handleToggleStatus(lot)}
                              >
                                {lot.is_active ? (
                                  <><XCircle size={15} /> Deactivate</>
                                ) : (
                                  <><CheckCircle size={15} /> Activate</>
                                )}
                              </button>
                              <button
                                className="action-item action-item-danger"
                                onClick={() => handleDelete(lot)}
                              >
                                <Trash2 size={15} />
                                Delete Lot
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
              <Building2 size={48} className="empty-icon" />
              <p className="empty-text">No parking lots found</p>
              <p className="empty-subtext">
                {searchQuery || statusFilter !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Parking lots created by managers will appear here'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {editingLot && (
        <EditLotModal
          lot={editingLot}
          onClose={() => setEditingLot(null)}
          onLotUpdated={handleLotUpdated}
        />
      )}
    </div>
  );
};

export default LotManagement;