import { useState, useEffect } from 'react';
import { MapPin, ChevronLeft, ChevronRight, Navigation } from 'lucide-react';
import api from '../../services/api';
import './NearYouCarousel.css';

const NearYouCarousel = ({ onLotClick, onViewAllClick }) => {
  const [nearbyLots, setNearbyLots] = useState([]);

  // Fetch real parking lots from Django
  useEffect(() => {
    const fetchLots = async () => {
      try {
        const response = await api.get('/parking-lots/');
        const formattedLots = response.data.map((lot, index) => ({
          id: lot.id,
          name: lot.name,
          location: lot.location,
          distance: (1.2 + (index * 0.5)).toFixed(1), // Mocking distance for now (fixed after implementing Maps API)
          available: lot.total_capacity, 
          total: lot.total_capacity,
          hourlyRate: lot.hourly_rate,
          rating: 4.5
        }));
        setNearbyLots(formattedLots);
      } catch (error) {
        console.error("Error fetching lots:", error);
      }
    };
    
    fetchLots();
  }, []);
  
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