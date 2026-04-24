import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, ChevronDown } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import ManagerNavbar from '../../components/manager/ManagerNavbar';
import CreateLotModal from '../../components/manager/CreateLotModal';
import ParkingLotCard from '../../components/manager/ParkingLotCard';
import './SlotManagement.css';

const SlotManagement = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [parkingLots, setParkingLots] = useState([]);
  const [selectedLot, setSelectedLot] = useState(null);
  const [slots, setSlots] = useState([]);
  const [filteredSlots, setFilteredSlots] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadParkingLots();
    }
  }, [user]);

  const loadParkingLots = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/parking-lots/?manager=${user.id}`);
      const lots = response.data;
      setParkingLots(lots);
    } catch (error) {
      console.error('Failed to load parking lots', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSlots = async (lotId) => {
    try {
      const response = await api.get(`/parking-slots/?parking_lot=${lotId}`);
      const mappedSlots = response.data.map(s => ({
        ...s,
        slotNumber: s.slot_number,
      }));
      setSlots(mappedSlots);
      setFilteredSlots(mappedSlots);
    } catch (error) {
      console.error('Failed to load slots', error);
    }
  };

  const handleLotSelect = (lot) => {
    setSelectedLot(lot);
    loadSlots(lot.id);
    setSearchQuery('');
    setStatusFilter('all');
  };

  const handleManageSlots = (lot) => {
    setSelectedLot(lot);
    loadSlots(lot.id);
  };

  const handleEditLot = (lot) => {
    alert(`Edit lot: ${lot.name}\n\nEdit modal coming soon!`);
  };

  const handleDeleteLot = async (lot) => {
    if (
      window.confirm(
        `Are you sure you want to delete "${lot.name}"?\n\nThis will delete all ${lot.total_capacity} slots and cannot be undone.`
      )
    ) {
      try {
        await api.delete(`/parking-lots/${lot.id}/`);
        setParkingLots(prev => prev.filter(l => l.id !== lot.id));
        if (selectedLot?.id === lot.id) {
          setSelectedLot(null);
          setSlots([]);
        }
      } catch (error) {
        console.error('Failed to delete lot', error);
        alert('Failed to delete parking lot.');
      }
    }
  };

  /* Filter slots by search + status */
  useEffect(() => {
    let filtered = [...slots];
    if (searchQuery) {
      filtered = filtered.filter(slot =>
        slot.slotNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (slot.vehicle && slot.vehicle.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    if (statusFilter !== 'all') {
      filtered = filtered.filter(slot => slot.status === statusFilter);
    }
    setFilteredSlots(filtered);
  }, [searchQuery, statusFilter, slots]);

  /*Scroll to the top when a lot is selected */
  useEffect(() => {
    if (selectedLot) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [selectedLot]);

  /* Update a single slot's status via API and local state */
  const handleStatusChange = async (slotId, newStatus) => {
    try {
      await api.patch(`/parking-slots/${slotId}/`, { status: newStatus });
      setSlots(prev =>
        prev.map(slot => (slot.id === slotId ? { ...slot, status: newStatus } : slot))
      );
    } catch (error) {
      console.error('Failed to update slot status', error);
    }
  };

  const handleLotCreated = newLot => {
    setParkingLots(prev => [...prev, newLot]);
    setSelectedLot(newLot);
    loadSlots(newLot.id);
    setShowCreateModal(false);
  };

  /* Helpers */
  const getStatusClass = status => {
    const map = {
      available: 'available',
      occupied: 'occupied',
      maintenance: 'maintenance',
      reserved: 'reserved',
    };
    return map[status] || 'available';
  };

  const getStatusLabel = status => {
    const map = {
      available: 'Available',
      occupied: 'Occupied',
      maintenance: 'Maintenance',
      reserved: 'Reserved',
    };
    return map[status] || status;
  };

  /* Group slots by section for display */
  const groupBySection = slots => {
    return slots.reduce((acc, slot) => {
      const section = slot.section || 'General';
      if (!acc[section]) acc[section] = [];
      acc[section].push(slot);
      return acc;
    }, {});
  };

  /* Count per status for summary */
  const slotCounts = slots.reduce(
    (acc, s) => {
      acc[s.status] = (acc[s.status] || 0) + 1;
      return acc;
    },
    {}
  );

  if (loading) {
    return (
      <div className="slot-management-page">
        <ManagerNavbar />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  /* Empty — no parking lots */
  if (parkingLots.length === 0) {
    return (
      <div className="slot-management-page">
        <ManagerNavbar />
        <div className="slot-management-container">
          <div className="page-header">
            <div>
              <h1 className="page-title">Slot Management</h1>
              <p className="page-subtitle">Manage and override parking slot statuses</p>
            </div>
          </div>

          <div className="empty-state">
            <div className="empty-state-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                <path
                  d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="7" cy="17" r="2" stroke="currentColor" strokeWidth="2" />
                <circle cx="17" cy="17" r="2" stroke="currentColor" strokeWidth="2" />
              </svg>
            </div>
            <h2 className="empty-state-title">No Parking Lots Yet</h2>
            <button onClick={() => setShowCreateModal(true)} className="btn-create-lot">
              <Plus size={20} />
              Create Parking Lot
            </button>
          </div>
        </div>

        {showCreateModal && (
          <CreateLotModal
            onClose={() => setShowCreateModal(false)}
            onLotCreated={handleLotCreated}
          />
        )}
      </div>
    );
  }

  const groupedSlots = groupBySection(filteredSlots);

  return (
    <div className="slot-management-page">
      <ManagerNavbar />

      <div className="slot-management-container">
        {/* Page Header */}
        <div className="page-header">
          <div>
            <h1 className="page-title">Slot Management</h1>
            <p className="page-subtitle">Manage and override parking slot statuses</p>
          </div>
          <button onClick={() => setShowCreateModal(true)} className="btn-create-lot-small">
            <Plus size={18} />
            New Lot
          </button>
        </div>

        {/* Parking Lots Grid */}
        {/* Parking Lots Grid - Hides when a lot is selected */}
        {!selectedLot && (
          <div className="parking-lots-grid">
            {parkingLots.map(lot => (
              <ParkingLotCard
                key={lot.id}
                lot={lot}
                onManageSlots={handleManageSlots}
                onEdit={handleEditLot}
                onDelete={handleDeleteLot}
              />
            ))}
          </div>
        )}

        {/* Slot management panel — shown when a lot is selected */}
        {selectedLot && (
          <>
            {/* Selected Lot Header */}
            <div className="selected-lot-header">
              <h2 className="selected-lot-title">Managing: {selectedLot.name}</h2>
              <button onClick={() => setSelectedLot(null)} className="btn-back-to-lots">
                ← Back to Lots
              </button>
            </div>

            {/* Search + Filter */}
            <div className="filters-card">
              <div className="search-box">
                <Search size={18} className="search-icon" />
                <input
                  type="text"
                  placeholder="Search by slot number or vehicle..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="search-input"
                />
              </div>

              <div className="filter-dropdown">
                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                  className="status-filter"
                >
                  <option value="all">All Statuses</option>
                  <option value="available">Available</option>
                  <option value="occupied">Occupied</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="reserved">Reserved</option>
                </select>
                <ChevronDown size={16} className="dropdown-icon" />
              </div>
            </div>

            {/* Slots Grid Card */}
            <div className="slots-table-card">
              <div className="table-header">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <rect x="3" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="14" width="7" height="7" rx="1" />
                  <rect x="3" y="14" width="7" height="7" rx="1" />
                </svg>
                <h3 className="table-title">
                  All Slots ({filteredSlots.length})
                  {Object.entries(slotCounts).map(([s, count]) => (
                    <span
                      key={s}
                      style={{ marginLeft: '0.5rem', fontSize: 'var(--text-xs)', fontWeight: 600 }}
                      className={`slot-status-badge ${getStatusClass(s)}`}
                    >
                      {count} {getStatusLabel(s)}
                    </span>
                  ))}
                </h3>
              </div>

              {filteredSlots.length === 0 ? (
                <div className="table-empty">No slots found.</div>
              ) : (
                <div className="slots-grid-container">
                  {Object.entries(groupedSlots).map(([section, sectionSlots]) => (
                    <>
                      {Object.keys(groupedSlots).length > 1 && (
                        <div key={`label-${section}`} className="slot-section-label">
                          Section {section}
                        </div>
                      )}
                      {sectionSlots.map(slot => (
                        <div key={slot.id} className="slot-card">
                          {/* Top row: slot number + status dot */}
                          <div className="slot-card-header">
                            <span className="slot-number-badge">{slot.slotNumber}</span>
                            <span className={`slot-status-dot ${getStatusClass(slot.status)}`} />
                          </div>

                          {/* Status badge */}
                          <span className={`slot-status-badge ${getStatusClass(slot.status)}`}>
                            {getStatusLabel(slot.status)}
                          </span>

                          {/* Vehicle (if any) */}
                          {slot.vehicle && (
                            <div className="slot-vehicle" title={slot.vehicle}>
                              {slot.vehicle}
                            </div>
                          )}

                          {/* Action dropdown — per slot */}
                          <select
                            value={slot.status}
                            onChange={e => handleStatusChange(slot.id, e.target.value)}
                            className="slot-action-select"
                            title="Change slot status"
                          >
                            <option value="available">→ Available</option>
                            <option value="occupied">→ Occupied</option>
                            <option value="maintenance">→ Maintenance</option>
                            <option value="reserved">→ Reserved</option>
                          </select>
                        </div>
                      ))}
                    </>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Create Lot Modal */}
      {showCreateModal && (
        <CreateLotModal
          onClose={() => setShowCreateModal(false)}
          onLotCreated={handleLotCreated}
        />
      )}
    </div>
  );
};

export default SlotManagement;