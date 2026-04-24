import api from '../../services/api'
import { useState, useRef, useEffect } from 'react';
import { X, MapPin, Grid3x3, Hash, DollarSign, Clock } from 'lucide-react';
import './CreateLotModal.css';

const CreateLotModal = ({ onClose, onLotCreated }) => {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    locationDetails: null,
    sections: 4,
    slotsPerSection: 20,
    hourlyRate: 50,
    is24_7: true,
    openTime: '08:00',
    closeTime: '18:00'
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const locationInputRef = useRef(null);
  const autocompleteRef = useRef(null);

  const [isSearchingLocation, setIsSearchingLocation] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

/* Real-time OpenStreetMap Autocomplete (Photon API) */
  useEffect(() => {
    const fetchSuggestions = async () => {
      // Only search if user has typed at least 3 characters and the dropdown is active
      if (!formData.location || formData.location.length < 3 || !showSuggestions) {
        setSuggestions([]);
        return;
      }

      setIsSearchingLocation(true);
      
      try {
        // Query Photon API, biasing results towards Nairobi (lat=-1.29&lon=36.82)
        const searchQuery = encodeURIComponent(formData.location);
        const response = await fetch(`https://photon.komoot.io/api/?q=${searchQuery}&limit=5&lat=-1.2921&lon=36.8219`);
        const data = await response.json();

        if (data && data.features) {
          const formattedSuggestions = data.features.map(f => {
            const props = f.properties;
            // Build a readable address string (e.g., "Westgate Mall, Westlands, Nairobi")
            const addressParts = [props.name, props.street, props.city || props.town].filter(Boolean);
            
            return {
              id: props.osm_id,
              displayName: addressParts.join(', '),
              lat: f.geometry.coordinates[1], // GeoJSON returns [lng, lat]
              lng: f.geometry.coordinates[0],
              type: props.osm_value
            };
          }).filter(s => s.displayName); // Remove empty results

          // Remove duplicates based on the display name
          const uniqueSuggestions = Array.from(new Map(formattedSuggestions.map(item => [item.displayName, item])).values());
          
          setSuggestions(uniqueSuggestions);
        }
      } catch (error) {
        console.error("Autocomplete failed:", error);
      } finally {
        setIsSearchingLocation(false);
      }
    };

    // Debounce: Wait 400ms after the user stops typing before making the API call
    const delayDebounceFn = setTimeout(() => {
      fetchSuggestions();
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [formData.location, showSuggestions]);

  // Handle clicking a dropdown suggestion
  const handleSuggestionSelect = (suggestion) => {
    setFormData(prev => ({
      ...prev,
      location: suggestion.displayName,
      locationDetails: {
        lat: suggestion.lat,
        lng: suggestion.lng
      }
    }));
    setShowSuggestions(false); // Hide the dropdown
    setSuggestions([]); // Clear suggestions
    
    if (errors.location) {
      setErrors(prev => ({ ...prev, location: '' }));
    }
  };

  /* Handle input change */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  /**
   * Handle manual location input (when Google Maps not available)
   */
  const handleLocationChange = (e) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      location: value
    }));
    
    if (errors.location) {
      setErrors(prev => ({ ...prev, location: '' }));
    }
  };

  /**
   * Validate form
   */
  const validate = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Parking lot name is required';
    }
    
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }
    
    if (formData.sections < 1 || formData.sections > 26) {
      newErrors.sections = 'Sections must be between 1 and 26';
    }
    
    if (formData.slotsPerSection < 1 || formData.slotsPerSection > 100) {
      newErrors.slotsPerSection = 'Slots per section must be between 1 and 100';
    }
    
    if (formData.hourlyRate < 10) {
      newErrors.hourlyRate = 'Hourly rate must be at least KES 10';
    }
    
    if (!formData.is24_7) {
      if (!formData.openTime) {
        newErrors.openTime = 'Opening time is required';
      }
      if (!formData.closeTime) {
        newErrors.closeTime = 'Closing time is required';
      }
      if (formData.openTime && formData.closeTime && formData.openTime >= formData.closeTime) {
        newErrors.closeTime = 'Closing time must be after opening time';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle form submit
   */
  /**
   * Handle form submit - DYNAMIC
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }
    
    setLoading(true);
    
    try {
      // 1. Prepare payload for the Parking Lot
      const lotPayload = {
        name: formData.name,
        location: formData.location,
        total_capacity: parseInt(formData.sections) * parseInt(formData.slotsPerSection),
        hourly_rate: parseFloat(formData.hourlyRate),
        is_24_7: formData.is24_7,
        open_time: formData.is24_7 ? null : formData.openTime,
        close_time: formData.is24_7 ? null : formData.closeTime,
        latitude: formData.locationDetails?.lat || null,
        longitude: formData.locationDetails?.lng || null,
        is_active: true
      };

      // 2. Create the Parking Lot in Django
      const lotResponse = await api.post('/parking-lots/', lotPayload);
      const createdLot = lotResponse.data;

      // 3. Automated Slot Generation
      // Loop through sections and slots to create them in the database
      const slotPromises = [];
      
      for (let i = 0; i < formData.sections; i++) {
        const sectionLabel = String.fromCharCode(65 + i); // Converts 0 to 'A', 1 to 'B', etc.
        
        for (let j = 1; j <= formData.slotsPerSection; j++) {
          const slotNumber = `${sectionLabel}${j.toString().padStart(2, '0')}`; // e.g., 'A01'
          
          slotPromises.push(
            api.post('/parking-slots/', {
              parking_lot: createdLot.id,
              slot_number: slotNumber,
              section: sectionLabel,
              status: 'available',
              is_ev_charging: false, // Defaulting to false, manager can edit later
              is_disabled_friendly: false
            })
          );
        }
      }

      // Wait for all slots to finish creating
      await Promise.all(slotPromises);

      // 4. Close modal and trigger parent refresh
      onLotCreated(createdLot);

    } catch (error) {
      console.error("Failed to create lot or slots:", error);
      
      // Check if Django sent back specific validation errors
      const errorMsg = error.response?.data?.message 
        || error.response?.data?.detail 
        || "Failed to create parking lot. Please try again.";
        
      setErrors(prev => ({ ...prev, submit: errorMsg }));
    } finally {
      setLoading(false);
    }
  };

  /**
   * Calculate total slots
   */
  const totalSlots = formData.sections * formData.slotsPerSection;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="create-lot-modal" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="modal-header">
          <div>
            <h2 className="modal-title">Create Parking Lot</h2>
            <p className="modal-subtitle">Add a new parking lot to your management</p>
          </div>
          <button onClick={onClose} className="modal-close" aria-label="Close">
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="modal-form">
          
          {/* Lot Name */}
          <div className="form-group">
            <label className="form-label">
              Parking Lot Name <span className="required">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Main Campus Parking"
              className={`form-input ${errors.name ? 'error' : ''}`}
            />
            {errors.name && <p className="error-message">{errors.name}</p>}
          </div>

      {/* Location (Real-time OSM Autocomplete) */}
          <div className="form-group" style={{ position: 'relative' }}>
            <label className="form-label">
              <MapPin size={16} />
              Location Address <span className="required">*</span>
            </label>
            <div className="autocomplete-wrapper">
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={(e) => {
                  handleLocationChange(e);
                  setShowSuggestions(true); // Open dropdown when typing
                  // Wipe old coordinates if they start typing a new location
                  setFormData(prev => ({ ...prev, locationDetails: null })); 
                }}
                placeholder="e.g., Westgate Mall, Westlands"
                className={`form-input ${errors.location ? 'error' : ''}`}
                autoComplete="off"
              />
              
              {/* The "Uber-like" Dropdown */}
              {showSuggestions && (formData.location.length >= 3) && (
                <ul className="suggestions-dropdown">
                  {isSearchingLocation ? (
                    <li className="suggestion-item loading">Searching...</li>
                  ) : suggestions.length > 0 ? (
                    suggestions.map((suggestion, index) => (
                      <li 
                        key={`${suggestion.id}-${index}`} 
                        className="suggestion-item"
                        onClick={() => handleSuggestionSelect(suggestion)}
                      >
                        <MapPin size={14} className="suggestion-icon" />
                        <span>{suggestion.displayName}</span>
                      </li>
                    ))
                  ) : (
                    <li className="suggestion-item empty">No results found</li>
                  )}
                </ul>
              )}
            </div>
            
            {/* Show a green checkmark if valid coordinates are locked in */}
            {formData.locationDetails && !showSuggestions && (
              <p className="form-hint" style={{ color: '#22c55e', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                ✓ Coordinates locked
              </p>
            )}
            {errors.location && <p className="error-message">{errors.location}</p>}
          </div>

          {/* Grid Configuration */}
          <div className="form-row">
            {/* Number of Sections */}
            <div className="form-group">
              <label className="form-label">
                <Grid3x3 size={16} />
                Number of Sections <span className="required">*</span>
              </label>
              <input
                type="number"
                name="sections"
                value={formData.sections}
                onChange={handleChange}
                min="1"
                max="26"
                className={`form-input ${errors.sections ? 'error' : ''}`}
              />
              <p className="form-hint">1-26 sections (A, B, C...)</p>
              {errors.sections && <p className="error-message">{errors.sections}</p>}
            </div>

            {/* Slots per Section */}
            <div className="form-group">
              <label className="form-label">
                <Hash size={16} />
                Slots per Section <span className="required">*</span>
              </label>
              <input
                type="number"
                name="slotsPerSection"
                value={formData.slotsPerSection}
                onChange={handleChange}
                min="1"
                max="100"
                className={`form-input ${errors.slotsPerSection ? 'error' : ''}`}
              />
              <p className="form-hint">1-100 slots per section</p>
              {errors.slotsPerSection && <p className="error-message">{errors.slotsPerSection}</p>}
            </div>
          </div>

          {/* Total Slots Preview */}
          <div className="total-slots-preview">
            <span className="preview-label">Total Slots:</span>
            <span className="preview-value">{totalSlots} slots</span>
          </div>

          {/* Hourly Rate */}
          <div className="form-group">
            <label className="form-label">
              <DollarSign size={16} />
              Price per Hour (KES) <span className="required">*</span>
            </label>
            <input
              type="number"
              name="hourlyRate"
              value={formData.hourlyRate}
              onChange={handleChange}
              min="10"
              step="10"
              className={`form-input ${errors.hourlyRate ? 'error' : ''}`}
            />
            {errors.hourlyRate && <p className="error-message">{errors.hourlyRate}</p>}
          </div>

          {/* Operating Hours */}
          <div className="form-group">
            <label className="form-label">
              <Clock size={16} />
              Operating Hours <span className="required">*</span>
            </label>
            
            {/* 24/7 Toggle */}
            <label className="toggle-option">
              <input
                type="radio"
                name="is24_7"
                checked={formData.is24_7}
                onChange={() => setFormData(prev => ({ ...prev, is24_7: true }))}
              />
              <span className="toggle-label">24/7 (Open All Day)</span>
            </label>

            <label className="toggle-option">
              <input
                type="radio"
                name="is24_7"
                checked={!formData.is24_7}
                onChange={() => setFormData(prev => ({ ...prev, is24_7: false }))}
              />
              <span className="toggle-label">Select Time Range</span>
            </label>

            {/* Custom Time Range */}
            {!formData.is24_7 && (
              <div className="time-range-inputs">
                <div className="time-input-group">
                  <label className="time-label">Opens at:</label>
                  <input
                    type="time"
                    name="openTime"
                    value={formData.openTime}
                    onChange={handleChange}
                    className={`time-input ${errors.openTime ? 'error' : ''}`}
                  />
                  {errors.openTime && <p className="error-message">{errors.openTime}</p>}
                </div>

                <div className="time-input-group">
                  <label className="time-label">Closes at:</label>
                  <input
                    type="time"
                    name="closeTime"
                    value={formData.closeTime}
                    onChange={handleChange}
                    className={`time-input ${errors.closeTime ? 'error' : ''}`}
                  />
                  {errors.closeTime && <p className="error-message">{errors.closeTime}</p>}
                </div>
              </div>
            )}
          </div>

          {/* Submit Error Banner */}
          {errors.submit && (
            <div style={{ color: '#ef4444', backgroundColor: '#fef2f2', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1rem', fontSize: '0.875rem' }}>
              {errors.submit}
            </div>
          )}
          
          {/* Form Actions */}
          <div className="modal-actions">
            <button
              type="button"
              onClick={onClose}
              className="btn-cancel"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="loading-spinner-small"></span>
                  Creating...
                </>
              ) : (
                'Create Parking Lot'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateLotModal;