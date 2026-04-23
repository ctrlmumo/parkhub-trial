import { useState, useEffect } from 'react';
import { CircleCheck, Car, Clock, Wrench, Zap, ArrowDown, ArrowUp } from 'lucide-react';
import api from '../../services/api';
import './ParkingGrid.css';

const ParkingGrid = ({ onSlotSelect, lotData }) => {
  
  // State
  const [slots, setSlots] = useState([]);
  const [stats, setStats] = useState({
    available: 0,
    occupied: 0,
    reserved: 0,
    maintenance: 0,
    charging: 0
  });
  const [selectedSection, setSelectedSection] = useState('all');
  const [filteredSlots, setFilteredSlots] = useState([]);

  // Sections
  const sections = ['all', 'A', 'B', 'C', 'D'];

  /**
   * Fetch real parking slots from the Django API when the component mounts
   * or when the lotData changes.
   */
  useEffect(() => {
    const fetchSlots = async () => {
      // Don't attempt to fetch if we don't have a valid lot ID yet
      if (!lotData?.id) return;
      
      try {
        // Fetch slots filtered by the current parking lot
        const response = await api.get(`/parking-slots/?parking_lot=${lotData.id}`);
        
        // Map the backend data to match the frontend expected format
        const fetchedSlots = response.data.map(slot => ({
          id: slot.id, // IMPORTANT: The real database primary key needed for booking
          number: slot.slot_number,
          section: slot.section || 'A', // Fallback to 'A' if section is null
          status: slot.status,
          hasCharging: slot.is_ev_charging,
          rate: lotData.pricing?.hourly || 50
        }));
        
        setSlots(fetchedSlots);
      } catch (error) {
        console.error("Failed to fetch slots:", error);
      }
    };

    fetchSlots();
  }, [lotData]);

  /**
   * Calculate stats when slots change
   */
  useEffect(() => {
    const newStats = {
      available: slots.filter(s => s.status === 'available').length,
      occupied: slots.filter(s => s.status === 'occupied').length,
      reserved: slots.filter(s => s.status === 'reserved').length,
      maintenance: slots.filter(s => s.status === 'maintenance').length,
      charging: slots.filter(s => s.hasCharging).length
    };
    setStats(newStats);
  }, [slots]);

  /**
   * Filter slots by section
   */
  useEffect(() => {
    if (selectedSection === 'all') {
      setFilteredSlots(slots);
    } else {
      setFilteredSlots(slots.filter(s => s.section === selectedSection));
    }
  }, [selectedSection, slots]);

  /**
   * Handle slot click
   */
  const handleSlotClick = (slot) => {
    if (slot.status === 'available') {
      onSlotSelect(slot);
    }
  };

  /**
   * Get slot icon based on status
   */
  const getSlotIcon = (status) => {
    switch (status) {
      case 'occupied':
        return <Car className="slot-icon" />;
      case 'reserved':
        return <Clock className="slot-icon" />;
      case 'maintenance':
        return <Wrench className="slot-icon" />;
      default:
        return null;
    }
  };

  /**
   * Group slots by section for satellite layout
   */
  const getSlotsBySection = (sectionName) => {
    return slots.filter(s => s.section === sectionName);
  };

  return (
    <div className="parking-grid-container">
      
      {/* Stats Cards */}
      <div className="stats-grid">
        {/* Available */}
        <div className="stat-card stat-available">
          <div className="stat-icon-container stat-icon-available">
            <CircleCheck className="stat-icon" />
          </div>
          <div className="stat-content">
            <p className="stat-count">{stats.available}</p>
            <p className="stat-label">Available</p>
          </div>
        </div>

        {/* Occupied */}
        <div className="stat-card stat-occupied">
          <div className="stat-icon-container stat-icon-occupied">
            <Car className="stat-icon" />
          </div>
          <div className="stat-content">
            <p className="stat-count">{stats.occupied}</p>
            <p className="stat-label">Occupied</p>
          </div>
        </div>

        {/* Reserved */}
        <div className="stat-card stat-reserved">
          <div className="stat-icon-container stat-icon-reserved">
            <Clock className="stat-icon" />
          </div>
          <div className="stat-content">
            <p className="stat-count">{stats.reserved}</p>
            <p className="stat-label">Reserved</p>
          </div>
        </div>

        {/* Maintenance */}
        <div className="stat-card stat-maintenance">
          <div className="stat-icon-container stat-icon-maintenance">
            <Wrench className="stat-icon" />
          </div>
          <div className="stat-content">
            <p className="stat-count">{stats.maintenance}</p>
            <p className="stat-label">Maintenance</p>
          </div>
        </div>
      </div>

      {/* Section Filters */}
      <div className="section-filters">
        {sections.map((section) => (
          <button
            key={section}
            onClick={() => setSelectedSection(section)}
            className={`section-badge ${
              selectedSection === section ? 'section-badge-active' : 'section-badge-outline'
            }`}
          >
            {section === 'all' ? 'All Sections' : `Section ${section}`}
          </button>
        ))}
      </div>

      {/* Satellite-View Parking Layout */}
      <div className="slots-container">
        <div className="slots-header">
          <h3 className="slots-title">Select Your Parking Slot</h3>
        </div>

        {/* Satellite Layout */}
        {selectedSection === 'all' ? (
          <div className="satellite-layout">
            
            {/* Entry Point */}
            <div className="entry-point">
              <ArrowDown size={24} className="entry-arrow" />
              <span className="entry-label">ENTRY</span>
              <div className="entry-pulse"></div>
            </div>

            {/* Road Line to Section A/B */}
            <div className="road-line road-vertical"></div>

            {/* Sections A & B (Top Row) */}
            <div className="section-row">
              {/* Section A */}
              <div className="parking-section">
                <div className="section-label">A</div>
                <div className="section-slots">
                  {getSlotsBySection('A').map((slot) => (
                    <button
                      key={slot.id}
                      onClick={() => handleSlotClick(slot)}
                      disabled={slot.status !== 'available'}
                      className={`slot-button slot-${slot.status} ${slot.hasCharging ? 'slot-has-charging' : ''}`}
                      title={`Slot ${slot.number} - ${slot.status}${slot.hasCharging ? ' - EV Charging Available' : ''}`}
                    >
                      {/* Pulse glow for available */}
                      {slot.status === 'available' && (
                        <div className="slot-glow"></div>
                      )}
                      
                      {/* EV Charging Icon */}
                      {slot.hasCharging && (
                        <Zap className="slot-charging-badge" size={12} />
                      )}
                      
                      {/* Slot Content */}
                      <div className="slot-content">
                        {getSlotIcon(slot.status)}
                        <span className="slot-number">{slot.number}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Horizontal Road */}
              <div className="road-line road-horizontal"></div>

              {/* Section B */}
              <div className="parking-section">
                <div className="section-label">B</div>
                <div className="section-slots">
                  {getSlotsBySection('B').map((slot) => (
                    <button
                      key={slot.id}
                      onClick={() => handleSlotClick(slot)}
                      disabled={slot.status !== 'available'}
                      className={`slot-button slot-${slot.status} ${slot.hasCharging ? 'slot-has-charging' : ''}`}
                      title={`Slot ${slot.number} - ${slot.status}${slot.hasCharging ? ' - EV Charging Available' : ''}`}
                    >
                      {slot.status === 'available' && (
                        <div className="slot-glow"></div>
                      )}
                      {slot.hasCharging && (
                        <Zap className="slot-charging-badge" size={12} />
                      )}
                      <div className="slot-content">
                        {getSlotIcon(slot.status)}
                        <span className="slot-number">{slot.number}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Road Line to Section C/D */}
            <div className="road-line road-vertical"></div>

            {/* Sections C & D (Bottom Row) */}
            <div className="section-row">
              {/* Section C */}
              <div className="parking-section">
                <div className="section-label">C</div>
                <div className="section-slots">
                  {getSlotsBySection('C').map((slot) => (
                    <button
                      key={slot.id}
                      onClick={() => handleSlotClick(slot)}
                      disabled={slot.status !== 'available'}
                      className={`slot-button slot-${slot.status} ${slot.hasCharging ? 'slot-has-charging' : ''}`}
                      title={`Slot ${slot.number} - ${slot.status}${slot.hasCharging ? ' - EV Charging Available' : ''}`}
                    >
                      {slot.status === 'available' && (
                        <div className="slot-glow"></div>
                      )}
                      {slot.hasCharging && (
                        <Zap className="slot-charging-badge" size={12} />
                      )}
                      <div className="slot-content">
                        {getSlotIcon(slot.status)}
                        <span className="slot-number">{slot.number}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Horizontal Road */}
              <div className="road-line road-horizontal"></div>

              {/* Section D */}
              <div className="parking-section">
                <div className="section-label">D</div>
                <div className="section-slots">
                  {getSlotsBySection('D').map((slot) => (
                    <button
                      key={slot.id}
                      onClick={() => handleSlotClick(slot)}
                      disabled={slot.status !== 'available'}
                      className={`slot-button slot-${slot.status} ${slot.hasCharging ? 'slot-has-charging' : ''}`}
                      title={`Slot ${slot.number} - ${slot.status}${slot.hasCharging ? ' - EV Charging Available' : ''}`}
                    >
                      {slot.status === 'available' && (
                        <div className="slot-glow"></div>
                      )}
                      {slot.hasCharging && (
                        <Zap className="slot-charging-badge" size={12} />
                      )}
                      <div className="slot-content">
                        {getSlotIcon(slot.status)}
                        <span className="slot-number">{slot.number}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Road Line to Exit */}
            <div className="road-line road-vertical"></div>

            {/* Exit Point */}
            <div className="exit-point">
              <div className="exit-pulse"></div>
              <span className="exit-label">EXIT</span>
              <ArrowUp size={24} className="exit-arrow" />
            </div>

          </div>
        ) : (
          /* Single Section View */
          <div className="slots-grid">
            {filteredSlots.map((slot) => (
              <button
                key={slot.id}
                onClick={() => handleSlotClick(slot)}
                disabled={slot.status !== 'available'}
                className={`slot-button slot-${slot.status} ${slot.hasCharging ? 'slot-has-charging' : ''}`}
                title={`Slot ${slot.number} - ${slot.status}${slot.hasCharging ? ' - EV Charging Available' : ''}`}
              >
                {slot.status === 'available' && (
                  <div className="slot-glow"></div>
                )}
                {slot.hasCharging && (
                  <Zap className="slot-charging-badge" size={12} />
                )}
                <div className="slot-content">
                  {getSlotIcon(slot.status)}
                  <span className="slot-number">{slot.number}</span>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Legend */}
        <div className="slots-legend">
          <div className="legend-item">
            <div className="legend-color legend-available"></div>
            <span>Available</span>
          </div>
          <div className="legend-item">
            <div className="legend-color legend-occupied"></div>
            <span>Occupied</span>
          </div>
          <div className="legend-item">
            <div className="legend-color legend-reserved"></div>
            <span>Reserved</span>
          </div>
          <div className="legend-item">
            <div className="legend-color legend-maintenance"></div>
            <span>Maintenance</span>
          </div>
          <div className="legend-item">
            <Zap size={16} className="legend-charging-icon" />
            <span>EV Charging</span>
          </div>
        </div>
      </div>

    </div>
  );
};

export default ParkingGrid;