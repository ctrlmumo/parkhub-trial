/* Usage: <BookAgainCarousel onSlotClick={(slotId, lotId) => quickBook(slotId, lotId)} /> */

import { useState } from 'react';
import { History, ChevronLeft, ChevronRight, Calendar, MapPin } from 'lucide-react';
import { formatDate } from '../../utils/helpers';
import './BookAgainCarousel.css';

/**
 * BookAgainCarousel Component
 * 
 * @param {Function} onSlotClick - Callback when "Quick Book" is clicked
 * @param {Function} onViewAllClick - Callback when "See All" is clicked
 */
const BookAgainCarousel = ({ onSlotClick, onViewAllClick }) => {
  
  /* STATE MANAGEMENT */
  
  const [scrollPosition, setScrollPosition] = useState(0);
  
  /* MOCK DATA - Previous Bookings */
  
  const previousBookings = [
    {
      id: 1,
      slotNumber: 'A12',
      slotId: 12,
      lotId: 1,
      lotName: 'Main Campus Lot',
      lastBooked: '2026-01-15T10:00:00',
      bookingCount: 8, // How many times booked
      isFavorite: true,
      currentlyAvailable: true
    },
    {
      id: 2,
      slotNumber: 'B05',
      slotId: 25,
      lotId: 2,
      lotName: 'Library Parking',
      lastBooked: '2026-01-12T14:30:00',
      bookingCount: 5,
      isFavorite: false,
      currentlyAvailable: false
    },
    {
      id: 3,
      slotNumber: 'C03',
      slotId: 43,
      lotId: 1,
      lotName: 'Main Campus Lot',
      lastBooked: '2026-01-10T08:00:00',
      bookingCount: 12,
      isFavorite: true,
      currentlyAvailable: true
    },
    {
      id: 4,
      slotNumber: 'A07',
      slotId: 7,
      lotId: 3,
      lotName: 'Staff Lot',
      lastBooked: '2026-01-08T11:00:00',
      bookingCount: 3,
      isFavorite: false,
      currentlyAvailable: true
    },
    {
      id: 5,
      slotNumber: 'D12',
      slotId: 72,
      lotId: 1,
      lotName: 'Main Campus Lot',
      lastBooked: '2026-01-05T16:00:00',
      bookingCount: 6,
      isFavorite: false,
      currentlyAvailable: false
    },
    {
      id: 6,
      slotNumber: 'B08',
      slotId: 28,
      lotId: 2,
      lotName: 'Library Parking',
      lastBooked: '2026-01-03T09:30:00',
      bookingCount: 4,
      isFavorite: false,
      currentlyAvailable: true
    }
  ];
  
  /* SCROLL FUNCTIONS */
  
  /* Scroll carousel left */
  const scrollLeft = () => {
    const container = document.getElementById('book-again-scroll');
    if (container) {
      container.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };
  
  /* Scroll carousel right */
  const scrollRight = () => {
    const container = document.getElementById('book-again-scroll');
    if (container) {
      container.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };
  
  /* Handle quick book click */
  const handleQuickBook = (slotId, lotId, currentlyAvailable) => {
    if (onSlotClick) {
      onSlotClick(slotId, lotId, currentlyAvailable);
    }
  };
  
  /* RENDER */
  
  return (
    <section className="book-again-carousel">
      {/* Section Header */}
      <div className="carousel-header">
        <div className="carousel-title-group">
          <History className="carousel-icon" size={24} />
          <h2 className="carousel-title">Book Again</h2>
        </div>
        <button 
          className="carousel-view-all"
          onClick={onViewAllClick}
        >
          See All →
        </button>
      </div>
      
      {/* Carousel Container */}
      <div className="carousel-container">
        {/* Left Arrow */}
        <button 
          className="carousel-arrow carousel-arrow-left"
          onClick={scrollLeft}
          aria-label="Scroll left"
        >
          <ChevronLeft size={24} />
        </button>
        
        {/* Scrollable Content */}
        <div 
          id="book-again-scroll"
          className="carousel-scroll"
        >
          {previousBookings.map((booking) => (
            <div 
              key={booking.id}
              className="slot-card"
            >
              {/* Slot Badge */}
              <div className="slot-badge">
                <div className="slot-number-display">
                  <span className="slot-label">SLOT</span>
                  <span className="slot-number">{booking.slotNumber}</span>
                </div>
                
                {/* Favorite Star */}
                {booking.isFavorite && (
                  <div className="favorite-badge">
                    ⭐ Your go-to
                  </div>
                )}
              </div>
              
              {/* Slot Info */}
              <div className="slot-card-content">
                {/* Lot Name */}
                <div className="slot-info-row">
                  <MapPin size={16} className="slot-icon" />
                  <span className="slot-lot-name">{booking.lotName}</span>
                </div>
                
                {/* Last Booked */}
                <div className="slot-info-row">
                  <Calendar size={16} className="slot-icon" />
                  <span className="slot-date">
                    Last: {formatDate(booking.lastBooked)}
                  </span>
                </div>
                
                {/* Booking Count */}
                <p className="slot-booking-count">
                  Booked {booking.bookingCount} {booking.bookingCount === 1 ? 'time' : 'times'}
                </p>
                
                {/* Availability Status */}
                {booking.currentlyAvailable ? (
                  <div className="slot-status available">
                    <span className="status-dot"></span>
                    <span>Available now</span>
                  </div>
                ) : (
                  <div className="slot-status occupied">
                    <span className="status-dot"></span>
                    <span>Currently occupied</span>
                  </div>
                )}
                
                {/* Quick Book Button */}
                <button 
                  className={`slot-card-button ${!booking.currentlyAvailable ? 'disabled' : ''}`}
                  onClick={() => handleQuickBook(booking.slotId, booking.lotId, booking.currentlyAvailable)}
                  disabled={!booking.currentlyAvailable}
                >
                  {booking.currentlyAvailable ? 'Quick Book' : 'View Other Slots'}
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {/* Right Arrow */}
        <button 
          className="carousel-arrow carousel-arrow-right"
          onClick={scrollRight}
          aria-label="Scroll right"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </section>
  );
};

export default BookAgainCarousel;