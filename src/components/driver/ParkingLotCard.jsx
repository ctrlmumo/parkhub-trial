import { MapPin, Star, Clock, Shield, Camera, Zap, Navigation2 } from 'lucide-react';
import Button from '../common/Button';
import './ParkingLotCard.css';

const ParkingLotCard = ({ 
  lot, 
  isHovered, 
  isSelected,
  onHover, 
  onLeave, 
  onClick 
}) => {
  
  /* Get availability status and color */
  const getAvailabilityStatus = () => {
    const percentage = (lot.available / lot.total) * 100;
    
    if (percentage > 50) {
      return { label: 'High availability', color: 'high', icon: '🟢' };
    } else if (percentage >= 25) {
      return { label: 'Medium availability', color: 'medium', icon: '🟡' };
    } else {
      return { label: 'Low availability', color: 'low', icon: '🔴' };
    }
  };
  
  const availability = getAvailabilityStatus();
  const availabilityPercentage = (lot.available / lot.total) * 100;
  
  /* Get category badge */
  const getCategoryBadge = () => {
    const badges = {
      university: { icon: '🎓', label: 'University' },
      mall: { icon: '🛍️', label: 'Shopping Mall' },
      hospital: { icon: '🏥', label: 'Hospital' },
      office: { icon: '🏢', label: 'Office' },
      airport: { icon: '✈️', label: 'Airport' },
      hotel: { icon: '🏨', label: 'Hotel' },
    };
    
    return badges[lot.category] || { icon: '🅿️', label: 'Parking' };
  };
  
  const categoryBadge = getCategoryBadge();
  
  /* Get amenity icons */
  const getAmenityIcon = (amenity) => {
    const icons = {
      covered: <Shield size={14} />,
      cctv: <Camera size={14} />,
      ev_charging: <Zap size={14} />,
      '24_7': <Clock size={14} />,
    };
    
    const labels = {
      covered: 'Covered',
      cctv: 'CCTV',
      ev_charging: 'EV Charging',
      '24_7': '24/7',
    };
    
    return { icon: icons[amenity], label: labels[amenity] };
  };
  
  return (
    <div 
      id={`lot-card-${lot.id}`}
      className={`parking-lot-card ${isHovered ? 'hovered' : ''} ${isSelected ? 'selected' : ''}`}
      onMouseEnter={() => onHover(lot.id)}
      onMouseLeave={onLeave}
      onClick={() => onClick(lot.id)}
    >
      {/* Header: Category Badge */}
      <div className="lot-card-header">
        <div className="category-badge">
          <span>{categoryBadge.icon}</span>
          <span>{categoryBadge.label}</span>
        </div>
      </div>
      
      {/* Title */}
      <h3 className="lot-card-title">{lot.name}</h3>
      
      {/* Location & Distance */}
      <div className="lot-card-location">
        <MapPin size={16} />
        <span>{lot.distance}km away • {lot.location}</span>
      </div>
      
      {/* Availability Section */}
      <div className="availability-section">
        <div className="availability-header">
          <div className="availability-text">
            <span className="availability-icon">{availability.icon}</span>
            <span className="availability-count">
              {lot.available}/{lot.total} available
            </span>
            <span className={`availability-label ${availability.color}`}>
              ({Math.round(availabilityPercentage)}%)
            </span>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="availability-progress">
          <div 
            className={`progress-fill ${availability.color}`}
            style={{ width: `${availabilityPercentage}%` }}
          ></div>
        </div>
      </div>
      
      {/* Price & Rating */}
      <div className="lot-card-meta">
        <div className="meta-item">
          <span className="meta-label">💰</span>
          <span className="meta-value">KES {lot.hourlyRate}/hour</span>
        </div>
        <div className="meta-item">
          <Star size={14} fill="currentColor" />
          <span className="meta-value">
            {lot.rating} ({lot.reviewCount} reviews)
          </span>
        </div>
      </div>
      
      {/* Amenities */}
      {lot.amenities && lot.amenities.length > 0 && (
        <div className="lot-amenities">
          {lot.amenities.map(amenity => {
            const { icon, label } = getAmenityIcon(amenity);
            return (
              <div key={amenity} className="amenity-tag">
                {icon}
                <span>{label}</span>
              </div>
            );
          })}
        </div>
      )}
      
      {/* Hours */}
      <div className="lot-hours">
        <Clock size={14} />
        <span>{lot.hours}</span>
      </div>
      
      {/* CTA Button */}
      <Button
        variant="primary"
        size="md"
        fullWidth
        icon={<Navigation2 size={16} />}
        className="lot-cta-btn"
      >
        View Slots & Book
      </Button>
    </div>
  );
};

export default ParkingLotCard;