import { useState } from 'react';
import { MapPin, ChevronLeft, ChevronRight, Navigation } from 'lucide-react';
import './NearYouCarousel.css';

/**
 * NearYouCarousel Component
 * 
 * @param {Function} onLotClick - Callback when a lot card is clicked
 * @param {Function} onViewAllClick - Callback when "See All" is clicked
 */
const NearYouCarousel = ({ onLotClick, onViewAllClick }) => {
  
  /* STATE MANAGEMENT */
  
  const [scrollPosition, setScrollPosition] = useState(0);
  
  /* MOCK DATA - Nearby Parking Lots */
  
  const nearbyLots = [
    {
      id: 1,
      name: 'Main Campus Lot',
      location: 'Catholic University of Eastern Africa',
      distance: 0.8, // km
      available: 24,
      total: 80,
      hourlyRate: 50,
      image: '/images/lots/main-campus.jpg',
      rating: 4.5
    },
    {
      id: 2,
      name: 'Library Parking',
      location: 'Library Block',
      distance: 1.2,
      available: 15,
      total: 40,
      hourlyRate: 60,
      image: '/images/lots/library.jpg',
      rating: 4.3
    },
    {
      id: 3,
      name: 'Staff Lot',
      location: 'Administration Block',
      distance: 1.5,
      available: 8,
      total: 30,
      hourlyRate: 40,
      image: '/images/lots/staff.jpg',
      rating: 4.7
    },
    {
      id: 4,
      name: 'Downtown Plaza',
      location: 'Afya Center',
      distance: 2.1,
      available: 45,
      total: 100,
      hourlyRate: 80,
      image: '/images/lots/downtown.jpg',
      rating: 4.6
    },
    {
      id: 5,
      name: 'Sarit Center',
      location: 'Westlands',
      distance: 3.5,
      available: 67,
      total: 150,
      hourlyRate: 70,
      image: '/images/lots/mall.jpg',
      rating: 4.4
    },
    {
      id: 6,
      name: 'Hospital Parking',
      location: 'Karen Hospital',
      distance: 4.2,
      available: 12,
      total: 50,
      hourlyRate: 55,
      image: '/images/lots/hospital.jpg',
      rating: 4.2
    }
  ];
  
  /* SCROLL FUNCTIONS */
  
  /* Scroll carousel left */
  const scrollLeft = () => {
    const container = document.getElementById('near-you-scroll');
    if (container) {
      container.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };
  
  /* Scroll carousel right */
  const scrollRight = () => {
    const container = document.getElementById('near-you-scroll');
    if (container) {
      container.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };
  
  /* Handle lot card click */
  const handleLotClick = (lotId) => {
    if (onLotClick) {
      onLotClick(lotId);
    }
  };
  
  /* Get availability status color */
  const getAvailabilityColor = (available, total) => {
    const percentage = (available / total) * 100;
    if (percentage > 50) return 'high'; // Green
    if (percentage > 25) return 'medium'; // Amber
    return 'low'; // Red
  };
  
  /* RENDER */
  
  return (
    <section className="near-you-carousel">
      {/* Section Header */}
      <div className="carousel-header">
        <div className="carousel-title-group">
          <MapPin className="carousel-icon" size={24} />
          <h2 className="carousel-title">Near You</h2>
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
          id="near-you-scroll"
          className="carousel-scroll"
        >
          {nearbyLots.map((lot) => (
            <div 
              key={lot.id}
              className="lot-card"
              onClick={() => handleLotClick(lot.id)}
            >
              {/* Lot Image */}
              <div className="lot-card-image">
                {/* Placeholder gradient instead of image */}
                <div className="lot-image-placeholder">
                  <Navigation size={32} strokeWidth={1.5} />
                </div>
                
                {/* Distance Badge */}
                <div className="lot-distance-badge">
                  <MapPin size={14} />
                  <span>{lot.distance} km</span>
                </div>
              </div>
              
              {/* Lot Info */}
              <div className="lot-card-content">
                <h3 className="lot-card-name">{lot.name}</h3>
                <p className="lot-card-location">{lot.location}</p>
                
                {/* Availability */}
                <div className={`lot-card-availability ${getAvailabilityColor(lot.available, lot.total)}`}>
                  <span className="availability-dot"></span>
                  <span>{lot.available}/{lot.total} available</span>
                </div>
                
                {/* Price */}
                <p className="lot-card-price">KES {lot.hourlyRate}/hour</p>
                
                {/* View Button */}
                <button className="lot-card-button">
                  View Slots →
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

export default NearYouCarousel;