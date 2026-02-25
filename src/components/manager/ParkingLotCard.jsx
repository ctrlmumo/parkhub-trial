import { Edit2, Trash2, Grid3x3, MapPin, Clock, DollarSign } from 'lucide-react';
import './ParkingLotCard.css';

const ParkingLotCard = ({ lot, onManageSlots, onEdit, onDelete }) => {
  
  /* Format operating hours */
  const formatHours = () => {
    if (lot.is_24_7) {
      return '24/7';
    }
    return `${lot.open_time || 'N/A'} - ${lot.close_time || 'N/A'}`;
  };

  return (
    <div className="parking-lot-card">
      {/* Card Header */}
      <div className="lot-card-header">
        <div className="lot-card-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="7" cy="17" r="2" stroke="currentColor" strokeWidth="2"/>
            <circle cx="17" cy="17" r="2" stroke="currentColor" strokeWidth="2"/>
          </svg>
        </div>
        <div className="lot-card-title-section">
          <h3 className="lot-card-title">{lot.name}</h3>
          <div className="lot-card-meta">
            <span className="lot-slots-badge">{lot.total_capacity} slots</span>
            <span className="lot-sections-badge">{lot.sections?.length || 0} sections</span>
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="lot-card-content">
        {/* Location */}
        <div className="lot-info-row">
          <MapPin size={16} className="info-icon" />
          <span className="info-text">{lot.location}</span>
        </div>

        {/* Operating Hours */}
        <div className="lot-info-row">
          <Clock size={16} className="info-icon" />
          <span className="info-text">{formatHours()}</span>
        </div>

        {/* Pricing */}
        <div className="lot-info-row">
          <DollarSign size={16} className="info-icon" />
          <span className="info-text">KES {lot.hourly_rate}/hour</span>
        </div>
      </div>

      {/* Card Actions */}
      <div className="lot-card-actions">
        <button 
          onClick={() => onManageSlots(lot)}
          className="btn-manage-slots"
        >
          <Grid3x3 size={18} />
          Manage Slots
        </button>

        <div className="lot-card-secondary-actions">
          <button 
            onClick={() => onEdit(lot)}
            className="btn-icon-action btn-edit"
            title="Edit lot"
          >
            <Edit2 size={18} />
          </button>

          <button 
            onClick={() => onDelete(lot)}
            className="btn-icon-action btn-delete"
            title="Delete lot"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ParkingLotCard;