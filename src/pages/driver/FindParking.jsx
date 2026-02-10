/**
 * ParkHub - Find Parking Page
 * 
 * Uber-inspired split-view interface:
 * - Left: Results list (40%)
 * - Right: Google Maps (60%)
 * - Mobile: Stacked layout (map top, list bottom)
 * 
 * Features:
 * - Search by specific place or category
 * - Real-time availability updates
 * - Interactive map with markers
 * - Map ↔ List synchronization
 * - Filters and sorting
 */

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  Search, 
  MapPin, 
  DollarSign, 
  SlidersHorizontal,
  X,
  Navigation,
  Star,
  Clock,
  Shield,
  Zap,
  Camera
} from 'lucide-react';
import Navbar from '../../components/common/Navbar';
import Button from '../../components/common/Button';
import GoogleMap from '../../components/driver/GoogleMap';
import ParkingLotCard from '../../components/driver/ParkingLotCard';
import './FindParking.css';

const FindParking = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  /* STATE MANAGEMENT */
  
  // Search & Filters
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedPlace, setSelectedPlace] = useState(searchParams.get('place') || 'all');
  const [selectedPrice, setSelectedPrice] = useState(searchParams.get('price') || 'all');
  const [selectedAvailability, setSelectedAvailability] = useState('all');
  const [minRating, setMinRating] = useState('all');
  const [amenities, setAmenities] = useState([]);
  const [sortBy, setSortBy] = useState('distance'); // distance, price, availability, rating
  
  // UI State
  const [showFilters, setShowFilters] = useState(false);
  const [isMapCollapsed, setIsMapCollapsed] = useState(false); // Mobile only
  const [hoveredLotId, setHoveredLotId] = useState(null);
  const [selectedLotId, setSelectedLotId] = useState(null);
  
  // Data
  const [parkingLots, setParkingLots] = useState([]);
  const [filteredLots, setFilteredLots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  
  /* FILTER OPTIONS */
  
  const placeOptions = [
    { value: 'all', label: 'All Places' },
    { value: 'university', label: 'University' },
    { value: 'mall', label: 'Shopping Mall' },
    { value: 'hospital', label: 'Hospital' },
    { value: 'office', label: 'Office Building' },
    { value: 'airport', label: 'Airport' },
    { value: 'hotel', label: 'Hotel' },
  ];
  
  const priceOptions = [
    { value: 'all', label: 'Any Price' },
    { value: '0-50', label: 'Under KES 50/hr' },
    { value: '50-100', label: 'KES 50-100/hr' },
    { value: '100-150', label: 'KES 100-150/hr' },
    { value: '150+', label: 'KES 150+/hr' },
  ];
  
  const availabilityOptions = [
    { value: 'all', label: 'Any Availability' },
    { value: 'high', label: 'High (>50%)' },
    { value: 'medium', label: 'Medium (25-50%)' },
    { value: 'low', label: 'Low (<25%)' },
  ];
  
  const ratingOptions = [
    { value: 'all', label: 'Any Rating' },
    { value: '4', label: '4+ Stars' },
    { value: '3', label: '3+ Stars' },
  ];
  
  const amenityOptions = [
    { value: 'covered', label: 'Covered', icon: Shield },
    { value: 'cctv', label: 'CCTV', icon: Camera },
    { value: 'ev_charging', label: 'EV Charging', icon: Zap },
    { value: '24_7', label: '24/7 Access', icon: Clock },
  ];
  
  /* MOCK DATA - TODO: Replace with API calls */
  
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockLots = [
        {
          id: 1,
          name: 'Main Campus Parking Lot',
          location: 'University Way, Nairobi',
          category: 'university',
          coordinates: { lat: -1.2841, lng: 36.8155 },
          distance: 0.8, // km from user
          available: 24,
          total: 80,
          hourlyRate: 50,
          rating: 4.3,
          reviewCount: 89,
          amenities: ['covered', 'cctv', '24_7'],
          hours: 'Open 24/7',
          image: null,
        },
        {
          id: 2,
          name: 'Library Parking',
          location: 'Library Road, Nairobi',
          category: 'university',
          coordinates: { lat: -1.2821, lng: 36.8175 },
          distance: 1.2,
          available: 15,
          total: 50,
          hourlyRate: 40,
          rating: 4.5,
          reviewCount: 124,
          amenities: ['cctv', '24_7'],
          hours: 'Open 24/7',
          image: null,
        },
        {
          id: 3,
          name: 'Westgate Mall Parking',
          location: 'Westlands, Nairobi',
          category: 'mall',
          coordinates: { lat: -1.2676, lng: 36.8062 },
          distance: 2.1,
          available: 120,
          total: 200,
          hourlyRate: 60,
          rating: 4.7,
          reviewCount: 456,
          amenities: ['covered', 'cctv', 'ev_charging'],
          hours: '8:00 AM - 10:00 PM',
          image: null,
        },
        {
          id: 4,
          name: 'Downtown Business Center',
          location: 'CBD, Nairobi',
          category: 'office',
          coordinates: { lat: -1.2864, lng: 36.8172 },
          distance: 1.5,
          available: 8,
          total: 40,
          hourlyRate: 80,
          rating: 4.1,
          reviewCount: 67,
          amenities: ['covered', 'cctv', '24_7', 'ev_charging'],
          hours: 'Open 24/7',
          image: null,
        },
        {
          id: 5,
          name: 'Kenyatta Hospital Parking',
          location: 'Hospital Road, Nairobi',
          category: 'hospital',
          coordinates: { lat: -1.3000, lng: 36.8073 },
          distance: 2.8,
          available: 45,
          total: 150,
          hourlyRate: 30,
          rating: 3.9,
          reviewCount: 203,
          amenities: ['covered', 'cctv', '24_7'],
          hours: 'Open 24/7',
          image: null,
        },
        {
          id: 6,
          name: 'Sarit Centre Parking',
          location: 'Westlands, Nairobi',
          category: 'mall',
          coordinates: { lat: -1.2627, lng: 36.8021 },
          distance: 2.5,
          available: 85,
          total: 300,
          hourlyRate: 50,
          rating: 4.4,
          reviewCount: 892,
          amenities: ['covered', 'cctv'],
          hours: '8:00 AM - 10:00 PM',
          image: null,
        },
      ];
      
      setParkingLots(mockLots);
      setLoading(false);
    }, 1000);
    
    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          // Default to Nairobi center
          setUserLocation({ lat: -1.2921, lng: 36.8219 });
        }
      );
    } else {
      setUserLocation({ lat: -1.2921, lng: 36.8219 });
    }
  }, []);
  
  /* FILTERING & SORTING LOGIC */
  
  useEffect(() => {
    let filtered = [...parkingLots];
    
    // Search query filter
    if (searchQuery) {
      filtered = filtered.filter(lot =>
        lot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lot.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Place/Category filter
    if (selectedPlace !== 'all') {
      filtered = filtered.filter(lot => lot.category === selectedPlace);
    }
    
    // Price filter
    if (selectedPrice !== 'all') {
      const [min, max] = selectedPrice.split('-').map(p => p === '+' ? Infinity : parseInt(p));
      filtered = filtered.filter(lot => {
        if (max === undefined) return lot.hourlyRate >= min;
        return lot.hourlyRate >= min && lot.hourlyRate <= max;
      });
    }
    
    // Availability filter
    if (selectedAvailability !== 'all') {
      filtered = filtered.filter(lot => {
        const percentage = (lot.available / lot.total) * 100;
        if (selectedAvailability === 'high') return percentage > 50;
        if (selectedAvailability === 'medium') return percentage >= 25 && percentage <= 50;
        if (selectedAvailability === 'low') return percentage < 25;
        return true;
      });
    }
    
    // Rating filter
    if (minRating !== 'all') {
      filtered = filtered.filter(lot => lot.rating >= parseFloat(minRating));
    }
    
    // Amenities filter
    if (amenities.length > 0) {
      filtered = filtered.filter(lot =>
        amenities.every(amenity => lot.amenities.includes(amenity))
      );
    }
    
    // Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'distance':
          return a.distance - b.distance;
        case 'price':
          return a.hourlyRate - b.hourlyRate;
        case 'availability':
          return (b.available / b.total) - (a.available / a.total);
        case 'rating':
          return b.rating - a.rating;
        default:
          return 0;
      }
    });
    
    setFilteredLots(filtered);
  }, [parkingLots, searchQuery, selectedPlace, selectedPrice, selectedAvailability, minRating, amenities, sortBy]);
  
  /* HANDLERS */
  
  const handleSearch = () => {
    // Update URL params
    const params = new URLSearchParams();
    if (searchQuery) params.append('q', searchQuery);
    if (selectedPlace !== 'all') params.append('place', selectedPlace);
    if (selectedPrice !== 'all') params.append('price', selectedPrice);
    setSearchParams(params);
  };
  
  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedPlace('all');
    setSelectedPrice('all');
    setSelectedAvailability('all');
    setMinRating('all');
    setAmenities([]);
    setSearchParams({});
  };
  
  const handleAmenityToggle = (amenity) => {
    setAmenities(prev =>
      prev.includes(amenity)
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };
  
  const handleLotClick = (lotId) => {
    navigate(`/driver/lot/${lotId}`);
  };
  
  const handleLotHover = (lotId) => {
    setHoveredLotId(lotId);
  };
  
  const handleLotLeave = () => {
    setHoveredLotId(null);
  };
  
  const handleMarkerClick = useCallback((lotId) => {
    setSelectedLotId(lotId);
    // Scroll to card in list
    const card = document.getElementById(`lot-card-${lotId}`);
    if (card) {
      card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, []);
  
  const hasActiveFilters = () => {
    return searchQuery || 
           selectedPlace !== 'all' || 
           selectedPrice !== 'all' ||
           selectedAvailability !== 'all' ||
           minRating !== 'all' ||
           amenities.length > 0;
  };
  
  /* RENDER */
  
  return (
    <div className="find-parking-page">
      <Navbar />
      
      <div className="find-parking-layout">
        {/* ===== LEFT SIDE: SEARCH & RESULTS LIST ===== */}
        <div className="results-section">
          {/* Search Bar */}
          <div className="search-header">
            <div className="search-bar-find">
              <Search className="search-icon" size={20} />
              <input
                type="text"
                className="search-input-find"
                placeholder="Search by location, name, or address..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              {searchQuery && (
                <button 
                  className="clear-search-btn"
                  onClick={() => setSearchQuery('')}
                >
                  <X size={18} />
                </button>
              )}
            </div>
            
            {/* Filter Toggle & Search Button */}
            <div className="search-actions">
              <button 
                className={`filter-toggle ${showFilters ? 'active' : ''}`}
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal size={18} />
                <span>Filters</span>
                {hasActiveFilters() && <span className="filter-dot"></span>}
              </button>
              
              <Button
                variant="primary"
                size="sm"
                onClick={handleSearch}
                icon={<Search size={16} />}
              >
                Search
              </Button>
            </div>
          </div>
          
          {/* Filter Panel */}
          {showFilters && (
            <div className="filters-panel-find">
              <div className="filters-grid-find">
                {/* Place Filter */}
                <div className="filter-group-find">
                  <label className="filter-label-find">
                    <MapPin size={16} />
                    <span>Place Type</span>
                  </label>
                  <select 
                    value={selectedPlace}
                    onChange={(e) => setSelectedPlace(e.target.value)}
                    className="filter-select-find"
                  >
                    {placeOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                
                {/* Price Filter */}
                <div className="filter-group-find">
                  <label className="filter-label-find">
                    <DollarSign size={16} />
                    <span>Price Range</span>
                  </label>
                  <select 
                    value={selectedPrice}
                    onChange={(e) => setSelectedPrice(e.target.value)}
                    className="filter-select-find"
                  >
                    {priceOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                
                {/* Availability Filter */}
                <div className="filter-group-find">
                  <label className="filter-label-find">
                    <span>Availability</span>
                  </label>
                  <select 
                    value={selectedAvailability}
                    onChange={(e) => setSelectedAvailability(e.target.value)}
                    className="filter-select-find"
                  >
                    {availabilityOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                
                {/* Rating Filter */}
                <div className="filter-group-find">
                  <label className="filter-label-find">
                    <Star size={16} />
                    <span>Min Rating</span>
                  </label>
                  <select 
                    value={minRating}
                    onChange={(e) => setMinRating(e.target.value)}
                    className="filter-select-find"
                  >
                    {ratingOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              {/* Amenities */}
              <div className="amenities-filter">
                <label className="filter-label-find">Amenities</label>
                <div className="amenities-grid">
                  {amenityOptions.map(amenity => {
                    const Icon = amenity.icon;
                    return (
                      <button
                        key={amenity.value}
                        className={`amenity-chip ${amenities.includes(amenity.value) ? 'active' : ''}`}
                        onClick={() => handleAmenityToggle(amenity.value)}
                      >
                        <Icon size={14} />
                        <span>{amenity.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
              
              {/* Sort By */}
              <div className="sort-section">
                <label className="filter-label-find">Sort By</label>
                <div className="sort-options">
                  {[
                    { value: 'distance', label: 'Distance' },
                    { value: 'price', label: 'Price' },
                    { value: 'availability', label: 'Availability' },
                    { value: 'rating', label: 'Rating' },
                  ].map(option => (
                    <button
                      key={option.value}
                      className={`sort-option ${sortBy === option.value ? 'active' : ''}`}
                      onClick={() => setSortBy(option.value)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Clear Filters */}
              {hasActiveFilters() && (
                <button className="clear-all-btn" onClick={handleClearFilters}>
                  Clear All Filters
                </button>
              )}
            </div>
          )}
          
          {/* Results Count */}
          <div className="results-header">
            <h2 className="results-title">
              {loading ? 'Loading...' : `${filteredLots.length} Parking Lots Found`}
            </h2>
          </div>
          
          {/* Results List */}
          <div className="results-list">
            {loading ? (
              // Loading skeletons
              [1, 2, 3].map(i => (
                <div key={i} className="lot-card-skeleton">
                  <div className="skeleton-header"></div>
                  <div className="skeleton-line"></div>
                  <div className="skeleton-line short"></div>
                </div>
              ))
            ) : filteredLots.length === 0 ? (
              // No results
              <div className="no-results">
                <Search size={48} />
                <h3>No parking lots found</h3>
                <p>Try adjusting your filters or search query</p>
                {hasActiveFilters() && (
                  <Button variant="outline" onClick={handleClearFilters}>
                    Clear Filters
                  </Button>
                )}
              </div>
            ) : (
              // Results
              filteredLots.map(lot => (
                <ParkingLotCard
                  key={lot.id}
                  lot={lot}
                  isHovered={hoveredLotId === lot.id}
                  isSelected={selectedLotId === lot.id}
                  onHover={handleLotHover}
                  onLeave={handleLotLeave}
                  onClick={handleLotClick}
                />
              ))
            )}
          </div>
        </div>
        
        {/* ===== RIGHT SIDE: GOOGLE MAP ===== */}
        <div className={`map-section ${isMapCollapsed ? 'collapsed' : ''}`}>
          <GoogleMap
            lots={filteredLots}
            userLocation={userLocation}
            hoveredLotId={hoveredLotId}
            selectedLotId={selectedLotId}
            searchQuery={searchQuery}
            onMarkerClick={handleMarkerClick}
          />
        </div>
      </div>
    </div>
  );
};

export default FindParking;