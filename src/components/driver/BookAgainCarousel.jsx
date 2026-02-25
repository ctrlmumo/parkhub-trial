import { MapPin, Clock } from 'lucide-react';
import { format } from 'date-fns';
import Button from '../common/Button';
import Card from '../common/Card';
import './BookAgainCarousel.css';

const BookAgainCarousel = ({ bookings, onSlotClick, onViewAllClick }) => {
  if (!bookings || bookings.length === 0) {
    return null;
  }

  return (
    <div className="carousel-section">
      <div className="carousel-header">
        <h2 className="carousel-title">Book Again</h2>
        <button className="carousel-view-all" onClick={onViewAllClick}>
          See All
        </button>
      </div>

      <div className="carousel-container">
        {bookings.map((booking) => (
          <Card key={booking.id} className="carousel-item">
            <div className="carousel-item-content">
              <h3 className="carousel-item-title" title={booking.name}>
                {booking.name}
              </h3>
              
              <div className="carousel-item-detail">
                <MapPin size={14} className="carousel-icon" />
                <span className="carousel-text truncate">{booking.location}</span>
              </div>
              
              <div className="carousel-item-detail">
                <Clock size={14} className="carousel-icon" />
                <span className="carousel-text">
                  {booking.lastVisited ? format(new Date(booking.lastVisited), 'MMM d') : 'Recently'}
                </span>
              </div>

              <Button
                variant="primary"
                size="sm"
                className="carousel-action-btn"
                onClick={() => onSlotClick(booking.slotId, booking.lotId, true)}
              >
                Book {booking.slotNumber}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BookAgainCarousel;