import { useState } from 'react';
import { Search, MapPin, DollarSign, SlidersHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './DashboardSearchBar.css';

const DashboardSearchBar = () => {
  const navigate = useNavigate();
  
  /* STATE MANAGEMENT */
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlace, setSelectedPlace] = useState('all');
  const [selectedPrice, setSelectedPrice] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  
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
  
  /* HANDLERS */
  
  /* Handle search bar click - Redirect to Find Parking page */
  const handleSearchClick = () => {
    // Build query params from current filters
    const params = new URLSearchParams();
    
    if (searchQuery) params.append('q', searchQuery);
    if (selectedPlace !== 'all') params.append('place', selectedPlace);
    if (selectedPrice !== 'all') params.append('price', selectedPrice);
    
    // Navigate to Find Parking with params
    const queryString = params.toString();
    navigate(`/driver/find-parking${queryString ? `?${queryString}` : ''}`);
  };
  
  /* Handle Enter key in search input */
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearchClick();
    }
  };
  
  /* Toggle filter visibility */
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  
  /* Clear all filters */
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedPlace('all');
    setSelectedPrice('all');
  };
  
  /* Check if any filters are active */
  const hasActiveFilters = () => {
    return searchQuery || selectedPlace !== 'all' || selectedPrice !== 'all';
  };
  
  /* RENDER */
  
  return (
    <div className="dashboard-search-section">
      {/* Main Search Bar */}
      <div className="search-bar-container">
        {/* Search Icon */}
        <Search className="search-icon" size={20} />
        
        {/* Search Input */}
        <input
          type="text"
          className="search-input"
          placeholder="Find Parking - Search by location, name, or address..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        
        {/* Filter Toggle Button */}
        <button 
          className={`filter-toggle-btn ${showFilters ? 'active' : ''}`}
          onClick={toggleFilters}
          type="button"
        >
          <SlidersHorizontal size={20} />
          <span>Filters</span>
          {hasActiveFilters() && <span className="filter-badge"></span>}
        </button>
        
        {/* Search Button */}
        <button 
          className="search-submit-btn"
          onClick={handleSearchClick}
          type="button"
        >
          Search
        </button>
      </div>
      
      {/* Filters Panel (Collapsible) */}
      {showFilters && (
        <div className="filters-panel">
          <div className="filters-grid">
            {/* Place Filter */}
            <div className="filter-group">
              <label className="filter-label">
                <MapPin size={16} />
                <span>Place Type</span>
              </label>
              <select 
                className="filter-select"
                value={selectedPlace}
                onChange={(e) => setSelectedPlace(e.target.value)}
              >
                {placeOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Price Filter */}
            <div className="filter-group">
              <label className="filter-label">
                <DollarSign size={16} />
                <span>Price Range</span>
              </label>
              <select 
                className="filter-select"
                value={selectedPrice}
                onChange={(e) => setSelectedPrice(e.target.value)}
              >
                {priceOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Filter Actions */}
          {hasActiveFilters() && (
            <div className="filter-actions">
              <button 
                className="clear-filters-btn"
                onClick={clearFilters}
                type="button"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      )}
      
      {/* Quick Filter Pills (Optional - shows active filters) */}
      {hasActiveFilters() && !showFilters && (
        <div className="active-filters-pills">
          {searchQuery && (
            <span className="filter-pill">
              <Search size={14} />
              {searchQuery}
              <button onClick={() => setSearchQuery('')}>×</button>
            </span>
          )}
          {selectedPlace !== 'all' && (
            <span className="filter-pill">
              <MapPin size={14} />
              {placeOptions.find(p => p.value === selectedPlace)?.label}
              <button onClick={() => setSelectedPlace('all')}>×</button>
            </span>
          )}
          {selectedPrice !== 'all' && (
            <span className="filter-pill">
              <DollarSign size={14} />
              {priceOptions.find(p => p.value === selectedPrice)?.label}
              <button onClick={() => setSelectedPrice('all')}>×</button>
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default DashboardSearchBar;