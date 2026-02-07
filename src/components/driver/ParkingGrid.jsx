/* Displays parking availability with stats, filters, and slot selection */

import { useState, useEffect } from 'react';
import { CircleCheck, Car, Clock, Wrench } from 'lucide-react';
import './ParkingGrid.css';

const ParkingGrid = ({ onSlotSelect }) => {
  
  // State
  const [slots, setSlots] = useState([]);
  const [stats, setStats] = useState({
    available: 0,
    occupied: 0,
    reserved: 0,
    maintenance: 0
  });
  const [selectedSection, setSelectedSection] = useState('all');
  const [filteredSlots, setFilteredSlots] = useState([]);

  // Sections
  const sections = ['all', 'A', 'B', 'C', 'D'];

  /**
   * Load parking slots on mount
   * TODO: Replace with actual API call
   */
  useEffect(() => {
    // Mock data for demonstration
    const mockSlots = [];
    const sections = ['A', 'B', 'C', 'D'];
    const statuses = ['available', 'occupied', 'reserved', 'maintenance'];
    
    sections.forEach(section => {
      for (let i = 1; i <= 20; i++) {
        const slotNum = `${section}${i.toString().padStart(2, '0')}`;
        // Randomize status for demo
        const statusIndex = Math.floor(Math.random() * statuses.length);
        mockSlots.push({
          id: slotNum,
          number: slotNum,
          section: section,
          status: statuses[statusIndex],
          rate: 50 
        });
      }
    });

    setSlots(mockSlots);
  }, []);

  /* Calculate stats when slots change */
  useEffect(() => {
    const newStats = {
      available: slots.filter(s => s.status === 'available').length,
      occupied: slots.filter(s => s.status === 'occupied').length,
      reserved: slots.filter(s => s.status === 'reserved').length,
      maintenance: slots.filter(s => s.status === 'maintenance').length
    };
    setStats(newStats);
  }, [slots]);

  /* Filter slots by section */
  useEffect(() => {
    if (selectedSection === 'all') {
      setFilteredSlots(slots);
    } else {
      setFilteredSlots(slots.filter(s => s.section === selectedSection));
    }
  }, [selectedSection, slots]);

  /* Handle slot click */
  const handleSlotClick = (slot) => {
    if (slot.status === 'available') {
      onSlotSelect(slot);
    }
  };

  /* Get slot icon based on status */
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

      {/* Slots Grid */}
      <div className="slots-container">
        <div className="slots-header">
          <h3 className="slots-title">Select Your Parking Slot</h3>
          <p className="slots-subtitle">
            {selectedSection === 'all' 
              ? 'Showing all available parking slots'
              : `Showing Section ${selectedSection} parking slots`
            }
          </p>
        </div>

        <div className="slots-grid">
          {filteredSlots.map((slot) => (
            <button
              key={slot.id}
              onClick={() => handleSlotClick(slot)}
              disabled={slot.status !== 'available'}
              className={`slot-button slot-${slot.status}`}
              title={`Slot ${slot.number} - ${slot.status}`}
            >
              {/* Pulse glow overlay for available slots */}
              {slot.status === 'available' && (
                <div className="slot-glow"></div>
              )}
              
              {/* Slot Content */}
              <div className="slot-content">
                {getSlotIcon(slot.status)}
                <span className="slot-number">{slot.number}</span>
              </div>
            </button>
          ))}
        </div>

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
        </div>
      </div>

    </div>
  );
};

export default ParkingGrid;