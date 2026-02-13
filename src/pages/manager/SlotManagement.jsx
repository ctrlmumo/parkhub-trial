import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, ChevronDown } from 'lucide-react';
import ManagerNavbar from '../../components/manager/ManagerNavbar';
import CreateLotModal from '../../components/manager/CreateLotModal';
import ParkingLotCard from '../../components/manager/ParkingLotCard';
import './SlotManagement.css';

const SlotManagement = () => {
  const navigate = useNavigate();
  const [parkingLots, setParkingLots] = useState([]);
  const [selectedLot, setSelectedLot] = useState(null);
  const [slots, setSlots] = useState([]);
  const [filteredSlots, setFilteredSlots] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(true);

  /* Load manager's parking lots on mount */
  useEffect(() => {
    loadParkingLots();
  }, []);

  /*
   * Load parking lots
   * TODO: Replace with API call
   */
  const loadParkingLots = async () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Mock data - empty initially
      const mockLots = [];
      
      // Uncomment for demo data:
      // const mockLots = [
      //   { id: 1, name: 'Main Campus Lot', location: 'University Way, Nairobi', totalSlots: 48 },
      //   { id: 2, name: 'Library Parking', location: 'Library Block, Nairobi', totalSlots: 32 }
      // ];
      
      setParkingLots(mockLots);
      
      if (mockLots.length > 0) {
        setSelectedLot(mockLots[0]);
        loadSlots(mockLots[0].id);
      }
      
      setLoading(false);
    }, 500);
  };

  /* Load slots for selected lot */
  const loadSlots = (lotId) => {
    // Mock slots data
    const mockSlots = [];
    const sections = ['A', 'B', 'C', 'D'];
    const statuses = ['available', 'occupied', 'maintenance'];
    
    sections.forEach(section => {
      for (let i = 1; i <= 12; i++) {
        const slotNumber = `${section}${i.toString().padStart(2, '0')}`;
        const statusIndex = Math.floor(Math.random() * statuses.length);
        
        mockSlots.push({
          id: `${lotId}-${slotNumber}`,
          slotNumber: slotNumber,
          section: `Section ${section}`,
          status: statuses[statusIndex],
          vehicle: statuses[statusIndex] === 'occupied' ? `KCA ${Math.floor(Math.random() * 999)}B` : null
        });
      }
    });
    
    setSlots(mockSlots);
    setFilteredSlots(mockSlots);
  };

  /* Handle lot selection */
  const handleLotSelect = (lot) => {
    setSelectedLot(lot);
    loadSlots(lot.id);
    setSearchQuery('');
    setStatusFilter('all');
  };

  /* Handle search */
  useEffect(() => {
    let filtered = [...slots];
    
    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(slot =>
        slot.slotNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (slot.vehicle && slot.vehicle.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(slot => slot.status === statusFilter);
    }
    
    setFilteredSlots(filtered);
  }, [searchQuery, statusFilter, slots]);

  /**
   * Handle status change
   */
  const handleStatusChange = (slotId, newStatus) => {
    setSlots(prevSlots =>
      prevSlots.map(slot =>
        slot.id === slotId ? { ...slot, status: newStatus, vehicle: newStatus === 'available' ? null : slot.vehicle } : slot
      )
    );
  };

  /**
   * Handle lot created
   */
  const handleLotCreated = (newLot) => {
    setParkingLots(prev => [...prev, newLot]);
    setSelectedLot(newLot);
    loadSlots(newLot.id);
    setShowCreateModal(false);
  };

  /**
   * Get status badge class
   */
  const getStatusClass = (status) => {
    const classes = {
      available: 'status-available',
      occupied: 'status-occupied',
      maintenance: 'status-maintenance'
    };
    return classes[status] || 'status-available';
  };

  /**
   * Get status label
   */
  const getStatusLabel = (status) => {
    const labels = {
      available: 'Available',
      occupied: 'Occupied',
      maintenance: 'Maintenance'
    };
    return labels[status] || status;
  };

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

  // Empty state - no parking lots
  if (parkingLots.length === 0) {
    return (
      <div className="slot-management-page">
        <ManagerNavbar />
        
        <div className="slot-management-container">
          <div className="page-header">
            <div>
              <h1 className="page-title">Slot Management</h1>
            </div>
          </div>

          {/* Empty State */}
          <div className="empty-state">
            <div className="empty-state-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="7" cy="17" r="2" stroke="currentColor" strokeWidth="2"/>
                <circle cx="17" cy="17" r="2" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </div>
            <h2 className="empty-state-title">No Parking Lots Yet</h2>
            <p className="empty-state-description">
              Create your first parking lot to start managing slots and accepting bookings.
            </p>
            <button 
              onClick={() => setShowCreateModal(true)}
              className="btn-create-lot"
            >
              <Plus size={20} />
              Create Parking Lot
            </button>
          </div>
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
  }

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
          <button 
            onClick={() => setShowCreateModal(true)}
            className="btn-create-lot-small"
          >
            <Plus size={18} />
            New Lot
          </button>
        </div>

        {/* Parking Lot Selector */}
        <div className="lot-selector-card">
          <label className="lot-selector-label">Select Parking Lot:</label>
          <div className="lot-selector-buttons">
            {parkingLots.map(lot => (
              <button
                key={lot.id}
                onClick={() => handleLotSelect(lot)}
                className={`lot-button ${selectedLot?.id === lot.id ? 'active' : ''}`}
              >
                <div className="lot-button-content">
                  <span className="lot-name">{lot.name}</span>
                  <span className="lot-location">{lot.location}</span>
                </div>
                <span className="lot-slots">{lot.totalSlots} slots</span>
              </button>
            ))}
          </div>
        </div>

        {/* Search and Filter */}
        <div className="filters-card">
          <div className="search-box">
            <Search size={20} className="search-icon" />
            <input
              type="text"
              placeholder="Search by slot number or vehicle..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-dropdown">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="status-filter"
            >
              <option value="all">All Statuses</option>
              <option value="available">Available</option>
              <option value="occupied">Occupied</option>
              <option value="maintenance">Maintenance</option>
            </select>
            <ChevronDown size={18} className="dropdown-icon" />
          </div>
        </div>

        {/* Slots Table */}
        <div className="slots-table-card">
          <div className="table-header">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <rect x="3" y="3" width="7" height="7" rx="1"/>
              <rect x="14" y="3" width="7" height="7" rx="1"/>
              <rect x="14" y="14" width="7" height="7" rx="1"/>
              <rect x="3" y="14" width="7" height="7" rx="1"/>
            </svg>
            <h3 className="table-title">
              All Parking Slots ({filteredSlots.length})
            </h3>
          </div>

          <div className="table-container">
            <table className="slots-table">
              <thead>
                <tr>
                  <th>Slot</th>
                  <th>Section</th>
                  <th>Status</th>
                  <th>Vehicle</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSlots.map(slot => (
                  <tr key={slot.id}>
                    <td>
                      <span className="slot-number">{slot.slotNumber}</span>
                    </td>
                    <td>
                      <span className="slot-section">{slot.section}</span>
                    </td>
                    <td>
                      <span className={`status-badge ${getStatusClass(slot.status)}`}>
                        <span className="status-dot"></span>
                        {getStatusLabel(slot.status)}
                      </span>
                    </td>
                    <td>
                      <span className="vehicle-number">
                        {slot.vehicle || '—'}
                      </span>
                    </td>
                    <td>
                      <div className="actions-dropdown">
                        <select
                          value={slot.status}
                          onChange={(e) => handleStatusChange(slot.id, e.target.value)}
                          className="action-select"
                        >
                          <option value="available">Available</option>
                          <option value="occupied">Occupied</option>
                          <option value="maintenance">Maintenance</option>
                        </select>
                        <ChevronDown size={16} className="action-dropdown-icon" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredSlots.length === 0 && (
              <div className="table-empty">
                <p>No slots found matching your criteria.</p>
              </div>
            )}
          </div>
        </div>
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